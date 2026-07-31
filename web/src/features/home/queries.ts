import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { dashboardSummaryFromDto, type DashboardSummaryDto } from '../../api/dto';

export function useDashboardSummary(year: number, month: number, userId: number | null) {
  return useQuery({
    queryKey: ['dashboard-summary', year, month, userId],
    queryFn: async () => {
      const params: Record<string, string | number> = { year, month };
      if (userId !== null) {
        params.user_id = userId;
      }
      const dto = await apiClient.get<DashboardSummaryDto>('/dashboard', params);
      return dashboardSummaryFromDto(dto);
    },
  });
}
