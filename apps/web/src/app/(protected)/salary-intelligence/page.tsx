'use client';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { SalaryIntelligenceContent } from '@/features/salary-intelligence/components/salary-intelligence-content';
import { useSalaryIntelligence } from '@/features/salary-intelligence/hooks/use-salary-intelligence';

export default function SalaryIntelligencePage() {
  const { intelligence, isLoading, error, refetch } = useSalaryIntelligence();
  if (isLoading) return <LoadingState variant="page" message="Loading salary intelligence..." />;
  if (error || !intelligence)
    return (
      <ErrorState
        variant="page"
        title="Unable to load salary intelligence"
        message="Your compensation data could not be analyzed."
        onRetry={() => void refetch()}
      />
    );
  if (intelligence.summary.recordedOpportunities === 0)
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Salary intelligence will appear here
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Record salary ranges or target salaries on opportunities to see your compensation
          patterns.
        </p>
      </div>
    );
  return <SalaryIntelligenceContent intelligence={intelligence} />;
}
