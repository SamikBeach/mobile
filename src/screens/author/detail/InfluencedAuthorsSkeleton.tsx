import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function InfluencedAuthorsSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Skeleton style={{ width: 180, height: 20, borderRadius: 4 }} />
            <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
          </View>
          <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
        </View>
        <View style={styles.authorGrid}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.authorItem}>
              <Skeleton style={{ width: 32, height: 32, borderRadius: 16 }} />
              <View style={{ flex: 1, gap: 4 }}>
                <Skeleton style={{ width: '60%', height: 16, borderRadius: 4 }} />
                <Skeleton style={{ width: '40%', height: 12, borderRadius: 4 }} />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  authorGrid: {
    gap: spacing.sm,
  },
  authorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
    marginBottom: spacing.sm,
  },
}); 