'use client';

import { useState } from 'react';
import { FileSearch, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ErrorState } from '@/components/ui/error-state';
import {
  useAnalyzeJobDescription,
  type JobDescriptionAnalysisInput,
} from '@/features/job-description-analysis/hooks/use-analyze-job-description';
import type { JobDescriptionAnalysis } from '@/features/job-description-analysis/types';

interface OpportunityImportProps {
  onApply: (analysis: JobDescriptionAnalysis) => void;
}

export function OpportunityImport({ onApply }: OpportunityImportProps) {
  const [mode, setMode] = useState<'description' | 'url'>('description');
  const [description, setDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const { analyzeJobDescription, analysis, isAnalyzing, error, reset } = useAnalyzeJobDescription();

  const value = mode === 'description' ? description : jobUrl;
  const canAnalyze = mode === 'description' ? description.trim().length >= 50 : Boolean(jobUrl);

  async function analyze() {
    if (!canAnalyze) return;
    const input: JobDescriptionAnalysisInput =
      mode === 'description' ? { description: description.trim() } : { jobUrl: jobUrl.trim() };
    const result = await analyzeJobDescription(input);
    if (result.data) onApply(result.data);
  }

  function clear() {
    setDescription('');
    setJobUrl('');
    reset();
  }

  return (
    <section className="space-y-4 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
      <div className="flex items-start gap-3">
        <span className="rounded-md bg-blue-100 p-2 text-blue-700">
          <FileSearch className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">Start from the job posting</h2>
          <p className="mt-1 text-sm text-slate-600">
            Paste the description or a public job link. We will suggest opportunity fields for you
            to review before saving.
          </p>
        </div>
      </div>
      <div className="flex gap-2" role="tablist" aria-label="Job source">
        <Button
          type="button"
          size="sm"
          variant={mode === 'description' ? 'default' : 'outline'}
          onClick={() => setMode('description')}
        >
          Description
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === 'url' ? 'default' : 'outline'}
          onClick={() => setMode('url')}
        >
          <LinkIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          Job link
        </Button>
      </div>
      {mode === 'description' ? (
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isAnalyzing}
          maxLength={30000}
          placeholder="Paste the job description here..."
          className="min-h-32 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
        />
      ) : (
        <Input
          value={jobUrl}
          onChange={(event) => setJobUrl(event.target.value)}
          disabled={isAnalyzing}
          type="url"
          placeholder="https://company.com/careers/backend-engineer"
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {mode === 'description'
            ? `${description.length.toLocaleString()} / 30,000 characters`
            : 'The page must be publicly readable.'}
        </p>
        <div className="flex gap-2">
          {(value || analysis) && (
            <Button type="button" size="sm" variant="ghost" onClick={clear} disabled={isAnalyzing}>
              Clear
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={() => void analyze()}
            disabled={!canAnalyze || isAnalyzing}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {isAnalyzing ? 'Reading...' : 'Extract fields'}
          </Button>
        </div>
      </div>
      {error && <ErrorState message="We could not read that job posting." />}
      {analysis && (
        <p className="text-xs font-medium text-emerald-700">
          Fields extracted. Review the form below before creating the opportunity.
        </p>
      )}
    </section>
  );
}
