import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
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
  text: string;
  isUser: boolean;
}

export function BookChat({ bookId, bookTitle }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
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

  // 메시지가 추가될 때마다 스크롤 아래로 이동
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // 컴포넌트가 마운트되면 입력창에 포커스
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  // 채팅 생성 뮤테이션
  const { mutate: sendMessage } = useMutation({
    mutationFn: async (userMessage: string) => {
      // API 요청 변경
      const response = await bookApi.chatWithBook(
        bookId,
        {
          message: userMessage,
          conversationHistory: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text,
          })),
        },
        abortControllerRef.current?.signal
      );

      return response.data;
    },
    onSuccess: response => {
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
      };
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), text: aiMessage.content, isUser: false },
      ]);
      setIsGenerating(false);
    },
    onError: error => {
      // axios의 취소 에러는 무시
      if (!axios.isCancel(error)) {
        setIsGenerating(false);
      }
    },
  });

  // 채팅 중단 뮤테이션
  const { mutate: stopGeneration } = useMutation({
    mutationFn: () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        return Promise.resolve();
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      setIsGenerating(false);
    },
  });

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);

    // 입력창 초기화
    setInputText('');
    setIsGenerating(true);

    // 키보드 닫기
    Keyboard.dismiss();

    // 스크롤 아래로 이동
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // 채팅 생성 요청
    sendMessage(inputText);
  };

  const handleStopGeneration = () => {
    stopGeneration();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={true}>
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{bookTitle}에 대해 질문을 남겨보세요.</Text>
            <Text style={styles.emptySubText}>작품, 내용, 주제 등에 대해 물어볼 수 있습니다.</Text>
          </View>
        ) : (
          messages.map(message => (
            <Animated.View
              key={message.id}
              entering={FadeIn.duration(300)}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessageContainer : styles.bookMessageContainer,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  message.isUser ? styles.userMessageText : styles.bookMessageText,
                ]}>
                {message.text}
              </Text>
            </Animated.View>
          ))
        )}

        {isGenerating && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[
              styles.messageContainer,
              styles.bookMessageContainer,
              styles.typingContainer,
            ]}>
            <View style={styles.typingIndicator}>
              {[0, 1, 2].map(index => (
                <Animated.View
                  key={index}
                  entering={FadeIn.delay(index * 150)}
                  style={styles.typingDot}
                />
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
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={handleSendMessage}
          editable={!isGenerating}
        />

        {isGenerating ? (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={handleStopGeneration}
            activeOpacity={0.7}>
            <Icon name="square" size={20} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
              activeOpacity={0.7}>
              <Icon name="send" size={20} color={colors.white} />
            </TouchableOpacity>

            {messages.length > 0 && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  if (messages.length >= 2) {
                    const lastUserMessage = [...messages].reverse().find(msg => msg.isUser);

                    if (lastUserMessage) {
                      setMessages(prev => prev.slice(0, prev.length - 1));
                      sendMessage(lastUserMessage.text);
                    }
                  }
                }}>
                <Icon name="refresh-cw" size={16} color={colors.gray[700]} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  messagesContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  emptyContainer: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 12,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  messageContainer: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.blue[100],
  },
  bookMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.gray[900],
  },
  bookMessageText: {
    color: colors.gray[900],
  },
  typingContainer: {
    padding: spacing.sm,
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
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
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    fontSize: 14,
    color: colors.gray[900],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.blue[700],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  retryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.red[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.red[700],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
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
