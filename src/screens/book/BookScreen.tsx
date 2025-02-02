import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { BookList } from './list/BookList';
import { BookListHeader } from './list/BookListHeader';

export default function BookScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <BookListHeader />
      <BookList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
