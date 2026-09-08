'use client';

import { useState } from 'react';
import { Download, Pencil, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import type { CoverLetter, CoverLetterStyle } from '../../types';
import { useDeleteCoverLetter } from '../../hooks/use-delete-cover-letter';
import { useDownloadCoverLetter } from '../../hooks/use-download-cover-letter';
import { useUpdateCoverLetter } from '../../hooks/use-update-cover-letter';

export function CoverLetterList({ coverLetters }: { coverLetters: CoverLetter[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState('');
  const [editingStyle, setEditingStyle] = useState<CoverLetterStyle>('customized');
  const { updateCoverLetter, isUpdating } = useUpdateCoverLetter();
  const { deleteCoverLetter, isDeleting } = useDeleteCoverLetter();
  const { downloadCoverLetter, downloadingId } = useDownloadCoverLetter();

  const save = async (coverLetter: CoverLetter) => {
    if (!editingName.trim()) return;
    await updateCoverLetter({
      id: coverLetter.id,
      payload: { name: editingName.trim(), template: editingTemplate.trim(), style: editingStyle },
    });
    setEditingId(null);
  };

  const download = async (coverLetter: CoverLetter) => {
    const blob = await downloadCoverLetter(coverLetter.id);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = coverLetter.originalName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your cover letters</CardTitle>
        <p className="text-sm text-slate-500">
          Review and maintain the versions used across your opportunities.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {coverLetters.map((coverLetter) => (
          <div
            key={coverLetter.id}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
          >
            <div className="min-w-0 flex-1 space-y-1">
              {editingId === coverLetter.id ? (
                <Input
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  aria-label="Cover letter name"
                />
              ) : (
                <p className="truncate text-sm font-medium text-slate-900">{coverLetter.name}</p>
              )}
              {editingId === coverLetter.id ? (
                <div className="flex gap-2">
                  <Input
                    value={editingTemplate}
                    onChange={(event) => setEditingTemplate(event.target.value)}
                    placeholder="Template name"
                    aria-label="Template name"
                  />
                  <SearchableSelect
                    value={editingStyle}
                    options={[
                      { value: 'customized', label: 'Customized' },
                      { value: 'generic', label: 'Generic' },
                    ]}
                    onChange={(value) => setEditingStyle(value as CoverLetterStyle)}
                  />
                </div>
              ) : (
                <p className="truncate text-xs text-slate-500">
                  {coverLetter.template || 'No template'} · {coverLetter.style} ·{' '}
                  {coverLetter.originalName}
                </p>
              )}
            </div>
            {editingId === coverLetter.id ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => void save(coverLetter)}
                  disabled={isUpdating}
                  aria-label="Save cover letter"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                  aria-label="Cancel editing"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(coverLetter.id);
                    setEditingName(coverLetter.name);
                    setEditingTemplate(coverLetter.template ?? '');
                    setEditingStyle(coverLetter.style);
                  }}
                  aria-label={`Edit ${coverLetter.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => void download(coverLetter)}
                  disabled={downloadingId === coverLetter.id}
                  aria-label={`Download ${coverLetter.name}`}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (window.confirm(`Delete ${coverLetter.name}?`))
                      void deleteCoverLetter(coverLetter.id);
                  }}
                  disabled={isDeleting}
                  aria-label={`Delete ${coverLetter.name}`}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
