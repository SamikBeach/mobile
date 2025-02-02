import axios from '@/lib/axios';
import { Genre } from '@/types/genre';

export const genreApi = {
  getAllGenres: () => {
    return axios.get<Genre[]>('/genre');
  },
};
