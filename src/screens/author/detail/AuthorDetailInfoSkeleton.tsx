import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function AuthorDetailInfoSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton style={{ width: 140, height: 140, borderRadius: 70 }} />
        <View style={styles.info}>
          <View style={styles.titleSection}>
            <Skeleton style={{ width: 150, height: 24, borderRadius: 4 }} />
            <Skeleton style={{ width: 120, height: 16, borderRadius: 4, marginTop: 4 }} />
            <Skeleton style={{ width: 100, height: 14, borderRadius: 4, marginTop: 4 }} />
            <Skeleton style={{ width: 80, height: 13, borderRadius: 4, marginTop: 4 }} />
          </View>
          <View style={styles.stats}>
            <Skeleton style={{ width: 60, height: 24, borderRadius: 4 }} />
            <Skeleton style={{ width: 60, height: 24, borderRadius: 4, marginLeft: spacing.xs }} />
          </View>
        </View>
      </View>
      
      <View style={styles.descriptionSection}>
        <Skeleton style={{ width: '100%', height: 15, borderRadius: 4 }} />
        <Skeleton style={{ width: '95%', height: 15, borderRadius: 4, marginTop: 8 }} />
        <Skeleton style={{ width: '90%', height: 15, borderRadius: 4, marginTop: 8 }} />
        <Skeleton style={{ width: '40%', height: 15, borderRadius: 4, marginTop: 8 }} />
        <Skeleton style={{ width: 60, height: 14, borderRadius: 4, marginTop: 8 }} />
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
  info: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  titleSection: {
    gap: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  descriptionSection: {
    gap: spacing.xs,
  },
}); 