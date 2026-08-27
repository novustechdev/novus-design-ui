# Feature Specification: Product-team feedback round (pre-publish polish)

**Feature Branch**: `main` (feature 004)

**Created**: 2026-08-27

**Status**: Draft

**Input**: Product-team review of the docs site and Admin Kit ahead of the 0.3.0
npm publish. Verbatim items: placeholder labels read as AI-generated ("Row 1 · A");
tab hovered state barely visible in the light theme; button gaps need a defined
standard; action-placement psychology (which side gets which action) belongs in
foundations; a module that suggests components by function (dashboard, forms);
stepper, date picker, calendar, and dropdown are missing from the catalog; the
components overview needs a search bar; the expand/collapse arrow is too small;
the select dropdown arrow sits too close to the far-right edge; component pages
need a mobile/web preview.

## User Scenarios & Testing

### User Story 1 - Catalog covers the components teams ask for (Priority: P1)

A developer looking for stepper, date picker, calendar, or dropdown finds a
dedicated catalog page for each, built by composing the shipped tokens.css
primitives and native platform elements (tokens.css itself is frozen by the
drift gate and MUST NOT change).

**Independent Test**: /components/overview.html lists Stepper, Date picker,
Calendar, and Dropdown; each detail page renders live examples and copyable
snippets; the manifest completeness gate passes both directions.

### User Story 2 - Find components fast (Priority: P1)

The components overview has a search bar that filters the catalog as you type
(name, summary, class names). With JavaScript off the full catalog remains
visible. A "choose by function" module suggests component sets for common jobs
(dashboard, forms, data display, navigation, feedback) with links.

**Independent Test**: Typing "date" hides non-matching cards and leaves Date
picker visible; clearing restores all; the function module lists at least five
jobs, each linking only to existing pages (link gate).

### User Story 3 - Polished interaction details (Priority: P1)

Tab hover is clearly visible in the light theme (background tint plus color
shift). The expand/collapse arrow is comfortably sized. The select dropdown
arrow sits inset from the right edge, not flush against it. Adjacent buttons
never touch: the standard gap is defined and documented.

**Independent Test**: Visual pass at 1300px light theme: tab hover shows a
visible tint; the disclosure chevron is at least as tall as the body text; the
select chevron has visible inset from the field edge; two sibling buttons
outside a .row still have a gap.

### User Story 4 - Action placement guidance (Priority: P2)

A foundations page explains action placement psychology: which action goes
far-left vs far-right in forms, dialogs, wizards, and tables, plus the standard
button gap and one-primary-per-view rule.

**Independent Test**: The foundations sidebar lists the page; content covers
forms, dialogs/wizards, destructive actions, and gap tokens.

### User Story 5 - Mobile/web preview on component pages (Priority: P2)

Every component detail page offers a Web / Mobile preview toggle; Mobile
constrains the live demos to a 375px frame. Works without JavaScript (native
radio inputs, same pattern as the Admin Kit tabs).

**Independent Test**: Selecting Mobile narrows every demo on the page to a
375px frame; selecting Web restores full width; with JS off the default (Web)
renders and the toggle still works (radio + :has).

### Edge Cases

- Placeholder copy MUST NOT read machine-generated: demo labels like
  "Row 1 · A" are replaced with plain realistic labels. The middle dot stays
  ONLY where the design system itself mandates it (self-describing chips
  "Status · Active", title separators, the footer credit): those are locked
  conventions, not placeholder copy.
- tokens.css is byte-frozen (drift gate): all new components are compositions
  of existing classes, token-valued inline styles, and native elements
  (input type="date", select, details) layered in site CSS, never new rules in
  tokens.css.
- Select arrow styling cannot use gradients (gradient gate) or hex data-URIs
  (hex gate): the chevron is border-drawn in a wrapper pseudo-element.
- New catalog count replaces every hardcoded "22" (landing badge, feature card,
  README) — count is stated from the manifest length where generated.

## Requirements

- **FR-001**: Demo placeholder labels MUST NOT use the middle-dot pattern or
  read as machine-generated; grid-row demo relabeled with plain item labels.
- **FR-002**: Tab labels MUST show a visible hover state in both themes:
  background tint (--bg-subtle) plus text color shift, applied to the docs site
  and both Admin Kit flavors plus the WASM demo.
- **FR-003**: The standard button gap MUST be defined (row gap --space-3;
  adjacent bare buttons get an automatic --space-2 fallback gap) in site and
  admin CSS, and documented on the Button page and the new foundations page.
- **FR-004**: A foundations page "Actions and placement" MUST document: one
  primary per view; forms lead with the primary on the left; dialog and wizard
  footers put the primary far-right with cancel to its left; destructive
  actions sit apart (far-left in footers) and use the danger variant;
  gap standards.
- **FR-005**: Four new catalog components MUST ship as composition pages:
  Dropdown (native select + .select, plus a details-based menu pattern),
  Date picker (native input type="date" + .input), Calendar (month grid
  composed from the table component), Stepper (numbered progress composed from
  badges/flex with token-valued styles). Manifest entries, fragments, sidebar,
  overview cards, and both gate directions complete.
- **FR-006**: The components overview MUST have a client-side search filter
  over name, summary, and class names; with JavaScript off the full catalog
  stays visible.
- **FR-007**: The overview MUST include a "choose by function" module
  suggesting component sets for at least: dashboards, forms, data display,
  navigation, feedback/status; every suggestion links to an existing page.
- **FR-008**: The disclosure (expand/collapse) chevron MUST be enlarged to a
  clearly visible size in docs and admin consoles (native summary marker and
  the .disclosure-ic glyph).
- **FR-009**: Select elements MUST render their dropdown arrow inset from the
  right edge via a border-drawn chevron wrapper (.selectwrap), applied across
  docs demos and both Admin Kit flavors plus the WASM demo.
- **FR-010**: Component detail pages MUST offer a Web/Mobile preview toggle
  (native radios + :has, JS-off safe) that constrains demos to a 375px frame
  in Mobile mode.
- **FR-011**: All hardcoded catalog counts MUST be updated to the new count
  (landing page badge and copy, README).

## Success Criteria

- **SC-001**: Overview lists 26 components; the 4 new detail pages render with
  live examples and snippets; manifest gate passes.
- **SC-002**: Search filters the overview live; JS-off shows the full catalog.
- **SC-003**: Visual pass confirms tab hover tint (light theme), enlarged
  disclosure chevron, inset select arrow, and button gap fallback.
- **SC-004**: Foundations sidebar carries "Actions and placement"; link gate
  passes for the function module and all new pages.
- **SC-005**: Mobile preview constrains demos to 375px on every component page;
  all 15+ gates green; deployed and verified live.

## Assumptions

- tokens.css stays byte-identical (drift gate); everything layers in SITE_CSS,
  admin.css, fragments, and build.mjs.
- The kit's component count changes from 22 to 26; this is a docs-catalog
  change, not a packaged-artifact change (tokens.css already carries .select,
  .input, .table, .badge used by the new pages).
- Native input type="date" is the sanctioned date-picking control (platform
  feature over re-implementation, constitution Principle III); Calendar is a
  presentation pattern, not an interactive widget.
