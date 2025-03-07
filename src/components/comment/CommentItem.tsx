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
import { colors, spacing, borderRadius } from '@/styles/theme';
import { LexicalContent } from '../common/LexicalContent';
import { CommentEditor } from './CommentEditor';
import Toast from 'react-native-toast-message';
import Animated, { FadeInRight, FadeOutRight, Layout } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

interface Props {
  comment: Comment;
  reviewId: number;
  onReply: (user: { nickname: string }) => void;
  hideReplyButton?: boolean;
}

export function CommentItem({ comment, reviewId, onReply, hideReplyButton = false }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = useCurrentUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isMyComment = comment.user.id === currentUser?.id;

  const { updateCommentLikeQueryData, deleteCommentQueryData, updateCommentQueryData } =
    useCommentQueryData();

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
      Toast.show({
        type: 'success',
        text1: '댓글이 삭제되었습니다.',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '댓글 삭제에 실패했습니다.',
      });
    },
  });

  const { mutate: updateComment } = useMutation({
    mutationFn: (content: string) => reviewApi.updateComment(reviewId, comment.id, { content }),
    onSuccess: (_, content) => {
      updateCommentQueryData({ reviewId, commentId: comment.id, content });
      setIsEditing(false);
      Toast.show({
        type: 'success',
        text1: '댓글이 수정되었습니다.',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '댓글 수정에 실패했습니다.',
      });
    },
  });

  const handleLikePress = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    toggleLike();
  };

  const handleReplyPress = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    onReply(comment.user);
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(300)}
      exiting={FadeOutRight.duration(300)}
      layout={Layout.duration(300)}
      style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <UserAvatar user={comment.user} size="sm" showNickname />
          <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
        </View>
        {isMyComment && (
          <CommentActions onEdit={() => setIsEditing(true)} onDelete={() => deleteComment()} />
        )}
      </View>

      <View style={[styles.content, isEditing && styles.editingContent]}>
        {isEditing ? (
          <CommentEditor
            initialContent={comment.content}
            onSubmit={updateComment}
            onCancel={() => setIsEditing(false)}
            showAvatar={false}
          />
        ) : (
          <LexicalContent content={comment.content} isComment />
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.likeButton, comment.isLiked && styles.likedButton]}
          onPress={handleLikePress}>
          <Icon
            name="thumbs-up"
            size={16}
            color={comment.isLiked ? colors.blue[500] : colors.gray[600]}
          />
          <Text style={[styles.actionText, comment.isLiked && styles.likedText]}>
            {comment.likeCount > 0 ? comment.likeCount : '좋아요'}
          </Text>
        </Pressable>
        {!hideReplyButton && (
          <Pressable
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.actionButton}
            onPress={handleReplyPress}>
            <Text style={styles.actionText}>답글 달기</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  date: {
    fontSize: 12,
    color: colors.gray[500],
    marginLeft: spacing.xs,
  },
  content: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  editingContent: {
    backgroundColor: colors.white,
    padding: 0,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[800],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: 20,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
  },
  likedButton: {
    backgroundColor: colors.blue[50],
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[600],
  },
  likedText: {
    color: colors.blue[600],
  },
});
