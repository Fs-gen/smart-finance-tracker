import React, { useState } from 'react';
import { useTransactions, Transaction } from '../hooks/useTransactions';
import TransactionList from '../components/TransactionList';
import { Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { categoryList } from '../utils/categoryIcons';

const Transactions: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'income' | 'expense',
    category: 'all',
    startDate: '',
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Apply filters and search
  const filteredTransactions = transactions.filter((transaction) => {
    // Search term
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }
    
    // Date range
    if (filters.startDate && transaction.date < filters.startDate) {
      return false;
    }
    
    if (filters.endDate && transaction.date > filters.endDate) {
      return false;
    }
    
    return true;
  });
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  const resetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      startDate: '',
      endDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setSearchTerm('');
  };
  
  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <button
          className="btn btn-outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="card p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {(searchTerm || filters.type !== 'all' || filters.category !== 'all' || filters.startDate) && (
            <button
              className="btn btn-outline p-2"
              onClick={resetFilters}
              title="Clear filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Expandable filters */}
        {isFilterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-down">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="all">All Categories</option>
                {categoryList.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">From Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Transactions List */}
      <div className="card h-full">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'Transaction' : 'Transactions'}
          </h3>
        </div>
        <TransactionList
          transactions={filteredTransactions}
          onDelete={deleteTransaction}
        />
      </div>
    </div>
  );
};

export default Transactions;