import api from './api';
import type { Account } from '../types';

interface AccountListResponse {
  accounts:     Account[];
  totalBalance: number;
}

interface CreateAccountData {
  name:     string;
  type:     string;
  balance:  number;
  color?:   string;
  icon?:    string;
}

export const accountService = {
  async getAll(): Promise<AccountListResponse> {
    const response = await api.get<AccountListResponse>('/accounts');
    return response.data;
  },

  async getById(id: number): Promise<Account> {
    const response = await api.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  async create(data: CreateAccountData): Promise<Account> {
    const response = await api.post<Account>('/accounts', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateAccountData>): Promise<Account> {
    const response = await api.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },
};