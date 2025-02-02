import { BaseEntity } from './common';

export interface GenreEntity extends BaseEntity {
  genre: string;
  genreInKor: string;
}

export type Genre = 'all' | 'literature' | 'philosophy' | 'history' | 'science' | 'economics';
