import { useState } from 'react';
import { chapters, wisdomMap } from '../content/book';
import { scrollToId } from '../lib/hooks';

const POSITIONS = ['tl', 'tr', 'bl', 'br'] as const;

/** Four themes around one shared centre. Each node is a real button that opens its chapter. */
export function WisdomMap() {
  const [selected, setSelected] = useState<string | null>(null);

  const open = (id: string) => {
    setSelected(id);
    scrollToId(id);
  };

  return (
    <section id="peta" className="map-section" aria-labelledby="peta-h">
      <div className="section-head reveal">
        <p className="eyebrow">Wisdom Map</p>
        <h2 id="peta-h">{wisdomMap.title}</h2>
        <p className="deck">{wisdomMap.deck}</p>
      </div>

      <div className="wmap reveal">
        <svg className="wmap-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {POSITIONS.map((pos) => (
            <path
              key={pos}
              className={`wl wl-${pos}`}
              d={
                {
                  tl: 'M250 130 C 330 200, 380 250, 430 262',
                  tr: 'M750 130 C 670 200, 620 250, 570 262',
                  bl: 'M250 430 C 330 360, 380 310, 430 298',
                  br: 'M750 430 C 670 360, 620 310, 570 298',
                }[pos]
              }
            />
          ))}
          <ellipse cx="500" cy="280" rx="150" ry="150" className="wl-halo" />
        </svg>

        <div className="wmap-center" aria-hidden="true">
          <span className="c-en">{wisdomMap.centerWeb}</span>
          <span className="c-id">{wisdomMap.center}</span>
        </div>

        <ul className="wmap-nodes">
          {chapters.map((c, i) => (
            <li key={c.id} className={`wnode ${POSITIONS[i]}`}>
              <button
                type="button"
                aria-pressed={selected === c.id}
                aria-label={`${c.mapTitle}: ${c.mapSummary}. Buka bab ${c.number}, ${c.title}`}
                onClick={() => open(c.id)}
                onMouseEnter={() => setSelected(c.id)}
                onFocus={() => setSelected(c.id)}
              >
                <span className="wnode-num">{c.number}</span>
                <span className="wnode-text">
                  <span className="wnode-title">{c.mapTitle}</span>
                  <span className="wnode-sum">{c.mapSummary}</span>
                  <span className="wnode-go">
                    {c.title} <span aria-hidden="true">→</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="map-note">Peta tema, bukan pemeringkatan atau hasil survei kuantitatif. {wisdomMap.footnote}</p>
    </section>
  );
}
