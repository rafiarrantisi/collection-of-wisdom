// Website QA: serves the production build, screenshots key views, and checks
// overflow, console errors, video links, the PDF download and the wisdom map.
// Writes qa/screenshots/*.png and qa/site_qc.json. Run after `npm run build` + `npm run pdf`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from 'playwright-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const shots = resolve(root, 'qa', 'screenshots');
mkdirSync(shots, { recursive: true });

const server = await preview({ root, preview: { port: 4180, strictPort: true }, logLevel: 'warn' });
const base = 'http://localhost:4180/';
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
const report = { widths: {}, errors: [], videoLinks: [], pdf: null, map: null, blocking: [] };

async function open(width, height = 900, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && report.errors.push(`[${width}] ${m.text()}`));
  page.on('pageerror', (e) => report.errors.push(`[${width}] ${e}`));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page };
}

/** Scroll through so lazy images load and reveal animations settle. */
async function settle(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

try {
  for (const w of [320, 375, 390, 430, 768, 1024, 1440]) {
    const { ctx, page } = await open(w);
    await settle(page);
    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      const wide = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const b = el.getBoundingClientRect();
          return b.width > 0 && (b.right > doc.clientWidth + 1 || b.left < -1) && getComputedStyle(el).position !== 'fixed';
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
      const brokenImgs = [...document.images].filter((i) => i.complete && !i.naturalWidth).map((i) => i.src);
      const small = [...document.querySelectorAll('button, a.btn, .chip, .nav-links a, .nav-toggle')]
        .filter((el) => el.offsetParent)
        .filter((el) => {
          const b = el.getBoundingClientRect();
          return b.height < 43.5 || b.width < 43.5;
        })
        .map((el) => el.textContent.trim().slice(0, 24));
      const navH = document.querySelector('.topnav').getBoundingClientRect().height;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        overflowing: wide,
        brokenImgs,
        smallTargets: small,
        navHeightPct: Math.round((navH / window.innerHeight) * 100),
        h1: document.querySelectorAll('h1').length,
      };
    });
    report.widths[w] = r;
    if (r.scrollWidth > r.clientWidth) report.blocking.push(`${w}px: horizontal overflow (${r.overflowing.join(', ')})`);
    if (r.brokenImgs.length) report.blocking.push(`${w}px: broken images ${r.brokenImgs}`);
    if (r.h1 !== 1) report.blocking.push(`${w}px: expected one h1, found ${r.h1}`);
    if (w === 1440) await page.screenshot({ path: resolve(shots, 'desktop-home.png') });
    if (w === 768) await page.screenshot({ path: resolve(shots, 'tablet-home.png') });
    if (w === 390) {
      await page.screenshot({ path: resolve(shots, 'mobile-home.png') });
      await page.locator('#peta').scrollIntoViewIfNeeded();
      await page.evaluate(() => document.getElementById('peta').scrollIntoView());
      await page.waitForTimeout(300);
      await page.screenshot({ path: resolve(shots, 'mobile-map.png') });
      await page.evaluate(() => document.getElementById('small-gatherings-title').scrollIntoView());
      await page.waitForTimeout(300);
      await page.screenshot({ path: resolve(shots, 'mobile-chapter.png') });
      await page.evaluate(() => document.getElementById('video').scrollIntoView());
      await page.waitForTimeout(300);
      await page.screenshot({ path: resolve(shots, 'mobile-videos.png') });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await page.screenshot({ path: resolve(shots, 'mobile-closing.png') });
      // mobile menu
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.click('.nav-toggle');
      await page.waitForTimeout(200);
      await page.screenshot({ path: resolve(shots, 'mobile-menu.png') });
      await page.click('.nav-sheet a[href="#life-of-enough"]');
      await page.waitForTimeout(2500);
      const top = await page.evaluate(() => Math.round(document.getElementById('life-of-enough').getBoundingClientRect().top));
      if (Math.abs(top) > 90) report.blocking.push(`mobile menu jump to chapter 03 landed at ${top}px`);
    }
    await ctx.close();
  }

  // desktop interactions: map (mouse + keyboard), video links, filters, copy, download
  const { ctx, page } = await open(1440, 900, { permissions: ['clipboard-read', 'clipboard-write'] });
  await settle(page);
  await page.evaluate(() => document.getElementById('peta').scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(shots, 'desktop-map.png') });
  await page.click('.wnode.tr button');
  await page.waitForTimeout(2500);
  const mouseTop = await page.evaluate(() => Math.round(document.getElementById('art-of-growing-together').getBoundingClientRect().top));
  await page.evaluate(() => document.getElementById('peta').scrollIntoView());
  await page.focus('.wnode.br button');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);
  const keyTop = await page.evaluate(() => Math.round(document.getElementById('grace-strength-service').getBoundingClientRect().top));
  report.map = { mouseClickChapter02Top: mouseTop, keyboardEnterChapter04Top: keyTop };
  if (Math.abs(mouseTop) > 90 || Math.abs(keyTop) > 90) report.blocking.push('wisdom map navigation did not reach chapter');

  await page.evaluate(() => document.getElementById('life-of-enough').scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(shots, 'desktop-chapter.png') });

  report.videoLinks = await page.$$eval('.vcard a.btn-solid', (as) =>
    as.map((a) => ({ href: a.href, target: a.target, rel: a.rel })),
  );
  const filterCounts = {};
  for (const label of ['Keuangan', 'Pernikahan', 'Komunikasi', 'Refleksi', 'Semua']) {
    await page.click(`.chip:has-text("${label}")`);
    filterCounts[label] = await page.$$eval('.vcard', (c) => c.length);
  }
  report.filterCounts = filterCounts;
  await page.click('.vcard .btn-quiet');
  await page.evaluate(() => document.getElementById('video').scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(shots, 'desktop-videos.png') });

  await page.click('.reminder .save-thought');
  await page.waitForTimeout(200);
  report.copyLabel = await page.textContent('.reminder .save-thought span');
  report.clipboard = await page.evaluate(() => navigator.clipboard.readText()).catch(() => 'unreadable');

  const href = await page.$eval('.download a.btn', (a) => a.href);
  const resp = await page.request.get(href);
  report.pdf = { href, status: resp.status(), contentType: resp.headers()['content-type'], bytes: (await resp.body()).length };
  if (resp.status() !== 200 || report.pdf.bytes < 100000) report.blocking.push('PDF download not served');
  await ctx.close();

  // reduced motion: everything visible immediately
  const rm = await open(390, 844, { reducedMotion: 'reduce' });
  report.reducedMotionHidden = await rm.page.$$eval('.reveal-pending', (e) => e.length);
  if (report.reducedMotionHidden) report.blocking.push('reduced motion still hides content');
  await rm.ctx.close();

  const ids = ['jGc668FpPRQ', 'AVKtZwYAD9g', 'SgK0Okc0M2k', 'eV497nxN8W4', 'kf3f-l2n4-k', 'ulTiWbGB24E', 'VSkAS9x-23E'];
  const hrefs = report.videoLinks.map((l) => l.href);
  for (const id of ids) if (!hrefs.includes(`https://youtu.be/${id}`)) report.blocking.push(`missing video link ${id}`);
  if (report.videoLinks.some((l) => l.target !== '_blank' || !l.rel.includes('noopener'))) report.blocking.push('video link missing target/rel');
  if (report.errors.length) report.blocking.push('console errors present');
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}

writeFileSync(resolve(root, 'qa', 'site_qc.json'), JSON.stringify(report, null, 2));
for (const [w, r] of Object.entries(report.widths)) {
  console.log(`${w}px scroll=${r.scrollWidth}/${r.clientWidth} nav=${r.navHeightPct}% small=${r.smallTargets.length}`);
}
console.log('filters', report.filterCounts, 'map', report.map, 'pdf', report.pdf?.status, report.pdf?.bytes);
console.log('copy', report.copyLabel, '|', report.clipboard?.slice(0, 40));
report.blocking.forEach((b) => console.log('BLOCKING:', b));
report.errors.forEach((e) => console.log('console:', e));
process.exit(report.blocking.length ? 1 : 0);
