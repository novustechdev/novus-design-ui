# Research: Admin patterns from the novalending reference (feature 007)

Sources: live walk of https://v2.1nflow.co (tenant-admin test account,
2026-09-15) at 1440px and 375px, light and dark, with DOM, computed-style and
stylesheet capture; the repository's constitution 1.10.0, tokens.css, the three
Admin Kit flavors, the WASM demo, site/build.mjs and scripts/gates.sh.

## R1. Where the single-line rule lives

- **Decision**: A shared console pattern layer, `admin-kits/shared/novus-admin.css`,
  carries the content-fit rules: `.badge` (and the new chips) never wrap, as
  `.btn` already does in tokens.css; every cell of a
  `.table` inside a `.tablewrap` scroll container is single-line; `.cell--wrap`
  opts a free-text column back into wrapping at a readable minimum width;
  `.truncate` gives one-line ellipsis for fixed slots. The docs site loads the
  same file on every page, so catalog examples and the Admin Kit render the
  same way.
- **Rationale**: tokens.css is byte-frozen against the design-system master
  (constitution I, CONTRIBUTING), so the rule cannot be added there by this
  repository. Scoping table nowrap to `.tablewrap` means it only applies where
  the author has provided a horizontal scroll container, so a bare table can
  never push a page into horizontal scroll.
- **Root cause observed**: novalending renders `.table` at `width:100%` inside
  an overflow container with wrapping cells, so the browser shrinks columns to
  fit before it ever scrolls: "LOS-2026-000005" wraps at the hyphen, "Maya
  Puspita Sari" takes three lines, the "In verification" chip becomes a
  two-line pill, and at 375px columns collapse to one word each.
- **Follow-up (owner)**: propose upstreaming `.btn`/`.badge` nowrap and the
  scroll-container table rule into the tokens.css master so consumers who do
  not load the pattern layer also get it. Recorded in the PR description.
- **Alternatives considered**: editing tokens.css (violates the freeze);
  per-flavor rules (drift; the defect would return in the next app); a
  `table-layout:fixed` grid with truncation everywhere (hides data, breaks
  numeric scanning).

## R2. One source of truth for console patterns

- **Decision**: `admin-kits/shared/` holds `novus-admin.css` (all console layout
  and patterns, token-only), `novus-admin.js` (generic progressive behaviour:
  drawer close on navigation, Escape and outside-click dismissal, password
  visibility) and `icons.mjs` (the icon set). `admin-kits/data/generate.mjs`
  copies the CSS and JS into each flavor, injects the shared header and side
  navigation into the static pages between SHELL markers, emits an `Icon.razor`
  component for both Blazor projects, and gains a `--check` mode that fails
  when any emitted file differs. The docs build reads the same CSS (pattern
  sections shown on component pages) and the same icon module (Icons page).
- **Rationale**: Principle VII requires strict parity; the existing admin.css was
  already hand-copied into four places. Copies by construction plus a check gate
  make drift impossible to merge, and the docs cannot show a pattern that the
  Admin Kit does not ship.
- **Alternatives considered**: shipping the layer in the npm package (the
  package must diff clean against the upstream master, and a release would need
  the owner's passkey before the kits could consume it); symlinks (break on
  Windows clones and in Blazor static web assets); a CSS `@import` across
  folders (Vite and Blazor static assets resolve outside roots differently).

## R3. Sign-in layout

- **Decision**: Adopt the reference split: `.authpage` sets the page ground to
  `--blue-900` in both themes; `.authbrand` panel (lockup in the dark-lockup
  treatment, tagline, module chips) and `.authmain` with `.authcard`
  (pictograph mark, left-aligned title and sub-copy, small-caps labels with
  `.field__req`, filled inputs, `.pwgroup` + `.pwtoggle`, inline `.field__error`,
  full-width primary, forgot disclosure, "Managed by" foot). Row layout from
  900px; stacked below.
- **Constitution impact**: Principle II forbids tinted page grounds. The deep
  brand ground on authentication screens is a solid, flat brand surface (no
  gradient, no glow) and is the owner's chosen reference, so constitution 1.11.0
  scopes an explicit exception to authentication screens only.
- **Forgot password**: a native `details` disclosure styled as the centred
  link, revealing "In this sample, password resets are handled by your
  administrator." Works with JavaScript off and is not placeholder copy.
- **Password toggle**: a real button inside the input group; shown only under
  `@media (scripting: enabled)` so JS-off pages never show a dead control;
  `aria-pressed` and the label swap between "Show password" and "Hide password".
- **Blazor Server**: the sign-in page moves from InteractiveServer to a static
  SSR form post (`@formname`, `[SupplyParameterFromForm]`, antiforgery), so it
  works with scripting off and keeps the typed username on error. The WASM demo
  stays interactive (it requires JavaScript by nature).
- **Material flavor**: same layout; Material Web filled text fields
  (`md-filled-text-field`, the MD3 filled variant matches the filled-input
  reference) with the kit `.pwtoggle` in the trailing-icon slot.
- **Alternatives considered**: keeping the centred card on white (not the
  reference); a gradient hero panel (Principle II).

## R4. User menu and sign-out

- **Decision**: `details.userdd` in the header end cluster (person icon, name
  with `.truncate`, chevron). Panel: identity block, Theme row with the existing
  persisted toggle, foot with a Sign out link-button to the signed-out page.
  The theme toggle leaves the header bar (reference placement). Signed-out page:
  `.signedout` centred card on `--bg`, as captured.
- **Rationale**: `details` opens with JS off (Principle IV); `novus-admin.js`
  adds outside-click and Escape dismissal.
- **Alternatives considered**: `popover` attribute (good, but the reference
  panel anchors under the trigger and anchor positioning is not yet baseline);
  a dialog (needs JS to open).

