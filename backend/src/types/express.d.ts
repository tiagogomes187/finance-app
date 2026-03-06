// Estende a tipagem do Express para incluir o usuário autenticado
// Isso permite usar req.user em qualquer rota protegida
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}