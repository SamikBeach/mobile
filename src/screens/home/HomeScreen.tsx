import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { FeedList } from '@/components/Feed/FeedList';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FeedList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
});
