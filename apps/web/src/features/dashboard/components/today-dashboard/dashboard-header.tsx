import Link from 'next/link';

export function DashboardHeader({ firstName }: { firstName?: string }) {
  return (
    <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Today</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Good morning{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-2 text-slate-500">Here is what needs your attention in the job search.</p>
      </div>
      <Link
        href="/opportunities/create"
        className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
      >
        Add opportunity
      </Link>
    </header>
  );
}
