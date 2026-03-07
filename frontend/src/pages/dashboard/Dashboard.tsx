import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { reportService } from '../../services/report.service';
import { accountService } from '../../services/account.service';
import { useAuthStore } from '../../store/auth.store';
import SummaryCard  from '../../components/ui/SummaryCard';
import MonthlyChart from '../../components/charts/MonthlyChart';
import CategoryChart from '../../components/charts/CategoryChart';
import { formatCurrency, formatMonthYear } from '../../utils/format';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const now  = new Date();
  const month = now.getMonth() + 1;
  const year  = now.getFullYear();

  // Datas do mês atual
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay   = new Date(year, month, 0).getDate();
  const endDate   = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  // ── Queries ────────────────────────────────────────────────────────
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['summary', month, year],
    queryFn:  () => reportService.getMonthlySummary(month, year),
  });

  const { data: evolution, isLoading: loadingEvolution } = useQuery({
    queryKey: ['evolution'],
    queryFn:  () => reportService.getMonthlyEvolution(6),
  });

  const { data: categoryData, isLoading: loadingCategory } = useQuery({
    queryKey: ['by-category', startDate, endDate],
    queryFn:  () => reportService.getByCategory(startDate, endDate),
  });

  const { data: accountsData, isLoading: loadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn:  () => accountService.getAll(),
  });

  return (
    <div className="space-y-5">

      {/* Saudação */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Olá, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5 capitalize">
          {formatMonthYear(new Date())}
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          title="Saldo total"
          value={summary?.totalBalance ?? 0}
          icon={<Wallet size={22} />}
          color="purple"
          loading={loadingSummary}
        />
        <SummaryCard
          title="Receitas"
          value={summary?.income.current ?? 0}
          variation={summary?.income.variation}
          icon={<TrendingUp size={22} />}
          color="green"
          loading={loadingSummary}
        />
        <SummaryCard
          title="Despesas"
          value={summary?.expense.current ?? 0}
          variation={summary?.expense.variation}
          icon={<TrendingDown size={22} />}
          color="red"
          loading={loadingSummary}
        />
        <SummaryCard
          title="Balanço"
          value={summary?.balance ?? 0}
          icon={<DollarSign size={22} />}
          color="blue"
          loading={loadingSummary}
        />
      </div>

      {/* Contas */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Minhas contas</h3>
        {loadingAccounts ? (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {accountsData?.accounts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                Nenhuma conta cadastrada
              </p>
            )}
            {accountsData?.accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 
                           bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: account.color }}
                  >
                    💳
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{account.name}</p>
                    <p className="text-xs text-gray-400">{account.type}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold
                  ${Number(account.balance) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {formatCurrency(Number(account.balance))}
                </p>
              </div>
            ))}

            {/* Total */}
            {(accountsData?.accounts.length ?? 0) > 0 && (
              <div className="flex justify-between items-center pt-2 
                              border-t border-gray-100 mt-2">
                <span className="text-sm font-medium text-gray-600">Total</span>
                <span className="text-sm font-bold text-primary-600">
                  {formatCurrency(accountsData?.totalBalance ?? 0)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gráfico de evolução */}
      <MonthlyChart
        data={evolution ?? []}
        loading={loadingEvolution}
      />

      {/* Gráfico de categorias */}
      <CategoryChart
        data={categoryData?.expenses ?? []}
        loading={loadingCategory}
      />

    </div>
  );
}