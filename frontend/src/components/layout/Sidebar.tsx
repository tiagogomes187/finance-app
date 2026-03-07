import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Tag,
  User,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { getInitials } from '../../utils/format';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transações'  },
  { to: '/accounts',     icon: Wallet,          label: 'Contas'      },
  { to: '/categories',   icon: Tag,             label: 'Categorias'  },
  { to: '/reports',      icon: PieChart,        label: 'Relatórios'  },
  { to: '/profile',      icon: User,            label: 'Perfil'      },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    // Visível apenas em telas médias e maiores (desktop)
    <aside className="hidden md:flex flex-col w-64 bg-white border-r 
                      border-gray-100 shadow-sm h-screen fixed left-0 top-0">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
          <TrendingUp size={20} className="text-white" />
        </div>
        <span className="text-lg font-bold text-gray-800">FinanceApp</span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              transition-all duration-200 text-sm font-medium
              ${isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Usuário e logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar com iniciais */}
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center 
                          justify-center text-primary-700 font-semibold text-sm">
            {user ? getInitials(user.name) : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm 
                     text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}