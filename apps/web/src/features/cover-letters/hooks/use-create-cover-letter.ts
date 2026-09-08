import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coverLettersApi } from '../api/cover-letters.api';
import { coverLettersQueryKey } from './use-cover-letters';

export function useCreateCoverLetter() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      payload,
      file,
    }: {
      payload: Parameters<typeof coverLettersApi.create>[0];
      file: File;
    }) => coverLettersApi.create(payload, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: coverLettersQueryKey }),
  });
  return { createCoverLetter: mutation.mutateAsync, isCreating: mutation.isPending };
}
