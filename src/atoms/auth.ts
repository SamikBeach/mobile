import { User } from '@/types/user';
import { atom } from 'jotai';

// 현재 로그인한 사용자 정보를 담는 atom
export const currentUserAtom = atom<User | null>(null);

// 로그인 여부를 나타내는 파생 atom
export const isLoggedInAtom = atom(get => !!get(currentUserAtom));
