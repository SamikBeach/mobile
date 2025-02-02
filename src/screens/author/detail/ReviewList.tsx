import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from '@/components/common/Text';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { ReviewItem } from '@/components/common/ReviewItem';
import { Empty } from '@/components/common/Empty';
import { ReviewListSkeleton } from '@/components/common/Skeleton/ReviewListSkeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import type { Review } from '@/types/review';

interface Props {
  authorId: number;
}

const LIMIT = 10;

export function ReviewList({ authorId }: Props) {
  const { data: author } = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => authorApi.getAuthorDetail(authorId),
    select: response => response.data,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['author-reviews', authorId],
    queryFn: ({ pageParam = 1 }) =>
      authorApi.getAuthorReviews(authorId, { page: pageParam, limit: LIMIT }),
    getNextPageParam: lastPage => {
      const totalPages = Math.ceil(lastPage.data.meta.totalItems / LIMIT);
      const nextPage = lastPage.data.meta.currentPage + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const reviews = data?.pages.flatMap(page => page.data.data) ?? [];

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <ReviewListSkeleton />;
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>리뷰</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{author?.reviewCount ?? 0}</Text>
          </View>
        </View>
        <Empty
          icon={<Icon name="message-square" size={48} color={colors.gray[400]} />}
          message="아직 리뷰가 없어요"
          description="첫 번째 리뷰를 작성해보세요"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>리뷰</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{author?.reviewCount ?? 0}</Text>
        </View>
      </View>
      <FlatList<Review>
        data={reviews}
        renderItem={({ item }) => <ReviewItem review={item} showBookInfo />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[600],
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
});
