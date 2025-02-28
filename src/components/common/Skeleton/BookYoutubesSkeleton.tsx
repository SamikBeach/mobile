import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - spacing.lg - spacing.md / 2;

export function BookYoutubesSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton style={{ width: 100, height: 24, borderRadius: 4 }} />
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>

      <View style={styles.videoGrid}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={styles.videoCard}>
            <Skeleton style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 4 }} />
            <View style={styles.videoInfo}>
              <Skeleton style={{ width: '90%', height: 16, borderRadius: 4, marginBottom: 4 }} />
              <Skeleton style={{ width: '60%', height: 12, borderRadius: 4 }} />
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  videoCard: {
    width: CARD_WIDTH,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  videoInfo: {
    padding: spacing.sm,
  },
});
