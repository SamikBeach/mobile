import axios from '@/lib/axios';
import { Author } from '@/types/author';
import { Book } from '@/types/book';

interface SearchResponse {
  books: Book[];
  authors: Author[];
}

export const searchApi = {
  search: (keyword: string) =>
    axios.get<SearchResponse>('/search', {
      params: {
        keyword,
      },
    }),
};
