import axios from '@/lib/axios';
import { GenreEntity } from '@/types/genre';

export const genreApi = {
  /**
   * 모든 장르 목록을 가져옵니다.
   * @returns 전체 장르 목록
   */
  getAllGenres: () => {
    return axios.get<GenreEntity[]>('/genre');
  },
};
