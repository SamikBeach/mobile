import React, { useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Animated } from 'react-native';
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
  const scrollY = React.useRef(new Animated.Value(0)).current;

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
    <Animated.FlatList
      data={reviews}
      renderItem={({ item, index }) => {
        const inputRange = [-1, 0, (index + 2) * 300, (index + 3) * 300];
        const opacity = scrollY.interpolate({
          inputRange,
          outputRange: [1, 1, 1, 0],
        });
        const scale = scrollY.interpolate({
          inputRange,
          outputRange: [1, 1, 1, 0.8],
        });
        return (
          <Animated.View style={{ opacity, transform: [{ scale }] }}>
            <ReviewItem review={item} showBookInfo />
          </Animated.View>
        );
      }}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      })}
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
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  spinner: {
    marginVertical: spacing.lg,
  },
});
