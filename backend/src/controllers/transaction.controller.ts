import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { TransactionType } from '@prisma/client';

const transactionService = new TransactionService();

export class TransactionController {

  // GET /transactions
  async index(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const {
        type,
        accountId,
        categoryId,
        startDate,
        endDate,
        isPaid,
        page,
        limit,
      } = req.query;

      const result = await transactionService.findAll(userId, {
        type:       type as TransactionType,
        accountId:  accountId  ? Number(accountId)  : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        startDate:  startDate  as string,
        endDate:    endDate    as string,
        isPaid:     isPaid !== undefined ? isPaid === 'true' : undefined,
        page:       page  ? Number(page)  : 1,
        limit:      limit ? Number(limit) : 20,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /transactions/:id
  async show(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = Number(req.params.id);
      const transaction = await transactionService.findById(id, userId);
      res.status(200).json(transaction);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // POST /transactions
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const {
        accountId,
        categoryId,
        type,
        amount,
        description,
        date,
        notes,
        isPaid,
        isRecurring,
      } = req.body;

      // Validações
      if (!accountId || !categoryId || !type || !amount || !description || !date) {
        res.status(400).json({
          error: 'Conta, categoria, tipo, valor, descrição e data são obrigatórios.',
        });
        return;
      }

      if (!['INCOME', 'EXPENSE'].includes(type)) {
        res.status(400).json({ error: 'Tipo inválido. Use INCOME ou EXPENSE.' });
        return;
      }

      if (Number(amount) <= 0) {
        res.status(400).json({ error: 'O valor deve ser maior que zero.' });
        return;
      }

      const transaction = await transactionService.create(userId, {
        accountId:   Number(accountId),
        categoryId:  Number(categoryId),
        type,
        amount:      Number(amount),
        description,
        date,
        notes,
        isPaid,
        isRecurring,
      });

      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /transactions/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = Number(req.params.id);
      const {
        accountId,
        categoryId,
        amount,
        description,
        date,
        notes,
        isPaid,
        isRecurring,
      } = req.body;

      if (amount !== undefined && Number(amount) <= 0) {
        res.status(400).json({ error: 'O valor deve ser maior que zero.' });
        return;
      }

      const transaction = await transactionService.update(id, userId, {
        accountId:   accountId  ? Number(accountId)  : undefined,
        categoryId:  categoryId ? Number(categoryId) : undefined,
        amount:      amount     ? Number(amount)     : undefined,
        description,
        date,
        notes,
        isPaid,
        isRecurring,
      });

      res.status(200).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /transactions/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = Number(req.params.id);
      const result = await transactionService.delete(id, userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}