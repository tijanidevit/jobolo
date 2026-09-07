import type { UserSkill } from '../../types';
import { SkillRow } from './skill-row';

export function SkillList({ skills }: { skills: UserSkill[] }) {
  if (skills.length === 0) return <p className="text-sm text-slate-500">No skills added yet.</p>;

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <SkillRow key={skill.id} skill={skill} />
      ))}
    </div>
  );
}
