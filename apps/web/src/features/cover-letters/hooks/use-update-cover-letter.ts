import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coverLettersApi } from '../api/cover-letters.api';
import { coverLettersQueryKey } from './use-cover-letters';

export function useUpdateCoverLetter() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof coverLettersApi.update>[1];
    }) => coverLettersApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: coverLettersQueryKey }),
  });
  return { updateCoverLetter: mutation.mutateAsync, isUpdating: mutation.isPending };
}
