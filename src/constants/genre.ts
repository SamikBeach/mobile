import type { Genre } from '@/types/genre';

export const GENRE_LABELS: Record<Genre, string> = {
  all: '전체',
  literature: '문학',
  philosophy: '철학',
  history: '역사',
  science: '과학',
  economics: '경제',
};

export const GENRE_IDS: Record<Genre, number | undefined> = {
  all: undefined,
  literature: 1,
  philosophy: 2,
  history: 3,
  science: 4,
  economics: 5,
}; 