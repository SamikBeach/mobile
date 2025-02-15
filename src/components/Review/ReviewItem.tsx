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
import { CommentList } from './CommentList';
import { ReviewActions } from './ReviewActions';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { BookImage } from '@/components/book/BookImage';
import { ReportActions } from './ReportActions';
import Toast from 'react-native-toast-message';

export interface ReviewItemHandle {
  showComments: () => void;
}

interface Props {
  review: Review;
  showBookInfo?: boolean;
  hideUserInfo?: boolean;
  hideDate?: boolean;
  onCommentPress?: (reviewId: number, user?: { nickname: string }) => void;
  ref?: React.RefObject<ReviewItemHandle>;
}

export const ReviewItem = forwardRef<ReviewItemHandle, Props>(
  ({ review, showBookInfo, hideUserInfo = false, hideDate = false, onCommentPress }, ref) => {
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

    const handleMorePress = () => {
      if (!currentUser) {
        navigation.navigate('Login');
        return;
      }

      setActionSheetVisible(true);
    };

    useImperativeHandle(ref, () => ({
      showComments: () => setShowComments(true),
    }));

    return (
      <>
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          layout={Layout.duration(300)}
          style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              {!hideUserInfo && (
                <>
                  <View style={styles.userInfo}>
                    <UserAvatar user={review.user} showNickname size="sm" />
                    {!hideDate && <Text style={styles.date}>{formatDate(review.createdAt)}</Text>}
                  </View>
                  {isMyReview && (
                    <View style={styles.headerActions}>
                      <ReviewActions onEdit={handleEditPress} onDelete={handleDeletePress} />
                    </View>
                  )}
                </>
              )}
            </View>

            {showBookInfo && (
              <View style={styles.bookInfoContainer}>
                <TouchableOpacity
                  style={styles.bookCard}
                  onPress={() =>
                    navigation.navigate('BookDetail', {
                      bookId: review.book.id,
                    })
                  }>
                  <BookImage imageUrl={review.book.imageUrl} size="xs" />
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle} numberOfLines={1}>
                      {review.book.title}
                    </Text>
                    <Text style={styles.bookAuthor} numberOfLines={1}>
                      {review.book.authorBooks.map(author => author.author.nameInKor).join(', ')}
                    </Text>
                  </View>
                </TouchableOpacity>
                {isMyReview && (
                  <View style={styles.headerActions}>
                    <ReviewActions onEdit={handleEditPress} onDelete={handleDeletePress} />
                  </View>
                )}
              </View>
            )}
          </View>
          <Text style={styles.title}>{review.title}</Text>
          <Pressable
            onPress={() => isTruncated && setIsExpanded(true)}
            style={styles.contentContainer}>
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
              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.actionButton}
                onPress={handleLikePress}>
                <Icon
                  name="thumbs-up"
                  size={18}
                  color={review.isLiked ? colors.gray[900] : colors.gray[400]}
                />
                <Text style={[styles.actionText, review.isLiked && styles.activeActionText]}>
                  {review.likeCount}
                </Text>
              </Pressable>
              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.actionButton}
                onPress={handleReplyPress}>
                <Icon
                  name="message-circle"
                  size={18}
                  color={showComments ? colors.gray[900] : colors.gray[400]}
                />
                <Text style={[styles.actionText, showComments && styles.activeActionText]}>
                  {review.commentCount}
                </Text>
              </Pressable>
              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.actionButton}
                onPress={() => {
                  onCommentPress?.(review.id);
                }}>
                <Text style={styles.replyButtonText}>답글 달기</Text>
              </Pressable>
            </View>
          </View>
          {showComments && (
            <View style={styles.commentSection}>
              <CommentList reviewId={review.id} onReply={handleReply} />
            </View>
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
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    position: 'relative',
    zIndex: 1,
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
    gap: spacing.xs,
  },
  date: {
    fontSize: 13,
    color: colors.gray[500],
    marginLeft: spacing.sm,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  bookInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
    ...Platform.select({
      android: {
        paddingVertical: 6,
      },
    }),
  },
  bookAuthor: {
    fontSize: 11,
    color: colors.gray[500],
  },
  bookInfo: {
    gap: 2,
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[700],
    ...Platform.select({
      ios: {
        marginTop: 6,
      },
    }),
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
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  activeActionText: {
    color: colors.gray[900],
  },
  commentSection: {
    marginTop: spacing.md,
    paddingLeft: spacing.xl,
  },
  replyButtonText: {
    fontSize: 14,
    color: colors.gray[600],
    marginLeft: spacing.xs,
  },
  moreButton: {
    position: 'absolute',
    top: 14,
    right: 10,
    zIndex: 2,
  },
});
