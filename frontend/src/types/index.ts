// ─── Usuário ──────────────────────────────────────────────────────────
export interface User {
  id:       number;
  name:     string;
  email:    string;
  avatar?:  string;
  currency: string;
}

// ─── Conta ────────────────────────────────────────────────────────────
export type AccountType = 'CHECKING' | 'SAVINGS' | 'WALLET' | 'CREDIT' | 'INVESTMENT';

export interface Account {
  id:        number;
  userId:    number;
  name:      string;
  type:      AccountType;
  balance:   number;
  color:     string;
  icon:      string;
  isActive:  boolean;
  createdAt: string;
}

// ─── Categoria ────────────────────────────────────────────────────────
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id:        number;
  userId:    number;
  name:      string;
  type:      TransactionType;
  color:     string;
  icon:      string;
  isDefault: boolean;
}

// ─── Transação ────────────────────────────────────────────────────────
export interface Transaction {
  id:          number;
  userId:      number;
  accountId:   number;
  categoryId:  number;
  type:        TransactionType;
  amount:      number;
  description: string;
  date:        string;
  notes?:      string;
  isPaid:      boolean;
  isRecurring: boolean;
  account:     Pick<Account,  'id' | 'name' | 'color' | 'icon'>;
  category:    Pick<Category, 'id' | 'name' | 'color' | 'icon'>;
  createdAt:   string;
}

// ─── Paginação ────────────────────────────────────────────────────────
export interface Pagination {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// ─── Resposta de listagem de transações ───────────────────────────────
export interface TransactionListResponse {
  transactions: Transaction[];
  pagination:   Pagination;
  summary: {
    totalIncome:  number;
    totalExpense: number;
    balance:      number;
  };
}

// ─── Relatórios ───────────────────────────────────────────────────────
export interface MonthlySummary {
  month:        number;
  year:         number;
  totalBalance: number;
  income: {
    current:   number;
    previous:  number;
    variation: number;
  };
  expense: {
    current:   number;
    previous:  number;
    variation: number;
  };
  balance: number;
}

export interface CategoryReport {
  categoryId:   number;
  categoryName: string;
  color:        string;
  icon:         string;
  type:         TransactionType;
  amount:       number;
  count:        number;
  percentage:   number;
}

export interface MonthlyEvolution {
  month:     number;
  year:      number;
  monthName: string;
  income:    number;
  expense:   number;
  balance:   number;
}