import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing, borderRadius } from '@/styles/theme';

export function AuthorBooksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton style={styles.title} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bookList}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.bookItem}>
            <Skeleton style={styles.bookCover} />
            <View style={styles.info}>
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
    paddingTop: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    width: 120,
    height: 24,
    borderRadius: borderRadius.sm,
  },
  bookList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  bookItem: {
    width: 110,
    gap: spacing.sm,
  },
  bookCover: {
    width: 110,
    height: 160,
    borderRadius: borderRadius.md,
  },
  info: {
    gap: spacing.xs,
  },
  bookTitle: {
    width: '100%',
    height: 16,
    borderRadius: borderRadius.sm,
  },
  bookPublisher: {
    width: '60%',
    height: 14,
    borderRadius: borderRadius.sm,
  },
}); 