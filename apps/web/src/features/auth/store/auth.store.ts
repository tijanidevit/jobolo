import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      if (user) {
        window.localStorage.setItem('authUser', JSON.stringify(user));
      } else {
        window.localStorage.removeItem('authUser');
      }
    }
    set({ user, isAuthenticated: !!user });
  },
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  logout: () => {
    if (typeof window !== 'undefined') {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      window.localStorage.removeItem('authUser');
    }
    set({ user: null, isAuthenticated: false });
  },
}));
