'use client';

import { useParams, usePathname } from 'next/navigation';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useOpportunity } from '@/features/opportunities/hooks/use-opportunity';
import { getErrorMessage, isNotFoundError } from '@/features/opportunities/utils/opportunity.utils';
import { OpportunityDetailHeader } from '@/features/opportunities/components/opportunity-detail/opportunity-detail-header';
import { OpportunityTabs } from '@/features/opportunities/components/opportunity-detail/opportunity-tabs';

export default function OpportunityDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const id = params.id;
  const { opportunity, isLoading, error, refetch } = useOpportunity(id);

  if (isLoading) return <LoadingState variant="page" message="Loading opportunity..." />;
  if (error || !opportunity) {
    const notFound = !opportunity || isNotFoundError(error);
    return (
      <ErrorState
        variant="page"
        title="Unable to load opportunity"
        message={
          notFound
            ? 'Opportunity not found.'
            : getErrorMessage(error, 'This opportunity could not be loaded.')
        }
        onRetry={() => void refetch()}
        backHref="/opportunities"
      />
    );
  }

  const activeSegment = getActiveSegment(pathname);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <OpportunityDetailHeader opportunity={opportunity} />
      <OpportunityTabs opportunityId={id} activeSegment={activeSegment} />
      <main>{children}</main>
    </div>
  );
}

function getActiveSegment(
  pathname: string,
): 'overview' | 'activity' | 'notes' | 'interviews' | 'tasks' | 'contacts' {
  const segments = pathname.split('/').filter(Boolean);
  const segment = segments.find((value) =>
    ['activity', 'notes', 'interviews', 'tasks', 'contacts'].includes(value),
  );
  return segment === 'activity' ||
    segment === 'notes' ||
    segment === 'interviews' ||
    segment === 'tasks' ||
    segment === 'contacts'
    ? segment
    : 'overview';
}
