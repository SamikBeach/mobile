import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function RelativeBooksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Skeleton style={styles.title} />
          <Skeleton style={styles.badge} />
        </View>
        <Skeleton style={styles.toggleButton} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {[1, 2, 3, 4, 5, 6].map(key => (
          <View key={key} style={styles.bookItem}>
            <Skeleton style={styles.bookImage} />
            <View style={styles.bookInfo}>
              <Skeleton style={styles.bookTitle} />
              <Skeleton style={styles.authorName} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    width: 100,
    height: 24,
    borderRadius: borderRadius.sm,
  },
  badge: {
    width: 30,
    height: 20,
    borderRadius: borderRadius.full,
  },
  toggleButton: {
    width: 80,
    height: 30,
    borderRadius: borderRadius.md,
  },
  scrollContent: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  bookItem: {
    width: 120,
    gap: spacing.xs,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
  },
  bookInfo: {
    gap: 2,
    marginTop: spacing.xs,
  },
  bookTitle: {
    height: 16,
    width: '90%',
    borderRadius: borderRadius.sm,
  },
  authorName: {
    height: 12,
    width: '60%',
    borderRadius: borderRadius.sm,
  },
});
