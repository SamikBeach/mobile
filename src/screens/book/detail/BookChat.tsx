import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/common/Text';
import { useMutation } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { ChatMessage } from '@/types/common';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';

interface Props {
  bookId: number;
  bookTitle: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function BookChat({ bookId, bookTitle }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // 애니메이션 값
  const opacity = useSharedValue(0.5);

  // 애니메이션 설정
  useEffect(() => {
    if (isGenerating) {
      opacity.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.ease }), -1, true);
    } else {
      opacity.value = 0.5;
    }
  }, [isGenerating, opacity]);

  // 책이 바뀌면 대화 내용 초기화
  useEffect(() => {
    setMessages([]);
    setIsGenerating(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [bookId]);

  // 키보드가 나타날 때 스크롤 조정
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollToBottom();
    });

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  // 메시지가 추가될 때마다 스크롤 조정
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (userMessage: string) => {
      setIsGenerating(true);

      // 사용자 메시지 추가
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
      };
      setMessages(prev => [...prev, userMsg]);
      setMessage('');

      // 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 새 요청 생성
      abortControllerRef.current = new AbortController();

      // 대화 기록 생성
      const conversationHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // API 요청
      const response = await bookApi.chatWithBook(
        bookId,
        {
          message: userMessage,
          conversationHistory,
        },
        abortControllerRef.current.signal,
      );

      return response.data;
    },
    onSuccess: data => {
      // AI 응답 추가
      const assistantMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsGenerating(false);
      abortControllerRef.current = null;
    },
    onError: error => {
      if (!axios.isCancel(error)) {
        // 취소된 요청이 아닌 경우에만 에러 처리
        const errorMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다. 다시 시도해주세요.',
        };
        setMessages(prev => [...prev, errorMsg]);
      }
      setIsGenerating(false);
      abortControllerRef.current = null;
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || isGenerating) return;
    sendMessage(message.trim());
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={true}>
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              "{bookTitle}"에 대해 질문해보세요.{'\n'}
              책의 내용, 주제, 등장인물 등에 대해 물어볼 수 있습니다.
            </Text>
          </View>
        ) : (
          messages.map(msg => (
            <Animated.View
              key={msg.id}
              entering={FadeIn.duration(300)}
              style={[
                styles.messageContainer,
                msg.role === 'user'
                  ? styles.userMessageContainer
                  : styles.assistantMessageContainer,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                ]}>
                {msg.content}
              </Text>
            </Animated.View>
          ))
        )}

        {isGenerating && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[
              styles.messageContainer,
              styles.assistantMessageContainer,
              styles.typingContainer,
            ]}>
            <View style={styles.typingIndicator}>
              {[0, 1, 2].map(index => (
                <Animated.View key={index} style={styles.typingDot} />
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={`${bookTitle}에 대해 질문하기...`}
          placeholderTextColor={colors.gray[400]}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          onSubmitEditing={handleSendMessage}
          editable={!isGenerating}
        />
        {isGenerating ? (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={handleStopGeneration}
            activeOpacity={0.8}>
            <Icon name="x" size={20} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.disabledButton]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
            activeOpacity={0.8}>
            <Icon name="send" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500],
    lineHeight: 22,
  },
  messageContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.blue[500],
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gray[100],
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.white,
  },
  assistantMessageText: {
    color: colors.gray[800],
  },
  typingContainer: {
    padding: spacing.sm,
    minHeight: 40,
    justifyContent: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[400],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.gray[900],
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue[500],
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.blue[700],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.red[500],
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.red[700],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  disabledButton: {
    backgroundColor: colors.gray[300],
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
