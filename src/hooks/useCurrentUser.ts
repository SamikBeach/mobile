import { currentUserAtom } from '@/atoms/auth';
import { useAtomValue } from 'jotai';
import type { User } from '@/types/user';

export function useCurrentUser(): User | null {
  const currentUser = useAtomValue(currentUserAtom);
  return currentUser;
}
