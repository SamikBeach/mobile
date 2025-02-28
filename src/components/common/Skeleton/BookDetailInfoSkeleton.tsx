import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { Skeleton } from '@/components/common/Skeleton';

export function BookDetailInfoSkeleton() {
  return (
    <View style={styles.container}>
      {/* 모바일 레이아웃 (세로 배치) */}
      <View style={styles.mobileContainer}>
        {/* 책 이미지 섹션 - 상단 중앙에 배치 */}
        <View style={styles.bookImageContainer}>
          <Skeleton style={styles.bookCover} />

          {/* 좋아요/댓글 버튼 */}
          <View style={styles.interactionButtons}>
            <Skeleton style={styles.actionButton} />
            <Skeleton style={styles.actionButton} />
          </View>
        </View>

        {/* 책 정보 섹션 */}
        <View style={styles.infoSection}>
          {/* 제목 */}
          <Skeleton style={styles.title} />

          {/* 작가 정보 */}
          <View style={styles.authorsContainer}>
            <Skeleton style={styles.authorCard} />
          </View>

          {/* 출판사 정보 */}
          <View style={styles.publishInfoContainer}>
            <Skeleton style={styles.publisherBadge} />
          </View>

          {/* 원전 정보 */}
          <Skeleton style={styles.originalWorkCard} />

          {/* 책 설명 */}
          <Skeleton style={styles.descriptionContainer} />

          {/* 모바일 버튼 */}
          <View style={styles.mobileButtons}>
            <Skeleton style={styles.button} />
            <Skeleton style={styles.button} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  mobileContainer: {
    flexDirection: 'column',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  bookImageContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  bookCover: {
    width: 140,
    height: 200,
    borderRadius: borderRadius.md,
  },
  interactionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionButton: {
    width: 80,
    height: 36,
    borderRadius: 18,
  },
  infoSection: {
    gap: spacing.md,
  },
  title: {
    height: 28,
    width: '80%',
    borderRadius: borderRadius.sm,
  },
  authorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  authorCard: {
    height: 56,
    width: 180,
    borderRadius: borderRadius.md,
  },
  publishInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  publisherBadge: {
    height: 32,
    width: 120,
    borderRadius: borderRadius.full,
  },
  originalWorkCard: {
    height: 80,
    width: '100%',
    borderRadius: borderRadius.md,
  },
  descriptionContainer: {
    height: 150,
    width: '100%',
    borderRadius: borderRadius.md,
  },
  mobileButtons: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  button: {
    height: 40,
    width: '100%',
    borderRadius: borderRadius.md,
  },
});
