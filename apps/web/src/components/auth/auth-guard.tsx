'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { EmailVerificationRequired } from './email-verification-required';

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
  const { logout, resendVerification, isResendingVerification, isLoggingOut, isInitializing } =
    useAuth();
  const [hasResent, setHasResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    // Public pages are always accessible — no redirects
    if (publicPage) return;
    if (!isInitialized && isInitializing) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (!requireAuth && isAuthenticated && user?.emailVerified) {
      router.replace('/dashboard');
    }
  }, [
    isAuthenticated,
    isInitialized,
    isInitializing,
    requireAuth,
    publicPage,
    router,
    pathname,
    user?.emailVerified,
  ]);

  const handleResend = async () => {
    try {
      setResendError(null);
      await resendVerification();
      setHasResent(true);
    } catch (error: unknown) {
      const responseMessage = (error as { response?: { data?: { message?: unknown } } }).response
        ?.data?.message;
      const message =
        typeof responseMessage === 'string'
          ? responseMessage
          : 'We could not send the verification email. Please try again.';
      setResendError(message);
    }
  };

  if (!publicPage && (!isInitialized || isInitializing)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!publicPage && requireAuth && !isAuthenticated) return null;
  if (!publicPage && !requireAuth && isAuthenticated && user?.emailVerified) return null;

  if (!publicPage && requireAuth && isAuthenticated && user && !user.emailVerified) {
    return (
      <EmailVerificationRequired
        email={user.email}
        hasResent={hasResent}
        resendError={resendError}
        isResending={isResendingVerification}
        isLoggingOut={isLoggingOut}
        onResend={handleResend}
        onLogout={() => void logout()}
      />
    );
  }

  return <>{children}</>;
}
