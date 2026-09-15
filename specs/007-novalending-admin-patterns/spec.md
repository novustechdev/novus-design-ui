# Feature Specification: Admin patterns from the novalending reference

**Feature Branch**: `feature/007-novalending-admin-patterns` (feature 007)

**Created**: 2026-09-15

**Status**: Implemented, verified; shipping via PR

**Input**: Owner request: "update this ui kit design component (specially the
portal/dashboard/admin) based on novalending at v2.1nflow.co ... follow the
expected login sign layout ui ux, signout layout, pagination, icon, filter with
subfilter component, alignment and etc, just follow it as new reference, then
later anyone can follow it. I dont want again like 1 short content that should
be rendering as 1 row but the design/foundation render it as 2-3 rows or more.
Focus to be modern ui kit design component. Follow and update the speckit."

## Reference capture (2026-09-15)

The novalending console (v2.1nflow.co, tenant-admin test account) was walked
screen by screen at 1440px and 375px, light and dark. It already runs on the
Novus tokens, so its patterns transfer directly. Adopted as the reference:

- **Sign-in**: the whole page sits on the deep brand ground; a brand panel
  (product lockup, one-line promise, module chips) sits beside a white
  credential card (workspace mark, left-aligned title and one line of
  sub-copy, small-caps field labels with a red required marker, filled
  inputs, show/hide password, inline field error, one full-width primary
  action, centred reset link, "Managed by" Novus endorsement at the foot).
  Below 900px the panel stacks above the card.
