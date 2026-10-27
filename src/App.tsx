import { useEffect, useId, useState } from 'react';
import { book, chapters, closing, opening, reflection } from './content/book';
import { ChapterSection } from './components/ChapterSection';
import { Sprig } from './components/Sprig';
import { VideoSection } from './components/VideoSection';
import { WisdomMap } from './components/WisdomMap';
import { scrollToId, useActiveSection, useReveal } from './lib/hooks';
import { typeset } from './lib/typeset';

const PDF_HREF = 'A_Collection_of_Wisdom.pdf';

const NAV = [
  { id: 'pengantar', label: 'Pengantar', short: 'Pengantar' },
  { id: 'peta', label: 'Peta', short: 'Wisdom Map' },
  ...chapters.map((c) => ({ id: c.id, label: c.number, short: c.title })),
  { id: 'video', label: 'Video', short: 'Pilihan Video' },
  { id: 'refleksi', label: 'Refleksi', short: 'Refleksi & Penutup' },
];
const NAV_IDS = ['awal', ...NAV.map((n) => n.id)];

function TopNav() {
  const active = useActiveSection(NAV_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const current = NAV.find((n) => n.id === active);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <header className="topnav">
      <nav aria-label="Navigasi buku" className="topnav-inner">
        <a className="brand" href="#awal" onClick={(e) => (e.preventDefault(), go('awal'))}>
          A Collection <em>of Wisdom</em>
        </a>
        <ol className="nav-links">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active === n.id ? 'location' : undefined}
                title={n.short}
                onClick={(e) => (e.preventDefault(), go(n.id))}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ol>
        <a className="nav-pdf" href={PDF_HREF} download>
          Unduh PDF
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="nav-now">{current ? current.short : 'Daftar isi'}</span>
          <span className="nav-burger" aria-hidden="true" />
          <span className="sr-only">{menuOpen ? 'Tutup daftar isi' : 'Buka daftar isi'}</span>
        </button>
      </nav>
      <div id={menuId} className="nav-sheet" hidden={!menuOpen}>
        <ol>
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} aria-current={active === n.id ? 'location' : undefined} onClick={(e) => (e.preventDefault(), go(n.id))}>
                <span className="sheet-num">{/^\d/.test(n.label) ? n.label : ''}</span>
                {n.short}
              </a>
            </li>
          ))}
          <li>
            <a href={PDF_HREF} download>
              <span className="sheet-num" />
              Unduh PDF keepsake
            </a>
          </li>
        </ol>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="awal" className="hero" aria-labelledby="hero-h">
      <div className="hero-copy">
        <p className="eyebrow">A Little Collection of Lessons</p>
        <h1 id="hero-h">
          A Collection <em>of Wisdom</em>
        </h1>
        <p className="hero-sub">{book.subtitle}</p>
        <p className="hero-caption">{book.caption}</p>
        <div className="hero-actions">
          <a className="btn btn-solid" href="#pengantar" onClick={(e) => (e.preventDefault(), scrollToId('pengantar'))}>
            Open the Collection
          </a>
          <a className="btn btn-quiet" href={PDF_HREF} download>
            Unduh PDF
          </a>
        </div>
      </div>
      <figure className="hero-figure">
        <img
          src={book.coverPhoto.src}
          alt={book.coverPhoto.alt}
          width={960}
          height={640}
          fetchPriority="high"
          style={{ objectPosition: book.coverPhoto.focus }}
        />
      </figure>
      <a className="scroll-cue" href="#pengantar" onClick={(e) => (e.preventDefault(), scrollToId('pengantar'))}>
        <span>Mulai membaca</span>
        <span className="cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}

function Sharing() {
  return (
    <section id="pengantar" className="sharing" aria-labelledby="sharing-h">
      <figure className="sharing-figure reveal">
        <img src={opening.photo.src} alt={opening.photo.alt} loading="lazy" width={960} height={640} />
        <figcaption>Lahir dari sebuah sesi berbagi.</figcaption>
      </figure>
      <div className="sharing-copy reveal">
        <p className="eyebrow">{opening.kicker}</p>
        <h2 id="sharing-h">{opening.title}</h2>
        {opening.paragraphs.map((p, i) => (
          <p key={i} className={i === 0 ? 'lead' : undefined}>
            {typeset(p)}
          </p>
        ))}
        <p className="dedication">
          {book.dedication.lines.join(' ')}
        </p>
      </div>
    </section>
  );
}

function Reflection() {
  return (
    <section id="refleksi" className="reflection" aria-labelledby="reflect-h">
      <div className="section-head reveal">
        <p className="eyebrow">Reflection</p>
        <h2 id="reflect-h">{reflection.title}</h2>
        <p className="deck">{reflection.deck}</p>
      </div>
      <ol className="questions">
        {reflection.questions.map((q, i) => (
          <li key={i} className="reveal">
            <span className="qn">{String(i + 1).padStart(2, '0')}</span>
            <label htmlFor={`q${i}`}>{q}</label>
            <textarea id={`q${i}`} rows={2} placeholder="Tulis jawabanmu di sini, untuk dirimu sendiri…" />
          </li>
        ))}
      </ol>
      <p className="fine privacy">
        Catatan ini hanya ada di layar perangkatmu: tidak dikirim, tidak disimpan, dan hilang saat halaman ditutup.
      </p>
    </section>
  );
}

function Closing() {
  return (
    <section id="penutup" className="closing" aria-labelledby="closing-h">
      <div className="closing-letter reveal">
        <Sprig className="closing-sprig" leaves={6} />
        <p className="eyebrow">Closing</p>
        <h2 id="closing-h">{closing.title}</h2>
        <p className="deck">{closing.deck}</p>
        {closing.paragraphs.map((p, i) => (
          <p key={i}>{typeset(p)}</p>
        ))}
        <p className="signoff">{closing.signoff}</p>
      </div>
      <div className="download reveal">
        <img src={closing.photo.src} alt="" loading="lazy" width={600} height={400} />
        <div className="download-copy">
          <p className="eyebrow">The Keepsake Edition</p>
          <h3>Simpan versi bukunya</h3>
          <p>PDF A5 40 halaman, siap dibaca di ponsel atau dicetak sebagai buku kecil.</p>
          <a className="btn btn-solid" href={PDF_HREF} download>
            Unduh PDF
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M8 2v9M4 7l4 4 4-4M3 14h10" />
            </svg>
          </a>
        </div>
      </div>
      <button type="button" className="back-top" onClick={() => scrollToId('awal')}>
        Kembali ke awal <span aria-hidden="true">↑</span>
      </button>
    </section>
  );
}

export function App() {
  useReveal();
  return (
    <>
      <a className="skip" href="#isi">
        Langsung ke isi
      </a>
      <TopNav />
      <main id="isi">
        <Hero />
        <Sharing />
        <WisdomMap />
        {chapters.map((c, i) => (
          <ChapterSection key={c.id} chapter={c} index={i} total={chapters.length} />
        ))}
        <VideoSection />
        <Reflection />
        <Closing />
      </main>
      <footer className="site-footer">
        <p className="f-title">A Collection of Wisdom</p>
        <p>Disusun dari sesi berbagi bersama ibu-ibu Mayon.</p>
        <p className="fine">
          Bahan refleksi umum, bukan pengganti pendampingan profesional atau aturan resmi organisasi. Foto CC0 (StockSnap,
          rawpixel, WordPress Photos); thumbnail video milik kanal masing-masing.
        </p>
      </footer>
    </>
  );
}
