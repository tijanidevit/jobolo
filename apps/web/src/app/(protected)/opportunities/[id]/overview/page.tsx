'use client';

import { useParams } from 'next/navigation';
import { OpportunityDetailSections } from '@/features/opportunities/components/opportunity-detail/opportunity-detail-sections';
import { useOpportunity } from '@/features/opportunities/hooks/use-opportunity';
import { OpportunityFitScorePanel } from '@/features/ai-intelligence/components/opportunity-fit-score-panel';

export default function OpportunityOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const { opportunity } = useOpportunity(id);
  return opportunity ? (
    <div className="space-y-6">
      <OpportunityFitScorePanel opportunityId={id} />
      <OpportunityDetailSections opportunity={opportunity} />
    </div>
  ) : null;
}
