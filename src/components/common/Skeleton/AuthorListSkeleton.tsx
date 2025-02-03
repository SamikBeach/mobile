import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function AuthorListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} style={styles.item}>
          <Skeleton style={styles.image} />
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.nameSection}>
                <Skeleton style={styles.name} />
                <Skeleton style={styles.originalName} />
              </View>
              <Skeleton style={styles.badge} />
            </View>
            <View style={styles.description}>
              <Skeleton style={styles.textLine} />
              <Skeleton style={{ ...styles.textLine, width: '80%' }} />
            </View>
            <View style={styles.stats}>
              <Skeleton style={styles.stat} />
              <Skeleton style={styles.stat} />
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
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[200],
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameSection: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    height: 18,
    width: '80%',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  originalName: {
    height: 14,
    width: '60%',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  badge: {
    width: 60,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[200],
  },
  description: {
    gap: spacing.xs,
  },
  textLine: {
    height: 16,
    width: '100%',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    width: 50,
    height: 14,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
});
