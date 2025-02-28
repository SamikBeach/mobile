import { transformFilterParams } from '@/utils/api';
import axios from '@/lib/axios';
import type { PaginatedResponse, PaginationQuery } from '@/types/common';
import type { Review } from '@/types/review';
import type { Book, BookDetail, BookSearchQuery } from '@/types/book';
import type { YouTubeVideo } from '@/types/common';
import type { ChatMessage } from '@/types/common';

export const bookApi = {
  searchBooks: (params: BookSearchQuery) =>
    axios.get<PaginatedResponse<Book>>('/book/search', {
      params: transformFilterParams(params),
    }),

  getBookDetail: (bookId: number, includeOtherTranslations = false) =>
    axios.get<BookDetail>(`/book/${bookId}`, {
      params: { includeOtherTranslations },
    }),

  toggleBookLike: (bookId: number) => axios.post<{ liked: boolean }>(`/book/${bookId}/like`),

  searchRelatedBooks: (bookId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<Book>>(`/book/${bookId}/related/search`, {
      params,
    }),

  getAllRelatedBooks: (bookId: number) => axios.get<Book[]>(`/book/${bookId}/related`),

  searchBookReviews: (bookId: number, params: PaginationQuery, includeOtherTranslations = false) =>
    axios.get<PaginatedResponse<Review>>(`/book/${bookId}/reviews`, {
      params: { ...params, includeOtherTranslations },
    }),

  /**
   * 책 관련 YouTube 동영상을 가져옵니다.
   */
  getBookVideos: (bookId: number, maxResults = 5) =>
    axios.get<YouTubeVideo[]>(`/book/${bookId}/videos`, {
      params: { maxResults },
    }),

  // 책과 채팅하는 함수 추가
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
