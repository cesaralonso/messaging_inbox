import { apiClient } from '@/lib/apiClient';
import type { LoginPayload, LoginResponse, AuthUser } from '../types/auth.types';

export const authApi = {
  login(payload: LoginPayload) {
    return apiClient.post<LoginResponse>('/auth/login', payload, false);
  },

  me() {
    return apiClient.get<{ data: AuthUser }>('/auth/me', true);
  },

  logout() {
    return apiClient.post<{ message: string }>('/auth/logout', undefined, true);
  },
};