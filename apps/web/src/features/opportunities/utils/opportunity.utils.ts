import { isAxiosError } from 'axios';

export function isNotFoundError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 404;
}

export function getErrorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: unknown } } }).response?.data
    ?.message;
  return typeof message === 'string' ? message : fallback;
}

export function formatDate(value: string | null) {
  if (!value) return 'Not added';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Not added'
    : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
        date,
      );
}

export function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return 'Not added';
  return String(value)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatMoney(value: number | null, currency: string | null) {
  if (value === null || value === undefined) return 'Not added';
  const amount = Number(value);
  if (Number.isNaN(amount)) return 'Not added';
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
