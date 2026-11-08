"""Builds the Superfolio logo SVGs in design/logo/.

The wordmark is Plus Jakarta Sans 700 with -0.045em tracking, converted to outlines so it renders
the same everywhere without the font. Run: python3 scripts/build-logo.py  (needs: pip install fonttools brotli)
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "design" / "logo"
FONT = ROOT / "node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2"
INK, PAPER, NIGHT_INK = "#18160F", "#FFFFFF", "#E6EDF3"

# ── Folio mark on a 32-unit grid: a back sheet (outline) behind a front sheet (solid). ──
FRONT = '<rect x="7.5" y="12" width="13" height="13" rx="3.25"/>'
BACK = '<path d="M11.75 7.75h8.5a4 4 0 0 1 4 4v8.5" fill="none" stroke-width="2.5" stroke-linecap="round"/>'

def mark_tile(tile, sheet):
    return (f'<rect width="32" height="32" rx="9" fill="{tile}"/>'
            f'<g fill="{sheet}" stroke="{sheet}">{FRONT.replace("/>", " stroke=\"none\"/>")}{BACK}</g>')

def mark_cutout(id_):
    """Single-colour mark (currentColor): the sheets are cut out of the tile, so any background shows through."""
    return (f'<mask id="{id_}" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">'
            f'<rect width="32" height="32" fill="#fff"/><g fill="#000" stroke="#000">{FRONT.replace("/>", " stroke=\"none\"/>")}{BACK}</g></mask>'
            f'<rect width="32" height="32" rx="9" fill="currentColor" mask="url(#{id_})"/>')

# ── Wordmark outlines ──
font = TTFont(FONT)
font = instantiateVariableFont(font, {"wght": 700})
gs, cmap, upem = font.getGlyphSet(), font.getBestCmap(), font["head"].unitsPerEm
SIZE, TRACK = 27.0, -0.045            # px at a 32px-tall mark; tracking in em
scale = SIZE / upem
pen = SVGPathPen(gs)
x = 0.0
for ch in "superfolio":
    g = cmap[ord(ch)]
    gs[g].draw(TransformPen(pen, (scale, 0, 0, -scale, x, 0)))
    x += gs[g].width * scale + TRACK * SIZE
text_w = x - TRACK * SIZE
bp = BoundsPen(gs); 
for ch in "x": gs[cmap[ord(ch)]].draw(bp)
x_height = bp.bounds[3] * scale
GAP = 9.5
baseline = 16 + x_height / 2 + 0.4   # optically centre the x-height on the mark
W = 32 + GAP + text_w
word = f'<path transform="translate({32 + GAP:.2f} {baseline:.2f})" d="{pen.getCommands()}"/>'

def svg(w, h, body, title, extra=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h}" width="{w:.0f}" height="{h}" role="img" aria-label="{title}"{extra}>'
            f'<title>{title}</title>{body}</svg>\n')

files = {
    # Wordmarks
    "superfolio-wordmark.svg":       svg(W, 32, f'<g fill="{INK}">{mark_cutout("m")}{word}</g>', "Superfolio"),
    "superfolio-wordmark-dark.svg":  svg(W, 32, f'<g fill="{NIGHT_INK}" color="{NIGHT_INK}">{mark_cutout("m")}{word}</g>', "Superfolio"),
    "superfolio-wordmark-mono.svg":  svg(W, 32, f'<g fill="currentColor">{mark_cutout("m")}{word}</g>', "Superfolio"),
    # Square marks
    "superfolio-mark.svg":           svg(32, 32, mark_tile(INK, PAPER), "Superfolio"),
    "superfolio-mark-mono.svg":      svg(32, 32, mark_cutout("m"), "Superfolio"),
    # Favicon: ink tile in light browsers, light tile in dark ones
    "favicon.svg": svg(32, 32,
        '<style>.t{fill:#18160F}.s{fill:#FFFFFF;stroke:#FFFFFF}@media (prefers-color-scheme:dark){.t{fill:#E6EDF3}.s{fill:#0D1117;stroke:#0D1117}}</style>'
        f'<rect class="t" width="32" height="32" rx="9"/><g class="s">{FRONT.replace("/>", " stroke=\"none\"/>")}{BACK}</g>', "Superfolio"),
    # Home-screen icon: full-bleed (iOS and Android round the corners themselves); sheets inside the 80% safe zone
    "app-icon.svg": svg(32, 32,
        f'<rect width="32" height="32" fill="{INK}"/><g transform="translate(16 16) scale(0.8) translate(-16 -16.4)" fill="{PAPER}" stroke="{PAPER}">'
        f'{FRONT.replace("/>", " stroke=\"none\"/>")}{BACK}</g>', "Superfolio"),
}
for name, content in files.items():
    (OUT / name).write_text(content)
print("wrote", ", ".join(files), f"(wordmark {W:.1f}x32)")
