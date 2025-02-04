import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import type { Review } from '@/types/review';
import { LexicalContent } from '@/components/common/LexicalContent';
import { formatDate } from '@/utils/date';
import { UserAvatar } from '@/components/common/UserAvatar';
import { ReviewItemSkeleton } from '@/components/common/Skeleton/ReviewItemSkeleton';

interface Props {
  review: Review;
  showBookInfo?: boolean;
}

export function ReviewItem({ review, showBookInfo }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (!isExpanded) {
      const { lines } = event.nativeEvent;
      // 3줄 이상일 때 더보기 버튼 표시
      if (lines.length >= 3) {
        setIsTruncated(true);
      } else {
        setIsTruncated(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <UserAvatar user={review.user} showNickname={false} size="sm" />
          <Text style={styles.username}>{review.user.nickname}</Text>
          <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
        </View>
        {showBookInfo && (
          <Pressable style={styles.bookInfo}>
            <Icon name="book-open" size={14} color={colors.gray[500]} />
            <Text style={styles.bookTitle} numberOfLines={1}>
              {review.book.title}
            </Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.title}>{review.title}</Text>

      <View style={styles.contentContainer}>
        <Text
          style={styles.content}
          numberOfLines={isExpanded ? undefined : 3}
          ellipsizeMode="tail"
          onTextLayout={onTextLayout}>
          <LexicalContent content={review.content} />
        </Text>
        {isTruncated && !isExpanded && (
          <Pressable
            onPress={() => setIsExpanded(true)}
            style={styles.moreButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.more}>더보기</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton}>
            <Icon
              name="heart"
              size={16}
              color={review.isLiked ? colors.primary[500] : colors.gray[400]}
            />
            <Text style={[styles.actionText, review.isLiked && styles.activeActionText]}>
              {review.likeCount}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  header: {
    gap: spacing.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
  date: {
    fontSize: 13,
    color: colors.gray[500],
  },
  bookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.gray[50],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  bookTitle: {
    fontSize: 13,
    color: colors.gray[700],
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  contentContainer: {
    position: 'relative',
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.gray[800],
  },
  moreButton: {
    marginTop: spacing.xs,
  },
  more: {
    fontSize: 14,
    color: colors.primary[500],
  },
  footer: {
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  actionText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  activeActionText: {
    color: colors.primary[500],
  },
});
