import { useQueryClient } from '@tanstack/react-query';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/common';
import type { AxiosResponse } from 'axios';
import type { InfiniteData } from '@tanstack/react-query';
import { AuthorDetail } from '@/types/author';
import { Book } from '@/types/book';
import { BookDetail } from '@/types/book';
import { UserBase } from '@/types/user';

interface UpdateLikeParams {
  reviewId: number;
  bookId?: number;
  authorId?: number;
  userId?: number;
  isOptimistic: boolean;
  currentStatus?: {
    isLiked: boolean;
    likeCount: number;
  };
}

interface UpdateReviewParams {
  reviewId: number;
  bookId?: number;
  authorId?: number;
  userId?: number;
  updatedReview: AxiosResponse<Review>;
}

interface DeleteReviewParams {
  reviewId: number;
  bookId: number;
  authorId?: number;
  userId?: number;
}

interface CreateReviewParams {
  bookId: number;
  newReview: Review;
  currentUser: UserBase;
}

export function useReviewQueryData() {
  const queryClient = useQueryClient();

  function updateReviewLikeQueryData({
    reviewId,
    authorId,
    userId,
    isOptimistic,
    currentStatus,
  }: UpdateLikeParams) {
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

    // book-reviews 쿼리 데이터 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
      {
        queryKey: ['book-reviews'],
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

    // author-reviews 쿼리 데이터 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
      {
        queryKey: ['author-reviews', authorId],
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

      // Rollback case
      return {
        ...reviewDetailData,
        data: {
          ...reviewDetailData.data,
          isLiked: currentStatus?.isLiked ?? reviewDetailData.data.isLiked,
          likeCount: currentStatus?.likeCount ?? reviewDetailData.data.likeCount,
        },
      };
    });

    // user-reviews 쿼리 데이터 업데이트
    if (userId) {
      queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
        {
          queryKey: ['user-reviews', userId],
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
    }
  }

  function updateReviewDataQueryData({
    reviewId,
    bookId,
    authorId,
    userId,
    updatedReview,
  }: UpdateReviewParams) {
    // 단일 리뷰 업데이트
    queryClient.setQueryData<AxiosResponse<Review>>(['review', reviewId], updatedReview);

    // 책의 리뷰 목록 업데이트
    if (bookId) {
      queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
        { queryKey: ['book-reviews', bookId] },
        reviewListData => {
          if (!reviewListData) return reviewListData;
          return {
            ...reviewListData,
            pages: reviewListData.pages.map(reviewPage => ({
              ...reviewPage,
              data: {
                ...reviewPage.data,
                data: reviewPage.data.data.map(review =>
                  review.id === reviewId
                    ? {
                        ...review,
                        ...updatedReview.data,
                      }
                    : review,
                ),
              },
            })),
          };
        },
      );
    }

    // 작가의 리뷰 목록 업데이트
    if (authorId) {
      queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
        { queryKey: ['author-reviews', authorId] },
        reviewListData => {
          if (!reviewListData) return reviewListData;
          return {
            ...reviewListData,
            pages: reviewListData.pages.map(reviewPage => ({
              ...reviewPage,
              data: {
                ...reviewPage.data,
                data: reviewPage.data.data.map(review =>
                  review.id === reviewId
                    ? {
                        ...review,
                        ...updatedReview.data,
                      }
                    : review,
                ),
              },
            })),
          };
        },
      );
    }

    // 전체 리뷰 목록 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
      { queryKey: ['reviews'] },
      reviewListData => {
        if (!reviewListData) return reviewListData;
        return {
          ...reviewListData,
          pages: reviewListData.pages.map((reviewPage, index) =>
            index === 0
              ? {
                  ...reviewPage,
                  data: {
                    ...reviewPage.data,
                    data: [
                      {
                        ...reviewListData.pages[0].data.data[0],
                        ...updatedReview.data,
                      },
                      ...reviewPage.data.data.filter(review => review.id !== updatedReview.data.id),
                    ],
                    meta: {
                      ...reviewPage.data.meta,
                      totalItems: reviewPage.data.meta.totalItems + 1,
                    },
                  },
                }
              : reviewPage,
          ),
        };
      },
    );

    // 사용자의 리뷰 목록 업데이트
    if (userId) {
      queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
        { queryKey: ['user-reviews', userId] },
        reviewListData => {
          if (!reviewListData) return reviewListData;
          return {
            ...reviewListData,
            pages: reviewListData.pages.map((reviewPage, index) =>
              index === 0
                ? {
                    ...reviewPage,
                    data: {
                      ...reviewPage.data,
                      data: [
                        updatedReview.data,
                        ...reviewPage.data.data.filter(review => review.id !== reviewId),
                      ],
                    },
                  }
                : {
                    ...reviewPage,
                    data: {
                      ...reviewPage.data,
                      data: reviewPage.data.data.filter(review => review.id !== reviewId),
                    },
                  },
            ),
          };
        },
      );
    }
  }

  function deleteReviewDataQueryData({ reviewId, bookId, authorId, userId }: DeleteReviewParams) {
    // 책의 리뷰 목록 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
      { queryKey: ['book-reviews', bookId] },
      reviewListData => {
        if (!reviewListData) return reviewListData;
        return {
          ...reviewListData,
          pages: reviewListData.pages.map(reviewPage => ({
            ...reviewPage,
            data: {
              ...reviewPage.data,
              data: reviewPage.data.data.filter(review => review.id !== reviewId),
            },
          })),
        };
      },
    );

    // 작가의 리뷰 목록 업데이트
    if (authorId) {
      queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
        { queryKey: ['author-reviews', authorId] },
        reviewListData => {
          if (!reviewListData) return reviewListData;
          return {
            ...reviewListData,
            pages: reviewListData.pages.map(reviewPage => ({
              ...reviewPage,
              data: {
                ...reviewPage.data,
                data: reviewPage.data.data.filter(review => review.id !== reviewId),
              },
            })),
          };
        },
      );

      // 작가 상세 정보의 리뷰 카운트 업데이트
      queryClient.setQueryData<AxiosResponse<AuthorDetail>>(
        ['author', authorId],
        authorDetailData => {
          if (!authorDetailData) return authorDetailData;
          return {
            ...authorDetailData,
            data: {
              ...authorDetailData.data,
              reviewCount: (authorDetailData.data.reviewCount ?? 0) - 1,
            },
          };
        },
      );
    }

    // 책 상세 정보의 리뷰 카운트 업데이트
    queryClient.setQueryData<AxiosResponse<BookDetail>>(['book', bookId], bookDetailData => {
      if (!bookDetailData) return bookDetailData;
      return {
        ...bookDetailData,
        data: {
          ...bookDetailData.data,
          reviewCount: (bookDetailData.data.reviewCount ?? 0) - 1,
        },
      };
    });

    // 사용자의 리뷰 목록 업데이트
    if (userId) {
      queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
        { queryKey: ['user-reviews', userId] },
        reviewListData => {
          if (!reviewListData) return reviewListData;
          return {
            ...reviewListData,
            pages: reviewListData.pages.map(reviewPage => ({
              ...reviewPage,
              data: {
                ...reviewPage.data,
                data: reviewPage.data.data.filter(review => review.id !== reviewId),
              },
            })),
          };
        },
      );
    }
  }

  function createReviewDataQueryData({ bookId, newReview, currentUser }: CreateReviewParams) {
    const bookDetailData = queryClient.getQueryData<AxiosResponse<Book>>(['book', bookId])?.data;
    if (!bookDetailData) return;

    // 책의 리뷰 목록 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
      { queryKey: ['book-reviews', bookId] },
      reviewListData => {
        if (!reviewListData) return reviewListData;

        return {
          ...reviewListData,
          pages: reviewListData.pages.map((reviewPage, index) =>
            index === 0
              ? {
                  ...reviewPage,
                  data: {
                    ...reviewPage.data,
                    data: [
                      {
                        ...newReview,
                        book: bookDetailData,
                        user: currentUser,
                      },
                      ...reviewPage.data.data,
                    ],
                    meta: {
                      ...reviewPage.data.meta,
                      totalItems: reviewPage.data.meta.totalItems + 1,
                    },
                  },
                }
              : reviewPage,
          ),
        };
      },
    );

    // 책 상세 정보의 리뷰 카운트 업데이트
    queryClient.setQueryData<AxiosResponse<Book>>(['book', bookId], bookDetailData => {
      if (!bookDetailData) return bookDetailData;
      return {
        ...bookDetailData,
        data: {
          ...bookDetailData.data,
          reviewCount: bookDetailData.data.reviewCount + 1,
        },
      };
    });

    // 전체 리뷰 목록 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Review>>>>(
      { queryKey: ['reviews'] },
      reviewListData => {
        if (!reviewListData) return reviewListData;

        return {
          ...reviewListData,
          pages: reviewListData.pages.map((reviewPage, index) =>
            index === 0
              ? {
                  ...reviewPage,
                  data: {
                    ...reviewPage.data,
                    data: [
                      {
                        ...newReview,
                        book: bookDetailData,
                        user: currentUser,
                      },
                      ...reviewPage.data.data,
                    ],
                    meta: {
                      ...reviewPage.data.meta,
                      totalItems: reviewPage.data.meta.totalItems + 1,
                    },
                  },
                }
              : reviewPage,
          ),
        };
      },
    );
  }

  return {
    updateReviewLikeQueryData,
    updateReviewDataQueryData,
    deleteReviewDataQueryData,
    createReviewDataQueryData,
  };
}
