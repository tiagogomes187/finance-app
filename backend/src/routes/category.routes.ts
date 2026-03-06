import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const categoryController = new CategoryController();

router.use(authMiddleware);

router.get('/',       (req, res) => categoryController.index(req, res));
router.get('/:id',    (req, res) => categoryController.show(req, res));
router.post('/',      (req, res) => categoryController.create(req, res));
router.put('/:id',    (req, res) => categoryController.update(req, res));
router.delete('/:id', (req, res) => categoryController.delete(req, res));

export default router;