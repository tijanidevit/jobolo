import { useQuery } from '@tanstack/react-query';
import { opportunitiesApi } from '../api/opportunities.api';

export function opportunityQueryKey(id: string) {
  return ['opportunities', id] as const;
}

export function useOpportunity(id: string) {
  const opportunityQuery = useQuery({
    queryKey: opportunityQueryKey(id),
    queryFn: () => opportunitiesApi.get(id),
    enabled: Boolean(id),
  });

  return {
    opportunity: opportunityQuery.data?.data ?? null,
    isLoading: opportunityQuery.isLoading,
    error: opportunityQuery.error,
    refetch: opportunityQuery.refetch,
  };
}
