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
  
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

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

  // Block unverified users from accessing protected pages
  if (requireAuth && isAuthenticated && user && !user.emailVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md shadow-sm border border-slate-200 bg-white rounded-lg p-6 text-center space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-slate-900">Check your email</h3>
            <p className="text-sm text-slate-600">
              We need you to verify your email address to continue using Jobolo.
              Please check your inbox for the verification link.
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center justify-center mx-auto gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
