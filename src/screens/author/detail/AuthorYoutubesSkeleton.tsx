import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - spacing.lg - spacing.md / 2;

export function AuthorYoutubesSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Skeleton style={{ width: 100, height: 20, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>

      <View style={styles.videoGrid}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={styles.videoCard}>
            <View style={styles.thumbnailContainer}>
              <Skeleton style={{ width: '100%', height: 0, paddingBottom: '56.25%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
              <View style={styles.playIconContainer}>
                <Skeleton style={{ width: 36, height: 36, borderRadius: 18 }} />
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Skeleton style={{ width: '90%', height: 16, borderRadius: 4 }} />
              <Skeleton style={{ width: '60%', height: 12, borderRadius: 4, marginTop: 4 }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  videoCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
}); 