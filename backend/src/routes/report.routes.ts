import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const reportController = new ReportController();

router.use(authMiddleware);

// Resumo mensal — usado no Dashboard
router.get('/summary',    (req, res) => reportController.monthlySummary(req, res));

// Gastos por categoria — gráfico de pizza
router.get('/by-category',(req, res) => reportController.byCategory(req, res));

// Evolução mensal — gráfico de barras/linha
router.get('/evolution',  (req, res) => reportController.monthlyEvolution(req, res));

// Fluxo de caixa — gráfico de área
router.get('/cash-flow',  (req, res) => reportController.cashFlow(req, res));

// Relatório detalhado — exportação
router.get('/detailed',   (req, res) => reportController.detailedReport(req, res));

export default router;