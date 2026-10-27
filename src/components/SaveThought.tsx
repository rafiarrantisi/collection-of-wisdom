import { useEffect, useState } from 'react';
import { copyText, type CopyState } from '../lib/hooks';

interface SaveThoughtProps {
  text: string;
}

/** "Simpan kutipan": copies the quote (plus the book title) to the clipboard. */
export function SaveThought({ text }: SaveThoughtProps) {
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const t = window.setTimeout(() => setState('idle'), 2400);
    return () => window.clearTimeout(t);
  }, [state]);

  const onClick = async () => {
    const ok = await copyText(`“${text}”\n— A Collection of Wisdom`);
    setState(ok ? 'copied' : 'failed');
  };

  return (
    <button type="button" className="save-thought" onClick={onClick}>
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M6 3h8a1 1 0 0 1 1 1v13l-5-3-5 3V4a1 1 0 0 1 1-1z" />
      </svg>
      <span aria-live="polite">
        {state === 'copied' ? 'Tersalin — siap dibagikan' : state === 'failed' ? 'Gagal menyalin' : 'Simpan kutipan ini'}
      </span>
    </button>
  );
}
