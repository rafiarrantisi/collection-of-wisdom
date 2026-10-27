// Flipbook website QA: serves the production build, exercises page turning
// (buttons, keyboard, drag, in-page links, contents panel, zoom) on desktop and mobile,
// checks overflow / console errors / links / PDF download, and saves screenshots.
// Writes qa/screenshots/*.png and qa/site_qc.json. Run after `npm run pdf`.
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from 'playwright-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const shots = resolve(root, 'qa', 'screenshots');
mkdirSync(shots, { recursive: true });
for (const f of readdirSync(shots)) unlinkSync(resolve(shots, f));

const VIDEO_IDS = ['jGc668FpPRQ', 'AVKtZwYAD9g', 'SgK0Okc0M2k', 'eV497nxN8W4', 'kf3f-l2n4-k', 'ulTiWbGB24E', 'VSkAS9x-23E'];
const server = await preview({ root, preview: { port: 4180, strictPort: true }, logLevel: 'warn' });
const base = 'http://localhost:4180/';
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
const report = { widths: {}, desktop: {}, mobile: {}, errors: [], blocking: [] };
const fail = (m) => report.blocking.push(m);

async function open(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && report.errors.push(`[${viewport.width}] ${m.text()}`));
  page.on('pageerror', (e) => report.errors.push(`[${viewport.width}] ${e}`));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('.reader.is-ready');
  await page.waitForTimeout(500);
  return { ctx, page };
}

const where = (page) => page.textContent('.where > p:first-child').then((t) => t.replace(/\s+/g, ' ').trim());
const settle = (page, ms = 1300) => page.waitForTimeout(ms);
const shot = (page, name) => page.screenshot({ path: resolve(shots, `${name}.png`) });

