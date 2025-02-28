import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  NativeSyntheticEvent,
  TextLayoutEventData,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
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
import { CommentList } from './CommentList';
import { ReviewActions } from './ReviewActions';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { BookImage } from '@/components/book/BookImage';
import { ReportActions } from './ReportActions';
import Toast from 'react-native-toast-message';

export interface ReviewItemHandle {
  expandComments?: () => void;
}

interface Props {
  review: Review;
  showBookInfo?: boolean;
  hideUserInfo?: boolean;
  hideDate?: boolean;
  onCommentPress?: (reviewId: number, user?: { nickname: string }) => void;
  ref?: React.RefObject<ReviewItemHandle>;
  hideReplyButton?: boolean;
}

export const ReviewItem = forwardRef<ReviewItemHandle, Props>(
  (
    {
      review,
      showBookInfo,
      hideUserInfo = false,
      hideDate = false,
      onCommentPress,
      hideReplyButton = false,
    },
    ref,
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [actionSheetVisible, setActionSheetVisible] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const currentUser = useCurrentUser();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { updateReviewLikeQueryData, deleteReviewDataQueryData } = useReviewQueryData();
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
      onCommentPress?.(review.id, user);
    };

    const handleReplyPress = () => {
      setShowComments(prev => !prev);
    };

    const handleMorePress = () => {
      setActionSheetVisible(true);
    };

    const handleEditPress = () => {
      navigation.navigate('WriteReview', {
        bookId: review.book.id,
        reviewId: review.id,
      });
    };

    const handleDeletePress = () => {
      Alert.alert('리뷰 삭제', '정말 삭제하시겠습니까?', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteReview(),
        },
      ]);
    };

    const handleBookPress = () => {
      navigation.navigate('BookDetail', { bookId: review.book.id });
    };

    useImperativeHandle(ref, () => ({
      expandComments: () => {
        setShowComments(true);
      },
    }));

    return (
      <>
        <Animated.View
          style={styles.container}
          layout={Layout.duration(300)}
          entering={FadeIn.duration(300)}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              {!hideUserInfo && (
                <View style={styles.userInfo}>
                  <UserAvatar user={review.user} size="sm" />
                  <Text style={styles.userName}>{review.user.nickname}</Text>
                  {!hideDate && <Text style={styles.date}>{formatDate(review.createdAt)}</Text>}
                </View>
              )}
              {isMyReview && (
                <ReviewActions onEdit={handleEditPress} onDelete={handleDeletePress} />
              )}
            </View>

            {showBookInfo && (
              <View style={styles.bookInfoContainer}>
                <Pressable style={styles.bookCard} onPress={handleBookPress}>
                  <BookImage imageUrl={review.book.imageUrl} size="xs" style={styles.bookImage} />
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle} numberOfLines={1}>
                      {review.book.title}
                    </Text>
                    <Text style={styles.bookAuthor} numberOfLines={1}>
                      {review.book.authorBooks
                        .map(authorBook => authorBook.author.nameInKor)
                        .join(', ')}
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}

            <Text style={styles.title}>{review.title}</Text>
          </View>

          <Pressable style={styles.contentContainer} onPress={() => setIsExpanded(!isExpanded)}>
            <Text
              style={styles.content}
              numberOfLines={isExpanded ? undefined : 3}
              ellipsizeMode="tail"
              onTextLayout={onTextLayout}>
              <LexicalContent content={review.content} isExpanded={isExpanded} />
            </Text>
            {isTruncated && !isExpanded && <Text style={styles.more}>더보기</Text>}
          </Pressable>

          <View style={styles.footer}>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, review.isLiked && styles.activeActionButton]}
                onPress={handleLikePress}>
                <Icon
                  name="thumbs-up"
                  size={16}
                  color={review.isLiked ? colors.primary[500] : colors.gray[600]}
                />
                <Text style={[styles.actionText, review.isLiked && styles.activeActionText]}>
                  {review.likeCount > 0 ? review.likeCount : '좋아요'}
                </Text>
              </TouchableOpacity>

              {!hideReplyButton && (
                <TouchableOpacity
                  style={[styles.actionButton, showComments && styles.activeActionButton]}
                  onPress={handleReplyPress}>
                  <Icon
                    name="message-square"
                    size={16}
                    color={showComments ? colors.primary[500] : colors.gray[600]}
                  />
                  <Text style={[styles.actionText, showComments && styles.activeActionText]}>
                    {review.commentCount > 0 ? review.commentCount : '댓글'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {showComments && (
            <Animated.View
              style={styles.commentsContainer}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
              layout={Layout.duration(300)}>
              <CommentList reviewId={review.id} onReply={handleReply} />
            </Animated.View>
          )}
          {!isMyReview && currentUser && (
            <TouchableOpacity onPress={handleMorePress} style={styles.moreButton}>
              <Icon name="more-horizontal" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          )}
        </Animated.View>

        <ReportActions
          visible={actionSheetVisible}
          onClose={() => setActionSheetVisible(false)}
          reviewId={review.id}
          userId={review.user.id}
          userNickname={review.user.nickname}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  header: {
    gap: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
  },
  date: {
    fontSize: 13,
    color: colors.gray[500],
    marginLeft: spacing.sm,
  },
  bookInfoContainer: {
    marginTop: spacing.xs,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gray[50],
    borderRadius: spacing.sm,
    padding: spacing.sm,
    alignSelf: 'flex-start',
  },
  bookImage: {
    borderRadius: spacing.xs,
  },
  bookInfo: {
    gap: 2,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[800],
  },
  bookAuthor: {
    fontSize: 12,
    color: colors.gray[600],
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  contentContainer: {
    borderWidth: 1,
    borderColor: colors.gray[100],
    borderRadius: spacing.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.gray[800],
  },
  more: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.blue[600],
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  footer: {
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  activeActionButton: {
    backgroundColor: colors.blue[50],
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
  },
  activeActionText: {
    color: colors.primary[500],
  },
  moreButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 2,
  },
  commentsContainer: {
    marginTop: spacing.xs,
    paddingLeft: spacing.xl,
  },
});
