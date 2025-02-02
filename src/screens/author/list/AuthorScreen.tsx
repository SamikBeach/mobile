import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AuthorList } from './AuthorList';
import { AuthorListHeader } from './AuthorListHeader';

export default function AuthorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AuthorListHeader />
      <AuthorList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
