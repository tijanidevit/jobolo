import type { SkillSort } from '../../api/skills.api';

export const skillSortOptions: ReadonlyArray<{ value: SkillSort; label: string }> = [
  { value: 'proficiency-desc', label: 'Most proficient' },
  { value: 'proficiency-asc', label: 'Least proficient' },
  { value: 'demand-desc', label: 'Most market demand' },
  { value: 'demand-asc', label: 'Least market demand' },
];
