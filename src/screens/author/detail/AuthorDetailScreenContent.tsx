import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Platform, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '@/components/common/Text';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { ReviewItem } from '@/components/review/ReviewItem';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/common';
import type { AxiosResponse } from 'axios';
import { ReviewItemSkeleton } from '@/components/common/Skeleton';
import { AuthorDetailInfo } from './AuthorDetailInfo';
import { AuthorBooks } from './AuthorBooks';
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
import { AuthorInfluenced } from './AuthorInfluenced';
import { AuthorOriginalWorks } from './AuthorOriginalWorks';
import { AuthorChat } from './AuthorChat';
import { AuthorYoutubes } from './AuthorYoutubes';
import { Skeleton } from '@/components/common/Skeleton';
import { getJosa } from '@/utils/text';

interface Props {
  authorId: number;
}

export function AuthorDetailScreenContent({ authorId }: Props) {
  const flatListRef = useRef<FlatList>(null);
  const chatContainerRef = useRef<View>(null);
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [replyToUser, setReplyToUser] = useState<{ nickname: string } | null>(null);
  const [isReplyAnimating, setIsReplyAnimating] = useState(false);
  const { createCommentQueryData } = useCommentQueryData();
  const reviewRefs = useRef<{ [key: number]: React.RefObject<ReviewItemHandle> }>({});
  const commentEditorRef = useRef<TextInput>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // 작가 ID가 변경될 때 스크롤 위치 초기화
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    setIsChatOpen(false);
  }, [authorId]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
    AxiosResponse<PaginatedResponse<Review>>,
    Error
  >({
    queryKey: ['author-reviews', authorId],
    queryFn: ({ pageParam = 1 }) =>
      authorApi.getAuthorReviews(authorId, {
        page: pageParam as number,
        limit: 20,
      }),
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

  const { data: author, isLoading: isAuthorLoading } = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => authorApi.getAuthorDetail(authorId),
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
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
      viewPosition: 0,
    });
  };

  const handleChatButtonPress = () => {
    setIsChatOpen(prev => !prev);
  };

  const ListHeaderComponent = (
    <View style={styles.listHeader}>
      <AuthorDetailInfo authorId={authorId} onReviewPress={handleReviewPress} />

      {isAuthorLoading ? (
        <Skeleton style={styles.chatButtonSkeleton} />
      ) : (
        author && (
          <View>
            <TouchableOpacity style={styles.chatButton} onPress={handleChatButtonPress}>
              <Icon name="message-circle" size={20} color={colors.gray[700]} />
              <Text style={styles.chatButtonText}>
                {isChatOpen
                  ? '채팅 닫기'
                  : `${author.nameInKor}${getJosa(author.nameInKor)} 대화하기`}
              </Text>
            </TouchableOpacity>

            {isChatOpen && (
              <View ref={chatContainerRef} style={styles.chatContainer}>
                <AuthorChat authorId={authorId} authorName={author.nameInKor} />
              </View>
            )}
          </View>
        )
      )}

      <AuthorInfluenced authorId={authorId} />
      <AuthorOriginalWorks authorId={authorId} />
      <AuthorBooks authorId={authorId} />
      <AuthorYoutubes authorId={authorId} />

      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>리뷰</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{author?.reviewCount ?? 0}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const ListEmptyComponent = (
    <View style={styles.emptyContainer}>
      <Empty
        icon={<Icon name="message-square" size={48} color={colors.gray[400]} />}
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
      createCommentQueryData({
        reviewId,
        comment: response.data,
      });
      Toast.show({
        type: 'success',
        text1: '댓글이 등록되었습니다.',
      });
      setActiveReviewId(null);
      setReplyToUser(null);
      handleCommentSuccess(reviewId);
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: '댓글 작성에 실패했습니다.',
      });
    },
  });

  const handleCommentPress = (reviewId: number, user?: { nickname: string }) => {
    if (!user) {
      const reviewIndex = reviews.findIndex(review => review.id === reviewId);
      if (reviewIndex !== -1) {
        flatListRef.current?.scrollToIndex({
          index: reviewIndex,
          animated: true,
          viewPosition: 0,
        });
      }
      commentEditorRef.current?.clear();
    }

    setActiveReviewId(reviewId);
    if (user) {
      setReplyToUser(user);
    } else {
      setReplyToUser(null);
    }

    setIsReplyAnimating(true);
    setTimeout(() => {
      setIsReplyAnimating(false);
    }, 3000);
  };

  const getReviewRef = (reviewId: number) => {
    if (!reviewRefs.current[reviewId]) {
      reviewRefs.current[reviewId] = React.createRef();
    }
    return reviewRefs.current[reviewId];
  };

  const handleCommentSuccess = (reviewId: number) => {
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    if (reviewIndex !== -1) {
      flatListRef.current?.scrollToIndex({
        index: reviewIndex,
        animated: true,
        viewPosition: 0,
      });
    }
  };

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
                showBookInfo
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
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginVertical: spacing.md,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
  },
  chatContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    height: 400, // 채팅 컨테이너 높이 설정
  },
  chatButtonSkeleton: {
    marginVertical: spacing.md,
    marginHorizontal: spacing.lg,
    height: 48,
    borderRadius: borderRadius.md,
  },
});
