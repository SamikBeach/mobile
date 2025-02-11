import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function AuthorBooksSkeleton() {
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
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.bookItem}>
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
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  title: {
    width: 150,
    height: 24,
    borderRadius: borderRadius.sm,
  },
  badge: {
    width: 30,
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
    width: '100%',
    height: 18,
    borderRadius: borderRadius.sm,
  },
  bookPublisher: {
    width: '70%',
    height: 16,
    borderRadius: borderRadius.sm,
  },
});
