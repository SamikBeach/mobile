import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { Empty } from '@/components/common/Empty';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { ReviewItem } from '@/components/review/ReviewItem';
import { Checkbox } from '@/components/common/Checkbox';

interface Props {
  bookId: number;
}

export function ReviewList({ bookId }: Props) {
  const [includeOtherTranslations, setIncludeOtherTranslations] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['book-reviews', bookId, includeOtherTranslations],
    queryFn: () =>
      bookApi.searchBookReviews(
        bookId,
        {
          page: 1,
          limit: 20,
        },
        includeOtherTranslations,
      ),
    select: response => response.data.data,
  });

  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => bookApi.getBookDetail(bookId),
    select: response => response.data,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>리뷰</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{book?.reviewCount ?? 0}</Text>
          </View>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox checked={includeOtherTranslations} onChange={setIncludeOtherTranslations} />
          <Text style={styles.checkboxLabel}>다른 번역본의 리뷰도 함께 보기</Text>
        </View>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Empty
            icon={<Icon name="message-square" size={48} color={colors.gray[400]} />}
            message="아직 리뷰가 없어요"
            description="첫 번째 리뷰를 작성해보세요"
          />
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={({ item }) => (
            <ReviewItem
              review={item}
              showBookInfo={includeOtherTranslations && item.book.id !== bookId}
            />
          )}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          scrollEnabled={false}
          contentContainerStyle={styles.reviewList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  badge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[600],
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.gray[600],
  },
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
  },
  reviewList: {
    gap: spacing.md,
  },
  separator: {
    height: spacing.md,
  },
});
