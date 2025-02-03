import { Author } from './author';
import { Book } from './book';
import { PaginationQuery } from './common';

export interface User {
  id: number;
  email: string;
  nickname: string;
  imageUrl?: string;
}

export interface UserBase {
  id: number;
  email: string;
  nickname: string;
  imageUrl?: string;
}

export interface UpdateUserDto {
  nickname?: string;
}

export interface UserSearchQuery extends PaginationQuery {
  filter?: {
    verified?: boolean;
    email?: string;
    nickname?: string;
  };
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserSearch {
  id: number;
  book: Book | null;
  author: Author | null;
  createdAt: string;
}
