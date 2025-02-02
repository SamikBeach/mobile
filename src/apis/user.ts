import axios from '@/lib/axios';
import type { PaginatedResponse, PaginationQuery } from '@/types/common';
import type { Author } from '@/types/author';
import type { Book } from '@/types/book';
import type { Review } from '@/types/review';
import type { ChangePasswordDto, UpdateUserDto, User, UserBase, UserSearch } from '@/types/user';

export const userApi = {
  getMyProfile: () => axios.get<UserBase>('/user/me'),

  getUserDetail: (userId: number) => axios.get<User>(`/user/${userId}`),

  updateProfile: (data: UpdateUserDto) => axios.patch<User>('/user/me', data),

  deleteAccount: () => axios.delete<void>('/user/me'),

  searchUsers: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<User>>('/user/search', { params }),

  getUserLikedBooks: (userId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ book: Book }>>(`/user/${userId}/books`, {
      params,
    }),

  getUserLikedAuthors: (userId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ author: Author }>>(`/user/${userId}/authors`, { params }),

  getUserReviews: (userId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<Review>>(`/user/${userId}/reviews`, { params }),

  getMyLikedBooks: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ book: Book }>>('/user/me/books', { params }),

  getMyLikedAuthors: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ author: Author }>>('/user/me/authors', {
      params,
    }),

  getMyReviews: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<Review>>('/user/me/reviews', { params }),

  changePassword: (data: ChangePasswordDto) =>
    axios.post<{ message: string }>('/user/me/password', data),

  getRecentSearches: () => axios.get<UserSearch[]>('/user/me/search'),

  saveSearch: (params: { bookId?: number; authorId?: number }) =>
    axios.post('/user/me/save-search', params),

  uploadProfileImage: (file: FormData) =>
    axios.post<User>('/user/me/profile-image', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteProfileImage: () => axios.delete<User>('/user/me/profile-image'),

  deleteSearch: (searchId: number) =>
    axios.delete<{ message: string }>(`/user/me/search/${searchId}`),
};
