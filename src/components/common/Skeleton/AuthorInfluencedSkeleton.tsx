import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function AuthorInfluencedSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Skeleton style={styles.sectionTitle} />
          <Skeleton style={styles.countBadge} />
        </View>
        <View style={styles.authorList}>
          {[1, 2].map(i => (
            <View key={i} style={styles.authorItem}>
              <Skeleton style={styles.authorImage} />
              <View style={styles.authorInfo}>
                <Skeleton style={styles.authorName} />
                <Skeleton style={styles.authorLifespan} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    width: 150,
    height: 18,
    borderRadius: borderRadius.sm,
  },
  countBadge: {
    width: 24,
    height: 16,
    borderRadius: 12,
  },
  authorList: {
    gap: spacing.sm,
  },
  authorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
  },
  authorInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  authorName: {
    width: '60%',
    height: 15,
    borderRadius: borderRadius.sm,
  },
  authorLifespan: {
    width: '40%',
    height: 13,
    borderRadius: borderRadius.sm,
  },
});
