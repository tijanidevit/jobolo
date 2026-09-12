import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiIntelligenceApi } from '../api/ai-intelligence.api';

export function useInterviewMemory(opportunityId: string, interviewId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['interview-memory', opportunityId, interviewId],
    queryFn: () => aiIntelligenceApi.getMemory(opportunityId, interviewId),
    select: (response) => response.data,
  });
  const mutation = useMutation({
    mutationFn: (sourceText: string) =>
      aiIntelligenceApi.createMemory(opportunityId, interviewId, sourceText),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['interview-memory', opportunityId, interviewId] }),
  });

  return {
    memory: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createMemory: mutation.mutateAsync,
    isCreating: mutation.isPending,
    creationError: mutation.error,
  };
}
