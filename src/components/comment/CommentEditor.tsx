import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialContent?: string;
  replyToUser: { nickname: string } | null;
  showAvatar?: boolean;
}

export function CommentEditor({ onSubmit, onCancel, replyToUser, showAvatar = true }: Props) {
  const [text, setText] = useState('');
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (replyToUser) {
      setText(`@${replyToUser.nickname} `);
    }
  }, [replyToUser]);

  const handleSubmit = () => {
    if (!text.trim()) return;

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
                text: replyToUser ? ' ' + text : text,
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

  return (
    <View style={styles.container}>
      {showAvatar && currentUser && <UserAvatar user={currentUser} size="sm" />}
      <View style={styles.inputContainer}>
        {replyToUser && <Text style={styles.mention}>@{replyToUser.nickname}</Text>}
        <TextInput
          style={[styles.input, replyToUser && styles.inputWithMention]}
          placeholder={!replyToUser ? '댓글을 입력하세요.' : undefined}
          value={replyToUser ? text.replace(`@${replyToUser.nickname} `, '') : text}
          onChangeText={newText => {
            setText(replyToUser ? `@${replyToUser.nickname} ${newText}` : newText);
          }}
          multiline
          maxLength={1000}
          placeholderTextColor={colors.gray[400]}
        />
        {replyToUser && (
          <Pressable onPress={handleCancel} hitSlop={8} style={styles.cancelButton}>
            <Icon name="x" size={16} color={colors.gray[500]} />
          </Pressable>
        )}
      </View>
      <Pressable
        style={[styles.submitButton, !text.trim() && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!text.trim()}>
        <Text style={[styles.submitButtonText, !text.trim() && styles.submitButtonTextDisabled]}>
          등록
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 6,
    minHeight: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[900],
    padding: 0,
    maxHeight: 100,
  },
  cancelButton: {
    padding: 4,
    marginLeft: 4,
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
