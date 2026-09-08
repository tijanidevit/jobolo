import { useQuery } from '@tanstack/react-query';
import { coverLettersApi } from '../api/cover-letters.api';

export const coverLettersQueryKey = ['cover-letters'] as const;

export function useCoverLetters() {
  const query = useQuery({ queryKey: coverLettersQueryKey, queryFn: coverLettersApi.list });
  return {
    coverLetters: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