try {
  // ---------- responsive sanity ----------
  for (const [w, h] of [[320, 640], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]]) {
    const { ctx, page } = await open({ width: w, height: h });
    const r = await page.evaluate(() => {
      const d = document.documentElement;
      const book = document.querySelector('.flip-book').getBoundingClientRect();
      const leaf = document.querySelector('.leaf');
      const stage = document.querySelector('.stage');
      return {
        scrollWidth: d.scrollWidth,
        scrollHeight: d.scrollHeight,
        clientWidth: d.clientWidth,
        clientHeight: d.clientHeight,
        mode: stage.classList.contains('portrait') ? 'portrait' : 'landscape',
        pageWidthPx: Math.round(leaf.getBoundingClientRect().width),
        bookFits: book.bottom <= window.innerHeight && book.right <= window.innerWidth + 1,
        h1: document.querySelectorAll('h1').length,
        brokenImgs: [...document.images].filter((i) => i.complete && !i.naturalWidth).length,
      };
    });
    report.widths[w] = r;
    if (r.scrollWidth > r.clientWidth || r.scrollHeight > r.clientHeight) fail(`${w}px: page scrolls (${r.scrollWidth}x${r.scrollHeight})`);
    if (!r.bookFits) fail(`${w}px: book does not fit viewport`);
    if (r.brokenImgs) fail(`${w}px: ${r.brokenImgs} broken images`);
    if (r.h1 !== 1) fail(`${w}px: expected one h1`);
    if (w === 1440) await shot(page, 'desktop-cover');
    if (w === 768) await shot(page, 'tablet-cover');
    await ctx.close();
  }

  // ---------- desktop interactions ----------
  {
    const { ctx, page } = await open({ width: 1440, height: 900 });
    const d = report.desktop;
    d.start = await where(page);
    await page.keyboard.press('ArrowRight');
    await settle(page);
    d.afterArrow = await where(page);
    await shot(page, 'desktop-spread-dedication-contents');

    // contents page link -> chapter 03 opener (p17)
    await page.click('.flip-book a.toc-row[href="#p-17"]');
    await settle(page);
    d.afterTocLink = await where(page);
    await shot(page, 'desktop-chapter03');

    // wisdom map node link (p6) -> chapter 02 (p11)
    await page.click('.bar-actions .tool:has-text("Daftar isi")');
    await page.click('.toc-panel button:has-text("What We Learned Together")');
    await settle(page);
    d.atMap = await where(page);
    await shot(page, 'desktop-map');
    await page.click('.flip-book a.map-node[href="#p-11"]');
    await settle(page);
    d.afterMapLink = await where(page);

    // drag the right page corner to the left = real page turn
    const box = await page.locator('.flip-book').boundingBox();
    const y = box.y + box.height - 30;
    await page.mouse.move(box.x + box.width - 8, y);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) await page.mouse.move(box.x + box.width - 8 - (i * box.width) / 14, y - i * 4);
    await page.screenshot({ path: resolve(shots, 'desktop-mid-flip.png') });
    await page.mouse.up();
    await settle(page);
    d.afterDrag = await where(page);

    // contents panel -> videos
    await page.click('.bar-actions .tool:has-text("Daftar isi")');
    await shot(page, 'desktop-contents-panel');
    await page.click('.toc-panel button:has-text("A Little More to Explore")');
    await settle(page);
    await page.keyboard.press('ArrowRight');
    await settle(page);
    d.atVideos = await where(page);
    await shot(page, 'desktop-videos');

    d.videoLinks = await page.$$eval('.flip-book a[href^="https://youtu.be/"]', (as) => as.map((a) => ({ href: a.href, target: a.target, rel: a.rel })));
    for (const id of VIDEO_IDS) if (!d.videoLinks.some((l) => l.href === `https://youtu.be/${id}`)) fail(`missing video link ${id}`);
    if (d.videoLinks.some((l) => l.target !== '_blank' || !l.rel.includes('noopener'))) fail('video link without target/rel');

    // clicking a video title opens YouTube in a new tab (and does not flip the page)
    const before = await where(page);
    const [popup] = await Promise.all([
      ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null),
      page.click('.flip-book .page[data-page="31"] .video-title a', { noWaitAfter: true }).catch(() => null),
    ]);
    d.videoClickOpened = popup ? popup.url() : null;
    if (popup) await popup.close();
    d.videoClickSamePage = (await where(page)) === before;
    if (!d.videoClickOpened || !d.videoClickOpened.includes('youtu')) fail('clicking a video title did not open YouTube');

    // zoom view
    await page.click('.bar-actions .tool:has-text("Perbesar")');
    await page.waitForTimeout(400);
    await shot(page, 'desktop-zoom');
    d.zoomPages = await page.$$eval('.zoom-frame', (f) => f.length);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    d.zoomClosed = (await page.$('.zoom')) === null;

    // end of book: back cover closes the book
    await page.keyboard.press('End');
    await settle(page, 1600);
    d.atEnd = await where(page);
    await shot(page, 'desktop-back-cover');

    // deep link
    await page.goto(`${base}#p-24`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.reader.is-ready');
    await settle(page, 1600);
    d.deepLink24 = await where(page);
    // a fresh visit straight to a shared page link
    const fresh = await ctx.newPage();
    await fresh.goto(`${base}#p-17`, { waitUntil: 'networkidle' });
    await fresh.waitForSelector('.reader.is-ready');
    d.freshLink17 = await where(fresh);
    if (!d.freshLink17.startsWith('Halaman 16–17')) fail(`fresh deep link: got "${d.freshLink17}"`);
    await fresh.close();

    const href = await page.$eval('.tool-pdf', (a) => a.href);
    const resp = await page.request.get(href);
    d.pdf = { href, status: resp.status(), bytes: (await resp.body()).length, type: resp.headers()['content-type'] };
    if (resp.status() !== 200 || d.pdf.bytes < 100000) fail('PDF download not served');

    const expect = [
      [d.start, 'Sampul'],
      [d.afterArrow, 'Halaman 2–3'],
      [d.afterTocLink, 'Halaman 16–17'],
      [d.atMap, 'Halaman 6–7'],
      [d.afterMapLink, 'Halaman 10–11'],
      [d.afterDrag, 'Halaman 12–13'],
      [d.atVideos, 'Halaman 30–31'],
      [d.atEnd, 'Sampul belakang'],
      [d.deepLink24, 'Halaman 24–25'],
    ];
    for (const [got, want] of expect) if (!got.startsWith(want)) fail(`desktop: expected "${want}", got "${got}"`);
    if (d.zoomPages !== 2 || !d.zoomClosed) fail('zoom view did not show the spread or did not close');
    await ctx.close();
  }

  // ---------- mobile (touch phone) ----------
  {
    const { ctx, page } = await open({ width: 390, height: 844 }, { hasTouch: true, isMobile: true });
    const m = report.mobile;
    m.start = await where(page);
    await shot(page, 'mobile-cover');
    await page.tap('.bar.bottom .nav-btn[aria-label="Halaman berikutnya"]');
    await settle(page);
    m.afterNext = await where(page);
    await page.tap('.bar.bottom .nav-btn[aria-label="Halaman berikutnya"]');
    await settle(page);
    m.afterNext2 = await where(page);
    await shot(page, 'mobile-contents');
    await page.tap('.flip-book a.toc-row[href="#p-7"]');
    await settle(page);
    m.afterTocTap = await where(page);
    await shot(page, 'mobile-chapter01');
    await page.tap('.bar-actions .tool[aria-controls]');
    await page.waitForTimeout(200);
    await shot(page, 'mobile-contents-panel');
    await page.tap('.toc-panel button:has-text("A Little More to Explore")');
    await settle(page);
    await page.tap('.bar.bottom .nav-btn[aria-label="Halaman berikutnya"]');
    await settle(page);
    m.atVideo = await where(page);
    await shot(page, 'mobile-video');
    await page.tap('.bar-actions .tool:nth-child(2)');
    await page.waitForTimeout(400);
    await shot(page, 'mobile-zoom');
    m.zoomBodyFontPx = await page.$eval('.zoom-frame .video-takeaways li', (el) => {
      const z = parseFloat(getComputedStyle(el.closest('.zoom-body')).getPropertyValue('--z'));
      return Math.round(parseFloat(getComputedStyle(el).fontSize) * z * 10) / 10;
    });
    m.pageWidthPx = report.widths[390].pageWidthPx;
    const expect = [
      [m.start, 'Sampul'],
      [m.afterNext, 'Halaman 2'],
      [m.afterNext2, 'Halaman 3'],
      [m.afterTocTap, 'Halaman 7'],
      [m.atVideo, 'Halaman 30'],
    ];
    for (const [got, want] of expect) if (got.replace(/ \/.*/, '') !== want) fail(`mobile: expected "${want}", got "${got}"`);
    if (m.zoomBodyFontPx < 14) fail(`mobile zoom text only ${m.zoomBodyFontPx}px`);
    await ctx.close();
  }

  // reduced motion still works
  {
    const { ctx, page } = await open({ width: 1280, height: 800 }, { reducedMotion: 'reduce' });
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    report.reducedMotion = await where(page);
    if (!report.reducedMotion.startsWith('Halaman 2–3')) fail('reduced motion: page did not turn');
    await ctx.close();
  }

  if (report.errors.length) fail('console errors present');
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}

writeFileSync(resolve(root, 'qa', 'site_qc.json'), JSON.stringify(report, null, 2));
for (const [w, r] of Object.entries(report.widths)) console.log(`${w}px ${r.mode} page=${r.pageWidthPx}px fits=${r.bookFits}`);
console.log('desktop', JSON.stringify({ ...report.desktop, videoLinks: report.desktop.videoLinks?.length }));
console.log('mobile', JSON.stringify(report.mobile));
console.log('reducedMotion', report.reducedMotion);
report.blocking.forEach((b) => console.log('BLOCKING:', b));
report.errors.forEach((e) => console.log('console:', e));
process.exit(report.blocking.length ? 1 : 0);
