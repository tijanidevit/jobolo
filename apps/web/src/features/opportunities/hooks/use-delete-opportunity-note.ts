import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../api/notes.api';
import { opportunityNotesQueryKey } from './use-opportunity-notes';

export function useDeleteOpportunityNote(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (noteId: string) => notesApi.remove(opportunityId, noteId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: opportunityNotesQueryKey(opportunityId) }),
  });

  return { deleteNote: mutation.mutateAsync, isDeleting: mutation.isPending };
}
