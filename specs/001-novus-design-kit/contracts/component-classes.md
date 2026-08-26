# Contract: CSS class API & reference-site routes

## CSS class API

The kit's component interface is its class names (BEM-ish: block, `block__element`,
`block--modifier`) plus the CSS custom properties in tokens.css. Classes and custom
properties are API: removing or renaming either is a breaking change (MAJOR).

v1 catalog — component families and their root classes (sub-elements documented on
each family's detail page; exact grouping finalized in `site/components.json`):

| Family | Category | Root classes |
|--------|----------|--------------|
| Button | General | `.btn` (+ `--primary --secondary --ghost --danger --sm --lg`) |
| Badge | General | `.badge` (+ `--accent --success --warning --danger`, `__dot`) |
| Avatar | General | `.avatar--photo`, `.bio-photo`, `.bio-id` |
| Brand lockup | General | `.brandlock`, `.brandlogo--light/--dark`, `.vlogo`, `.wm` |
| Container | Layout | `.container`, `.container--narrow` |
| Grid & Row | Layout | `.grid`, `.row` |
| Surface & text utilities | Layout | `.surface`, `.muted` |
| App shell | Layout | `.appbar`, `.appnav`, `.appmain`, `.appheader` |
| Card | Data Display | `.card` (+ `--interactive --raised`), `.card-trigger` |
| Table | Data Display | `.table` |
| Stats | Data Display | `.statrow` (+ `--wide`), `.stat` |
| Bullets | Data Display | `.bullets` |
| Leaders | Data Display | `.leaders`, `.leader` |
| Logo wall | Data Display | `.clientwall`, `.clogo`, `.schemewall`, `.slogo` |
| Collapse & Disclosure | Data Display | `.collapse`, `.disclosure` |
| Value chain | Data Display | `.vchain-strip`, `.vchain`, `.vchain-arrow` |
| Alert | Feedback | `.alert` (+ `--info --success --warning --danger`) |
| Modal | Feedback | `.modal`, `.modal__backdrop`, `.modal-close`, `dialog.vdialog` |
| Field & Input | Forms | `.field` (+ `--error`, `__help`, `__error`), `.input` |
| Lead form & CTA row | Forms | `.lead-form`, `.cta-row` |
| Nav | Navigation | `.nav` |
| Product themes | Theming | `.theme-novus`, `.theme-novapay`, `.theme-novabank`, `.theme-novastore`, `.theme-novatrust`, `.theme-novaboost`, `.theme-novaai` |

(22 families. An earlier draft mis-scoped `.vlogo`, `.wm`, `.vchain*`,
`.vdialog`, `.schemewall`/`.slogo` as deck-only — they are web components in
tokens.css §4/§8b and are in the catalog above.)

Out of v1 catalog (deck/poster/doc systems, documented in `slide-template/`):
`.novus-slides`, `.nslide*`, `.novus-poster`, `.novus-doc`.

## Reference-site routes (public static site)

| Route | Page |
|-------|------|
| `/` | Landing: what the kit is, install teaser, links into both sections |
| `/install.html` | Install & wiring guide ("Novus developers only" note for registry access; no credentials) |
| `/foundations/principles.html` | Design principles (from constitution + Novus_Context.md) |
| `/foundations/color.html` | Palette, semantic tokens, product accents, one-accent rule |
| `/foundations/typography.html` | Carlito, type scale, weights |
| `/foundations/layout.html` | Spacing scale, container, grid, app shell |
| `/foundations/logos.html` | Logo treatments, lockups, dark-mode behavior, placement rules |
| `/foundations/photography.html` | Approved photos and usage |
| `/foundations/dark-mode.html` | Dual trigger, pre-paint toggle pattern |
| `/foundations/assets.html` | Bundled asset index: every file in `logos/` and `photos/` with preview + package path (generated at build time) |
| `/components/overview.html` | Overview grid: every manifest component, grouped by category, with preview + link |
| `/components/<id>.html` | One per manifest entry: live examples per variant/state, copyable snippet per example, do/don't guidance |
| `/frameworks/blazor.html` | Novus Design for Blazor: wwwroot copy target, wiring, Razor usage, JS-interop toggle |
| `/frameworks/react.html` | Novus Design for React: entry wiring, JSX class usage, asset imports |
| `/frameworks/vite.html` | Novus Design for Vite: zero-config import, hashed asset imports, zero-flash head script |
| `/frameworks/vue.html` | Novus Design for Vue.js: main.js wiring, SFC usage, scoped styles on tokens |
| `/themes/tailwind.html` | Novus Design with Tailwind CSS: v4 `@theme inline` and v3 config token mapping |
| `/themes/fluent2.html` | Novus Design with Fluent 2: Fluent UI React v9 / Fluent UI Blazor themed by `var()` reference |
| `/themes/material.html` | Novus Design with Material: MUI theme with all palette variants as `var()` strings |
| `/themes/antd.html` | Novus Design with Ant Design: ConfigProvider fed by runtime `getComputedStyle` token reads |
| `/components/index.html` | Redirect stub → overview.html only. Content pages are never a subdirectory `index.html`: clean-URL hosts serve those at `/components` (no trailing slash), which breaks every relative link on the page. The build fails if one is emitted |

Every page: shared shell (header with master lockup at `--logo-height`, nav,
theme toggle, footer), works at 375px, works with JS disabled (toggle button is
the only JS-dependent control; OS dark preference still applies). Foundations
and components pages carry an ant.design-style section sidebar: sticky menu of
every page in the section from 900px up, a collapsible menu on mobile (native
`<details>`, so it works with JS off).

URL stability: routes are public API for deep-linking; renaming a route after
launch requires a redirect stub.
