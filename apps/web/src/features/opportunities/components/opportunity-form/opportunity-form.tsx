'use client';

import { useRouter } from 'next/navigation';
import { Controller, useForm, type Control, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  EMPLOYMENT_TYPES,
  OPPORTUNITY_PRIORITIES,
  OPPORTUNITY_STAGES,
  WORK_ARRANGEMENTS,
} from '../../constants';
import type { Opportunity, OpportunityPayload } from '../../types';
import { useCreateOpportunity } from '../../hooks/use-create-opportunity';
import { useUpdateOpportunity } from '../../hooks/use-update-opportunity';
import { useCoverLetters } from '@/features/cover-letters/hooks/use-cover-letters';
import type { JobDescriptionAnalysis } from '@/features/job-description-analysis/types';
import { OpportunityImport } from './opportunity-import';
import { OpportunityResumeField } from './opportunity-resume-field';
import {
  opportunityFormSchema,
  type OpportunityFormValues,
} from '../../schemas/opportunity.schema';

interface OpportunityFormProps {
  opportunity?: Opportunity | null;
}

const inputClassName = 'bg-white';

function emptyValue(value: string | null | undefined) {
  return value ?? '';
}

function numberValue(value: number | null | undefined) {
  return value === null || value === undefined ? '' : String(value);
}

function toIsoDate(value: string) {
  return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined;
}

function normalizeEmploymentType(value: string | null) {
  if (!value) return '';
  return value
    .toLowerCase()
    .replace(/-/g, '_')
    .replace(/ /g, '_') as OpportunityFormValues['employmentType'];
}

function parseSalary(value: string | null) {
  if (!value) return null;
  const currency = value.match(/\b(USD|CAD|EUR|GBP)\b/i)?.[1]?.toUpperCase();
  const amounts = [...value.matchAll(/\d[\d,.]*\s*(?:k|K)?/g)].map((match) => {
    const raw = match[0].replace(/,/g, '').trim();
    const multiplier = /k$/i.test(raw) ? 1000 : 1;
    return Number.parseFloat(raw.replace(/k$/i, '')) * multiplier;
  });
  return amounts.length > 0 ? { currency, amounts } : null;
}

function defaultValues(opportunity?: Opportunity | null): OpportunityFormValues {
  return {
    companyName: emptyValue(opportunity?.companyName),
    jobTitle: emptyValue(opportunity?.jobTitle),
    companyCountry: emptyValue(opportunity?.companyCountry),
    location: emptyValue(opportunity?.location),
    jobUrl: emptyValue(opportunity?.jobUrl),
    employmentType: opportunity?.employmentType ?? '',
    workArrangement: opportunity?.workArrangement ?? '',
    stage: opportunity?.stage ?? 'discovered',
    source: emptyValue(opportunity?.source),
    dateDiscovered:
      opportunity?.dateDiscovered?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    dateApplied: opportunity?.dateApplied?.slice(0, 10) ?? '',
    currency: emptyValue(opportunity?.currency),
    salaryRangeMin: numberValue(opportunity?.salaryRangeMin),
    salaryRangeMax: numberValue(opportunity?.salaryRangeMax),
    targetSalary: numberValue(opportunity?.targetSalary),
    fitScore: numberValue(opportunity?.fitScore),
    interestScore: numberValue(opportunity?.interestScore),
    confidenceScore: numberValue(opportunity?.confidenceScore),
    priority: opportunity?.priority ?? '',
    jobDescription: emptyValue(opportunity?.jobDescription),
    resumeId: opportunity?.resumeId ?? '',
    coverLetterId: opportunity?.coverLetterId ?? '',
  };
}

