'use client';

import { createContext, useContext, useState } from 'react';
import { BrainCircuit, Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { getErrorMessage } from '@/features/opportunities/utils/opportunity.utils';
import { useSkillIntelligence } from '../hooks/use-skill-intelligence';
import { useUpdateSkills } from '../hooks/use-update-skills';
import type { SkillInsight, UserSkill } from '../types';

type SkillSort = 'proficiency-desc' | 'proficiency-asc' | 'demand-desc' | 'demand-asc';

const skillSortOptions = [
  { value: 'proficiency-desc', label: 'Most proficient' },
  { value: 'proficiency-asc', label: 'Least proficient' },
  { value: 'demand-desc', label: 'Most market demand' },
  { value: 'demand-asc', label: 'Least market demand' },
] as const;

interface SkillContextValue {
  skills: UserSkill[];
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  clearDraftSkills: () => void;
  updateSkills: ReturnType<typeof useUpdateSkills>['updateSkills'];
  isUpdating: boolean;
  toPayload: (items: UserSkill[]) => Array<Pick<UserSkill, 'skill' | 'proficiency'> & { id?: string }>;
}

const SkillContext = createContext<SkillContextValue | null>(null);

function useSkills() {
  const context = useContext(SkillContext);
  if (!context) throw new Error('SkillRow must be rendered inside SkillContext');
  return context;
}

function toSkillPayload(items: UserSkill[]) {
  return items.map(({ id, skill, proficiency }) => ({
    ...(id.startsWith('detected-') || id.startsWith('new-') ? {} : { id }),
    skill,
    proficiency,
  }));
}

export function SkillIntelligence() {
  const [draftSkills, setDraftSkills] = useState<UserSkill[] | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState('0');
  const [sort, setSort] = useState<SkillSort>('proficiency-desc');
  const { intelligence, isLoading, error, refetch } = useSkillIntelligence(sort);
  const { updateSkills, isUpdating, error: updateError } = useUpdateSkills();

  if (isLoading) return <LoadingState variant="page" message="Loading skill intelligence..." />;
  if (error || !intelligence)
    return (
      <ErrorState
        variant="page"
        title="Unable to load skill intelligence"
        message="Your skill intelligence could not be loaded."
        onRetry={() => void refetch()}
      />
    );

  const serverSkills = intelligence.skills.map((item) => ({
    id: item.id ?? `detected-${item.skill}`,
    skill: item.skill,
    proficiency: item.proficiency ?? 50,
  }));
  const skills = draftSkills ?? serverSkills;
  const setSkills = (update: React.SetStateAction<UserSkill[]>) => {
    setDraftSkills((current) => {
      const previous = current ?? serverSkills;
      return typeof update === 'function' ? update(previous) : update;
    });
  };

  const addSkill = async () => {
    const skill = newSkill.trim();
    if (!skill || skills.some((item) => item.skill.toLowerCase() === skill.toLowerCase())) return;
    const updatedSkills = [
      ...skills,
      {
        id: `new-${Date.now()}`,
        skill,
        proficiency: Math.max(0, Math.min(100, Number(newSkillProficiency))),
      },
    ];
    await updateSkills(toSkillPayload(updatedSkills));
    setDraftSkills(null);
    setNewSkill('');
    setNewSkillProficiency('0');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
          Intelligence
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Skill intelligence
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Compare the skills requested in your saved opportunities with your current proficiency.
        </p>
      </header>
      <SkillContext.Provider value={{ skills, setSkills, clearDraftSkills: () => setDraftSkills(null), updateSkills, isUpdating, toPayload: toSkillPayload }}><Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BrainCircuit className="h-5 w-5 text-blue-600" />
            Your skills
          </CardTitle>
          <CardDescription>
              Proficiency is your self-assessed skill level. Market demand shows how often a skill
              appears in your saved opportunity descriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Input
                value={newSkill}
                onChange={(event) => setNewSkill(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void addSkill();
                  }
                }}
                placeholder="Add a skill"
                disabled={isUpdating}
              />
              <Input
                className="w-20"
                type="number"
                min="0"
                max="100"
                value={newSkillProficiency}
                onChange={(event) => setNewSkillProficiency(event.target.value)}
                aria-label="New skill proficiency"
                placeholder="0"
                disabled={isUpdating}
              />
              <span className="text-sm text-slate-400">%</span>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => void addSkill()}
                aria-label="Add skill"
                disabled={isUpdating}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex w-full max-w-xs items-center gap-3 sm:w-auto">
            <span className="shrink-0 text-sm font-medium text-slate-600">
              Sort by
            </span>
            <div className="min-w-0 flex-1 sm:w-52 sm:flex-none">
              <SearchableSelect
                value={sort}
                options={skillSortOptions}
                onChange={(value) => setSort(value as SkillSort)}
                placeholder="Sort skills"
                searchPlaceholder="Search sort options..."
              />
            </div>
            </div>
          </div>
          {skills.length === 0 ? (
            <p className="text-sm text-slate-500">No skills added yet.</p>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  demand={intelligence.skills.find(
                    (item) => item.skill.toLowerCase() === skill.skill.toLowerCase(),
                  )}
                />
              ))}
            </div>
          )}

          {updateError && (
            <p className="text-sm text-red-600">
              {getErrorMessage(updateError, 'Unable to save your skills.')}
            </p>
          )}
        </CardContent>
      </Card></SkillContext.Provider>
    </div>
  );
}

