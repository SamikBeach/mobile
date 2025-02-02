import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GenreButtons } from './GenreButtons';
import { SearchBar } from './SearchBar';
import { SortButtons } from './SortButtons';
import { AuthorSelect } from './AuthorSelect';

export function BookListHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <GenreButtons />
        <SearchBar />
      </View>
      <View style={styles.bottom}>
        <AuthorSelect />
        <SortButtons />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  top: {
    gap: 12,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
