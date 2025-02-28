import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Switch, Platform, TextInput } from 'react-native';
import { Text } from '@/components/common/Text';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { ReviewItem, type ReviewItemHandle } from '@/components/review/ReviewItem';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/common';
import type { AxiosResponse } from 'axios';
import { ReviewItemSkeleton } from '@/components/common/Skeleton';
import { BookDetailInfo } from './BookDetailInfo';
import { RelativeBooks } from './RelativeBooks';
import { Empty } from '@/components/common/Empty';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useAtom } from 'jotai';
import { includeOtherTranslationsAtom } from '@/atoms/book';
import { CommentEditor } from '@/components/comment/CommentEditor';
import { reviewApi } from '@/apis/review';
import { useCommentQueryData } from '@/hooks/useCommentQueryData';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import { BookYoutubes } from './BookYoutubes';
import { BookChat } from './BookChat';

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

      const pageParam = query
        .split('&')
        .find(q => q.startsWith('page'))
        ?.split('=')[1];

      return pageParam;
    },
    placeholderData: keepPreviousData,
  });

  const reviews = data?.pages.flatMap(page => page.data.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleReviewPress = () => {
    // 리뷰가 없을 때 스크롤 시도하지 않도록 체크
    if (reviews.length === 0) {
      return;
    }

    // 리뷰가 있을 때만 스크롤 실행
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
      viewPosition: 0,
      viewOffset: 0,
    });
  };

  const handleReplyPress = (reviewId: number, user?: { nickname: string }) => {
    setActiveReviewId(reviewId);
    setReplyToUser(user || null);
    setIsReplyAnimating(true);

    // 애니메이션이 끝난 후 포커스 설정
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
    mutationFn: ({ reviewId, content }: { reviewId: number; content: string }) => {
      return reviewApi.createComment(reviewId, { content });
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

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <BookDetailInfo
        bookId={bookId}
        onReviewPress={handleReviewPress}
        onChatToggle={handleChatToggle}
        isChatOpen={isChatOpen}
      />

      {isChatOpen && (
        <View style={styles.chatContainer} ref={chatContainerRef}>
          {book && <BookChat bookId={bookId} bookTitle={book.title} />}
        </View>
      )}

      <RelativeBooks bookId={bookId} />
      <BookYoutubes bookId={bookId} />

      <View style={styles.reviewsHeader}>
        <View style={styles.titleSection}>
          <Text style={styles.reviewsTitle}>리뷰</Text>
          {reviews.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{reviews.length}</Text>
            </View>
          )}
        </View>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>다른 번역본 포함</Text>
          <Switch
            value={includeOtherTranslations}
            onValueChange={setIncludeOtherTranslations}
            trackColor={{ false: colors.gray[200], true: colors.blue[500] }}
            thumbColor={colors.white}
          />
        </View>
      </View>
    </View>
  );

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
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
        <Empty icon="book-open" message="아직 리뷰가 없습니다" />
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
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={styles.reviewList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={Platform.OS === 'android'}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: spacing.lg }}>
              <ReviewItemSkeleton />
            </View>
          ) : null
        }
      />
      {activeReviewId && (
        <Animated.View entering={SlideInDown.duration(300)} style={styles.commentEditorContainer}>
          <CommentEditor
            textInputRef={commentEditorRef}
            onSubmit={content => {
              createComment({ reviewId: activeReviewId, content });
            }}
            onCancel={handleCancelReply}
            replyToUser={replyToUser}
            autoFocus
            isReplying={isReplyAnimating}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  reviewList: {
    paddingBottom: spacing.lg,
  },
  separator: {
    height: spacing.md,
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
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    gap: spacing.sm,
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.gray[600],
  },
});
