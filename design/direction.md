# Superfolio website: design direction

**Status:** signed off by Isuru, 7 Nov 2026. The site is now built from this in `src/`.

**Decisions**

| Decision | Outcome |
|---|---|
| Overall look | Approved as proposed |
| Headline | Approved: "All your money, in one place. And a real date for every goal." |
| Logo | **B. Folio** (final files in `design/logo/`) |
| Fonts | Keep the app's: Plus Jakarta Sans for words, DM Sans for figures |
| Stack | Astro, static, on its own Vercel project |
| Pricing | "Free while in beta" |
| Analytics | None |
| Domain | Still open |

**Correction found while building:** the app supports **20 currencies**, not "any currency". The site says 20 and lists them.
**See it:** `design/mock/index.html` (hero, interactive) and `design/mock/brand.html` (logos, type, colour).
Screenshots are in `design/screens/`. All figures are made up.

---

## 1. What I took from the four reference sites

I loaded each site at 1440px and 390px, scrolled the full page and measured the computed styles.

| | Acctual | Ramp | Superfocus | Aave |
|---|---|---|---|---|
| H1 | 64px, 600, −3% | 64px, **400**, ~0% | 64px, 600, −4% | 72px, 550, −5% |
| Hero | Centred, invoice as the hero object | Left-aligned, annotated UI fragments | Centred, video, then UI cards | Centred, phone mocks, numbers first |
| Colour | Off-white, pastel tiles | Black and white plus one lime CTA | Black and white | Lavender wash, one dark section |
| Product shown as | Real invoice artefacts | UI slices with "selection box" callouts | UI cards on grey trays | Big balances in phone frames |
| Copy pattern | **Bold lead.** Muted continuation. | Two-tone headings: ink, then grey | Plain benefit headings | Short, confident claims |

**Qualities worth taking**

1. **Big, tight, confident type.** Three of the four sit at 64–72px, weight 550–600, with negative tracking.
2. **The product is the hero.** Every site leads with real UI or a real artefact, not illustration.
3. **Ink and paper, with one or two strong moments.** Colour is rare, so it carries weight when it appears.
4. **Two-tone headings** (Ramp, Acctual): the claim in ink, the "so what" in grey. This works well for us because it puts the two halves of the promise in one line.
5. **UI on soft trays** (Superfocus): product cards sit on a light grey surface, which separates "the app" from "the page".
6. **Numbers set like a hero** (Aave): a big balance is the most legible thing on the screen.
7. **Fewer, bigger sections.** Most sections are a heading, one or two lines and one visual.

**What we deliberately don't take**

- **Fake urgency.** Superfocus runs "Founding membership closing soon" and "Limited time offer" banners.
- **Social proof we don't have.** Logo walls, "85,000 companies", star ratings, "used by 5,000+".
- **Security badges** (Acctual's PCI/SSL tiles, Aave's SOC 2). We hold no certifications.
- **Heavy tracking.** Acctual loads PostHog session recording plus Google Ads; Superfocus loads the Facebook pixel. For a privacy-first money app, that would contradict the page it sits on.
- **Cookie banners.** If we don't track, we don't need one, and that becomes something we can say.
- **Decorative motion.** Ramp's ambient animation is impressive, but none of it explains anything.

## 2. The direction: *calm, legible, real numbers*

> Colour belongs to your money. The page is ink and paper; the only colour comes from the product's own data and status.

- **Layout:** centred hero, 1120px content width, generous vertical rhythm (96–128px between sections on desktop). One idea per section.
- **Product shots:** the hero is an HTML recreation of the real app's net-worth and goal cards, matched to the app's styles and filled with made-up figures. It stays sharp at any size, works in dark mode, and the goal card actually works (see section 5).
- **Type:** the two-tone headline, *"All your money, in one place."* in ink, then *"And a real date for every goal."* in muted grey.
- **Honesty markers:** a visible "Sample figures" tag on the product tray. Instead of a logo wall, a strip of plain facts: any currency, no bank login, share with a partner, works offline, no ads.

## 3. Type

| Role | Font | Size / line / tracking |
|---|---|---|
| Display (H1) | Plus Jakarta Sans 600 | 64 / 1.06 / −3.5% (40px on phones) |
| H2 | Plus Jakarta Sans 600 | 44 / 1.1 / −3% |
| H3 | Plus Jakarta Sans 600 | 22 / 1.3 / −1.5% |
| Lead | Plus Jakarta Sans 400 | 20 / 1.55 |
| Body | Plus Jakarta Sans 400 | 16 / 1.55 |
| Figures | DM Sans 600, tabular | matched to context |

