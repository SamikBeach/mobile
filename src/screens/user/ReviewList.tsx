import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { ReviewItem } from '@/components/common/ReviewItem';
import { ReviewListSkeleton } from '@/components/common/Skeleton/ReviewListSkeleton';
import { spacing } from '@/styles/theme';

interface Props {
  userId: number;
}

export function ReviewList({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['user-reviews', userId],
    queryFn: ({ pageParam = 1 }) =>
      userApi.getUserReviews(userId, {
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: lastPage => {
      if (!lastPage.data.links.next) return undefined;
      const nextPage = Number(lastPage.data.links.next.split('page=')[1].split('&')[0]);
      return nextPage;
    },
    initialPageParam: 1,
  });

  if (isLoading) return <ReviewListSkeleton />;

  const reviews = data?.pages.flatMap(page => page.data.data) ?? [];

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>아직 작성한 리뷰가 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} showBookInfo />}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.lg,
  },
  separator: {
    height: spacing.lg,
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
});
