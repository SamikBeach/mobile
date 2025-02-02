import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function ReviewListSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton style={styles.title} />
        <Skeleton style={styles.badge} />
      </View>
      {Array.from({ length: 3 }).map((_, index) => (
        <View key={index} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <View style={styles.userInfo}>
              <Skeleton style={styles.avatar} />
              <Skeleton style={styles.username} />
              <Skeleton style={styles.date} />
            </View>
            <Skeleton style={styles.bookInfo} />
          </View>
          <Skeleton style={styles.reviewTitle} />
          <View style={styles.content}>
            <Skeleton style={styles.contentLine} />
            <Skeleton style={{ ...styles.contentLine, width: '80%' }} />
          </View>
          <View style={styles.footer}>
            <Skeleton style={styles.action} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  title: {
    width: 60,
    height: 24,
    borderRadius: borderRadius.sm,
  },
  badge: {
    width: 30,
    height: 20,
    borderRadius: borderRadius.full,
  },
  reviewItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    gap: spacing.md,
  },
  reviewHeader: {
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
    width: 70,
    height: 16,
    borderRadius: borderRadius.sm,
  },
  bookInfo: {
    width: 120,
    height: 24,
    borderRadius: borderRadius.md,
  },
  reviewTitle: {
    width: '60%',
    height: 20,
    borderRadius: borderRadius.sm,
  },
  content: {
    gap: spacing.xs,
  },
  contentLine: {
    height: 16,
    borderRadius: borderRadius.sm,
  },
  footer: {
    marginTop: spacing.xs,
  },
  action: {
    width: 60,
    height: 20,
    borderRadius: borderRadius.sm,
  },
});
