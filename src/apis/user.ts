import axios from '@/lib/axios';
import type { PaginatedResponse, PaginationQuery } from '@/types/common';
import type { Author } from '@/types/author';
import type { Book } from '@/types/book';
import type { Review } from '@/types/review';
import type { ChangePasswordDto, UpdateUserDto, User, UserBase, UserSearch } from '@/types/user';

export const userApi = {
  /**
   * 내 프로필 정보를 조회합니다.
   * @returns 내 프로필 정보
   */
  getMyProfile: () => axios.get<UserBase>('/user/me'),

  /**
   * 사용자 상세 정보를 조회합니다.
   * @param userId - 사용자 ID
   * @returns 사용자 상세 정보
   */
  getUserDetail: (userId: number) => axios.get<User>(`/user/${userId}`),

  /**
   * 프로필 정보를 수정합니다.
   * @param data - 수정할 프로필 데이터
   * @returns 수정된 사용자 정보
   */
  updateProfile: (data: UpdateUserDto) => axios.patch<User>('/user/me', data),

  /**
   * 회원 탈퇴를 처리합니다.
   */
  deleteAccount: () => axios.delete<void>('/user/me'),

  /**
   * 사용자를 검색합니다.
   * @param params - 페이지네이션 옵션
   * @returns 페이지네이션된 사용자 목록
   */
  searchUsers: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<User>>('/user/search', { params }),

  /**
   * 특정 사용자의 좋아요한 책 목록을 조회합니다.
   * @param userId - 사용자 ID
   * @param params - 페이지네이션 옵션
   * @returns 페이지네이션된 좋아요한 책 목록
   */
  getUserLikedBooks: (userId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ book: Book }>>(`/user/${userId}/books`, {
      params,
    }),

  /**
   * 특정 사용자의 좋아요한 작가 목록을 조회합니다.
   * @param userId - 사용자 ID
   * @param params - 페이지네이션 옵션
   * @returns 페이지네이션된 좋아요한 작가 목록
   */
  getUserLikedAuthors: (userId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ author: Author }>>(`/user/${userId}/authors`, { params }),

  /**
   * 특정 사용자의 리뷰 목록을 조회합니다.
   * @param userId - 사용자 ID
   * @param params - 페이지네이션 옵션
   * @returns 페이지네이션된 리뷰 목록
   */
  getUserReviews: (userId: number, params: PaginationQuery) =>
    axios.get<PaginatedResponse<Review>>(`/user/${userId}/reviews`, { params }),

  /**
   * 내가 좋아요한 책 목록을 조회합니다.
   * @param params - 페이지네이션 옵션
   * @returns 페이지네이션된 좋아요한 책 목록
   */
  getMyLikedBooks: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ book: Book }>>('/user/me/books', { params }),

  /**
   * 내가 좋아요한 작가 목록을 조회합니다.
   * @param params - 페이지네이션 옵션
   * @returns 페이지네이션된 좋아요한 작가 목록
   */
  getMyLikedAuthors: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<{ author: Author }>>('/user/me/authors', { params }),

  /**
   * 내가 작성한 리뷰 목록을 조회합니다.
   * @param params - 페이지네이션 옵션
   * @returns 페이지네이션된 리뷰 목록
   */
  getMyReviews: (params: PaginationQuery) =>
    axios.get<PaginatedResponse<Review>>('/user/me/reviews', { params }),

  /**
   * 비밀번호를 변경합니다.
   * @param data - 비밀번호 변경 데이터
   * @returns 변경 완료 메시지
   */
  changePassword: (data: ChangePasswordDto) =>
    axios.post<{ message: string }>('/user/me/password', data),

  /**
   * 최근 검색 기록을 조회합니다.
   * @returns 검색 기록 목록
   */
  getRecentSearches: () => axios.get<UserSearch[]>('/user/me/search'),

  /**
   * 검색 기록을 저장합니다.
   * @param params - 검색 저장 데이터
   */
  saveSearch: (params: { bookId?: number; authorId?: number }) =>
    axios.post('/user/me/save-search', params),

  /**
   * 프로필 이미지를 업로드합니다.
   * @param file - 업로드할 이미지 파일
   * @returns 업데이트된 사용자 정보
   */
  uploadProfileImage: (file: FormData) =>
    axios.post<User>('/user/me/profile-image', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  /**
   * 프로필 이미지를 삭제합니다.
   * @returns 업데이트된 사용자 정보
   */
  deleteProfileImage: () => axios.delete<User>('/user/me/profile-image'),

  /**
   * 검색 기록을 삭제합니다.
   * @param searchId - 검색 기록 ID
   * @returns 삭제 완료 메시지
   */
  deleteSearch: (searchId: number) =>
    axios.delete<{ message: string }>(`/user/me/search/${searchId}`),

  /**
   * 사용자를 차단합니다.
   * @param userId - 차단할 사용자 ID
   */
  blockUser: (userId: number) => axios.post<void>(`/user/${userId}/block`),

  /**
   * 사용자 차단을 해제합니다.
   * @param userId - 차단 해제할 사용자 ID
   */
  unblockUser: (userId: number) => axios.delete<void>(`/user/${userId}/block`),

  /**
   * 차단한 사용자 목록을 조회합니다.
   * @returns 차단된 사용자 목록
   */
  getBlockedUsers: () => axios.get<User[]>('/user/me/blocked'),
};
