import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiIntelligenceApi } from '../api/ai-intelligence.api';

export function useInterviewPreparation(opportunityId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['interview-preparation', opportunityId],
    queryFn: () => aiIntelligenceApi.getPreparation(opportunityId),
    select: (response) => response.data,
  });
  const mutation = useMutation({
    mutationFn: () => aiIntelligenceApi.generatePreparation(opportunityId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['interview-preparation', opportunityId] }),
  });

  return {
    preparation: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    generatePreparation: mutation.mutateAsync,
    isGenerating: mutation.isPending,
    generationError: mutation.error,
  };
}
