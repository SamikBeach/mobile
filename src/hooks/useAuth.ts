import { atom, useAtom } from 'jotai';
import type { AuthResponse } from '@/types/auth';

const currentUserAtom = atom<AuthResponse['user'] | null>(null);

export function useAuth() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  return {
    currentUser,
    setCurrentUser,
  };
} 