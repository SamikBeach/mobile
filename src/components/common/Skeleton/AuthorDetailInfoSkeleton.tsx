import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing, borderRadius } from '@/styles/theme';

export function AuthorDetailInfoSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton style={styles.image} />
        <View style={styles.info}>
          <View style={styles.titleSection}>
            <Skeleton style={styles.name} />
            <Skeleton style={styles.originalName} />
            <Skeleton style={styles.lifespan} />
            <Skeleton style={styles.source} />
          </View>
          <View style={styles.actions}>
            <Skeleton style={styles.action} />
            <Skeleton style={styles.action} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.xs,
  },
  name: {
    width: '80%',
    height: 28,
    borderRadius: borderRadius.sm,
  },
  originalName: {
    width: '60%',
    height: 20,
    borderRadius: borderRadius.sm,
  },
  lifespan: {
    width: '40%',
    height: 18,
    borderRadius: borderRadius.sm,
  },
  source: {
    width: '30%',
    height: 14,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  action: {
    width: 80,
    height: 32,
    borderRadius: borderRadius.md,
  },
});
