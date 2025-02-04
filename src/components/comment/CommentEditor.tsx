import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialContent?: string;
  replyToUser?: { nickname: string } | null;
  showAvatar?: boolean;
}

export function CommentEditor({
  onSubmit,
  onCancel,
  initialContent,
  replyToUser,
  showAvatar = true,
}: Props) {
  const [text, setText] = useState('');
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (initialContent) {
      try {
        const parsedContent = JSON.parse(initialContent);
        const textContent = parsedContent.root.children[0].children
          .map((node: any) => (node.type === 'text' ? node.text : ''))
          .join('');
        setText(textContent);
      } catch (error) {
        console.warn('Failed to parse initial content:', error);
      }
    } else if (replyToUser) {
      setText(`@${replyToUser.nickname} `);
    }
  }, [initialContent, replyToUser]);

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (
      replyToUser &&
      e.nativeEvent.key === 'Backspace' &&
      !text.substring(text.indexOf(' ') + 1)
    ) {
      setText('');
      onCancel();
    }
  };

  const handleTextChange = (newText: string) => {
    if (replyToUser) {
      const mentionText = `@${replyToUser.nickname} `;
      setText(mentionText + newText);
    } else {
      setText(newText);
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) return;

    const textWithoutMention = replyToUser ? text.replace(`@${replyToUser.nickname} `, '') : text;

    const lexicalContent = {
      root: {
        children: [
          {
            children: [
              ...(replyToUser
                ? [
                    {
                      type: 'mention',
                      text: replyToUser.nickname,
                      key: '1',
                    },
                  ]
                : []),
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: textWithoutMention,
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    };

    onSubmit(JSON.stringify(lexicalContent));
    setText('');
  };

  const handleCancel = () => {
    setText('');
    onCancel();
  };

  const isEditMode = Boolean(initialContent);

  return (
    <View style={[styles.container, !isEditMode && styles.fixedContainer]}>
      {showAvatar && currentUser && <UserAvatar user={currentUser} size="sm" />}
      <View style={styles.inputContainer}>
        {replyToUser && <Text style={styles.mention}>@{replyToUser.nickname}</Text>}
        <TextInput
          style={[styles.input, replyToUser && styles.inputWithMention]}
          placeholder={!replyToUser ? '댓글을 입력하세요.' : undefined}
          value={replyToUser ? text.substring(text.indexOf(' ') + 1) : text}
          onChangeText={handleTextChange}
          onKeyPress={handleKeyPress}
          multiline
          maxLength={1000}
          placeholderTextColor={colors.gray[400]}
        />
        {replyToUser && !isEditMode && (
          <Pressable onPress={handleCancel} hitSlop={8} style={styles.closeButton}>
            <Icon name="x" size={16} color={colors.gray[500]} />
          </Pressable>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {isEditMode && (
          <Pressable style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.submitButton, !text.trim() && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!text.trim()}>
          <Text style={[styles.submitButtonText, !text.trim() && styles.submitButtonTextDisabled]}>
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
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
  },
  fixedContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 6,
    minHeight: 40,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[900],
    padding: 0,
    maxHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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
  mention: {
    color: '#3B82F6',
    fontSize: 14,
  },
  inputWithMention: {
    paddingLeft: 4,
  },
});
