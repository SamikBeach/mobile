import React, { Suspense } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text } from '@/components/common';
import { colors } from '@/styles/theme';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { searchApi } from '@/apis/search';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import RecentSearchList from './RecentSearchList';
import SearchResultList from './SearchResultList';

interface Props {
  keyword: string;
  onClose: () => void;
}

function LoadingSpinner() {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
    </View>
  );
}

function SearchGuide() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.guideText}>책이나 작가의 이름을 검색해보세요</Text>
    </View>
  );
}

function SearchResults({ keyword, onClose }: Props) {
  const { data } = useQuery({
    queryKey: ['search', keyword],
    queryFn: () => searchApi.search(keyword),
    enabled: Boolean(keyword),
    select: response => response.data,
    placeholderData: keepPreviousData,
  });

  if (!data?.books?.length && !data?.authors?.length) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.guideText}>검색 결과가 없습니다</Text>
      </View>
    );
  }

  return (
    <SearchResultList
      books={data.books}
      authors={data.authors}
      onClose={onClose}
      searchValue={keyword}
    />
  );
}

export default function SearchContent({ keyword, onClose }: Props) {
  const currentUser = useCurrentUser();
  const isEmpty = !keyword;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
      <Suspense fallback={<LoadingSpinner />}>
        {isEmpty ? (
          currentUser ? (
            <RecentSearchList onClose={onClose} />
          ) : (
            <SearchGuide />
          )
        ) : (
          <SearchResults keyword={keyword} onClose={onClose} />
        )}
      </Suspense>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    fontSize: 14,
    color: colors.gray[500],
  },
});
