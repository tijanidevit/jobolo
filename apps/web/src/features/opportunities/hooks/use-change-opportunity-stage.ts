import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { OpportunityStatus } from '@jobolo/shared';
import { opportunitiesApi } from '../api/opportunities.api';
import { opportunityQueryKey } from './use-opportunity';
import { opportunitiesQueryKey } from './use-opportunities';
import { opportunityTimelineKey } from './use-opportunity-timeline';

export function useChangeOpportunityStage() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: OpportunityStatus }) =>
      opportunitiesApi.changeStage(id, stage),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: opportunitiesQueryKey });
      queryClient.invalidateQueries({ queryKey: opportunityQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: opportunityTimelineKey(id) });
    },
  });

  return { changeStage: mutation.mutateAsync, isChangingStage: mutation.isPending };
}
