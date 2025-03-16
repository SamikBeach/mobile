import axios from '@/lib/axios';
import { Author } from '@/types/author';
import { Book } from '@/types/book';

interface SearchResponse {
  books: Book[];
  authors: Author[];
}

export const searchApi = {
  /**
   * 도서와 작가를 검색합니다.
   * @param keyword - 검색어
   * @returns 검색된 도서와 작가 목록
   */
  search: (keyword: string) =>
    axios.get<SearchResponse>('/search', {
      params: {
        keyword,
      },
    }),
};
