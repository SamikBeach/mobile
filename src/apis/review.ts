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
  /**
   * 리뷰 목록을 검색합니다.
   * @param params - 검색 조건
   * @returns 페이지네이션된 리뷰 목록
   */
  searchReviews: (params: ReviewSearchQuery) =>
    axios.get<PaginatedResponse<Review>>('/review/search', { params }),

  /**
   * 특정 리뷰의 상세 정보를 조회합니다.
   * @param reviewId - 리뷰 ID
   * @returns 리뷰 상세 정보
   */
  getReviewDetail: (reviewId: number) => axios.get<Review>(`/review/${reviewId}`),

  /**
   * 새로운 리뷰를 작성합니다.
   * @param bookId - 책 ID
   * @param data - 리뷰 작성 데이터
   * @returns 생성된 리뷰 정보
   */
  createReview: (bookId: number, data: CreateReviewDto) =>
    axios.post<Review>(`/review/book/${bookId}`, data),

  /**
   * 기존 리뷰를 수정합니다.
   * @param reviewId - 리뷰 ID
   * @param data - 수정할 리뷰 데이터
   * @returns 수정된 리뷰 정보
   */
  updateReview: (reviewId: number, data: UpdateReviewDto) =>
    axios.patch<Review>(`/review/${reviewId}`, data),

  /**
   * 리뷰를 삭제합니다.
   * @param reviewId - 리뷰 ID
   */
  deleteReview: (reviewId: number) => axios.delete<void>(`/review/${reviewId}`),

  /**
   * 리뷰의 댓글 목록을 검색합니다.
   * @param reviewId - 리뷰 ID
   * @param params - 검색 조건
   * @returns 페이지네이션된 댓글 목록
   */
  searchComments: (reviewId: number, params: CommentSearchQuery) =>
    axios.get<PaginatedResponse<Comment>>(`/review/${reviewId}/comments`, {
      params,
    }),

  /**
   * 리뷰에 새로운 댓글을 작성합니다.
   * @param reviewId - 리뷰 ID
   * @param data - 댓글 작성 데이터
   * @returns 생성된 댓글 정보
   */
  createComment: (reviewId: number, data: CreateCommentDto) =>
    axios.post<Comment>(`/review/${reviewId}/comment`, data),

  /**
   * 기존 댓글을 수정합니다.
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   * @param data - 수정할 댓글 데이터
   * @returns 수정된 댓글 정보
   */
  updateComment: (reviewId: number, commentId: number, data: UpdateCommentDto) =>
    axios.patch<Comment>(`/review/${reviewId}/comment/${commentId}`, data),

  /**
   * 댓글을 삭제합니다.
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   */
  deleteComment: (reviewId: number, commentId: number) =>
    axios.delete<void>(`/review/${reviewId}/comment/${commentId}`),

  /**
   * 리뷰 좋아요를 토글합니다.
   * @param reviewId - 리뷰 ID
   * @returns 토글 후 좋아요 상태
   */
  toggleReviewLike: (reviewId: number) =>
    axios.post<{ liked: boolean }>(`/review/${reviewId}/like`),

  /**
   * 댓글 좋아요를 토글합니다.
   * @param reviewId - 리뷰 ID
   * @param commentId - 댓글 ID
   * @returns 토글 후 좋아요 상태
   */
  toggleCommentLike: (reviewId: number, commentId: number) =>
    axios.post<{ liked: boolean }>(`/review/${reviewId}/comment/${commentId}/like`),

  /**
   * 리뷰를 신고합니다.
   * @param reviewId - 리뷰 ID
   * @param data - 신고 사유
   */
  reportReview: (reviewId: number, data: { reason: string }) =>
    axios.post<void>(`/review/${reviewId}/report`, data),
};
