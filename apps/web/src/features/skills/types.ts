export interface UserSkill {
  id: string;
  skill: string;
  proficiency: number;
}

export interface SkillInsight {
  skill: string;
  demandCount: number;
  demandPercentage: number;
  proficiency: number | null;
  gap: number | null;
}

export interface SkillIntelligence {
  analyzedOpportunities: number;
  profile: UserSkill[];
  skills: SkillInsight[];
}
