import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Category, TransactionType, useTransactions } from '../hooks/useTransactions';
import { categoryList } from '../utils/categoryIcons';

interface TransactionFormProps {
  onSubmit: (transaction: any) => void;
  initialValues?: any;
  isEditing?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialValues,
  isEditing = false,
}) => {
  const { getPredictedCategories } = useTransactions();
  
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'other' as Category,
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense' as TransactionType,
    notes: '',
  });
  
  const [suggestions, setSuggestions] = useState<Category[]>([]);
  const [isCategoryFocused, setIsCategoryFocused] = useState(false);
  
  useEffect(() => {
    if (initialValues) {
      setForm({
        description: initialValues.description || '',
        amount: initialValues.amount?.toString() || '',
        category: initialValues.category || 'other',
        date: initialValues.date || format(new Date(), 'yyyy-MM-dd'),
        type: initialValues.type || 'expense',
        notes: initialValues.notes || '',
      });
    }
  }, [initialValues]);
  
  useEffect(() => {
    if (form.description.length > 2) {
      // Get AI predictions
      const predictions = getPredictedCategories(form.description);
      setSuggestions(predictions);
    } else {
      setSuggestions([]);
    }
  }, [form.description, getPredictedCategories]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction = {
      ...form,
      amount: parseFloat(form.amount),
    };
    
    onSubmit(transaction);
    
    // Clear form if not editing
    if (!isEditing) {
      setForm({
        description: '',
        amount: '',
        category: 'other',
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'expense',
        notes: '',
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      {/* Transaction Type Toggle */}
      <div className="mb-6">
        <div className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg flex">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
              form.type === 'expense'
                ? 'bg-error-500 text-white'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            onClick={() => setForm({ ...form, type: 'expense' })}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
              form.type === 'income'
                ? 'bg-success-500 text-white'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            onClick={() => setForm({ ...form, type: 'income' })}
          >
            Pemasukan
          </button>
        </div>
      </div>
      
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Deskripsi
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Untuk apa transaksi ini?"
          className="input-field"
          required
        />
      </div>
      
      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Jumlah
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-neutral-500">Rp</span>
          </div>
          <input
            type="number"
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleInputChange}
            placeholder="0"
            className="input-field pl-8"
            step="1000"
            min="0"
            required
          />
        </div>
      </div>
      
      {/* Category with AI suggestions */}
      <div className="relative">
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Kategori
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleInputChange}
            className="input-field"
            onFocus={() => setIsCategoryFocused(true)}
            onBlur={() => setTimeout(() => setIsCategoryFocused(false), 200)}
          >
            {categoryList.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          
          {/* AI Suggestions */}
          {suggestions.length > 0 && form.description && isCategoryFocused && (
            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 z-10 py-1 animate-slide-down">
              <div className="px-3 py-1 text-xs text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
                Saran AI
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  onClick={() => {
                    setForm({ ...form, category: suggestion });
                    setIsCategoryFocused(false);
                  }}
                >
                  {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Tanggal
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={form.date}
          onChange={handleInputChange}
          className="input-field"
          required
        />
      </div>
      
      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Catatan (Opsional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleInputChange}
          placeholder="Detail tambahan..."
          className="input-field min-h-[80px]"
        />
      </div>
      
      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className={`btn w-full ${
            form.type === 'income' ? 'bg-success-500 hover:bg-success-600' : 'bg-error-500 hover:bg-error-600'
          } text-white py-3`}
        >
          {isEditing ? 'Perbarui' : 'Simpan'} {form.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;