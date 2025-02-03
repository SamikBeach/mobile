import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import Icon from 'react-native-vector-icons/Feather';

import { bookApi } from '@/apis/book';
import { Empty } from '@/components/common/Empty';
import { bookGenreAtom, bookSearchKeywordAtom, bookSortModeAtom, authorIdAtom } from '@/atoms/book';
import { GENRE_IDS } from '@/constants/genre';
import type { Book } from '@/types/book';
import { BookListSkeleton } from '@/components/common/Skeleton/BookListSkeleton';
import { spacing } from '@/styles/theme';
import { BookItem } from './BookItem';

export function BookList() {
  const genre = useAtomValue(bookGenreAtom);
  const searchKeyword = useAtomValue(bookSearchKeywordAtom);
  const sortMode = useAtomValue(bookSortModeAtom);
  const selectedAuthorId = useAtomValue(authorIdAtom);

  const { data, isLoading } = useQuery({
    queryKey: ['books', searchKeyword, sortMode, selectedAuthorId, genre],
    queryFn: () => {
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
        page: 1,
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
  });

  const books = data?.data.data ?? [];

  if (isLoading) {
    return <BookListSkeleton />;
  }

  if (books.length === 0 && (searchKeyword || selectedAuthorId)) {
    return (
      <Empty
        icon={<Icon name="search-x" size={48} color="#9CA3AF" />}
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
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
});
