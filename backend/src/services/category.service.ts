import prisma from '../prisma/client';
import { TransactionType } from '@prisma/client';

// ─── Tipos ────────────────────────────────────────────────────────────

interface CreateCategoryData {
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

interface UpdateCategoryData {
  name?: string;
  color?: string;
  icon?: string;
}

// ─── Serviço ──────────────────────────────────────────────────────────

export class CategoryService {

  // Lista todas as categorias do usuário
  async findAll(userId: number, type?: TransactionType) {
    const categories = await prisma.category.findMany({
      where: {
        userId,
        // Filtra por tipo se informado (INCOME ou EXPENSE)
        ...(type && { type }),
      },
      orderBy: [
        { isDefault: 'desc' }, // Categorias padrão primeiro
        { name: 'asc' },
      ],
    });

    return categories;
  }

  // Busca uma categoria específica
  async findById(id: number, userId: number) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new Error('Categoria não encontrada.');
    }

    return category;
  }

  // Cria nova categoria
  async create(userId: number, data: CreateCategoryData) {
    const existing = await prisma.category.findFirst({
      where: { userId, name: data.name, type: data.type },
    });

    if (existing) {
      throw new Error('Já existe uma categoria com esse nome.');
    }

    const category = await prisma.category.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        color: data.color || '#6366f1',
        icon: data.icon || 'tag',
        isDefault: false,
      },
    });

    return category;
  }

  // Atualiza uma categoria
  async update(id: number, userId: number, data: UpdateCategoryData) {
    const category = await this.findById(id, userId);

    // Não permite editar categorias padrão do sistema
    if (category.isDefault) {
      throw new Error('Categorias padrão não podem ser editadas.');
    }

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    return updated;
  }

  // Deleta uma categoria
  async delete(id: number, userId: number) {
    const category = await this.findById(id, userId);

    if (category.isDefault) {
      throw new Error('Categorias padrão não podem ser removidas.');
    }

    // Verifica se há transações usando essa categoria
    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id },
    });

    if (transactionCount > 0) {
      throw new Error(
        `Não é possível remover. Existem ${transactionCount} transação(ões) nessa categoria.`
      );
    }

    await prisma.category.delete({ where: { id } });

    return { message: 'Categoria removida com sucesso.' };
  }
}