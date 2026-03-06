import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
}

// Middleware que protege rotas — verifica se o token JWT é válido
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 1. Pega o token do header Authorization
  // O formato esperado é: "Bearer eyJhbGc..."
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
  }

  // 2. Extrai só o token (remove o "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verifica e decodifica o token
    const secret = process.env.JWT_SECRET as string;
    const payload = jwt.verify(token, secret) as TokenPayload;

    // 4. Adiciona os dados do usuário na requisição
    // Agora qualquer rota pode acessar req.user.id
    req.user = {
      id: payload.id,
      email: payload.email,
    };

    // 5. Passa para o próximo middleware ou rota
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}