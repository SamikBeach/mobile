import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function ReviewListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Skeleton style={styles.username} />
              <Skeleton style={styles.date} />
            </View>
            <Skeleton style={styles.rating} />
          </View>
          <View style={styles.content}>
            <Skeleton style={styles.textLine} />
            <Skeleton style={{ ...styles.textLine, width: '80%' }} />
            <Skeleton style={{ ...styles.textLine, width: '60%' }} />
          </View>
          <View style={styles.footer}>
            <Skeleton style={styles.stat} />
            <Skeleton style={styles.stat} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  item: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    paddingVertical: spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    gap: spacing.xs,
  },
  username: {
    width: 100,
    height: 16,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  date: {
    width: 80,
    height: 14,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  rating: {
    width: 40,
    height: 16,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  content: {
    gap: spacing.xs,
  },
  textLine: {
    height: 16,
    width: '100%',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  footer: {
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
