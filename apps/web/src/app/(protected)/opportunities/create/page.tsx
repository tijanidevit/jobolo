'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OpportunityForm } from '@/features/opportunities/components/opportunity-form/opportunity-form';
import { useCreateOpportunity } from '@/features/opportunities/hooks/use-create-opportunity';
import type { OpportunityPayload } from '@/features/opportunities/types';

export default function OpportunityCreatePage() {
  const router = useRouter();
  const { createOpportunity, isCreating } = useCreateOpportunity();

  const save = async (payload: OpportunityPayload) => {
    const response = await createOpportunity(payload);
    router.replace(`/opportunities/${response.data.id}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5">
        <Link
          href="/opportunities"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to opportunities
        </Link>
      </div>
      <OpportunityForm
        opportunity={null}
        isSaving={isCreating}
        onSubmit={save}
        cancelHref="/opportunities"
      />
    </div>
  );
}
