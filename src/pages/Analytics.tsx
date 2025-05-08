import React, { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import ChartComponent from "../components/ChartComponent";
import { BarChart, PieChart, TrendingUp, Calendar } from "lucide-react";

// Add helper function at the top
const parseAmount = (amount: number | string): number => {
  if (typeof amount === "string") {
    // Remove currency symbol, spaces, and commas, then convert to number
    return Number(amount.replace(/[^0-9.-]+/g, ""));
  }
  return amount;
};

const chartTypes = [
  {
    id: "expenses-pie",
    label: "Expenses by Category",
    icon: <PieChart size={18} />,
    type: "pie",
    dataKey: "category",
  },
  {
    id: "income-vs-expenses",
    label: "Income vs Expenses",
    icon: <BarChart size={18} />,
    type: "bar",
    dataKey: "date",
  },
];

const Analytics: React.FC = () => {
  const { transactions, getTransactionsByType } = useTransactions();
  const [activePeriod, setActivePeriod] = useState<"week" | "month" | "year">(
    "month"
  );
  const [activeChartType, setActiveChartType] = useState(chartTypes[0]);

  const expenseTransactions = getTransactionsByType("expense");

  // Filter transactions based on the selected period
  const getFilteredTransactions = () => {
    const today = new Date();
    let startDate = new Date();

    if (activePeriod === "week") {
      startDate.setDate(today.getDate() - 7);
    } else if (activePeriod === "month") {
      startDate.setMonth(today.getMonth() - 1);
    } else if (activePeriod === "year") {
      startDate.setFullYear(today.getFullYear() - 1);
    }

    return transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= today
    );
  };

  // Calculate statistics with strict type checking
  const filteredTransactions = getFilteredTransactions();

  const totalIncome = filteredTransactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold">Analytics</h2>

      {/* Period selector */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-primary-500" />
            <span className="font-medium">Time Period:</span>
          </div>
          <div className="inline-flex rounded-md">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activePeriod === "week"
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
              onClick={() => setActivePeriod("week")}
            >
              Week
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activePeriod === "month"
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
              onClick={() => setActivePeriod("month")}
            >
              Month
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activePeriod === "year"
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
              onClick={() => setActivePeriod("year")}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center text-success-600 dark:text-success-400 mr-3">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Total Income
              </p>
              <h3 className="text-xl font-bold text-success-600 dark:text-success-400">
                {formatCurrency(totalIncome)}
              </h3>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center text-error-600 dark:text-error-400 mr-3">
              <TrendingUp size={20} className="transform rotate-180" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Total Expenses
              </p>
              <h3 className="text-xl font-bold text-error-600 dark:text-error-400">
                {formatCurrency(totalExpenses)}
              </h3>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 5L5 19M9 5H19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Savings Rate
              </p>
              <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {savingsRate.toFixed(1)}%
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Chart selector */}
      <div className="card p-4">
        <div className="overflow-x-auto">
          <div className="flex gap-4 mb-6">
            {chartTypes.map((chart) => (
              <button
                key={chart.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  activeChartType.id === chart.id
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
                onClick={() => setActiveChartType(chart)}
              >
                {chart.icon}
                <span>{chart.label}</span>
              </button>
            ))}
          </div>

          <div className="h-[400px]">
            <ChartComponent
              transactions={
                activeChartType.id === "expenses-pie"
                  ? expenseTransactions
                  : filteredTransactions
              }
              type={activeChartType.type as "bar" | "pie"}
              dataKey={activeChartType.dataKey as "category" | "date"}
            />
          </div>
        </div>
      </div>

      {/* Top spending categories */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold mb-4">Top Spending Categories</h3>
        <div className="space-y-4">
          {getTopSpendingCategories(expenseTransactions, 5).map((category) => (
            <div key={category.name} className="flex items-center gap-4">
              <div className="w-24">
                <p className="font-medium capitalize">{category.name}</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                  <div
                    className="bg-primary-500 h-2.5 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-24 text-right">
                <span>{formatCurrency(category.amount)}</span>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {category.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper to calculate top spending categories
function getTopSpendingCategories(transactions: Transaction[], limit: number) {
  const categoryMap: Record<string, number> = {};

  // Only include expense transactions
  transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .forEach((t) => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += parseAmount(t.amount);
    });

  // Calculate total expenses
  const totalExpenses = Object.values(categoryMap).reduce(
    (sum, amount) => sum + amount,
    0
  );

  // Convert to array and calculate percentages
  const categories = Object.entries(categoryMap).map(([name, amount]) => ({
    name,
    amount,
    percentage: (amount / totalExpenses) * 100,
  }));

  // Sort by amount (descending) and take top N
  return categories.sort((a, b) => b.amount - a.amount).slice(0, limit);
}

export default Analytics;
