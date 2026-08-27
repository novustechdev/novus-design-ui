# Feature Specification: Admin Kit charts, data grids, live demos; full-width docs

**Feature Branch**: `main` (feature 003)

**Created**: 2026-08-27

**Status**: Draft

**Input**: Owner request: full-width edge-to-edge docs layout on desktop (responsive,
PWA-ready mobile); proper vertical spacing between headings, text, inline code, code
blocks, and images; Analytics (charts) and Data Grid screens in both admin kit
flavors; admin kit docs screenshots clickable, redirecting to live demo apps hosted
with the site (demos included in the repository); custom domain ui-kit.novustech.dev
via Cloudflare.

## User Scenarios & Testing

### User Story 1 - Read the docs comfortably on any screen (Priority: P1)

On a desktop browser the docs site (and the admin consoles) use the full viewport
width with side gutters only; on mobile everything remains clean at 375px. Content
blocks have visible breathing room: headings do not sit flush on the previous
paragraph, code blocks and images have clear top/bottom spacing.

**Independent Test**: At 1920px wide, no fixed page column narrower than the
viewport minus gutters; at 375px, no horizontal scroll; spacing between a code
block and the following heading is a visible token-scale gap.

### User Story 2 - Explore charts and data grids in both flavors (Priority: P1)

Both admin kit flavors gain an Analytics screen (transaction volume by product per
hour: stacked composition bars plus a total trajectory line, styled per the locked
Novus chart rules) and a Data Grid screen (all transactions: sortable columns,
pagination, text search; Blazor uses QuickGrid, Tailwind a lightweight enhanced
table). Same dataset in both.

**Independent Test**: Run each flavor; the two new screens render with token-fed
chart styling and a working sortable/paginated/searchable grid; series colours are
the product accents; no colour literals in authored code.

### User Story 3 - Click through to live demos (Priority: P2)

On the docs Admin Kit page, every screenshot and an explicit button per flavor
link to a live, hosted demo (Tailwind static build and a Blazor WebAssembly demo)
served under /demos/ on the docs host.

**Independent Test**: From the live docs page, clicking a flavor's screenshot opens
its running demo in the browser; all demo screens navigate.

### User Story 4 - Reach the site at ui-kit.novustech.dev (Priority: P2)

The docs site (and demos) are served at https://ui-kit.novustech.dev with HTTPS,
via a Cloudflare DNS record pointing at GitHub Pages; documented URLs use the
custom domain.

**Independent Test**: The domain resolves, serves the site with a valid
certificate, and the old github.io URL redirects.

### Edge Cases

- Blazor Server cannot be hosted statically: the live demo is a WebAssembly twin of
  the same screens (client-rendered; the copyable flavor remains the Server app with
  JS-off content). The demo requires JavaScript and says so if scripts are off.
- Demo builds missing locally: the site build copies demos only when their build
  output exists; the deploy workflow always builds them, and the link gate fails if
  a linked demo page is absent from the built site.
- Chart canvas needs concrete colours: values are read from tokens at runtime
  (getComputedStyle), never copied literals; theme flips re-read them.
- Prose readability: full-width layout keeps a readable measure on long paragraphs;
  tables, grids, code, and demos stretch.

## Requirements

- **FR-001**: Docs site shell and admin console shells MUST be full-width fluid on
  desktop (gutters only, no fixed max-width container), mobile-first responsive; the
  docs site MUST ship a web app manifest and theme-color meta.
- **FR-002**: Docs pages MUST have token-scale vertical rhythm: top margins on h2/h3
  following content, block spacing around standalone code blocks, figures, images,
  tables, and bullet lists.
- **FR-003**: Both flavors MUST add an Analytics screen implementing the locked
  Novus chart rules with Chart.js, colours and fonts read from tokens at runtime;
  primary series shows composition (stacked bars by product) and trajectory (total
  line).
- **FR-004**: Both flavors MUST add a Data Grid screen over the full transactions
  set: column sorting, pagination (10 per page), and text search; Blazor via
  QuickGrid, Tailwind via a progressive enhanced table (full static table when
  JavaScript is off); kit-token styling in both.
- **FR-005**: The shared dataset MUST gain hourly volume-by-product series consumed
  by both flavors through the existing generator (parity preserved).
- **FR-006**: Live demos MUST be hosted under /demos/tailwind/ and /demos/blazor/ on
  the docs site: the Tailwind flavor's static build, and a Blazor WebAssembly demo
  application (in the repository) implementing the same screens.
- **FR-007**: The Admin Kit docs page MUST link every flavor screenshot and a
  per-flavor button to its live demo; new screens' screenshots added; verification
  record updated for the new screens and demos.
- **FR-008**: The deploy workflow MUST build both demos and the site so the
  published site always contains working /demos/; the link gate MUST cover the
  demo entry pages.
- **FR-009**: The site MUST be served at https://ui-kit.novustech.dev (Cloudflare
  CNAME to GitHub Pages, HTTPS enforced); documented absolute URLs (README, guides,
  release notes going forward) switch to the custom domain.

## Success Criteria

- **SC-001**: At 1920px, docs content area width ≥ viewport minus 2 gutters; at
  375px, scrollWidth == 375 on docs and both consoles.
- **SC-002**: Both flavors render Analytics and Data Grid screens from the shared
  dataset; zero colour/font literals in authored chart or grid code.
- **SC-003**: From the live docs Admin Kit page, 2/2 demo links open running demos.
- **SC-004**: https://ui-kit.novustech.dev serves the site with valid HTTPS.
- **SC-005**: All gates green, including link coverage of demo entry pages.

## Assumptions

- Chart.js is the sanctioned library (the design system's chart rules are written
  for it); pinned per flavor at the version verified.
- The Blazor WASM demo is demo-only; the copyable Blazor flavor stays Server-based
  (JS-off requirement holds for the flavor, not the hosted demo).
- Cloudflare API token provided by the owner at execution time creates the CNAME;
  the zone novustech.dev already exists in the owner's Cloudflare account.
- PWA basics = manifest + icons + theme-color (no service worker in this feature).
