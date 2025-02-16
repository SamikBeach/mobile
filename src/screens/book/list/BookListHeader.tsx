import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { GenreButtons } from './GenreButtons';
import { SearchBar } from './SearchBar';
import { SortButtons } from './SortButtons';
import { AuthorSelect } from './AuthorSelect';
import { colors, spacing } from '@/styles/theme';
import { useIsFocused } from '@react-navigation/native';

export function BookListHeader() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused && isSearchExpanded) {
      closeSearch();
    }
  }, [isFocused, isSearchExpanded]);

  const closeSearch = () => {
    setIsSearchExpanded(false);
  };

  const toggleSearch = () => {
    if (!isSearchExpanded) {
      setIsSearchExpanded(true);
    } else {
      closeSearch();
    }
  };

  return (
    <Pressable style={styles.container} onPress={isSearchExpanded ? closeSearch : undefined}>
      <View style={styles.top}>
        <GenreButtons />
      </View>
      <Pressable style={styles.controls} onPress={e => e.stopPropagation()}>
        <View style={[styles.controlsContainer, { display: isSearchExpanded ? 'none' : 'flex' }]}>
          <AuthorSelect />
          <SortButtons />
        </View>
        <SearchBar expanded={isSearchExpanded} onToggle={toggleSearch} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  top: {
    paddingHorizontal: spacing.md,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchBar: {
    marginLeft: 'auto',
  },
  expandedSearchBar: {
    flex: 1,
  },
});
