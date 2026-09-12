'use client';

import { useParams } from 'next/navigation';
import { OpportunityDetailSections } from '@/features/opportunities/components/opportunity-detail/opportunity-detail-sections';
import { useOpportunity } from '@/features/opportunities/hooks/use-opportunity';

export default function OpportunityOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const { opportunity } = useOpportunity(id);
  return opportunity ? <OpportunityDetailSections opportunity={opportunity} /> : null;
}
