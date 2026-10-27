import { useId, useState } from 'react';
import type { Article, Chapter, Practical } from '../content/book';
import { typeset } from '../lib/typeset';
import { SaveThought } from './SaveThought';
import { Sprig } from './Sprig';

function PracticalBody({ practical }: { practical: Practical }) {
  switch (practical.kind) {
    case 'list':
      return (
        <ol className={`notes-list${practical.numbered ? ' numbered' : ''}`}>
          {practical.items.map((item, i) => (
            <li key={i}>
              {practical.numbered && <span className="n">{String(i + 1).padStart(2, '0')}</span>}
              <span>{typeset(item)}</span>
            </li>
          ))}
        </ol>
      );
    case 'swap':
      return (
        <div className="swap">
          {practical.pairs.map((p, i) => (
            <div className="swap-row" key={i}>
              <p className="swap-instead">
                <span className="tag">Daripada</span>“{p.instead}”
              </p>
              <p className="swap-try">
                <span className="tag">Cobalah</span>“{p.try}”
              </p>
            </div>
          ))}
        </div>
      );
    case 'pockets':
      return (
        <ol className="pockets">
          {practical.items.map((it, i) => (
            <li key={i}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <h4>{it.title}</h4>
              <p>{typeset(it.text)}</p>
            </li>
          ))}
        </ol>
      );
    case 'prompt':
      return <p className="prompt">“{practical.text}”</p>;
  }
}

interface PracticalCardProps {
  practical: Practical;
  defaultOpen: boolean;
}

function PracticalCard({ practical, defaultOpen }: PracticalCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={`practical-card${open ? ' is-open' : ''}`}>
      <h4 className="practical-head">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          <span className="practical-label">{practical.label}</span>
          <span className="chev" aria-hidden="true" />
        </button>
      </h4>
      <div id={id} className="practical-body" hidden={!open}>
        <PracticalBody practical={practical} />
      </div>
    </div>
  );
}

function ArticleModule({ article, index, isFirstPractical }: { article: Article; index: number; isFirstPractical: boolean }) {
  const after = article.practicalAfter ?? article.paragraphs.length;
  return (
    <article className="article reveal" aria-labelledby={`${article.id}-title`}>
      <header className="article-head">
        <p className="eyebrow">
          <span className="idx">{String(index + 1).padStart(2, '0')}</span> {article.runningHead}
        </p>
        <h3 id={`${article.id}-title`}>{article.title}</h3>
        <p className="deck">{article.deck}</p>
      </header>
      <div className="article-body">
        {article.paragraphs.slice(0, after).map((p, i) => (
          <p key={i}>{typeset(p)}</p>
        ))}
        {article.practical && <PracticalCard practical={article.practical} defaultOpen={isFirstPractical} />}
        {article.paragraphs.slice(after).map((p, i) => (
          <p key={`b${i}`}>{typeset(p)}</p>
        ))}
        {article.note && (
          <aside className="reminder">
            <p className="reminder-label">{article.note.label}</p>
            <p className="reminder-text">{typeset(article.note.text)}</p>
            <SaveThought text={article.note.text} />
          </aside>
        )}
      </div>
    </article>
  );
}

interface ChapterSectionProps {
  chapter: Chapter;
  index: number;
  total: number;
}

export function ChapterSection({ chapter, index, total }: ChapterSectionProps) {
  const firstPracticalId = chapter.articles.find((a) => a.practical)?.id;
  const q = chapter.closingQuote;
  return (
    <section id={chapter.id} className="chapter" aria-labelledby={`${chapter.id}-h`}>
      <div className={`chapter-opener reveal${index % 2 ? ' flip' : ''}`}>
        <figure className="opener-figure">
          <img
            src={chapter.opener.src}
            alt={chapter.opener.alt}
            loading="lazy"
            width={960}
            height={640}
            style={{ objectPosition: chapter.opener.focus }}
          />
        </figure>
        <div className="opener-copy">
          <p className="chapter-count">
            <span>{chapter.number}</span>/{String(total).padStart(2, '0')} · {chapter.label}
          </p>
          <h2 id={`${chapter.id}-h`}>{chapter.title}</h2>
          <p className="chapter-theme">{chapter.theme}</p>
          <blockquote className="opener-quote">
            <p>{typeset(chapter.openerQuote)}</p>
          </blockquote>
        </div>
      </div>

      <div className="articles">
        {chapter.articles.map((a, i) => (
          <ArticleModule key={a.id} article={a} index={i} isFirstPractical={a.id === firstPracticalId} />
        ))}
      </div>

      <figure className={`quote-moment reveal${q.body ? ' proverb' : ''}`}>
        <img className="quote-photo" src={q.photo.src} alt="" loading="lazy" width={600} height={760} />
        <Sprig className="quote-sprig" leaves={6} />
        <div className="quote-copy">
          <blockquote>
            <p>{typeset(q.text)}</p>
          </blockquote>
          {q.body && <p className="quote-body">{typeset(q.body)}</p>}
          <figcaption>{q.tagline}</figcaption>
          <SaveThought text={q.text} />
        </div>
      </figure>
    </section>
  );
}
