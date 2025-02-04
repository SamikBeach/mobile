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

interface CreateCommentParams {
  reviewId: number;
  comment: Comment;
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

  function createCommentQueryData({ reviewId, comment }: CreateCommentParams) {
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
    queryClient.setQueryData<AxiosResponse<Review>>(['review', reviewId], reviewData => {
      if (!reviewData) return reviewData;
      return {
        ...reviewData,
        data: {
          ...reviewData.data,
          commentCount: reviewData.data.commentCount + 1,
        },
      };
    });
  }

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
