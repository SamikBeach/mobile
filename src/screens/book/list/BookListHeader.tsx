import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { GenreButtons } from './GenreButtons';
import { SearchBar } from './SearchBar';
import { SortButtons } from './SortButtons';
import { AuthorSelect } from './AuthorSelect';
import { colors, spacing } from '@/styles/theme';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export function BookListHeader() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchWidth = new Animated.Value(40);
  const searchOpacity = new Animated.Value(0);
  const controlsOpacity = new Animated.Value(1);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused && isSearchExpanded) {
      closeSearch();
    }
  }, [isFocused]);

  const closeSearch = () => {
    setIsSearchExpanded(false);
    Animated.parallel([
      Animated.spring(searchWidth, {
        toValue: 40,
        useNativeDriver: false,
        friction: 8,
      }),
      Animated.timing(searchOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleSearch = () => {
    if (!isSearchExpanded) {
      setIsSearchExpanded(true);

      Animated.parallel([
        Animated.spring(searchWidth, {
          toValue: 200,
          useNativeDriver: false,
          friction: 8,
        }),
        Animated.timing(searchOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
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
        <Animated.View
          style={[
            styles.controlsContainer,
            { opacity: controlsOpacity },
            { display: isSearchExpanded ? 'none' : 'flex' },
          ]}>
          <AuthorSelect />
          <SortButtons />
        </Animated.View>
        <SearchBar
          expanded={isSearchExpanded}
          onToggle={toggleSearch}
          style={{
            width: searchWidth,
            marginLeft: isSearchExpanded ? undefined : 'auto',
            flex: isSearchExpanded ? 1 : undefined,
          }}
        />
      </Pressable>
    </Pressable>
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
