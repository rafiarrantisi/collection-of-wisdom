// Regenerates content/video-catalog.json and content/editorial-manuscript.md
// from the single sources of truth in src/content/*.ts.
import { writeFileSync } from 'node:fs';
import { videos, youtubeUrl } from '../src/content/videos.ts';
import { book, chapters, closing, explore, opening, reflection, sources, wisdomMap, backCover } from '../src/content/book.ts';

const out = (rel, text) => writeFileSync(new URL(`../content/${rel}`, import.meta.url), text);

out(
  'video-catalog.json',
  JSON.stringify(
    {
      note: 'Generated from src/content/videos.ts — edit there, then run `npm run content`.',
      count: videos.length,
      videos: videos.map((v) => ({ ...v, url: youtubeUrl(v.id), thumbnail: `public/assets/thumbs/${v.id}.jpg` })),
    },
    null,
    2,
  ) + '\n',
);

const md = [];
const p = (...lines) => md.push(...lines, '');
const practical = (pr) => {
  if (!pr) return;
  p(`**${pr.label}**`);
  if (pr.kind === 'list') pr.items.forEach((it, i) => md.push(pr.numbered ? `${i + 1}. ${it}` : `- ${it}`));
  if (pr.kind === 'swap') pr.pairs.forEach((x) => md.push(`- Daripada: “${x.instead}”`, `  Cobalah: “${x.try}”`));
  if (pr.kind === 'pockets') pr.items.forEach((x, i) => md.push(`${i + 1}. **${x.title}** — ${x.text}`));
  if (pr.kind === 'prompt') md.push(`> “${pr.text}”`);
  md.push('');
};

p('# A Collection of Wisdom', `_${book.subtitle}_`, book.caption, '> Generated from `src/content/book.ts`. Edit the TypeScript source, then run `npm run content`.');
p('## Dedication', ...book.dedication.lines.map((l) => `_${l}_  `), book.dedication.body);
p(`## ${opening.kicker}`, `### ${opening.title}`, ...opening.paragraphs.flatMap((x) => [x, '']));
p(`## ${wisdomMap.title}`, `_${wisdomMap.deck}_`, `**Pusat:** ${wisdomMap.center}`);
chapters.forEach((c) => md.push(`- **${c.number} ${c.mapTitle}** — ${c.mapSummary}`));
p('', `_${wisdomMap.footnote}_`);
for (const c of chapters) {
  p(`## ${c.number} / ${c.label} — ${c.title}`, `_${c.theme}_`, `> ${c.openerQuote}`);
  for (const a of c.articles) {
    p(`### ${a.title}`, `_${a.deck}_ · ${a.runningHead}`);
    const after = a.practicalAfter ?? a.paragraphs.length;
    a.paragraphs.slice(0, after).forEach((x) => p(x));
    practical(a.practical);
    a.paragraphs.slice(after).forEach((x) => p(x));
    if (a.note) p(`**${a.note.label}:** _${a.note.text}_`);
  }
  p(`> ${c.closingQuote.text}`, ...(c.closingQuote.body ? [c.closingQuote.body, ''] : []), `_${c.closingQuote.tagline}_`);
}
p(`## ${explore.title}`, `_${explore.deck}_`, ...explore.paragraphs.flatMap((x) => [x, '']), `_${explore.disclaimer}_`);
for (const v of videos) {
  p(`### Video ${v.key} · ${v.group}`, `**${v.title}**  `, `${v.channel} — bersama ${v.speakers}  `, youtubeUrl(v.id));
  v.takeaways.forEach((t) => md.push(`- ${t}`));
  md.push('');
}
p(`> ${explore.closingLine}`);
p(`## ${reflection.title}`, `_${reflection.deck}_`, ...reflection.questions.map((q, i) => `${i + 1}. ${q}`));
p(`## ${closing.title}`, `_${closing.deck}_`, ...closing.paragraphs.flatMap((x) => [x, '']), `_${closing.signoff}_`);
p(`## ${sources.title}`, ...sources.paragraphs, '', sources.disclaimer, '', sources.photoCredit);
p('## Back cover', ...backCover.lines.map((l) => `_${l}_  `));
out('editorial-manuscript.md', md.join('\n'));
console.log(`content: ${videos.length} videos, ${chapters.length} chapters`);
