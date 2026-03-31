import { create } from 'zustand';
import type { AuthUser } from '../types/auth.types';

interface ApiAuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (user: AuthUser, token: string) => void;
  clearSession: () => void;
  hydrateFromStorage: () => void;
}

export const useApiAuthStore = create<ApiAuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setSession: (user, token) => {
    localStorage.setItem('api_token', token);
    localStorage.setItem('api_user', JSON.stringify(user));

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  clearSession: () => {
    localStorage.removeItem('api_token');
    localStorage.removeItem('api_user');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  hydrateFromStorage: () => {
    const token = localStorage.getItem('api_token');
    const userRaw = localStorage.getItem('api_user');

    if (!token || !userRaw) {
      return;
    }

    try {
      const user = JSON.parse(userRaw) as AuthUser;

      set({
        user,
        token,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem('api_token');
      localStorage.removeItem('api_user');
    }
  },
}));