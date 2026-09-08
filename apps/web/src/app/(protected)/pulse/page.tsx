'use client';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { PulseContent } from '@/features/job-search-pulse/components/pulse-content';
import { useJobSearchPulse } from '@/features/job-search-pulse/hooks/use-job-search-pulse';

export default function JobSearchPulsePage() {
  const { pulse, isLoading, error, refetch } = useJobSearchPulse();

  if (isLoading) return <LoadingState variant="page" message="Loading job search pulse..." />;
  if (error || !pulse) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load job search pulse"
        message="Your period comparison could not be loaded."
        onRetry={() => void refetch()}
      />
    );
  }

  return <PulseContent pulse={pulse} />;
}
