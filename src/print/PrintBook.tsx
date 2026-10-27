import type { ReactNode } from 'react';
import {
  backCover,
  book,
  chapters,
  closing,
  explore,
  moments,
  opening,
  reflection,
  sources,
  wisdomMap,
  type Article,
  type Chapter,
  type Photo,
  type Practical,
} from '../content/book';
import { thumbPath, videos, youtubeUrl, type Video } from '../content/videos';
import { Sprig } from '../components/Sprig';
import { QrCode } from './QrCode';
import { typeset } from '../lib/typeset';

/* ---------- page model ---------- */

interface PageSpec {
  key: string;
  folio: boolean;
  render: (n: number) => ReactNode;
  tocKey?: string;
}

const RUN_TITLE = 'A Collection of Wisdom';

function Img({ photo, className }: { photo: Photo; className?: string }) {
  return (
    <img
      className={className}
      src={photo.src}
      alt={photo.alt}
      style={{ objectPosition: photo.focus ?? '50% 50%' }}
    />
  );
}

function RunningHead({ left, right }: { left: string; right: string }) {
  return (
    <header className="run-head">
      <span>{left}</span>
      <span className="run-rule" aria-hidden="true" />
      <span>{right}</span>
    </header>
  );
}

function PracticalBlock({ practical }: { practical: Practical }) {
  switch (practical.kind) {
    case 'list':
      return (
        <aside className="practical">
          <p className="label">{practical.label}</p>
          <ol className={practical.numbered ? 'numbered' : 'dotted'}>
            {practical.items.map((item, i) => (
              <li key={i}>
                {practical.numbered && <span className="num">{String(i + 1).padStart(2, '0')}</span>}
                <span>{typeset(item)}</span>
              </li>
            ))}
          </ol>
        </aside>
      );
    case 'swap':
      return (
        <aside className="practical swap">
          <p className="label">{practical.label}</p>
          {practical.pairs.map((p, i) => (
            <div className="swap-pair" key={i}>
              <p>
                <span className="swap-tag">Daripada</span>
                <span className="instead">“{p.instead}”</span>
              </p>
              <p>
                <span className="swap-tag olive">Cobalah</span>
                <span className="try">“{p.try}”</span>
              </p>
            </div>
          ))}
        </aside>
      );
    case 'pockets':
      return (
        <aside className="practical pockets">
          {practical.items.map((it, i) => (
            <div className="pocket" key={i}>
              <span className="pocket-num">{String(i + 1).padStart(2, '0')}</span>
              <p className="pocket-title">{it.title}</p>
              <p className="pocket-text">{typeset(it.text)}</p>
            </div>
          ))}
        </aside>
      );
    case 'prompt':
      return (
        <aside className="practical prompt">
          <p className="label">{practical.label}</p>
          <p className="prompt-text">“{practical.text}”</p>
        </aside>
      );
  }
}

function ArticlePage({ chapter, article }: { chapter: Chapter; article: Article }) {
  const after = article.practicalAfter ?? article.paragraphs.length;
  return (
    <div className="safe flow">
      <RunningHead left={`${chapter.number} · ${chapter.title}`} right={article.runningHead} />
      <h2 className="a-title">{article.title}</h2>
      <p className="a-deck">{article.deck}</p>
      <div className="a-body">
        {article.paragraphs.slice(0, after).map((p, i) => (
          <p key={i}>{typeset(p)}</p>
        ))}
        {article.practical && <PracticalBlock practical={article.practical} />}
        {article.paragraphs.slice(after).map((p, i) => (
          <p key={`b${i}`}>{typeset(p)}</p>
        ))}
      </div>
      {article.note && (
        <aside className="note">
          <p className="label">{article.note.label}</p>
          <p className="note-text">{typeset(article.note.text)}</p>
        </aside>
      )}
    </div>
  );
}

