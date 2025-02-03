import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ReviewItem } from '@/components/Review/ReviewItem';
import { Empty } from '@/components/common/Empty';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { spacing } from '@/styles/theme';
import { ActivityIndicator } from 'react-native';
import { colors } from '@/styles/theme';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  userId: number;
}

export function ReviewList({ userId }: Props) {
  const currentUser = useCurrentUser();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['user', userId, 'reviews'],
    queryFn: ({ pageParam = 1 }) =>
      userId === currentUser?.id
        ? userApi.getMyReviews({ page: pageParam, limit: 20 })
        : userApi.getUserReviews(userId, { page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (!lastPage.data.links.next) return undefined;
      const nextPage = new URLSearchParams(lastPage.data.links.next.split('?')[1]).get('page');
      return nextPage ? Number(nextPage) : undefined;
    },
  });

  const reviews = data?.pages.flatMap(page => page.data.data) ?? [];

  if (!reviews.length) return <Empty message="작성한 리뷰가 없습니다" />;

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} showBook />}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="large" color={colors.primary[500]} style={styles.spinner} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  spinner: {
    marginVertical: spacing.lg,
  },
});
