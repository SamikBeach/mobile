import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Platform, TextInput } from 'react-native';
import { Text } from '@/components/common/Text';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { ReviewItem } from '@/components/review/ReviewItem';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/common';
import type { AxiosResponse } from 'axios';
import { ReviewItemSkeleton } from '@/components/common/Skeleton';
import { BookDetailInfo } from './BookDetailInfo';
import { RelativeBooks } from './RelativeBooks';
import { Empty } from '@/components/common/Empty';
import Icon from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import { CommentEditor } from '@/components/comment/CommentEditor';
import { reviewApi } from '@/apis/review';
import { useCommentQueryData } from '@/hooks/useCommentQueryData';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import type { ReviewItemHandle } from '@/components/review/ReviewItem';
import { SlideInDown } from 'react-native-reanimated';
import { BookYoutubes } from './BookYoutubes';
import { BookChat } from './BookChat';
import { useAtom } from 'jotai';
import { includeOtherTranslationsAtom } from '@/atoms/book';
import { Switch } from 'react-native';

interface Props {
  bookId: number;
}

export function BookDetailScreenContent({ bookId }: Props) {
  const flatListRef = useRef<FlatList>(null);
  const chatContainerRef = useRef<View>(null);
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [replyToUser, setReplyToUser] = useState<{ nickname: string } | null>(null);
  const [isReplyAnimating, setIsReplyAnimating] = useState(false);
  const { createCommentQueryData } = useCommentQueryData();
  const reviewRefs = useRef<{ [key: number]: React.RefObject<ReviewItemHandle> }>({});
  const commentEditorRef = useRef<TextInput>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [includeOtherTranslations, setIncludeOtherTranslations] = useAtom(
    includeOtherTranslationsAtom,
  );

  // 책 ID가 변경될 때 스크롤 위치 초기화
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    setIsChatOpen(false);
  }, [bookId]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
    AxiosResponse<PaginatedResponse<Review>>,
    Error
  >({
    queryKey: ['book-reviews', bookId, includeOtherTranslations],
    queryFn: ({ pageParam = 1 }) =>
      bookApi.searchBookReviews(
        bookId,
        {
          page: pageParam as number,
          limit: 20,
        },
        includeOtherTranslations,
      ),
    getNextPageParam: param => {
      const nextParam = param.data.links.next;
      const query = nextParam?.split('?')[1];
      const pageParam = query
        ?.split('&')
        .find(q => q.startsWith('page'))
        ?.split('=')[1];

      return pageParam;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });

  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => bookApi.getBookDetail(bookId),
    select: response => response.data,
    staleTime: 60 * 1000,
  });

  const reviews = data?.pages.flatMap(page => page.data.data) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleReviewPress = () => {
    if (reviews.length === 0) return;

    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
      viewPosition: 0,
    });
  };

  const handleChatButtonPress = () => {
    setIsChatOpen(prev => !prev);
  };

  const getReviewRef = (reviewId: number) => {
    if (!reviewRefs.current[reviewId]) {
      reviewRefs.current[reviewId] = React.createRef<ReviewItemHandle>();
    }
    return reviewRefs.current[reviewId];
  };

  const handleCommentPress = (reviewId: number, user?: { nickname: string }) => {
    setActiveReviewId(reviewId);
    setReplyToUser(user || null);
    setIsReplyAnimating(true);

    setTimeout(() => {
      setIsReplyAnimating(false);
      commentEditorRef.current?.focus();
    }, 300);
  };

  const ListHeaderComponent = (
    <View style={styles.listHeader}>
      <BookDetailInfo
        bookId={bookId}
        onReviewPress={handleReviewPress}
        onChatToggle={handleChatButtonPress}
        isChatOpen={isChatOpen}
      />

      {isChatOpen && book && (
        <View ref={chatContainerRef} style={styles.chatContainer}>
          <BookChat bookId={bookId} bookTitle={book.title} />
        </View>
      )}

      <RelativeBooks bookId={bookId} />
      <BookYoutubes bookId={bookId} />

      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>리뷰</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{book?.reviewCount ?? 0}</Text>
          </View>
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

  const ListEmptyComponent = (
    <View style={styles.emptyContainer}>
      <Empty
        icon={<Icon name="book-open" size={48} color={colors.gray[400]} />}
        message="아직 리뷰가 없어요"
        description="첫 번째 리뷰를 작성해보세요"
      />
    </View>
  );

  const { mutate: createComment } = useMutation({
    mutationFn: (params: { reviewId: number; content: string }) =>
      reviewApi.createComment(params.reviewId, { content: params.content }),
    onMutate: async ({ reviewId }) => {
      const reviewRef = getReviewRef(reviewId);
      if (reviewRef?.current) {
        reviewRef.current.expandComments?.();
      }
    },
    onSuccess: (response, { reviewId }) => {
      const newComment = response.data;
      createCommentQueryData({
        reviewId: reviewId,
        comment: newComment,
      });
      setActiveReviewId(null);
      setReplyToUser(null);

      Toast.show({
        type: 'success',
        text1: '댓글이 작성되었습니다.',
        position: 'bottom',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '댓글 작성 실패',
        text2: '잠시 후 다시 시도해주세요.',
        position: 'bottom',
      });
    },
  });

  // 채팅 열릴 때 스크롤 처리
  useEffect(() => {
    if (isChatOpen && chatContainerRef.current) {
      // 약간의 지연 후 스크롤 실행 (레이아웃이 완전히 렌더링된 후)
      setTimeout(() => {
        chatContainerRef.current?.measureInWindow((_, y) => {
          flatListRef.current?.scrollToOffset({
            offset: y,
            animated: true,
          });
        });
      }, 300);
    }
  }, [isChatOpen]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={reviews}
        keyExtractor={item => `review-${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.reviewItemContainer}>
            {isLoading ? (
              <ReviewItemSkeleton />
            ) : (
              <ReviewItem
                ref={getReviewRef(item.id)}
                review={item}
                onCommentPress={handleCommentPress}
              />
            )}
          </View>
        )}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={!isLoading ? ListEmptyComponent : null}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.reviewList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ReviewItemSkeleton /> : null}
      />
      <Animated.View
        entering={SlideInDown.duration(300)}
        style={[styles.commentEditorContainer, { display: activeReviewId ? 'flex' : 'none' }]}>
        <CommentEditor
          textInputRef={commentEditorRef}
          onSubmit={content => {
            createComment({ reviewId: activeReviewId!, content });
          }}
          onCancel={() => {
            setActiveReviewId(null);
            setReplyToUser(null);
          }}
          replyToUser={replyToUser}
          autoFocus
          isReplying={isReplyAnimating}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  listHeader: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
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
    height: spacing.md,
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
