import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import TransactionForm from '../components/TransactionForm';
import ChatTransactionInput from '../components/ChatTransactionInput';
import { Check, MessageSquare, FormInput } from 'lucide-react';

const AddTransaction: React.FC = () => {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputMethod, setInputMethod] = useState<'form' | 'chat'>('form');
  
  const handleSubmit = (transaction: any) => {
    addTransaction(transaction);
    setIsSuccess(true);
    
    // Redirect after showing success message
    setTimeout(() => {
      navigate('/transactions');
    }, 1500);
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <h2 className="text-2xl font-bold">Tambah Transaksi</h2>

      {/* Input Method Toggle */}
      <div className="card p-4">
        <div className="flex gap-4">
          <button
            className={`flex-1 btn ${
              inputMethod === 'form'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
            onClick={() => setInputMethod('form')}
          >
            <FormInput size={20} />
            <span>Input Form</span>
          </button>
          <button
            className={`flex-1 btn ${
              inputMethod === 'chat'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
            onClick={() => setInputMethod('chat')}
          >
            <MessageSquare size={20} />
            <span>Chat dengan AI</span>
          </button>
        </div>
      </div>
      
      {inputMethod === 'form' ? (
        <div className="card p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 animate-scale-in">
              <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mb-4">
                <Check size={32} className="text-success-600 dark:text-success-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transaksi Tersimpan!</h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                Mengalihkan ke daftar transaksi...
              </p>
            </div>
          ) : (
            <TransactionForm onSubmit={handleSubmit} />
          )}
        </div>
      ) : (
        <ChatTransactionInput />
      )}
      
      {/* AI Tips */}
      <div className="card p-6 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800">
        <h3 className="text-lg font-semibold mb-4 text-secondary-800 dark:text-secondary-200">
          Tips AI Pintar
        </h3>
        <ul className="space-y-3 text-secondary-700 dark:text-secondary-300">
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Kami akan mengkategorikan transaksi Anda secara otomatis berdasarkan deskripsi.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Berikan deskripsi yang spesifik untuk kategorisasi yang lebih baik.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>Pengeluaran rutin seperti tagihan dan langganan akan dipantau untuk wawasan penganggaran.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddTransaction;