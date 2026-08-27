# Feature Specification: Novus Admin Kit (Blazor + Tailwind flavors)

**Feature Branch**: `002-novus-admin-kit`

**Created**: 2026-08-27

**Status**: Draft

**Input**: User description: "build this novus design kit has completed real use case like
tailwand admin, the name is novus admin kit, and it will be used 2 framework: novus admin
kit with blazor and novus admin kit with tailwand. make it enterprise realistic demo."

## Clarifications

### Session 2026-08-27

- Decision baked in from constitution VII (owner-directed): both flavors consume the
  PUBLISHED `novus-design-kit` npm package, keep screen parity, and ship only after a
  verified run with screenshots on the docs site.
- Charts vs signal cards: the dashboards use stat rows and signal/alert cards rather
  than charting libraries. This is the kit's own locked convention (insight cards are
  preferred wherever a chart would only be re-read into a sentence) and keeps both
  flavors dependency-light. Charts can be a later addition.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start an enterprise admin app from the Blazor flavor (Priority: P1)

A Novus .NET developer copies the Novus Admin Kit Blazor project, restores and runs it,
and has a realistic, on-brand operations console (dashboard, transactions, terminals,
settings) running locally in minutes: correct shell, dark mode, and data conventions,
ready to be wired to real services.

**Why this priority**: Blazor is the leading Novus stack; a working enterprise starting
point is the kit's strongest proof of value.

**Independent Test**: Copy `admin-kits/blazor`, run the documented commands, open the
app: all four screens render on-brand, navigation works, theme toggle persists, and the
kit is resolved from the npm registry (not repo files).

**Acceptance Scenarios**:

1. **Given** the copied Blazor flavor, **When** the developer runs the documented
   install and run commands, **Then** the console starts and serves all four screens
   with kit styling (Carlito, Novus Blue, white ground).
2. **Given** the running app, **When** the developer toggles the theme, **Then** the
   whole console re-tunes (dark surfaces, white master lockup) and the choice persists.
3. **Given** the transactions screen, **When** the developer filters by status,
   **Then** the table updates and status chips keep the traffic-light conventions.

---

### User Story 2 - Start an admin app from the Tailwind flavor (Priority: P2)

A frontend developer copies the Tailwind flavor (Vite + Tailwind mapped to Novus
tokens), installs, and runs the same console: identical screens and dataset, Tailwind
utilities for layout, kit components for identity.

**Why this priority**: Same value for non-.NET teams; second because it shares design
work with US1.

**Independent Test**: Copy `admin-kits/tailwind`, `npm install && npm run dev`, open
the app: the same four screens render with parity to the Blazor flavor; utilities
resolve to token values (no copied hex anywhere).

**Acceptance Scenarios**:

1. **Given** the copied Tailwind flavor, **When** the developer installs and runs it,
   **Then** all four screens render with kit identity and Tailwind layout utilities.
2. **Given** both flavors side by side, **When** comparing any screen, **Then** the
   content, dataset, and visual identity match (stack differences only).
3. **Given** JavaScript disabled, **When** navigating between screens, **Then**
   navigation still works (each screen is its own page).

---

### User Story 3 - Learn about the Admin Kit on the docs site (Priority: P3)

A developer opens an "Admin Kit" page on the reference site: what it is, the four
screens with rendered screenshots (both flavors, light and dark), how to run each
flavor, and what conventions the console demonstrates.

**Why this priority**: Discoverability and the constitution VII verification evidence;
the kits are usable without it.

**Independent Test**: The docs page exists in the site nav, shows verified screenshots
for both flavors, and its run instructions work verbatim.

**Acceptance Scenarios**:

1. **Given** the reference site, **When** a visitor opens the Admin Kit page, **Then**
   they see the screen inventory, rendered screenshots per flavor, and copyable run
   instructions.
2. **Given** the page's instructions, **When** followed on a clean machine with the
   stack installed, **Then** the corresponding flavor runs.

---

### Edge Cases

- JavaScript disabled: navigation still works in both flavors (multi-page /
  server-rendered); the theme toggle is the only JS-dependent control and OS dark
  preference still applies.
