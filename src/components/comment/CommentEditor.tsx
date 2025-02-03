import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Keyboard } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialContent?: string;
  replyToUser?: { nickname: string } | null;
  showAvatar?: boolean;
}

export function CommentEditor({
  onSubmit,
  onCancel,
  initialContent = '',
  replyToUser,
  showAvatar = true,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (replyToUser) {
      setContent(`@${replyToUser.nickname} `);
    }
  }, [replyToUser]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
    Keyboard.dismiss();
  };

  const handleCancel = () => {
    setContent('');
    onCancel?.();
  };

  return (
    <View style={styles.container}>
      {showAvatar && currentUser && <UserAvatar user={currentUser} size="sm" />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="댓글을 입력하세요..."
          value={content}
          onChangeText={setContent}
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
        style={[styles.submitButton, !content.trim() && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!content.trim()}>
        <Text style={[styles.submitButtonText, !content.trim() && styles.submitButtonTextDisabled]}>
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
});
