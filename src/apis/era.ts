import axios from '@/lib/axios';
import { Era } from '@/types/era';

export const eraApi = {
  getAllEras: () => {
    return axios.get<Era[]>('/era');
  },
};
