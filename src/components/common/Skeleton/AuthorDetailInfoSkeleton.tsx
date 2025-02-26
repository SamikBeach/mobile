import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

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
                <Skeleton style={styles.statIcon} />
                <Skeleton style={styles.statText} />
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Skeleton style={styles.statIcon} />
                <Skeleton style={styles.statText} />
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.description}>
        <Skeleton style={styles.descriptionLine} />
        <Skeleton style={styles.descriptionLine} />
        <Skeleton style={styles.descriptionLine} />
        <Skeleton style={[styles.descriptionLine, { width: '60%' }]} />
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
    gap: spacing.md,
  },
  imageWrapper: {
    width: 140,
    height: 140,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
  },
  info: {
    flex: 1,
    height: 140,
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
    width: '80%',
    borderRadius: borderRadius.sm,
  },
  originalName: {
    height: 15,
    width: '60%',
    borderRadius: borderRadius.sm,
  },
  lifespan: {
    height: 14,
    width: '40%',
    borderRadius: borderRadius.sm,
    marginTop: 2,
  },
  source: {
    height: 13,
    width: '30%',
    borderRadius: borderRadius.sm,
    marginTop: 2,
  },
  description: {
    gap: spacing.xs,
  },
  descriptionLine: {
    height: 15,
    borderRadius: borderRadius.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    width: 14,
    height: 14,
    borderRadius: borderRadius.full,
  },
  statText: {
    width: 24,
    height: 14,
    borderRadius: borderRadius.sm,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.sm,
  },
});
