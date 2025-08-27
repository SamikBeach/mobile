import { transformFilterParams } from '@/utils/api';
import axios from '@/lib/axios';
import type { PaginatedResponse, PaginationQuery } from '@/types/common';
import type { Review } from '@/types/review';
import type { Book, BookDetail, BookSearchQuery } from '@/types/book';
import type { YouTubeVideo } from '@/types/common';
import type { ChatMessage } from '@/types/common';

export const bookApi = {
  /**
   * 책 목록을 검색합니다.
   * @param params - 검색 조건 (제목, 작가 등으로 필터링 가능)
   * @returns 페이지네이션된 책 목록
   */
  searchBooks: (params: BookSearchQuery) =>
    axios.get<PaginatedResponse<Book>>('/book/search', {
      params: transformFilterParams(params),
    }),

  /**
   * 특정 책의 상세 정보를 조회합니다.
   * @param bookId - 책 ID
   * @param includeOtherTranslations - 다른 번역본 포함 여부
   * @returns 책 상세 정보 (좋아요 여부 포함)
   */
  getBookDetail: (bookId: number, includeOtherTranslations = false) =>
    axios.get<BookDetail>(`/book/${bookId}`, {
      params: { includeOtherTranslations },
    }),

  /**
   * 책 좋아요를 토글합니다.
   * @param bookId - 책 ID
   * @returns 토글 후 좋아요 상태
   */
  toggleBookLike: (bookId: number) => axios.post<{ liked: boolean }>(`/book/${bookId}/like`),

  /**
   * 연관된 책 목록을 검색합니다.
   * @param bookId - 책 ID
   * @param params - 페이지네이션 옵션
   * @returns 페이지네이션된 연관 책 목록
   */
  searchRelatedBooks: (bookId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<Book>>(`/book/${bookId}/related/search`, {
      params,
    }),

  /**
   * 모든 연관된 책 목록을 가져옵니다.
   * @param bookId - 책 ID
   * @returns 전체 연관 책 목록
   */
  getAllRelatedBooks: (bookId: number) => axios.get<Book[]>(`/book/${bookId}/related`),

  /**
   * 책의 리뷰 목록을 검색합니다.
   * @param bookId - 책 ID
   * @param params - 페이지네이션 옵션
   * @param includeOtherTranslations - 다른 번역본의 리뷰 포함 여부
   * @returns 페이지네이션된 리뷰 목록
   */
  searchBookReviews: (bookId: number, params: PaginationQuery, includeOtherTranslations = false) =>
    axios.get<PaginatedResponse<Review>>(`/book/${bookId}/reviews`, {
      params: { ...params, includeOtherTranslations },
    }),

  /**
   * 책 관련 YouTube 동영상을 가져옵니다.
   * @param bookId - 책 ID
   * @param maxResults - 최대 결과 수 (기본값: 5)
   * @returns YouTube 동영상 목록
   */
  getBookVideos: (bookId: number, maxResults = 5) =>
    axios.get<YouTubeVideo[]>(`/book/${bookId}/videos`, {
      params: { maxResults },
    }),

  /**
   * 책과 채팅을 시작합니다.
   * @param bookId - 책 ID
   * @param params - 메시지와 대화 기록
   * @param signal - 요청 취소를 위한 AbortSignal
   * @returns 책의 응답
   */
  chatWithBook: (
    bookId: number,
    params: {
      message: string;
      conversationHistory?: ChatMessage[];
    },
    signal?: AbortSignal,
  ) => {
    return axios.post(`/book/${bookId}/chat`, params, { signal });
  },
};
