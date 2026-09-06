'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, LogOut, Mail, RefreshCw, ShieldCheck } from 'lucide-react';

interface EmailVerificationRequiredProps {
  email?: string;
  hasResent: boolean;
  resendError: string | null;
  isResending: boolean;
  isLoggingOut: boolean;
  onResend: () => void;
  onLogout: () => void;
}

export function EmailVerificationRequired({
  email,
  hasResent,
  resendError,
  isResending,
  isLoggingOut,
  onResend,
  onLogout,
}: EmailVerificationRequiredProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-lg overflow-hidden shadow-md">
        <div className="bg-slate-900 px-6 py-8 text-white sm:px-10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-400/40">
            <Mail className="h-7 w-7 text-blue-300" aria-hidden="true" />
          </div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-blue-300">One quick step</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Verify your email to continue</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Your account is ready. Confirm your email address to unlock your dashboard and keep your job search secure.
          </p>
        </div>

        <CardContent className="space-y-7 p-6 sm:p-10">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">Check your inbox</p>
                <p className="mt-1 break-words text-sm leading-5 text-slate-600">
                  We sent a verification link to <span className="font-medium text-slate-900">{email ?? 'your email address'}</span>.
                </p>
              </div>
            </div>
          </div>

          <ol className="space-y-4">
            {['Open the verification email', 'Click the confirmation link', 'Return here to access your dashboard'].map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          {hasResent && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700" role="status">
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              A fresh verification link is on its way.
            </div>
          )}

          {resendError && (
            <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {resendError}
            </p>
          )}

          <div className="space-y-3">
            <Button type="button" className="w-full" onClick={onResend} disabled={isResending || hasResent}>
              <RefreshCw className={cn('mr-2 h-4 w-4', isResending && 'animate-spin')} aria-hidden="true" />
              {isResending ? 'Sending email...' : hasResent ? 'Verification email sent' : 'Resend verification email'}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={onLogout} disabled={isLoggingOut}>
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>

          <p className="text-center text-xs leading-5 text-slate-500">
            Didn&apos;t receive it? Check your spam folder, then request a new link above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
