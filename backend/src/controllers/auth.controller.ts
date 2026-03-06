import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {

  // POST /auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validações básicas
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
      }

      const result = await authService.register({ name, email, password });

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // POST /auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
        return;
      }

      const result = await authService.login({ email, password });

      res.status(200).json({
        message: 'Login realizado com sucesso!',
        ...result,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  // GET /auth/me — retorna dados do usuário logado
  async me(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        user: req.user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}