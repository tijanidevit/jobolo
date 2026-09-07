export interface UserSkill {
  id: string;
  skill: string;
  proficiency: number;
}

export interface SkillInsight {
  id: string | null;
  skill: string;
  demandCount: number;
  demandPercentage: number;
  proficiency: number | null;
  gap: number | null;
}

export interface SkillIntelligence {
  skills: SkillInsight[];
}
