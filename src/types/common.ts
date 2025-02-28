export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, string][];
    searchBy?: string[];
    search?: string;
    filter?: Record<string, any>;
  };
  links: {
    first?: string;
    previous?: string;
    current: string;
    next?: string;
    last?: string;
  };
}

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
  filter?: Record<string, any>;
}

export interface LikeToggleResponse {
  liked: boolean;
}

export interface DeleteResponse {
  message: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelTitle: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatWithAuthorRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatWithAuthorResponse {
  authorId: number;
  authorName: string;
  response: string;
  timestamp: string;
}

export interface ChatWithBookRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatWithBookResponse {
  bookId: number;
  bookTitle: string;
  response: string;
  timestamp: string;
}
