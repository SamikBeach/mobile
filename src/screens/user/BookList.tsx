import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { BookItem } from '@/components/Book/BookItem';
import { Empty } from '@/components/common/Empty';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { spacing } from '@/styles/theme';

interface Props {
  userId: number;
}

const LIMIT = 10;

export function BookList({ userId }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['user', userId, 'likedBooks'],
    queryFn: ({ pageParam = 1 }) =>
      userApi.getUserLikedBooks(userId, { page: pageParam, limit: LIMIT }),
    getNextPageParam: lastPage => {
      const totalPages = Math.ceil(lastPage.data.meta.totalItems / LIMIT);
      const nextPage = lastPage.data.meta.currentPage + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const books = data?.pages.flatMap(page => page.data.data) ?? [];

  if (!books.length) return <Empty message="좋아요한 책이 없습니다" />;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookItem book={item.book} showPublisher showPublicationDate />}
      keyExtractor={item => String(item.book.id)}
      contentContainerStyle={styles.list}
      horizontal={false}
      numColumns={2}
      columnWrapperStyle={styles.row}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
});
