import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';

export function BookListSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map(key => (
        <View key={key} style={styles.item}>
          <Skeleton style={styles.image} />
          <View style={styles.content}>
            <Skeleton style={styles.title} />
            <Skeleton style={styles.author} />
            <Skeleton style={styles.publisher} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  title: {
    height: 20,
    width: '80%',
  },
  author: {
    height: 16,
    width: '60%',
  },
  publisher: {
    height: 16,
    width: '40%',
  },
}); 