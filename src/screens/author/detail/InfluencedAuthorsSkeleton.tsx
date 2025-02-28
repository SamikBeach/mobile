import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function InfluencedAuthorsSkeleton() {
  return (
    <View style={styles.container}>
      {/* 영향을 준 작가 섹션 */}
      <View style={styles.section}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Skeleton style={{ width: 180, height: 24, borderRadius: 4 }} />
            <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
          </View>
          <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
        </View>
        <View style={styles.authorGrid}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.authorItem}>
              <Skeleton style={{ width: 32, height: 32, borderRadius: 16 }} />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.authorNameRow}>
                  <Skeleton style={{ width: '60%', height: 16, borderRadius: 4 }} />
                </View>
                <Skeleton style={{ width: '40%', height: 12, borderRadius: 4 }} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 영향을 받은 작가 섹션 */}
      <View style={styles.section}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Skeleton style={{ width: 180, height: 24, borderRadius: 4 }} />
            <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
          </View>
          <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
        </View>
        <View style={styles.authorGrid}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.authorItem}>
              <Skeleton style={{ width: 32, height: 32, borderRadius: 16 }} />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.authorNameRow}>
                  <Skeleton style={{ width: '60%', height: 16, borderRadius: 4 }} />
                </View>
                <Skeleton style={{ width: '40%', height: 12, borderRadius: 4 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    flex: 1,
  },
  authorGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  authorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
    shadowColor: colors.gray[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
    marginBottom: spacing.sm,
  },
});
