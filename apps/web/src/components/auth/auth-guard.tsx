'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  /**
   * If true, the page is publicly accessible regardless of auth state.
   * No redirects will be applied (e.g. verify-email, reset-password).
   */
  publicPage?: boolean;
}

export function AuthGuard({ children, requireAuth = true, publicPage = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  // Call useAuth to trigger the initial fetch if needed
  const { isInitializing } = useAuth();

  useEffect(() => {
    // Public pages are always accessible — no redirects
    if (publicPage) return;
    if (!isInitialized && isInitializing) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (!requireAuth && isAuthenticated) {
      // If we are on an auth page (login/register) and already authenticated, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isInitialized, isInitializing, requireAuth, publicPage, router, pathname]);

  // Show nothing or a generic loading spinner while figuring out auth state
  // Public pages skip this wait
  if (!publicPage && (!isInitialized || isInitializing)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  // Prevent flash of content on protected/auth-only pages
  if (!publicPage && requireAuth && !isAuthenticated) return null;
  if (!publicPage && !requireAuth && isAuthenticated) return null;

  return <>{children}</>;
}
