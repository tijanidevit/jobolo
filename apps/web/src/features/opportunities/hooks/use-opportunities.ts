import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { opportunitiesApi } from '../api/opportunities.api';
import type { OpportunityPayload } from '../types';
import type { OpportunityStatus } from '@jobolo/shared';

export const opportunitiesQueryKey = ['opportunities'] as const;

export function useOpportunities() {
  const queryClient = useQueryClient();
  const opportunitiesQuery = useQuery({
    queryKey: opportunitiesQueryKey,
    queryFn: opportunitiesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (payload: OpportunityPayload) => opportunitiesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<OpportunityPayload> }) =>
      opportunitiesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: opportunitiesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey }),
  });

  const changeStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: OpportunityStatus }) => opportunitiesApi.changeStage(id, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey }),
  });

  return {
    opportunities: opportunitiesQuery.data?.data ?? [],
    isLoading: opportunitiesQuery.isLoading,
    error: opportunitiesQuery.error,
    refetch: opportunitiesQuery.refetch,
    createOpportunity: createMutation.mutateAsync,
    updateOpportunity: updateMutation.mutateAsync,
    deleteOpportunity: deleteMutation.mutateAsync,
    changeStage: changeStageMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStage: changeStageMutation.isPending,
  };
}
