import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { CategoryReport } from '../../types';
import { formatCurrency } from '../../utils/format';

interface TooltipPayloadItem {
  payload: CategoryReport;
}

interface TooltipProps {
  active?:  boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3">
      <p className="text-sm font-semibold text-gray-700">{d.categoryName}</p>
      <p className="text-xs text-gray-500 mt-1">{formatCurrency(d.amount)}</p>
      <p className="text-xs text-gray-400">{d.percentage}% do total</p>
    </div>
  );
}

interface CategoryChartProps {
  data:     CategoryReport[];
  loading?: boolean;
}

export default function CategoryChart({ data, loading }: CategoryChartProps) {
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="card flex items-center justify-center h-48">
        <p className="text-sm text-gray-400">Nenhuma despesa no período</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Despesas por categoria
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Gráfico */}
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="amount"
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legenda */}
        <div className="w-full md:w-48 space-y-2">
          {data.slice(0, 5).map((item) => (
            <div key={item.categoryId} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600 truncate">{item.categoryName}</span>
              </div>
              <span className="text-xs font-medium text-gray-700 ml-2">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}