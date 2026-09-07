import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { OpportunityKanban } from '@/features/opportunities/components/opportunity-kanban/opportunity-kanban';

export default function OpportunitiesKanbanPage() {
  return (
    <div className="mx-auto max-w-[100rem] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/opportunities" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600"><ArrowLeft className="mr-2 h-4 w-4" />All opportunities</Link><p className="mt-5 text-sm font-medium uppercase tracking-[0.16em] text-blue-600">Pipeline board</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Kanban view</h1><p className="mt-2 text-slate-500">Move opportunities through your default job-search pipeline.</p></div><Link href="/opportunities/create" className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" />Add opportunity</Link></header>
      <OpportunityKanban />
    </div>
  );
}
