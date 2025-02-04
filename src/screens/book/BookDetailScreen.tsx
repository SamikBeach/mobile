import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookDetailScreenContent } from './detail/BookDetailScreenContent';
import { colors, spacing } from '@/styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export function BookDetailScreen({ route }: Props) {
  const { bookId } = route.params;

  return (
    <View style={styles.container}>
      <BookDetailScreenContent bookId={bookId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    gap: spacing.xl,
  },
});
