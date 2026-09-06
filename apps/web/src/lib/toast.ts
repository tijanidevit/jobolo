export type ToastVariant = 'success' | 'error';

export interface ToastEvent {
  id: string;
  message: string;
  variant: ToastVariant;
}

const TOAST_EVENT = 'jobolo:toast';

function publish(variant: ToastVariant, message: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<ToastEvent>(TOAST_EVENT, {
      detail: { id: crypto.randomUUID(), message, variant },
    }),
  );
}

export const toast = {
  success: (message: string) => publish('success', message),
  error: (message: string) => publish('error', message),
};

export function subscribeToasts(listener: (event: ToastEvent) => void) {
  const handleToast = (event: Event) => listener((event as CustomEvent<ToastEvent>).detail);
  window.addEventListener(TOAST_EVENT, handleToast);
  return () => window.removeEventListener(TOAST_EVENT, handleToast);
}
