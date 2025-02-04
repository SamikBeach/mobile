import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
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

type Props = NativeStackScreenProps<RootStackParamList, 'WriteReview'>;

export function WriteReviewScreen({ route, navigation }: Props) {
  const { bookId, reviewId } = route.params;
  const currentUser = useCurrentUser();
  const { createReviewDataQueryData, updateReviewDataQueryData } = useReviewQueryData();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data: reviewData } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => reviewApi.getReviewDetail(reviewId!),
    enabled: !!reviewId,
  });

  useEffect(() => {
    if (reviewData) {
      setTitle(reviewData.data.title);
      setContent(reviewData.data.content);
    }
  }, [reviewData]);

  const { mutate: updateReview, isPending: isUpdatePending } = useMutation({
    mutationFn: () => reviewApi.updateReview(reviewId!, { title, content }),
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
    mutationFn: () => reviewApi.createReview(bookId, { title, content }),
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

  const checkUnsavedChanges = () => {
    const hasChanges = title.trim() !== '' || content.trim() !== '';
    if (!hasChanges) return false;

    return new Promise((resolve) => {
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
  };

  const handleCancel = async () => {
    const shouldGoBack = await checkUnsavedChanges();
    if (shouldGoBack) {
      navigation.goBack();
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

    if (reviewId) {
      updateReview();
    } else {
      createReview();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.content}>
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
        />
      </View>
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
            {isCreatePending || isUpdatePending ? '제출 중...' : reviewId ? '수정하기' : '제출하기'}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
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
    flex: 1,
    fontSize: 15,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    color: colors.gray[900],
  },
  footer: {
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
});
