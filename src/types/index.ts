export interface User {
  id: string;
  profileImage?: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}
