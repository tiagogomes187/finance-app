import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Rotas públicas (não precisam de token)
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login',    (req, res) => authController.login(req, res));

// Rota protegida (precisa de token)
router.get('/me', authMiddleware, (req, res) => authController.me(req, res));

export default router;