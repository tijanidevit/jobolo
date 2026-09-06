import { useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesApi } from '../api/opportunities.api';
import type { OpportunityPayload } from '../types';
import { opportunitiesQueryKey } from './use-opportunities';

export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: OpportunityPayload) => opportunitiesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey }),
  });

  return { createOpportunity: mutation.mutateAsync, isCreating: mutation.isPending };
}
