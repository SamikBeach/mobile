import axios from '@/lib/axios';
import type { PaginatedResponse } from '@/types/common';
import type {
  Comment,
  CommentSearchQuery,
  CreateCommentDto,
  CreateReviewDto,
  Review,
  ReviewSearchQuery,
  UpdateCommentDto,
  UpdateReviewDto,
} from '@/types/review';

export const reviewApi = {
  searchReviews: (params: ReviewSearchQuery) =>
    axios.get<PaginatedResponse<Review>>('/review/search', { params }),

  getReviewDetail: (reviewId: number) => axios.get<Review>(`/review/${reviewId}`),

  createReview: (bookId: number, data: CreateReviewDto) =>
    axios.post<Review>(`/review/book/${bookId}`, data),

  updateReview: (reviewId: number, data: UpdateReviewDto) =>
    axios.patch<Review>(`/review/${reviewId}`, data),

  deleteReview: (reviewId: number) => axios.delete<void>(`/review/${reviewId}`),

  searchComments: (reviewId: number, params: CommentSearchQuery) =>
    axios.get<PaginatedResponse<Comment>>(`/review/${reviewId}/comments`, {
      params,
    }),

  createComment: (reviewId: number, data: CreateCommentDto) =>
    axios.post<Comment>(`/review/${reviewId}/comment`, data),

  updateComment: (reviewId: number, commentId: number, data: UpdateCommentDto) =>
    axios.patch<Comment>(`/review/${reviewId}/comment/${commentId}`, data),

  deleteComment: (reviewId: number, commentId: number) =>
    axios.delete<void>(`/review/${reviewId}/comment/${commentId}`),

  toggleReviewLike: (reviewId: number) =>
    axios.post<{ liked: boolean }>(`/review/${reviewId}/like`),

  toggleCommentLike: (reviewId: number, commentId: number) =>
    axios.post<{ liked: boolean }>(`/review/${reviewId}/comment/${commentId}/like`),

  reportReview: (reviewId: number, data: { reason: string }) =>
    axios.post<void>(`/review/${reviewId}/report`, data),
};
