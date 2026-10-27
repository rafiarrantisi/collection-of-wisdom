import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip/dist/js/page-flip.module.js';
import { BOOK_PAGE_COUNT, BookPages, bookSections } from '../print/PrintBook';
import { ZoomView } from './ZoomView';

const PDF_HREF = 'A_Collection_of_Wisdom.pdf';
/** A5 at 96 css px per inch. */
export const PAGE_W = (148 / 25.4) * 96;
export const PAGE_H = (210 / 25.4) * 96;
const SECTIONS = bookSections();

type Mode = 'portrait' | 'landscape';

/** Page numbers (1-based) visible for a given flip index. */
function visiblePages(index: number, mode: Mode): number[] {
  const n = index + 1;
  if (mode === 'portrait') return [n];
  if (n === 1 || n === BOOK_PAGE_COUNT) return [n];
  // with showCover, spreads are (2,3), (4,5) …
  const left = n % 2 === 0 ? n : n - 1;
  return [left, left + 1].filter((p) => p <= BOOK_PAGE_COUNT);
}

function pageFromHash(): number {
  const m = /^#p-(\d+)$/.exec(window.location.hash);
  const n = m ? Number(m[1]) : 1;
  return Math.min(Math.max(n, 1), BOOK_PAGE_COUNT);
}

