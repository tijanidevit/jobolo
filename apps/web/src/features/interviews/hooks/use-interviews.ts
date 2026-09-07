import { useQuery } from '@tanstack/react-query';
import { interviewsApi } from '../api/interviews.api';

export function interviewsQueryKey(opportunityId: string) {
  return ['opportunities', opportunityId, 'interviews'] as const;
}

export function useInterviews(opportunityId: string) {
  const query = useQuery({
    queryKey: interviewsQueryKey(opportunityId),
    queryFn: () => interviewsApi.list(opportunityId),
  });

  return {
    interviews: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
