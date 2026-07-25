export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  categoryId: number;
  categoryName: string;
  userId: number;
  userName: string;
}

export interface TransactionInput {
  date: string;
  type: TransactionType;
  amount: number;
  categoryName: string;
  userId: number;
  description: string | null;
}
