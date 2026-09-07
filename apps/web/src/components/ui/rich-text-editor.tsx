'use client';

import { useRef } from 'react';

interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 8,
  className = '',
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (format: 'bold' | 'italic' | 'list') => {
    const textarea = textareaRef.current;
    const additions = { bold: '**text**', italic: '_text_', list: '\n- item' };
    if (!textarea) {
      onChange(`${value}${additions[format]}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const replacement =
      format === 'bold'
        ? `**${selected || 'text'}**`
        : format === 'italic'
          ? `_${selected || 'text'}_`
          : selected
            ? `\n- ${selected}`
            : additions.list;
    const nextValue = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + replacement.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div>
      <div className="flex gap-1 border-b border-slate-200 pb-1">
        <button
          type="button"
          onClick={() => insertFormat('bold')}
          disabled={disabled}
          className="rounded px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertFormat('italic')}
          disabled={disabled}
          className="rounded px-2 py-1 text-xs italic text-slate-500 hover:bg-slate-100 disabled:opacity-50"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertFormat('list')}
          disabled={disabled}
          className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-50"
        >
          List
        </button>
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 ${className}`}
      />
    </div>
  );
}
