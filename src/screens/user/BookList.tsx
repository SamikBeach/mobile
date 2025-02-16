import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Feather';

import { BookItem } from '@/components/book/BookItem';
import { Empty } from '@/components/common/Empty';
import { userApi } from '@/apis/user';
import { spacing, colors } from '@/styles/theme';
import type { Book } from '@/types/book';
import { PaginatedResponse } from '@/types/common';
import { AxiosResponse } from 'axios';
import { BookListSkeleton } from '@/components/common/Skeleton/BookListSkeleton';

interface Props {
  userId: number;
}

export function BookList({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery<AxiosResponse<PaginatedResponse<{ book: Book }>>, Error>({
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

  const books = data?.pages.flatMap(page => page.data.data) ?? [];

  if (isLoading) {
    return <BookListSkeleton />;
  }

  if (error) {
    return (
      <Empty
        icon={<Icon name="alert-circle" size={48} color={colors.gray[400]} />}
        message="오류가 발생했어요"
        description="좋아한 책 목록을 불러오는 중에 문제가 발생했어요."
      />
    );
  }

  if (!books.length) {
    return <Empty message="좋아한 책이 없어요" description="마음에 드는 책을 찾아보세요" />;
  }

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
      ListFooterComponent={isFetchingNextPage ? <BookListSkeleton /> : null}
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
});
