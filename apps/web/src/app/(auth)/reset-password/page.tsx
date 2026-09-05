'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/features/auth/api/auth.api';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      await authApi.resetPassword({ token, password: data.password });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold">Invalid Link</h2>
          <p className="text-sm text-slate-600">
            This password reset link is invalid or missing the required token.
          </p>
          <Link
            href="/forgot-password"
            className={cn(
              'mt-4 inline-flex w-full items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            Request new link
          </Link>
        </div>
      </CardContent>
    );
  }

  if (isSuccess) {
    return (
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h2 className="text-xl font-semibold">Password Reset Complete</h2>
          <p className="text-sm text-slate-600">
            Your password has been successfully reset. You can now sign in with your new password.
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardHeader>
        <CardTitle>Create new password</CardTitle>
        <CardDescription>Please enter your new password below</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              className="pl-9"
              {...register('password')}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="confirmPassword"
              type="password"
              className="pl-9"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset password'}
        </Button>
      </CardFooter>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthGuard publicPage>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Jobolo</h1>
            <p className="text-sm text-slate-500 mt-2">The Job Search Operating System</p>
          </div>
          
          <Card>
            <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
