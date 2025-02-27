import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function OriginalWorksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Skeleton style={{ width: 80, height: 20, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>

      <View style={styles.workGrid}>
        {[1, 2].map(key => (
          <View key={`skeleton-${key}`} style={styles.workCard}>
            <View style={styles.workHeader}>
              <Skeleton style={{ height: 18, width: '100%', borderRadius: 4 }} />
              <Skeleton style={{ height: 14, width: '66%', borderRadius: 4, marginTop: 4 }} />
              <Skeleton style={{ height: 12, width: '50%', borderRadius: 4, marginTop: 6 }} />
            </View>
            <View style={styles.booksSection}>
              <View style={styles.booksHeader}>
                <Skeleton style={{ height: 14, width: 80, borderRadius: 4 }} />
                <Skeleton style={{ height: 16, width: 60, borderRadius: 4 }} />
              </View>
              <View style={styles.booksList}>
                {[1, 2, 3].map(_key => (
                  <Skeleton
                    key={`book-skeleton-${_key}`}
                    style={{ height: 36, borderRadius: 6, width: '30%' }}
                  />
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  workGrid: {
    gap: spacing.md,
  },
  workCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
    marginBottom: spacing.sm,
  },
  workHeader: {
    gap: spacing.xs,
  },
  booksSection: {
    gap: spacing.sm,
  },
  booksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  booksList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
}); 