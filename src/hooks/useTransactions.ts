import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'housing'
  | 'transportation'
  | 'food'
  | 'utilities'
  | 'insurance'
  | 'healthcare'
  | 'savings'
  | 'personal'
  | 'entertainment'
  | 'other'
  | 'salary'
  | 'business'
  | 'investment'
  | 'gift';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  type: TransactionType;
  notes?: string;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getRecentTransactions: (count: number) => Transaction[];
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByCategory: (category: Category) => Transaction[];
  getTotalByType: (type: TransactionType) => number;
  getTransactionById: (id: string) => Transaction | undefined;
  getPredictedCategories: (description: string) => Category[];
}

// Sample initial data
const initialTransactions: Transaction[] = [
  {
    id: '1',
    amount: 1200,
    description: 'Salary',
    category: 'salary',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'income',
  },
  {
    id: '2',
    amount: 45,
    description: 'Groceries',
    category: 'food',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense',
  },
  {
    id: '3',
    amount: 850,
    description: 'Rent',
    category: 'housing',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense',
  },
  {
    id: '4',
    amount: 120,
    description: 'Dining out',
    category: 'food',
    date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
    type: 'expense',
  },
  {
    id: '5',
    amount: 80,
    description: 'Electricity bill',
    category: 'utilities',
    date: format(new Date(Date.now() - 86400000 * 2), 'yyyy-MM-dd'),
    type: 'expense',
  },
  {
    id: '6',
    amount: 200,
    description: 'Freelance work',
    category: 'business',
    date: format(new Date(Date.now() - 86400000 * 3), 'yyyy-MM-dd'),
    type: 'income',
  },
];

// Map of common words to categories for our simple AI prediction
const categoryKeywords: Record<string, Category> = {
  'rent': 'housing',
  'mortgage': 'housing',
  'apartment': 'housing',
  'uber': 'transportation',
  'taxi': 'transportation',
  'lyft': 'transportation',
  'gas': 'transportation',
  'grocery': 'food',
  'groceries': 'food',
  'restaurant': 'food',
  'dinner': 'food',
  'lunch': 'food',
  'breakfast': 'food',
  'takeout': 'food',
  'electricity': 'utilities',
  'water': 'utilities',
  'internet': 'utilities',
  'phone': 'utilities',
  'insurance': 'insurance',
  'doctor': 'healthcare',
  'medical': 'healthcare',
  'medicine': 'healthcare',
  'pharmacy': 'healthcare',
  'savings': 'savings',
  'investment': 'investment',
  'stocks': 'investment',
  'crypto': 'investment',
  'clothes': 'personal',
  'haircut': 'personal',
  'gym': 'personal',
  'movie': 'entertainment',
  'game': 'entertainment',
  'netflix': 'entertainment',
  'spotify': 'entertainment',
  'salary': 'salary',
  'paycheck': 'salary',
  'business': 'business',
  'freelance': 'business',
  'gift': 'gift',
};

const parseAmount = (amount: number | string): number => {
  if (typeof amount === 'string') {
    return Number(amount.replace(/[^0-9.-]+/g, ''));
  }
  return amount;
};

export const useTransactions = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: initialTransactions,
      
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: Date.now().toString(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      
      updateTransaction: (id, transaction) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...transaction } : t
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      getRecentTransactions: (count) => {
        const { transactions } = get();
        return transactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, count);
      },
      
      getTransactionsByType: (type) => {
        const { transactions } = get();
        return transactions.filter((t) => t.type === type);
      },
      
      getTransactionsByCategory: (category) => {
        const { transactions } = get();
        return transactions.filter((t) => t.category === category);
      },
      
      getTotalByType: (type) => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.type === type)
          .reduce((sum, t) => sum + parseAmount(t.amount), 0);
      },
      
      getTransactionById: (id) => {
        const { transactions } = get();
        return transactions.find((t) => t.id === id);
      },
      
      // Simple AI category prediction based on description keywords
      getPredictedCategories: (description) => {
        if (!description) return ['other'];
        
        const desc = description.toLowerCase();
        const matches: Record<Category, number> = {
          housing: 0,
          transportation: 0,
          food: 0,
          utilities: 0,
          insurance: 0,
          healthcare: 0,
          savings: 0,
          personal: 0,
          entertainment: 0,
          other: 0,
          salary: 0,
          business: 0,
          investment: 0,
          gift: 0,
        };
        
        // Check for keyword matches
        Object.entries(categoryKeywords).forEach(([keyword, category]) => {
          if (desc.includes(keyword.toLowerCase())) {
            matches[category] += 1;
          }
        });
        
        // Sort categories by match count and return top 3
        const sortedCategories = Object.entries(matches)
          .sort((a, b) => b[1] - a[1])
          .map(([category]) => category as Category);
        
        // If no good matches, return 'other' as fallback
        return sortedCategories.slice(0, 3).filter(cat => matches[cat] > 0).length > 0
          ? sortedCategories.slice(0, 3).filter(cat => matches[cat] > 0)
          : ['other'];
      }
    }),
    {
      name: 'transactions-storage',
    }
  )
);