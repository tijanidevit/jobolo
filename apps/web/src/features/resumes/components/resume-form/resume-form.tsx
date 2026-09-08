'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCreateResume } from '../../hooks/use-create-resume';

const ACCEPTED_FILES = '.pdf,.doc,.docx';

export function ResumeForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { createResume, isCreating } = useCreateResume();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !file) return;
    await createResume({ name: name.trim(), file });
    setName('');
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload a resume</CardTitle>
        <p className="text-sm text-slate-500">
          Keep named versions ready to attach to opportunities.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(event) => void submit(event)}>
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">
            Resume name
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Backend Engineer resume"
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
            {isCreating ? 'Uploading...' : 'Upload resume'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
