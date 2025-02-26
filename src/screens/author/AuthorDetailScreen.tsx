import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthorDetailScreenContent } from './detail/AuthorDetailScreenContent';
import { spacing } from '@/styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors } from '@/styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthorDetail'>;

export function AuthorDetailScreen({ route }: Props) {
  const { authorId } = route.params;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <AuthorDetailScreenContent authorId={authorId} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
