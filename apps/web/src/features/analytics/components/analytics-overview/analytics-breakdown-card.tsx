import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyticsBreakdownItem } from '../../types';

export function AnalyticsBreakdownCard({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: AnalyticsBreakdownItem[];
}) {
  const maximum = Math.max(...items.map((item) => item.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No data yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="capitalize text-slate-700">
                    {item.label.replaceAll('_', ' ')}
                  </span>
                  <span className="font-semibold text-slate-900">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${(item.count / maximum) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
