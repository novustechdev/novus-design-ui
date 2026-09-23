# Changelog

All notable changes to `novus-design-kit` and its repository (reference docs site,
Novus Admin Kit). Format follows [Keep a Changelog](https://keepachangelog.com/);
versioning is semantic. Each release records both the npm artifact and the
repository around it; when the packaged kit files are unchanged, the entry says so.

## [Unreleased]

## [0.5.0], 2026-09-23

Two mandatory corrections to the console patterns (feature 009, constitution
1.13.0). Packaged kit files change, so portals pick both up by upgrading.

### Changed

- Collapsing a console's side navigation now leaves a rail of icons instead of
  hiding it. Every destination keeps an icon at a 44px target, the current page
  keeps the accent treatment, and each icon names its destination on hover and
  to assistive technology. Group labels and chevrons step aside in the rail and
  their children show as icons, so nothing hides behind a collapsed group. The
  drawer below 900px is unchanged.
- Sign-in moves to the kit's near-white ground. The deep brand panel is gone,
  the ambient line art is retinted for a light surface and still stops under
  reduced motion, the lockup returns to its normal light treatment, and the
  credential card gains a border so it stays separate from the page. With this,
  the tinted-ground exception for authentication screens is withdrawn: every
  screen now sits on a neutral ground.
- Every navigation destination carries an icon, including items inside groups.

### Governance

- Constitution 1.13.0; gates 16 (collapsed navigation shows an icon rail) and
  17 (sign-in ground is near-white), both negative-tested.


## [0.4.0], 2026-09-23

### Added

- The console layer ships in the package: `console.css`, `js/novus-console.js`
  and `icons/novus-icons.svg`. A portal now inherits the Novus console patterns
  (sign-in, shell, side navigation, page header, filter bar, list footer,
  settings layout, charts, content fit) by upgrading, instead of copying files
  out of the repository.
- Settings layout: a section menu beside grouped sections of labelled rows,
  replacing the card grid and tab strip on configuration screens.
- Charts move to D3 (the kit's charting standard, replacing Chart.js) with the
  locked Novus chart rules, hover and keyboard tooltips, theme redraw, and a
  table of the same numbers for pages without scripting. The Admin Kit landing
  page carries interactive statistics.
- Sign-in follows novacard: a 50/50 split at full width, ambient line art on
  the flat brand ground (the one decoration the kit allows, stopped under
  reduced motion), and single sign-on beside the password form.
- Date range category in the filter sheet, for audit-style screens.

### Changed

- Light is the default theme everywhere, including sign-in. Dark comes only
  from the user's choice and persists; following the operating system is an
  opt-in (`window.novusThemeFollowOS`).
- Typography parity in consoles: header, navigation and content share one
  family and size, and headings stay within 1.75x (page title) and 1.45x
  (sections) of body size.
- Portal text uses the width of its row; a reading measure is opted into with
  `.measure`.
- Component catalog grows 40 to 42 (Charts, Settings layout).

### Governance

- Constitution 1.12.0 and four new gates: account menu placement, typography
  parity, content width, and version agreement across package, README and
  CHANGELOG.
- Published to npm on 2026-09-23 (dist-tag latest), so portals inherit the
  console layer by upgrading to 0.4.0.


- Console patterns from the novalending reference (feature 007, constitution
  1.11.0). One shared, token-only pattern layer (`admin-kits/shared/`:
  `novus-admin.css`, `novus-admin.js`, `icons.mjs`) consumed by every Admin Kit
  flavor and by the docs: split sign-in on the deep brand ground, header user
  menu with Sign out and a signed-out page, grouped side navigation with a
  JS-free collapse and phone drawer, page header with breadcrumb and
  end-aligned actions, filter bar with a two-pane sub-filter sheet, active
  chips and quick chips with live counts, list footer pagination with rows
  per page, and an in-house line icon set.
- Single-line content rule: identifiers, names, chips, dates, amounts, and
  headers never wrap; data tables scroll inside `.tablewrap` instead of
  squeezing (`.cell--wrap`, `.cell-stack`, `.cell--actions`, `.truncate`).
  Enforced by a new layout audit gate (`scripts/layout-audit.mjs`, headless
  Chromium at 1440px and 375px over the docs and hosted demos) and a pattern
  parity gate (`node admin-kits/data/generate.mjs --check`).
- Admin Kit: all flavors gain the signed-out page (eight screens), the new
  shell and patterns, and the list footer on Transactions and Data grid; the
  Blazor Server sign-in is now a static form post that works with JavaScript
  off; the WebAssembly demo mirrors the Blazor Server screens by generation.
- Component catalog grows 34 to 40: Sign-in page, Signed-out page (new
  Templates category), User menu, Side navigation, Page header, Filter bar;
  Pagination, Table, Breadcrumb, and App shell updated; component pages show
  their CSS from the shared layer. New foundations: Icons, Alignment and
  content fit. Existing docs pages no longer scroll sideways at 375px.
- Packaged kit files (tokens.css, fonts, logos, photos, js) are unchanged.

- Third Admin Kit flavor: Material (Vite + @material/web 2.x under the Novus
  tokens, the verified Material Web mapping), same screens and dataset as the
  other flavors, hosted at /demos/material/. Material Web components require
  JavaScript.
- Component catalog grows 26 to 34: Tabs, Breadcrumb, Pagination, Progress,
  Skeleton, Empty state, Timeline, Descriptions, all token compositions
  adjusted to Novus foundations (static skeletons, judgement colour only on
  judgements, native radio tabs).
- Mobile prototypes gain the demo provenance bar; Compose mentions removed
  from Android references (the team's stack is Material Components for
  Android).

- Product-team feedback round (feature 004): four new catalog components
  (Dropdown, Date picker, Calendar, Stepper: compositions over the frozen
  tokens), components search bar and a choose-by-function module on the
  overview, Actions and placement foundations page, Web/Mobile preview toggle
  on component pages, tab hover tint, enlarged disclosure chevrons, inset
  select arrows, standard button gaps, and placeholder copy cleanup.
- Mobile foundations (feature 005, constitution 1.8.x): token mappings for
  native Android (Material 3 per m3.material.io via Material Components for
  Android, the View system, per the Android team's stack) and iOS
  (SwiftUI + HIG) as foundations pages, enforced by a new mobile token-parity
  gate (every colour on those pages must exist in tokens.css).
- New verified web theme guide: Material Web (@material/web 2.5.0), mapping
  MD3 system tokens to Novus variables in one CSS file.
- Mobile reference screens: novapay dashboard renderings (light and dark)
  for Android and iOS built purely from tokens.css, embedded on the foundation
  pages with widget-for-widget starter code (activity_dashboard.xml; SwiftUI
  DashboardView) and default component themes (Widget.Novus.* styles; SwiftUI
  view modifiers).
- Live mobile HTML prototypes at /demos/mobile/android/ and /demos/mobile/ios/:
  four tappable screens per platform on native radio navigation (JS-off safe),
  filter chips, working segmented control, theme toggle, and a native detail
  sheet; linked from the foundation pages.
- Process: no direct commits to main; feature branch + PR with the new PR
  gates workflow (constitution 1.9.0).
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
