# A Collection of Wisdom

Little lessons on marriage, family, finances, and the beauty of growing together —
a keepsake gathered from a sharing session of the ibu-ibu **Mayon** community.

Two editions, one identity:

1. **Keepsake PDF** — `A_Collection_of_Wisdom.pdf` (also `public/A_Collection_of_Wisdom.pdf`).
   A5 portrait, 44 pages, real selectable text, embedded fonts, clickable links and a scannable QR code for each of the
   seven curated videos.
2. **Flipbook website** — the same 44 pages as a real book you open, page through and close
   (live at https://collection-of-wisdom.vercel.app). Two-page spreads on desktop/tablet, single pages on phones;
   turn pages by tapping, swiping, dragging a corner, the arrow buttons or ← → keys. The contents page and wisdom map
   are clickable, video titles/thumbnails/QR open YouTube, “Daftar isi” jumps to any section, “Perbesar” shows the
   current page(s) at a comfortable reading size, and every page has a shareable link (`…/#p-17`).
   Page turning uses [StPageFlip](https://github.com/Nodlik/StPageFlip) (`page-flip`, MIT).

Both are rendered from the **same content files**, so wording never drifts between them.

## Quick start

```bash
npm install
npm run dev       # local flipbook at http://localhost:5173 (print layout: /print.html)
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
| Flipbook reader (toolbar, zoom, page turning) | `src/book/FlipBook.tsx`, `src/book/ZoomView.tsx`, `src/book/book.css` |

After editing content run `npm run pdf` (it also refreshes `content/editorial-manuscript.md` and
`content/video-catalog.json`), then `npm run qa`, and commit the new PDF.

## Deploying the site

It is a plain static build with relative paths (`base: './'`), so `dist/` works on any static host:

- **Vercel**: already configured in `vercel.json` (build `npm run build`, output `dist`). Pushing to `main` redeploys.
- **Netlify**: build command `npm run build`, output directory `dist`.
  The committed `public/A_Collection_of_Wisdom.pdf` is copied into the build automatically.
- **GitHub Pages**: publish the contents of `dist/`.

No backend, accounts, analytics or API keys. The only outbound requests a reader makes are the YouTube links they click.
Live on Vercel at https://collection-of-wisdom.vercel.app, connected to this repository's `main` branch.

## Project map

```
src/content/        book.ts, videos.ts      shared manuscript + video catalog
src/print/          the 40 A5 pages (BookPages) + print.html entry for the PDF
src/book/           flipbook website (index.html entry) that renders the same BookPages
src/components/     Sprig (botanical line art)
src/styles/         tokens.css, fonts.ts
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
