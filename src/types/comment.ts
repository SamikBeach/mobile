import type { User } from './user';
import type { Review } from './review';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  user: User;
  review: Review;
  isLiked?: boolean;
  likeCount: number;
}
