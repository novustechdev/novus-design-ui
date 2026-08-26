# Point your app at tokens.css — build on the Novus design system

For **apps, web pages and components** (not decks — for those see
`slide-template/Make_an_HTML_deck.md`). `tokens.css` is the single source of truth: it defines
every colour, type size, spacing, radius, shadow and the Carlito font as **CSS custom properties**
on `:root`, plus the locked rules. Your app should **derive everything from it** and **never
hardcode a value the tokens already define**.

> Golden rule: no ad-hoc hex, no ad-hoc spacing/radii, one accent per view, always Carlito.
> If you're about to type `#0070C0` or `16px`, use `var(--blue-500)` / `var(--space-4)` instead.

## 1. Wire it in
**A. Plain HTML/CSS site** — link the stylesheet and keep `fonts/` beside it (tokens.css self-hosts
Carlito via `@font-face → fonts/…woff2`):
```html
<link rel="stylesheet" href="/assets/tokens.css">
<!-- ship /assets/fonts/ next to it -->
```
**B. Bundler (Vite / webpack / Next.js)** — import once at the app root, serve `fonts/` statically:
```js
import "./styles/tokens.css";
```
**C. React + Tailwind** — map the CSS vars into your theme so utilities resolve to tokens:
```js
theme:{extend:{colors:{'blue-500':'var(--blue-500)',accent:'var(--accent)',bg:'var(--bg)',
  surface:'var(--surface)',text:'var(--text)',border:'var(--border)'},
  fontFamily:{sans:'var(--font-sans)'},borderRadius:{md:'var(--radius-md)'}}}
```

## 2. Use the tokens (reference, never redefine)
```css
.card{background:var(--surface);color:var(--text);border:1px solid var(--border);
  border-radius:var(--radius-md);box-shadow:var(--shadow-1);padding:var(--space-4);
  font-family:var(--font-sans);}
.btn--primary{background:var(--blue-500);color:var(--text-on-accent);}
```
Prefer semantic tokens (`--bg`, `--surface`, `--text`, `--text-secondary`, `--border`, `--accent`)
so dark mode flips correctly; reach for raw ramps (`--blue-50…900`, `--green-*`, `--amber-*`,
`--indigo-*`, `--orange-*`) only for a specific hue a semantic token doesn't cover. Type
`--text-xs…--text-4xl`/`--text-display`; weights `--weight-regular|medium|bold`; spacing
`--space-0…9`; radius `--radius-sm|md|lg|xl|pill`; shadow `--shadow-1|2|3`.

## 3. Fonts
Carlito is declared inside tokens.css (self-hosted from `fonts/`), so linking tokens.css with
`fonts/` beside it is all end users need. For local preview, install Carlito (`Install_the_Novus_font.md`).

## 4. Dark mode (already wired)
Force with `<html data-theme="dark">`, or let the OS decide via `@media (prefers-color-scheme:dark)`.
If you add a dark rule, mirror it under **both** triggers. Default `<html data-theme="light">` unless
you want auto.

## 5. Logos (place, never retype)
Use the supplied files via the `--logo-*` tokens or an `<img>` from `logos/`:
```css
.brand{width:132px;height:auto;background:var(--logo-master-colour) center/contain no-repeat;}
```
Master lockup ships in 6 treatments (`--logo-master-colour|white|blue|green|grey|black`);
product/platform pictographs are `--logo-product-*` / `--logo-platform-*`.

## 6. Single-file / offline builds (self-contained rule)
If the output is a file people open directly, **inline `tokens.css`**, **embed Carlito (woff2) and
images as base64**, and pin `<html data-theme="light">`. **Never `<link>` an external stylesheet
from a `file://` page** — Safari shows a black screen. (Servable web apps can link normally.)

## Building with AI
Attach **`tokens.css` + `Novus_Context.md`** (add `brand.html` to *see* the system) and instruct
the tool to derive every colour, size and spacing from the tokens and never invent hex. Example:
> "Use the attached Novus `tokens.css` as the single source of truth. Build a [component/page]
> that references the CSS variables only — no hardcoded hex/px for anything the tokens define.
> Support dark mode via `data-theme` and `prefers-color-scheme`."
