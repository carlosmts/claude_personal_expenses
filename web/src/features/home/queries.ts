import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { dashboardSummaryFromDto, type DashboardSummaryDto } from '../../api/dto';

export function useDashboardSummary(year: number, userId: number | null) {
  return useQuery({
    queryKey: ['dashboard-summary', year, userId],
    queryFn: async () => {
      const params: Record<string, string | number> = { year };
      if (userId !== null) {
        params.user_id = userId;
      }
      const dto = await apiClient.get<DashboardSummaryDto>('/dashboard', params);
      return dashboardSummaryFromDto(dto);
    },
  });
}
