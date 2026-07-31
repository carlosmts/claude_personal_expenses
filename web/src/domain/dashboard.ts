export interface MonthBreakdown {
  month: number;
  income: number;
  expense: number;
}

export interface DashboardSummary {
  year: number;
  month: number;
  allTimeIncome: number;
  allTimeExpense: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
  previousMonthIncome: number;
  previousMonthExpense: number;
  previousYearMonthIncome: number;
  previousYearMonthExpense: number;
  monthlyBreakdown: MonthBreakdown[];
}
