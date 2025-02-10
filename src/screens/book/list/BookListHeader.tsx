import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GenreButtons } from './GenreButtons';
import { SearchBar } from './SearchBar';
import { SortButtons } from './SortButtons';
import { AuthorSelect } from './AuthorSelect';
import { colors, spacing } from '@/styles/theme';

export function BookListHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <GenreButtons />
      </View>
      <View style={styles.bottom}>
        <SearchBar />
        <View style={styles.filters}>
          <AuthorSelect />
          <SortButtons />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: spacing.lg,
  },
  top: {
    paddingHorizontal: spacing.md,
  },
  bottom: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
