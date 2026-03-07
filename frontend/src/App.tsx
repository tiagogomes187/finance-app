import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Configura o React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:              1,
      refetchOnWindowFocus: false,
      staleTime:          1000 * 60 * 5, // 5 minutos
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rota raiz — redireciona para dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* Rota temporária do dashboard — vamos criar na próxima etapa */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="flex items-center justify-center min-h-screen">
                  <h1 className="text-2xl font-bold text-primary-600">
                    🎉 Bem-vindo ao FinanceApp!
                  </h1>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Qualquer rota não encontrada vai para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}