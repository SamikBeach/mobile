import React, { Suspense, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Tab } from '@/components/common/Tab';
import { Feed } from './Feed';
import { FeedSkeleton } from './FeedSkeleton';
import { reviewApi } from '@/apis/review';
import type { Review } from '@/types/review';
import { AxiosResponse } from 'axios';
import { PaginatedResponse } from '@/types/common';

function FeedListContent() {
  const [tab, setTab] = useState<'popular' | 'recent'>('popular');

  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery<
    AxiosResponse<PaginatedResponse<Review>>,
    Error
  >({
    queryKey: ['reviews', tab],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await reviewApi.searchReviews({
        page: pageParam as number,
        limit: 10,
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
      <FlatList
        data={reviews}
        renderItem={({ item }) => <Feed review={item} user={item.user} book={item.book} />}
        keyExtractor={item => String(item.id)}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasNextPage ? <FeedSkeleton /> : null}
      />
    </View>
  );
}

export function FeedList() {
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
      <FeedListContent />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
