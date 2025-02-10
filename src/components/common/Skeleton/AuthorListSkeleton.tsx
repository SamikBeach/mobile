import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function AuthorListSkeleton() {
  return (
    <View>
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index}>
          <View style={styles.container}>
            <View style={styles.imageWrapper}>
              <Skeleton style={styles.image} />
            </View>
            <View style={styles.content}>
              <View style={styles.textContent}>
                <View style={styles.header}>
                  <View style={styles.nameSection}>
                    <Skeleton style={styles.name} />
                    <Skeleton style={styles.originalName} />
                  </View>
                </View>
              </View>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Skeleton style={styles.statIcon} />
                  <Skeleton style={styles.statText} />
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Skeleton style={styles.statIcon} />
                  <Skeleton style={styles.statText} />
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Skeleton style={styles.statIcon} />
                  <Skeleton style={styles.statText} />
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Skeleton style={styles.statIcon} />
                  <Skeleton style={styles.statText} />
                </View>
              </View>
            </View>
          </View>
          {index < 3 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[100],
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  textContent: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameSection: {
    flex: 1,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  name: {
    height: 22,
    width: '80%',
    borderRadius: borderRadius.sm,
  },
  originalName: {
    height: 14,
    width: '60%',
    borderRadius: borderRadius.sm,
  },
  descriptionContainer: {
    gap: spacing.xs,
  },
  description: {
    height: 20,
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    width: 13,
    height: 13,
    borderRadius: borderRadius.sm,
  },
  statText: {
    width: 20,
    height: 13,
    borderRadius: borderRadius.sm,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
});
