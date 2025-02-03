import { PaginatedResponse } from '@/types/common';
import { Review } from '@/types/review';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface UpdateLikeParams {
  reviewId: number;
  isOptimistic: boolean;
  currentStatus?: {
    isLiked: boolean;
    likeCount: number;
  };
}

export function useReviewQueryData() {
  const queryClient = useQueryClient();

  function updateReviewLikeQueryData({ reviewId, isOptimistic, currentStatus }: UpdateLikeParams) {
    // 리뷰 목록 쿼리 데이터 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
      {
        queryKey: ['reviews'],
        exact: false,
      },
      reviewListData => {
        if (!reviewListData) return reviewListData;
        return {
          ...reviewListData,
          pages: reviewListData.pages.map(reviewPage => ({
            ...reviewPage,
            data: {
              ...reviewPage.data,
              data: reviewPage.data.data.map(review => {
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

    // 단일 리뷰 쿼리 데이터 업데이트
    queryClient.setQueryData<AxiosResponse<Review>>(['review', reviewId], reviewDetailData => {
      if (!reviewDetailData) return reviewDetailData;

      if (isOptimistic) {
        return {
          ...reviewDetailData,
          data: {
            ...reviewDetailData.data,
            isLiked: !reviewDetailData.data.isLiked,
            likeCount: reviewDetailData.data.isLiked
              ? reviewDetailData.data.likeCount - 1
              : reviewDetailData.data.likeCount + 1,
          },
        };
      }

      return {
        ...reviewDetailData,
        data: {
          ...reviewDetailData.data,
          isLiked: currentStatus?.isLiked ?? reviewDetailData.data.isLiked,
          likeCount: currentStatus?.likeCount ?? reviewDetailData.data.likeCount,
        },
      };
    });
  }

  return {
    updateReviewLikeQueryData,
  };
}
