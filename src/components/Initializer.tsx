import { userApi } from '@/apis/user';
import { currentUserAtom } from '@/atoms/auth';
import { storage } from '@/lib/storage';
import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export default function Initializer() {
  const setCurrentUser = useSetAtom(currentUserAtom);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = await storage.getAccessToken();

      if (!token) {
        return null;
      }

      try {
        const response = await userApi.getMyProfile();
        return response.data;
      } catch (error) {
        console.error('Profile fetch error:', error);
        await storage.clearTokens();
        return null;
      }
    },
    retry: 0,
    refetchOnMount: false,
  });

  useEffect(() => {
    setCurrentUser(user ?? null);
  }, [user, setCurrentUser]);

  return null;
}
