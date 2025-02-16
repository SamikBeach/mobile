import React, { Suspense, useMemo, useState, forwardRef } from 'react';
import { View, StyleSheet, RefreshControlProps, FlatList } from 'react-native';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Tab } from '@/components/common/Tab';
import { Feed } from './Feed';
import { FeedSkeleton } from './FeedSkeleton';
import { reviewApi } from '@/apis/review';
import type { Review } from '@/types/review';
import { AxiosResponse } from 'axios';
import { PaginatedResponse } from '@/types/common';
import { colors, spacing } from '@/styles/theme';
import Animated, { Easing, Layout } from 'react-native-reanimated';

interface Props {
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

const FeedListContent = forwardRef<FlatList, Props>(({ refreshControl }, ref) => {
  const [tab, setTab] = useState<'popular' | 'recent'>('popular');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery<
    AxiosResponse<PaginatedResponse<Review>>,
    Error
  >({
    queryKey: ['reviews', tab],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await reviewApi.searchReviews({
        page: pageParam as number,
        limit: 5,
        sortBy: tab === 'popular' ? 'likeCount:DESC' : 'createdAt:DESC',
      });
      return response;
    },
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

  const reviews = useMemo(() => data?.pages?.flatMap(page => page.data.data) ?? [], [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={styles.container}>
      <Tab
        tabs={[
          { value: 'popular', label: '인기순' },
          { value: 'recent', label: '최신순' },
        ]}
        value={tab}
        onChange={value => setTab(value as 'popular' | 'recent')}
      />
      <Animated.FlatList
        ref={ref}
        data={reviews}
        renderItem={({ item }) => (
          <Feed key={item.id} review={item} user={item.user} book={item.book} />
        )}
        keyExtractor={item => String(item.id)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <FeedSkeleton /> : null}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={styles.listContent}
        itemLayoutAnimation={Layout.duration(200).easing(Easing.bezierFn(0.4, 0, 0.2, 1))}
        refreshControl={refreshControl}
      />
    </View>
  );
});

FeedListContent.displayName = 'FeedListContent';

export const FeedList = forwardRef<FlatList, Props>(({ refreshControl }, ref) => {
  return (
    <Suspense
      fallback={
        <View style={styles.container}>
          <Tab
            tabs={[
              { value: 'popular', label: '인기순' },
              { value: 'recent', label: '최신순' },
            ]}
            value="popular"
            onChange={() => {}}
          />
          {[1, 2, 3].map(i => (
            <FeedSkeleton key={i} />
          ))}
        </View>
      }>
      <FeedListContent refreshControl={refreshControl} ref={ref} />
    </Suspense>
  );
});

FeedList.displayName = 'FeedList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  listContent: {
    paddingVertical: spacing.md,
  },
});
