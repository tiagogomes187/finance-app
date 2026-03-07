import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login         from './pages/auth/Login';
import Register      from './pages/auth/Register';
import Dashboard     from './pages/dashboard/Dashboard';
import AppLayout     from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:                1,
      refetchOnWindowFocus: false,
      staleTime:            1000 * 60 * 5,
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

          {/* Rotas protegidas com layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard"    element={<Dashboard />} />

            {/* Páginas que criaremos nas próximas etapas */}
            <Route path="/transactions" element={<div className="text-center py-20 text-gray-400">Em breve — Transações</div>} />
            <Route path="/accounts"     element={<div className="text-center py-20 text-gray-400">Em breve — Contas</div>} />
            <Route path="/categories"   element={<div className="text-center py-20 text-gray-400">Em breve — Categorias</div>} />
            <Route path="/reports"      element={<div className="text-center py-20 text-gray-400">Em breve — Relatórios</div>} />
            <Route path="/profile"      element={<div className="text-center py-20 text-gray-400">Em breve — Perfil</div>} />
          </Route>

          {/* Redireciona raiz para dashboard */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/login"     replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}