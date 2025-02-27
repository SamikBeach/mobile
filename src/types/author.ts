import { Book } from './book';
import { BaseEntity, PaginationQuery } from './common';
import { GenreEntity } from './genre';
import type { Era } from './era';

export interface Author extends BaseEntity {
  name: string;
  nameInKor: string;
  nameInEng: string | null;
  description: string | null;
  imageUrl: string | null;
  bornDate: string | null;
  bornDateIsBc: boolean | null;
  diedDate: string | null;
  diedDateIsBc: boolean | null;
  eraId: number | null;
  likeCount: number;
  reviewCount: number;
  bookCount: number;
  genre: GenreEntity;
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
  isLiked: boolean;
  era: Era;
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

export interface OriginalWork {
  id: number;
  title: string;
  titleInKor?: string;
  titleInEng?: string;
  publishedDate?: string;
  publishedDateIsBc?: boolean;
  circa?: boolean;
  century?: boolean;
  s?: boolean;
  posthumous?: boolean;
  books?: Book[];
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface InfluencedAuthor extends Author {
  isWikiData: boolean;
}
