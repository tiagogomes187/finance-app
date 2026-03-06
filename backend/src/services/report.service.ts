import prisma from '../prisma/client';

// ─── Tipos ────────────────────────────────────────────────────────────

interface PeriodFilter {
  startDate: string;
  endDate: string;
}

interface MonthlyFilter {
  month: number;
  year: number;
}

// ─── Serviço ──────────────────────────────────────────────────────────

export class ReportService {

  // ── Resumo mensal (Dashboard) ────────────────────────────────────────
  // Retorna receitas, despesas, saldo e comparativo com mês anterior
  async getMonthlySummary(userId: number, filter: MonthlyFilter) {
    const { month, year } = filter;

    // Primeiro e último dia do mês atual
    const startDate = new Date(year, month - 1, 1);
    const endDate   = new Date(year, month, 0, 23, 59, 59);

    // Primeiro e último dia do mês anterior
    const prevMonth      = month === 1 ? 12 : month - 1;
    const prevYear       = month === 1 ? year - 1 : year;
    const prevStartDate  = new Date(prevYear, prevMonth - 1, 1);
    const prevEndDate    = new Date(prevYear, prevMonth, 0, 23, 59, 59);

    // Busca totais do mês atual e anterior em paralelo
    const [currentTotals, previousTotals] = await Promise.all([
      prisma.transaction.groupBy({
        by: ['type'],
        where: {
          userId,
          isPaid: true,
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ['type'],
        where: {
          userId,
          isPaid: true,
          date: { gte: prevStartDate, lte: prevEndDate },
        },
        _sum: { amount: true },
      }),
    ]);

    // Extrai os valores
    const currentIncome  = Number(currentTotals.find(t => t.type === 'INCOME')?._sum.amount  || 0);
    const currentExpense = Number(currentTotals.find(t => t.type === 'EXPENSE')?._sum.amount || 0);
    const prevIncome     = Number(previousTotals.find(t => t.type === 'INCOME')?._sum.amount  || 0);
    const prevExpense    = Number(previousTotals.find(t => t.type === 'EXPENSE')?._sum.amount || 0);

    // Calcula variação percentual em relação ao mês anterior
    const incomeVariation  = prevIncome  > 0 ? ((currentIncome  - prevIncome)  / prevIncome)  * 100 : 0;
    const expenseVariation = prevExpense > 0 ? ((currentExpense - prevExpense) / prevExpense) * 100 : 0;

    // Busca saldo total de todas as contas
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
      select: { balance: true },
    });
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    return {
      month,
      year,
      totalBalance,
      income: {
        current:   currentIncome,
        previous:  prevIncome,
        variation: Number(incomeVariation.toFixed(2)),
      },
      expense: {
        current:   currentExpense,
        previous:  prevExpense,
        variation: Number(expenseVariation.toFixed(2)),
      },
      balance: currentIncome - currentExpense,
    };
  }

  // ── Gastos por categoria ─────────────────────────────────────────────
  // Retorna quanto foi gasto em cada categoria no período
  async getByCategory(userId: number, filter: PeriodFilter) {
    const { startDate, endDate } = filter;

    const result = await prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: {
        userId,
        isPaid: true,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      _sum:   { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    // Busca os detalhes das categorias
    const categoryIds = [...new Set(result.map(r => r.categoryId))];
    const categories  = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, color: true, icon: true, type: true },
    });

    // Calcula os totais gerais para calcular percentual
    const totalExpense = result
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + Number(r._sum.amount || 0), 0);

    const totalIncome = result
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + Number(r._sum.amount || 0), 0);

    // Monta o resultado final com os detalhes
    const data = result.map(r => {
      const category   = categories.find(c => c.id === r.categoryId);
      const amount     = Number(r._sum.amount || 0);
      const total      = r.type === 'EXPENSE' ? totalExpense : totalIncome;
      const percentage = total > 0 ? Number(((amount / total) * 100).toFixed(2)) : 0;

      return {
        categoryId:   r.categoryId,
        categoryName: category?.name  || 'Desconhecida',
        color:        category?.color || '#6b7280',
        icon:         category?.icon  || 'tag',
        type:         r.type,
        amount,
        count:        r._count.id,
        percentage,
      };
    });

    return {
      expenses: data.filter(d => d.type === 'EXPENSE'),
      incomes:  data.filter(d => d.type === 'INCOME'),
      totalExpense,
      totalIncome,
    };
  }

  // ── Evolução mensal (últimos N meses) ────────────────────────────────
  // Retorna receitas e despesas mês a mês para o gráfico de linha
  async getMonthlyEvolution(userId: number, months: number = 6) {
    const result = [];

    for (let i = months - 1; i >= 0; i--) {
      const date       = new Date();
      const month      = date.getMonth() - i;
      const targetDate = new Date(date.getFullYear(), month, 1);
      const startDate  = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      const endDate    = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);

      const totals = await prisma.transaction.groupBy({
        by: ['type'],
        where: {
          userId,
          isPaid: true,
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      });

      const income  = Number(totals.find(t => t.type === 'INCOME')?._sum.amount  || 0);
      const expense = Number(totals.find(t => t.type === 'EXPENSE')?._sum.amount || 0);

      // Nome abreviado do mês em português
      const monthName = targetDate.toLocaleDateString('pt-BR', { month: 'short' });

      result.push({
        month:     targetDate.getMonth() + 1,
        year:      targetDate.getFullYear(),
        monthName: monthName.replace('.', ''),
        income,
        expense,
        balance: income - expense,
      });
    }

    return result;
  }

  // ── Fluxo de caixa por período ───────────────────────────────────────
  // Retorna dia a dia do período para gráfico de área
  async getCashFlow(userId: number, filter: PeriodFilter) {
    const { startDate, endDate } = filter;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        isPaid: true,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: { date: true, type: true, amount: true },
      orderBy: { date: 'asc' },
    });

    // Agrupa por dia
    const grouped: Record<string, { income: number; expense: number }> = {};

    transactions.forEach(t => {
      const day = t.date.toISOString().split('T')[0];

      if (!grouped[day]) {
        grouped[day] = { income: 0, expense: 0 };
      }

      if (t.type === 'INCOME') {
        grouped[day].income += Number(t.amount);
      } else {
        grouped[day].expense += Number(t.amount);
      }
    });

    // Converte para array e adiciona saldo acumulado
    let accumulated = 0;
    const data = Object.entries(grouped).map(([date, values]) => {
      accumulated += values.income - values.expense;
      return {
        date,
        income:      values.income,
        expense:     values.expense,
        balance:     values.income - values.expense,
        accumulated: Number(accumulated.toFixed(2)),
      };
    });

    return data;
  }

  // ── Relatório detalhado por período ─────────────────────────────────
  // Retorna todas as transações do período com totais
  async getDetailedReport(userId: number, filter: PeriodFilter) {
    const { startDate, endDate } = filter;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        account:  { select: { id: true, name: true, icon: true, color: true } },
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
      orderBy: { date: 'desc' },
    });

    // Agrupa por mês
    const byMonth: Record<string, any> = {};

    transactions.forEach(t => {
      const key = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;

      if (!byMonth[key]) {
        byMonth[key] = {
          month:        t.date.getMonth() + 1,
          year:         t.date.getFullYear(),
          monthName:    t.date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
          transactions: [],
          totalIncome:  0,
          totalExpense: 0,
        };
      }

      byMonth[key].transactions.push(t);

      if (t.type === 'INCOME') {
        byMonth[key].totalIncome += Number(t.amount);
      } else {
        byMonth[key].totalExpense += Number(t.amount);
      }
    });

    // Totais gerais
    const totalIncome  = transactions.filter(t => t.type === 'INCOME').reduce((s, t)  => s + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0);

    return {
      period: { startDate, endDate },
      summary: {
        totalIncome,
        totalExpense,
        balance:          totalIncome - totalExpense,
        transactionCount: transactions.length,
      },
      byMonth: Object.values(byMonth),
    };
  }
}