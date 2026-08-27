# Implementation Plan: feature 003

**Date**: 2026-08-27 | **Spec**: [spec.md](spec.md)

## Key decisions

- **Full width**: site SITE_CSS overrides the shared column (`max-width:none` on
  appbar inner, nav inner, main) keeping `--gutter` padding; same in admin.css
  (`.adminbody`). Prose keeps its existing readable measure (inline 68ch styles and
  `p{max-width:68ch}` from tokens). Sidebar-equipped docs pages become
  `240px + fluid` grid.
- **Rhythm**: SITE_CSS additions scoped to `.site-main`: h2/h3 top margins
  (space-7/6), standalone `pre.demo__code` block margins, figure/figcaption
  spacing, `img`, `.table`, `.bullets` block margins. Demo-figure internals stay
  tight (`.demo pre { margin:0 }`).
- **PWA basics**: `site/src/manifest.webmanifest` (name, icons from the kit logo
  PNGs, display standalone, background/theme colours from the token values at
  authoring time is a copied literal, so use the documented brand ink values via
  the manifest exception: manifest colour fields cannot reference CSS variables;
  record the exception in the gate exclusions) plus `<meta name="theme-color">`
  with media for light/dark in the shell. Manifest copied by build.mjs.
- **Charts**: Chart.js (^4) in both flavors. One shared pattern: a
  `novusChart.js` module (per flavor) that reads token values at runtime
  (getComputedStyle + rgba helper, zero literals) and applies the locked defaults:
  Carlito, soft dashed gridlines (border token at 13% alpha), no axis borders or
  ticks marks, rounded top bar segment, maxBarThickness 28,
  categoryPercentage .62, dark rounded tooltip (blue-900), stacked product bars +
  total trajectory line. Blazor loads Chart.js from npm copy via wwwroot/lib and
  initializes through a small interop script reading `chart-data.json` (generated).
- **Data grid**: Blazor = QuickGrid (Microsoft.AspNetCore.Components.QuickGrid,
  InteractiveServer page) + Paginator, styled via admin.css targeting the quickgrid
  table with tokens. Tailwind = progressive enhancement over the static injected
  table (search input, th sort toggles, 10-per-page pagination; JS-off shows the
  full static table).
- **Demos**: `admin-kits/tailwind` builds with `base: "./"` so its dist works at
  any path → copied to `site/dist/demos/tailwind/`. Blazor demo =
  `admin-kits/blazor-demo`, a standalone Blazor WebAssembly app reusing the same
  markup/pages (client rendermode implicit), `<base href="./">`; its published
  `wwwroot` → `site/dist/demos/blazor/`. build.mjs copies demo outputs when
  present; pages.yml builds both (setup-dotnet added) before the site build, so CI
  output always includes demos. Link gate covers the demo entry pages via the
  admin-kit page links.
- **Domain**: Cloudflare CNAME `ui-kit` → `sgultom99.github.io` (DNS-only, not
  proxied, so GitHub can issue the cert), then `PUT repos/.../pages` with the
  cname + `https_enforced: true`. Docs URLs swept to the custom domain afterwards.

## Constitution check (v1.5.0)

All principles hold; charts implement the locked chart rules verbatim; the WASM
demo is documented as demo-only so the Server flavor keeps the JS-off guarantee.
Manifest colour literals are a platform exception recorded in the gate exclusions.
PASS.
