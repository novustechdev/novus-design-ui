# Feature Specification: Enterprise portal defaults

**Feature Branch**: `feature/008-enterprise-portal-defaults` (feature 008)

**Created**: 2026-09-23

**Status**: Draft

**Input**: Owner feedback round on the novabank operator portal
(novabank.novustech.dev), relayed 2026-09-23, with the instruction to make the
result the mandatory design system in novus-design-kit (foundations, sample
pages, components) the way feature 004 handled the previous feedback round.
Eight verbatim items, numbered below as F1 to F8.

## Owner feedback, verbatim intent

- **F1**: the profile/account dropdown in the navbar must sit at the far right
  edge, matching novahub's placement. Mandatory.
- **F2**: body content must not wrap into many rows when it could fit in one or
  a few. The Dashboards landing page wraps its descriptive text across several
  rows while the space to its right goes unused.
- **F3**: navbar and content typography must share the same family and size.
  Mandatory. The navbar must never be smaller than the content. Headings are
  the exception, and even they must not jump too far from body size.
- **F4**: the filter and search bar placement on the audit page is messy. The
  reference is the novalending applications screen.
- **F5**: the login page follows novacard's layout and its canvas animation,
  rebalanced to a 50/50 split at full width. No theme toggle on the login page.
  The form stays in a card, as novabank has it today, and gains an SSO option.
- **F6**: the default theme is light, on the login page and everywhere after
  sign-in.
- **F7**: the post-login landing page carries more interactive visual
  statistics and analytics: charts and tables built with D3.js.
- **F8**: the account page is a flat grid of cards today. It must read as a
  settings, preferences and enterprise-configuration page: a menu or grouped
  sections, not a card grid.

## Reference capture (2026-09-23)

- **novacard** (novacard.novustech.dev/signin): 45/55 split, deep brand panel
  with animated line art (SVG paths on 13s and 9s loops, plus a slow diamond
  mark), credential card on the right, theme toggle in the page foot. The panel
  ground is a radial gradient, which this kit does not allow.
- **novahub** (novahub.novustech.dev) and **novabank**
  (novabank.novustech.dev/login): the same split sign-in, novabank already
  offering "Continue with single sign-on" under a divider.
- **novabank portal**: `/dashboard`, `/audit` and `/account` redirect to the
  login page without credentials, so the authenticated screens behind F2, F7
  and F8 were not inspected. The patterns below are written from the owner's
  description and from the novalending reference captured in feature 007.
- **The kit today**: console header runs at 16px while console content runs at
  14px (F3 inverted, navbar larger); the user menu is already the last element
  in the header, 24px from the viewport edge (F1 satisfied by the kit, not by
  novabank); the filter bar, list footer and content-fit rules from feature 007
  answer F4 but ship only inside this repository, so no consumer can inherit
  them by upgrading the package.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A portal inherits the patterns by upgrading (Priority: P1)

A developer on novabank-py upgrades `novus-design-kit`, imports the console
stylesheet, and gets the governed sign-in, header, navigation, filter bar, list
footer and content-fit rules without copying anything out of this repository.

**Why this priority**: the owner's instruction is that consumers inherit these
patterns rather than reinvent them per app. Today the console layer is
repository-only, so every other item in this list would stay unreachable.

**Independent Test**: pack the kit, install the tarball into an empty project,
import the console stylesheet and script, paste a documented snippet, and see
the pattern render with no other files copied.

**Acceptance Scenarios**:

1. **Given** a clean project, **When** it installs the published kit and
   imports the console stylesheet after the tokens, **Then** the sign-in,
   header, navigation, filter bar, list footer, settings layout and content-fit
   rules all apply.
2. **Given** the packaged kit, **When** its file list is inspected, **Then** it
   carries the console stylesheet, the console script and the icon set, and
   `tokens.css` is byte-identical to the design-system master.
3. **Given** the release, **When** the version is read from the package, the
   README and the CHANGELOG, **Then** all three agree.

---

### User Story 2 - One typographic voice across the shell (Priority: P1)

