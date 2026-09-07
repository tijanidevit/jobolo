'use client';

import { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getErrorMessage } from '@/features/opportunities/utils/opportunity.utils';
import type { SkillSort } from '../../api/skills.api';
import { useUpdateSkills } from '../../hooks/use-update-skills';
import type { SkillIntelligence as SkillIntelligenceData, UserSkill } from '../../types';
import { SkillAddForm } from './skill-add-form';
import { SkillEditorProvider } from './skill-editor-context';
import { SkillList } from './skill-list';
import { skillSortOptions } from './skill-sort-options';
import { SkillSortSelect } from './skill-sort-select';

export function SkillIntelligence({
  intelligence,
  sort,
  onSortChange,
}: {
  intelligence: SkillIntelligenceData;
  sort: SkillSort;
  onSortChange: (sort: SkillSort) => void;
}) {
  const { updateSkills, isUpdating, error: updateError } = useUpdateSkills();
  const [draftSkills, setDraftSkills] = useState<UserSkill[] | null>(null);
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

  return (
    <SkillEditorProvider
      value={{
        skills,
        setSkills,
        clearDraftSkills: () => setDraftSkills(null),
        updateSkills,
        isUpdating,
        demandFor: (skill) =>
          intelligence.skills.find(
            (item) => item.skill.toLowerCase() === skill.skill.toLowerCase(),
          ),
      }}
    >
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
        <Card>
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
              <SkillAddForm />
              <SkillSortSelect value={sort} onChange={onSortChange} options={skillSortOptions} />
            </div>
            <SkillList skills={skills} />
            {updateError && (
              <p className="text-sm text-red-600">
                {getErrorMessage(updateError, 'Unable to save your skills.')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </SkillEditorProvider>
  );
}
