import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Início'      },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transações'  },
  { to: '/reports',      icon: PieChart,        label: 'Relatórios'  },
  { to: '/profile',      icon: User,            label: 'Perfil'      },
];

export default function BottomNav() {
  return (
    // Fixado na parte inferior, só visível em telas pequenas (mobile)
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 
                    shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-0.5 
              flex-1 h-full transition-colors duration-200
              ${isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`
                  p-1.5 rounded-xl transition-all duration-200
                  ${isActive ? 'bg-primary-50' : ''}
                `}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-normal'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}