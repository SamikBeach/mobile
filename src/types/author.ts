import { Book } from './book';
import { BaseEntity, PaginationQuery } from './common';
import { Genre } from './genre';

export interface Author extends BaseEntity {
  name: string;
  nameInKor: string;
  imageUrl: string | null;
  bornDate: string | null;
  bornDateIsBc: boolean | null;
  diedDate: string | null;
  diedDateIsBc: boolean | null;
  eraId: number | null;
  likeCount: number;
  reviewCount: number;
  bookCount: number;
  genre: Genre;
  authorBooks: {
    book: Book;
  }[];
  userAuthorLikes: {
    id: number;
    userId: number;
  }[];
  authorOriginalWorks: {
    id: number;
    title: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthorDetail extends Author {
  isLiked: boolean;
}

export interface AuthorSearchQuery extends PaginationQuery {
  filter?: {
    eraId?: number;
    name?: string;
    nameInKor?: string;
    genre_id?: number;
  };
  searchBy?: ('name' | 'nameInKor' | 'genre_id')[];
}
