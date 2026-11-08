// Renders the PNG icons and favicon.ico from design/logo/*.svg into public/.
// Needs Playwright and ImageMagick on the machine. Run: node scripts/build-icons.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');   // dev-only; not a site dependency
import { readFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const logo = f => readFileSync(new URL(`../design/logo/${f}`, import.meta.url), 'utf8');
const jobs = [
  ['app-icon.svg', 180, 'apple-touch-icon.png'],
  ['app-icon.svg', 192, 'icon-192.png'],
  ['app-icon.svg', 512, 'icon-512.png'],
  ['superfolio-mark.svg', 32, 'favicon-32.png'],
  ['superfolio-mark.svg', 16, 'favicon-16.png'],
];
const b = await chromium.launch();
for (const [src, size, out] of jobs) {
  const p = await b.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await p.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${logo(src)}`);
  await p.screenshot({ path: `public/${out}`, omitBackground: true });
  await p.close();
}
await b.close();
execFileSync('convert', ['public/favicon-16.png', 'public/favicon-32.png', 'public/favicon.ico']);
copyFileSync(new URL('../design/logo/favicon.svg', import.meta.url), 'public/favicon.svg');
console.log('icons written to public/');
