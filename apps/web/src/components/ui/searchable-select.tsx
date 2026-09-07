'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

export function SearchableSelect({
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search options...',
  disabled = false,
}: {
  value: string;
  options: readonly SearchableSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-left text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={cn(!selected && 'text-slate-400')}>{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn('h-4 w-4 text-slate-400 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="mt-2 max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-5 text-center text-xs text-slate-400">No matching options</p>
            ) : (
              filtered.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery('');
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span>{option.label}</span>
                  {option.value === value && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
