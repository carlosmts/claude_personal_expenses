export interface CategoryAmount {
  categoryId: number;
  categoryName: string;
  amount: number;
}

export interface UserAmount {
  userId: number;
  userName: string;
  totalIncome: number;
  totalExpense: number;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  expensesByCategory: CategoryAmount[];
  incomeByCategory: CategoryAmount[];
  byUser: UserAmount[];
}
