import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { AuthorList } from './list/AuthorList';
import { AuthorListHeader } from './list/AuthorListHeader';

export default function AuthorScreen() {
  const scrollRef = React.useRef(null);

  useScrollToTop(scrollRef);

  return (
    <SafeAreaView style={styles.container}>
      <AuthorListHeader />
      <AuthorList scrollRef={scrollRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
