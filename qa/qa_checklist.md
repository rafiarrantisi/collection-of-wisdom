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

## Website (flipbook)

Results from `node scripts/site-screenshots.mjs` against the production build (Chrome 155).

| Check | Result |
|---|---|
| `npm run build` (tsc + vite) | PASS |
| Console errors | PASS — none |
| No page scroll / book fits viewport at 320×640, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080 | PASS — portrait (single page) below 560 px wide, two-page spread above |
| Exactly one `h1` (the cover title) | PASS |
| Open the cover with → key | PASS — Sampul → Halaman 2–3 |
| Contents page link (chapter 03) | PASS — lands on 16–17 |
| Wisdom-map node link (chapter 02) | PASS — lands on 10–11 |
| Drag the page corner (real page curl) | PASS — 10–11 → 12–13 (screenshot `desktop-mid-flip.png`) |
| “Daftar isi” panel jumps | PASS — to map (6–7) and videos (29 → 30–31) |
| Video links in pages | PASS — all 7 IDs present, `target=_blank rel=noopener noreferrer`; clicking a title opened YouTube and did not turn the page |
| Zoom (“Perbesar”) | PASS — shows both pages of the spread, closes with Esc; on a 390 px phone body text renders at 15.6 px |
| Back cover closes the book | PASS — End key → “Sampul belakang” |
| Shareable page links | PASS — `#p-24` while open → 24–25; fresh visit to `#p-17` → 16–17 |
| Mobile (touch, 390×844) | PASS — next button → 2 → 3; tapping the contents row → 7; contents panel → 30 |
| `prefers-reduced-motion` | PASS — pages still turn, instantly |
| PDF download | PASS — 200, application/pdf, 2 868 271 bytes |
| Screenshots | `qa/screenshots/` desktop-cover, desktop-spread-dedication-contents, desktop-chapter03, desktop-map, desktop-mid-flip, desktop-contents-panel, desktop-videos, desktop-zoom, desktop-back-cover, tablet-cover, mobile-cover, mobile-contents, mobile-chapter01, mobile-contents-panel, mobile-video, mobile-zoom |

Bug found and fixed in this loop: with `disableFlipByClick` on, the page-flip engine silently ignored
`flipNext()` in portrait mode (phones could not turn pages from the buttons). Tapping a page now turns it, as in a real book;
links are excluded from flipping.

## Not done / limitations

- **Lighthouse was not run** (not installed here); no score is claimed.
- Cross-browser: only Chromium (Chrome 155) was tested; Safari/Firefox and a real phone were not tested
  (touch was emulated). Swipe gestures were not automated — taps, buttons and mouse drag were.
- On phones a full A5 page is ~366 px wide, so body text in the book view is small by nature; the “Perbesar”
  view is the intended way to read comfortably.
- QR codes were verified by decoding the rendered PDF, not by scanning a physical print.
- No separate print-ready file with 3 mm bleed/crop marks was produced. The PDF is a standard A5 digital/print
  file; full-bleed photo pages have no bleed, so a commercial printer would need a bleed version.
- Photo resolution (960–1536 px CC0 originals) gives ~165 dpi on full-bleed pages — fine for screen and home printing,
  below ideal for offset printing (see `assets/asset-manifest.md`).
