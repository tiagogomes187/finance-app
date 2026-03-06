import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user:      User | null;
  token:     string | null;
  isLogged:  boolean;
  setAuth:   (user: User, token: string) => void;
  logout:    () => void;
  updateUser:(user: Partial<User>) => void;
}

// persist salva o estado no localStorage automaticamente
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:     null,
      token:    null,
      isLogged: false,

      // Salva usuário e token após login/cadastro
      setAuth: (user, token) => {
        localStorage.setItem('@financeapp:token', token);
        set({ user, token, isLogged: true });
      },

      // Limpa tudo ao fazer logout
      logout: () => {
        localStorage.removeItem('@financeapp:token');
        localStorage.removeItem('@financeapp:user');
        set({ user: null, token: null, isLogged: false });
      },

      // Atualiza dados do usuário (ex: trocar nome ou avatar)
      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },
    }),
    {
      name: '@financeapp:auth', // chave no localStorage
    }
  )
);