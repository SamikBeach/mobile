import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Toast from 'react-native-toast-message';
import { useComposedRef } from '@/hooks/useComposedRef';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface Props {
  textInputRef?: React.RefObject<TextInput>;
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialContent?: string;
  replyToUser?: { nickname: string } | null;
  showAvatar?: boolean;
  isReplying?: boolean;
}

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

export function CommentEditor({
  textInputRef,
  onSubmit,
  onCancel,
  initialContent,
  replyToUser,
  showAvatar = true,
  isReplying = false,
}: Props) {
  const [text, setText] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const currentUser = useCurrentUser();
  const inputRef = useRef<TextInput>(null);
  const borderProgress = useSharedValue(0);
  const composedRef = useComposedRef(textInputRef, inputRef);

  useEffect(() => {
    if (isReplying) {
      borderProgress.value = 0;
      borderProgress.value = withTiming(1, {
        duration: 3000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }
  }, [isReplying, borderProgress]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      borderProgress.value,
      [0, 0.5, 1],
      [colors.gray[200], colors.gray[900], colors.gray[200]],
    ),
    borderWidth: 1.5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.gray[50],
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    minHeight: 40,
  }));

  useEffect(() => {
    if (initialContent) {
      try {
        const parsedContent: LexicalContent = JSON.parse(initialContent);
        const children = parsedContent.root.children?.[0]?.children;
        if (!children) return;

        const extractedMentions: string[] = [];
        let fullText = '';

        children.forEach((node: LexicalNode) => {
          if (node.type === 'mention') {
            extractedMentions.push(node.text || '');
            fullText += `@${node.text} `;
          } else if (node.type === 'text') {
            fullText += node.text || '';
          }
        });

        setMentions(extractedMentions);
        setText(fullText);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } catch (error) {
        console.warn('Failed to parse initial content:', error);
      }
    } else if (replyToUser) {
      setText(`@${replyToUser.nickname} `);
      setMentions([replyToUser.nickname]);
    }
  }, [initialContent, replyToUser]);

  const handleTextChange = (newText: string) => {
    if (newText.length < text.length && mentions.length > 0) {
      const lastMention = mentions[mentions.length - 1];
      const mentionText = `@${lastMention}`;

      if (text.trim() === mentionText && newText.length < mentionText.length) {
        setText('');
        setMentions([]);
        if (!isEditMode) {
          onCancel();
        }
        return;
      }
    }
    setText(newText);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;

    const lexicalContent: LexicalContent = {
      root: {
        children: [
          {
            children: [
              ...mentions.map((mention, index) => ({
                type: 'mention',
                text: mention,
                key: `mention-${index}`,
              })),
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: text.replace(new RegExp(`@(${mentions.join('|')})\\s`, 'g'), '').trim(),
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

    onSubmit(JSON.stringify(lexicalContent));
    setText('');
    setMentions([]);
    Toast.show({
      type: 'success',
      text1: '댓글이 등록되었습니다.',
    });
  };

  const handleCancel = () => {
    setText('');
    onCancel();
  };

  const isEditMode = Boolean(initialContent);

  return (
    <View style={styles.container}>
      {showAvatar && currentUser && (
        <View style={styles.avatarContainer}>
          <UserAvatar user={currentUser} size="sm" />
        </View>
      )}
      <Animated.View style={animatedInputStyle}>
        <TextInput
          ref={composedRef}
          style={styles.input}
          placeholder={currentUser ? '댓글을 입력하세요.' : '로그인 후 댓글을 작성할 수 있습니다.'}
          placeholderTextColor={colors.gray[400]}
          value={text}
          onChangeText={handleTextChange}
          multiline
          maxLength={1000}
          editable={Boolean(currentUser)}
        />
        {replyToUser && !isEditMode && (
          <Pressable onPress={handleCancel} hitSlop={8} style={styles.closeButton}>
            <Icon name="x" size={16} color={colors.gray[500]} />
          </Pressable>
        )}
      </Animated.View>
      <View style={styles.buttonContainer}>
        {isEditMode && (
          <Pressable style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </Pressable>
        )}
        <Pressable
          style={[
            styles.submitButton,
            (!text.trim() || !currentUser) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!text.trim() || !currentUser}>
          <Text
            style={[
              styles.submitButtonText,
              (!text.trim() || !currentUser) && styles.submitButtonTextDisabled,
            ]}>
            등록
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'white',
  },
  avatarContainer: {
    marginTop: 4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.gray[50],
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    minHeight: 40,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[900],
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 20,
    maxHeight: 120,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  cancelButtonText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  submitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: colors.gray[900],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[200],
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  submitButtonTextDisabled: {
    color: colors.gray[400],
  },
});
