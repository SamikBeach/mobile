import { transformFilterParams } from '@/utils/api';
import axios from '@/lib/axios';
import type { PaginatedResponse, PaginationQuery } from '@/types/common';
import type { Review } from '@/types/review';
import type { Book, BookDetail, BookSearchQuery } from '@/types/book';

export const bookApi = {
  searchBooks: (params: BookSearchQuery) =>
    axios.get<PaginatedResponse<Book>>('/book/search', {
      params: transformFilterParams(params),
    }),

  getBookDetail: (bookId: number) => axios.get<BookDetail>(`/book/${bookId}`),

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
};
