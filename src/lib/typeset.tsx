import { Fragment, type ReactNode } from 'react';

// Indonesian reduplicated words (hari-hari, masing-masing) must never break at the hyphen.
const REDUP = /([\p{L}]+-[\p{L}]+)/gu;

export function typeset(text: string): ReactNode {
  const parts = text.split(REDUP);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
