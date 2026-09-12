import { Lightbulb } from 'lucide-react';

export function InsightsEmptyState() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <Lightbulb className="h-10 w-10 text-blue-500" aria-hidden="true" />
      <h1 className="mt-4 text-xl font-semibold text-slate-900">Insights will appear here</h1>
      <p className="mt-2 text-sm text-slate-500">
        Add applications and activity history to uncover useful patterns.
      </p>
    </div>
  );
}
