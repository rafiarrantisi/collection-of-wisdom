import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

const PAGE_W = (148 / 25.4) * 96;
const PAGE_H = (210 / 25.4) * 96;

interface ZoomViewProps {
  pages: number[];
  source: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onGo: (page: number) => void;
}

/** Reading view: the visible page(s) at a comfortable size, scrollable and pinch-zoomable. */
export function ZoomView({ pages, source, onClose, onGo }: ZoomViewProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    const src = source.current;
    if (!body || !src) return;
    // ~15px body text on phones, up to 1.5× on large screens
    const scale = Math.min(Math.max((window.innerWidth - 24) / PAGE_W, 1.08), 1.5);
    body.style.setProperty('--z', String(scale));
    body.replaceChildren(
      ...pages.map((n) => {
        const original = src.querySelector<HTMLElement>(`[data-page="${n}"]`);
        const frame = document.createElement('div');
        frame.className = 'zoom-frame';
        frame.style.width = `${PAGE_W * scale}px`;
        frame.style.height = `${PAGE_H * scale}px`;
        if (original) {
          const copy = original.cloneNode(true) as HTMLElement;
          copy.removeAttribute('id');
          frame.appendChild(copy);
        }
        return frame;
      }),
    );
  }, [pages, source]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="zoom" role="dialog" aria-modal="true" aria-label={`Halaman ${pages.join('–')}, diperbesar`}>
      <div className="zoom-bar">
        <p>
          Halaman {pages.join('–')} <span>· geser untuk membaca</span>
        </p>
        <button ref={closeRef} type="button" className="tool" onClick={onClose}>
          Tutup
        </button>
      </div>
      <div
        className="zoom-scroll"
        onClick={(e) => {
          const a = (e.target as HTMLElement).closest('a[href^="#p-"]');
          if (!a) return;
          e.preventDefault();
          onClose();
          onGo(Number(a.getAttribute('href')!.slice(3)));
        }}
      >
        <div ref={bodyRef} className="zoom-body" />
      </div>
    </div>
  );
}
