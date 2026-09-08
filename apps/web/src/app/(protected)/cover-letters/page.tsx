'use client';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { CoverLetterForm } from '@/features/cover-letters/components/cover-letter-form/cover-letter-form';
import { CoverLetterList } from '@/features/cover-letters/components/cover-letter-list/cover-letter-list';
import { useCoverLetters } from '@/features/cover-letters/hooks/use-cover-letters';

export default function CoverLettersPage() {
  const { coverLetters, isLoading, error, refetch } = useCoverLetters();
  if (isLoading) return <LoadingState variant="page" message="Loading cover letters..." />;
  if (error)
    return (
      <ErrorState
        variant="page"
        title="Unable to load cover letters"
        message="Your cover letter library could not be loaded."
        onRetry={() => void refetch()}
      />
    );
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          Career materials
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Cover letters</h1>
        <p className="mt-2 text-sm text-slate-500">
          Upload and track the cover letter versions you use across your job search.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <CoverLetterForm />
        {coverLetters.length > 0 ? (
          <CoverLetterList coverLetters={coverLetters} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Your uploaded cover letter versions will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