**This differs from the brief, so please check it.** The brief says Jakarta for headings and DM Sans for body.
In the app's code it's actually **Jakarta for all words** (body included) and **DM Sans for figures**:
`.hero-amount`, `.section-total`, `.goal-date-value` and the rest. I've followed the app so the site
and the product match. If you'd rather have DM Sans for body text, it's a one-token change.

## 4. Colour

- **Surfaces and ink use the app's values:** `--text #18160F`, `--border #E8E8E8`, tray `#F7F7F7`, and the dark mode `#0D1117 / #161B22 / #30363D`.
- **The primary button is ink** (light mode) and **paper** (dark mode). We don't need a brand hue, and this keeps the status colours unambiguous.
- **Status colours stay semantic only:** green means complete, blue means in progress, grey means not started. They never appear as decoration.
- **Data colours** are the app's asset types (Cash blue, Unit trusts green, Stocks orange, Other violet). They only appear in charts.
- **One fix for the app's `--muted`.** `#A09890` on white is about 2.8:1, which fails AA for text (the app already overrides it to `#6B6560` on Home). The site uses `#6B6560` (5.7:1) for text. I suggest the app adopt it everywhere when it takes the tokens.
- **The strong moments:** the hero product shot, where all the data colour lives, and one full-width dark "Private by design" section further down the page.

All text pairs in the mock meet WCAG 2.2 AA in both themes.

## 5. Motion: only when it explains something

- **Hero goal card:** when the card scrolls into view, the progress ring fills. About 1.5s later the "+50" button presses itself once, the saved amount ticks up, the ring grows, and the date rolls to an earlier one, with *"+NZ$50 · 5 days sooner"* and an Undo. It plays once and never loops.
- **It's live:** visitors can tap +10, +20 or +50 themselves. It uses the same maths as the app (today + remaining ÷ monthly rate), so the dates are real.
- **Reduced motion:** with `prefers-reduced-motion`, nothing autoplays and updates are instant. The card still works. (`?motion=off` in the mock simulates this.)
- **Library:** the Web Animations API covers it, with no library needed. If later sections need more, use **Motion**, which the app already loads (`motion@10`).

## 6. Logo

There are three options in `brand.html`. I recommend **A. Ring**: an open progress ring in a rounded-square tile, with a lowercase Jakarta 700 wordmark.

- **Why:** it's the donut and the goal ring from the product, compressed into one shape. It reads as "progress towards something", which helps steer "super" away from "pension". It stays clear at 16px.
- **Risk:** on its own, an open ring can read as a loading spinner. If you pick it, I'll test a version with a small dot at the end of the arc.
- **After you choose:** the final wordmark, favicon and app icon get exported as outlined SVG files in `design/logo/`. No printed or paid branding until the trademark check is done (brief §9).

## 7. Decisions I need from you

My recommendation is listed first in each row.

| Decision | Recommendation | Why |
|---|---|---|
| **Stack** | **Astro**, static output, plain CSS with tokens, no UI framework, deployed on Vercel | It ships zero JavaScript by default, and the one interactive card is a small script. Sections become components, so the hero mock ports over as-is. Plain HTML is a fine fallback, but it gets repetitive across a 9-section page plus a privacy page. |
| **Headline / tagline** | H1: *"All your money, in one place. And a real date for every goal."* Short tagline: *"Know you're on track."* | Puts differentiators 1 and 2 in the first line. "Super" is clarified by "money" straight away. |
| **Pricing** | **"Free while in beta."** No paid plan shown yet. | Nothing is built, and showing NZ$69/yr now would be a promise. No "founding member" urgency. |
| **Analytics** | **None at launch.** Later, if needed, Vercel Web Analytics (cookieless) or Plausible, named on the privacy section. | No tracking means no cookie banner, and that's a stronger privacy story than any badge. |
| **Domain** | **superfolio.money**, plus **superfolio.co.nz** redirecting to it | ".money" settles what the product is, which counters the "super = pension" reading. It also echoes the current `superfoliomoney` URL. The app could then move to `app.superfolio.money`. |
| **Logo** | A. Ring | See section 6. |
| **Fonts** | Jakarta for words, DM Sans for figures (as in the app) | See section 3. |

## 8. What happens after sign-off

1. Scaffold Astro on this branch and port the hero.
2. Build the remaining sections in order (whole picture, goals, spending plan, check-ins, privacy, pricing, FAQ, final CTA). Each gets desktop, phone, light and dark screenshots for review.
3. Export `design/tokens.css` (mapped to the app's `--text`, `--bg`, `--card`, `--border`, `--muted`, `--pos`, `--warn`, `--info`), `design/logo/` and `design/components.md`.
4. I'll ask before merging or deploying.
