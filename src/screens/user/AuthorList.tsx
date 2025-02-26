import React, { useMemo } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AuthorItem } from '@/components/author/AuthorItem';
import { Empty } from '@/components/common/Empty';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { spacing, colors } from '@/styles/theme';
import type { Author } from '@/types/author';
import { PaginatedResponse } from '@/types/common';
import { AxiosResponse } from 'axios';
import { AuthorListSkeleton } from '@/components/common/Skeleton/AuthorListSkeleton';

interface Props {
  userId: number;
}

export function AuthorList({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery<AxiosResponse<PaginatedResponse<{ author: Author }>>, Error>({
      queryKey: ['user-liked-authors', userId],
      queryFn: ({ pageParam = 1 }) =>
        userApi.getUserLikedAuthors(userId, {
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

  const authors = useMemo(() => data?.pages.flatMap(page => page.data.data) ?? [], [data]);

  if (isLoading) {
    return <AuthorListSkeleton />;
  }

  if (error) {
    return (
      <Empty
        icon={<Icon name="alert-circle" size={48} color={colors.gray[400]} />}
        message="오류가 발생했어요"
        description="좋아한 작가 목록을 불러오는 중에 문제가 발생했어요"
      />
    );
  }

  if (!authors.length) {
    return <Empty message="좋아한 작가가 없어요" description="마음에 드는 작가를 찾아보세요" />;
  }

  return (
    <FlatList
      data={authors}
      renderItem={({ item }) => <AuthorItem author={item.author} />}
      keyExtractor={item => String(item.author.id)}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <AuthorListSkeleton /> : null}
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
