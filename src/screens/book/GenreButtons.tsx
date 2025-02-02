import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useAtom } from 'jotai';

import { Button } from '@/components/common/Button';
import { bookGenreAtom } from '@/atoms/book';
import { GENRE_LABELS } from '@/constants/genre';
import type { Genre } from '@/types/genre';

export function GenreButtons() {
  const [genre, setGenre] = useAtom(bookGenreAtom);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {(Object.entries(GENRE_LABELS) as Array<[Genre, string]>).map(([value, label]) => (
        <Button
          key={value}
          onPress={() => setGenre(value)}
          variant="text"
          style={styles.button}
          textStyle={genre === value ? styles.activeText : styles.text}>
          {label}
        </Button>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  button: {
    marginRight: 12,
    paddingHorizontal: 0,
  },
  text: {
    color: '#6B7280',
  },
  activeText: {
    color: '#111827',
  },
});
