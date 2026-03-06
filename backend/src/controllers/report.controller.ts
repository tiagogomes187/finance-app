import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';

const reportService = new ReportService();

export class ReportController {

  // GET /reports/summary?month=3&year=2026
  async monthlySummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const now    = new Date();
      const month  = Number(req.query.month) || now.getMonth() + 1;
      const year   = Number(req.query.year)  || now.getFullYear();

      const data = await reportService.getMonthlySummary(userId, { month, year });
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /reports/by-category?startDate=2026-03-01&endDate=2026-03-31
  async byCategory(req: Request, res: Response): Promise<void> {
    try {
      const userId    = req.user!.id;
      const startDate = req.query.startDate as string;
      const endDate   = req.query.endDate   as string;

      if (!startDate || !endDate) {
        res.status(400).json({ error: 'startDate e endDate são obrigatórios.' });
        return;
      }

      const data = await reportService.getByCategory(userId, { startDate, endDate });
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /reports/evolution?months=6
  async monthlyEvolution(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const months = Number(req.query.months) || 6;

      const data = await reportService.getMonthlyEvolution(userId, months);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /reports/cash-flow?startDate=2026-03-01&endDate=2026-03-31
  async cashFlow(req: Request, res: Response): Promise<void> {
    try {
      const userId    = req.user!.id;
      const startDate = req.query.startDate as string;
      const endDate   = req.query.endDate   as string;

      if (!startDate || !endDate) {
        res.status(400).json({ error: 'startDate e endDate são obrigatórios.' });
        return;
      }

      const data = await reportService.getCashFlow(userId, { startDate, endDate });
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /reports/detailed?startDate=2026-01-01&endDate=2026-03-31
  async detailedReport(req: Request, res: Response): Promise<void> {
    try {
      const userId    = req.user!.id;
      const startDate = req.query.startDate as string;
      const endDate   = req.query.endDate   as string;

      if (!startDate || !endDate) {
        res.status(400).json({ error: 'startDate e endDate são obrigatórios.' });
        return;
      }

      const data = await reportService.getDetailedReport(userId, { startDate, endDate });
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}