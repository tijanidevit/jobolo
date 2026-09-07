'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OpportunityForm } from '@/features/opportunities/components/opportunity-form/opportunity-form';

export default function OpportunityCreatePage() {
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
      <OpportunityForm opportunity={null} />
    </div>
  );
}
