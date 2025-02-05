import axios from '@/lib/axios';
import type { Era } from '@/types/era';

export const eraApi = {
  getAllEras() {
    return axios.get<Era[]>('/era');
  },

  getEraDetail(eraId: number) {
    return axios.get<Era>(`/era/${eraId}`);
  },
};
