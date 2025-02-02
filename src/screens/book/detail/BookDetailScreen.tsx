import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { BookDetailInfo } from './BookDetailInfo';
import { colors, spacing } from '@/styles/theme';
import { RelativeBooks } from './RelativeBooks';
import { ReviewList } from './ReviewList';
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
      <ScrollView>
        <View style={styles.heroSection}>
          <BookDetailInfo book={book} />
        </View>
        <View style={styles.content}>
          <RelativeBooks bookId={bookId} />
          <ReviewList bookId={bookId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heroSection: {
    backgroundColor: colors.gray[50],
    paddingVertical: spacing.xl,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
});
