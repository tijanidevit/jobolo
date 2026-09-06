import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi, type UpdateOpportunityNotePayload } from '../api/notes.api';
import { opportunityNotesQueryKey } from './use-opportunity-notes';

export function useUpdateOpportunityNote(opportunityId: string, noteId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: UpdateOpportunityNotePayload) =>
      notesApi.update(opportunityId, noteId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: opportunityNotesQueryKey(opportunityId) }),
  });

  return { updateNote: mutation.mutateAsync, isUpdating: mutation.isPending };
}
