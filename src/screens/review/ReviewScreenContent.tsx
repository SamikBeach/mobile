import React, { Fragment, ReactNode } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from '@/components/common/Text';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { reviewApi } from '@/apis/review';
import { CommentItem } from '@/components/comment/CommentItem';
import { EmptyComments } from './EmptyComments';
import { CommentSkeleton } from '@/components/comment/CommentSkeleton';
import { AxiosResponse } from 'axios';
import { PaginatedResponse } from '@/types/common';
import { Comment } from '@/types/review';

interface Props {
  reviewId: number;
  onReply: (user: { nickname: string }) => void;
  ListHeaderComponent?: ReactNode;
}

export function ReviewScreenContent({ reviewId, onReply, ListHeaderComponent }: Props) {
  const { data: review } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => reviewApi.getReviewDetail(reviewId),
    select: response => response.data,
  });

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    AxiosResponse<PaginatedResponse<Comment>>,
    Error
  >({
    queryKey: ['comments', reviewId],
    queryFn: ({ pageParam = 1 }) => {
      return reviewApi.searchComments(reviewId, {
        page: pageParam as number,
        limit: 20,
      });
    },
    initialPageParam: 1,
    getNextPageParam: param => {
      const nextParam = param.data.links.next;
      const query = nextParam?.split('?')[1];
      const pageParam = query
        ?.split('&')
        .find(q => q.startsWith('page'))
        ?.split('=')[1];

      return pageParam;
    },
  });

  const comments = data?.pages.flatMap(page => page.data.data) ?? [];

  if (isLoading) {
    return <CommentSkeleton />;
  }

  return (
    <View style={styles.container}>
      {comments.length === 0 ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>댓글</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{review?.commentCount}</Text>
            </View>
          </View>
          <EmptyComments />
        </>
      ) : (
        <FlatList
          ListHeaderComponent={
            <Fragment>
              {ListHeaderComponent}
              <View style={styles.header}>
                <Text style={styles.title}>댓글</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{review?.commentCount}</Text>
                </View>
              </View>
            </Fragment>
          }
          data={comments}
          renderItem={({ item }) => (
            <CommentItem comment={item} reviewId={reviewId} onReply={onReply} />
          )}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  listContent: {
    paddingHorizontal: 20,
  },
});