export function FlipBook() {
  const bookRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const [index, setIndex] = useState(() => pageFromHash() - 1);
  const [mode, setMode] = useState<Mode>('landscape');
  const [ready, setReady] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [touched, setTouched] = useState(false);
  const tocId = useId();

  const goTo = useCallback((page: number) => {
    const pf = flipRef.current;
    if (!pf) return;
    pf.flip(Math.min(Math.max(page, 1), BOOK_PAGE_COUNT) - 1);
    setTouched(true);
  }, []);

  const next = useCallback(() => {
    flipRef.current?.flipNext();
    setTouched(true);
  }, []);
  const prev = useCallback(() => {
    flipRef.current?.flipPrev();
    setTouched(true);
  }, []);

  // Keep the A5 page scaled to whatever size the flip engine gives each leaf.
  const rescale = useCallback(() => {
    const el = bookRef.current;
    const leaf = el?.querySelector<HTMLElement>('.leaf');
    if (!el || !leaf || !leaf.offsetWidth) return;
    el.style.setProperty('--s', String(leaf.offsetWidth / PAGE_W));
  }, []);

  useLayoutEffect(() => {
    const el = bookRef.current;
    if (!el || flipRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = pageFromHash() - 1;
    const pf = new PageFlip(el, {
      width: Math.round(PAGE_W),
      height: Math.round(PAGE_H),
      size: 'stretch',
      minWidth: 280,
      maxWidth: 1000,
      minHeight: 396,
      maxHeight: 1414,
      showCover: true,
      usePortrait: true,
      startPage: start,
      drawShadow: true,
      maxShadowOpacity: 0.35,
      flippingTime: reduce ? 1 : 900,
      mobileScrollSupport: true,
      disableFlipByClick: false,
      showPageCorners: true,
      clickEventForward: true,
    });
    pf.loadFromHTML(el.querySelectorAll<HTMLElement>('.leaf'));
    flipRef.current = pf;
    setMode(pf.getOrientation());
    setIndex(pf.getCurrentPageIndex());
    pf.on('flip', (e) => {
      setIndex(e.data);
      history.replaceState(null, '', `#p-${e.data + 1}`);
    });
    pf.on('changeOrientation', (e) => setMode(e.data));
    requestAnimationFrame(() => {
      rescale();
      setReady(true);
    });
    // The engine owns these DOM nodes from now on; never re-render the page list.
  }, [rescale]);

  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => rescale());
    ro.observe(el);
    return () => ro.disconnect();
  }, [rescale]);

  // Internal links (#p-N) flip; external links open in a new tab.
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;
    el.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#p-"]');
      if (!a) return;
      e.preventDefault();
      goTo(Number(a.getAttribute('href')!.slice(3)));
    };
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [goTo]);

  // Shared links like …/#p-24 also work while the book is already open.
  useEffect(() => {
    const onHash = () => {
      const target = pageFromHash() - 1;
      if (flipRef.current && flipRef.current.getCurrentPageIndex() !== target) goTo(target + 1);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoom || e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') next();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
      else if (e.key === 'Home') goTo(1);
      else if (e.key === 'End') goTo(BOOK_PAGE_COUNT);
      else if (e.key === 'Escape') setTocOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goTo, zoom]);

  const shown = visiblePages(index, mode);
  const atStart = index === 0;
  const atEnd = shown[shown.length - 1] === BOOK_PAGE_COUNT;
  const closed = shown.length === 1 && mode === 'landscape';
  const label =
    shown.length === 2 ? `Halaman ${shown[0]}–${shown[1]}` : shown[0] === 1 ? 'Sampul' : shown[0] === BOOK_PAGE_COUNT ? 'Sampul belakang' : `Halaman ${shown[0]}`;
  const progress = (shown[shown.length - 1] / BOOK_PAGE_COUNT) * 100;

  return (
    <div className={`reader${ready ? ' is-ready' : ''}`}>
      <a className="skip" href="#p-3" onClick={(e) => (e.preventDefault(), goTo(3))}>
        Ke daftar isi
      </a>
      <header className="bar top">
        <p className="bar-title">
          A Collection <em>of Wisdom</em>
        </p>
        <nav className="bar-actions" aria-label="Alat baca">
          <button type="button" className="tool" aria-expanded={tocOpen} aria-controls={tocId} onClick={() => setTocOpen((o) => !o)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 5h12M4 10h12M4 15h8" />
            </svg>
            <span>Daftar isi</span>
          </button>
          <button type="button" className="tool" onClick={() => setZoom(true)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="9" cy="9" r="5.5" />
              <path d="M13 13l4 4M9 6.5v5M6.5 9h5" />
            </svg>
            <span>Perbesar</span>
          </button>
          <a className="tool tool-pdf" href={PDF_HREF} download>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 3v10M6 9l4 4 4-4M4 17h12" />
            </svg>
            <span>PDF</span>
          </a>
        </nav>
        <div id={tocId} className="toc-panel" hidden={!tocOpen}>
          <p className="toc-panel-title">Daftar isi</p>
          <ol>
            {SECTIONS.map((s) => (
              <li key={s.page}>
                <button
                  type="button"
                  aria-current={shown.includes(s.page) ? 'page' : undefined}
                  onClick={() => {
                    setTocOpen(false);
                    goTo(s.page);
                  }}
                >
                  <span className="tp-title">{s.title}</span>
                  {s.theme && <span className="tp-theme">{s.theme}</span>}
                  <span className="tp-page">{s.page}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <main className={`stage ${mode}${closed ? ' closed' : ''}${atStart ? ' at-cover' : ''}${atEnd && closed ? ' at-back' : ''}`}>
        <button type="button" className="side prev" onClick={prev} disabled={atStart} aria-label="Halaman sebelumnya">
          <span aria-hidden="true" />
        </button>
        <div className="book-wrap">
          <div ref={bookRef} className="flip-book">
            <BookPages leaves />
          </div>
        </div>
        <button type="button" className="side next" onClick={next} disabled={atEnd} aria-label="Halaman berikutnya">
          <span aria-hidden="true" />
        </button>
      </main>

      <footer className="bar bottom">
        <button type="button" className="nav-btn" onClick={prev} disabled={atStart} aria-label="Halaman sebelumnya">
          ‹
        </button>
        <div className="where">
          <p aria-live="polite">
            {label} <span className="of">/ {BOOK_PAGE_COUNT}</span>
          </p>
          <div className="progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className={`hint${touched ? ' gone' : ''}`}>
            {atStart ? 'Ketuk atau geser untuk membuka' : 'Ketuk, geser, atau tarik ujung halaman'}
          </p>
        </div>
        <button type="button" className="nav-btn" onClick={next} disabled={atEnd} aria-label="Halaman berikutnya">
          ›
        </button>
      </footer>

      {zoom && <ZoomView pages={shown} source={bookRef} onClose={() => setZoom(false)} onGo={goTo} />}
    </div>
  );
}
