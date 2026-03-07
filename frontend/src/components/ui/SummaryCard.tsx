import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/format';

interface SummaryCardProps {
  title:      string;
  value:      number;
  variation?: number;
  icon:       React.ReactNode;
  color:      'green' | 'red' | 'blue' | 'purple';
  loading?:   boolean;
}

const colorMap = {
  green:  { bg: 'bg-green-50',   text: 'text-green-600',   icon: 'bg-green-100'  },
  red:    { bg: 'bg-red-50',     text: 'text-red-600',     icon: 'bg-red-100'    },
  blue:   { bg: 'bg-blue-50',    text: 'text-blue-600',    icon: 'bg-blue-100'   },
  purple: { bg: 'bg-primary-50', text: 'text-primary-600', icon: 'bg-primary-100'},
};

export default function SummaryCard({
  title, value, variation, icon, color, loading
}: SummaryCardProps) {
  const colors = colorMap[color];

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${colors.text}`}>
            {formatCurrency(value)}
          </p>

          {/* Variação em relação ao mês anterior */}
          {variation !== undefined && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium
              ${variation >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {variation >= 0
                ? <TrendingUp size={12} />
                : <TrendingDown size={12} />
              }
              <span>{formatPercent(variation)} vs mês anterior</span>
            </div>
          )}
        </div>

        {/* Ícone */}
        <div className={`w-11 h-11 ${colors.icon} ${colors.text} 
                         rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}