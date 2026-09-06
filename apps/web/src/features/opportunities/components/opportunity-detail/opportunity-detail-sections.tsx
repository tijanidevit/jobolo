import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getStageLabel } from '../../constants';
import type { Opportunity } from '../../types';
import { formatDate, formatMoney, formatValue } from '../../utils/opportunity.utils';

export function OpportunityDetailSections({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="space-y-6">
      <DetailSection title="Role and company" description="The context around this opportunity.">
        <DetailField label="Job title" value={opportunity.jobTitle} />
        <DetailField label="Department" value={formatValue(opportunity.department)} />
        <DetailField label="Company" value={opportunity.companyName} />
        <DetailField label="Industry" value={formatValue(opportunity.companyIndustry)} />
        <DetailField label="Country" value={formatValue(opportunity.companyCountry)} />
        <DetailField label="Company size" value={formatValue(opportunity.companySize)} />
        <DetailField label="Employment" value={formatValue(opportunity.employmentType)} />
        <DetailField label="Work arrangement" value={formatValue(opportunity.workArrangement)} />
        <DetailField label="Location" value={formatValue(opportunity.location)} />
        <DetailField label="Source" value={formatValue(opportunity.source)} />
        <DetailField label="Referral" value={formatValue(opportunity.referral)} />
        {opportunity.jobUrl && (
          <DetailField
            label="Job posting"
            value={
              <a
                href={opportunity.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                Open posting <ExternalLink className="h-3.5 w-3.5" />
              </a>
            }
          />
        )}
      </DetailSection>

      <DetailSection title="Application progress">
        <DetailField label="Current stage" value={getStageLabel(opportunity.stage)} />
        <DetailField label="Priority" value={formatValue(opportunity.priority)} />
        <DetailField label="Date discovered" value={formatDate(opportunity.dateDiscovered)} />
        <DetailField label="Date applied" value={formatDate(opportunity.dateApplied)} />
      </DetailSection>

      <DetailSection
        title="Compensation"
        description="Keep the numbers and terms you want to remember together."
      >
        <DetailField
          label="Salary range"
          value={
            opportunity.salaryRangeMin !== null || opportunity.salaryRangeMax !== null
              ? `${formatMoney(opportunity.salaryRangeMin, opportunity.currency)} - ${formatMoney(opportunity.salaryRangeMax, opportunity.currency)}`
              : 'Not added'
          }
        />
        <DetailField label="Pay frequency" value={formatValue(opportunity.payFrequency)} />
        <DetailField
          label="Minimum acceptable"
          value={formatMoney(opportunity.minimumAcceptableSalary, opportunity.currency)}
        />
        <DetailField
          label="Target salary"
          value={formatMoney(opportunity.targetSalary, opportunity.currency)}
        />
        <DetailField
          label="Maximum expected"
          value={formatMoney(opportunity.maximumExpectedSalary, opportunity.currency)}
        />
        <DetailField
          label="Contract rate"
          value={formatMoney(opportunity.contractRate, opportunity.currency)}
        />
        <DetailField label="Equity" value={formatValue(opportunity.equity)} />
        <DetailField label="Bonus" value={formatValue(opportunity.bonus)} />
        <DetailField label="Benefits" value={formatValue(opportunity.benefits)} wide />
      </DetailSection>

      <DetailSection title="Assessment">
        <DetailField
          label="Fit"
          value={opportunity.fitScore === null ? 'Not added' : `${opportunity.fitScore}%`}
        />
        <DetailField
          label="Interest"
          value={opportunity.interestScore === null ? 'Not added' : `${opportunity.interestScore}%`}
        />
        <DetailField
          label="Confidence"
          value={
            opportunity.confidenceScore === null ? 'Not added' : `${opportunity.confidenceScore}%`
          }
        />
      </DetailSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {opportunity.jobDescription || 'No job description added yet.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailField({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide && 'sm:col-span-2')}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-5">
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">{children}</dl>
      </CardContent>
    </Card>
  );
}
