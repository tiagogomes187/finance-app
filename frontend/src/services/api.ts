import axios from 'axios';

// Cria instância do axios apontando para o backend
const api = axios.create({
  baseURL: '/api', // usa o proxy do Vite configurado no vite.config.ts
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptor de requisição ────────────────────────────────────────
// Adiciona o token JWT automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@financeapp:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ── Interceptor de resposta ──────────────────────────────────────────
// Redireciona para login se o token expirar (erro 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@financeapp:token');
      localStorage.removeItem('@financeapp:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;