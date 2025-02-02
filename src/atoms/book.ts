import { atom } from 'jotai';
import type { Genre } from '@/types/genre';

export type BookSortMode = 'popular' | 'recent' | 'alphabet';

export const bookGenreAtom = atom<Genre>('all');
export const bookSortModeAtom = atom<BookSortMode>('popular');
export const bookSearchKeywordAtom = atom('');
export const authorIdAtom = atom<string | undefined>(undefined); 