import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const { data: user, isLoading: isInitializing } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const token = typeof window !== 'undefined' ? Cookies.get('accessToken') : null;
        if (!token) return null;
        
        const res = await authApi.getMe();
        return res.data;
      } catch (error) {
        logoutStore();
        return null;
      }
    },
  });

  // Sync query data with store
  useEffect(() => {
    if (user !== undefined) {
      const storeUser = useAuthStore.getState().user;
      if (user?.id !== storeUser?.id) {
        setUser(user);
      }
      if (!useAuthStore.getState().isInitialized) {
        setInitialized(true);
      }
    }
  }, [user, setUser, setInitialized]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        Cookies.set('accessToken', data.data.accessToken, { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
        Cookies.set('refreshToken', data.data.refreshToken, { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
      }
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logoutStore();
      queryClient.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });

  return {
    user,
    isInitializing,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
