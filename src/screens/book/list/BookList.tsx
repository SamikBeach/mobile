import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import Icon from 'react-native-vector-icons/Feather';
import { AxiosResponse } from 'axios';

import { bookApi } from '@/apis/book';
import { Empty } from '@/components/common/Empty';
import { bookGenreAtom, bookSearchKeywordAtom, bookSortModeAtom, authorIdAtom } from '@/atoms/book';
import { GENRE_IDS } from '@/constants/genre';
import type { Book } from '@/types/book';
import { BookListSkeleton } from '@/components/common/Skeleton/BookListSkeleton';
import { spacing } from '@/styles/theme';
import { BookItem } from '@/components/book/BookItem';
import { colors } from '@/styles/theme';

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export function BookList() {
  const genre = useAtomValue(bookGenreAtom);
  const searchKeyword = useAtomValue(bookSearchKeywordAtom);
  const sortMode = useAtomValue(bookSortModeAtom);
  const selectedAuthorId = useAtomValue(authorIdAtom);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    AxiosResponse<PaginatedResponse<Book>>,
    Error
  >({
    queryKey: ['books', searchKeyword, sortMode, selectedAuthorId, genre],
    queryFn: ({ pageParam = 1 }) => {
      const sortBy = (() => {
        switch (sortMode) {
          case 'popular':
            return 'likeCount:DESC';
          case 'recent':
            return 'publicationDate:DESC';
          case 'alphabet':
            return 'title:ASC';
          default:
            return 'likeCount:DESC';
        }
      })();

      return bookApi.searchBooks({
        page: pageParam as number,
        limit: 20,
        ...(searchKeyword && {
          search: searchKeyword,
          searchBy: ['title', 'authorBooks.author.nameInKor'],
        }),
        sortBy,
        filter: {
          authorId: selectedAuthorId,
          genre_id: GENRE_IDS[genre] ?? undefined,
        },
      });
    },
    getNextPageParam: lastPage => {
      const { currentPage, totalPages } = lastPage.data.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const books = data?.pages.flatMap(page => page.data.data) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <BookListSkeleton />;
  }

  if (books.length === 0 && (searchKeyword || selectedAuthorId)) {
    return (
      <Empty
        icon={<Icon name="search" size={48} color="#9CA3AF" />}
        message="검색 결과가 없어요."
        description={
          searchKeyword
            ? `'${searchKeyword}'로 검색한 결과가 없어요.`
            : '선택한 작가의 도서를 찾을 수 없어요.'
        }
      />
    );
  }

  return (
    <FlatList<Book>
      data={books}
      renderItem={({ item }) => <BookItem book={item} />}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.list}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <BookListSkeleton /> : null}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
});
