import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi, type CreateOpportunityNotePayload } from '../api/notes.api';
import { opportunityNotesQueryKey } from './use-opportunity-notes';

export function useCreateOpportunityNote(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateOpportunityNotePayload) => notesApi.create(opportunityId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: opportunityNotesQueryKey(opportunityId) }),
  });

  return { createNote: mutation.mutateAsync, isCreating: mutation.isPending };
}
