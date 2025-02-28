import { Author } from './author';
import { BaseEntity, PaginationQuery } from './common';

export interface Book extends BaseEntity {
  title: string;
  description: string | null;
  imageUrl: string | null;
  publisher: string | null;
  publicationDate: string | null;
  isbn: number | null;
  isbn13: number | null;
  likeCount: number;
  isLiked: boolean;
  reviewCount: number;
  authorBooks: {
    id: number;
    authorId: number;
    bookId: number;
    author: Author;
  }[];
  totalTranslationCount: number;
  bookOriginalWorks: {
    id: number;
    bookId: number;
    originalWorkId: number;
    originalWork: {
      id: number;
      title: string;
      titleInEng: string | null;
      authorBooks: {
        id: number;
        authorId: number;
        bookId: number;
        author: {
          id: number;
          nameInKor: string;
          nameInEng: string | null;
        };
      }[];
    };
  }[];
  genre: {
    id: number;
    name: string;
  } | null;
}
export interface BookDetail extends Book {
  isLiked: boolean;
}

export interface BookSearchQuery extends PaginationQuery {
  searchBy?: (
    | 'title'
    | 'description'
    | 'publisher'
    | 'isbn'
    | 'isbn13'
    | 'authorBooks.author.nameInKor'
  )[];
}
