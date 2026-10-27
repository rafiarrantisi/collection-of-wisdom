import { useId, useState } from 'react';
import { explore } from '../content/book';
import { categoryLabels, thumbPath, videos, youtubeUrl, type Video, type VideoCategory } from '../content/videos';

type Filter = 'semua' | VideoCategory;

const FILTERS: Filter[] = ['semua', 'keuangan', 'pernikahan', 'komunikasi', 'refleksi'];

function VideoCard({ video }: { video: Video }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const url = youtubeUrl(video.id);
  return (
    <li className="vcard">
      <a className="vthumb" href={url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
        <img src={thumbPath(video.id)} alt="" loading="lazy" width={1280} height={720} />
      </a>
      <div className="vbody">
        <p className="vmeta">
          <span className="vcat">{categoryLabels[video.category]}</span>
          <span>{video.channel}</span>
        </p>
        <h3 className="vtitle">{video.title}</h3>
        <p className="vspeak">Bersama {video.speakers}</p>
        <p className="vsyn">{video.synopsis}</p>
        <div className="vactions">
          <a className="btn btn-solid" href={url} target="_blank" rel="noopener noreferrer">
            Tonton di YouTube<span className="sr-only"> (membuka tab baru): {video.title}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M6 3h7v7M13 3 4 12" />
            </svg>
          </a>
          <button type="button" className="btn btn-quiet" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
            What you’ll learn
          </button>
        </div>
        <div id={id} className="vlearn" hidden={!open}>
          <ul>
            {video.learn.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function VideoSection() {
  const [filter, setFilter] = useState<Filter>('semua');
  const shown = videos.filter((v) => filter === 'semua' || v.category === filter);
  return (
    <section id="video" className="video-section" aria-labelledby="video-h">
      <div className="explore-head reveal">
        <div>
          <p className="eyebrow">Curated Listening</p>
          <h2 id="video-h">{explore.title}</h2>
          <p className="deck">{explore.deck}</p>
        </div>
        <div className="explore-intro">
          {explore.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <div className="chips" role="group" aria-label="Saring video berdasarkan topik">
        {FILTERS.map((f) => (
          <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === 'semua' ? 'Semua' : categoryLabels[f]}
            <span className="chip-count">{f === 'semua' ? videos.length : videos.filter((v) => v.category === f).length}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Menampilkan {shown.length} video
      </p>

      <ul className="vgrid">
        {shown.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </ul>

      <p className="explore-closing reveal">{explore.closingLine}</p>
      <p className="fine">{explore.disclaimer}</p>
    </section>
  );
}
