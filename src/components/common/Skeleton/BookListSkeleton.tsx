import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function BookListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index}>
          <View style={styles.item}>
            <Skeleton style={styles.image} />
            <View style={styles.content}>
              <View style={styles.titleSection}>
                <Skeleton style={styles.title} />
                <Skeleton style={{ ...styles.title, width: '70%' }} />
              </View>
              <View style={styles.meta}>
                <Skeleton style={styles.author} />
                <Skeleton style={styles.publisher} />
              </View>
            </View>
          </View>
          {index < 4 && <View style={styles.separator} />}
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
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  titleSection: {
    gap: spacing.xs,
  },
  title: {
    height: 20,
    width: '100%',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  meta: {
    gap: spacing.xs,
  },
  author: {
    height: 16,
    width: '80%',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  publisher: {
    height: 16,
    width: '50%',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  separator: {
    height: spacing.md,
  },
});
