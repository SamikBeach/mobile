import { currentUserAtom } from '@/atoms/auth';
import { useAtomValue } from 'jotai';
import type { UserBase } from '@/types/user';

export function useCurrentUser(): UserBase | null {
  const currentUser = useAtomValue(currentUserAtom);
  return currentUser;
}
