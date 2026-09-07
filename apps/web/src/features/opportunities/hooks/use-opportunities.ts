import { useQuery } from '@tanstack/react-query';
import { opportunitiesApi } from '../api/opportunities.api';
import type { OpportunityFilters } from '../types';

export const opportunitiesQueryKey = ['opportunities'] as const;

export function useOpportunities(filters: OpportunityFilters = {}) {
  const opportunitiesQuery = useQuery({
    queryKey: [...opportunitiesQueryKey, filters] as const,
    queryFn: () => opportunitiesApi.list(filters),
  });

  return {
    opportunities: opportunitiesQuery.data?.data ?? [],
    isLoading: opportunitiesQuery.isLoading,
    error: opportunitiesQuery.error,
    refetch: opportunitiesQuery.refetch,
  };
}
