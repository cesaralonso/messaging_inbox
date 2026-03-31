import { useState } from 'react';
import { authApi } from '../api/authApi';
import { useApiAuthStore } from '../store/apiAuthStore';
import type { LoginPayload } from '../types/auth.types';

export function useApiLogin() {
  const setSession = useApiAuthStore((state) => state.setSession);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(payload);
      setSession(response.user, response.token);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}