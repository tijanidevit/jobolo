'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSkillEditor, toSkillPayload } from './skill-editor-context';

export function SkillAddForm() {
  const { skills, updateSkills, isUpdating } = useSkillEditor();
  const [name, setName] = useState('');
  const [proficiency, setProficiency] = useState('0');

  const addSkill = async () => {
    const skill = name.trim();
    if (!skill || skills.some((item) => item.skill.toLowerCase() === skill.toLowerCase())) return;

    await updateSkills(
      toSkillPayload([
        ...skills,
        {
          id: `new-${Date.now()}`,
          skill,
          proficiency: Math.max(0, Math.min(100, Number(proficiency))),
        },
      ]),
    );
    setName('');
    setProficiency('0');
  };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            void addSkill();
          }
        }}
        placeholder="Add a skill"
        disabled={isUpdating}
      />
      <Input
        className="w-20"
        type="number"
        min="0"
        max="100"
        value={proficiency}
        onChange={(event) => setProficiency(event.target.value)}
        aria-label="New skill proficiency"
        placeholder="0"
        disabled={isUpdating}
      />
      <span className="text-sm text-slate-400">%</span>
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={() => void addSkill()}
        aria-label="Add skill"
        disabled={isUpdating}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
