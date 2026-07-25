import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { categoryFromDto, type CategoryDto } from '../../api/dto';

export const CATEGORIES_QUERY_KEY = ['categories'] as const;

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const dtos = await apiClient.get<CategoryDto[]>('/categories');
      return dtos.map(categoryFromDto);
    },
  });
}
