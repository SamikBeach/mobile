import { useQueryClient } from '@tanstack/react-query';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/common';
import type { AxiosResponse } from 'axios';
import type { InfiniteData } from '@tanstack/react-query';

interface UpdateLikeParams {
  reviewId: number;
  bookId: number;
  isOptimistic: boolean;
  currentStatus?: {
    isLiked: boolean;
    likeCount: number;
  };
}

export function useReviewQueryData() {
  const queryClient = useQueryClient();

  const updateReviewLikeQueryData = ({
    reviewId,
    bookId,
    isOptimistic,
    currentStatus,
  }: UpdateLikeParams) => {
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
      {
        queryKey: ['book-reviews', bookId],
        exact: false,
      },
      oldData => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.map(review => {
                if (review.id !== reviewId) return review;
                return {
                  ...review,
                  isLiked: isOptimistic
                    ? !review.isLiked
                    : currentStatus?.isLiked ?? review.isLiked,
                  likeCount: isOptimistic
                    ? review.isLiked
                      ? review.likeCount - 1
                      : review.likeCount + 1
                    : currentStatus?.likeCount ?? review.likeCount,
                };
              }),
            },
          })),
        };
      },
    );
  };

  return {
    updateReviewLikeQueryData,
  };
}
