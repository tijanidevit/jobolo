import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';

export const analyticsOverviewQueryKey = ['analytics', 'overview'] as const;

export function useAnalyticsOverview() {
  const query = useQuery({
    queryKey: analyticsOverviewQueryKey,
    queryFn: analyticsApi.overview,
  });

  return {
    analytics: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
