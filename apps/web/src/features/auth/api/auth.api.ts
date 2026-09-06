import { api } from '@/lib/axios';
import { User } from '../store/auth.store';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthResponse {
  message: string;
  data: AuthTokens;
}

export const authApi = {
  login: async (data: Record<string, any>) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  
  register: async (data: Record<string, any>) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  forgotPassword: async (data: { email: string }) => {
    const response = await api.post<{ message: string; data: null }>('/auth/forgot-password', data);
    return response.data;
  },
  
  resetPassword: async (data: Record<string, any>) => {
    const response = await api.post<{ message: string; data: null }>('/auth/reset-password', data);
    return response.data;
  },
  
  verifyEmail: async (data: { token: string }) => {
    const response = await api.post<{ message: string; data: null }>('/auth/verify-email', data);
    return response.data;
  },

  resendVerificationEmail: async () => {
    const response = await api.post<{ message: string; data: null }>('/auth/resend-verification');
    return response.data;
  },
};
