# QA checklist — A Collection of Wisdom

Run on 2026-10-27, Windows 11, Node 24.13, Chrome 155 (via playwright-core), PyMuPDF 1.26.7, OpenCV 4 QR detector.
Every line below reflects an actual run (`npm run pdf`, `python scripts/pdf_qa.py`, `node scripts/site-screenshots.mjs`).
Machine-readable results: `qa/pdf_qc.json`, `qa/site_qc.json`.

## PDF

| Check | Result |
|---|---|
| File exists, opens, not encrypted | PASS — `A_Collection_of_Wisdom.pdf`, 2.87 MB |
| Page count multiple of 4 | PASS — 40 pages (36 proposed + 4 to give each of the 7 videos its own page) |
| Every page A5 | PASS — 148.0 × 210.0 mm on all 40 pages |
| Real, extractable text; no replacement glyphs | PASS — all pages, curly quotes / em dashes / `&` / `·` extract correctly |
| Fonts embedded | PASS — 7 subset Type0 fonts (Cormorant Garamond Light/Regular/Italic/Medium, DM Sans Regular/Italic/Medium), no Type3 |
| Text inside safe area (≥ 9 mm from trim incl. folio; body ≥ 15 mm) | PASS — automated span check on all pages + in-browser check before export |
| No overflowing text frames | PASS — export script measures every `.flow` frame; fails the build on overflow |
| No text/text collisions | PASS — line-level overlap check on all pages |
| No text over photos / QR | PASS — line vs image-box check on all pages |
| Body size | PASS — body 10.8 pt (DM Sans, leading 1.5); labels/metadata 8.5–9.6 pt only |
| 7 clickable video links | PASS — 48 link annotations; each of the 7 `https://youtu.be/<id>` present |
| 7 unique QR codes decode to exact URLs | PASS — OpenCV decoded all 7 at 300 dpi; each equals its expected URL; QR is 27 mm incl. quiet zone |
| Thumbnails real (not placeholder) | PASS — all 7 are 1280×720 maxres thumbnails |
| Contact sheet of every page | PASS — `qa/contact_sheet.png` (40 pages, 180 dpi renders) |
| Visual reading check | PASS — every page viewed as rendered spreads; individually re-checked after fixes: 3, 5, 6, 10, 19, 20, 29–36, 37, 38, 39 |
| Content guardrails | PASS — no “Mayor”, no personal names from the notes, no gender-neuroscience numbers, no survey statistics; 30% / 10% labelled as general guidance; “Rame ing gawe, sepi ing pamrih” unattributed |

Issues found and fixed during the loop (not hidden):
overflow on p5/p19/p36/p37 (re-spaced, video thumbnail narrowed, write-lines reduced); TOC accidentally right-aligned (CSS class collision);
map connector crossed a label; orphaned word in a tagline; “hari-/hari” broken across lines (reduplicated words now never break);
QR link label 1 mm past right margin; photos re-rasterised by CSS filters (10.7 MB → 2.9 MB after baking the grade into the JPEGs).

## Website

| Check | Result |
|---|---|
| `npm run build` (tsc + vite) | PASS |
| Console errors in main flows | PASS — none at any width |
| Horizontal overflow at 320 / 375 / 390 / 430 / 768 / 1024 / 1440 px | PASS — scrollWidth = clientWidth at every width |
| Tap targets ≥ 44 px (buttons, chips, nav) | PASS at all widths |
| Mobile nav height | PASS — 6 % of a 900 px viewport |
| Exactly one `h1`, skip link, landmarks | PASS |
| Wisdom map by mouse | PASS — node 02 lands chapter 02 at 76 px (= under sticky nav) |
| Wisdom map by keyboard (Tab + Enter) | PASS — node 04 lands chapter 04 at 76 px |
| Mobile menu jump to a chapter | PASS (after fix: menu sheet was pushing layout and caused a 455 px overshoot) |
| 7 video cards, real thumbnails, correct links, `target=_blank rel=noopener noreferrer` | PASS |
| Topic filters | PASS — Keuangan 2, Pernikahan 2, Komunikasi 2, Refleksi 1, Semua 7 |
| “Simpan kutipan” copy | PASS — clipboard contains the quote |
| PDF download in production build | PASS — `A_Collection_of_Wisdom.pdf` served 200, 2 866 113 bytes |
| `prefers-reduced-motion` | PASS — no content hidden, animations off |
| Screenshots | `qa/screenshots/` desktop-home, desktop-map, desktop-chapter, desktop-videos, tablet-home, mobile-home, mobile-map, mobile-chapter, mobile-videos, mobile-menu, mobile-closing |

## Not done / limitations

- **Lighthouse was not run** (not installed here); no score is claimed.
- Cross-browser: only Chromium (Chrome 155) was tested; Safari/Firefox not tested.
- QR codes were verified by decoding the rendered PDF, not by scanning a physical print.
- No separate print-ready file with 3 mm bleed/crop marks was produced. The PDF is a standard A5 digital/print
  file; full-bleed photo pages have no bleed, so a commercial printer would need a bleed version.
- Photo resolution (960–1536 px CC0 originals) gives ~165 dpi on full-bleed pages — fine for screen and home printing,
  below ideal for offset printing (see `assets/asset-manifest.md`).