function SkillRow({
  skill,
  demand,
}: {
  skill: UserSkill;
  demand?: SkillInsight;
}) {
  const { skills, setSkills, clearDraftSkills, updateSkills, isUpdating, toPayload } = useSkills();
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(skill.skill);
  const currentSkill = skills.find((item) => item.id === skill.id) ?? skill;
  const commitEditing = async () => {
    const name = editingName.trim();
    if (!name || skills.some((item) => item.id !== currentSkill.id && item.skill.toLowerCase() === name.toLowerCase())) return;
    const updatedSkills = skills.map((item) => item.id === currentSkill.id ? { ...item, skill: name } : item);
    await updateSkills(toPayload(updatedSkills));
    clearDraftSkills();
    setIsEditing(false);
  };
  const removeSkill = async () => {
    const updatedSkills = skills.filter((item) => item.id !== currentSkill.id);
    await updateSkills(toPayload(updatedSkills));
    clearDraftSkills();
  };
  const updateProficiency = (proficiency: number) => setSkills((items) => items.map((item) => item.id === currentSkill.id ? { ...item, proficiency } : item));

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
                id={`skill-${skill.id}`}
                type="number"
                min="0"
                max="100"
                value={currentSkill.proficiency}
                onChange={(event) =>
                  updateProficiency(Math.max(0, Math.min(100, Number(event.target.value))))
                }
                aria-label={`${skill.skill} proficiency`}
              />
              <span className="text-xs text-slate-400">%</span>
            </div>
            <button
              type="button"
              onClick={() => void commitEditing()}
              className="text-green-600 hover:text-green-700"
              aria-label="Save skill edit"
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
            <span className="truncate text-sm font-semibold text-slate-700">{skill.skill}</span>
            <span className="shrink-0 text-sm font-semibold text-slate-900">
              <span className="mr-1 text-xs font-normal text-slate-500">Proficiency</span>
              {skill.proficiency}%
            </span>
          </div>
        )}
        <div className="flex shrink-0 items-center gap-2">
          {!isEditing && (
            <button
              type="button"
              onClick={() => { setEditingName(currentSkill.skill); setIsEditing(true); }}
              className="text-slate-400 hover:text-blue-600"
              aria-label={`Edit ${skill.skill}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
              onClick={() => void removeSkill()}
            className="text-slate-400 hover:text-red-600"
            aria-label={`Delete ${skill.skill}`}
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
          {demand ? `Market demand ${demand.demandPercentage}% (${demand.demandCount} ${demand.demandCount === 1 ? 'opportunity' : 'opportunities'})` : 'No market demand'}
        </span>
      </div>
    </div>
  );
}
