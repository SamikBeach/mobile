import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function BookDetailInfoSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageWrapper}>
          <Skeleton style={styles.image} />
        </View>

        <View style={styles.info}>
          <View style={styles.infoContent}>
            <View style={styles.titleSection}>
              <Skeleton style={styles.title} />
              <Skeleton style={styles.author} />
              <Skeleton style={styles.meta} />
              <Skeleton style={styles.aladin} />
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

      <View style={styles.writeButton}>
        <View style={styles.writeButtonContent}>
          <Skeleton style={styles.writeButtonIcon} />
          <Skeleton style={styles.writeButtonText} />
        </View>
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
  imageWrapper: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    height: 180,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.sm,
  },
  title: {
    height: 24,
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  author: {
    height: 15,
    width: '60%',
    borderRadius: borderRadius.sm,
  },
  meta: {
    height: 13,
    width: '50%',
    borderRadius: borderRadius.sm,
  },
  aladin: {
    height: 13,
    width: '30%',
    borderRadius: borderRadius.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
  writeButton: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
  },
  writeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  writeButtonIcon: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.sm,
  },
  writeButtonText: {
    width: 120,
    height: 15,
    borderRadius: borderRadius.sm,
  },
});
