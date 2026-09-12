import Link from 'next/link';
import { BrainCircuit, FileText, Mail, User } from 'lucide-react';

const tabs = [
  { segment: 'resumes', label: 'Resumes', icon: FileText },
  { segment: 'cover-letters', label: 'Cover letters', icon: Mail },
  { segment: 'skills', label: 'Skills', icon: BrainCircuit },
  { segment: '', label: 'Profile', icon: User },
] as const;

export function ProfileTabs({
  activeSegment,
}: {
  activeSegment: (typeof tabs)[number]['segment'];
}) {
  return (
    <nav
      aria-label="Profile sections"
      className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex min-w-max gap-1 p-2">
        {tabs.map(({ segment, label, icon: Icon }) => {
          const active = segment === activeSegment;
          return (
            <Link
              key={segment || 'profile'}
              href={segment ? `/profile/${segment}` : '/profile'}
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
