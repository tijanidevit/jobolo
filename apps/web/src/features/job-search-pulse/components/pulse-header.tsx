export function PulseHeader({ periodLabel }: { periodLabel: string }) {
  return (
    <header>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
        Job search pulse
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        See how your search is moving
      </h1>
      <p className="mt-2 max-w-2xl text-slate-500">
        Compare this week&apos;s activity with the previous seven-day period.
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        {periodLabel}
      </p>
    </header>
  );
}
