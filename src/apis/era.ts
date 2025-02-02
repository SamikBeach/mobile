import axios from '@/lib/axios';
import type { Era } from '@/types/era';

export const eraApi = {
  getAllEras() {
    return axios.get<Era[]>('/eras');
  },

  getEraDetail(eraId: number) {
    return axios.get<Era>(`/eras/${eraId}`);
  },
};
