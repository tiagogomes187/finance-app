import { useLocation } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { getInitials } from '../../utils/format';

// Mapa de títulos por rota
const pageTitles: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/transactions': 'Transações',
  '/accounts':     'Contas',
  '/categories':   'Categorias',
  '/reports':      'Relatórios',
  '/profile':      'Perfil',
};

export default function Header() {
  const location = useLocation();
  const user     = useAuthStore((state) => state.user);
  const title    = pageTitles[location.pathname] || 'FinanceApp';

  return (
    // Visível apenas no mobile
    <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b 
                       border-gray-100 shadow-sm z-40 h-14">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo + título */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>

        {/* Avatar do usuário */}
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center 
                        justify-center text-primary-700 font-semibold text-xs">
          {user ? getInitials(user.name) : 'U'}
        </div>
      </div>
    </header>
  );
}