- 375px: sidebar collapses to a mobile pattern; tables scroll inside their own
  container; no page-level horizontal scroll.
- Status colour discipline: a transaction amount is pure data (neutral); only
  judgement states (settled / pending / failed, uptime health) carry traffic-light
  colour; failure alerts are red.
- Empty filter result: the transactions table shows a plain empty state (text + reset
  action), no decorative illustration.
- The published package is unavailable (offline install): flavors fail loudly at
  install; they never fall back to copied kit files.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST contain two runnable admin applications,
  `admin-kits/blazor` and `admin-kits/tailwind`, each consuming the published
  `novus-design-kit` npm package (constitution VII; never repo-relative kit files).
- **FR-002**: Both flavors MUST implement the same four screens with screen parity:
  Dashboard (KPI stat row, signal cards, recent transactions), Transactions
  (filterable data table with status chips and a detail dialog), Terminals (fleet
  table with uptime and health status), Settings (profile form and appearance with
  the persisted theme toggle).
- **FR-003**: Both flavors MUST share one mock dataset (same records, same values) so
  screens are comparable field by field.
- **FR-004**: The console shell MUST follow the internal-tool header rule: the app
  identifier leads left, the Novus master lockup sits far right as endorsement with
  the divider, plus a sidebar navigation and the shared content column.
- **FR-005**: Data conventions MUST hold: traffic-light colour only on judgement
  metrics, risk/alert messages always red, self-describing chips, amounts and counts
  neutral, one accent per view.
- **FR-006**: Both flavors MUST support dual-trigger dark mode with the kit's
  persisted pre-paint toggle, and remain navigable with JavaScript disabled.
- **FR-007**: Both flavors MUST pass the kit's authored-styling gates (no ad-hoc hex,
  no gradient, radius and type from tokens, no prohibited strings) with the gate
  script extended to cover admin-kit sources.
- **FR-008**: The reference site MUST gain an Admin Kit page in the top navigation:
  screen inventory, verified rendered screenshots of both flavors (light and dark),
  copyable run instructions per flavor, and the conventions the console demonstrates.
- **FR-009**: Each flavor MUST be verified by an actual build and run before the docs
  page ships (constitution VII), with the verification recorded (flavor, stack
  version, date, result) alongside the guide-verification record.
- **FR-010**: Each flavor MUST carry a short README covering prerequisites, install,
  run, and where to start customizing.

### Key Entities

- **Transaction**: id, timestamp, terminal id, product (novapay/novabank/novastore),
  amount, currency, status (settled / pending / failed).
- **Terminal**: id, location, product, uptime percentage, health (healthy / degraded /
  offline), last-seen timestamp.
- **Screen**: one of the four parity screens; exists identically in both flavors.
- **Flavor**: a runnable admin application (blazor | tailwind) implementing all
  screens against the shared dataset.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From a copied flavor folder to the console running locally in under 10
  minutes using only that flavor's README (stack toolchain preinstalled).
- **SC-002**: Screen parity 4/4: every screen exists in both flavors with the same
  dataset values and identical component identity.
- **SC-003**: Zero authored-styling gate failures across both flavors at ship time.
- **SC-004**: The docs page shows verified screenshots for 2/2 flavors, light and
  dark, produced from actual runs recorded in the verification record.
- **SC-005**: Both flavors navigate with JavaScript disabled and show no page-level
  horizontal scroll at 375px.

## Assumptions

- Domain: a novapay operations console (transactions and payment terminals), using
  sourced Novus domain language; figures in mock data are plainly illustrative and
  carry no client names (source-fidelity rule).
- Dashboards use stat rows and signal cards, not charting libraries (kit convention;
  charts may be added later as a separate feature).
- Mock data is static and in-repo; no backend, auth, or persistence in v1. The
  settings form does not save.
- Distribution is by copying the flavor folder from the repository (documented on the
  docs page); hosting live demos is out of scope for v1 (screenshots are the
  evidence).
- The Tailwind flavor is a multi-page Vite app (one HTML page per screen) so JS-off
  navigation holds; the Blazor flavor uses server-rendered pages with interactivity
  only where a screen needs it.
