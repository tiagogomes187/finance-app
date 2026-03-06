import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const accountController = new AccountController();

// Todas as rotas de contas precisam de autenticação
router.use(authMiddleware);

router.get('/',     (req, res) => accountController.index(req, res));
router.get('/:id',  (req, res) => accountController.show(req, res));
router.post('/',    (req, res) => accountController.create(req, res));
router.put('/:id',  (req, res) => accountController.update(req, res));
router.delete('/:id', (req, res) => accountController.delete(req, res));

export default router;