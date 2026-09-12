'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  LogOut,
  LayoutDashboard,
  Briefcase,
  User,
  Settings,
  BrainCircuit,
  Lightbulb,
  FileText,
  Mail,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
    { name: 'Insights', href: '/insights', icon: Lightbulb },
    { name: 'Resumes', href: '/resumes', icon: FileText },
    { name: 'Cover letters', href: '/cover-letters', icon: Mail },
    { name: 'Skills', href: '/skills', icon: BrainCircuit },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-white flex flex-col">
          <div className="flex h-16 items-center px-6 border-b border-slate-200">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Jobolo</h1>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-slate-900' : 'text-slate-400',
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center mb-4 px-2">
              <div className="flex-shrink-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-sm font-medium leading-none text-blue-700">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </span>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
              onClick={() => logout()}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto outline-none">{children}</main>
      </div>
    </AuthGuard>
  );
}
