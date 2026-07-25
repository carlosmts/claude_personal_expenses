import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { userFromDto, type UserDto } from '../../api/dto';

export const USERS_QUERY_KEY = ['users'] as const;

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const dtos = await apiClient.get<UserDto[]>('/users');
      return dtos.map(userFromDto);
    },
  });
}

export function useRenameUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => apiClient.put<UserDto>(`/users/${id}`, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });
}
