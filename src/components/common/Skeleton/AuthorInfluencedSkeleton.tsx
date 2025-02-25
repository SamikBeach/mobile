import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing, borderRadius } from '@/styles/theme';

export function AuthorInfluencedSkeleton() {
  return (
    <View style={styles.container}>
      {[0, 1].map(sectionIndex => (
        <View key={sectionIndex} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Skeleton style={styles.sectionTitle} />
            <Skeleton style={styles.countBadge} />
          </View>
          <View style={styles.authorList}>
            {[0, 1].map(itemIndex => (
              <View key={itemIndex} style={styles.authorItem}>
                <Skeleton style={styles.authorImage} />
                <View style={styles.authorInfo}>
                  <Skeleton style={styles.authorName} />
                  <Skeleton style={styles.authorLifespan} />
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
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
    width: 200,
    height: 24,
    borderRadius: borderRadius.sm,
  },
  countBadge: {
    width: 30,
    height: 20,
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
    width: 120,
    height: 16,
    borderRadius: borderRadius.sm,
  },
  authorLifespan: {
    width: 80,
    height: 14,
    borderRadius: borderRadius.sm,
  },
}); 