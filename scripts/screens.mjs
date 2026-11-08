// Screenshots of the built site at desktop and phone widths, light and dark, plus basic checks
// (console errors, sideways scrolling). Run after `npm run build`:  node scripts/screens.mjs [outDir] [scale]
// Needs Playwright on the machine.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] || 'design/screens/site', scale = +(process.argv[3] || 1);
mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  try { const body = await readFile(join('dist', p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end('not found'); }
}).listen(0);
const url = `http://127.0.0.1:${server.address().port}/`;
const b = await chromium.launch();
let problems = 0;
for (const vp of [{ w: 1440, h: 900, t: 'desktop' }, { w: 390, h: 844, t: 'phone' }]) for (const theme of ['light', 'dark']) {
  const p = await b.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: scale });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`${url}?theme=${theme}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  // Scroll through so in-view effects run, then wait for the goal demo to finish.
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += vp.h / 2) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(120); }
  await p.evaluate(() => document.querySelector('[data-goal-card]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(3200);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const wide = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 5).map(e => e.tagName + '.' + e.className));
  if (overflow > 0) { problems++; console.log(`${vp.t}/${theme}: page scrolls sideways by ${overflow}px`, wide); }
  if (errs.length) { problems++; console.log(`${vp.t}/${theme} errors:`, errs); }
  await p.screenshot({ path: `${out}/home-${vp.t}-${theme}.png`, fullPage: true });
  await p.close();
}
await b.close(); server.close();
console.log(problems ? `${problems} problem(s)` : 'no console errors, no sideways scrolling', '→', out);
