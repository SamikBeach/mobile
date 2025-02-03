import React, { useState } from 'react';
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

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {showAvatar && currentUser && <UserAvatar user={currentUser} size="sm" />}
      <View style={styles.inputContainer}>
        {replyToUser && (
          <View style={styles.replyBadge}>
            <Text style={styles.replyText}>@{replyToUser.nickname}</Text>
            <Pressable onPress={onCancel}>
              <Icon name="x" size={14} color={colors.gray[500]} />
            </Pressable>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="댓글을 입력하세요..."
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={1000}
        />
        <Pressable
          style={[styles.submitButton, !content.trim() && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!content.trim()}>
          <Text
            style={[styles.submitButtonText, !content.trim() && styles.submitButtonTextDisabled]}>
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
    gap: 12,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  inputContainer: {
    flex: 1,
    gap: 8,
  },
  replyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  replyText: {
    fontSize: 12,
    color: colors.gray[600],
  },
  input: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: 12,
    minHeight: 40,
    maxHeight: 120,
    fontSize: 14,
    color: colors.gray[900],
  },
  submitButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[300],
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
