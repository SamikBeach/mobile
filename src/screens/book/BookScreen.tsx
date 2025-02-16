import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { BookList } from './list/BookList';
import { BookListHeader } from './list/BookListHeader';

export default function BookScreen() {
  const scrollRef = React.useRef(null);

  useScrollToTop(scrollRef);

  return (
    <SafeAreaView style={styles.container}>
      <BookListHeader />
      <BookList scrollRef={scrollRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
