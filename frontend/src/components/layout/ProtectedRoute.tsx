import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Se o usuário não estiver logado, redireciona para /login
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLogged = useAuthStore((state) => state.isLogged);

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}