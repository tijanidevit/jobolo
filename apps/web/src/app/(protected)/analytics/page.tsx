'use client';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { AdvancedAnalytics } from '@/features/analytics/components/analytics-advanced/advanced-analytics';
import { AnalyticsBreakdownCard } from '@/features/analytics/components/analytics-overview/analytics-breakdown-card';
import { AnalyticsHeader } from '@/features/analytics/components/analytics-overview/analytics-header';
import { AnalyticsMetrics } from '@/features/analytics/components/analytics-overview/analytics-metrics';
import { useAnalyticsOverview } from '@/features/analytics/hooks/use-analytics-overview';

export default function AnalyticsPage() {
  const { analytics, isLoading, error, refetch } = useAnalyticsOverview();

  if (isLoading) return <LoadingState variant="page" message="Loading analytics..." />;
  if (error || !analytics) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load analytics"
        message="Your job-search analytics could not be loaded."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <AnalyticsHeader />
      <AnalyticsMetrics metrics={analytics.metrics} />
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsBreakdownCard
          title="Status distribution"
          description="Where your opportunities are in the pipeline."
          items={analytics.statusDistribution}
        />
        <AnalyticsBreakdownCard
          title="Country distribution"
          description="Where the opportunities in your pipeline are located."
          items={analytics.countryDistribution}
        />
      </div>
      <AdvancedAnalytics analytics={analytics.advanced} />
    </div>
  );
}
