import { create } from 'zustand';
import { login as loginApi } from '../api/auth';
import type { LoginRequest } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  username: string | null;
  login: (data: LoginRequest, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  username: null,

  login: async (data, rememberMe) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginApi(data);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', response.accessToken);
      storage.setItem('refreshToken', response.refreshToken);
      storage.setItem('username', response.username);

      set({
        isAuthenticated: true,
        isLoading: false,
        username: response.username,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || 'Ошибка авторизации'
          : 'Ошибка соединения с сервером';

      set({ isLoading: false, error: message });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('username');
    set({ isAuthenticated: false, username: null });
  },

  checkAuth: () => {
    const token =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');
    const username =
      localStorage.getItem('username') ||
      sessionStorage.getItem('username');

    if (token) {
      set({ isAuthenticated: true, username });
    }
  },
}));
