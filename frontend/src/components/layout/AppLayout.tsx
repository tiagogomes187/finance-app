import { Outlet } from 'react-router-dom';
import Sidebar   from './Sidebar';
import BottomNav from './BottomNav';
import Header    from './Header';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar — visível no desktop */}
      <Sidebar />

      {/* Header — visível no mobile */}
      <Header />

      {/* Conteúdo principal */}
      <main className={`
        transition-all duration-200
        md:ml-64
        pt-14 md:pt-0
        pb-20 md:pb-0
        min-h-screen
      `}>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Outlet renderiza a página atual */}
          <Outlet />
        </div>
      </main>

      {/* Navegação inferior — visível no mobile */}
      <BottomNav />
    </div>
  );
}