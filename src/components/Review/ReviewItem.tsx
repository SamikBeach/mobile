import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  NativeSyntheticEvent,
  TextLayoutEventData,
  Alert,
} from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, borderRadius } from '@/styles/theme';
import type { Review } from '@/types/review';
import { LexicalContent } from '@/components/common/LexicalContent';
import { formatDate } from '@/utils/date';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useMutation } from '@tanstack/react-query';
import { reviewApi } from '@/apis/review';
import { useReviewQueryData } from '@/hooks/useReviewQueryData';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { CommentEditor } from '@/components/comment/CommentEditor';
import Toast from 'react-native-toast-message';
import { CommentList } from './CommentList';
import { ReviewActions } from './ReviewActions';
import { useCommentQueryData } from '@/hooks/useCommentQueryData';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

interface Props {
  review: Review;
  showBookInfo?: boolean;
}

export function ReviewItem({ review, showBookInfo }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyToUser, setReplyToUser] = useState<{ nickname: string } | null>(null);

  const currentUser = useCurrentUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { updateReviewLikeQueryData, deleteReviewDataQueryData } = useReviewQueryData();
  const { createCommentQueryData } = useCommentQueryData();
  const isMyReview = currentUser?.id === review.user.id;

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (!isExpanded) {
      const { lines } = event.nativeEvent;
      if (lines.length >= 3) {
        setIsTruncated(true);
      } else {
        setIsTruncated(false);
      }
    }
  };

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => reviewApi.toggleReviewLike(review.id),
    onMutate: async () => {
      updateReviewLikeQueryData({
        reviewId: review.id,
        bookId: review.book.id,
        authorId: review.book.authorBooks?.[0]?.author.id,
        userId: review.user.id,
        isOptimistic: true,
      });
    },
    onError: () => {
      updateReviewLikeQueryData({
        reviewId: review.id,
        bookId: review.book.id,
        authorId: review.book.authorBooks?.[0]?.author.id,
        userId: review.user.id,
        isOptimistic: false,
        currentStatus: {
          isLiked: review.isLiked ?? false,
          likeCount: review.likeCount,
        },
      });
      Toast.show({
        type: 'error',
        text1: '좋아요 처리에 실패했습니다.',
      });
    },
  });

  const { mutate: createComment } = useMutation({
    mutationFn: (content: string) => reviewApi.createComment(review.id, { content }),
    onSuccess: response => {
      createCommentQueryData({
        reviewId: review.id,
        comment: response.data,
      });
      Toast.show({
        type: 'success',
        text1: '댓글이 등록되었습니다.',
      });
      setReplyToUser(null);
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '댓글 작성에 실패했습니다.',
      });
    },
  });

  const { mutate: deleteReview } = useMutation({
    mutationFn: () => reviewApi.deleteReview(review.id),
    onSuccess: () => {
      deleteReviewDataQueryData({
        reviewId: review.id,
        bookId: review.book.id,
        authorId: review.book.authorBooks?.[0]?.author.id,
        userId: review.user.id,
      });
      Toast.show({
        type: 'success',
        text1: '리뷰가 삭제되었습니다.',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '리뷰 삭제에 실패했습니다.',
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

  const handleReply = (user: { nickname: string }) => {
    setIsReplying(true);
    setReplyToUser(user);
  };

  const handleReplyPress = () => {
    setIsReplying(prev => !prev);
  };

  const handleEditPress = () => {
    navigation.navigate('WriteReview', {
      bookId: review.book.id,
      reviewId: review.id,
    });
  };

  const handleDeletePress = () => {
    Alert.alert('리뷰 삭제', '정말로 이 리뷰를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => deleteReview() },
    ]);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      layout={Layout.duration(300)}
      style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <UserAvatar user={review.user} showNickname size="sm" />
            <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
          </View>
          <View style={styles.headerActions}>
            {isMyReview && <ReviewActions onEdit={handleEditPress} onDelete={handleDeletePress} />}
          </View>
        </View>
        {showBookInfo && (
          <Pressable
            style={styles.bookInfo}
            onPress={() => navigation.navigate('BookDetail', { bookId: review.book.id })}>
            <Icon name="book-open" size={14} color={colors.gray[500]} />
            <Text style={styles.bookTitle} numberOfLines={1}>
              {review.book.title}
            </Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.title}>{review.title}</Text>
      <Pressable onPress={() => isTruncated && setIsExpanded(true)} style={styles.contentContainer}>
        <Text
          style={styles.content}
          numberOfLines={isExpanded ? undefined : 3}
          ellipsizeMode="tail"
          onTextLayout={onTextLayout}>
          <LexicalContent content={review.content} />
        </Text>
        {isTruncated && !isExpanded && <Text style={styles.more}>더보기</Text>}
      </Pressable>
      <View style={styles.footer}>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={handleLikePress}>
            <Icon
              name="thumbs-up"
              size={16}
              color={review.isLiked ? colors.gray[900] : colors.gray[400]}
            />
            <Text style={[styles.actionText, review.isLiked && styles.activeActionText]}>
              {review.likeCount}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, isReplying && styles.activeActionButton]}
            onPress={handleReplyPress}>
            <Icon name="message-circle" size={16} color={colors.gray[400]} />
            <Text style={styles.actionText}>{review.commentCount}</Text>
          </Pressable>
        </View>
      </View>
      {isReplying && (
        <View style={styles.replySection}>
          <CommentEditor
            onSubmit={content => {
              createComment(content);
            }}
            onCancel={() => {
              setIsReplying(false);
              setReplyToUser(null);
            }}
            replyToUser={replyToUser}
            autoFocus
          />
          <CommentList reviewId={review.id} onReply={handleReply} />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  header: {
    gap: spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerActions: {
    alignItems: 'flex-end',
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
    marginTop: spacing.xs,
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
  more: {
    fontSize: 14,
    color: colors.primary[500],
    marginTop: spacing.xs,
  },
  footer: {},
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
    color: colors.gray[900],
  },
  replySection: {
    marginTop: spacing.md,
    paddingLeft: spacing.xl,
  },
  activeActionButton: {
    opacity: 0.8,
  },
});
