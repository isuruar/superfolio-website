# Superfolio components: buttons, cards, inputs

How the shared pieces look and behave, so the website and the app read as one product.
All values come from `design/tokens.css`. Live examples are on the website (`src/components/`).

## Adopting the tokens in the app

`tokens.css` uses the app's own variable names, so most of it is a drop-in. Things that change:

| App variable | Today | New | Why |
|---|---|---|---|
| `--muted` (light) | `#A09890` | `#6B6560` | `#A09890` is 2.8:1 on white, below AA for text. Home already overrides it to `#6B6560`. |
| `--muted` (dark) | `#7D8590` | `#8B949E` | 4.7:1 on `--card` is borderline; 5.6:1 is safe for small text. |
| `--pos` (light) | `#059669` | `#047857` | Same as the app's `--pos-strong`; `#059669` is 3.8:1. Use `--pos-fill` for bars and rings. |
| `--warn` (light) | `#D97706` | `#B45309` | Same as `--warn-strong`; `#D97706` is 3.2:1. Use `--warn-fill` for shapes. |
| Dark mode | `:root.dark` | `:root.dark` or `[data-theme="dark"]` | Both work; the app can keep its class. |

New tokens the app doesn't have yet: `--text-2`, `--border-strong`, `--page`, `--*-fill`,
`--neutral-fill`, `--type-*`, `--action` / `--on-action`, `--focus`, type scale, spacing, radii,
shadows and motion. The app's `--hero-*` gradient tokens aren't part of the shared set.

**Fonts:** Plus Jakarta Sans for all words, DM Sans for figures with `font-variant-numeric: tabular-nums`.
This is what the app already does. The site self-hosts both (no requests to Google); the app can keep Google Fonts or self-host too.

## Buttons

| Variant | Use | Look |
|---|---|---|
| **Primary** | The one main action in a view ("Get started free", "Save all") | `--action` fill, `--on-action` text, pill radius, 600 weight |
| **Ghost** | The secondary action beside a primary ("See how it works", "Not now") | Transparent, 1px `--border-strong` outline, `--text` label |
| **Quick-add** | Contribution amounts (+10 / +20 / +50) | `--card` fill, 1px `--border-strong`, `--r-md` radius, DM Sans 700 |
| **Segmented** | Two or three views of the same data (Weekly / Monthly) | `--bg` track; the selected option is a `--card` chip with a soft shadow |

- **Sizes:** 44px tall by default, 52px for page-level calls to action. Never below 44px for touch.
- **Hover:** primary gets a soft shadow; ghost and quick-add darken the outline to `--text-2`.
- **Press:** scale to 0.97 (quick-add 0.94) over `--dur-fast` with `--ease-out`.
- **Focus:** 2px `--focus` outline with a 3px offset, on every interactive element.
- **Labels** say exactly what happens ("Save all", not "Submit"). One primary per view.
- **Segmented controls** use `aria-pressed` on each button.

## Cards

- **Card:** `--card` fill, 1px `--border`, `--r-lg` (20px) radius, `--shadow-card`. Padding is 24–32px on desktop and 20px on phones.
- **Floating card:** the one card that sits over another (a goal card, a sheet) uses `--shadow-float`. Only one per group.
- **Tray:** `--bg` fill, 1px `--border`, `--r-xl` (32px) radius. It holds product shots on the site and separates "the app" from "the page". It's not for use inside the app.
- **Rows inside cards** are separated by 1px `--border` rules rather than gaps, with the name on the left and a right-aligned DM Sans figure. A secondary line (original currency, last checked) sits under the figure in `--muted` at 12px.
- **Status chips:** pill radius, 11.5px, 600 weight. Colours:
  - In progress: `--info` on `--info-bg`
  - Complete: `--pos` on `--pos-bg`
  - Not started: `--muted` on a 16% tint of `--neutral-fill`

  Colour is never the only signal: the chip always has a word.
- **Progress:** 5–6px bars and 5px rings on a `--border` track, with round caps. Fills use `--info-fill` while in progress and `--pos-fill` once complete.

## Inputs

- **Field:** 44px tall, `--input-bg` fill, 1px `--border-strong` outline, `--r-md` radius, 15px 600 weight. Amounts are right-aligned in DM Sans.
- **Label:** always visible, above or beside the field, connected with `for` / `id`. Placeholders are never the label.
- **Focus:** a 2px `--focus` outline replaces the border.
- **Amounts:** use `inputmode="decimal"` and show the currency code in the label or the value.
- **Errors:** say what's wrong and how to fix it, in `--neg`, under the field ("Enter an amount, like 250").

## Motion

- Motion runs only when it explains something: a date moving after a contribution, a ring filling to show progress.
- Durations come from `--dur-fast` (150ms), `--dur-base` (250ms) and `--dur-slow` (500ms), all with `--ease-out`. Nothing loops.
- Under `prefers-reduced-motion`, motion runs at 0ms and nothing autoplays. Every interaction still works.
