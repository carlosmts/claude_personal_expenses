import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { goalFromDto, goalInputToDto, type GoalDto } from '../../api/dto';
import type { GoalInput } from '../../domain/goal';

export const GOALS_QUERY_KEY = ['goals'] as const;

export function useGoals() {
  return useQuery({
    queryKey: GOALS_QUERY_KEY,
    queryFn: async () => {
      const dtos = await apiClient.get<GoalDto[]>('/goals');
      return dtos.map(goalFromDto);
    },
  });
}

function useInvalidateGoals() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
}

export function useCreateGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: (input: GoalInput) => apiClient.post<GoalDto>('/goals', goalInputToDto(input)),
    onSuccess: invalidate,
  });
}

export function useUpdateGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: GoalInput }) =>
      apiClient.put<GoalDto>(`/goals/${id}`, goalInputToDto(input)),
    onSuccess: invalidate,
  });
}

export function useDeleteGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/goals/${id}`),
    onSuccess: invalidate,
  });
}
