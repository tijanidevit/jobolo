import type { ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <span key={index}>{part}</span>;
  });
}

export function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-1 text-sm leading-5 text-slate-500">
      {text.split('\n').map((line, index) => {
        const unordered = line.match(/^\s*-\s+(.*)$/);
        const ordered = line.match(/^\s*(\d+)\.\s+(.*)$/);
        if (unordered) {
          return (
            <div key={index} className="flex gap-2 pl-2">
              <span aria-hidden="true">•</span>
              <span>{renderInline(unordered[1])}</span>
            </div>
          );
        }
        if (ordered) {
          return (
            <div key={index} className="flex gap-2 pl-2">
              <span aria-hidden="true" className="min-w-4">
                {ordered[1]}.
              </span>
              <span>{renderInline(ordered[2])}</span>
            </div>
          );
        }
        return line ? (
          <p key={index}>{renderInline(line)}</p>
        ) : (
          <div key={index} className="h-2" aria-hidden="true" />
        );
      })}
    </div>
  );
}
