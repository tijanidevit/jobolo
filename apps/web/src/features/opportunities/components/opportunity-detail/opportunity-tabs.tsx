import Link from 'next/link';
import { Activity, BriefcaseBusiness, CheckSquare, Contact, FileText, Users } from 'lucide-react';

const tabs = [
  { segment: 'overview', label: 'Overview', icon: BriefcaseBusiness },
  { segment: 'activity', label: 'Activity', icon: Activity },
  { segment: 'notes', label: 'Notes', icon: FileText },
  { segment: 'interviews', label: 'Interviews', icon: Users },
  { segment: 'tasks', label: 'Tasks', icon: CheckSquare },
  { segment: 'contacts', label: 'Contacts', icon: Contact },
] as const;

export function OpportunityTabs({
  opportunityId,
  activeSegment,
}: {
  opportunityId: string;
  activeSegment: (typeof tabs)[number]['segment'];
}) {
  return (
    <nav
      aria-label="Opportunity sections"
      className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex min-w-max gap-1 p-2">
        {tabs.map(({ segment, label, icon: Icon }) => {
          const active = segment === activeSegment;
          return (
            <Link
              key={segment}
              href={`/opportunities/${opportunityId}/${segment}`}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
