import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { transactionFromDto, transactionInputToDto, type TransactionDto } from '../../api/dto';
import type { TransactionInput } from '../../domain/transaction';
import { CATEGORIES_QUERY_KEY } from '../categories/queries';

export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const;
const DASHBOARD_SUMMARY_QUERY_KEY = ['dashboard-summary'] as const;

export function useTransactions() {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: async () => {
      const dtos = await apiClient.get<TransactionDto[]>('/transactions');
      return dtos.map(transactionFromDto);
    },
  });
}

function useInvalidateAfterMutation() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DASHBOARD_SUMMARY_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
  };
}

export function useCreateTransaction() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: (input: TransactionInput) =>
      apiClient.post<TransactionDto>('/transactions', transactionInputToDto(input)),
    onSuccess: invalidate,
  });
}

export function useUpdateTransaction() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TransactionInput }) =>
      apiClient.put<TransactionDto>(`/transactions/${id}`, transactionInputToDto(input)),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/transactions/${id}`),
    onSuccess: invalidate,
  });
}
