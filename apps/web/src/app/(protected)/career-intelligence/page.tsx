'use client';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { CareerIntelligenceContent } from '@/features/career-intelligence/components/career-intelligence-content';
import { useCareerIntelligence } from '@/features/career-intelligence/hooks/use-career-intelligence';

export default function CareerIntelligencePage() {
  const { intelligence, isLoading, error, refetch } = useCareerIntelligence();

  if (isLoading) return <LoadingState variant="page" message="Loading career intelligence..." />;
  if (error || !intelligence) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load career intelligence"
        message="Your career intelligence could not be loaded."
        onRetry={() => void refetch()}
      />
    );
  }

  return <CareerIntelligenceContent intelligence={intelligence} />;
}
