import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { monthlySummaryFromDto, type MonthlySummaryDto } from '../../api/dto';

export function useMonthlySummary(year: number, month: number) {
  return useQuery({
    queryKey: ['monthly-summary', year, month],
    queryFn: async () => {
      const dto = await apiClient.get<MonthlySummaryDto>('/summary', { year, month });
      return monthlySummaryFromDto(dto);
    },
  });
}
