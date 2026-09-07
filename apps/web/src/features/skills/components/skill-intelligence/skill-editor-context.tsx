'use client';

import { createContext, useContext } from 'react';
import type { SkillInsight, UserSkill } from '../../types';

export type SkillPayload = Array<Pick<UserSkill, 'skill' | 'proficiency'> & { id?: string }>;

export function toSkillPayload(items: UserSkill[]): SkillPayload {
  return items.map(({ id, skill, proficiency }) => ({
    ...(id.startsWith('detected-') || id.startsWith('new-') ? {} : { id }),
    skill,
    proficiency,
  }));
}

interface SkillEditorContextValue {
  skills: UserSkill[];
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  clearDraftSkills: () => void;
  updateSkills: (skills: SkillPayload) => Promise<unknown>;
  isUpdating: boolean;
  demandFor: (skill: UserSkill) => SkillInsight | undefined;
}

const SkillEditorContext = createContext<SkillEditorContextValue | null>(null);

export const SkillEditorProvider = SkillEditorContext.Provider;

export function useSkillEditor() {
  const context = useContext(SkillEditorContext);
  if (!context) throw new Error('Skills components must be rendered inside SkillEditorProvider');
  return context;
}
