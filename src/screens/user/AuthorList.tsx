import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { AuthorListSkeleton } from '@/components/common/Skeleton/AuthorListSkeleton';
import { spacing } from '@/styles/theme';
import { AuthorItem } from '../author/list/AuthorItem';

interface Props {
  userId: number;
}

export function AuthorList({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['user-liked-authors', userId],
    queryFn: ({ pageParam = 1 }) =>
      userApi.getUserLikedAuthors(userId, {
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

  if (isLoading) return <AuthorListSkeleton />;

  const authors = data?.pages.flatMap(page => page.data.data) ?? [];

  if (authors.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>아직 좋아요한 작가가 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={authors}
      renderItem={({ item }) => <AuthorItem author={item.author} />}
      keyExtractor={item => String(item.author.id)}
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
