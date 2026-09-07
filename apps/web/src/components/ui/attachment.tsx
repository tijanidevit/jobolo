'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

interface AttachmentPickerProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSizeMb?: number;
}

export function AttachmentPicker({
  files,
  onChange,
  disabled = false,
  maxFiles = 5,
  maxSizeMb = 10,
}: AttachmentPickerProps) {
  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(event) => onChange(Array.from(event.target.files ?? []).slice(0, maxFiles))}
        className="block w-full text-sm text-slate-500"
        disabled={disabled}
      />
      {files.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">{files.map((file) => file.name).join(', ')}</p>
      )}
      <p className="mt-1 text-xs font-normal text-slate-400">
        Up to {maxFiles} files, {maxSizeMb} MB each.
      </p>
    </div>
  );
}

interface AttachmentDownloadButtonProps {
  fileName: string;
  onDownload: () => Promise<Blob>;
}

export function AttachmentDownloadButton({
  fileName,
  onDownload,
}: AttachmentDownloadButtonProps) {
  const [isOpening, setIsOpening] = useState(false);

  const openAttachment = async () => {
    const tab = window.open('about:blank', '_blank');
    setIsOpening(true);
    try {
      const blob = await onDownload();
      const url = URL.createObjectURL(blob);
      if (tab) tab.location.href = url;
      else window.open(url, '_blank');
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      tab?.close();
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void openAttachment()}
      disabled={isOpening}
      className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-200 hover:text-blue-600 disabled:opacity-60"
    >
      {isOpening ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileText className="h-3.5 w-3.5" />
      )}
      <span className="truncate">{fileName}</span>
    </button>
  );
}
