'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOpportunity } from '../hooks/use-opportunity';
import type { OpportunityPayload } from '../types';
import { OpportunityForm } from './opportunity-form';

function getErrorMessage(error: unknown) {
  const message = (error as { response?: { data?: { message?: unknown } } }).response?.data?.message;
  return typeof message === 'string' ? message : 'We could not save this opportunity. Please try again.';
}

export function OpportunityEditScreen() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { opportunity, isLoading, error, refetch, updateOpportunity, isUpdating } = useOpportunity(id);

  const save = async (payload: OpportunityPayload) => {
    try {
      setFormError(null);
      await updateOpportunity(payload);
      router.push(`/opportunities/${id}`);
    } catch (saveError: unknown) {
      setFormError(getErrorMessage(saveError));
    }
  };

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"><div className="h-96 animate-pulse rounded-xl bg-white" /></div>;
  if (error || !opportunity) return <div className="mx-auto max-w-xl px-4 py-16 text-center"><AlertCircle className="mx-auto h-10 w-10 text-red-500" /><h1 className="mt-4 text-xl font-semibold text-slate-900">Unable to load opportunity</h1><p className="mt-2 text-sm text-slate-500">{getErrorMessage(error)}</p><div className="mt-6 flex justify-center gap-3"><Button variant="outline" onClick={() => router.back()}>Go back</Button><Button onClick={() => void refetch()}>Try again</Button></div></div>;

  return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"><div className="mb-5"><Button variant="ghost" onClick={() => router.push(`/opportunities/${id}`)}><ArrowLeft className="mr-2 h-4 w-4" />Back to opportunity</Button></div><OpportunityForm opportunity={opportunity} isSaving={isUpdating} onSubmit={save} onCancel={() => router.push(`/opportunities/${id}`)} />{formError && <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert"><AlertCircle className="h-4 w-4 shrink-0" />{formError}</div>}</div>;
}
