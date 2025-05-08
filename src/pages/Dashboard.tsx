import React from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import SummaryCards from "../components/SummaryCards";
import TransactionList from "../components/TransactionList";
import ChartComponent from "../components/ChartComponent";

// Add the parseAmount helper at the top (same as Analytics page)
const parseAmount = (amount: number | string): number => {
  if (typeof amount === "string") {
    return Number(amount.replace(/[^0-9.-]+/g, ""));
  }
  return amount;
};

const Dashboard: React.FC = () => {
  const { getRecentTransactions, getTransactionsByType } = useTransactions();

  const recentTransactions = getRecentTransactions(5);
  const expenseTransactions = getTransactionsByType("expense");

  // Update the calculations with proper type checking and amount parsing
  const recentIncomeTotal = recentTransactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const recentExpensesTotal = recentTransactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const recentIncome = recentTransactions
    .filter((t) => t.type.toLowerCase() === "income")
    .slice(0, 5);

  const recentExpenses = recentTransactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .slice(0, 5);

  const netChange = recentIncomeTotal - recentExpensesTotal;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Welcome back!</h2>
        <Link to="/add" className="btn btn-primary">
          <Plus size={20} />
          <span>Add Transaction</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Link
                to="/transactions"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                View all
              </Link>
            </div>
            <TransactionList transactions={recentTransactions} />
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            {/* Expense by Category */}
            <ChartComponent
              transactions={expenseTransactions}
              type="pie"
              dataKey="category"
            />

            {/* Income vs Expenses */}
            <ChartComponent
              transactions={recentTransactions}
              type="bar"
              dataKey="date"
            />
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="card p-6 bg-gradient-to-r from-primary-500/90 to-secondary-500/90 text-white">
        <div className="flex items-start space-x-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16V12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8H12.01"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              AI Financial Insights
            </h3>
            <p className="mb-4">
              Based on your spending patterns, here are some personalized
              insights:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>
                  You spent 30% more on food this month compared to last month.
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>
                  Your utility bills are consistently higher than the average in
                  your area.
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>
                  If you maintain your current savings rate, you'll reach your
                  goal in 8 months.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