## R5. Side navigation, drawer, and collapse without JavaScript

- **Decision**: A visually hidden checkbox `#navtoggle` precedes the header; the
  header's menu button is its `label`. From 900px, checked collapses the
  sidebar (grid drops to one column). Below 900px the sidebar is an off-canvas
  drawer; checked slides it in, and a `label.navscrim` covers the page and closes
  it. Groups are `details.navgroup` with an uppercase label, a line icon, and a
  rotating chevron; the group holding the current page renders `open`.
  `novus-admin.js` unchecks the toggle when a drawer link is followed (needed
  for client-side routing in the WASM demo and enhanced navigation in Blazor
  Server) and on Escape.
- **Rationale**: Same native-input pattern as the kit's radio tabs; one control,
  two behaviours, zero JavaScript required.
- **Collapse persistence**: not persisted across page loads in this feature
  (documented); the desktop default is expanded.
- **Touch targets**: nav rows are 2.25rem on fine pointers (reference density)
  and 2.75rem under `(pointer: coarse)` (Principle IV).
- **Alternatives considered**: `dialog.navdrawer` as in the reference (needs JS
  to open); `popover` (UA styles hide it at desktop width unless overridden).

## R6. Filter bar with sub-filters

- **Decision**: `.filterbar` = optional `.quickchips` (native radios with live
  counts), `.filterbar__top` (search with icon taking the remaining width, then
  `details.filtermenu` whose summary is the trigger with an active count), and
  `.filterchips` (removable active chips plus Clear all). The sheet is a
  two-pane grid: `.filtermenu__tabs` (native radios as vertical tabs) and
  `.filtermenu__panels`; the checked tab shows the panel in the same position
  via `:has()` and `:nth-child` (generic for up to six categories, no ids).
  Options are native checkboxes. Below 40rem the tabs wrap above the panel.
- **Transactions categories**: Product (3), Terminal (12, scrolling list), Amount
  (Under 200, 200 to 499.99, 500 and above). Quick chips: Status (All, Settled,
  Pending, Failed) with counts computed over the records matching search and
  sheet filters. Status stays out of the sheet so the two controls never
  disagree.
- **Behaviour**: static flavors filter with progressive JavaScript over the
  complete JS-off table; Blazor flavors bind to component state.
- **Alternatives considered**: separate selects in a no-wrap row (the
  reference's simpler lists; documented as the compact variant); status in both
  chips and sheet (conflicting state).

## R7. List footer pagination

- **Decision**: `.listfooter` = `.listfooter__range` ("Showing 1-10 of 24") and
  `.listfooter__controls` (`.paginator` with icon buttons 2.75rem square and the
  "Page n of m" label, then a rows-per-page `.selectwrap` select: 10, 20, 50).
  Blazor QuickGrid's built-in `Paginator` is replaced by a shared `ListFooter`
  component bound to `PaginationState`, so all flavors render identical markup.
- **Alternatives considered**: numbered page buttons (kept on the Pagination
  page as the long-document variant); QuickGrid's Paginator (different markup
  and copy per stack).

## R8. Icons

- **Decision**: One line style: 24-unit square grid, stroke 2, round caps and
  joins, `fill="none"`, `stroke="currentColor"`, rendered at 16, 20 or 24px
  (`.icon--sm`, `.icon`, `.icon--lg`). Drawn in-house as simple geometry (menu,
  close, chevrons, search, filter, user, sign-out, sun, moon, eye, eye-off,
  dashboard, chart, transactions, grid, terminal, settings, workspace, plus,
  download, check) so no third-party licence or request is involved. Decorative
  icons carry `aria-hidden="true"`; icon-only controls carry an accessible name.
- **Reference check**: novalending mixes 16-unit/1.5 and 24-unit/1.7 strokes;
  24/2 at 16 to 24px renders 1.33 to 2px strokes, matching its visual weight
  while giving one grid.
- **Alternatives considered**: an icon font (extra request, poor accessibility,
  not token-coloured); a third-party set (licence notice obligations in every
  copied snippet; the kit would not own the drawings).

## R9. Automated layout audit

- **Decision**: `scripts/layout-audit.mjs` serves `site/dist` locally (SPA
  fallback for /demos/blazor/), opens every catalog and foundations page and
  every Admin Kit demo route at 1440x900 and 375x812 in headless Chromium via
  `playwright-core`, and fails on (a) any audited element whose own text is 40
  characters or fewer rendering on more than one line, measured by grouping the
  client rects of its text nodes by line, and (b) any page whose document
  scroll width exceeds the viewport at 375px. Audited scope: `.demo__canvas` on
  docs pages, the whole document on demos; skipped: paragraphs, headings,
  `.cell--wrap`, `pre`, and anything under `[data-audit="skip"]` (used for
  deliberate "wrong" examples). Table cells are audited at any length.
- **Wiring**: `scripts/gates.sh` runs it; if `playwright-core` or a browser is
  missing it prints SKIP locally but FAILS when `CI=true`. Both workflows
  install `playwright-core` without saving and use the runner's Chrome
  (`channel: "chrome"`); locally `CHROME_PATH` points at any Chromium.
- **Alternatives considered**: static CSS lint (cannot see rendered wrapping);
  screenshot diffing (brittle, no element attribution).

## R10. Governance

- **Decision**: Constitution 1.10.0 to 1.11.0 (MINOR): Principle IV gains the
  content-fit rule; Principle VII names novalending as the console pattern
  reference, lists the required console patterns, requires the single shared
  pattern layer, and scopes the deep brand ground to authentication screens;
  Design Standards gain the icon style; Quality Gates gain 10 (pattern parity
  via `generate.mjs --check`) and 11 (layout audit).
