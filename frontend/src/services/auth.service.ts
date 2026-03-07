import api from './api';
import type { User } from '../types';

interface RegisterData {
  name:     string;
  email:    string;
  password: string;
}

interface LoginData {
  email:    string;
  password: string;
}

interface AuthResponse {
  user:    User;
  token:   string;
  message: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  },
};