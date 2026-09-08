import { useQuery } from '@tanstack/react-query';
import { jobSearchPulseApi } from '../api/job-search-pulse.api';

export const jobSearchPulseQueryKey = ['job-search-pulse'] as const;

export function useJobSearchPulse() {
  const query = useQuery({
    queryKey: jobSearchPulseQueryKey,
    queryFn: jobSearchPulseApi.overview,
  });

  return {
    pulse: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
