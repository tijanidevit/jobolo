import { useQuery } from '@tanstack/react-query';
import { notesApi } from '../api/notes.api';

export function opportunityNotesQueryKey(opportunityId: string) {
  return ['opportunities', opportunityId, 'notes'] as const;
}

export function useOpportunityNotes(opportunityId: string, enabled = true) {
  const query = useQuery({
    queryKey: opportunityNotesQueryKey(opportunityId),
    queryFn: () => notesApi.list(opportunityId),
    enabled,
  });

  return {
    notes: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
