import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function AuthorBooksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Skeleton style={{ width: 150, height: 24, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>
      
      <View style={styles.scrollContent}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={styles.bookItem}>
            <Skeleton style={{ width: 120, height: 180, borderRadius: borderRadius.md }} />
            <Skeleton style={{ width: 100, height: 16, borderRadius: 4, marginTop: spacing.xs }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  bookItem: {
    width: 120,
    gap: spacing.xs,
  },
}); 