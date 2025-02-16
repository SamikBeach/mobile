import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, spacing } from '@/styles/theme';
import { Button } from '@/components/common/Button';
import { useQuery, useMutation } from '@tanstack/react-query';
import { reviewApi } from '@/apis/review';
import { useReviewQueryData } from '@/hooks/useReviewQueryData';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Toast from 'react-native-toast-message';
import { BookInfo } from './BookInfo';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionSheet, Action } from '@/components/common/ActionSheet/ActionSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'WriteReview'>;

interface LexicalNode {
  children?: LexicalNode[];
  text?: string;
  type: string;
  format?: number;
  style?: string;
  textFormat?: number;
  textStyle?: string;
  key?: string;
  mode?: string;
  detail?: number;
  version?: number;
  direction?: string;
  indent?: number;
}

interface LexicalContent {
  root: LexicalNode;
}

const TERMS_AGREED_KEY = 'review_terms_agreed';

function parseLexicalContent(node: LexicalNode): string {
  if (node.type === 'text') {
    return node.text || '';
  }

  if (node.children) {
    return node.children.map(child => parseLexicalContent(child)).join('\n');
  }

  return '';
}

export function WriteReviewScreen({ route, navigation }: Props) {
  const { bookId, reviewId } = route.params;
  const currentUser = useCurrentUser();
  const { createReviewDataQueryData, updateReviewDataQueryData } = useReviewQueryData();
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [showTermsSheet, setShowTermsSheet] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data: reviewData } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => reviewApi.getReviewDetail(reviewId!),
    enabled: !!reviewId,
  });

  const createLexicalContent = (text: string): string => {
    const lexicalContent: LexicalContent = {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: text.trim(),
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: 0,
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: 0,
        indent: 0,
        type: 'root',
        version: 1,
      },
    };

    return JSON.stringify(lexicalContent);
  };

  const { mutate: updateReview, isPending: isUpdatePending } = useMutation({
    mutationFn: () =>
      reviewApi.updateReview(reviewId!, {
        title,
        content: createLexicalContent(content),
      }),
    onSuccess: response => {
      updateReviewDataQueryData({
        reviewId: reviewId!,
        bookId,
        updatedReview: response,
      });
      Toast.show({ type: 'success', text1: '리뷰가 수정되었습니다.' });
      navigation.goBack();
    },
    onError: () => {
      Toast.show({ type: 'error', text1: '리뷰 수정에 실패했습니다.' });
    },
  });

  const { mutate: createReview, isPending: isCreatePending } = useMutation({
    mutationFn: () =>
      reviewApi.createReview(bookId, {
        title,
        content: createLexicalContent(content),
      }),
    onSuccess: response => {
      if (currentUser) {
        createReviewDataQueryData({
          bookId,
          newReview: response.data,
          currentUser,
        });
      }
      Toast.show({ type: 'success', text1: '리뷰가 작성되었습니다.' });
      navigation.goBack();
    },
    onError: () => {
      Toast.show({ type: 'error', text1: '리뷰 작성에 실패했습니다.' });
    },
  });

  const checkUnsavedChanges = useCallback(() => {
    const hasChanges = title.trim() !== '' || content.trim() !== '';
    if (!hasChanges) return Promise.resolve(true);

    return new Promise(resolve => {
      Alert.alert(
        '작성 중인 내용이 있습니다',
        '페이지를 나가면 작성 중인 내용이 모두 사라집니다. 정말 나가시겠습니까?',
        [
          { text: '취소', style: 'cancel', onPress: () => resolve(false) },
          {
            text: '나가기',
            style: 'destructive',
            onPress: () => resolve(true),
          },
        ],
      );
    });
  }, [title, content]);

  const handleCancel = useCallback(async () => {
    const shouldGoBack = await checkUnsavedChanges();
    if (shouldGoBack) {
      navigation.goBack();
    }
  }, [navigation, checkUnsavedChanges]);

  const handleAgreeTerms = async () => {
    setShowTermsSheet(false);
    await AsyncStorage.setItem(TERMS_AGREED_KEY, 'true');
    setHasAgreedToTerms(true);
    if (reviewId) {
      updateReview();
    } else {
      createReview();
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: '제목을 입력해주세요.' });
      return;
    }

    if (!content.trim()) {
      Toast.show({ type: 'error', text1: '내용을 입력해주세요.' });
      return;
    }

    if (!hasAgreedToTerms) {
      setShowTermsSheet(true);
      return;
    }

    if (reviewId) {
      updateReview();
    } else {
      createReview();
    }
  };

  useEffect(() => {
    if (reviewData) {
      setTitle(reviewData.data.title);
      try {
        const parsedContent: LexicalContent = JSON.parse(reviewData.data.content);
        const plainText = parseLexicalContent(parsedContent.root);
        setContent(plainText.trim());
      } catch (error) {
        console.warn('Failed to parse review content:', error);
        setContent('');
      }
    }
  }, [reviewData]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={handleCancel} hitSlop={8} style={{ marginLeft: spacing.sm }}>
          <Icon name="chevron-left" size={24} color={colors.gray[900]} />
        </Pressable>
      ),
    });
  }, [navigation, handleCancel]);

  const actions: Action[] = [
    {
      text: '동의하고 제출하기',
      icon: 'check',
      onPress: handleAgreeTerms,
    },
  ];

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.formContainer}>
              <BookInfo bookId={bookId} />
              <TextInput
                style={styles.titleInput}
                placeholder="제목"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
              <TextInput
                style={styles.contentInput}
                placeholder="내용을 입력하세요..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                maxFontSizeMultiplier={1}
              />
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleCancel}
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}>
                취소
              </Button>
              <Button
                onPress={handleSubmit}
                disabled={isCreatePending || isUpdatePending}
                style={styles.submitButton}
                textStyle={styles.submitButtonText}>
                {isCreatePending || isUpdatePending
                  ? '제출 중...'
                  : reviewId
                  ? '수정하기'
                  : '제출하기'}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <ActionSheet
        visible={showTermsSheet}
        onClose={() => setShowTermsSheet(false)}
        title="이용 약관 동의"
        customContent={
          <View style={styles.termsContent}>
            <Text style={styles.termsText}>
              • 사용자는 다른 사용자를 존중해야 하며, 혐오 발언이나 차별적인 내용을 게시할 수
              없습니다.{'\n'}• 불법적이거나 유해한 콘텐츠는 엄격히 금지됩니다.{'\n'}• 저작권을
              침해하는 콘텐츠는 게시할 수 없습니다.{'\n'}• 스팸이나 광고성 콘텐츠는 제한됩니다.
              {'\n\n'}위 내용에 동의하시면 '동의하고 계속하기'를 눌러주세요.
            </Text>
          </View>
        }
        actions={actions}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  formContainer: {
    flex: 1,
    gap: spacing.md,
    paddingBottom: 100,
  },
  titleInput: {
    fontSize: 16,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    color: colors.gray[900],
    height: 48,
  },
  contentInput: {
    height: Dimensions.get('window').height * 0.5,
    fontSize: 15,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    color: colors.gray[900],
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: 48,
  },
  cancelButtonText: {
    color: colors.gray[500],
    fontSize: 15,
    fontWeight: '500',
  },
  submitButton: {
    flex: 2,
    backgroundColor: colors.gray[900],
    height: 48,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  termsContent: {
    padding: spacing.lg,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[700],
  },
});
