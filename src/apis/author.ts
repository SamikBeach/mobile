import axios from '@/lib/axios';
import type { Book } from '@/types/book';
import type { PaginatedResponse, PaginationQuery } from '@/types/common';
import type { Review } from '@/types/review';
import type { Author, AuthorDetail, AuthorSearchQuery } from '@/types/author';

export const authorApi = {
  searchAuthors: (params: AuthorSearchQuery) =>
    axios.get<PaginatedResponse<Author>>('/author/search', {
      params,
    }),

  getAllAuthors: () => axios.get<Author[]>('/author'),

  getAuthorDetail: (authorId: number) => axios.get<AuthorDetail>(`/author/${authorId}`),

  toggleAuthorLike: (authorId: number) =>
    axios.post<{ liked: boolean }>(`/author/${authorId}/like`),

  getAllAuthorBooks: (authorId: number) => axios.get<Book[]>(`/author/${authorId}/books`),

  getAuthorReviews: (authorId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<Review>>(`/author/${authorId}/reviews`, {
      params,
    }),
};
