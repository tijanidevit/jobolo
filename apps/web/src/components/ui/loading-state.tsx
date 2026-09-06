import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  variant?: 'inline' | 'page';
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  variant = 'inline',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 text-sm text-slate-500',
        variant === 'page' && 'min-h-[60vh] flex-col',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
