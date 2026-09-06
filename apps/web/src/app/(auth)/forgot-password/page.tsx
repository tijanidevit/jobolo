'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/features/auth/api/auth.api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    await authApi
      .forgotPassword({ email: data.email })
      .then(() => setIsSuccess(true))
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Jobolo</h1>
            <p className="text-sm text-slate-500 mt-2">The Job Search Operating System</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reset password</CardTitle>
              <CardDescription>Enter your email and we'll send you a reset link</CardDescription>
            </CardHeader>
            {isSuccess ? (
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <p className="text-sm text-slate-600">
                    If an account with that email exists, a password reset link has been sent.
                    Please check your inbox.
                  </p>
                  <Link
                    href="/login"
                    className={cn(
                      'mt-4 inline-flex w-full items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900',
                    )}
                  >
                    Return to sign in
                  </Link>
                </div>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-9"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Sending link...' : 'Send reset link'}
                  </Button>
                  <p className="text-center text-sm text-slate-500">
                    Remember your password?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
