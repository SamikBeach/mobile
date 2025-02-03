import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { BookItem } from '@/components/common/BookItem';
import { BookListSkeleton } from '@/components/common/Skeleton/BookListSkeleton';
import { spacing } from '@/styles/theme';

interface Props {
  userId: number;
}

export function BookList({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['user-liked-books', userId],
    queryFn: ({ pageParam = 1 }) =>
      userApi.getUserLikedBooks(userId, {
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

  if (isLoading) return <BookListSkeleton />;

  const books = data?.pages.flatMap(page => page.data.data) ?? [];

  if (books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>아직 좋아요한 책이 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookItem book={item.book} size="small" showPublisher />}
      keyExtractor={item => String(item.book.id)}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      numColumns={3}
      columnWrapperStyle={styles.row}
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
  row: {
    gap: spacing.md,
    justifyContent: 'flex-start',
  },
});
