import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Tab } from '@/components/common/Tab';
import { Feed } from './Feed';
import { FeedSkeleton } from './FeedSkeleton';
import { reviewApi } from '@/apis/review';
import type { Review } from '@/types/review';

interface ReviewResponse {
  data: {
    data: Review[];
    meta: {
      currentPage: number;
      totalPages: number;
    };
  };
}

export function FeedList() {
  const [tab, setTab] = useState<'popular' | 'recent'>('popular');

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<ReviewResponse>({
    queryKey: ['reviews', tab],
    queryFn: async ({ pageParam = 1 }) => {
      return await reviewApi.searchReviews({
        page: pageParam as number,
        limit: 10,
        sortBy: tab === 'popular' ? 'likeCount:DESC' : 'createdAt:DESC',
      });
    },
    initialPageParam: 1,
    getNextPageParam: response => {
      const { currentPage, totalPages } = response.data.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  const reviews = useMemo(() => data?.pages?.flatMap(page => page.data.data) ?? [], [data]);

  if (isLoading) {
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
        {[1, 2, 3].map(i => (
          <FeedSkeleton key={i} />
        ))}
      </View>
    );
  }

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
