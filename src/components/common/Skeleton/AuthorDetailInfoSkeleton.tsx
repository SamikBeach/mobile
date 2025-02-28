import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { colors, spacing, borderRadius } from '@/styles/theme';

export function AuthorDetailInfoSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Skeleton style={styles.avatar} />
            <View style={styles.actionsContainer}>
              <Skeleton style={styles.actionButton} />
              <Skeleton style={styles.actionButton} />
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.nameSection}>
              <Skeleton style={styles.koreanName} />
              <View style={styles.nameRow}>
                <Skeleton style={styles.englishName} />
                <Skeleton style={styles.lifespanBadge} />
              </View>
            </View>
            <Skeleton style={styles.genreBadge} />
          </View>
        </View>
        
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionContent}>
            <Skeleton style={styles.descriptionLine} />
            <Skeleton style={styles.descriptionLine} />
            <Skeleton style={styles.descriptionLine} />
            <Skeleton style={[styles.descriptionLine, { width: '80%' }]} />
            <Skeleton style={[styles.descriptionLine, { width: '60%' }]} />
          </View>
          <Skeleton style={styles.expandButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 60,
    height: 36,
    borderRadius: 18,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  nameSection: {
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  koreanName: {
    height: 28,
    width: '80%',
    borderRadius: 4,
  },
  englishName: {
    height: 20,
    width: '50%',
    borderRadius: 4,
  },
  lifespanBadge: {
    height: 24,
    width: '40%',
    borderRadius: 12,
  },
  genreBadge: {
    height: 24,
    width: '30%',
    borderRadius: 12,
  },
  descriptionContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  descriptionContent: {
    gap: spacing.xs,
    height: 140,
  },
  descriptionLine: {
    height: 16,
    width: '100%',
    borderRadius: 4,
    marginBottom: 4,
  },
  expandButton: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    marginTop: spacing.xs,
  },
});