function ChapterOpener({ chapter }: { chapter: Chapter }) {
  return (
    <>
      <div className="opener-photo">
        <Img photo={chapter.opener} />
      </div>
      <div className="safe opener-text">
        <p className="kicker">
          {chapter.number} <span className="slash">/</span> {chapter.label}
        </p>
        <h2 className="opener-title">{chapter.title}</h2>
        <p className="opener-theme">{chapter.theme}</p>
        <p className="opener-quote">{typeset(chapter.openerQuote)}</p>
      </div>
    </>
  );
}

function QuotePage({ chapter }: { chapter: Chapter }) {
  const q = chapter.closingQuote;
  return (
    <div className="safe quote-page">
      <div className="quote-photo">
        <Img photo={q.photo} />
      </div>
      <Sprig className="quote-sprig" leaves={6} />
      <div className="quote-block">
        <span className="quote-mark" aria-hidden="true">“</span>
        <p className={`big-quote${q.body ? ' javanese' : ''}`}>{typeset(q.text)}</p>
        {q.body && <p className="quote-body">{typeset(q.body)}</p>}
        <p className="quote-tagline">{q.tagline}</p>
      </div>
    </div>
  );
}

function VideoPage({ video, first }: { video: Video; first: boolean }) {
  const url = youtubeUrl(video.id);
  return (
    <div className="safe flow video-page">
      <RunningHead left="A Little More to Explore" right={video.group} />
      {first && <h2 className="video-group">{video.group}</h2>}
      {!first && <p className="video-group-cont">{video.group}</p>}
      <a className="thumb" href={url}>
        <img src={thumbPath(video.id)} alt={`Thumbnail episode: ${video.title}`} />
      </a>
      <p className="video-key">Video {video.key} · {video.channel}</p>
      <h3 className="video-title">
        <a href={url}>{video.title}</a>
      </h3>
      <p className="video-speakers">Bersama {video.speakers}</p>
      <div className="video-bottom">
        <div className="video-takeaways">
          <p className="label">Yang bisa dibawa pulang</p>
          <ul>
            {video.takeaways.map((t, i) => (
              <li key={i}>{typeset(t)}</li>
            ))}
          </ul>
        </div>
        <div className="video-qr">
          <a href={url} aria-label={`Buka ${url}`}>
            <QrCode url={url} />
          </a>
          <a className="qr-link" href={url}>
            youtu.be/{video.id}
          </a>
        </div>
      </div>
      {video.key === 'G' && <p className="explore-closing">{explore.closingLine}</p>}
    </div>
  );
}

function Moment({ photo, className }: { photo: Photo & { ratio: string }; className?: string }) {
  return (
    <figure className={`moment${className ? ` ${className}` : ''}`} style={{ aspectRatio: photo.ratio }}>
      <img src={photo.src} alt={photo.alt} />
    </figure>
  );
}

function MomentsPage({ part }: { part: 1 | 2 | 3 | 4 }) {
  const m = moments.photos;
  const head = <RunningHead left="Moments Together" right="Dari kebersamaan ibu-ibu Mayon" />;
  if (part === 1)
    return (
      <div className="safe flow moments">
        <p className="kicker">{moments.kicker}</p>
        <h2 className="page-title">{moments.title}</h2>
        <p className="a-deck">{moments.deck}</p>
        <p className="moments-intro">{typeset(moments.paragraph)}</p>
        <Moment photo={m.field} className="m-bottom" />
      </div>
    );
  if (part === 2)
    return (
      <div className="safe flow moments">
        {head}
        <Moment photo={m.standing} />
        <Moment photo={m.picnic} className="m-gap" />
      </div>
    );
  if (part === 3)
    return (
      <div className="safe flow moments">
        {head}
        <Moment photo={m.uniform} className="m-portrait-lg" />
      </div>
    );
  return (
    <div className="safe flow moments">
      {head}
      <Moment photo={m.celebration} />
      <div className="m-pair m-gap">
        <Moment photo={m.dish} />
        <Moment photo={m.table} />
      </div>
      <p className="moments-close">{moments.closingLine}</p>
    </div>
  );
}

