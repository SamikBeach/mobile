import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function BookListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index}>
          <View style={styles.item}>
            <Skeleton style={styles.image} />
            <View style={styles.content}>
              <View style={styles.textContent}>
                <Skeleton style={styles.title} />
                <Skeleton style={{ ...styles.title, width: '70%' }} />
                <Skeleton style={styles.author} />
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
              </View>
            </View>
          </View>
          {index < 4 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContent: {
    gap: spacing.xs,
  },
  title: {
    height: 22,
    borderRadius: borderRadius.sm,
  },
  author: {
    height: 20,
    width: '60%',
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
    width: 13,
    height: 13,
    borderRadius: borderRadius.full,
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
