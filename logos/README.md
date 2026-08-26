# Novus logo & brand asset set

**The rule above all others: never retype, redraw or re-create a Novus mark.** Always place
these asset files. A typed-out "NOVUS" (or a hand-drawn lockup) is not the logo.

## Novus master logo — `./`
The corporate mark, in 6 treatments, each as **master lockup** (use this) and **wordmark**
(sub-logo — avoid unless specifically directed):

`Novus_Logo_{Colour|White|Blue|Green|Grey|Black}_transparent.png`
`Novus_Logo_{...}_wordmark_transparent.png`

- **Colour** on light grounds · **White** on dark grounds. Blue/Green/Grey/Black for single-ink use.
- **Never distort** — true aspect ratio is 1619×501 (≈3.232). Scale proportionally only.
- In CSS use the tokens: `--logo-master-colour|white|blue|green|grey|black`.

## Product & platform sub-brands — `icons/`, `icons/png/`, `lockups/`
All **10** Novus sub-brands, each in three forms:

| Sub-brand | Type | icon (SVG) | icon (PNG) | lockup |
|---|---|---|---|---|
| novapay | vertical | ✔ | ✔ | ✔ |
| novabank | vertical | ✔ | ✔ | ✔ |
| novastore | vertical | ✔ | ✔ | ✔ |
| novatrust | vertical | ✔ | ✔ | ✔ |
| novahub | platform | ✔ | ✔ | ✔ |
| novaware | platform | ✔ | ✔ | ✔ |
| novaserve | platform | ✔ | ✔ | ✔ |
| novaai | platform | ✔ | ✔ | ✔ |
| novaboost | talent & managed services | ✔ | ✔ | ✔ |
| novaplan | internal tool | ✔ | ✔ | ✔ |

- **`lockups/*.png`** — the two-tone name with its icon tight beside it. **This is what goes on a
  slide or page when you name a product.** Never type "novapay" as text.
- **`icons/*.svg`** — the pictograph alone (line style, `currentColor`); `icons/png/` is the raster
  twin for Office and anywhere SVG isn't supported.
- CSS tokens: `--logo-product-*`, `--logo-platform-*`, `--logo-lockup-*` (and `-png` variants).
- The four **verticals** (novabank · novapay · novastore · novatrust) sit **on top of** the four
  reusable **platform assets** (novahub · novaware · novaserve · novaai). Never say "seven building
  blocks"; never use "core" in copy — say "platform".

## Client marks — `clients/` and `clients/_wall/`
The **13** current Novus clients. `_wall/` holds the trimmed, size-normalised versions for a client
wall (equal optical weight); the top-level files are the originals.

- **Never recolour, invert or filter a client mark.** On dark grounds, place the original colours on
  a white holder tile (or use the client's own official reverse asset).
- Cite **real clients only** — never present a prospect as a client.

## Payment scheme & national-rail marks — `schemes/` and `schemes/_wall/`
13 scheme marks (Visa, Mastercard, UnionPay, LankaPay, BancNet, DuitNow, QRIS, QRPh, KHQR, Bakong,
Alto, LankaQR, BSP). Same rules as client marks — never recolour or redraw.

## Other
- **`title_bg_white.png`** — the branded title-slide background (white logo + globe hero map).
- **`footprint-map.png`** — the Novus footprint map graphic.

---
*Not included by design:* retired client marks (a mark is retired the moment a relationship ends —
it must not appear on any outward-facing artefact), internal desktop/app icons, and raw letterforms
(shipping those invites re-creating the mark by hand, which is never permitted).
