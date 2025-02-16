import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useQuery, useMutation } from '@tanstack/react-query';
import { reviewApi } from '@/apis/review';
import { LexicalContent } from '@/components/common/LexicalContent';
import { UserAvatar } from '@/components/common/UserAvatar';
import { LikeButton } from '@/components/common/LikeButton';
import { CommentButton } from '@/components/common/CommentButton';
import { format } from 'date-fns';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigation } from '@react-navigation/native';
import { useReviewQueryData } from '@/hooks/useReviewQueryData';
import { ReviewScreenContent } from './ReviewScreenContent';
import { CommentEditor } from '@/components/comment/CommentEditor';
import { useCommentQueryData } from '@/hooks/useCommentQueryData';
import { spacing, colors } from '@/styles/theme';
import { ReviewHeaderSkeleton } from './ReviewHeaderSkeleton';
import { BookImage } from '@/components/book/BookImage';
import { ReportActions } from '@/components/review/ReportActions';
import Icon from 'react-native-vector-icons/Feather';
import { ReviewActions } from '@/components/review/ReviewActions';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'Review'>;

export function ReviewScreen({ route }: Props) {
  const { reviewId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentUser = useCurrentUser();
  const { updateReviewLikeQueryData, deleteReviewDataQueryData } = useReviewQueryData();
  const [replyToUser, setReplyToUser] = useState<{ nickname: string } | null>(null);
  const { createCommentQueryData } = useCommentQueryData();
  const contentRef = useRef<{ scrollToComments: () => void }>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const { data: review, isLoading } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => reviewApi.getReviewDetail(reviewId),
    select: response => response.data,
  });

  const isMyReview = currentUser?.id === review?.user.id;

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => reviewApi.toggleReviewLike(reviewId),
    onMutate: () => {
      if (!review) return;

      updateReviewLikeQueryData({
        reviewId: reviewId,
        bookId: review.book.id,
        isOptimistic: true,
      });
    },
    onError: () => {
      if (!review) return;

      updateReviewLikeQueryData({
        reviewId: reviewId,
        bookId: review.book.id,
        isOptimistic: false,
        currentStatus: {
          isLiked: review?.isLiked ?? false,
          likeCount: review?.likeCount ?? 0,
        },
      });
    },
  });

  const { mutate: createComment } = useMutation({
    mutationFn: (content: string) => reviewApi.createComment(reviewId, { content }),
    onSuccess: response => {
      createCommentQueryData({ reviewId, comment: response.data });
      setReplyToUser(null);
    },
  });

  const { mutate: deleteReview } = useMutation({
    mutationFn: () => {
      if (!review) return Promise.reject();
      return reviewApi.deleteReview(review.id);
    },
    onSuccess: () => {
      if (!review) return;
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
      navigation.goBack();
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

  const handleMorePress = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }

    setActionSheetVisible(true);
  };

  const handleDeletePress = () => {
    Alert.alert('리뷰 삭제', '정말로 이 리뷰를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => deleteReview() },
    ]);
  };

  const handleEditPress = () => {
    if (!review) return;
    navigation.navigate('WriteReview', {
      bookId: review.book.id,
      reviewId: review.id,
    });
  };

  const renderHeader = () => {
    if (isLoading) {
      return <ReviewHeaderSkeleton />;
    }

    if (!review) {
      return null;
    }

    return (
      <>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{review.title}</Text>
              {isMyReview ? (
                <ReviewActions onEdit={handleEditPress} onDelete={handleDeletePress} />
              ) : (
                currentUser && (
                  <TouchableOpacity onPress={handleMorePress}>
                    <Icon name="more-horizontal" size={24} color={colors.gray[500]} />
                  </TouchableOpacity>
                )
              )}
            </View>
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
          </View>

          <View style={styles.userInfo}>
            <UserAvatar user={review.user} size="sm" showNickname />
            <Text style={styles.dot}>·</Text>
            <Text style={styles.date}>
              {format(new Date(review.createdAt), 'yyyy년 M월 d일 HH시 mm분')}
            </Text>
          </View>
        </View>

        <View style={styles.reviewContent}>
          <LexicalContent content={review.content} isExpanded={true} />
        </View>

        <View style={styles.actions}>
          <LikeButton
            isLiked={review.isLiked ?? false}
            likeCount={review.likeCount}
            onPress={handleLikePress}
          />
          <CommentButton
            commentCount={review.commentCount}
            onPress={() => {
              const content = contentRef.current;
              if (content) {
                content.scrollToComments();
              }
            }}
          />
        </View>
      </>
    );
  };

  const handleSubmit = (content: string) => {
    createComment(content);
  };

  const handleCancel = () => {
    setReplyToUser(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.contentContainer}>
        <ReviewScreenContent
          ref={contentRef}
          reviewId={reviewId}
          onReply={user => setReplyToUser(user)}
          ListHeaderComponent={renderHeader()}
        />
        <View style={styles.editorContainer}>
          <CommentEditor
            replyToUser={replyToUser}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </View>
      </View>
      {review && !isMyReview && currentUser && (
        <ReportActions
          visible={actionSheetVisible}
          onClose={() => setActionSheetVisible(false)}
          reviewId={review.id}
          userId={review.user.id}
          userNickname={review.user.nickname}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 16,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  header: {
    gap: 10,
    marginBottom: 12,
  },
  titleContainer: {
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    ...Platform.select({
      android: {
        paddingVertical: 6,
      },
    }),
  },
  bookAuthor: {
    fontSize: 11,
    color: '#6B7280',
  },
  bookInfo: {
    gap: 2,
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    ...Platform.select({
      ios: {
        marginTop: 6,
      },
    }),
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    color: '#D1D5DB',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewContent: {
    marginBottom: 32,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  editorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    padding: spacing.lg,
    backgroundColor: 'white',
  },
});
