import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function BookInfoSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton style={styles.image} />
      <View style={styles.info}>
        <Skeleton style={styles.title} />
        <Skeleton style={styles.meta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  image: {
    width: 28,
    height: 40,
    borderRadius: borderRadius.sm,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    height: 16,
    width: '80%',
    borderRadius: borderRadius.sm,
  },
  meta: {
    height: 14,
    width: '100%',
    borderRadius: borderRadius.sm,
  },
});
