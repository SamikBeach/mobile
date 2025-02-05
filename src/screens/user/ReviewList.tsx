import React, { useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ReviewItem } from '@/components/review/ReviewItem';
import { Empty } from '@/components/common/Empty';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { spacing, colors } from '@/styles/theme';
import type { Review } from '@/types/review';
import { PaginatedResponse } from '@/types/common';
import { AxiosResponse } from 'axios';

interface Props {
  userId: number;
}

export function ReviewList({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    AxiosResponse<PaginatedResponse<Review>>,
    Error
  >({
    queryKey: ['user-reviews', userId],
    queryFn: ({ pageParam = 1 }) =>
      userApi.getUserReviews(userId, {
        page: pageParam as number,
        limit: 20,
      }),
    initialPageParam: 1,
    getNextPageParam: param => {
      const nextParam = param.data.links.next;
      const query = nextParam?.split('?')[1];
      const pageParam = query
        ?.split('&')
        .find(q => q.startsWith('page'))
        ?.split('=')[1];

      return pageParam;
    },
  });

  const reviews = useMemo(() => data?.pages.flatMap(page => page.data.data) ?? [], [data]);

  if (!reviews.length) return <Empty message="작성한 리뷰가 없습니다" />;

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} showBookInfo />}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
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
