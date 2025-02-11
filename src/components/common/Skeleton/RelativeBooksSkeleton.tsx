import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function RelativeBooksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton style={styles.title} />
        <Skeleton style={styles.badge} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {[1, 2, 3].map(key => (
          <View key={key} style={styles.bookItem}>
            <View style={styles.imageContainer}>
              <Skeleton style={styles.bookImage} />
            </View>
            <View style={styles.bookInfo}>
              <Skeleton style={styles.bookTitle} />
              <Skeleton style={styles.bookTitle} />
              <Skeleton style={styles.bookPublisher} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  title: {
    width: 80,
    height: 18,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.lg,
  },
  badge: {
    width: 24,
    height: 20,
    borderRadius: borderRadius.full,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  bookItem: {
    width: 120,
  },
  imageContainer: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
  },
  bookInfo: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  bookTitle: {
    height: 18,
    borderRadius: borderRadius.sm,
  },
  bookPublisher: {
    width: '70%',
    height: 12,
    borderRadius: borderRadius.sm,
  },
});
