import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import Icon from 'react-native-vector-icons/Feather';
import { AxiosResponse } from 'axios';

import { authorApi } from '@/apis/author';
import { Empty } from '@/components/common/Empty';
import {
  authorGenreAtom,
  authorSearchKeywordAtom,
  authorSortModeAtom,
  eraIdAtom,
} from '@/atoms/author';
import { GENRE_IDS } from '@/constants/genre';
import type { Author } from '@/types/author';
import { colors } from '@/styles/theme';
import { AuthorListSkeleton } from '@/components/common/Skeleton/AuthorListSkeleton';
import { AuthorItem } from '@/components/author/AuthorItem';

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export function AuthorList() {
  const genre = useAtomValue(authorGenreAtom);
  const searchKeyword = useAtomValue(authorSearchKeywordAtom);
  const sortMode = useAtomValue(authorSortModeAtom);
  const selectedEraId = useAtomValue(eraIdAtom);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<AxiosResponse<PaginatedResponse<Author>>, Error>({
      queryKey: ['authors', searchKeyword, sortMode, selectedEraId, genre],
      queryFn: ({ pageParam = 1 }) => {
        const sortBy = (() => {
          switch (sortMode) {
            case 'popular':
              return 'likeCount:DESC';
            case 'recent':
              return 'createdAt:DESC';
            case 'alphabet':
              return 'nameInKor:ASC';
            default:
              return 'likeCount:DESC';
          }
        })();

        return authorApi.searchAuthors({
          page: pageParam as number,
          limit: 20,
          ...(searchKeyword && {
            search: searchKeyword,
            searchBy: ['nameInKor'],
          }),
          sortBy,
          filter: {
            genre_id: GENRE_IDS[genre] ?? undefined,
            eraId: selectedEraId ? Number(selectedEraId) : undefined,
          },
        });
      },
      getNextPageParam: lastPage => {
        const { currentPage, totalPages } = lastPage.data.meta;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const authors = data?.pages.flatMap(page => page.data.data) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <AuthorListSkeleton />;
  }

  if (error) {
    return (
      <Empty
        icon={<Icon name="alert-circle" size={48} color={colors.gray[400]} />}
        message="오류가 발생했어요"
        description="작가 목록을 불러오는 중에 문제가 발생했어요."
      />
    );
  }

  if (authors.length === 0 && (searchKeyword || selectedEraId)) {
    return (
      <Empty
        icon={<Icon name="search" size={48} color={colors.gray[400]} />}
        message="검색 결과가 없어요."
        description={
          searchKeyword
            ? `'${searchKeyword}'로 검색한 결과가 없어요.`
            : '선택한 시대의 작가를 찾을 수 없어요.'
        }
      />
    );
  }

  return (
    <FlatList<Author>
      data={authors}
      renderItem={({ item }) => <AuthorItem author={item} />}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.list}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <AuthorListSkeleton /> : null}
    />
  );
}

const styles = StyleSheet.create({
  list: {},
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
});
