'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  publicPage?: boolean;
}

export function AuthGuard({ children, requireAuth = true, publicPage = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { logout, resendVerification, isResendingVerification } = useAuth();
  const [hasResent, setHasResent] = useState(false);

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

  const handleResend = async () => {
    try {
      await resendVerification();
      setHasResent(true);
    } catch (error: any) {
      if (error.response?.data?.code === 'ALREADY_VERIFIED' && user) {
        // Backend knows user is verified, but frontend state is stale. Sync it up.
        setUser({ ...user, emailVerified: true });
      } else {
        console.error('Failed to resend verification email', error);
      }
    }
  };

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
  if (!publicPage && requireAuth && isAuthenticated && user && !user.emailVerified) {
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
          
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleResend}
              disabled={isResendingVerification || hasResent}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2 w-full"
            >
              {isResendingVerification ? 'Sending...' : hasResent ? 'Verification email sent!' : 'Resend verification email'}
            </button>
            <button
              onClick={() => logout()}
              className="inline-flex items-center bg-red-200 justify-center rounded-md text-sm font-medium hover:bg-slate-100 hover:text-slate-900 h-9 px-4 py-2 w-full border border-grey-800 text-dark cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
