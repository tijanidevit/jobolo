import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('accessToken');
      const storedUser = window.localStorage.getItem('authUser');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          logoutStore();
        }
      } else if (!token) {
        setUser(null);
      }

      setInitialized(true);
      setIsInitializing(false);
    }
  }, [logoutStore, setInitialized, setUser]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        Cookies.set('accessToken', data.data.accessToken, { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
        Cookies.set('refreshToken', data.data.refreshToken, { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
      }
      setUser(data.data.user);
      setInitialized(true);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        Cookies.set('accessToken', data.data.accessToken, { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
        Cookies.set('refreshToken', data.data.refreshToken, { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
      }
      setUser(data.data.user);
      setInitialized(true);
    },
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

  const resendVerificationMutation = useMutation({
    mutationFn: authApi.resendVerificationEmail,
  });

  return {
    user,
    isInitializing,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    resendVerification: resendVerificationMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isResendingVerification: resendVerificationMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
