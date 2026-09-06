'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscribeToasts, type ToastEvent } from '@/lib/toast';

export function Toaster() {
  const [toasts, setToasts] = useState<ToastEvent[]>([]);

  useEffect(
    () =>
      subscribeToasts((toast) => {
        setToasts((current) => [...current, toast]);
        window.setTimeout(
          () => setToasts((current) => current.filter((item) => item.id !== toast.id)),
          4500,
        );
      }),
    [],
  );

  return (
    <div
      className="fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={cn(
            'flex items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg',
            toast.variant === 'success'
              ? 'border-emerald-100 text-emerald-800'
              : 'border-red-100 text-red-800',
          )}
        >
          <span className="mt-0.5">
            {toast.variant === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </span>
          <p className="flex-1 leading-5">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
