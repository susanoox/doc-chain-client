import { apiClient } from './api';
import {
  LoginCredentials,
  RegisterData,
  User,
} from '@/lib/types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    return apiClient.post<{ user: User; token: string }>(
      '/auth/login',
      credentials
    );
  },

  register: async (data: RegisterData) => {
    return apiClient.post<{ user: User; token: string }>('/auth/register', data);
  },

  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  forgotPassword: async (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  me: async () => {
    return apiClient.get<User>('/auth/me');
  },

  refreshToken: async () => {
    return apiClient.post<{ token: string }>('/auth/refresh');
  },
};
