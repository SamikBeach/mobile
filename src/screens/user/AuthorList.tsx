import React, { useMemo } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { AuthorItem } from '@/components/Author/AuthorItem';
import { Empty } from '@/components/common/Empty';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { spacing } from '@/styles/theme';
import type { Author } from '@/types/author';

interface Props {
  userId: number;
}

interface LikedAuthor {
  author: Author;
}

interface AuthorResponse {
  data: {
    data: LikedAuthor[];
    meta: {
      currentPage: number;
      totalPages: number;
    };
  };
}

export function AuthorList({ userId }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<AuthorResponse>(
    {
      queryKey: ['user', userId, 'likedAuthors'],
      queryFn: async ({ pageParam = 1 }) => {
        return await userApi.getUserLikedAuthors(userId, { page: pageParam as number });
      },
      initialPageParam: 1,
      getNextPageParam: response => {
        const { currentPage, totalPages } = response.data.meta;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
    },
  );

  const authors = useMemo(() => data?.pages?.flatMap(page => page.data.data) ?? [], [data]);

  if (!authors.length) return <Empty message="좋아요한 작가가 없습니다" />;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <FlatList
      data={authors}
      renderItem={({ item }) => <AuthorItem author={item.author} />}
      keyExtractor={item => String(item.author.id)}
      contentContainerStyle={styles.list}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
