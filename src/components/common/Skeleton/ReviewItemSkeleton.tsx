import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function ReviewItemSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Skeleton style={styles.avatar} />
          <Skeleton style={styles.username} />
          <Skeleton style={styles.date} />
        </View>
      </View>

      <Skeleton style={styles.title} />

      <View style={styles.content}>
        <Skeleton style={styles.contentLine} />
        <Skeleton style={styles.contentLine} />
        <Skeleton style={[styles.contentLine, { width: '70%' }]} />
      </View>

      <View style={styles.footer}>
        <View style={styles.actions}>
          <View style={styles.actionItem}>
            <Skeleton style={styles.actionIcon} />
            <Skeleton style={styles.actionText} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  header: {
    gap: spacing.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
  },
  username: {
    width: 80,
    height: 16,
    borderRadius: borderRadius.sm,
  },
  date: {
    width: 60,
    height: 14,
    borderRadius: borderRadius.sm,
  },
  title: {
    width: '60%',
    height: 20,
    borderRadius: borderRadius.sm,
  },
  content: {
    gap: spacing.xs,
  },
  contentLine: {
    height: 16,
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  footer: {
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionIcon: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.full,
  },
  actionText: {
    width: 24,
    height: 14,
    borderRadius: borderRadius.sm,
  },
}); 