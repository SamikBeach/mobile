import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';

export function BookListSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map(key => (
        <View key={key} style={styles.item}>
          <Skeleton style={styles.image} />
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Skeleton style={styles.titleLine} />
              <Skeleton style={[styles.titleLine, { width: '60%' }]} />
            </View>
            <View style={styles.meta}>
              <Skeleton style={styles.author} />
              <Skeleton style={styles.publisher} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: borderRadius.sm,
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  titleContainer: {
    gap: spacing.xs,
  },
  titleLine: {
    height: 20,
    borderRadius: borderRadius.sm,
  },
  meta: {
    gap: spacing.xs,
  },
  author: {
    height: 16,
    width: '60%',
    borderRadius: borderRadius.sm,
  },
  publisher: {
    height: 16,
    width: '40%',
    borderRadius: borderRadius.sm,
  },
}); 