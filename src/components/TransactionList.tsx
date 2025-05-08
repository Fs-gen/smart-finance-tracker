import React from "react";
import { format, parseISO } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Transaction, TransactionType } from "../hooks/useTransactions";
import { categoryIcons } from "../utils/categoryIcons";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getCategoryIcon = (category: string) => {
  const Icon = categoryIcons[category] || categoryIcons.other;
  return <Icon size={18} />;
};

const formatAmount = (amount: number, type: TransactionType) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">
          No transactions found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden animate-fade-in">
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "income"
                      ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400"
                      : "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400"
                  }`}
                >
                  {getCategoryIcon(transaction.category)}
                </div>
                <div>
                  <h4 className="font-medium">{transaction.description}</h4>
                  <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="capitalize">{transaction.category}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {format(parseISO(transaction.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-medium ${
                    transaction.type === "income"
                      ? "text-success-600 dark:text-success-400"
                      : "text-error-600 dark:text-error-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatAmount(transaction.amount, transaction.type)}
                </span>

                {(onEdit || onDelete) && (
                  <div className="flex gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(transaction.id)}
                        className="p-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-1 text-neutral-500 hover:text-error-600 dark:hover:text-error-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
