import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coverLettersApi } from '../api/cover-letters.api';
import { coverLettersQueryKey } from './use-cover-letters';

export function useDeleteCoverLetter() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: coverLettersApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: coverLettersQueryKey }),
  });
  return { deleteCoverLetter: mutation.mutateAsync, isDeleting: mutation.isPending };
}