- **Sign-out**: a user menu in the header (person icon, name, chevron) opens a
  small panel with preference rows and a Sign out button at its foot; signing
  out lands on a centred signed-out card (lockup, workspace line, "You have
  signed out", one lead line, "Sign in again", a security note, endorsement).
- **Pagination**: a list footer under every list: "Showing 1-20 of 35" at the
  start; previous button, "Page 1 of 2", next button, and a rows-per-page
  select at the end.
- **Filter with sub-filter**: a filter bar with a wide search field and a
  "Filters" trigger that opens a two-pane sheet: filter categories down the
  side, the chosen category's options (checkboxes, date range) beside them.
  Quick filter chips with live counts ("All (5)", "1 to 30 days (2)") sit above
  queue-style lists.
- **Navigation**: header with a menu toggle, product lockup and suffix at the
  start, Novus endorsement and user menu at the end; a side navigation with
  top-level links and collapsible uppercase groups carrying line icons and a
  chevron; the active link is tinted with an accent edge; on small screens the
  navigation opens as a drawer.
- **Page header**: breadcrumb trail, page title, actions at the end, one line
  of description under the title.
- **Icons**: single-weight line icons on a square grid, drawn in the current
  text colour, paired with labels.

Corrected, not adopted: the reference's data tables squeeze columns to fit the
viewport, so identifiers ("LOS-2026-000005"), three-word names, status chips
("In verification"), amounts, dates, and column headers wrap onto two or three
lines, and on phones columns collapse to one word per line. The kit MUST NOT
reproduce this.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Short content always stays on one line (Priority: P1)

An operations analyst scans a dense list of transactions. Every identifier,
name, chip, date, amount, button label, and column header reads on a single
line, so rows keep one consistent height and the eye can run across them. When
the list is wider than the screen, the list itself scrolls sideways instead of
breaking its content.

**Why this priority**: This is the defect the owner explicitly never wants to
see again, and it affects every screen and every consumer of the kit.

**Independent Test**: Open every Admin Kit list screen and every affected
catalog example at desktop and phone widths and confirm no short value spans
more than one line and the page never scrolls sideways.

**Acceptance Scenarios**:

1. **Given** a data table with identifiers, names, status chips, amounts, and
   dates, **When** it renders at 1440px, **Then** each of those values
   occupies exactly one line.
2. **Given** the same table at 375px, **When** it renders, **Then** every
   short value still occupies one line, the table scrolls horizontally inside
   its own container, and the page itself has no horizontal scroll.
3. **Given** a column of genuinely long free text (a description or a signal
   detail), **When** it renders, **Then** it wraps inside a readable minimum
   width instead of being squeezed to one word per line.
4. **Given** a short value that cannot fit its slot outside a table (for
   example a long user name in the header), **When** it renders, **Then** it
   truncates on one line and the full value remains available to the reader.

---

### User Story 2 - Sign in and sign out like the reference console (Priority: P1)

An operator opens the console, signs in on a split brand-and-credential page,
works, then signs out from the user menu and sees a clear signed-out page that
offers to sign in again.

**Why this priority**: Sign-in and sign-out are the first and last screens every
user sees, and the owner named both layouts explicitly.

**Independent Test**: In each Admin Kit deliverable, sign in with wrong then
right sample credentials, toggle password visibility, open the user menu, sign
out, and sign in again.

**Acceptance Scenarios**:

1. **Given** the sign-in page at 1440px, **When** it loads, **Then** a brand
   panel and a credential card sit side by side on the deep brand ground, with
   small-caps labels, required markers, filled inputs, a password visibility
   toggle, one full-width primary action, a reset link, and the Novus
   endorsement at the card foot.
2. **Given** wrong credentials, **When** the operator submits, **Then** an
   inline error appears under the field, the typed username is kept, and focus
   stays in the form.
3. **Given** the password field, **When** the operator presses the visibility
   toggle, **Then** the password shows and the control's label changes to
   "Hide password"; pressing again hides it.
4. **Given** any console screen, **When** the operator opens the user menu and
   chooses Sign out, **Then** the signed-out page appears with "Sign in again",
   and choosing it returns to the sign-in page.
5. **Given** a phone at 375px, **When** the sign-in page loads, **Then** the
   brand panel stacks above the card and nothing scrolls sideways.

---

### User Story 3 - Find records with filters, sub-filters, and paging (Priority: P2)

An analyst narrows the transaction list: chooses the Failed quick chip, searches,
opens Filters, picks the Product category and ticks "novapay", sees an active
chip appear and the counts update, pages through results, changes rows per page,
then clears all filters.

**Why this priority**: Filtering and paging are the core of every back-office
list and were named explicitly (filter with sub-filter, pagination).

**Independent Test**: On the transactions and data grid screens, apply and
remove filters and page through results; compare counts across deliverables.

**Acceptance Scenarios**:

1. **Given** the filter bar, **When** the analyst opens Filters, **Then** a
   sheet shows filter categories on one side and the selected category's
   options on the other; choosing another category swaps the options without
   closing the sheet.
2. **Given** an option is ticked, **When** the list updates, **Then** the
   result count, the list footer range, and an active filter chip reflect it,
   and the trigger shows how many filters are on.
3. **Given** active filters, **When** the analyst removes a chip or chooses
   Clear all, **Then** the corresponding filters turn off and the list
   restores.
4. **Given** quick filter chips with counts above a list, **When** the analyst
   chooses one, **Then** it becomes the single selected chip and the list shows
   only matching records.
5. **Given** a paged list, **When** the analyst moves to the next page or
   changes rows per page, **Then** the footer reads "Showing x-y of z", "Page n
   of m" updates, previous is disabled on the first page and next on the last,
   and changing rows per page returns to page 1.
6. **Given** filters that match nothing, **When** the list renders, **Then** a
   plain empty state explains it and offers to clear the filters, and the
   footer shows zero results with both paging buttons disabled.

---

### User Story 4 - Navigate a console with grouped navigation (Priority: P2)

An operator moves between screens using a side navigation grouped by area, with
line icons on the group labels; on a laptop they collapse the navigation to gain
width, and on a phone it opens as a drawer. Each page opens with a breadcrumb,
a title, and its actions aligned at the end.

**Why this priority**: Navigation and page structure set the console's overall
look; the owner asked for the reference's layout and alignment.

**Independent Test**: Walk all Admin Kit screens at 1440px and 375px using only
the navigation and page headers.

**Acceptance Scenarios**:

1. **Given** the console at 1440px, **When** it loads, **Then** the header shows
   the menu toggle, product lockup, and suffix at the start and the Novus
   endorsement and user menu at the end, and the side navigation shows its
   groups with icons, chevrons, and the current page highlighted.
2. **Given** the menu toggle, **When** it is pressed at desktop width, **Then**
   the navigation collapses and the content takes the width; pressing again
   restores it.
3. **Given** a phone, **When** the menu toggle is pressed, **Then** the
   navigation opens as a drawer over the content and can be closed from inside
   it.
4. **Given** any screen, **When** it loads, **Then** its page header shows the
   breadcrumb, the title, and any actions aligned at the end on one line at
   desktop width.

---

### User Story 5 - Anyone can follow the patterns (Priority: P3)

A developer on another Novus product builds a new console. They find sign-in,
signed-out, user menu, side navigation, page header, filter bar, pagination,
table content-fit rules, icons, and alignment guidance in the design kit
documentation, each with a live example and copyable markup, and the release
gates stop anyone from reintroducing wrapping short content.

**Why this priority**: The owner wants the patterns to become the standard
"later anyone can follow"; it builds on stories 1 to 4.

**Independent Test**: From the component overview, reach each pattern's page
in at most two clicks, copy its snippet into a blank page with the kit loaded,
and see the same result; then break the content-fit rule and watch the gate
fail.

**Acceptance Scenarios**:

1. **Given** the component overview, **When** a developer searches for "sign
   in", "filter", "pagination", or "navigation", **Then** the matching pattern
   page is found and opens with a live example and a copy button.
2. **Given** the foundations section, **When** a developer opens Icons or
   Alignment and content fit, **Then** each page states the rules with
   examples of right and wrong use.
3. **Given** a change that lets a short value wrap or a page scroll sideways at
   375px, **When** the release gates run, **Then** they fail and name the
   offending page and element.

### Edge Cases

- A value longer than its table column at phone width: the table scrolls; the
  value never breaks.
- A long free-text column: wraps within a readable minimum width; short
  columns beside it stay single-line.
- A user name longer than the header allows: truncates with an ellipsis; the
  full name shows in the open user menu and to assistive technology.
- Zero results: empty state with a clear-filters action; footer shows "Showing
  0 of 0" and disables both paging buttons.
- Last page shorter than the page size: the range ends at the total ("Showing
  21-24 of 24").
- Rows per page changed while on a later page: return to page 1 so the range
  stays valid.
- Every option in a category ticked, or none ticked: both mean the category
  does not narrow the list; no chip is shown for "none".
- Scripting unavailable: sign-in form, user menu, filter sheet, and navigation
  still open and close; lists render complete; filtering and paging are
  progressive enhancements in the static deliverables (the Material
  deliverable already requires scripting and says so).
- Dark theme: the sign-in brand ground stays the deep brand colour in both
  themes; every other surface follows the theme; all text keeps AA contrast.
- Reduced motion: drawer, sheet, chevron, and navigation transitions are
  removed.
- Signed-out page opened directly with no session: shows normally and offers
  sign in.

## Requirements *(mandatory)*

### Functional Requirements

**Content fit (the single-line rule)**

- **FR-001**: Short content MUST render on one line wherever it appears in
  catalog examples and Admin Kit screens: identifiers and references, person
  and entity names, chips and badges, dates and times, amounts and counts,
  button and link labels, column headers, filter triggers, chips, and footer
  text. Short content means a value that reads as one unit (typically 40
  characters or fewer).
- **FR-002**: Data tables MUST keep every cell single-line by default and MUST
  scroll horizontally inside their own container when wider than the space
  available; they MUST NOT shrink columns below their content width.
- **FR-003**: Long free text MUST be explicitly marked as wrapping and MUST
  wrap within a readable minimum width, never narrower than about 16 characters
  per line.
- **FR-004**: Where a short value must fit a fixed slot outside a table, it MUST
  truncate on one line with an ellipsis, and the full value MUST stay available
  (visible on demand and to assistive technology).
- **FR-005**: No Admin Kit page and no catalog page MUST scroll horizontally at
  375px.

**Sign-in**

- **FR-006**: Every Admin Kit deliverable MUST provide a sign-in page with the
  reference layout: deep brand ground in both themes, brand panel (product
  lockup, one-line promise, module chips) beside a credential card, stacking
  below 900px.
- **FR-007**: The credential card MUST carry the workspace mark, a
  left-aligned title and one sub-copy line, small-caps labels with a red
  required marker, filled inputs that meet the 44px target, a password
  visibility toggle with an updating accessible label, one full-width primary
  action, a centred reset link, and the Novus endorsement at the foot.
- **FR-008**: A failed sign-in MUST show an inline error in the danger colour
  under the credentials, keep the typed username, and not clear the form.
- **FR-009**: The sample credentials MUST remain stated on the page and MUST
  route to the dashboard; the reset link MUST explain that resets are handled
  by an administrator in the sample.
- **FR-010**: The sign-in page MUST work with scripting unavailable in the
  deliverables that render server-side or statically, except for the password
  visibility toggle, which may be hidden when it cannot work.

**Sign-out**

- **FR-011**: The console header MUST provide a user menu (person icon, name
  truncating per FR-004, chevron) that opens a panel with the theme preference
  row and a Sign out action at its foot; it MUST open and close without
  scripting and close on outside click or Escape where scripting is available.
- **FR-012**: Signing out MUST land on a signed-out page: centred card with
  product lockup and suffix, workspace line, "You have signed out" title, one
  lead line, a primary "Sign in again" action, a security note, and the Novus
  endorsement at a ruled foot.
- **FR-013**: The theme toggle MUST move from the header bar into the user menu
  and keep its persisted, pre-paint behaviour under both dark triggers.

**Filtering and pagination**

- **FR-014**: List screens MUST provide a filter bar: a search field that takes
  the remaining width and a Filters trigger that opens a two-pane sheet
  (categories beside options); on phones the categories sit above the options.
- **FR-015**: The Filters trigger MUST show the number of active filters and
  take the active style while any are on; each active filter MUST appear as a
  removable chip naming its category and value, followed by Clear all.
- **FR-016**: Queue-style lists MUST offer quick filter chips with live counts,
  exactly one selected at a time, the selected chip in the accent.
- **FR-017**: Every paged list MUST end with a list footer: "Showing x-y of z"
  at the start; previous button, "Page n of m", next button, and a rows-per-page
  select (10, 20, 50) at the end; paging buttons MUST meet the 44px target and
  disable at the ends.
- **FR-018**: The Transactions screen MUST use the filter bar with sub-filters
  (at least Product, Terminal, and Amount categories), quick status chips with
  counts, and the list footer; the Data grid screen MUST use the list footer.
- **FR-019**: For the same selections every deliverable MUST show the same
  results and counts (dataset parity).

**Navigation and page header**

- **FR-020**: The console header MUST place the menu toggle, product lockup,
  and suffix at the start, and the Novus endorsement, a divider, and the user
  menu at the end.
- **FR-021**: The side navigation MUST support top-level links and collapsible
  groups whose uppercase labels carry a line icon and a chevron; the current
  page MUST show the accent tint and edge, and its group MUST be open.
- **FR-022**: The menu toggle MUST collapse the side navigation at desktop
  width and open it as a closable drawer on small screens, without scripting.
- **FR-023**: Every console screen MUST open with a page header: breadcrumb,
  title, actions aligned at the end, and an optional one-line description.

**Icons**

- **FR-024**: The kit MUST define one line icon style: square 24-unit grid,
  2-unit stroke, round ends and joins, drawn in the current text colour, at
  16, 20, or 24 pixels.
- **FR-025**: The kit MUST publish a curated icon set covering console needs
  (menu, close, chevrons, search, filter, user, sign out, theme, and the Admin
  Kit navigation areas) as copyable markup with no icon font and no third-party
  request.
- **FR-026**: Icon-only controls MUST carry an accessible name and a 44px
  target; decorative icons beside a label MUST be hidden from assistive
  technology.

**Documentation**

- **FR-027**: The catalog MUST add pages for Sign-in page, Signed-out page, User
  menu, Side navigation, Page header, and Filter bar, each with live examples,
  copyable snippets, and usage rules; the Pagination and Table pages MUST be
  updated to the list footer and content-fit rules.
- **FR-028**: Foundations MUST add an Icons page and an Alignment and content
  fit page that state the single-line rule, truncation, wrapping opt-in,
  numeric alignment, action alignment, and control-height alignment, with right
  and wrong examples.
- **FR-029**: Every hardcoded component count (catalog overview, landing page,
  README) MUST reflect the new total.
- **FR-030**: The Admin Kit docs page MUST describe the new screens and
  patterns and show screenshots from a verified run of each deliverable,
  including the sign-in page, the signed-out page, the open filter sheet, and a
  375px view.

**Admin Kit parity and verification**

- **FR-031**: All Admin Kit deliverables (Blazor, Tailwind, Material, and the
  hosted WebAssembly demo) MUST ship the same screens, now including the
  signed-out page, with the same navigation groups, filters, and dataset.
- **FR-032**: Shared console pattern styling MUST have one source of truth that
  every deliverable consumes, so the patterns cannot drift between them.
- **FR-033**: Every deliverable MUST pass a verified build and run with the
  results recorded in the Admin Kit verification record.
- **FR-034**: The hosted demos MUST be rebuilt so the docs site links to the
  updated consoles.

**Governance**

- **FR-035**: The constitution MUST record the novalending console as the admin
  pattern reference and the single-line content rule as binding on the kit and
  every reference application.
- **FR-036**: The release gates MUST fail when a shared pattern copy diverges
  from its source, and when an automated layout audit finds wrapped short
  content or horizontal page scroll at 375px on the docs site or hosted demos.
- **FR-037**: The change MUST ship through a feature branch and pull request
  with CHANGELOG, tasks, and verification records updated.

### Key Entities

- **Pattern**: a documented console building block (sign-in page, signed-out
  page, user menu, side navigation, page header, filter bar, list footer), with
  its anatomy, states, and usage rules.
- **Filter category**: a named dimension of a list (Status, Product, Terminal)
  holding options; a category with ticked options narrows the list.
- **Active filter**: one ticked option shown as a removable chip (category and
  value).
- **List view state**: search text, active filters, quick chip, page number,
  and rows per page; it produces the visible range and total.
- **Icon**: a named line drawing on the kit grid with a size and an accessible
  role (decorative or labelled).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Across every Admin Kit screen in all four deliverables and every
  catalog page, at 1440px and 375px, the automated layout audit finds zero
  short values rendered on more than one line.
- **SC-002**: At 375px, 100% of Admin Kit screens and catalog pages have no
  page-level horizontal scroll.
- **SC-003**: Each of the ten patterns and foundations named in FR-027 and
  FR-028 is reachable from the component overview or foundations menu in at
  most two clicks, and each has a working copy action.
- **SC-004**: In each deliverable an operator can sign in, open the user menu,
  sign out, and sign in again in under 30 seconds with no dead ends.
- **SC-005**: Choosing the Failed quick chip on Transactions shows 2 records in
  all four deliverables; adding Product = novapay from the sub-filter sheet
  yields the same narrowed count everywhere; Clear all plus the All chip
  restores the full count of 24.
- **SC-006**: All release gates pass, including the new pattern-parity and
  layout-audit gates, and each new gate fails when deliberately broken.
- **SC-007**: No stale component count remains anywhere in published copy.

## Assumptions

- The novalending console is a visual and interaction reference only; its
  domain, data, and copy are not copied. The Admin Kit keeps the novapay
  operations domain and its shared dataset.
- The reference's wrapping of short content in tables is a defect to correct,
  not a pattern to follow.
- tokens.css and every packaged kit file stay unchanged; the new patterns are
  compositions of existing tokens and components documented in the catalog and
  consumed by the Admin Kit. No package release is required by this feature.
- The sign-in remains a sample (admin / admin) with no real authentication;
  language and market switching, the region chooser, and module portals seen in
  the reference are product-specific and out of scope.
- The icon set is drawn on the kit grid in the reference's line style and
  shipped as copyable markup, not as a new packaged asset.
- Rows-per-page options are 10, 20, and 50, defaulting to 10 (the kit's stated
  table default).
- The automated layout audit runs in the existing release pipeline with a
  headless browser available on the build machine.
