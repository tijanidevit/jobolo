'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useCreateCoverLetter } from '../../hooks/use-create-cover-letter';
import type { CoverLetterStyle } from '../../types';

const ACCEPTED_FILES = '.pdf,.doc,.docx';

export function CoverLetterForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('');
  const [style, setStyle] = useState<CoverLetterStyle>('customized');
  const [file, setFile] = useState<File | null>(null);
  const { createCoverLetter, isCreating } = useCreateCoverLetter();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !file) return;
    await createCoverLetter({
      payload: { name: name.trim(), template: template.trim(), style },
      file,
    });
    setName('');
    setTemplate('');
    setStyle('customized');
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload a cover letter</CardTitle>
        <p className="text-sm text-slate-500">
          Track the versions and templates you use for applications.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(event) => void submit(event)}>
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">
            Cover letter name
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Backend role cover letter"
              disabled={isCreating}
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">
            Template name <span className="font-normal text-slate-400">(optional)</span>
            <Input
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              placeholder="Technical roles template"
              disabled={isCreating}
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">
            Style
            <SearchableSelect
              value={style}
              options={[
                { value: 'customized', label: 'Customized' },
                { value: 'generic', label: 'Generic' },
              ]}
              onChange={(value) => setStyle(value as CoverLetterStyle)}
              disabled={isCreating}
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">
            File
            <Input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_FILES}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              disabled={isCreating}
            />
            <span className="block text-xs font-normal text-slate-500">
              PDF, DOC, or DOCX up to 10 MB.
            </span>
          </label>
          {file && <p className="text-xs text-slate-500">Selected: {file.name}</p>}
          <Button type="submit" disabled={isCreating || !name.trim() || !file}>
            <Upload className="mr-2 h-4 w-4" />
            {isCreating ? 'Uploading...' : 'Upload cover letter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
