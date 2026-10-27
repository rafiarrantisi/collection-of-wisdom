// Build the site, render print.html with the locally installed Chrome, export the A5 PDF.
// Fails (exit 1) on missing images/fonts or any text overflowing its page's safe area.
import { execSync } from 'node:child_process';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from 'playwright-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PDF_NAME = 'A_Collection_of_Wisdom.pdf';
const skipBuild = process.argv.includes('--no-build');

if (!skipBuild) execSync('npm run build', { cwd: root, stdio: 'inherit' });

const server = await preview({ root, preview: { port: 4179, strictPort: true }, logLevel: 'warn' });
const base = 'http://localhost:4179/';

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
let failed = false;
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`);
  });

  await page.goto(`${base}print.html`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((res) => img.addEventListener('load', res, { once: true })),
      ),
    );
  });

  const report = await page.evaluate(() => {
    const MM = 96 / 25.4;
    const out = { pages: 0, broken: [], fonts: [], issues: [] };
    out.broken = [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src);
    out.fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`);
    const pages = [...document.querySelectorAll('.page')];
    out.pages = pages.length;
    for (const pg of pages) {
      const n = pg.dataset.page;
      const pr = pg.getBoundingClientRect();
      for (const flow of pg.querySelectorAll('.flow')) {
        if (flow.scrollHeight > flow.clientHeight + 1) {
          out.issues.push(`p${n}: flow overflows by ${((flow.scrollHeight - flow.clientHeight) / MM).toFixed(1)}mm`);
        }
      }
      // every text-bearing leaf must sit inside the page with >= 9mm clearance (folio zone allowed)
      const walker = document.createTreeWalker(pg, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const t = walker.currentNode;
        if (!t.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(t);
        for (const r of range.getClientRects()) {
          const left = (r.left - pr.left) / MM;
          const right = (pr.right - r.right) / MM;
          const top = (r.top - pr.top) / MM;
          const bottom = (pr.bottom - r.bottom) / MM;
          if (Math.min(left, right, top, bottom) < 9) {
            out.issues.push(`p${n}: text "${t.textContent.trim().slice(0, 30)}" within ${Math.min(left, right, top, bottom).toFixed(1)}mm of trim`);
          }
        }
      }
    }
    return out;
  });

  console.log(`pages: ${report.pages}`);
  console.log(`fonts loaded: ${report.fonts.length}`);
  if (report.broken.length) console.error('BROKEN IMAGES', report.broken);
  if (errors.length) console.error('PAGE ERRORS', errors);
  if (report.issues.length) console.error('LAYOUT ISSUES\n  ' + report.issues.join('\n  '));
  failed = report.broken.length > 0 || errors.length > 0 || report.issues.length > 0 || report.pages % 4 !== 0;

  const outPdf = resolve(root, 'public', PDF_NAME);
  await page.pdf({ path: outPdf, preferCSSPageSize: true, printBackground: true, scale: 1 });
  copyFileSync(outPdf, resolve(root, PDF_NAME));
  if (existsSync(resolve(root, 'dist'))) {
    mkdirSync(resolve(root, 'dist'), { recursive: true });
    copyFileSync(outPdf, resolve(root, 'dist', PDF_NAME));
  }
  console.log(`wrote ${outPdf}${failed ? ' (WITH ISSUES — see above)' : ''}`);
} finally {
  await browser.close();
  await new Promise((res) => server.httpServer.close(res));
}
process.exit(failed ? 1 : 0);
