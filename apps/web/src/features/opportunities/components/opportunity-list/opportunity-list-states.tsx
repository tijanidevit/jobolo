import { BriefcaseBusiness, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function OpportunitiesEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <BriefcaseBusiness className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-slate-900">
          Start building your job-search memory
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Save a role as soon as you discover it. You can add more application details later.
        </p>
        <Link
          href="/opportunities/create"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add your first opportunity
        </Link>
      </CardContent>
    </Card>
  );
}

export function EmptyStageState({ onShowAll }: { onShowAll: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <h2 className="text-lg font-semibold text-slate-900">No opportunities in this stage</h2>
        <p className="mt-2 text-sm text-slate-500">
          Choose another stage or move an opportunity into this part of your pipeline.
        </p>
        <Button className="mt-5" variant="outline" onClick={onShowAll}>
          Show all opportunities
        </Button>
      </CardContent>
    </Card>
  );
}
