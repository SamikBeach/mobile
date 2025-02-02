import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAtom } from 'jotai';
import { authorGenreAtom } from '@/atoms/author';
import { GENRE_LABELS } from '@/constants/genre';
import { colors, spacing, borderRadius } from '@/styles/theme';
import type { Genre } from '@/types/genre';

export function GenreButtons() {
  const [genre, setGenre] = useAtom(authorGenreAtom);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}>
      {(Object.entries(GENRE_LABELS) as Array<[Genre, string]>).map(([value, label]) => (
        <TouchableOpacity
          key={value}
          onPress={() => setGenre(value)}
          style={[styles.button, genre === value && styles.activeButton]}>
          <Text style={[styles.text, genre === value && styles.activeText]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  content: {
    paddingBottom: spacing.md,
  },
  button: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[50],
  },
  activeButton: {
    backgroundColor: colors.primary[50],
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray[500],
  },
  activeText: {
    color: colors.primary[600],
  },
}); 