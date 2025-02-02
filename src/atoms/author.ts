import { atom } from 'jotai';
import type { Genre } from '@/types/genre';

export const authorGenreAtom = atom<Genre>('all');
export const authorSearchKeywordAtom = atom('');
export const authorSortModeAtom = atom<'popular' | 'recent' | 'alphabet'>('popular');
export const eraIdAtom = atom<string | undefined>(undefined);
