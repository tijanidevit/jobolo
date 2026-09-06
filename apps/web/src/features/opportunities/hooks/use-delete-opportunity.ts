import { useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesApi } from '../api/opportunities.api';
import { opportunityQueryKey } from './use-opportunity';
import { opportunitiesQueryKey } from './use-opportunities';

export function useDeleteOpportunity() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => opportunitiesApi.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: opportunityQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey });
    },
  });

  return {
    deleteOpportunity: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}
