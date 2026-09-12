import { BriefcaseBusiness, Globe2 } from 'lucide-react';
import type { CareerIntelligence } from '../types';
import { CareerIntelligenceHeader } from './career-intelligence-header';
import { CareerPerformanceCard } from './career-performance-card';

export function CareerIntelligenceContent({ intelligence }: { intelligence: CareerIntelligence }) {
  return (
    <div className="space-y-8">
      <CareerIntelligenceHeader />
      <div className="grid gap-6 lg:grid-cols-2">
        <CareerPerformanceCard
          title="Performance by role"
          description="Roles ranked by interview conversion rate."
          icon={BriefcaseBusiness}
          rows={intelligence.rolePerformance}
        />
        <CareerPerformanceCard
          title="Performance by country"
          description="Countries ranked by interview conversion rate."
          icon={Globe2}
          rows={intelligence.countryPerformance}
        />
      </div>
    </div>
  );
}