An operator reads a console screen. The navigation, header and page content are
set in the same family at the same size, and headings sit close enough to body
text that the page reads as one document rather than a poster stapled to a
table.

**Why this priority**: F3 is mandatory and affects every screen in every portal.

**Independent Test**: measure the rendered font size of the header, the
navigation links and the page body on every Admin Kit screen; compare heading
sizes against body size.

**Acceptance Scenarios**:

1. **Given** any console screen, **When** the header, navigation and body are
   measured, **Then** all three use the kit typeface at the same computed size.
2. **Given** any console screen, **When** a heading is measured against body
   text, **Then** the page title is at most 1.75 times body size and section
   headings at most 1.45 times.
3. **Given** a change that shrinks the navbar below content size, **When** the
   gates run, **Then** they fail and name the element.

---

### User Story 3 - Content uses the width it has (Priority: P2)

An operator opens the landing page. The description under the title runs across
the width available to it instead of stacking into a narrow column while half
the row sits empty, and dense screens keep their one-line content rule from
feature 007.

**Why this priority**: F2 is the visible complaint on the landing page and the
counterpart to the single-line rule already in the constitution.

**Independent Test**: render every Admin Kit and catalog page at 1440px and
375px; flag any text block that wraps three or more lines while a quarter or
more of its row stays unused.

**Acceptance Scenarios**:

1. **Given** a page description beside empty space, **When** it renders at
   1440px, **Then** it uses that space rather than wrapping early.
2. **Given** a text block with a deliberate reading measure (prose pages),
   **When** the audit runs, **Then** it is not flagged, because the rule
   applies to portal screens, not to documentation prose.
3. **Given** a regression that caps a portal description at a narrow column,
   **When** the gates run, **Then** the layout audit fails and names the page.

---

### User Story 4 - Sign in on the novacard layout (Priority: P2)

A user opens a portal sign-in page: a 50/50 split at full width, brand panel on
one side with calm ambient motion, credential card on the other with password
sign-in and single sign-on, no theme toggle anywhere on the page, rendered
light.

**Why this priority**: F5 and F6 cover the first screen every user sees.

**Independent Test**: open the sign-in page in each Admin Kit deliverable at
1440px and 375px, with a dark-set operating system, with reduced motion, and
with scripting disabled.

**Acceptance Scenarios**:

1. **Given** a 1440px viewport, **When** the sign-in page renders, **Then** the
   brand panel and the credential side each take half the width.
2. **Given** the brand panel, **When** it renders, **Then** its line art
   animates on a slow loop over a flat brand ground, with no gradient.
3. **Given** `prefers-reduced-motion: reduce`, **When** the page renders,
   **Then** the ambient motion stops.
4. **Given** the sign-in page, **When** it renders, **Then** it offers a
   single sign-on action beside the password form and shows no theme toggle.
5. **Given** an operating system set to dark and no stored choice, **When** any
   portal page renders, **Then** it renders light.
6. **Given** a user who picks dark in the user menu, **When** they return,
   **Then** the portal renders dark until they change it back.

---

### User Story 5 - A landing page that shows the numbers (Priority: P2)

An operator lands after sign-in on a page of interactive statistics: charts
that respond to hover and selection, and a table beside them, all drawn with
D3 under the kit's locked chart rules.

**Why this priority**: F7 asks for the landing page to carry the analytics, and
the decision to standardise on D3 replaces the current charting stack.

**Independent Test**: open the landing page in each deliverable, hover a series,
change the theme, and confirm the chart redraws from tokens.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** it renders, **Then** it shows at least
   one composition chart, one trajectory over time, and a table of the same
   data.
2. **Given** a chart, **When** the pointer rests on a mark, **Then** a token-
   styled tooltip names the series and value; keyboard focus does the same.
3. **Given** a theme change, **When** the chart redraws, **Then** every colour
   is read from the tokens at render time, with no colour literal in the code.
4. **Given** the kit, **When** its charting code is inspected, **Then** it uses
   D3 and no Chart.js remains in the Admin Kit or its documentation.

