import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function OriginalWorksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Skeleton style={{ width: 80, height: 24, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>

      <View style={styles.workGrid}>
        {[1, 2].map(i => (
          <View key={i} style={styles.workCard}>
            <View style={styles.workHeader}>
              <Skeleton style={{ width: '70%', height: 20, borderRadius: 4 }} />
              <View style={{ marginTop: spacing.xs }}>
                <Skeleton style={{ width: '50%', height: 14, borderRadius: 4 }} />
              </View>
              <View style={{ marginTop: spacing.xs }}>
                <Skeleton style={{ width: '40%', height: 14, borderRadius: 4 }} />
              </View>
            </View>

            <View style={styles.booksSection}>
              <View style={styles.booksHeader}>
                <Skeleton style={{ width: 100, height: 16, borderRadius: 4 }} />
                <Skeleton style={{ width: 60, height: 20, borderRadius: 4 }} />
              </View>

              <View style={styles.booksList}>
                {[1, 2, 3].map(j => (
                  <View key={j} style={styles.bookItem}>
                    <Skeleton style={{ width: 20, height: 30, borderRadius: 2 }} />
                    <Skeleton style={{ width: '70%', height: 12, borderRadius: 4 }} />
                  </View>
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
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  workGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  workCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[100],
    backgroundColor: colors.white,
    shadowColor: colors.gray[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
    marginBottom: spacing.sm,
  },
  workHeader: {
    marginBottom: spacing.md,
  },
  booksSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    gap: spacing.sm,
  },
  booksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  booksList: {
    gap: spacing.xs,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    marginBottom: spacing.xs,
  },
});
