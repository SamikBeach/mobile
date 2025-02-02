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
