import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from './Skeleton';

export function BookListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.item}>
          <Skeleton style={styles.image} />
          <Skeleton style={styles.title} />
          <Skeleton style={styles.subtitle} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[200],
  },
  title: {
    height: 20,
    width: '80%',
    marginTop: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
  subtitle: {
    height: 16,
    width: '60%',
    marginTop: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
});
