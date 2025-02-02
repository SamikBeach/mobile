import axios from '@/lib/axios';
import type { Author } from '@/types/author';
import type { PaginatedResponse, PaginationQuery } from '@/types/common';

interface SearchAuthorsParams extends PaginationQuery {
  search?: string;
  searchBy?: string[];
  sortBy?: string;
  filter?: {
    genre_id?: number;
    eraId?: number;
  };
}

export const authorApi = {
  getAllAuthors() {
    return axios.get<Author[]>('/authors');
  },

  getAuthorDetail(authorId: number) {
    return axios.get<Author>(`/authors/${authorId}`);
  },

  searchAuthors(params: SearchAuthorsParams) {
    return axios.get<PaginatedResponse<Author>>('/author/search', {
      params,
    });
  },

  likeAuthor(authorId: number) {
    return axios.post(`/authors/${authorId}/like`);
  },

  unlikeAuthor(authorId: number) {
    return axios.delete(`/authors/${authorId}/like`);
  },
};
