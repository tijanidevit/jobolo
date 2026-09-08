'use client';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { InsightsContent } from '@/features/insights/components/insights-content';
import { InsightsEmptyState } from '@/features/insights/components/insights-empty-state';
import { useInsights } from '@/features/insights/hooks/use-insights';

export default function InsightsPage() {
  const { insights, isLoading, error, refetch } = useInsights();

  if (isLoading) return <LoadingState variant="page" message="Loading insights..." />;
  if (error) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load insights"
        message="Your saved application patterns could not be analyzed."
        onRetry={() => void refetch()}
      />
    );
  }
  if (insights.length === 0) return <InsightsEmptyState />;
  return <InsightsContent insights={insights} />;
}
