import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../api/insights.api';

export const insightsQueryKey = ['insights'] as const;

export function useInsights() {
  const query = useQuery({
    queryKey: insightsQueryKey,
    queryFn: insightsApi.overview,
  });

  return {
    insights: query.data?.data.insights ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
