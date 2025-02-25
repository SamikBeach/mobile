import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing, borderRadius } from '@/styles/theme';

export function AuthorDetailInfoSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageWrapper}>
          <Skeleton style={styles.image} />
        </View>

        <View style={styles.info}>
          <View style={styles.infoContent}>
            <View style={styles.titleSection}>
              <Skeleton style={styles.name} />
              <Skeleton style={styles.originalName} />
              <Skeleton style={styles.lifespan} />
              <Skeleton style={styles.source} />
            </View>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Skeleton style={styles.statButton} />
                <Skeleton style={styles.statButton} />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Skeleton style={styles.descriptionLine} />
        <Skeleton style={styles.descriptionLine} />
        <Skeleton style={[styles.descriptionLine, styles.lastLine]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  imageWrapper: {},
  image: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
  },
  info: {
    flex: 1,
    paddingVertical: spacing.xs,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.xs,
  },
  name: {
    height: 24,
    width: 120,
    borderRadius: borderRadius.sm,
  },
  originalName: {
    height: 18,
    width: 150,
    borderRadius: borderRadius.sm,
  },
  lifespan: {
    height: 16,
    width: 100,
    borderRadius: borderRadius.sm,
  },
  source: {
    height: 15,
    width: 80,
    borderRadius: borderRadius.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statButton: {
    width: 60,
    height: 32,
    borderRadius: 16,
  },
  descriptionContainer: {
    gap: spacing.xs,
  },
  descriptionLine: {
    height: 16,
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  lastLine: {
    width: '80%',
  },
});
