# Superfolio website

Marketing site for [Superfolio](https://superfoliomoney.vercel.app), a personal-finance web app.
The app lives in a separate repo (`isuruar/wealthtracker`); this repo never changes it.

Static [Astro](https://astro.build) site. No UI framework, no analytics, no cookies, and fonts are self-hosted.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Deploying on Vercel

Import this repo as a new Vercel project. Vercel detects Astro, so the defaults work (build `npm run build`,
output `dist`). No environment variables or API keys are needed.

## Layout

| Path | What it is |
|---|---|
| `src/pages/index.astro` | The home page, assembled from sections |
| `src/components/` | One file per section, plus the product cards (net worth, goal) |
| `src/lib/sample.ts` | All sample figures and the maths helpers. Made up, never a real person's finances |
| `src/styles/global.css` | Base styles, layout helpers, buttons |
| `design/tokens.css` | Design tokens shared with the app (colours, type, spacing, radius, motion) |
| `design/components.md` | How buttons, cards and inputs look and behave, and how the app adopts the tokens |
| `design/logo/` | Final logo SVGs: wordmark (ink, dark, mono), square mark, favicon, app icon |
| `design/direction.md` | The signed-off design direction and decisions |
| `design/mock/`, `design/screens/` | The original sign-off mock and its screenshots |
| `design/screens/site/` | Screenshots of the built site, desktop and phone, light and dark |

## Scripts

These need Playwright (and ImageMagick for icons) on your machine. They aren't part of the site build.

- `python3 scripts/build-logo.py`: rebuilds the logo SVGs (outlines the wordmark from Plus Jakarta Sans 700)
- `node scripts/build-icons.mjs`: renders favicon and home-screen PNGs from the logo SVGs into `public/`
- `node scripts/screens.mjs`: screenshots `dist/` at desktop and phone widths in both themes, and reports console errors or sideways scrolling
