'use client';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ResumeForm } from '@/features/resumes/components/resume-form/resume-form';
import { ResumeList } from '@/features/resumes/components/resume-list/resume-list';
import { useResumes } from '@/features/resumes/hooks/use-resumes';

export default function ProfileResumesPage() {
  const { resumes, isLoading, error, refetch } = useResumes();

  if (isLoading) return <LoadingState variant="page" message="Loading resumes..." />;
  if (error) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load resumes"
        message="Your resume library could not be loaded."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <ResumeForm />
        {resumes.length > 0 ? <ResumeList resumes={resumes} /> : <ResumeEmptyState />}
      </div>
    </div>
  );
}

function ResumeEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      Your uploaded resume versions will appear here.
    </div>
  );
}
