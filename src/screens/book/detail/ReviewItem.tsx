import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import type { Review } from '@/types/review';

interface Props {
  review: Review;
  showBookInfo?: boolean;
}

export function ReviewItem({ review, showBookInfo }: Props) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{review.title}</Text>
        {showBookInfo && (
          <Pressable style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={1}>
              {review.book.title}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.userInfo}>
        <View style={styles.avatar} />
        <Text style={styles.date}>{format(new Date(review.createdAt), 'yyyy.MM.dd')}</Text>
      </View>

      <Pressable onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.content} numberOfLines={isExpanded ? undefined : 3}>
          {review.content}
        </Text>
        {!isExpanded && <Text style={styles.more}>더보기</Text>}
      </Pressable>

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Icon
            name="heart"
            size={14}
            color={review.isLiked ? colors.primary[600] : colors.gray[500]}
          />
          <Text style={styles.actionText}>{review.likeCount}</Text>
        </View>
        <View style={styles.actionButton}>
          <Icon name="message-circle" size={14} color={colors.gray[500]} />
          <Text style={styles.actionText}>{review.commentCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.sm,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  bookInfo: {
    backgroundColor: colors.gray[50],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  bookTitle: {
    fontSize: 13,
    color: colors.gray[700],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray[200],
  },
  date: {
    fontSize: 12,
    color: colors.gray[500],
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.gray[800],
  },
  more: {
    fontSize: 14,
    color: colors.primary[600],
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
  },
  actionText: {
    fontSize: 12,
    color: colors.gray[500],
  },
});
