import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { SkillIntelligence, UserSkill } from '../types';

export type SkillSort = 'proficiency-desc' | 'proficiency-asc' | 'demand-desc' | 'demand-asc';

export const skillsApi = {
  intelligence: async (sort: SkillSort) =>
    (await api.get<ApiResponse<SkillIntelligence>>('/skills', { params: { sort } })).data,
  updateSkills: async (skills: Array<Pick<UserSkill, 'skill' | 'proficiency'> & { id?: string }>) =>
    (await api.put<ApiResponse<UserSkill[]>>('/skills', { skills })).data,
};
