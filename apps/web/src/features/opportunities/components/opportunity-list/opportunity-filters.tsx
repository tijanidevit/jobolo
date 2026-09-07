'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { EMPLOYMENT_TYPES, OPPORTUNITY_PRIORITIES, OPPORTUNITY_STAGES, WORK_ARRANGEMENTS } from '../../constants';
import type { OpportunityFilters } from '../../types';

function readFilters(params: URLSearchParams): OpportunityFilters {
  const number = (key: string) => {
    const value = params.get(key);
    return value ? Number(value) : undefined;
  };
  return {
    q: params.get('q') || undefined,
    companyName: params.get('companyName') || undefined,
    jobTitle: params.get('jobTitle') || undefined,
    companyCountry: params.get('companyCountry') || undefined,
    source: params.get('source') || undefined,
    stage: (params.get('stage') as OpportunityFilters['stage']) || undefined,
    priority: (params.get('priority') as OpportunityFilters['priority']) || undefined,
    workArrangement: (params.get('workArrangement') as OpportunityFilters['workArrangement']) || undefined,
    employmentType: (params.get('employmentType') as OpportunityFilters['employmentType']) || undefined,
    salaryMin: number('salaryMin'),
    salaryMax: number('salaryMax'),
  };
}

export function getOpportunityFilters(params: URLSearchParams) {
  return readFilters(params);
}

function countActiveFilters(filters: OpportunityFilters) {
  return Object.values(filters).filter((value) => value !== undefined && value !== '').length;
}

export function OpportunityFiltersPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = readFilters(searchParams);
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(() => ({
    q: current.q ?? '', companyName: current.companyName ?? '', jobTitle: current.jobTitle ?? '', companyCountry: current.companyCountry ?? '', source: current.source ?? '', stage: current.stage ?? '', priority: current.priority ?? '', workArrangement: current.workArrangement ?? '', employmentType: current.employmentType ?? '', salaryMin: current.salaryMin?.toString() ?? '', salaryMax: current.salaryMax?.toString() ?? '',
  }));
  const activeFilters = countActiveFilters(current);
  const update = (field: keyof typeof values, value: string) => setValues((state) => ({ ...state, [field]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => { if (value.trim()) params.set(key, value.trim()); });
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`);
    setIsOpen(false);
  };

  return <>
    <div className="flex items-center justify-between gap-3 border-y border-slate-200 py-3"><div><p className="text-sm font-semibold text-slate-800">Refine your pipeline</p><p className="text-xs text-slate-500">Search across roles, companies, stages, and compensation.</p></div><Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(true)}><SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />Filters{activeFilters > 0 && <span className="ml-1.5 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">{activeFilters}</span>}</Button></div>
    {isOpen && <div className="fixed inset-0 z-50"><button type="button" aria-label="Close filters" className="absolute inset-0 h-full w-full cursor-default bg-slate-950/30" onClick={() => setIsOpen(false)} /><aside role="dialog" aria-modal="true" aria-labelledby="filters-title" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-slate-200 px-6 py-5"><div><h2 id="filters-title" className="text-lg font-semibold text-slate-900">Search and filter</h2><p className="mt-1 text-sm text-slate-500">Combine filters to narrow your opportunities.</p><Link href="/opportunities" className="mt-3 inline-flex items-center text-xs font-medium text-slate-500 hover:text-blue-600"><X className="mr-1 h-3.5 w-3.5" />Clear all filters</Link></div><button type="button" onClick={() => setIsOpen(false)} aria-label="Close filters" className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button></div><form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto"><div className="grid gap-4 px-6 py-6"><Field label="Search"><Input value={values.q} onChange={(event) => update('q', event.target.value)} placeholder="Company, role, keyword" /></Field><Field label="Company"><Input value={values.companyName} onChange={(event) => update('companyName', event.target.value)} placeholder="Company name" /></Field><Field label="Role"><Input value={values.jobTitle} onChange={(event) => update('jobTitle', event.target.value)} placeholder="Job title" /></Field><Field label="Country"><Input value={values.companyCountry} onChange={(event) => update('companyCountry', event.target.value)} placeholder="Country" /></Field><Field label="Source"><Input value={values.source} onChange={(event) => update('source', event.target.value)} placeholder="LinkedIn, referral..." /></Field><SelectField label="Stage" value={values.stage} onChange={(value) => update('stage', value)} options={OPPORTUNITY_STAGES} /><SelectField label="Priority" value={values.priority} onChange={(value) => update('priority', value)} options={OPPORTUNITY_PRIORITIES} /><SelectField label="Work arrangement" value={values.workArrangement} onChange={(value) => update('workArrangement', value)} options={WORK_ARRANGEMENTS} /><SelectField label="Employment type" value={values.employmentType} onChange={(value) => update('employmentType', value)} options={EMPLOYMENT_TYPES} /><Field label="Minimum salary"><Input type="number" min="0" value={values.salaryMin} onChange={(event) => update('salaryMin', event.target.value)} placeholder="0" /></Field><Field label="Maximum salary"><Input type="number" min="0" value={values.salaryMax} onChange={(event) => update('salaryMax', event.target.value)} placeholder="0" /></Field></div><div className="mt-auto flex items-center justify-between border-t border-slate-200 px-6 py-4"><Link href="/opportunities" className="text-sm font-medium text-slate-500 hover:text-blue-600">Clear all</Link><div className="flex gap-2"><Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button><Button type="submit">Apply filters</Button></div></div></form></aside></div>}
  </>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="space-y-1.5 text-xs font-medium text-slate-600">{label}{children}</label>; }
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly { value: string; label: string }[] }) { return <label className="space-y-1.5 text-xs font-medium text-slate-600">{label}<SearchableSelect value={value} options={options} onChange={onChange} placeholder="All" searchPlaceholder={`Search ${label.toLowerCase()}...`} /></label>; }
