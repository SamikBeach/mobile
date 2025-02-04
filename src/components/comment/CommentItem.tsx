import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { UserAvatar } from '@/components/common/UserAvatar';
import { formatDate } from '@/utils/date';
import { Comment } from '@/types/review';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMutation } from '@tanstack/react-query';
import { reviewApi } from '@/apis/review';
import { useCommentQueryData } from '@/hooks/useCommentQueryData';
import { CommentActions } from './CommentActions';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '@/styles/theme';
import { LexicalContent } from '../common/LexicalContent';

interface Props {
  comment: Comment;
  reviewId: number;
  onReply: (user: { nickname: string }) => void;
}

export function CommentItem({ comment, reviewId, onReply }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = useCurrentUser();
  const isMyComment = comment.user.id === currentUser?.id;

  const { updateCommentLikeQueryData, deleteCommentQueryData } = useCommentQueryData();

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => reviewApi.toggleCommentLike(reviewId, comment.id),
    onMutate: () => {
      updateCommentLikeQueryData({
        reviewId,
        commentId: comment.id,
        isOptimistic: true,
      });
    },
    onError: () => {
      updateCommentLikeQueryData({
        reviewId,
        commentId: comment.id,
        isOptimistic: false,
        currentStatus: {
          isLiked: comment.isLiked ?? false,
          likeCount: comment.likeCount,
        },
      });
    },
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: () => reviewApi.deleteComment(reviewId, comment.id),
    onSuccess: () => {
      deleteCommentQueryData({ reviewId, commentId: comment.id });
    },
    onError: () => {},
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <UserAvatar user={comment.user} size="sm" showNickname />
          <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
        </View>
        {isMyComment && (
          <CommentActions onEdit={() => setIsEditing(true)} onDelete={() => deleteComment()} />
        )}
      </View>

      <View style={styles.content}>
        <LexicalContent content={comment.content} isComment />
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.likeButton} onPress={() => toggleLike()}>
          <Icon
            name="thumbs-up"
            size={14}
            color={comment.isLiked ? colors.primary[500] : colors.gray[500]}
          />
          <Text style={[styles.actionText, comment.isLiked && styles.activeActionText]}>
            {comment.likeCount}
          </Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => onReply(comment.user)}>
          <Text style={styles.actionText}>답글 달기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: colors.gray[500],
  },
  content: {
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[700],
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    minWidth: 34,
  },
  actionText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  activeActionText: {
    color: colors.primary[500],
  },
});
