import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAtom } from 'jotai';
import { bookSortModeAtom, type BookSortMode } from '@/atoms/book';
import { colors, spacing, borderRadius } from '@/styles/theme';

const SORT_OPTIONS: { value: BookSortMode; label: string }[] = [
  { value: 'popular', label: '인기순' },
  { value: 'recent', label: '최신순' },
  { value: 'alphabet', label: '가나다순' },
];

export function SortButtons() {
  const [sortMode, setSortMode] = useAtom(bookSortModeAtom);

  return (
    <View style={styles.container}>
      {SORT_OPTIONS.map(({ value, label }) => (
        <TouchableOpacity
          key={value}
          onPress={() => setSortMode(value)}
          style={[styles.button, sortMode === value && styles.activeButton]}>
          <Text style={[styles.text, sortMode === value && styles.activeText]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.gray[50],
    padding: spacing.xs,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  button: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[500],
  },
  activeText: {
    color: colors.gray[900],
  },
});
