import axios from '@/lib/axios';
import type { Era } from '@/types/era';

export const eraApi = {
  /**
   * 모든 시대 목록을 가져옵니다.
   * @returns 전체 시대 목록
   */
  getAllEras() {
    return axios.get<Era[]>('/era');
  },

  /**
   * 특정 시대의 상세 정보를 조회합니다.
   * @param eraId - 시대 ID
   * @returns 시대 상세 정보
   */
  getEraDetail(eraId: number) {
    return axios.get<Era>(`/era/${eraId}`);
  },
};
