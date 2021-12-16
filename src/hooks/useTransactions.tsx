import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const TransactionContext = createContext<TransactionDataContext>(
  {} as TransactionDataContext
);

interface TransactionProviderProps {
  children: ReactNode;
}

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionDataContext {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get("transactions").then((r) => setTransactions(r.data.transactions));
  }, []);

  async function createTransaction(transactionInput : TransactionInput) {
    const response = await api.post('/transactions', { 
      ...transactionInput,
      createdAt: new Date()
    });

    const { transaction } = response.data

    setTransactions([...transactions, transaction])
    
  }

  return(
    <TransactionContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext);

  return context;
} 
