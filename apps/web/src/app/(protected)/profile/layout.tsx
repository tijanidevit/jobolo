'use client';

import { usePathname } from 'next/navigation';
import { ProfileTabs } from '@/features/profile/components/profile-tabs';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          Profile workspace
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Manage your profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Keep your account details and career materials ready for every opportunity.
        </p>
      </header>
      <ProfileTabs activeSegment={getActiveSegment(pathname)} />
      <main>{children}</main>
    </div>
  );
}

function getActiveSegment(pathname: string): '' | 'resumes' | 'cover-letters' | 'skills' {
  const segment = pathname.split('/').filter(Boolean).at(-1);
  return segment === 'resumes' || segment === 'cover-letters' || segment === 'skills'
    ? segment
    : '';
}
