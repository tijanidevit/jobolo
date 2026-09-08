'use client';

import { useState } from 'react';
import { Download, Pencil, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Resume } from '../../types';
import { useDeleteResume } from '../../hooks/use-delete-resume';
import { useDownloadResume } from '../../hooks/use-download-resume';
import { useUpdateResume } from '../../hooks/use-update-resume';

export function ResumeList({ resumes }: { resumes: Resume[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const { updateResume, isUpdating } = useUpdateResume();
  const { deleteResume, isDeleting } = useDeleteResume();
  const { downloadResume, downloadingId } = useDownloadResume();

  const save = async (resume: Resume) => {
    if (!editingName.trim()) return;
    await updateResume({ id: resume.id, name: editingName.trim() });
    setEditingId(null);
  };

  const download = async (resume: Resume) => {
    const blob = await downloadResume(resume.id);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = resume.originalName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your resumes</CardTitle>
        <p className="text-sm text-slate-500">
          Choose a version when recording which resume you used for an opportunity.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
          >
            <div className="min-w-0 flex-1">
              {editingId === resume.id ? (
                <Input
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  aria-label="Resume name"
                />
              ) : (
                <p className="truncate text-sm font-medium text-slate-900">{resume.name}</p>
              )}
              <p className="truncate text-xs text-slate-500">
                {resume.originalName} · {formatSize(resume.size)}
              </p>
            </div>
            {editingId === resume.id ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => void save(resume)}
                  disabled={isUpdating}
                  aria-label="Save resume name"
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
                    setEditingId(resume.id);
                    setEditingName(resume.name);
                  }}
                  aria-label={`Edit ${resume.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => void download(resume)}
                  disabled={downloadingId === resume.id}
                  aria-label={`Download ${resume.name}`}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (window.confirm(`Delete ${resume.name}?`)) void deleteResume(resume.id);
                  }}
                  disabled={isDeleting}
                  aria-label={`Delete ${resume.name}`}
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

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
