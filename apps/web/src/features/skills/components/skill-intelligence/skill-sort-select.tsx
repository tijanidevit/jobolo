import { SearchableSelect } from '@/components/ui/searchable-select';
import type { SkillSort } from '../../api/skills.api';

export function SkillSortSelect({
  value,
  options,
  onChange,
}: {
  value: SkillSort;
  options: ReadonlyArray<{ value: SkillSort; label: string }>;
  onChange: (value: SkillSort) => void;
}) {
  return (
    <div className="flex w-full max-w-xs items-center gap-3 sm:w-auto">
      <span className="shrink-0 text-sm font-medium text-slate-600">Sort by</span>
      <div className="min-w-0 flex-1 sm:w-52 sm:flex-none">
        <SearchableSelect
          value={value}
          options={options}
          onChange={(nextValue) => onChange(nextValue as SkillSort)}
          placeholder="Sort skills"
          searchPlaceholder="Search sort options..."
        />
      </div>
    </div>
  );
}
