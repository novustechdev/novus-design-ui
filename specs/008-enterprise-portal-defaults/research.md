# Research: Enterprise portal defaults (feature 008)

Sources: the owner's feedback on novabank.novustech.dev (2026-09-23); live
capture of novacard.novustech.dev/signin, novahub.novustech.dev and
novabank.novustech.dev/login; the feature 007 console layer; constitution
1.11.0; measurements of the kit's own demos.

## R1. Delivery: the console layer has to be in the package

- **Measurement**: the published package lists `tokens.css`, `fonts/`, `logos/`,
  `photos/`, `js/`. Feature 007's console layer lives in `admin-kits/shared/`
  and never reaches npm, so novabank-py cannot inherit the filter bar by
  upgrading its pin. Feedback item 4 is a delivery problem, not a design one.
- **Decision**: the parity generator emits packaged artifacts at the repository
  root (`console.css`, `js/novus-console.js`, `icons/novus-icons.svg`) from the
  same source it already copies into the flavors, and `package.json` ships them.
  Release 0.4.0; the npm publish stays with the owner.
- **Rationale**: one source stays the source; consumers get the patterns by
  upgrading; `tokens.css` stays byte-frozen against the master, which the
  upstream-diff rule requires.
- **Alternatives**: a second npm package (more moving parts, same release
  burden); documentation-only copy paste (what 007 effectively left behind).

## R2. Theme default

- **Decision**: with no stored choice, apply `data-theme="light"` before paint.
  Dark comes only from the user's choice, which persists. Following the
  operating system becomes an opt-in: a consumer sets
  `window.novusThemeFollowOS = true` before the theme script, and the kit keeps
  its `prefers-color-scheme` rules for that case.
- **Rationale**: the owner asked for light everywhere; today a dark-set
  operating system flips portals on first visit.
- **Constitution impact**: Principle IV's dual-trigger wording becomes
  "dual-trigger dark rules, light default, persisted choice", with the
  operating-system path documented as opt-in.

## R3. Charting standard moves to D3

- **Decision**: one chart source for every deliverable,
  `admin-kits/shared/novus-chart.js`, written as a classic script that reads the
  global `d3` and exposes `window.novusChart`. The Vite flavors import `d3`,
  assign it, then load the shared file; the Blazor flavors copy `d3.min.js` into
  `wwwroot/lib` exactly as they did for Chart.js.
- **Locked rules carry over**: colours and fonts read from tokens at render
  time, soft dashed gridlines at low alpha, rounded bars with constrained
  thickness, no axis borders or tick marks, dark rounded tooltip, composition
  plus trajectory on the primary series.
- **What D3 adds**: hover and keyboard tooltips, a composition donut, and a
  redraw on theme change, all from the same token reads.
- **Fallback**: the table beside the chart carries the same numbers, so a page
  without scripting still answers the question.
- **Alternatives**: keeping Chart.js for standard charts (rejected by the
  owner); a wrapper over both (two stacks to govern).

## R4. Typography parity

- **Measurement** on the current demos: header 16px, navigation 14px, body 14px,
  page title 30px (2.1 times body), stat values 36px.
- **Decision**: the console shell sets header, navigation and body to
  `--text-sm` with `--lh-sm`; the page title drops to `--text-xl` (24px, 1.71
  times body); section headings stay at `--text-lg` (20px, 1.43 times). Stat
  values are data, not headings, and keep their display size.
- **Rationale**: the feedback bans a navbar smaller than content and caps the
  heading jump; equal sizes satisfy both without giving up console density.
- **Alternatives**: raising content to 16px (loses the density decision from
  feature 003 and widens every table).

## R5. Content width

- **Decision**: portal text keeps no reading cap; a deliberate measure is opted
  into with a `.measure` class. The layout audit flags a text block that wraps
  to three or more lines while a quarter or more of its row stays empty, and
  skips anything inside `.measure`, documentation prose, and the existing
  `data-audit="skip"` regions.
- **Rationale**: this is the mirror of the single-line rule from 007; both are
  about content using the space it has.
- **Risk**: false positives on short paragraphs beside floated cards. The
  threshold (three lines and a quarter of the row) was tuned against the
  current docs and demos, which pass clean.

## R6. Sign-in layout and ambient motion

- **Decision**: 50/50 split at 900px and above (the reference sits at 45/55),
  flat `--blue-900` ground, ambient line art in SVG on slow loops (13s traces,
  9s marks, matching novacard's timings), stopped under reduced motion, plus a
  single sign-on action under a labelled divider. No theme toggle on the page.
- **Gradient**: novacard's panel uses a radial gradient; the kit's ban stands,
  so the ground stays flat and the motion carries the interest.
- **Constitution impact**: Principle II gains a narrow exception for ambient
  authentication art, alongside the existing exception for the deep brand
  ground added in 1.11.0.

## R7. Settings layout

- **Decision**: a section menu beside grouped sections, each section a list of
  rows carrying label, description and one control. Native anchors plus
  `:target` for section switching so it works without scripting; on phones the
  menu becomes a scrolling row above the sections.
- **Rationale**: the tab strip suited four small panels; enterprise
  configuration needs named groups, scannable rows and room for help text.
- **Alternatives**: keeping tabs (does not scale past a handful of groups);
  accordions (hides the shape of the configuration).

## R8. Account menu placement

- **Measurement**: the kit already ends the header with the account menu, 24px
  (one gutter) from the viewport edge. The complaint is about novabank's own
  portal.
- **Decision**: keep the order, and add a gate so no element can ever be placed
  to the right of the account menu in a console header.

## R9. Gates

- **New checks** in `scripts/layout-audit.mjs`: account menu is the last header
  element and within one gutter of the edge; header, navigation and body font
  sizes match and headings respect their ratios; text blocks do not wrap while
  leaving a quarter of their row empty.
- **New check** in `scripts/gates.sh`: the package version, the README and the
  CHANGELOG agree, so a release cannot ship half-renamed.
