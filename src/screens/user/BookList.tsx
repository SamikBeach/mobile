import React, { useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native';
import { BookItem } from '@/components/book/BookItem';
import { Empty } from '@/components/common/Empty';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { spacing, colors } from '@/styles/theme';
import type { Book } from '@/types/book';
import { PaginatedResponse } from '@/types/common';
import { AxiosResponse } from 'axios';

interface Props {
  userId: number;
}

export function BookList({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    AxiosResponse<PaginatedResponse<{ book: Book }>>,
    Error
  >({
    queryKey: ['user-liked-books', userId],
    queryFn: ({ pageParam = 1 }) =>
      userApi.getUserLikedBooks(userId, {
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

  const books = useMemo(() => data?.pages.flatMap(page => page.data.data) ?? [], [data]);

  if (!books.length) return <Empty message="좋아요한 책이 없습니다" />;

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookItem book={item.book} />}
      keyExtractor={item => String(item.book.id)}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
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
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  spinner: {
    marginVertical: spacing.lg,
  },
});
