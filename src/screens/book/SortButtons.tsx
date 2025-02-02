import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/common/Button';
import { useAtom } from 'jotai';
import { bookSortModeAtom, type BookSortMode } from '@/atoms/book';

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
        <Button
          key={value}
          variant="text"
          onPress={() => setSortMode(value)}
          style={[
            styles.button,
            sortMode === value && styles.activeButton,
          ]}
        >
          {label}
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 8,
  },
  activeButton: {
    color: '#111827',
  },
}); 