---

### User Story 6 - Settings that read as configuration (Priority: P3)

An administrator opens the account screen and sees grouped configuration
sections with a section menu, each row naming a setting, describing it, and
carrying its control, instead of a grid of cards.

**Why this priority**: F8 is a single screen, but it sets the pattern every
enterprise portal repeats for preferences and configuration.

**Independent Test**: open the settings screen in each deliverable at both
widths, move between sections, and confirm the rows keep one control per row
with its label and description.

**Acceptance Scenarios**:

1. **Given** the settings screen, **When** it renders at 1440px, **Then** a
   section menu sits beside grouped sections of setting rows.
2. **Given** a phone, **When** the same screen renders, **Then** the menu
   collapses above the sections and every row keeps its label, description and
   control.
3. **Given** scripting disabled, **When** the screen renders, **Then** the
   sections remain reachable.

### Edge Cases

- A navigation label or a user name longer than the header allows: truncates on
  one line, as in feature 007, and never shrinks the header type.
- A chart with no data: shows the empty state, not an empty axis frame.
- A chart on a phone: keeps its tooltip reachable by tap and does not overflow
  the page.
- Reduced motion: ambient sign-in art, chart transitions and drawer motion all
  stop.
- A portal that wants to follow the operating system theme: documented as an
  opt-out from the light default, not the default.
- A text block that legitimately needs a reading measure (documentation prose,
  long-form notes) is exempt from the width rule and says so in the markup.

## Requirements *(mandatory)*

### Functional Requirements

**Packaging and delivery (F4 premise)**

- **FR-001**: The published package MUST ship the console layer: the console
  stylesheet, its progressive script, and the icon set, alongside the existing
  tokens, fonts, logos, photos and theme script.
- **FR-002**: `tokens.css` MUST stay byte-identical to the design-system master.
- **FR-003**: The kit MUST release as 0.4.0 with CHANGELOG, README, package
  version and site version stamp in agreement, and the npm publish recorded as
  pending until the owner runs it.
- **FR-004**: The documentation MUST show a consumer how to adopt the console
  layer in an existing app in under ten lines of setup.

**Header and navigation (F1)**

- **FR-005**: The account menu MUST be the last element in the console header,
  flush to the container gutter at every width.
- **FR-006**: A release gate MUST fail when any element sits to the right of the
  account menu in the header.

**Typography (F3)**

- **FR-007**: Header, navigation and page content MUST render in the kit
  typeface at the same computed size; the header MUST NOT be smaller than
  content.
- **FR-008**: Console headings MUST stay within 1.75 times body size for the
  page title and 1.45 times for section headings.
- **FR-009**: A release gate MUST fail when header, navigation and body sizes
  diverge, or when a heading exceeds its ratio.

**Content width (F2)**

- **FR-010**: Portal text blocks MUST use the width available in their row;
  a deliberate reading measure MUST be opted into explicitly.
- **FR-011**: A release gate MUST fail when a text block wraps to three or more
  lines while 25% or more of its row is unused, unless the block is marked as a
  reading measure.

**Sign-in (F5) and theme (F6)**

- **FR-012**: The sign-in page MUST be a 50/50 split at 900px and above,
  stacking below that, with the brand panel carrying ambient line art on a flat
  brand ground, no gradient, and no theme toggle on the page.
- **FR-013**: The ambient art MUST stop under `prefers-reduced-motion: reduce`
  and MUST NOT block interaction or shift layout.
- **FR-014**: The sign-in card MUST offer a single sign-on action beside the
  password form, separated by a labelled divider, styled as a secondary action.
- **FR-015**: Portals MUST render light by default, including on the sign-in
  page, regardless of the operating system setting, until the user chooses a
  theme; the choice MUST persist and apply before first paint.
- **FR-016**: Following the operating system theme MUST remain available as a
  documented opt-out.

**Analytics (F7)**

- **FR-017**: The kit's charting standard MUST be D3; Chart.js MUST be removed
  from the Admin Kit, its dependencies and the documentation.
