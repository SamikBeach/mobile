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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.bookList}>
          {[1, 2, 3].map(key => (
            <View key={key} style={styles.bookItem}>
              <View style={styles.imageContainer}>
                <Skeleton style={styles.bookImage} />
              </View>
              <View style={styles.bookInfo}>
                <Skeleton style={styles.bookTitle} />
                <Skeleton style={styles.bookPublisher} />
              </View>
            </View>
          ))}
        </View>
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
  },
  title: {
    width: 100,
    height: 24,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.lg,
  },
  badge: {
    width: 24,
    height: 20,
    borderRadius: borderRadius.full,
  },
  scrollView: {
    flexGrow: 0,
  },
  bookList: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  bookItem: {
    width: 130,
    gap: spacing.sm,
  },
  imageContainer: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  bookImage: {
    width: 130,
    height: 190,
    borderRadius: borderRadius.md,
  },
  bookInfo: {
    gap: spacing.xs,
  },
  bookTitle: {
    height: 40,
    borderRadius: borderRadius.sm,
  },
  bookPublisher: {
    width: '70%',
    height: 16,
    borderRadius: borderRadius.sm,
  },
});
