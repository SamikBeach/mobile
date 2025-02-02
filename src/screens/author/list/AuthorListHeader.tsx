import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GenreButtons } from './GenreButtons';
import { SearchBar } from './SearchBar';
import { SortButtons } from './SortButtons';
import { EraSelect } from './EraSelect';
import { colors, spacing, shadows } from '@/styles/theme';

export function AuthorListHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <GenreButtons />
      </View>
      <View style={styles.bottom}>
        <SearchBar />
        <View style={styles.filters}>
          <EraSelect />
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
    ...shadows.sm,
  },
  top: {
    paddingHorizontal: spacing.lg,
  },
  bottom: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}); 