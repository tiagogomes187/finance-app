import { Request, Response } from 'express';
import { AccountService } from '../services/account.service';

const accountService = new AccountService();

export class AccountController {

  // GET /accounts
  async index(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await accountService.findAll(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /accounts/:id
  async show(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = Number(req.params.id);
      const account = await accountService.findById(id, userId);
      res.status(200).json(account);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // POST /accounts
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { name, type, balance, color, icon } = req.body;

      if (!name || !type) {
        res.status(400).json({ error: 'Nome e tipo são obrigatórios.' });
        return;
      }

      const validTypes = ['CHECKING', 'SAVINGS', 'WALLET', 'CREDIT', 'INVESTMENT'];
      if (!validTypes.includes(type)) {
        res.status(400).json({ error: 'Tipo de conta inválido.' });
        return;
      }

      const account = await accountService.create(userId, {
        name,
        type,
        balance: Number(balance) || 0,
        color,
        icon,
      });

      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /accounts/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = Number(req.params.id);
      const { name, type, color, icon, isActive } = req.body;

      const account = await accountService.update(id, userId, {
        name,
        type,
        color,
        icon,
        isActive,
      });

      res.status(200).json(account);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /accounts/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = Number(req.params.id);
      const result = await accountService.delete(id, userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}