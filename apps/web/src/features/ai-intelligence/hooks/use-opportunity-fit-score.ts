import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiIntelligenceApi } from '../api/ai-intelligence.api';

export function useOpportunityFitScore(opportunityId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['opportunity-fit-score', opportunityId],
    queryFn: () => aiIntelligenceApi.getFitScore(opportunityId),
    select: (response) => response.data,
  });
  const mutation = useMutation({
    mutationFn: () => aiIntelligenceApi.generateFitScore(opportunityId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['opportunity-fit-score', opportunityId] }),
  });

  return {
    fitScore: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    generateFitScore: mutation.mutateAsync,
    isGenerating: mutation.isPending,
    generationError: mutation.error,
  };
}
