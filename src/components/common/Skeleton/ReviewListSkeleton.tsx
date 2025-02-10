import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/styles/theme';
import { ReviewItemSkeleton } from './ReviewItemSkeleton';

export function ReviewListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 3 }).map((_, index) => (
        <View key={index} style={styles.itemContainer}>
          <ReviewItemSkeleton />
          {index < 2 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    backgroundColor: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginVertical: spacing.lg,
  },
});
