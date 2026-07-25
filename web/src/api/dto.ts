// Wire-format DTOs, mirroring the backend's Pydantic schemas exactly
// (snake_case keys, Decimal fields serialized as strings to preserve
// precision). Mapping functions convert to the camelCase domain types with
// numeric amounts — the same DTO -> domain split used on iOS.

import type { Category } from '../domain/category';
import type { Goal, GoalInput } from '../domain/goal';
import type { CategoryAmount, MonthlySummary, UserAmount } from '../domain/summary';
import type { Transaction, TransactionInput } from '../domain/transaction';
import type { User } from '../domain/user';

export interface TransactionDto {
  id: number;
  date: string;
  type: string;
  amount: string;
  description: string | null;
  category_id: number;
  category_name: string;
  user_id: number;
  user_name: string;
}

export function transactionFromDto(dto: TransactionDto): Transaction {
  return {
    id: dto.id,
    date: dto.date,
    type: dto.type as Transaction['type'],
    amount: Number(dto.amount),
    description: dto.description,
    categoryId: dto.category_id,
    categoryName: dto.category_name,
    userId: dto.user_id,
    userName: dto.user_name,
  };
}

export function transactionInputToDto(input: TransactionInput) {
  return {
    date: input.date,
    type: input.type,
    amount: String(input.amount),
    category_name: input.categoryName,
    user_id: input.userId,
    description: input.description,
  };
}

export interface CategoryDto {
  id: number;
  name: string;
}

export function categoryFromDto(dto: CategoryDto): Category {
  return { id: dto.id, name: dto.name };
}

export interface UserDto {
  id: number;
  name: string;
}

export function userFromDto(dto: UserDto): User {
  return { id: dto.id, name: dto.name };
}

export interface GoalDto {
  id: number;
  user_id: number | null;
  user_name: string;
  name: string;
  target_amount: string;
  current_amount: string;
}

export function goalFromDto(dto: GoalDto): Goal {
  return {
    id: dto.id,
    userId: dto.user_id,
    userName: dto.user_name,
    name: dto.name,
    targetAmount: Number(dto.target_amount),
    currentAmount: Number(dto.current_amount),
  };
}

export function goalInputToDto(input: GoalInput) {
  return {
    user_id: input.userId,
    name: input.name,
    target_amount: String(input.targetAmount),
    current_amount: String(input.currentAmount),
  };
}

export interface CategoryAmountDto {
  category_id: number;
  category_name: string;
  amount: string;
}

function categoryAmountFromDto(dto: CategoryAmountDto): CategoryAmount {
  return {
    categoryId: dto.category_id,
    categoryName: dto.category_name,
    amount: Number(dto.amount),
  };
}

export interface UserAmountDto {
  user_id: number;
  user_name: string;
  total_income: string;
  total_expense: string;
}

function userAmountFromDto(dto: UserAmountDto): UserAmount {
  return {
    userId: dto.user_id,
    userName: dto.user_name,
    totalIncome: Number(dto.total_income),
    totalExpense: Number(dto.total_expense),
  };
}

export interface MonthlySummaryDto {
  year: number;
  month: number;
  total_income: string;
  total_expense: string;
  expenses_by_category: CategoryAmountDto[];
  income_by_category: CategoryAmountDto[];
  by_user: UserAmountDto[];
}

export function monthlySummaryFromDto(dto: MonthlySummaryDto): MonthlySummary {
  return {
    year: dto.year,
    month: dto.month,
    totalIncome: Number(dto.total_income),
    totalExpense: Number(dto.total_expense),
    expensesByCategory: dto.expenses_by_category.map(categoryAmountFromDto),
    incomeByCategory: dto.income_by_category.map(categoryAmountFromDto),
    byUser: dto.by_user.map(userAmountFromDto),
  };
}
