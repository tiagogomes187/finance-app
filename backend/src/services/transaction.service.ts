import prisma from '../prisma/client';
import { TransactionType } from '@prisma/client';

// ─── Tipos ────────────────────────────────────────────────────────────

interface CreateTransactionData {
  accountId: number;
  categoryId: number;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  notes?: string;
  isPaid?: boolean;
  isRecurring?: boolean;
}

interface UpdateTransactionData {
  accountId?: number;
  categoryId?: number;
  amount?: number;
  description?: string;
  date?: string;
  notes?: string;
  isPaid?: boolean;
  isRecurring?: boolean;
}

interface FilterTransactionData {
  type?: TransactionType;
  accountId?: number;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  isPaid?: boolean;
  page?: number;
  limit?: number;
}

// ─── Serviço ──────────────────────────────────────────────────────────

export class TransactionService {

  // Lista transações com filtros e paginação
  async findAll(userId: number, filters: FilterTransactionData) {
    const {
      type,
      accountId,
      categoryId,
      startDate,
      endDate,
      isPaid,
      page = 1,
      limit = 20,
    } = filters;

    // Monta os filtros dinamicamente
    const where: any = { userId };

    if (type)       where.type = type;
    if (accountId)  where.accountId = accountId;
    if (categoryId) where.categoryId = categoryId;
    if (isPaid !== undefined) where.isPaid = isPaid;

    // Filtro de período
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate)   where.date.lte = new Date(endDate);
    }

    // Busca as transações com paginação
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account:  { select: { id: true, name: true, color: true, icon: true } },
          category: { select: { id: true, name: true, color: true, icon: true } },
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    // Calcula totais do período filtrado
    const totals = await prisma.transaction.groupBy({
      by: ['type'],
      where,
      _sum: { amount: true },
    });

    const totalIncome  = totals.find(t => t.type === 'INCOME')?._sum.amount  || 0;
    const totalExpense = totals.find(t => t.type === 'EXPENSE')?._sum.amount || 0;

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalIncome:  Number(totalIncome),
        totalExpense: Number(totalExpense),
        balance:      Number(totalIncome) - Number(totalExpense),
      },
    };
  }

  // Busca uma transação específica
  async findById(id: number, userId: number) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account:  { select: { id: true, name: true, color: true, icon: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
      },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada.');
    }

    return transaction;
  }

  // Cria nova transação
  async create(userId: number, data: CreateTransactionData) {
    // Verifica se a conta pertence ao usuário
    const account = await prisma.account.findFirst({
      where: { id: data.accountId, userId },
    });

    if (!account) {
      throw new Error('Conta não encontrada.');
    }

    // Verifica se a categoria pertence ao usuário
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });

    if (!category) {
      throw new Error('Categoria não encontrada.');
    }

    // Verifica se o tipo da transação bate com o tipo da categoria
    if (category.type !== data.type) {
      throw new Error(
        `Categoria do tipo ${category.type === 'INCOME' ? 'Receita' : 'Despesa'} 
         não pode ser usada em uma ${data.type === 'INCOME' ? 'Receita' : 'Despesa'}.`
      );
    }

    // Cria a transação e atualiza o saldo da conta em uma única operação
    // "transaction" aqui é do Prisma — garante que tudo acontece junto ou nada acontece
    const result = await prisma.$transaction(async (tx) => {
      // 1. Cria a transação
      const transaction = await tx.transaction.create({
        data: {
          userId,
          accountId:   data.accountId,
          categoryId:  data.categoryId,
          type:        data.type,
          amount:      data.amount,
          description: data.description,
          date:        new Date(data.date),
          notes:       data.notes,
          isPaid:      data.isPaid ?? true,
          isRecurring: data.isRecurring ?? false,
        },
        include: {
          account:  { select: { id: true, name: true, color: true, icon: true } },
          category: { select: { id: true, name: true, color: true, icon: true } },
        },
      });

      // 2. Atualiza o saldo da conta (só se a transação estiver paga)
      if (data.isPaid !== false) {
        const balanceChange = data.type === 'INCOME'
          ? data.amount    // Receita: soma
          : -data.amount;  // Despesa: subtrai

        await tx.account.update({
          where: { id: data.accountId },
          data:  { balance: { increment: balanceChange } },
        });
      }

      return transaction;
    });

    return result;
  }

  // Atualiza uma transação
  async update(id: number, userId: number, data: UpdateTransactionData) {
    // Busca a transação original
    const original = await this.findById(id, userId);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Reverte o efeito da transação original no saldo
      if (original.isPaid) {
        const revertAmount = original.type === 'INCOME'
          ? -Number(original.amount)
          : Number(original.amount);

        await tx.account.update({
          where: { id: original.accountId },
          data:  { balance: { increment: revertAmount } },
        });
      }

      // 2. Atualiza a transação
      const updated = await tx.transaction.update({
        where: { id },
        data: {
          ...(data.accountId   && { accountId: data.accountId }),
          ...(data.categoryId  && { categoryId: data.categoryId }),
          ...(data.amount      && { amount: data.amount }),
          ...(data.description && { description: data.description }),
          ...(data.date        && { date: new Date(data.date) }),
          ...(data.notes       !== undefined && { notes: data.notes }),
          ...(data.isPaid      !== undefined && { isPaid: data.isPaid }),
          ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
        },
        include: {
          account:  { select: { id: true, name: true, color: true, icon: true } },
          category: { select: { id: true, name: true, color: true, icon: true } },
        },
      });

      // 3. Aplica o novo efeito no saldo
      const newAccountId = data.accountId || original.accountId;
      const newAmount    = data.amount    || Number(original.amount);
      const newType      = original.type;
      const newIsPaid    = data.isPaid !== undefined ? data.isPaid : original.isPaid;

      if (newIsPaid) {
        const balanceChange = newType === 'INCOME' ? newAmount : -newAmount;
        await tx.account.update({
          where: { id: newAccountId },
          data:  { balance: { increment: balanceChange } },
        });
      }

      return updated;
    });

    return result;
  }

  // Deleta uma transação
  async delete(id: number, userId: number) {
    const transaction = await this.findById(id, userId);

    await prisma.$transaction(async (tx) => {
      // 1. Reverte o saldo da conta
      if (transaction.isPaid) {
        const revertAmount = transaction.type === 'INCOME'
          ? -Number(transaction.amount)
          : Number(transaction.amount);

        await tx.account.update({
          where: { id: transaction.accountId },
          data:  { balance: { increment: revertAmount } },
        });
      }

      // 2. Deleta a transação
      await tx.transaction.delete({ where: { id } });
    });

    return { message: 'Transação removida com sucesso.' };
  }
}