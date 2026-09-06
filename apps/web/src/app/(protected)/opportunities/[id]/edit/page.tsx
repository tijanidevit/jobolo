'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useOpportunity } from '@/features/opportunities/hooks/use-opportunity';
import { useUpdateOpportunity } from '@/features/opportunities/hooks/use-update-opportunity';
import type { OpportunityPayload } from '@/features/opportunities/types';
import { getErrorMessage, isNotFoundError } from '@/features/opportunities/utils/opportunity.utils';
import { OpportunityForm } from '@/features/opportunities/components/opportunity-form/opportunity-form';

export default function OpportunityEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { opportunity, isLoading, error, refetch } = useOpportunity(id);
  const { updateOpportunity, isUpdating } = useUpdateOpportunity(id);

  const save = async (payload: OpportunityPayload) => {
    await updateOpportunity(payload)
      .then(() => router.push(`/opportunities/${id}`))
      .catch(() => undefined);
  };

  if (isLoading) {
    return <LoadingState variant="page" message="Loading opportunity..." />;
  }

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
        backHref={`/opportunities/${id}`}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5">
        <Link
          href={`/opportunities/${id}`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to opportunity
        </Link>
      </div>
      <OpportunityForm
        opportunity={opportunity}
        isSaving={isUpdating}
        onSubmit={save}
        cancelHref={`/opportunities/${id}`}
      />
    </div>
  );
}
