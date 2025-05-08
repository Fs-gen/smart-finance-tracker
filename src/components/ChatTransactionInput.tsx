import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Check } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useGemini } from '../hooks/useGemini';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

const ChatTransactionInput: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Halo! Saya bisa membantu mencatat transaksi Anda. Cukup ceritakan tentang pemasukan atau pengeluaran Anda dalam bahasa sehari-hari.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addTransaction } = useTransactions();
  const { analyzeTransaction } = useGemini();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const transaction = await analyzeTransaction(input);

      if (!transaction) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: "Maaf, saya tidak bisa memahami detail transaksi. Pastikan mencantumkan jumlah dan deskripsi transaksi.",
          },
        ]);
        return;
      }

      // Add the transaction
      addTransaction(transaction);

      // Show success message
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Berhasil! Saya telah menambahkan ${transaction.type === 'income' ? 'pemasukan' : 'pengeluaran'} sebesar ${formatRupiah(transaction.amount)} untuk "${transaction.description}" dalam kategori ${transaction.category}.`,
        },
      ]);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "Maaf, saya tidak bisa memproses transaksi tersebut. Silakan coba lagi.",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] card">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mb-1 text-primary-500 dark:text-primary-400">
                  <Bot size={16} />
                  <span className="text-xs font-medium">Asisten AI</span>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ceritakan transaksi Anda... (contoh: 'Belanja makanan Rp50.000')"
            className="input-field pr-24"
            disabled={isProcessing}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {isProcessing ? (
              <Loader2 size={20} className="animate-spin text-neutral-500" />
            ) : isSuccess ? (
              <Check size={20} className="text-success-500" />
            ) : (
              <button
                type="submit"
                className="btn btn-primary p-2"
                disabled={!input.trim()}
              >
                <Send size={18} />
                <span className="sr-only">Kirim</span>
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Coba katakan seperti "Belanja makanan Rp50.000" atau "Terima gaji Rp5.000.000"
        </p>
      </form>
    </div>
  );
};

export default ChatTransactionInput;