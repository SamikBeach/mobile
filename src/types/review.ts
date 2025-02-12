import type { BaseEntity, PaginationQuery } from './common';
import type { Book } from './book';
import type { UserBase } from './user';

export interface Review extends BaseEntity {
  title: string;
  content: string;
  rating: number;
  user: UserBase;
  book: Book;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
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

export type ReportReason = 'INAPPROPRIATE' | 'SPAM' | 'COPYRIGHT' | 'HATE_SPEECH' | 'OTHER';

export interface ReportReviewDto {
  reason: ReportReason;
}
