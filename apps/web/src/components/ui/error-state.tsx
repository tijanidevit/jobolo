'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  backHref?: string;
  backLabel?: string;
  variant?: 'inline' | 'page';
  className?: string;
}

export function ErrorState({
  message,
  title = 'Something went wrong',
  onRetry,
  backHref,
  backLabel = 'Go back',
  variant = 'inline',
  className,
}: ErrorStateProps) {
  if (variant === 'page') {
    return (
      <div
        className={cn(
          'mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 py-16 text-center',
          className,
        )}
      >
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        {(backHref || onRetry) && (
          <div className="mt-6 flex justify-center gap-3">
            {backHref && (
              <Link
                href={backHref}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
              >
                {backLabel}
              </Link>
            )}
            {onRetry && <Button onClick={onRetry}>Try again</Button>}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={cn('border-red-100 bg-red-50', className)}>
      <CardContent className="flex items-center justify-between gap-4 p-4 text-sm text-red-700">
        <span className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {message}
        </span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