function WisdomMapPage({ chapterPage }: { chapterPage: (id: string) => number }) {
  const nodes = chapters.map((c, i) => ({ c, pos: ['tl', 'tr', 'bl', 'br'][i] }));
  return (
    <div className="safe map-page">
      <p className="kicker">Wisdom Map</p>
      <h2 className="page-title">{wisdomMap.title}</h2>
      <p className="a-deck">{wisdomMap.deck}</p>
      <div className="map">
        <svg className="map-lines" viewBox="0 0 118 120" aria-hidden="true" preserveAspectRatio="none">
          <path d="M14 34 C 18 46, 30 52, 40 54" />
          <path d="M104 34 C 100 46, 88 52, 78 54" />
          <path d="M14 86 C 18 74, 30 68, 40 66" />
          <path d="M104 86 C 100 74, 88 68, 78 66" />
          <ellipse cx="59" cy="60" rx="33" ry="33" className="halo" />
        </svg>
        <div className="map-center">
          <span>{wisdomMap.center}</span>
        </div>
        {nodes.map(({ c, pos }) => (
          <a className={`map-node ${pos}`} key={c.id} href={`#p-${chapterPage(c.id)}`}>
            <span className="map-dot">{c.number}</span>
            <p className="map-title">{c.mapTitle}</p>
            <p className="map-summary">{c.mapSummary}</p>
          </a>
        ))}
      </div>
      <p className="map-foot">{wisdomMap.footnote}</p>
    </div>
  );
}