function toPayload(values: OpportunityFormValues): OpportunityPayload {
  const optionalNumber = (value: string) => (value.trim() ? Number(value) : undefined);
  return {
    companyName: values.companyName.trim(),
    jobTitle: values.jobTitle.trim(),
    companyCountry: values.companyCountry || undefined,
    location: values.location || undefined,
    jobUrl: values.jobUrl || undefined,
    employmentType: values.employmentType || undefined,
    workArrangement: values.workArrangement || undefined,
    stage: values.stage,
    source: values.source || undefined,
    dateDiscovered: toIsoDate(values.dateDiscovered),
    dateApplied: toIsoDate(values.dateApplied),
    currency: values.currency || undefined,
    salaryRangeMin: optionalNumber(values.salaryRangeMin),
    salaryRangeMax: optionalNumber(values.salaryRangeMax),
    targetSalary: optionalNumber(values.targetSalary),
    fitScore: optionalNumber(values.fitScore),
    interestScore: optionalNumber(values.interestScore),
    confidenceScore: optionalNumber(values.confidenceScore),
    priority: values.priority || undefined,
    jobDescription: values.jobDescription || undefined,
    resumeId: values.resumeId || null,
    coverLetterId: values.coverLetterId || null,
  };
}

export function OpportunityForm({ opportunity }: OpportunityFormProps) {
  const router = useRouter();
  const { createOpportunity, isCreating } = useCreateOpportunity();
  const { updateOpportunity, isUpdating } = useUpdateOpportunity(opportunity?.id ?? '');
  const { coverLetters } = useCoverLetters();
  const isSaving = isCreating || isUpdating;
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: defaultValues(opportunity),
  });

  function applyAnalysis(analysis: JobDescriptionAnalysis) {
    if (analysis.companyName) setValue('companyName', analysis.companyName, { shouldDirty: true });
    if (analysis.jobTitle) setValue('jobTitle', analysis.jobTitle, { shouldDirty: true });
    if (analysis.location) setValue('location', analysis.location, { shouldDirty: true });
    if (analysis.employmentType) {
      setValue('employmentType', normalizeEmploymentType(analysis.employmentType), {
        shouldDirty: true,
      });
    }
    if (analysis.sourceUrl) setValue('jobUrl', analysis.sourceUrl, { shouldDirty: true });
    setValue('jobDescription', analysis.sourceDescription, { shouldDirty: true });
    const salary = parseSalary(analysis.salary);
    if (salary?.currency) setValue('currency', salary.currency, { shouldDirty: true });
    if (salary?.amounts[0] !== undefined) {
      setValue('salaryRangeMin', String(salary.amounts[0]), { shouldDirty: true });
    }
    if (salary?.amounts[1] !== undefined) {
      setValue('salaryRangeMax', String(salary.amounts[1]), { shouldDirty: true });
    }
    if (analysis.location && /\bremote\b/i.test(analysis.location)) {
      setValue('workArrangement', 'remote', { shouldDirty: true });
    }
  }

  const submit = async (values: OpportunityFormValues) => {
    if (opportunity) await updateOpportunity(toPayload(values));
    else await createOpportunity(toPayload(values));

    router.replace(opportunity ? `/opportunities/${opportunity.id}` : '/opportunities');
  };
  const cancel = () => {
    router.push(opportunity ? `/opportunities/${opportunity.id}` : '/opportunities');
  };

  return (
    <Card className="border-blue-100 shadow-md">
      <CardHeader>
        <CardTitle>{opportunity ? 'Edit opportunity' : 'Add opportunity'}</CardTitle>
        <p className="text-sm text-slate-500">
          Capture the useful context now, even if you have not applied yet.
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit(submit)}>
        <CardContent className="space-y-6">
          {!opportunity && <OpportunityImport onApply={applyAnalysis} />}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Role basics
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company" error={errors.companyName?.message} required>
                <Input
                  className={inputClassName}
                  {...register('companyName')}
                  placeholder="Acme Inc."
                />
              </Field>
              <Field label="Job title" error={errors.jobTitle?.message} required>
                <Input
                  className={inputClassName}
                  {...register('jobTitle')}
                  placeholder="Senior Backend Engineer"
                />
              </Field>
              <Field label="Country" error={errors.companyCountry?.message}>
                <Input
                  className={inputClassName}
                  {...register('companyCountry')}
                  placeholder="Canada"
                />
              </Field>
              <Field label="Location" error={errors.location?.message}>
                <Input
                  className={inputClassName}
                  {...register('location')}
                  placeholder="Remote / Toronto"
                />
              </Field>
              <Field label="Job URL" error={errors.jobUrl?.message}>
                <Input
                  className={inputClassName}
                  {...register('jobUrl')}
                  placeholder="https://..."
                  type="url"
                />
              </Field>
              <Field label="Source" error={errors.source?.message}>
                <Input
                  className={inputClassName}
                  {...register('source')}
                  placeholder="LinkedIn, referral, company site"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <SelectField
                label="Stage"
                name="stage"
                control={control}
                options={OPPORTUNITY_STAGES}
              />
              <SelectField
                label="Work arrangement"
                name="workArrangement"
                control={control}
                options={WORK_ARRANGEMENTS}
                placeholder="Not set"
              />
              <SelectField
                label="Employment type"
                name="employmentType"
                control={control}
                options={EMPLOYMENT_TYPES}
                placeholder="Not set"
              />
            </div>
            <Field label="Resume used" error={errors.resumeId?.message}>
              <OpportunityResumeField control={control} error={errors.resumeId?.message} />
            </Field>
            <Field label="Cover letter used" error={errors.coverLetterId?.message}>
              <Controller
                name="coverLetterId"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value}
                    options={[
                      { value: '', label: 'No cover letter selected' },
                      ...coverLetters.map((coverLetter) => ({
                        value: coverLetter.id,
                        label: coverLetter.name,
                      })),
                    ]}
                    onChange={field.onChange}
                    placeholder="Select a cover letter"
                    searchPlaceholder="Search cover letters..."
                  />
                )}
              />
            </Field>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Dates and priority
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Date discovered" error={errors.dateDiscovered?.message}>
                <Input className={inputClassName} {...register('dateDiscovered')} type="date" />
              </Field>
              <Field label="Date applied" error={errors.dateApplied?.message}>
                <Input className={inputClassName} {...register('dateApplied')} type="date" />
              </Field>
              <SelectField
                label="Priority"
                name="priority"
                control={control}
                options={OPPORTUNITY_PRIORITIES}
                placeholder="Not set"
              />
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Compensation and assessment
            </h2>
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Currency" error={errors.currency?.message}>
                <Input className={inputClassName} {...register('currency')} placeholder="CAD" />
              </Field>
              <Field label="Salary min" error={errors.salaryRangeMin?.message}>
                <Input
                  className={inputClassName}
                  {...register('salaryRangeMin')}
                  inputMode="decimal"
                  placeholder="90000"
                />
              </Field>
              <Field label="Salary max" error={errors.salaryRangeMax?.message}>
                <Input
                  className={inputClassName}
                  {...register('salaryRangeMax')}
                  inputMode="decimal"
                  placeholder="120000"
                />
              </Field>
              <Field label="Target salary" error={errors.targetSalary?.message}>
                <Input
                  className={inputClassName}
                  {...register('targetSalary')}
                  inputMode="decimal"
                  placeholder="110000"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Fit (0-100)" error={errors.fitScore?.message}>
                <Input
                  className={inputClassName}
                  {...register('fitScore')}
                  inputMode="numeric"
                  placeholder="80"
                />
              </Field>
              <Field label="Interest (0-100)" error={errors.interestScore?.message}>
                <Input
                  className={inputClassName}
                  {...register('interestScore')}
                  inputMode="numeric"
                  placeholder="90"
                />
              </Field>
              <Field label="Confidence (0-100)" error={errors.confidenceScore?.message}>
                <Input
                  className={inputClassName}
                  {...register('confidenceScore')}
                  inputMode="numeric"
                  placeholder="60"
                />
              </Field>
            </div>
          </section>

          <Field label="Job description" error={errors.jobDescription?.message}>
            <textarea
              className="min-h-32 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-1 focus-visible:ring-blue-500"
              maxLength={30000}
              {...register('jobDescription')}
              placeholder="Paste or summarize the role while the context is fresh."
            />
          </Field>
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t border-slate-100 pt-6">
          <Button type="button" variant="outline" onClick={cancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : opportunity ? 'Save changes' : 'Create opportunity'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
  name: FieldPath<OpportunityFormValues>;
  control: Control<OpportunityFormValues>;
}

function SelectField({ label, options, placeholder = 'Select', name, control }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <SearchableSelect
            value={field.value ?? ''}
            options={options}
            placeholder={placeholder}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
