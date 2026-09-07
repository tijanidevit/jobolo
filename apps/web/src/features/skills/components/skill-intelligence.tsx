'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BrainCircuit, Check, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { getErrorMessage } from '@/features/opportunities/utils/opportunity.utils';
import { useSkillIntelligence } from '../hooks/use-skill-intelligence';
import { useUpdateSkillProfile } from '../hooks/use-update-skill-profile';
import type { SkillInsight, UserSkill } from '../types';

interface SkillProfileContextValue {
  skills: UserSkill[];
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  updateProfile: ReturnType<typeof useUpdateSkillProfile>['updateProfile'];
  isUpdating: boolean;
}

const SkillProfileContext = createContext<SkillProfileContextValue | null>(null);

function useSkillProfile() {
  const context = useContext(SkillProfileContext);
  if (!context) throw new Error('SkillRow must be rendered inside SkillProfileContext');
  return context;
}

export function SkillIntelligence() {
  const { intelligence, isLoading, error, refetch } = useSkillIntelligence();
  const { updateProfile, isUpdating, error: updateError } = useUpdateSkillProfile();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const profileLoaded = useRef(false);

  useEffect(() => {
    if (!intelligence || profileLoaded.current) return;
    const profileBySkill = new Map(
      intelligence.profile.map((item) => [item.skill.toLowerCase(), item]),
    );
    const detectedSkills = intelligence.skills.map(
      (item) =>
        profileBySkill.get(item.skill.toLowerCase()) ?? {
          id: `detected-${item.skill}`,
          skill: item.skill,
          proficiency: item.proficiency ?? 50,
        },
    );
    const customSkills = intelligence.profile.filter(
      (item) =>
        !intelligence.skills.some(
          (skill) => skill.skill.toLowerCase() === item.skill.toLowerCase(),
        ),
    );
    setSkills([...detectedSkills, ...customSkills]);
    profileLoaded.current = true;
  }, [intelligence]);

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

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill || skills.some((item) => item.skill.toLowerCase() === skill.toLowerCase())) return;
    setSkills((current) => [...current, { id: `new-${Date.now()}`, skill, proficiency: 50 }]);
    setNewSkill('');
  };
  const updateProficiency = (id: string, proficiency: number) =>
    setSkills((current) =>
      current.map((item) => (item.id === id ? { ...item, proficiency } : item)),
    );
  const save = async () => {
    await updateProfile(skills.map(({ skill, proficiency }) => ({ skill, proficiency })));
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
      <SkillProfileContext.Provider value={{ skills, setSkills, updateProfile, isUpdating }}><Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BrainCircuit className="h-5 w-5 text-blue-600" />
            Your skills
          </CardTitle>
          <CardDescription>
            Skills detected from your opportunity descriptions are listed here. Edit or remove any
            item directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex max-w-lg gap-2">
            <Input
              value={newSkill}
              onChange={(event) => setNewSkill(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add a skill"
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={addSkill}
              aria-label="Add skill"
            >
              <Plus className="h-4 w-4" />
            </Button>
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
          <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-500">
              Changes are applied when you save your profile.
            </p>
            <Button type="button" onClick={() => void save()} disabled={isUpdating}>
              <Save className="mr-2 h-4 w-4" />
              {isUpdating ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
          {updateError && (
            <p className="text-sm text-red-600">
              {getErrorMessage(updateError, 'Unable to save your skill profile.')}
            </p>
          )}
        </CardContent>
      </Card></SkillProfileContext.Provider>
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
  const { skills, setSkills, updateProfile, isUpdating } = useSkillProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(skill.skill);
  const currentSkill = skills.find((item) => item.id === skill.id) ?? skill;
  const commitEditing = async () => {
    const name = editingName.trim();
    if (!name || skills.some((item) => item.id !== currentSkill.id && item.skill.toLowerCase() === name.toLowerCase())) return;
    const updatedSkills = skills.map((item) => item.id === currentSkill.id ? { ...item, skill: name } : item);
    await updateProfile(updatedSkills.map(({ skill: skillName, proficiency }) => ({ skill: skillName, proficiency })));
    setSkills(updatedSkills);
    setIsEditing(false);
  };
  const removeSkill = async () => {
    const updatedSkills = skills.filter((item) => item.id !== currentSkill.id);
    await updateProfile(updatedSkills.map(({ skill: skillName, proficiency }) => ({ skill: skillName, proficiency })));
    setSkills(updatedSkills);
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
          <span className="text-sm font-semibold text-slate-700">{skill.skill}</span>
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
      <div className="mt-2 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${Math.min(demand?.demandPercentage ?? 0, 100)}%` }}
          />
        </div>
        <span className="w-20 text-right text-xs text-slate-500">
          {demand ? `${demand.demandPercentage}% (${demand.demandCount})` : 'No demand'}
        </span>
      </div>
    </div>
  );
}
