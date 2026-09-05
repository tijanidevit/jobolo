'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { authApi } from '@/features/auth/api/auth.api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Invalid or missing verification token.');
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const verifyToken = async () => {
      try {
        await authApi.verifyEmail({ token });
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setError(err.response?.data?.message || 'Failed to verify email. The link may have expired or is invalid.');
      }
    };

    verifyToken();
  }, [token]);

  if (status === 'loading') {
    return (
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <h2 className="text-xl font-semibold">Verifying your email</h2>
          <p className="text-sm text-slate-600">Please wait while we verify your email address...</p>
        </div>
      </CardContent>
    );
  }

  if (status === 'error') {
    return (
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold">Verification Failed</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <Link
            href="/login"
            className={cn(
              'mt-4 inline-flex w-full items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            Return to sign in
          </Link>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="pt-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h2 className="text-xl font-semibold">Email Verified!</h2>
        <p className="text-sm text-slate-600">
          Your email address has been successfully verified. You can now access all features of Jobolo.
        </p>
          <Link
            href="/login"
            className={cn(
              'mt-4 inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700'
            )}
          >
            Sign in
          </Link>
      </div>
    </CardContent>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthGuard publicPage>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Jobolo</h1>
            <p className="text-sm text-slate-500 mt-2">The Job Search Operating System</p>
          </div>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Email Verification</CardTitle>
            </CardHeader>
            <Suspense fallback={<div className="p-8 text-center text-slate-500"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></div>}>
              <VerifyEmailContent />
            </Suspense>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
