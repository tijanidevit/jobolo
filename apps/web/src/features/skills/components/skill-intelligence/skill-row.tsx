'use client';

import { useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toSkillPayload, useSkillEditor } from './skill-editor-context';
import type { UserSkill } from '../../types';

export function SkillRow({ skill }: { skill: UserSkill }) {
  const { skills, setSkills, clearDraftSkills, updateSkills, isUpdating, demandFor } = useSkillEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(skill.skill);
  const currentSkill = skills.find((item) => item.id === skill.id) ?? skill;
  const demand = demandFor(currentSkill);

  const commitEditing = async () => {
    const name = editingName.trim();
    if (
      !name ||
      skills.some(
        (item) => item.id !== currentSkill.id && item.skill.toLowerCase() === name.toLowerCase(),
      )
    ) return;

    await updateSkills(
      toSkillPayload(
        skills.map((item) => (item.id === currentSkill.id ? { ...item, skill: name } : item)),
      ),
    );
    clearDraftSkills();
    setIsEditing(false);
  };

  const removeSkill = async () => {
    await updateSkills(toSkillPayload(skills.filter((item) => item.id !== currentSkill.id)));
    clearDraftSkills();
  };

  const updateProficiency = (value: string) => {
    const proficiency = Math.max(0, Math.min(100, Number(value)));
    setSkills((items) =>
      items.map((item) => (item.id === currentSkill.id ? { ...item, proficiency } : item)),
    );
  };

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-3">
        {isEditing ? (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Input
              className="max-w-xs"
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void commitEditing();
                }
                if (event.key === 'Escape') setIsEditing(false);
              }}
              aria-label={`Edit ${skill.skill}`}
              disabled={isUpdating}
              autoFocus
            />
            <div className="flex shrink-0 items-center gap-1">
              <Input
                className="w-16"
                type="number"
                min="0"
                max="100"
                value={currentSkill.proficiency}
                onChange={(event) => updateProficiency(event.target.value)}
                aria-label={`${skill.skill} proficiency`}
                disabled={isUpdating}
              />
              <span className="text-xs text-slate-400">%</span>
            </div>
            <button
              type="button"
              onClick={() => void commitEditing()}
              className="text-green-600 hover:text-green-700 disabled:opacity-50"
              aria-label="Save skill edit"
              disabled={isUpdating}
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-700"
              aria-label="Cancel skill edit"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-3">
            <span className="truncate text-sm font-semibold text-slate-700">{currentSkill.skill}</span>
            <span className="shrink-0 text-sm font-semibold text-slate-900">
              <span className="mr-1 text-xs font-normal text-slate-500">Proficiency</span>
              {currentSkill.proficiency}%
            </span>
          </div>
        )}
        <div className="flex shrink-0 items-center gap-2">
          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setEditingName(currentSkill.skill);
                setIsEditing(true);
              }}
              className="text-slate-400 hover:text-blue-600"
              aria-label={`Edit ${currentSkill.skill}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => void removeSkill()}
            className="text-slate-400 hover:text-red-600 disabled:opacity-50"
            aria-label={`Delete ${currentSkill.skill}`}
            disabled={isUpdating}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${Math.min(demand?.demandPercentage ?? 0, 100)}%` }}
          />
        </div>
        <span className="mt-1 block text-xs text-slate-500">
          {demand
            ? `Market demand ${demand.demandPercentage}% (${demand.demandCount} ${demand.demandCount === 1 ? 'opportunity' : 'opportunities'})`
            : 'No market demand'}
        </span>
      </div>
    </div>
  );
}
