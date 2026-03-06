import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const transactionController = new TransactionController();

router.use(authMiddleware);

router.get('/',       (req, res) => transactionController.index(req, res));
router.get('/:id',    (req, res) => transactionController.show(req, res));
router.post('/',      (req, res) => transactionController.create(req, res));
router.put('/:id',    (req, res) => transactionController.update(req, res));
router.delete('/:id', (req, res) => transactionController.delete(req, res));

export default router;