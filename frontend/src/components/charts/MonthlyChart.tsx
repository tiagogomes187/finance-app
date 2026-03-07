import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { MonthlyEvolution } from '../../types';
import { formatCurrency } from '../../utils/format';

interface TooltipEntry {
  name:  string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?:  boolean;
  payload?: TooltipEntry[];
  label?:   string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3">
      <p className="text-sm font-semibold text-gray-700 mb-2 capitalize">{label}</p>
      {payload.map((entry: TooltipEntry) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name === 'income' ? 'Receitas' : 'Despesas'}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

interface MonthlyChartProps {
  data:     MonthlyEvolution[];
  loading?: boolean;
}

export default function MonthlyChart({ data, loading }: MonthlyChartProps) {
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Evolução dos últimos 6 meses
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={14} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="monthName"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => value === 'income' ? 'Receitas' : 'Despesas'}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="income"  fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}