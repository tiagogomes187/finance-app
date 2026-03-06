import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ─── Moeda ────────────────────────────────────────────────────────────

// Formata número para moeda brasileira: 1500.50 → "R$ 1.500,50"
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style:    'currency',
    currency: 'BRL',
  }).format(value);
}

// Formata para exibição compacta: 1500000 → "R$ 1,5M"
export function formatCurrencyCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}

// ─── Datas ────────────────────────────────────────────────────────────

// Formata data: "2026-03-05" → "05/03/2026"
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return format(d, 'dd/MM/yyyy', { locale: ptBR });
}

// Formata data por extenso: "2026-03-05" → "5 de março de 2026"
export function formatDateLong(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

// Formata mês e ano: "2026-03-05" → "Março 2026"
export function formatMonthYear(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return format(d, "MMMM 'de' yyyy", { locale: ptBR });
}

// ─── Percentual ───────────────────────────────────────────────────────

// Formata percentual com sinal: 15.5 → "+15,5%" | -8.2 → "-8,2%"
export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1).replace('.', ',')}%`;
}

// ─── Tipos de conta ───────────────────────────────────────────────────

export const accountTypeLabels: Record<string, string> = {
  CHECKING:   'Conta Corrente',
  SAVINGS:    'Poupança',
  WALLET:     'Carteira',
  CREDIT:     'Cartão de Crédito',
  INVESTMENT: 'Investimento',
};

// ─── Iniciais do nome ─────────────────────────────────────────────────

// Extrai iniciais: "João Silva" → "JS"
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}