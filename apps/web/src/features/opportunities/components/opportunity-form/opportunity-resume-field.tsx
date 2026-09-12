'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useController, type Control } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useCreateResume } from '@/features/resumes/hooks/use-create-resume';
import { useResumes } from '@/features/resumes/hooks/use-resumes';
import type { OpportunityFormValues } from '../../schemas/opportunity.schema';

export function OpportunityResumeField({
  control,
  error,
}: {
  control: Control<OpportunityFormValues>;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { field } = useController({ name: 'resumeId', control });
  const { resumes } = useResumes();
  const { createResume, isCreating, error: uploadError } = useCreateResume();

  async function upload() {
    if (!name.trim() || !file) return;
    const response = await createResume({ name: name.trim(), file });
    field.onChange(response.data?.id ?? '');
    setName('');
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-3">
      <SearchableSelect
        value={field.value}
        options={[
          { value: '', label: 'No resume selected' },
          ...resumes.map((resume) => ({ value: resume.id, label: resume.name })),
        ]}
        onChange={field.onChange}
        placeholder="Select a resume"
        searchPlaceholder="Search resumes..."
      />
      <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium text-slate-600">
          Or upload the resume used for this role
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Resume name"
          />
          <Input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            disabled={isCreating}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => void upload()}
            disabled={isCreating || !name.trim() || !file}
          >
            <Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {isCreating ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        {(error || uploadError) && (
          <p className="mt-1 text-xs text-red-600">{error ?? 'Resume upload failed.'}</p>
        )}
        <p className="mt-1 text-xs text-slate-500">PDF, DOC, or DOCX up to 10 MB.</p>
      </div>
    </div>
  );
}
