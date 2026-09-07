import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { SkillIntelligence, UserSkill } from '../types';

export const skillsApi = {
  intelligence: async () => (await api.get<ApiResponse<SkillIntelligence>>('/skills/intelligence')).data,
  updateProfile: async (skills: Array<Pick<UserSkill, 'skill' | 'proficiency'>>) => (await api.put<ApiResponse<UserSkill[]>>('/skills/profile', { skills })).data,
};
