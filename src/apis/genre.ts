import axios from '@/lib/axios';
import { GenreEntity } from '@/types/genre';

export const genreApi = {
  getAllGenres: () => {
    return axios.get<GenreEntity[]>('/genre');
  },
};
