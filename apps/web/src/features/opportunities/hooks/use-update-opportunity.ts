import { useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesApi } from '../api/opportunities.api';
import type { OpportunityPayload } from '../types';
import { opportunityQueryKey } from './use-opportunity';
import { opportunitiesQueryKey } from './use-opportunities';

export function useUpdateOpportunity(id: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: Partial<OpportunityPayload>) => opportunitiesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey });
    },
  });

  return { updateOpportunity: mutation.mutateAsync, isUpdating: mutation.isPending };
}
