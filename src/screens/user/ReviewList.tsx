import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ReviewItem } from '@/components/review/ReviewItem';
import { Empty } from '@/components/common/Empty';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { spacing, colors } from '@/styles/theme';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/common';
import type { AxiosResponse } from 'axios';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { ReviewListSkeleton } from '@/components/common/Skeleton';

interface Props {
  userId: number;
}

export function ReviewList({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
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

  if (isLoading) {
    return <ReviewListSkeleton />;
  }

  if (!reviews.length) return <Empty message="작성한 리뷰가 없습니다" />;

  return (
    <Animated.FlatList
      data={reviews}
      renderItem={({ item }) => (
        <View style={styles.reviewItemContainer}>
          <ReviewItem review={item} showBookInfo />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ReviewListSkeleton /> : null}
      contentContainerStyle={styles.container}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      itemLayoutAnimation={Layout.springify()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  reviewItemContainer: {
    backgroundColor: colors.white,
  },
});
