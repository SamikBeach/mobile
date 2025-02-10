import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { BookDetailScreenContent } from './detail/BookDetailScreenContent';
import { colors, spacing } from '@/styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export function BookDetailScreen({ route }: Props) {
  const { bookId } = route.params;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <BookDetailScreenContent bookId={bookId} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  editorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    padding: spacing.lg,
    backgroundColor: 'white',
  },
});
