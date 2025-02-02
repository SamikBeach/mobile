import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';

export function BookDetailSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton style={styles.image} />
        <View style={styles.info}>
          <View style={styles.titleSection}>
            <Skeleton style={styles.title} />
            <Skeleton style={styles.author} />
            <Skeleton style={styles.publisher} />
          </View>
          <View style={styles.actions}>
            <View style={styles.stats}>
              <Skeleton style={styles.statButton} />
              <Skeleton style={styles.statButton} />
            </View>
            <Skeleton style={styles.writeButton} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleSection: {
    gap: spacing.sm,
  },
  title: {
    height: 24,
    width: '80%',
    borderRadius: borderRadius.sm,
  },
  author: {
    height: 18,
    width: '60%',
    borderRadius: borderRadius.sm,
  },
  publisher: {
    height: 16,
    width: '40%',
    borderRadius: borderRadius.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statButton: {
    width: 80,
    height: 36,
    borderRadius: borderRadius.md,
  },
  writeButton: {
    height: 40,
    borderRadius: borderRadius.md,
  },
}); 