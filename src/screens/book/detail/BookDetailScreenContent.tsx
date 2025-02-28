import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Switch, Platform, TextInput } from 'react-native';
import { Text } from '@/components/common/Text';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { ReviewItem, type ReviewItemHandle } from '@/components/review/ReviewItem';
import type { Review } from '@/types/review';
import type { Comment } from '@/types/comment';
import type { PaginatedResponse } from '@/types/common';
import type { AxiosResponse } from 'axios';
import { ReviewItemSkeleton } from '@/components/common/Skeleton';
import { BookDetailInfo } from './BookDetailInfo';
import { RelativeBooks } from './RelativeBooks';
import { Empty } from '@/components/common/Empty';
import Icon from 'react-native-vector-icons/Feather';
import Animated, { Easing, Layout, SlideInDown } from 'react-native-reanimated';
import { useAtom } from 'jotai';
import { includeOtherTranslationsAtom } from '@/atoms/book';
import { CommentEditor } from '@/components/comment/CommentEditor';
import { reviewApi } from '@/apis/review';
import { useCommentQueryData } from '@/hooks/useCommentQueryData';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import { BookYoutubes } from './BookYoutubes';
import { BookChat } from './BookChat';
import { ChatButtonSkeleton } from '@/components/common/Skeleton';

interface Props {
  bookId: number;
}

export function BookDetailScreenContent({ bookId }: Props) {
  const [includeOtherTranslations, setIncludeOtherTranslations] = useAtom(
    includeOtherTranslationsAtom,
  );
  const flatListRef = useRef<FlatList>(null);
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [replyToUser, setReplyToUser] = useState<{ nickname: string } | null>(null);
  const [isReplyAnimating, setIsReplyAnimating] = useState(false);
  const { createCommentQueryData } = useCommentQueryData();
  const reviewRefs = useRef<{ [key: number]: React.RefObject<ReviewItemHandle> }>({});
  const [isChatOpen, setIsChatOpen] = useState(false);

  const commentEditorRef = useRef<TextInput>(null);
  const chatContainerRef = useRef<View>(null);

  // 책 ID가 변경될 때 스크롤 위치 초기화
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    setIsChatOpen(false);
  }, [bookId]);

  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => bookApi.getBookDetail(bookId),
    select: response => response.data,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
    AxiosResponse<PaginatedResponse<Review>>,
    Error
  >({
    queryKey: ['book-reviews', bookId, includeOtherTranslations],
    queryFn: ({ pageParam }) =>
      bookApi.searchBookReviews(
        bookId,
        {
          page: pageParam as number,
          limit: 20,
        },
        includeOtherTranslations,
      ),
    initialPageParam: 1,
    getNextPageParam: param => {
      const nextParam = param.data.links.next;
      const query = nextParam?.split('?')[1];
      if (!query) return undefined;

      const urlParams = new URLSearchParams(query);
      const page = urlParams.get('page');
      return page ? parseInt(page, 10) : undefined;
    },
    placeholderData: keepPreviousData,
  });

  const reviews = data?.pages.flatMap(page => page.data.data) || [];

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleReviewPress = () => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  const handleReplyPress = (reviewId: number, user?: { nickname: string }) => {
    setActiveReviewId(reviewId);
    setReplyToUser(user || null);
    setIsReplyAnimating(true);
    setTimeout(() => {
      setIsReplyAnimating(false);
      commentEditorRef.current?.focus();
    }, 500);
  };

  const handleCancelReply = () => {
    setActiveReviewId(null);
    setReplyToUser(null);
  };

  const { mutate: createComment } = useMutation({
    mutationFn: (content: string) => {
      if (!activeReviewId) {
        throw new Error('No active review');
      }
      return reviewApi.createComment(activeReviewId, { content });
    },
    onSuccess: response => {
      const newComment = response.data;
      createCommentQueryData({
        reviewId: newComment.review.id,
        comment: newComment,
      });
      handleCancelReply();

      // 댓글이 추가된 리뷰 아이템 찾기
      const reviewRef = reviewRefs.current[newComment.review.id];
      if (reviewRef?.current) {
        reviewRef.current.expandComments?.();
      }
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '댓글 작성 실패',
        text2: '잠시 후 다시 시도해주세요.',
      });
    },
  });

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);

    // 채팅이 열릴 때 스크롤 위치 조정
    if (!isChatOpen) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
            flatListRef.current?.scrollToOffset({
              offset: pageY - 100,
              animated: true,
            });
          });
        }
      }, 100);
    }
  };

  const renderReviewItem = ({ item }: { item: Review }) => {
    // 리뷰 아이템마다 ref 생성
    if (!reviewRefs.current[item.id]) {
      reviewRefs.current[item.id] = React.createRef<ReviewItemHandle>();
    }

    return (
      <View style={styles.reviewItemContainer}>
        <ReviewItem
          ref={reviewRefs.current[item.id]}
          review={item}
          onCommentPress={handleReplyPress}
        />
      </View>
    );
  };

  const renderListHeader = () => {
    return (
      <View style={styles.listHeader}>
        <BookDetailInfo
          bookId={bookId}
          onReviewPress={handleReviewPress}
          onChatToggle={handleChatToggle}
          isChatOpen={isChatOpen}
        />

        {isChatOpen && book && (
          <View ref={chatContainerRef} style={styles.chatContainer}>
            <BookChat bookId={bookId} bookTitle={book.title} />
          </View>
        )}

        <BookYoutubes bookId={bookId} />

        <RelativeBooks bookId={bookId} />

        <View style={styles.reviewsHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Text style={styles.reviewsTitle}>리뷰</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{reviews.length}</Text>
            </View>
          </View>

          <Pressable
            style={styles.toggleContainer}
            onPress={() => setIncludeOtherTranslations(!includeOtherTranslations)}>
            <Text style={styles.toggleLabel}>다른 번역본 포함</Text>
            <Switch
              value={includeOtherTranslations}
              onValueChange={setIncludeOtherTranslations}
              trackColor={{ false: colors.gray[200], true: colors.blue[500] }}
              thumbColor={colors.white}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderListEmpty = () => {
    if (isLoading) {
      return (
        <View style={{ gap: spacing.md, paddingHorizontal: spacing.lg }}>
          <ReviewItemSkeleton />
          <ReviewItemSkeleton />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Empty
          icon="book-open"
          message="아직 리뷰가 없어요"
          description="첫 번째 리뷰를 작성해보세요!"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.reviewList}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {activeReviewId && (
        <Animated.View
          style={styles.commentEditorContainer}
          entering={isReplyAnimating ? SlideInDown : undefined}
          layout={Layout.springify()}>
          <CommentEditor onSubmit={createComment} onCancel={handleCancelReply} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  badge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[600],
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    cursor: 'pointer',
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.gray[600],
  },
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
  },
  reviewList: {
    paddingBottom: spacing.lg,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  listHeader: {
    gap: spacing.xl,
  },
  reviewItemContainer: {
    paddingHorizontal: spacing.lg,
  },
  commentEditorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    padding: spacing.lg,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        paddingBottom: spacing.lg,
      },
    }),
  },
  chatContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    height: 400, // 채팅 컨테이너 높이 설정
  },
});
