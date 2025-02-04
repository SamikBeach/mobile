import React, { useState, useEffect, useRef } from 'react';
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
import Toast from 'react-native-toast-message';

interface Props {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialContent?: string;
  replyToUser?: { nickname: string } | null;
  showAvatar?: boolean;
  autoFocus?: boolean;
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
  onSubmit,
  onCancel,
  initialContent,
  replyToUser,
  showAvatar = true,
  autoFocus = false,
}: Props) {
  const [text, setText] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const currentUser = useCurrentUser();
  const inputRef = useRef<TextInput>(null);

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
          } else if (node.type === 'text') {
            fullText += node.text || '';
          }
        });

        setMentions(extractedMentions);
        setText(fullText);

        // 수정 모드 진입 시 포커스
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

  useEffect(() => {
    if (autoFocus || replyToUser) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus, replyToUser]);

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (
      mentions.length > 0 &&
      e.nativeEvent.key === 'Backspace' &&
      !text.replace(new RegExp(`@(${mentions.join('|')})\\s`, 'g'), '').trim()
    ) {
      setText('');
      3;
      setMentions([]);
      if (!isEditMode) {
        onCancel();
      }
    }
  };

  const handleTextChange = (newText: string) => {
    if (replyToUser) {
      const mentionText = `@${replyToUser.nickname} `;

      if (newText.length < text.length && !newText) {
        setText('');
        setMentions([]);
        if (!isEditMode) {
          onCancel();
        }
        return;
      }

      setText(mentionText + newText);
    } else {
      setText(newText);
    }
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
                text: ` ${text.trim()}`,
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

  const displayText = text.replace(new RegExp(`@(${mentions.join('|')})\\s`, 'g'), '');

  return (
    <View style={[styles.container, !isEditMode && styles.fixedContainer]}>
      {showAvatar && currentUser && <UserAvatar user={currentUser} size="sm" />}
      <View style={styles.inputContainer}>
        {mentions.map((mention, index) => (
          <Text key={`mention-${index}`} style={styles.mention}>
            @{mention}
          </Text>
        ))}
        <TextInput
          ref={inputRef}
          style={[styles.input, mentions.length > 0 && styles.inputWithMention]}
          placeholder={!replyToUser ? '댓글을 입력하세요.' : undefined}
          value={displayText}
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
