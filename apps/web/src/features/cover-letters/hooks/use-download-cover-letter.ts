import { useMutation } from '@tanstack/react-query';
import { coverLettersApi } from '../api/cover-letters.api';

export function useDownloadCoverLetter() {
  const mutation = useMutation({ mutationFn: coverLettersApi.download });
  return {
    downloadCoverLetter: mutation.mutateAsync,
    downloadingId: mutation.isPending ? mutation.variables : null,
  };
}
