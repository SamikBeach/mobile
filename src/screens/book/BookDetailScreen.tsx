import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { BookDetailInfo } from './detail/BookDetailInfo';
import { colors, spacing } from '@/styles/theme';
import { RelativeBooks } from './detail/RelativeBooks';
import { ReviewList } from './detail/ReviewList';
import { BookDetailSkeleton } from '@/components/common/Skeleton/BookDetailSkeleton';
import type { RootStackScreenProps } from '@/navigation/types';

type Props = RootStackScreenProps<'BookDetail'>;

export function BookDetailScreen({ route }: Props) {
  const { bookId } = route.params;

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => bookApi.getBookDetail(bookId),
    select: response => response.data,
  });

  if (isLoading || !book) {
    return <BookDetailSkeleton />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <BookDetailInfo book={book} />
        <RelativeBooks bookId={bookId} />
        <ReviewList bookId={bookId} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
});
