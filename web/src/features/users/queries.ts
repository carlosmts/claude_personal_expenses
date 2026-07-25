import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { userFromDto, type UserDto } from '../../api/dto';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const dtos = await apiClient.get<UserDto[]>('/users');
      return dtos.map(userFromDto);
    },
  });
}
