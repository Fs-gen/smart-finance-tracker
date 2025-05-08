import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Transaction, Category } from "../hooks/useTransactions";

interface ChartProps {
  transactions: Transaction[];
  type: "bar" | "pie";
  dataKey?: "category" | "date";
}

const COLORS = [
  "#00AFAE", // primary-500
  "#6800CC", // secondary-500
  "#FF6800", // accent-500
  "#00CC29", // success-500
  "#FFCC00", // warning-500
  "#CC0000", // error-500
  "#3B82F6", // blue-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#F59E0B", // amber-500
];

const ChartComponent: React.FC<ChartProps> = ({
  transactions,
  type,
  dataKey = "category",
}) => {
  const chartData = useMemo(() => {
    if (dataKey === "category") {
      // Group by category
      const groupedData: Record<Category, number> = transactions.reduce(
        (acc, transaction) => {
          const category = transaction.category;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += transaction.amount;
          return acc;
        },
        {} as Record<Category, number>
      );

      // Convert to array format for charts
      return Object.entries(groupedData).map(([category, amount]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: amount,
      }));
    } else {
      // Group by date
      const groupedData: Record<string, { income: number; expense: number }> =
        {};

      transactions.forEach((transaction) => {
        const date = transaction.date;
        if (!groupedData[date]) {
          groupedData[date] = { income: 0, expense: 0 };
        }

        if (transaction.type === "income") {
          groupedData[date].income += transaction.amount;
        } else {
          groupedData[date].expense += transaction.amount;
        }
      });

      // Convert to array format for charts
      return Object.entries(groupedData)
        .map(([date, values]) => ({
          date,
          income: values.income,
          expense: values.expense,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }
  }, [transactions, dataKey]);

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <p className="text-neutral-500 dark:text-neutral-400">
          No data available
        </p>
      </div>
    );
  }

  const renderChart = () => {
    if (type === "pie") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              animationDuration={500}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`Rp${value.toFixed(2)}`, "Amount"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (dataKey === "date") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`Rp${value.toFixed(2)}`, "Amount"]}
            />
            <Legend />
            <Bar
              dataKey="income"
              fill="#00CC29"
              name="Income"
              animationDuration={500}
            />
            <Bar
              dataKey="expense"
              fill="#CC0000"
              name="Expense"
              animationDuration={500}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip formatter={(value) => [`Rp${value.toFixed(2)}`, "Amount"]} />
          <Legend />
          <Bar dataKey="value" fill="#00AFAE" animationDuration={500} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="card p-4 h-full animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">
        {dataKey === "category"
          ? "Spending by Category"
          : "Income vs. Expenses"}
      </h3>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
