import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import BookItem from './BookItem';
import AuthorItem from './AuthorItem';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { RootStackParamList } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
  onClose: () => void;
}

export default function RecentSearchList({ onClose }: Props) {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: searches } = useQuery({
    queryKey: ['recentSearches'],
    queryFn: () => userApi.getRecentSearches(),
    select: response => response.data,
  });

  const { mutate: saveSearch } = useMutation({
    mutationFn: (params: { bookId?: number; authorId?: number }) => userApi.saveSearch(params),
    onError: (error: Error) => {
      console.error('Failed to save search history', error);
    },
    onSuccess: () => {
      // 검색 기록이 변경되었으므로 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['recentSearches'] });
    },
  });

  const { mutate: deleteSearch } = useMutation({
    mutationFn: userApi.deleteSearch,
    onMutate: async (searchId: number) => {
      const previousSearches = queryClient.getQueryData(['recentSearches']);

      queryClient.setQueryData(['recentSearches'], (old: { data: Array<{ id: number }> }) => ({
        data: old.data.filter(search => search.id !== searchId),
      }));

      return { previousSearches };
    },
    onError: (
      _err: unknown,
      _variables: unknown,
      context: { previousSearches: unknown } | undefined,
    ) => {
      if (context?.previousSearches) {
        queryClient.setQueryData(['recentSearches'], context.previousSearches);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSearches'] });
    },
  });

  const handleItemClick = ({ bookId, authorId }: { bookId?: number; authorId?: number }) => {
    if (currentUser) {
      saveSearch({ bookId, authorId });
    }

    if (bookId) {
      navigation.navigate('BookDetail', { bookId });
    } else if (authorId) {
      navigation.navigate('AuthorDetail', { authorId });
    }
    onClose();
  };

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
              onPress={() => handleItemClick({ bookId: search.book?.id })}
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
              onPress={() => handleItemClick({ authorId: search.author?.id })}
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
