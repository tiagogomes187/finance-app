import api from './api';
import type { MonthlySummary, CategoryReport, MonthlyEvolution } from '../types';

interface CategoryReportResponse {
  expenses:     CategoryReport[];
  incomes:      CategoryReport[];
  totalExpense: number;
  totalIncome:  number;
}

export const reportService = {
  async getMonthlySummary(month: number, year: number): Promise<MonthlySummary> {
    const response = await api.get<MonthlySummary>('/reports/summary', {
      params: { month, year },
    });
    return response.data;
  },

  async getByCategory(startDate: string, endDate: string): Promise<CategoryReportResponse> {
    const response = await api.get<CategoryReportResponse>('/reports/by-category', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async getMonthlyEvolution(months: number = 6): Promise<MonthlyEvolution[]> {
    const response = await api.get<MonthlyEvolution[]>('/reports/evolution', {
      params: { months },
    });
    return response.data;
  },

  async getCashFlow(startDate: string, endDate: string) {
    const response = await api.get('/reports/cash-flow', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};