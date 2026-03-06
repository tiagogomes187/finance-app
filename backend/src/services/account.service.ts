import prisma from '../prisma/client';
import { AccountType } from '@prisma/client';

// ─── Tipos ────────────────────────────────────────────────────────────

interface CreateAccountData {
  name: string;
  type: AccountType;
  balance: number;
  color?: string;
  icon?: string;
}

interface UpdateAccountData {
  name?: string;
  type?: AccountType;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

// ─── Serviço ──────────────────────────────────────────────────────────

export class AccountService {

  // Lista todas as contas do usuário
  async findAll(userId: number) {
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    // Calcula o saldo total de todas as contas
    const totalBalance = accounts.reduce((sum, acc) => {
      return sum + Number(acc.balance);
    }, 0);

    return { accounts, totalBalance };
  }

  // Busca uma conta específica
  async findById(id: number, userId: number) {
    const account = await prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new Error('Conta não encontrada.');
    }

    return account;
  }

  // Cria nova conta
  async create(userId: number, data: CreateAccountData) {
    // Verifica se já existe conta com esse nome para o usuário
    const existing = await prisma.account.findFirst({
      where: { userId, name: data.name },
    });

    if (existing) {
      throw new Error('Você já possui uma conta com esse nome.');
    }

    const account = await prisma.account.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        balance: data.balance,
        color: data.color || '#6366f1',
        icon: data.icon || 'wallet',
      },
    });

    return account;
  }

  // Atualiza uma conta
  async update(id: number, userId: number, data: UpdateAccountData) {
    // Garante que a conta pertence ao usuário
    await this.findById(id, userId);

    const account = await prisma.account.update({
      where: { id },
      data,
    });

    return account;
  }

  // Deleta (desativa) uma conta
  async delete(id: number, userId: number) {
    await this.findById(id, userId);

    // Soft delete — apenas desativa, não apaga do banco
    // Isso preserva o histórico de transações
    await prisma.account.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Conta removida com sucesso.' };
  }
}