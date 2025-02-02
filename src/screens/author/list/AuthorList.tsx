import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import Icon from 'react-native-vector-icons/Feather';

import { authorApi } from '@/apis/author';
import { AuthorItem } from './AuthorItem';
import { Empty } from '@/components/common/Empty';
import {
  authorGenreAtom,
  authorSearchKeywordAtom,
  authorSortModeAtom,
  eraIdAtom,
} from '@/atoms/author';
import { GENRE_IDS } from '@/constants/genre';
import type { Author } from '@/types/author';
import { colors, spacing } from '@/styles/theme';
import { AuthorListSkeleton } from '@/components/common/Skeleton/AuthorListSkeleton';

export function AuthorList() {
  const genre = useAtomValue(authorGenreAtom);
  const searchKeyword = useAtomValue(authorSearchKeywordAtom);
  const sortMode = useAtomValue(authorSortModeAtom);
  const selectedEraId = useAtomValue(eraIdAtom);

  const { data: response, isLoading } = useQuery({
    queryKey: ['authors', searchKeyword, sortMode, selectedEraId, genre],
    queryFn: () => {
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
  });

  const authors = response?.data.data ?? [];

  if (isLoading) {
    return <AuthorListSkeleton />;
  }

  if (authors.length === 0 && (searchKeyword || selectedEraId)) {
    return (
      <Empty
        icon={<Icon name="search-x" size={48} color={colors.gray[400]} />}
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
