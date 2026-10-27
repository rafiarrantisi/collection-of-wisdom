# A Collection of Wisdom

Little lessons on marriage, family, finances, and the beauty of growing together —
a keepsake gathered from a sharing session of the ibu-ibu **Mayon** community.

Two editions, one identity:

1. **Keepsake PDF** — `A_Collection_of_Wisdom.pdf` (also `public/A_Collection_of_Wisdom.pdf`).
   A5 portrait, 40 pages, real selectable text, embedded fonts, clickable links and a scannable QR code for each of the
   seven curated videos.
2. **Interactive web edition** — a static React site: editorial hero, the opening story, an interactive wisdom map,
   all four chapters with expandable practical notes and copyable quotes, seven video cards with topic filters,
   a private reflection space, the closing letter and a PDF download.

Both are rendered from the **same content files**, so wording never drifts between them.

## Quick start

```bash
npm install
npm run dev       # local site at http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/ locally
```

The PDF export and QA need Google Chrome installed (used through `playwright-core`) and, for QA, Python 3 with
`pymupdf`, `opencv-python-headless`, `numpy` and `pillow`.

```bash
npm run pdf       # regenerate content/*.json|md, build, export the PDF, copy it to public/ and dist/
npm run qa        # PDF checks + contact sheet, then website screenshots and interaction checks
```

`npm run pdf` exits non-zero if any image is missing or any text frame overflows its page.

## Editing

| What | Where |
|---|---|
| Book text (chapters, quotes, tips, opening, closing) | `src/content/book.ts` |
| The seven videos (IDs, titles, takeaways, categories) | `src/content/videos.ts` — the only place URLs live |
| Colours and type families (both editions) | `src/styles/tokens.css` |
| Print layout (A5 page templates) | `src/print/PrintBook.tsx`, `src/print/print.css` |
| Website layout | `src/App.tsx`, `src/components/*`, `src/styles/site.css` |

After editing content run `npm run pdf` (it also refreshes `content/editorial-manuscript.md` and
`content/video-catalog.json`), then `npm run qa`, and commit the new PDF.

## Deploying the site

It is a plain static build with relative paths (`base: './'`), so `dist/` works on any static host:

- **Vercel / Netlify**: build command `npm run build`, output directory `dist`.
  The committed `public/A_Collection_of_Wisdom.pdf` is copied into the build automatically.
- **GitHub Pages**: publish the contents of `dist/`.

No backend, accounts, analytics or API keys. The only outbound requests a reader makes are the YouTube links they click.
Nothing has been deployed yet — there is no live URL.

## Project map

```
src/content/        book.ts, videos.ts      shared manuscript + video catalog
src/print/          A5 print book (print.html entry)
src/components/     web sections (WisdomMap, ChapterSection, VideoSection, …)
src/styles/         tokens.css, site.css, fonts.ts
public/assets/      photos (CC0), YouTube thumbnails, paper grain
scripts/            export-content.mjs, export-pdf.mjs, pdf_qa.py, site-screenshots.mjs
content/            editorial-manuscript.md, video-catalog.json   (generated)
assets/             asset-manifest.md   (image sources & licences)
qa/                 qa_checklist.md, pdf_qc.json, site_qc.json, contact_sheet.png, screenshots/
```

## Licences

- Photos: CC0 / public domain — sources per file in [`assets/asset-manifest.md`](assets/asset-manifest.md).
- YouTube thumbnails and titles belong to their channels; shown only on each episode's reference card.
  This book is not affiliated with or sponsored by any channel or speaker.
- Fonts: Cormorant Garamond and DM Sans, SIL Open Font License 1.1.

## Editorial notes

The reflective quotes are original synthesis, not attributed quotations. Advice on marriage, money and organisational
life is general reflection — not professional counselling, financial advice, or official Persit guidance.
Names that appeared in the handwritten notes are intentionally left out to avoid misattribution.

## Known limitations

See [`qa/qa_checklist.md`](qa/qa_checklist.md): Lighthouse not run, Chromium-only testing, no bleed/crop print master,
and the CC0 photos are below offset-print resolution on full-bleed pages.
