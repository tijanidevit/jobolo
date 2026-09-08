import { useQuery } from '@tanstack/react-query';
import { resumesApi } from '../api/resumes.api';

export const resumesQueryKey = ['resumes'] as const;

export function useResumes() {
  const query = useQuery({ queryKey: resumesQueryKey, queryFn: resumesApi.list });

  return {
    resumes: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
