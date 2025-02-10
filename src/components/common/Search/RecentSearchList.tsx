import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import BookItem from './BookItem';
import AuthorItem from './AuthorItem';

interface Props {
  onClose: () => void;
}

export default function RecentSearchList({ onClose }: Props) {
  const queryClient = useQueryClient();

  const { data: searches } = useQuery({
    queryKey: ['recentSearches'],
    queryFn: () => userApi.getRecentSearches(),
    select: response => response.data,
  });

  const { mutate: deleteSearch } = useMutation({
    mutationFn: userApi.deleteSearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSearches'] });
    },
  });

  if (!searches?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>최근 검색 기록이 없습니다</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>최근 검색</Text>
      {searches.map(search => {
        if (search.book) {
          return (
            <BookItem
              key={search.id}
              book={search.book}
              onClose={onClose}
              onDelete={() => deleteSearch(search.id)}
            />
          );
        }
        if (search.author) {
          return (
            <AuthorItem
              key={search.id}
              author={search.author}
              onClose={onClose}
              onDelete={() => deleteSearch(search.id)}
            />
          );
        }
        return null;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[500],
  },
});
