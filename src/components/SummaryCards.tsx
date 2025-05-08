import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';

const SummaryCards: React.FC = () => {
  const { getTotalByType } = useTransactions();
  
  const totalIncome = getTotalByType('income');
  const totalExpenses = getTotalByType('expense');
  const balance = totalIncome - totalExpenses;
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const cards = [
    {
      title: 'Saldo',
      value: formatAmount(balance),
      icon: <Wallet />,
      color: 'bg-primary-500',
      trend: balance > 0 ? 'up' : 'down',
      trendValue: '4,3%',
    },
    {
      title: 'Pemasukan',
      value: formatAmount(totalIncome),
      icon: <ArrowUpRight />,
      color: 'bg-success-500',
      trend: 'up',
      trendValue: '2,1%',
    },
    {
      title: 'Pengeluaran',
      value: formatAmount(totalExpenses),
      icon: <ArrowDownRight />,
      color: 'bg-error-500',
      trend: 'down',
      trendValue: '1,8%',
    },
    {
      title: 'Tingkat Tabungan',
      value: totalIncome > 0 
        ? `${Math.round((totalIncome - totalExpenses) / totalIncome * 100)}%` 
        : '0%',
      icon: <TrendingUp />,
      color: 'bg-secondary-500',
      trend: 'up',
      trendValue: '0,5%',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div 
          key={index}
          className="card p-4 hover:translate-y-[-2px] transform transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
            </div>
            <div className={`${card.color} text-white p-2 rounded-lg shadow-sm`}>
              {card.icon}
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className={`flex items-center text-xs ${
              card.trend === 'up' 
                ? 'text-success-600 dark:text-success-400' 
                : 'text-error-600 dark:text-error-400'
            }`}>
              {card.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span className="ml-1">{card.trendValue} dari bulan lalu</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;