import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewApi } from '@/apis/review';
import { CommentItem } from './CommentItem';
import { CommentSkeleton } from './CommentSkeleton';
import { Button } from '@/components/common/Button';
import { colors, spacing } from '@/styles/theme';
import type { Comment } from '@/types/comment';
import type { PaginatedResponse } from '@/types/common';
import type { AxiosResponse } from 'axios';

interface Props {
  reviewId: number;
  onReply: (user: { nickname: string }) => void;
}

export function CommentList({ reviewId, onReply }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
    AxiosResponse<PaginatedResponse<Comment>>
  >({
    queryKey: ['comments', reviewId],
    queryFn: ({ pageParam = 1 }) =>
      reviewApi.searchComments(reviewId, {
        page: pageParam as number,
        limit: 20,
      }),
    getNextPageParam: lastPage => {
      const nextParam = lastPage.data.links.next;
      if (!nextParam) return undefined;

      const query = nextParam.split('?')[1];
      if (!query) return undefined;

      const pageParam = query
        .split('&')
        .find(q => q.startsWith('page'))
        ?.split('=')[1];

      return pageParam ? Number(pageParam) : undefined;
    },
    initialPageParam: 1,
  });

  const comments = React.useMemo(() => data?.pages.flatMap(page => page.data.data) ?? [], [data]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <CommentSkeleton />
        <CommentSkeleton />
      </View>
    );
  }

  if (comments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>아직 댓글이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} reviewId={reviewId} onReply={onReply} />
      ))}
      {hasNextPage && (
        <Button
          variant="text"
          onPress={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          style={styles.moreButton}>
          {isFetchingNextPage ? '불러오는 중...' : '댓글 더보기'}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  moreButton: {
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[500],
  },
});
