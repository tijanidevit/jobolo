import { Banknote, Database, Target } from 'lucide-react';

interface SalarySummaryCardProps {
  label: string;
  value: string;
  description: string;
  icon: typeof Banknote;
}

export function SalarySummaryCard({
  label,
  value,
  description,
  icon: Icon,
}: SalarySummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 text-slate-500">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </article>
  );
}

export const salarySummaryIcons = { average: Banknote, target: Target, records: Database };
