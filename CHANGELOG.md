# Changelog

All notable changes to `novus-design-kit` and its repository (reference docs site,
Novus Admin Kit). Format follows [Keep a Changelog](https://keepachangelog.com/);
versioning is semantic. Each release records both the npm artifact and the
repository around it; when the packaged kit files are unchanged, the entry says so.

## [Unreleased]

- Product-team feedback round (feature 004): four new catalog components
  (Dropdown, Date picker, Calendar, Stepper: compositions over the frozen
  tokens), components search bar and a choose-by-function module on the
  overview, Actions and placement foundations page, Web/Mobile preview toggle
  on component pages, tab hover tint, enlarged disclosure chevrons, inset
  select arrows, standard button gaps, and placeholder copy cleanup.
- Repository migrated to github.com/novustechdev/novus-design-ui (public,
  protected main, releases restored); CONTRIBUTING.md added.

## [0.3.0], 2026-08-27

Packaged kit files (tokens.css, fonts, logos, photos, js) are unchanged from
0.2.0; this release carries the README/CHANGELOG refresh and the repository
features below.

### Added

- Novus Admin Kit: a realistic novapay operations console in two flavors with
  strict screen parity from one dataset (`admin-kits/data`): Blazor Server
  (`admin-kits/blazor`) and Vite + Tailwind (`admin-kits/tailwind`). Six screens
  (Dashboard, Analytics, Transactions, Data grid, Terminals, Settings) plus a
  sample login (admin/admin).
- Live hosted demos on the docs site: /demos/blazor/ (WebAssembly twin) and
  /demos/tailwind/; every Admin Kit screenshot on the docs links into them.
- Analytics screens with Chart.js under the locked Novus chart rules (colors and
  fonts read from tokens at runtime) and Data grid screens (QuickGrid; progressive
  enhanced table) in both flavors.
- Tabbed Settings (Profile, Appearance, Notifications, API access) built on
  native radio inputs: works with JavaScript off, animated active-tab indicator.
- Functional motion (constitution 1.6.0): nav-link and tab transitions of 0.2s or
  less, disabled under prefers-reduced-motion.
- Getting started section on the Admin Kit docs page: copy-a-flavor path
  (clone/ZIP) and npm-install-into-an-existing-app path.
- Favicons from official brand assets: docs site uses a square crop of the master
  logo's leading N glyph; the demo consoles use the novapay pictograph.
- Docs site served at https://ui-kit.novustech.dev (Cloudflare CNAME to GitHub
  Pages, HTTPS enforced); ant.design-style landing (hero, bands, columned footer);
  full-width fluid layout with a web app manifest.

### Changed

- Admin console header is the novapay lockup (pictograph + two-tone wordmark)
  with an icon theme toggle; below 520px the suffix hides and the endorsement
  mark steps down (375px overflow guard).
- Demo login redirects to the app's own base URI (stays inside /demos/blazor/).

## [0.2.0], 2026-08-26

### Changed

- Package renamed: `@sgultom99/novus-design-kit` becomes unscoped
  `novus-design-kit`, published tokenless to the public npm registry
  (registry.npmjs.org). The GitHub Packages 0.1.0 remains a historical artifact.

### Removed

- Third-party marks removed from the npm artifact: `logos/clients/` and
  `logos/schemes/` are repository-only (approved proof-wall use). All
  first-party assets still ship.

## [0.1.0], 2026-08-26

### Added

- Initial release: `tokens.css` (Novus Design System Kit v2 snapshot,
  2026-07-14 SharePoint master) with the full token set and component classes.
- Self-hosted Carlito 400/700 (woff2) beside the stylesheet.
- Official brand assets: master logo and wordmark (6 treatments each), product
  and platform lockups, pictographs (SVG + pre-tinted PNG), client and scheme
  marks, approved photography.
- `js/novus-theme.js`, persisted pre-paint light/dark toggle helper.
- Reference site source (`site/`) with foundations, component catalog, and
  asset index.