- **FR-018**: The locked Novus chart rules MUST carry over to D3: colours and
  fonts read from tokens at render time, soft dashed gridlines, rounded bars
  with constrained thickness, no axis borders or tick marks, dark rounded
  tooltips, one composition read and one trajectory read on the primary series.
- **FR-019**: The post-login landing page MUST carry interactive statistics:
  hover and keyboard-reachable tooltips, a composition chart, a trajectory
  chart, and a table of the same data.
- **FR-020**: Charts MUST redraw on theme change and MUST degrade to the table
  when scripting is unavailable.

**Settings (F8)**

- **FR-021**: The kit MUST provide a settings layout: a section menu beside
  grouped sections of setting rows, each row carrying a label, a description
  and one control, collapsing to stacked sections on phones.
- **FR-022**: The Admin Kit settings screen MUST use it, replacing the card grid
  and the tab strip, and MUST remain usable with scripting disabled.

**Documentation and governance**

- **FR-023**: The catalog MUST document the settings layout, the sign-in
  updates, the chart rules under D3, and the account menu placement, each with
  live examples and copyable markup.
- **FR-024**: Foundations MUST state the typography parity rule with its ratios
  and the content width rule, with right and wrong examples.
- **FR-025**: The constitution MUST record: D3 as the charting standard, the
  light-by-default theme rule, ambient authentication motion as the single
  exception to the decoration ban, the account menu placement, the typography
  parity ratios, the content width rule, and the packaged console layer.
- **FR-026**: Every Admin Kit deliverable MUST keep screen parity and pass a
  verified run with refreshed screenshots.

### Key Entities

- **Console layer**: the packaged stylesheet, script and icon set that carry
  every console pattern to consumers.
- **Setting row**: label, description, control, and optional help or status.
- **Chart spec**: series, scale, token-derived colours, and the interaction
  contract (hover, focus, tooltip).
- **Theme preference**: absent (light), light, or dark, persisted per browser
  and applied before paint.

## Success Criteria *(mandatory)*

- **SC-001**: A blank project that installs the released kit and imports two
  files renders the sign-in page, console shell, filter bar, list footer and
  settings layout correctly, with nothing copied from the repository.
- **SC-002**: On every Admin Kit screen, header, navigation and body font sizes
  are identical, and no heading exceeds its ratio.
- **SC-003**: The layout audit reports zero wrapped short content, zero
  horizontal page scroll at 375px, and zero under-used text rows across the
  docs and all four deliverables.
- **SC-004**: With the operating system set to dark and no stored choice, every
  deliverable renders light; after choosing dark, every deliverable renders dark
  on the next load.
- **SC-005**: The sign-in split measures 50/50 within one percent at 1440px in
  every deliverable, offers single sign-on, and shows no theme toggle.
- **SC-006**: The landing page charts answer hover and keyboard focus, redraw
  on theme change, contain no colour literal, and fall back to the table with
  scripting off; no Chart.js reference remains anywhere.
- **SC-007**: The settings screen shows grouped sections with a section menu in
  all four deliverables and works with scripting disabled.
- **SC-008**: All gates pass, including the three new ones (account menu
  placement, typography parity, content width), and each fails when
  deliberately broken.

## Assumptions

- Owner decisions taken with this feedback (2026-09-23): D3 replaces Chart.js
  everywhere; light is the default theme with the operating system ignored
  until the user chooses; the console layer is packaged and released as 0.4.0;
  novabank's authenticated screens are described rather than inspected.
- novacard's radial-gradient panel is not adopted: the gradient ban stands and
  the brand ground stays flat, with motion carried by line art.
- F4 needs no new pattern work: the filter bar and list footer from feature 007
  already match the novalending applications screen. What it needs is delivery,
  which FR-001 provides, plus a date-range category in the filter sheet so an
  audit-style screen has the sub-filter it needs.
- novabank-py implements its own page-level fixes; this feature governs the
  system layer and the sample pages.
- The npm publish itself needs the owner's passkey, so the release ships as
  pending in the same way as previous versions.
