'use client';

import { BrainCircuit, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOpportunityFitScore } from '../hooks/use-opportunity-fit-score';

export function OpportunityFitScorePanel({ opportunityId }: { opportunityId: string }) {
  const { fitScore, isLoading, isGenerating, generationError, generateFitScore } =
    useOpportunityFitScore(opportunityId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <BrainCircuit className="h-4 w-4 text-blue-600" />
            AI job fit
          </CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Compare this opportunity with your saved skills and role context.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void generateFitScore()}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          )}
          {fitScore ? 'Refresh score' : 'Calculate fit'}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-slate-500">Loading saved fit analysis...</p>}
        {!isLoading && !fitScore && (
          <p className="text-sm text-slate-500">No fit analysis has been saved yet.</p>
        )}
        {fitScore && (
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold text-slate-900">
                {fitScore.overallScore}%
              </span>
              <span className="pb-1 text-sm text-slate-500">overall fit</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ['Technical skills', fitScore.technicalSkillsScore],
                ['Experience', fitScore.experienceScore],
                ['Seniority', fitScore.seniorityScore],
                ['Industry', fitScore.industryScore],
                ['Location', fitScore.locationScore],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 font-semibold text-slate-900">{value}%</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600">{fitScore.rationale}</p>
            {(fitScore.matchedSkills.length > 0 || fitScore.missingSkills.length > 0) && (
              <div className="grid gap-4 sm:grid-cols-2">
                <SkillList title="Matched skills" skills={fitScore.matchedSkills} tone="good" />
                <SkillList
                  title="Skills to strengthen"
                  skills={fitScore.missingSkills}
                  tone="warning"
                />
              </div>
            )}
          </div>
        )}
        {generationError && (
          <p className="mt-3 text-sm text-red-600">Unable to generate a fit score.</p>
        )}
      </CardContent>
    </Card>
  );
}

function SkillList({
  title,
  skills,
  tone,
}: {
  title: string;
  skills: string[];
  tone: 'good' | 'warning';
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span
              key={skill}
              className={`rounded-full px-2.5 py-1 text-xs ${tone === 'good' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">None detected</span>
        )}
      </div>
    </div>
  );
}
