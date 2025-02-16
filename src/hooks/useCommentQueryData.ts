import { Comment, Review } from '@/types/review';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { PaginatedResponse } from '@/types/common';

interface UpdateLikeParams {
  reviewId: number;
  commentId: number;
  isOptimistic: boolean;
  currentStatus?: {
    isLiked: boolean;
    likeCount: number;
  };
}

interface DeleteCommentParams {
  reviewId: number;
  commentId: number;
}

interface UpdateCommentParams {
  reviewId: number;
  commentId: number;
  content: string;
}

export function useCommentQueryData() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  function updateCommentLikeQueryData({
    reviewId,
    commentId,
    isOptimistic,
    currentStatus,
  }: UpdateLikeParams) {
    queryClient.setQueryData<InfiniteData<AxiosResponse<PaginatedResponse<Comment>>>>(
      ['comments', reviewId],
      commentListData => {
        if (!commentListData) return commentListData;
        return {
          ...commentListData,
          pages: commentListData.pages.map(commentPage => ({
            ...commentPage,
            data: {
              ...commentPage.data,
              data: commentPage.data.data.map(comment => {
                if (comment.id !== commentId) return comment;
                return {
                  ...comment,
                  isLiked: isOptimistic
                    ? !comment.isLiked
                    : currentStatus?.isLiked ?? comment.isLiked,
                  likeCount: isOptimistic
                    ? comment.likeCount + (comment.isLiked ? -1 : 1)
                    : currentStatus?.likeCount ?? comment.likeCount,
                };
              }),
            },
          })),
        };
      },
    );
  }

  function deleteCommentQueryData({ reviewId, commentId }: DeleteCommentParams) {
    // 댓글 목록 업데이트
    queryClient.setQueryData<InfiniteData<AxiosResponse<PaginatedResponse<Comment>>>>(
      ['comments', reviewId],
      commentListData => {
        if (!commentListData) return commentListData;
        return {
          ...commentListData,
          pages: commentListData.pages.map(commentPage => ({
            ...commentPage,
            data: {
              ...commentPage.data,
              data: commentPage.data.data.filter(comment => comment.id !== commentId),
            },
          })),
        };
      },
    );

    // 리뷰의 댓글 수 업데이트
    queryClient.setQueryData<AxiosResponse<Review>>(['review', reviewId], reviewData => {
      if (!reviewData) return reviewData;
      return {
        ...reviewData,
        data: {
          ...reviewData.data,
          commentCount: reviewData.data.commentCount - 1,
        },
      };
    });
  }

  const createCommentQueryData = ({
    reviewId,
    comment,
  }: {
    reviewId: number;
    comment: Comment;
  }) => {
    // 댓글 목록 업데이트
    queryClient.setQueryData<InfiniteData<AxiosResponse<PaginatedResponse<Comment>>>>(
      ['comments', reviewId],
      commentListData => {
        if (!commentListData || !currentUser) return commentListData;

        return {
          ...commentListData,
          pages: commentListData.pages.map((commentPage, index) => {
            if (index === 0) {
              return {
                ...commentPage,
                data: {
                  ...commentPage.data,
                  data: [{ ...comment, user: currentUser }, ...commentPage.data.data],
                },
              };
            }
            return commentPage;
          }),
        };
      },
    );

    // 리뷰의 댓글 수 업데이트
    // 1. 도서 리뷰 목록에서 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
      { queryKey: ['book-reviews'], exact: false },
      old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.map(review =>
                review.id === reviewId
                  ? { ...review, commentCount: (review.commentCount ?? 0) + 1 }
                  : review,
              ),
            },
          })),
        };
      },
    );

    // 2. 단일 리뷰 상세에서도 업데이트
    queryClient.setQueryData<AxiosResponse<Review>>(['review', reviewId], old => {
      if (!old) return old;
      return {
        ...old,
        data: {
          ...old.data,
          commentCount: (old.data.commentCount ?? 0) + 1,
        },
      };
    });
  };

  function updateCommentQueryData({ reviewId, commentId, content }: UpdateCommentParams) {
    queryClient.setQueryData<InfiniteData<AxiosResponse<PaginatedResponse<Comment>>>>(
      ['comments', reviewId],
      commentListData => {
        if (!commentListData) return commentListData;
        return {
          ...commentListData,
          pages: commentListData.pages.map(commentPage => ({
            ...commentPage,
            data: {
              ...commentPage.data,
              data: commentPage.data.data.map(comment => {
                if (comment.id !== commentId) return comment;
                return {
                  ...comment,
                  content,
                };
              }),
            },
          })),
        };
      },
    );
  }

  return {
    updateCommentLikeQueryData,
    deleteCommentQueryData,
    createCommentQueryData,
    updateCommentQueryData,
  };
}
