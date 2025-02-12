import axios from '@/lib/axios';
import type { PaginatedResponse, PaginationQuery } from '@/types/common';
import type { Author } from '@/types/author';
import type { Book } from '@/types/book';
import type { Review } from '@/types/review';
import type { ChangePasswordDto, UpdateUserDto, User, UserBase, UserSearch } from '@/types/user';

export const userApi = {
  /**
   * 내 프로필 정보를 조회합니다.
   */
  getMyProfile: () => axios.get<UserBase>('/user/me'),

  /**
   * 사용자 상세 정보를 조회합니다.
   */
  getUserDetail: (userId: number) => axios.get<User>(`/user/${userId}`),

  /**
   * 프로필 정보를 수정합니다.
   */
  updateProfile: (data: UpdateUserDto) => axios.patch<User>('/user/me', data),

  /**
   * 회원 탈퇴를 처리합니다.
   */
  deleteAccount: () => axios.delete<void>('/user/me'),

  /**
   * 사용자를 검색합니다.
   */
  searchUsers: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<User>>('/user/search', { params }),

  /**
   * 특정 사용자의 좋아요한 책 목록을 조회합니다.
   */
  getUserLikedBooks: (userId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ book: Book }>>(`/user/${userId}/books`, {
      params,
    }),

  /**
   * 특정 사용자의 좋아요한 작가 목록을 조회합니다.
   */
  getUserLikedAuthors: (userId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ author: Author }>>(`/user/${userId}/authors`, { params }),

  /**
   * 특정 사용자의 리뷰 목록을 조회합니다.
   */
  getUserReviews: (userId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<Review>>(`/user/${userId}/reviews`, { params }),

  /**
   * 내가 좋아요한 책 목록을 조회합니다.
   */
  getMyLikedBooks: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ book: Book }>>('/user/me/books', { params }),

  /**
   * 내가 좋아요한 작가 목록을 조회합니다.
   */
  getMyLikedAuthors: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ author: Author }>>('/user/me/authors', { params }),

  /**
   * 내가 작성한 리뷰 목록을 조회합니다.
   */
  getMyReviews: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<Review>>('/user/me/reviews', { params }),

  /**
   * 비밀번호를 변경합니다.
   */
  changePassword: (data: ChangePasswordDto) =>
    axios.post<{ message: string }>('/user/me/password', data),

  getRecentSearches: () => axios.get<UserSearch[]>('/user/me/search'),

  saveSearch: (params: { bookId?: number; authorId?: number }) =>
    axios.post('/user/me/save-search', params),

  /**
   * 프로필 이미지를 업로드합니다.
   */
  uploadProfileImage: (file: FormData) =>
    axios.post<User>('/user/me/profile-image', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  /**
   * 프로필 이미지를 삭제합니다.
   */
  deleteProfileImage: () => axios.delete<User>('/user/me/profile-image'),

  deleteSearch: (searchId: number) =>
    axios.delete<{ message: string }>(`/user/me/search/${searchId}`),

  blockUser: (userId: number) => axios.post<void>(`/user/${userId}/block`),

  unblockUser: (userId: number) => axios.delete<void>(`/user/${userId}/block`),

  getBlockedUsers: () => axios.get<User[]>('/user/me/blocked'),
};
