import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function AuthorBooksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Skeleton style={{ width: 150, height: 24, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {[1, 2, 3, 4, 5].map(i => (
          <View key={i} style={styles.bookItem}>
            <Skeleton style={{ width: 120, height: 180, borderRadius: 8 }} />
            <Skeleton style={{ width: 100, height: 16, marginTop: 8, borderRadius: 4 }} />
            <Skeleton style={{ width: 80, height: 12, marginTop: 4, borderRadius: 4 }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
}); 