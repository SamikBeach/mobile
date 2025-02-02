import { Author } from './author';
import { Book } from './book';
import { BaseEntity, PaginationQuery } from './common';

export interface User extends Omit<BaseEntity, 'deletedAt'> {
  email: string;
  nickname: string;
  imageUrl: string | null;
  verified: boolean;
}

export type UserBase = Pick<User, 'id' | 'email' | 'nickname' | 'imageUrl'>;

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
