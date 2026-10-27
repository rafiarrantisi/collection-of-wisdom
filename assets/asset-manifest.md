# Asset manifest

All photographs are **CC0 / public domain**, found through the official
[Openverse API](https://api.openverse.org/) (license filter `cc0,pdm`), downloaded once
and stored locally under `public/assets/photos/`. Nothing is hotlinked at runtime.
None of the photos depict the Mayon community, its members, Persit insignia or any real event;
they are generic still-life / lifestyle images used for atmosphere only.

A gentle colour grade (saturation ×0.82, slight warm shift; ×0.45 for `journal-hands`) was
baked into the files so the PDF can embed the original JPEG stream without re-rasterising.

| File | Used for | Source page | Creator | License |
|---|---|---|---|---|
| cover-tea-light.jpg | Cover, web hero | https://stocksnap.io/photo/breakfast-morning-OO9TKTW8FJ | Carli Jeen | CC0 |
| sharing-cup-book.jpg | A Moment of Sharing | https://stocksnap.io/photo/girl-young-TJITMPYYW8 | Anthony Tran | CC0 |
| window-flowers.jpg | Ch. 01 opener | https://stocksnap.io/photo/white-window-LMUGL3LQ7X | Nathan Fertig | CC0 |
| babys-breath.jpg | Ch. 01 quote | https://www.rawpixel.com/image/3303122 | rawpixel (public domain collection) | CC0 |
| hands-together.jpg | Ch. 02 opener | https://www.rawpixel.com/image/5926350 | rawpixel (public domain collection) | CC0 |
| cup-window-distance.jpg | Ch. 02 quote | https://stocksnap.io/photo/coffee-tea-4VHE7E68OE | Lia Leslie | CC0 |
| journal-hands.jpg | Ch. 03 opener | https://stocksnap.io/photo/writing-hand-J74OWTFVLP | Kristin Hardwick | CC0 |
| book-golden-flower.jpg | Ch. 03 quote | https://www.rawpixel.com/image/5914347 | rawpixel (public domain collection) | CC0 |
| dried-flowers-olive.jpg | Ch. 04 opener | https://www.rawpixel.com/image/5925852 | rawpixel (public domain collection) | CC0 |
| vase-dried-flowers.jpg | Ch. 04 quote | https://wordpress.org/photos/photo/4016a0c06d/ | Tilak Bahadur Karki | CC0 |
| book-coffee-soft.jpg | A Little More to Explore | https://stocksnap.io/photo/coffee-cozy-SC7APHV0JX | Beauty and Fashion | CC0 |
| soft-dried-grass.jpg | Closing, download panel | https://www.rawpixel.com/image/3371142 | rawpixel (public domain collection) | CC0 |

**Resolution note.** The CC0 files available through the API are 960–1536 px wide. Placed sizes give
roughly 165–330 effective dpi in the A5 PDF (full-bleed photo pages are at the low end, ~165 dpi).
That is fine on screen and on an office/home printer; for offset printing, replace those files with
higher-resolution originals from the same source pages.

## YouTube thumbnails

`public/assets/thumbs/<videoId>.jpg` — downloaded from `https://i.ytimg.com/vi/<id>/maxresdefault.jpg`
(all seven returned 1280×720, i.e. real custom thumbnails, not the grey placeholder). They belong to their
channels and are used only on each episode's own reference card, next to its title and link.
No fallback cover was needed.

Titles and channel names were checked with YouTube oEmbed on 2026-10-27. Two differ from the brief and the
**live YouTube values were used**:

- `kf3f-l2n4-k` — live title is “#momscorner 15 Ust. Felix Siaw | Menikah adalah IBADAH Seumur Hidup”, published on
  the **Nikita Willy Official** channel (the show is Moms Corner). The brief listed “#156 … (#momscorner) — Moms Corner”.
- `AVKtZwYAD9g` — channel is **Raditya Dika**; speaker Prita Hapsari Ghozie.

## Fonts

- Cormorant Garamond — Christian Thalmann, SIL Open Font License 1.1 (via `@fontsource/cormorant-garamond`)
- DM Sans — Colophon Foundry / Google, SIL Open Font License 1.1 (via `@fontsource/dm-sans`)

Both are self-hosted from `node_modules` and embedded (subset) in the PDF.

## Generated artwork

- `public/assets/grain.png` — procedurally generated noise tile (no third-party source).
- Botanical sprigs, map connectors, flourish, QR codes — vector SVG generated in code (`src/components/Sprig.tsx`, `src/lib/qr.ts`).
