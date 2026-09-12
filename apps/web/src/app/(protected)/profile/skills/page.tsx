'use client';

import { useState } from 'react';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { SkillIntelligence } from '@/features/skills/components/skill-intelligence/skill-intelligence';
import type { SkillSort } from '@/features/skills/api/skills.api';
import { useSkillIntelligence } from '@/features/skills/hooks/use-skill-intelligence';

export default function ProfileSkillsPage() {
  const [sort, setSort] = useState<SkillSort>('proficiency-desc');
  const { intelligence, isLoading, error, refetch } = useSkillIntelligence(sort);

  if (isLoading) return <LoadingState variant="page" message="Loading skill intelligence..." />;
  if (error || !intelligence) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load skill intelligence"
        message="Your skill intelligence could not be loaded."
        onRetry={() => void refetch()}
      />
    );
  }

  return <SkillIntelligence intelligence={intelligence} sort={sort} onSortChange={setSort} />;
}
