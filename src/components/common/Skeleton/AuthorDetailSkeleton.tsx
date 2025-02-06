import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function AuthorDetailSkeleton() {
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
          <View style={styles.stats}>
            <Skeleton style={styles.statButton} />
            <Skeleton style={styles.statButton} />
          </View>
        </View>
      </View>
      <Skeleton style={styles.description} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
  },
  info: {
    flex: 1,
    height: 120,
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.xs,
  },
  name: {
    height: 24,
    width: '80%',
    borderRadius: borderRadius.sm,
  },
  originalName: {
    height: 18,
    width: '60%',
    borderRadius: borderRadius.sm,
  },
  lifespan: {
    height: 16,
    width: '40%',
    borderRadius: borderRadius.sm,
  },
  source: {
    height: 14,
    width: '30%',
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statButton: {
    width: 60,
    height: 32,
    borderRadius: borderRadius.md,
  },
  description: {
    height: 60,
    borderRadius: borderRadius.sm,
  },
});
