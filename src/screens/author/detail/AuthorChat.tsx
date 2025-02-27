import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { Text } from '@/components/common/Text';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/apis/ai';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { ChatMessage } from '@/types/common';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

interface Props {
  authorId: number;
  authorName: string;
}

export function AuthorChat({ authorId, authorName }: Props) {
  const currentUser = useCurrentUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<TextInput>(null);

  // 작가가 바뀌면 대화 내용 초기화
  useEffect(() => {
    setChatHistory([]);
    setIsTyping(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [authorId]);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && chatHistory.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory.length]);

  // 채팅 기록이 변경될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, scrollToBottom]);

  // 컴포넌트가 마운트되면 입력창에 포커스
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (userMessage: string) => {
      // 이전 요청이 있다면 중단
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 새 AbortController 생성
      abortControllerRef.current = new AbortController();

      try {
        // 사용자 메시지 추가
        const newUserMessage: ChatMessage = {
          role: 'user',
          content: userMessage,
        };

        // 채팅 기록 업데이트 (사용자 메시지만)
        setChatHistory(prev => [...prev, newUserMessage]);

        // 입력 필드 초기화
        setMessage('');

        // 키보드 닫기
        Keyboard.dismiss();

        // 타이핑 효과 시작
        setIsTyping(true);

        // API 호출
        const response = await aiApi.chatWithAuthor(
          authorId,
          {
            message: userMessage,
            conversationHistory: chatHistory,
          },
          abortControllerRef.current.signal,
        );

        // AI 응답 추가
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.response,
        };

        // 채팅 기록 업데이트 (AI 응답 추가)
        setChatHistory(prev => [...prev, aiMessage]);

        // 타이핑 효과 종료
        setIsTyping(false);

        return response;
      } catch (error) {
        // 요청이 중단된 경우
        if (error instanceof Error && (error.name === 'AbortError' || axios.isCancel(error))) {
          // 타이핑 효과 종료
          setIsTyping(false);

          // 중단 메시지 추가
          const cancelMessage: ChatMessage = {
            role: 'assistant',
            content: '응답이 중단되었습니다.',
          };

          setChatHistory(prev => [...prev, cancelMessage]);
          return null;
        }

        // 기타 오류
        throw error;
      } finally {
        abortControllerRef.current = null;
      }
    },
    onError: () => {
      // 오류 메시지 표시
      setChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        },
      ]);

      // 타이핑 효과 종료
      setIsTyping(false);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }

    sendMessage(message);
  };

  const handleStopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleRetry = () => {
    if (chatHistory.length >= 2) {
      const lastUserMessage = [...chatHistory].reverse().find(msg => msg.role === 'user');

      if (lastUserMessage) {
        // 마지막 AI 응답 제거
        setChatHistory(prev => prev.slice(0, prev.length - 1));

        // 다시 요청
        sendMessage(lastUserMessage.content);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        {chatHistory.length === 0 ? (
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>
              {authorName}에게 질문을 해보세요.{'\n'}
              작품, 철학, 사상 등에 대해 물어볼 수 있습니다.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={chatHistory}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.role === 'user' ? styles.userMessage : styles.aiMessage,
                ]}>
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            )}
            contentContainerStyle={styles.messageList}
            onLayout={scrollToBottom}
          />
        )}

        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={styles.typingIndicator}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSendMessage}
          placeholder={`${authorName}에게 질문하기...`}
          placeholderTextColor={colors.gray[400]}
          multiline
          maxLength={1000}
          editable={!isPending}
        />
        <View style={styles.buttonContainer}>
          {isPending ? (
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStopResponse}>
              <Icon name="stop-circle" size={20} color={colors.red[500]} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.sendButton, !message.trim() && styles.disabledButton]}
              onPress={handleSendMessage}
              disabled={!message.trim()}>
              <Icon name="send" size={20} color={colors.white} />
            </TouchableOpacity>
          )}

          {chatHistory.length > 0 && !isPending && (
            <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={handleRetry}>
              <Icon name="refresh-cw" size={20} color={colors.blue[600]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[50],
    overflow: 'hidden',
  },
  chatContainer: {
    height: 400,
    padding: spacing.md,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChatText: {
    textAlign: 'center',
    color: colors.gray[500],
    fontSize: 14,
  },
  messageList: {
    paddingBottom: spacing.md,
  },
  messageContainer: {
    maxWidth: '85%',
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.blue[100],
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  messageText: {
    fontSize: 14,
    color: colors.gray[800],
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
    padding: spacing.xs,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[400],
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
    color: colors.gray[900],
  },
  buttonContainer: {
    marginLeft: spacing.sm,
    gap: spacing.xs,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: colors.blue[600],
  },
  stopButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.red[200],
  },
  retryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue[200],
  },
  disabledButton: {
    backgroundColor: colors.gray[300],
  },
});
