import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from '../Skeleton';

export function RelativeBooksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Skeleton style={{ width: 100, height: 24, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={styles.bookItem}>
            <Skeleton style={styles.bookCover} />
            <Skeleton style={styles.bookTitle} />
            <Skeleton style={styles.authorName} />
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  bookItem: {
    width: 120,
    marginRight: spacing.md,
  },
  bookCover: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
  },
  bookTitle: {
    width: 100,
    height: 16,
    borderRadius: 4,
    marginTop: spacing.xs,
  },
  authorName: {
    width: 80,
    height: 12,
    borderRadius: 4,
    marginTop: 4,
  },
});