function Toc({ entries }: { entries: { label: string; title: string; theme: string; page: number }[] }) {
  return (
    <div className="safe toc-page">
      <p className="kicker">Inside This Book</p>
      <h2 className="page-title">Contents</h2>
      <ol className="toc">
        {entries.map((e) => (
          <li key={e.title}>
            <a href={`#p-${e.page}`} className="toc-row">
              <span className="toc-num">{e.label}</span>
              <span className="toc-title">
                {e.title}
                <span className="toc-theme">{e.theme}</span>
              </span>
              <span className="toc-dots" aria-hidden="true" />
              <span className="toc-pg">{e.page}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- page list ---------- */

function buildPages(): PageSpec[] {
  const pages: PageSpec[] = [];
  // resolved lazily at render time, once the full list exists
  const chapterPage = (id: string) => pages.findIndex((p) => p.tocKey === id) + 1;
  const add = (p: PageSpec) => pages.push(p);

  add({
    key: 'cover',
    folio: false,
    render: () => (
      <div className="cover">
        <div className="cover-photo">
          <Img photo={book.coverPhoto} />
        </div>
        <div className="cover-text">
          <p className="kicker">A Little Collection of Lessons</p>
          <h1 className="cover-title">
            A Collection
            <br />
            <em>of Wisdom</em>
          </h1>
          <p className="cover-sub">{book.subtitle}</p>
          <p className="cover-caption">{book.caption}</p>
        </div>
      </div>
    ),
  });

  add({
    key: 'dedication',
    folio: false,
    render: () => (
      <div className="safe dedication">
        <Sprig className="ded-sprig" leaves={6} />
        <p className="ded-lines">
          {book.dedication.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </p>
        <p className="ded-body">{book.dedication.body}</p>
      </div>
    ),
  });

  add({ key: 'toc', folio: true, render: () => null }); // filled after numbering

  add({
    key: 'opening-photo',
    tocKey: 'opening',
    folio: false,
    render: () => (
      <div className="full-photo">
        <Img photo={opening.photo} />
      </div>
    ),
  });
  add({
    key: 'opening',
    folio: true,
    render: () => (
      <div className="safe flow">
        <p className="kicker">{opening.kicker}</p>
        <h2 className="page-title">{opening.title}</h2>
        <div className="a-body opening-body">
          {opening.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'lead' : undefined}>
              {typeset(p)}
            </p>
          ))}
        </div>
      </div>
    ),
  });

  add({ key: 'map', tocKey: 'map', folio: true, render: () => <WisdomMapPage chapterPage={chapterPage} /> });

  for (const ch of chapters) {
    add({ key: `${ch.id}-opener`, tocKey: ch.id, folio: false, render: () => <ChapterOpener chapter={ch} /> });
    for (const a of ch.articles) {
      add({ key: a.id, folio: true, render: () => <ArticlePage chapter={ch} article={a} /> });
    }
    add({ key: `${ch.id}-quote`, folio: true, render: () => <QuotePage chapter={ch} /> });
  }

  add({
    key: 'explore',
    tocKey: 'explore',
    folio: true,
    render: () => (
      <>
        <div className="band-photo">
          <Img photo={explore.photo} />
        </div>
        <div className="safe flow explore-text">
          <p className="kicker">Curated Listening</p>
          <h2 className="page-title">{explore.title}</h2>
          <p className="a-deck">{explore.deck}</p>
          <div className="a-body">
            {explore.paragraphs.map((p, i) => (
              <p key={i}>{typeset(p)}</p>
            ))}
          </div>
          <p className="fine-note">{explore.disclaimer}</p>
        </div>
      </>
    ),
  });

  videos.forEach((v, i) => {
    const first = i === 0 || videos[i - 1].group !== v.group;
    add({ key: `video-${v.key}`, folio: true, render: () => <VideoPage video={v} first={first} /> });
  });

  add({
    key: 'reflect',
    tocKey: 'reflect',
    folio: true,
    render: () => (
      <div className="safe flow reflect">
        <p className="kicker">Reflection</p>
        <h2 className="page-title">{reflection.title}</h2>
        <p className="a-deck">{reflection.deck}</p>
        <ol className="questions">
          {reflection.questions.map((q, i) => (
            <li key={i}>
              <span className="q-num">{String(i + 1).padStart(2, '0')}</span>
              <p>{q}</p>
              <span className="write-line" aria-hidden="true" />
              <span className="write-line" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    ),
  });

  add({
    key: 'closing',
    tocKey: 'closing',
    folio: true,
    render: () => (
      <div className="safe flow closing">
        <p className="kicker">Closing</p>
        <h2 className="page-title">{closing.title}</h2>
        <p className="a-deck">{closing.deck}</p>
        <div className="a-body">
          {closing.paragraphs.map((p, i) => (
            <p key={i}>{typeset(p)}</p>
          ))}
        </div>
        <p className="signoff">{closing.signoff}</p>
        <div className="closing-photo">
          <Img photo={closing.photo} />
        </div>
      </div>
    ),
  });

  ([1, 2, 3, 4] as const).forEach((part) =>
    add({
      key: `moments-${part}`,
      tocKey: part === 1 ? 'moments' : undefined,
      folio: true,
      render: () => <MomentsPage part={part} />,
    }),
  );

  add({
    key: 'sources',
    folio: true,
    render: () => (
      <div className="safe flow sources">
        <p className="kicker">Editorial Notes</p>
        <h2 className="page-title small">{sources.title}</h2>
        <div className="a-body">
          {sources.paragraphs.map((p, i) => (
            <p key={i}>{typeset(p)}</p>
          ))}
          <p className="disclaimer">{sources.disclaimer}</p>
        </div>
        <p className="label src-label">Sumber Video</p>
        <ul className="src-list">
          {videos.map((v) => (
            <li key={v.key}>
              <span className="src-key">{v.key}</span>
              <span>
                {v.speakers} — {v.channel}
                <br />
                <a href={youtubeUrl(v.id)}>youtu.be/{v.id}</a>
              </span>
            </li>
          ))}
        </ul>
        <p className="fine-note">{sources.photoCredit}</p>
      </div>
    ),
  });

  add({
    key: 'back',
    folio: false,
    render: () => (
      <div className="safe back">
        <svg className="flourish" viewBox="0 0 120 12" aria-hidden="true">
          <path d="M2 6 C 30 6, 40 1, 60 6 C 80 11, 90 6, 118 6" />
          <circle cx="60" cy="6" r="1.6" />
        </svg>
        <p className="back-quote">
          {backCover.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </p>
        <p className="back-title">{RUN_TITLE}</p>
      </div>
    ),
  });

  return pages;
}

interface BookPagesProps {
  /** Wrap each page in a `.leaf` element (used by the flipbook). */
  leaves?: boolean;
}

/** The 40 A5 pages. Shared by the PDF export (print.html) and the flipbook website. */
export function BookPages({ leaves = false }: BookPagesProps) {
  const pages = buildPages();
  const pageOf = (tocKey: string) => pages.findIndex((p) => p.tocKey === tocKey) + 1;
  const tocEntries = [
    { label: '', title: 'A Moment of Sharing', theme: 'Opening', page: pageOf('opening') },
    { label: '', title: 'What We Learned Together', theme: 'Wisdom Map', page: pageOf('map') },
    ...chapters.map((c) => ({ label: c.number, title: c.title, theme: c.theme, page: pageOf(c.id) })),
    { label: '', title: 'A Little More to Explore', theme: 'Pilihan Video', page: pageOf('explore') },
    { label: '', title: 'A Note to Carry Home', theme: 'Penutup', page: pageOf('closing') },
    { label: '', title: 'Moments Together', theme: 'Kenangan', page: pageOf('moments') },
  ];

  return pages.map((p, i) => {
    const n = i + 1;
    const side = n % 2 === 0 ? 'verso' : 'recto';
    const page = (
      <section
        className={`page ${side} page-${p.key}`}
        key={p.key}
        id={`p-${n}`}
        data-page={n}
        data-key={p.key}
        aria-label={`Halaman ${n}`}
      >
        {p.key === 'toc' ? <Toc entries={tocEntries} /> : p.render(n)}
        {p.key === 'opening' && <Sprig className="corner-sprig" leaves={5} />}
        {p.folio && (
          <footer className="folio">
            <span className="folio-n">{n}</span>
            <span className="folio-t">{RUN_TITLE}</span>
          </footer>
        )}
      </section>
    );
    if (!leaves) return page;
    const hard = n === 1 || n === pages.length;
    return (
      <div className={`leaf${hard ? ' leaf-cover' : ''}`} key={p.key} data-density={hard ? 'hard' : 'soft'}>
        {page}
      </div>
    );
  });
}

export const BOOK_PAGE_COUNT = buildPages().length;

/** Table-of-contents targets for the flipbook jump menu. */
export function bookSections(): { title: string; theme: string; page: number }[] {
  const pages = buildPages();
  const pageOf = (k: string) => pages.findIndex((p) => p.tocKey === k) + 1;
  return [
    { title: 'Sampul', theme: '', page: 1 },
    { title: 'Contents', theme: 'Daftar isi', page: 3 },
    { title: 'A Moment of Sharing', theme: 'Opening', page: pageOf('opening') },
    { title: 'What We Learned Together', theme: 'Wisdom Map', page: pageOf('map') },
    ...chapters.map((c) => ({ title: `${c.number} · ${c.title}`, theme: c.theme, page: pageOf(c.id) })),
    { title: 'A Little More to Explore', theme: 'Pilihan Video', page: pageOf('explore') },
    { title: 'A Moment to Reflect', theme: 'Refleksi', page: pageOf('reflect') },
    { title: 'A Note to Carry Home', theme: 'Penutup', page: pageOf('closing') },
    { title: 'Moments Together', theme: 'Kenangan', page: pageOf('moments') },
  ];
}

export function PrintBook() {
  return (
    <main className="book" data-pages={BOOK_PAGE_COUNT}>
      <BookPages />
    </main>
  );
}
