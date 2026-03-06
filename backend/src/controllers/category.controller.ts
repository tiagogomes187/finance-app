import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { TransactionType } from '@prisma/client';

const categoryService = new CategoryService();

export class CategoryController {

  // GET /categories?type=EXPENSE
  async index(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const type = req.query.type as TransactionType | undefined;

      const categories = await categoryService.findAll(userId, type);
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /categories/:id
  async show(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = Number(req.params.id);
      const category = await categoryService.findById(id, userId);
      res.status(200).json(category);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // POST /categories
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { name, type, color, icon } = req.body;

      if (!name || !type) {
        res.status(400).json({ error: 'Nome e tipo são obrigatórios.' });
        return;
      }

      const validTypes = ['INCOME', 'EXPENSE'];
      if (!validTypes.includes(type)) {
        res.status(400).json({ error: 'Tipo inválido. Use INCOME ou EXPENSE.' });
        return;
      }

      const category = await categoryService.create(userId, {
        name,
        type,
        color,
        icon,
      });

      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /categories/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = Number(req.params.id);
      const { name, color, icon } = req.body;

      const category = await categoryService.update(id, userId, {
        name,
        color,
        icon,
      });

      res.status(200).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /categories/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = Number(req.params.id);
      const result = await categoryService.delete(id, userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}