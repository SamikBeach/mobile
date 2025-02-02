import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function AuthorListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={styles.item}>
          <Skeleton style={styles.image} />
          <View style={styles.content}>
            <View style={styles.header}>
              <Skeleton style={styles.name} />
              <Skeleton style={styles.era} />
            </View>
            <View style={styles.description}>
              <Skeleton style={styles.descriptionLine} />
              <Skeleton style={{ ...styles.descriptionLine, width: '60%' }} />
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
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    width: 100,
    height: 24,
    borderRadius: borderRadius.sm,
  },
  era: {
    width: 60,
    height: 20,
    borderRadius: borderRadius.sm,
  },
  description: {
    gap: spacing.xs,
  },
  descriptionLine: {
    height: 16,
    borderRadius: borderRadius.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stat: {
    width: 60,
    height: 20,
    borderRadius: borderRadius.sm,
  },
});
