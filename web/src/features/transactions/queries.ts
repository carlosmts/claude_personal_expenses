import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { transactionFromDto, type TransactionDto } from '../../api/dto';

export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const;

export function useTransactions() {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: async () => {
      const dtos = await apiClient.get<TransactionDto[]>('/transactions');
      return dtos.map(transactionFromDto);
    },
  });
}
