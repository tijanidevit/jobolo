import { useMutation } from '@tanstack/react-query';
import { jobDescriptionAnalysisApi } from '../api/job-description-analysis.api';

export type JobDescriptionAnalysisInput = Parameters<typeof jobDescriptionAnalysisApi.analyze>[0];

export function useAnalyzeJobDescription() {
  const mutation = useMutation({
    mutationFn: jobDescriptionAnalysisApi.analyze,
  });

  return {
    analyzeJobDescription: mutation.mutateAsync,
    analysis: mutation.data?.data ?? null,
    isAnalyzing: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
