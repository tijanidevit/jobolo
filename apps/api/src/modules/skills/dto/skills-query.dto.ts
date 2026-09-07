import { IsEnum, IsOptional } from 'class-validator';

export const SKILL_SORTS = [
  'proficiency-desc',
  'proficiency-asc',
  'demand-desc',
  'demand-asc',
] as const;

export type SkillSort = (typeof SKILL_SORTS)[number];

export class SkillsQueryDto {
  @IsOptional()
  @IsEnum(SKILL_SORTS)
  sort?: SkillSort;
}
