'use client';

import { BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInterviewPreparation } from '../hooks/use-interview-preparation';

export function InterviewPreparationPanel({ opportunityId }: { opportunityId: string }) {
  const { preparation, isLoading, isGenerating, generationError, generatePreparation } =
    useInterviewPreparation(opportunityId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Interview preparation
          </CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Prepare from the role, job description, and your previous interview history.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void generatePreparation()}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          )}
          {preparation ? 'Refresh' : 'Prepare'}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-slate-500">Loading saved preparation...</p>}
        {!isLoading && !preparation && (
          <p className="text-sm text-slate-500">No preparation has been saved yet.</p>
        )}
        {preparation && (
          <div className="grid gap-5 md:grid-cols-2">
            <QuestionGroup title="Likely questions" items={preparation.likelyQuestions} />
            <QuestionGroup title="Technical questions" items={preparation.technicalQuestions} />
            <QuestionGroup title="Behavioral questions" items={preparation.behavioralQuestions} />
            <QuestionGroup
              title="System design questions"
              items={preparation.systemDesignQuestions}
            />
            <QuestionGroup title="Study topics" items={preparation.studyTopics} />
          </div>
        )}
        {generationError && (
          <p className="mt-3 text-sm text-red-600">Unable to generate interview preparation.</p>
        )}
      </CardContent>
    </Card>
  );
}

function QuestionGroup({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
