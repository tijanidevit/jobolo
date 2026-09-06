import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { opportunitiesApi } from '../api/opportunities.api';
import type { OpportunityPayload } from '../types';
import type { OpportunityStatus } from '@jobolo/shared';

export function opportunityQueryKey(id: string) {
  return ['opportunities', id] as const;
}

export function useOpportunity(id: string) {
  const queryClient = useQueryClient();
  const opportunityQuery = useQuery({
    queryKey: opportunityQueryKey(id),
    queryFn: () => opportunitiesApi.get(id),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<OpportunityPayload>) => opportunitiesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => opportunitiesApi.remove(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: opportunityQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });

  const stageMutation = useMutation({
    mutationFn: (stage: OpportunityStatus) => opportunitiesApi.changeStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities', id, 'activities'] });
    },
  });

  return {
    opportunity: opportunityQuery.data?.data ?? null,
    isLoading: opportunityQuery.isLoading,
    error: opportunityQuery.error,
    refetch: opportunityQuery.refetch,
    updateOpportunity: updateMutation.mutateAsync,
    deleteOpportunity: deleteMutation.mutateAsync,
    changeStage: stageMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStage: stageMutation.isPending,
  };
}
