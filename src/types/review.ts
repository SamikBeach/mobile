import { Book } from './book';
import { BaseEntity, PaginationQuery } from './common';
import { UserBase } from './user';
import type { User } from './user';

export interface Review {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  book: Book;
}

export interface CreateReviewDto {
  title: string;
  content: string;
}

export interface UpdateReviewDto {
  title?: string;
  content?: string;
}

export interface Comment extends BaseEntity {
  content: string;
  user: UserBase;
  review: Review;
  likeCount: number;
  isLiked?: boolean;
}

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface ReviewSearchQuery extends PaginationQuery {
  filter?: {
    userId?: number;
    bookId?: number;
    minLikes?: number;
    title?: string;
    content?: string;
  };
  searchBy?: ('title' | 'content')[];
}

export interface CommentSearchQuery extends PaginationQuery {
  filter?: {
    userId?: number;
    reviewId?: number;
  };
}
