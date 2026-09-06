import { useQuery } from '@tanstack/react-query';
import { opportunitiesApi } from '../api/opportunities.api';

export const opportunitiesQueryKey = ['opportunities'] as const;

export function useOpportunities() {
  const opportunitiesQuery = useQuery({
    queryKey: opportunitiesQueryKey,
    queryFn: opportunitiesApi.list,
  });

  return {
    opportunities: opportunitiesQuery.data?.data ?? [],
    isLoading: opportunitiesQuery.isLoading,
    error: opportunitiesQuery.error,
    refetch: opportunitiesQuery.refetch,
  };
}
