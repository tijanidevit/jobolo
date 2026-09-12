'use client';

import { useState } from 'react';
import { BrainCircuit, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { RichText } from '@/components/ui/rich-text';
import { useInterviewMemory } from '../hooks/use-interview-memory';

export function InterviewMemoryPanel({
  opportunityId,
  interviewId,
}: {
  opportunityId: string;
  interviewId: string;
}) {
  const [sourceText, setSourceText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { memory, isLoading, isCreating, creationError, createMemory } = useInterviewMemory(
    opportunityId,
    interviewId,
  );

  const save = async () => {
    if (sourceText.trim().length < 20) return;
    await createMemory(sourceText);
    setSourceText('');
    setIsEditing(false);
  };

  return (
    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
          <BrainCircuit className="h-3.5 w-3.5" /> Interview memory
        </p>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Extract memory
          </Button>
        )}
      </div>
      {isEditing && (
        <div className="mt-3 space-y-2">
          <RichTextEditor
            id={`interview-memory-${interviewId}`}
            value={sourceText}
            onChange={setSourceText}
            disabled={isCreating}
            placeholder="Paste interview notes or a transcript."
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => void save()}
              disabled={isCreating || sourceText.trim().length < 20}
            >
              {isCreating ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-3.5 w-3.5" />
              )}
              Save memory
            </Button>
          </div>
        </div>
      )}
      {isLoading && <p className="mt-2 text-xs text-slate-500">Loading saved memory...</p>}
      {memory && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <MemoryGroup title="Interviewers" items={memory.interviewers} />
          <MemoryGroup title="Questions" items={memory.questions} />
          <MemoryGroup title="Topics" items={memory.topics} />
          <MemoryGroup title="Commitments" items={memory.commitments} />
          <MemoryGroup title="Follow-up actions" items={memory.followUpActions} />
          <MemoryGroup title="Areas to improve" items={memory.weaknesses} />
          <div className="sm:col-span-2 border-t border-blue-100 pt-3">
            <RichText text={memory.sourceText} />
          </div>
        </div>
      )}
      {creationError && (
        <p className="mt-2 text-xs text-red-600">Unable to save interview memory.</p>
      )}
    </div>
  );
}

function MemoryGroup({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-slate-700">{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
