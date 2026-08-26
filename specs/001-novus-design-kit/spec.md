# Feature Specification: Novus Design Kit — Component Library & Reference Site

**Feature Branch**: `001-novus-design-kit`

**Created**: 2026-08-26

**Status**: Draft

**Input**: User description: "build novus design kit for core component library and reference demo page like https://ant.design/docs/spec/introduce and component list like https://ant.design/components/overview/, that has design system pattern and component list detail and overview, but I want it using reference novus design system kit brand, icon, photos, logos, fonts like explain at referenfes/Novus_Design_System_Kit_v2. this novus design kit will be available in npm/yarn also so all developer from novustech can used it"

## Clarifications

### Session 2026-08-26

- Q: When developers install the kit, what form should the components take — pure CSS with documented HTML patterns, or framework components? → A: CSS-first and framework-agnostic: tokens, component classes, fonts, and assets with copyable HTML patterns, consumable from any web stack; framework-specific wrappers (React/Vue) are out of scope for v1.
- Q: Where should the npm package be published — public npm or a private internal registry? → A: A private internal registry (Novus-controlled feed); proprietary photos and logos never reach a public registry, and developers authenticate once then use standard npm/yarn commands.
- Q: Who should be able to view the reference/demo documentation site — the public internet or Novus people only? → A: Public, like ant.design: anyone can browse the design system and component docs with no login; the site doubles as a brand showcase, while the installable package remains private.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Install and build with the kit (Priority: P1)

A Novus Tech developer starting a new internal or product frontend installs the
Novus Design Kit with a single standard package-manager command (npm or yarn),
imports it, and immediately has the full Novus brand available: design tokens
(colors, typography, spacing, radii, shadows), the Carlito font, dark mode, and
ready-to-use styled components — without copying files from SharePoint or
hand-rolling any brand values.

**Why this priority**: Distribution is the entire point of the kit. Until a
developer can install and consume it, the reference site has nothing real to
document. This story alone delivers value even with no documentation site.

**Independent Test**: In a fresh empty project, run the documented install
command, import the kit, and render a page with a primary button, a card, and
the app header. The page must show correct Novus styling (Carlito, Novus Blue
accent, white ground) in light and dark mode with no manual asset copying.

**Acceptance Scenarios**:

1. **Given** a fresh project with no Novus files, **When** the developer installs
   the package and imports it, **Then** all design tokens, component styles, and
   the Carlito font are available and render correctly.
2. **Given** the kit is installed, **When** the developer applies a documented
   component pattern (e.g., primary button, interactive card, modal), **Then**
   it renders identically to the reference site's example.
3. **Given** a page built with the kit, **When** viewed with OS dark mode on or
   the theme toggle activated, **Then** all components and logos switch to the
   correct dark-mode treatment without extra developer work.
4. **Given** a released kit version, **When** a newer version is published,
   **Then** the developer can see what changed and whether it is breaking before
   upgrading.

---

### User Story 2 - Browse the component overview and detail pages (Priority: P2)

A developer visits the reference site's component overview — a categorized,
visual list of every component in the kit (like ant.design/components/overview)
— clicks a component, and lands on a detail page showing live rendered examples
of each variant and state, a copyable usage snippet, and do/don't guidance.

**Why this priority**: The component catalog is how developers discover what
exists and copy correct usage instead of re-implementing widgets — the kit's
core promise after installability.

**Independent Test**: Open the reference site, navigate from the overview grid
to any component detail page, copy the usage snippet into a project with the
kit installed, and confirm the rendered result matches the live example.

**Acceptance Scenarios**:

1. **Given** the reference site, **When** a visitor opens the component
   overview, **Then** every component shipped in the kit appears with a name,
   a visual preview, and a link to its detail page — no shipped component is
   undocumented.
2. **Given** a component detail page, **When** the visitor views it, **Then**
   they see live rendered examples of the component's variants and states, a
   copyable markup/usage snippet per example, and usage guidance.
3. **Given** any example on a detail page, **When** its snippet is used in a
   consuming project, **Then** the output matches the documented example.

---

### User Story 3 - Read the design-system overview (Priority: P3)

A developer or designer new to Novus reads the reference site's design-system
section (like ant.design/docs/spec/introduce): the design principles, brand
foundations — color palette and product accents, typography, spacing and
layout, logo usage, photography, iconography, dark mode rules — presented with
visual examples so they understand not just what the components are but how to
apply the brand correctly.

**Why this priority**: Guidance prevents misuse (wrong logo variant, invented
colors, off-brand copy), but the kit and catalog deliver value without it.

**Independent Test**: Navigate the design-system section and verify each
foundation topic (principles, color, typography, layout, logos, photography,
dark mode) has its own page with visual examples rendered from the kit itself.

**Acceptance Scenarios**:

1. **Given** the reference site, **When** a visitor opens the design-system
   section, **Then** pages exist for design principles, color, typography,
   spacing/layout, logo usage, photography, and dark mode, each illustrated
   with live examples.
2. **Given** the logo usage page, **When** a visitor views it, **Then** the
   official logo variants (color, white, wordmark, product lockups) are shown
   with the rules for when each applies, including dark-mode behavior.

---

### User Story 4 - Use bundled brand assets (Priority: P4)

A developer needs the official Novus logo, a product lockup, an icon, or an
approved photograph. The installed kit includes these assets, and the reference
site documents what is available and how to reference each one, so the
developer never screenshots, redraws, or sources off-brand assets.

**Why this priority**: Assets are already consumable via the package from
Story 1; this story adds the discoverability layer.

**Independent Test**: From a consuming project, reference a bundled logo,
product lockup, and photo by the documented path/name and confirm each renders
as the official asset.

**Acceptance Scenarios**:

1. **Given** the kit is installed, **When** the developer references a
   documented asset (logo variant, product lockup, icon, photo), **Then** the
   official file resolves from the package without manual downloads.
2. **Given** the asset documentation, **When** a visitor browses it, **Then**
   every bundled asset category is listed with a preview and its reference
   name/path.

---

### Edge Cases

- Dark mode with JavaScript disabled: OS-level dark preference must still style
  components and swap logos correctly (no toggle available, media query only).
- Reference site or a kit-consuming page opened from the filesystem/offline:
  fonts and styles must still render (no dependence on external hosts).
- A consumer overrides or extends tokens: documented behavior — consumer values
  layer on top without editing kit files, and upgrades don't silently revert
  brand overrides into off-brand values.
- Viewport at 375px: overview grid, detail pages, and all components must work
  with no horizontal scroll and ≥44px touch targets.
- Interactive components (modal, collapse/disclosure, nav) with JavaScript off:
  content must remain reachable via native open/close behavior.
- A component exists in the kit but has no detail page: release gate fails —
  the catalog must be complete at every release.
- Upgrading across a breaking kit version: the change log must identify the
  break and the migration step.
- A non-Novus visitor on the public site follows the install instructions: they
  must see a clear "Novus developers only" note on registry access rather than
  a broken or credential-leaking install path.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The kit MUST be installable with a single standard npm or yarn
  command by any Novus Tech developer, and importable so that tokens, component
  styles, fonts, and assets are available without manual file copying. It is
  published to a private Novus-controlled registry; proprietary assets MUST NOT
  be published to any public registry.
- **FR-002**: The kit MUST expose the Novus design tokens (color, typography,
  spacing, radius, shadow, layout) as the single source of truth, sourced from
  the Novus Design System Kit v2 reference — no invented values.
- **FR-003**: The kit MUST bundle and self-host the Carlito font so consuming
  apps and the reference site render it with no external font host.
- **FR-004**: The kit MUST provide the core component set already defined by
  the Novus design system — at minimum: button (primary/secondary/ghost/danger,
  sizes), card (static/interactive/raised), badge, alert, table, form field and
  input, modal, collapse/disclosure, navigation/app header/app bar, container
  and grid layout, stat row, bullets list, avatar, and the product theme
  variants (theme-nova*).
- **FR-005**: Every component MUST support light and dark mode via both an
  explicit theme attribute and the OS-level dark preference, with a documented
  persisted toggle pattern applied before first paint.
- **FR-006**: The kit MUST bundle the official brand assets — master logo
  variants, product lockups, icons, and approved photographs — referenceable
  from consuming projects by documented names/paths.
- **FR-007**: The reference site MUST include a design-system section with
  pages for design principles, color, typography, spacing/layout, logo usage,
  photography, and dark mode, each illustrated with examples rendered from the
  kit itself.
- **FR-008**: The reference site MUST include a component overview page listing
  100% of shipped components, each with a name, visual preview, and link to its
  detail page, organized by category.
- **FR-009**: Each component detail page MUST show live rendered examples of
  the component's variants and states, a copyable usage snippet per example,
  and usage do/don't guidance.
- **FR-010**: All reference-site copy MUST be sourced from the approved Novus
  brand context material; positioning language follows the "Service as
  Software" model and the strings "SaaS" / "Software as a Service" MUST NOT
  appear anywhere in kit or site output.
- **FR-011**: The kit and reference site MUST meet the accessibility floor:
  body text contrast ≥ 4.5:1, visible focus states on all interactive elements,
  touch targets ≥ 44px, mobile-first behavior verified at 375px, and
  interactive patterns usable with JavaScript disabled where a native
  equivalent exists.
- **FR-012**: Releases MUST be versioned semantically with a change log that
  identifies breaking changes and migration steps, so consumers can upgrade
  deliberately.
- **FR-013**: Every release MUST pass the constitution's quality gates (token
  audit, dark parity, 375px pass, hover audit, radius audit, copy audit,
  component-demo completeness) before publication.
- **FR-014**: The reference site MUST itself be built with the published kit
  (same tokens, components, and assets), serving as a living proof of the
  library.
- **FR-015**: The kit delivers components as framework-agnostic styles with
  documented markup patterns usable from any web stack; framework-specific
  component wrappers are explicitly out of scope for v1.
- **FR-016**: The reference site MUST be publicly accessible with no login, and
  its install instructions MUST reference the private registry without exposing
  credentials, tokens, or internal-only URLs.
- **FR-017**: The reference site MUST include framework integration guides
  (initially Blazor, Tailwind CSS, and Fluent 2) showing how each stack consumes
  the kit, with all framework-side theming derived from the tokens by variable
  reference — never copied values (constitution Principle VI).

### Key Entities

- **Design Token**: A named brand value (color, type size, space step, radius,
  shadow, layout width) — the atomic unit every component consumes.
- **Component**: A reusable UI pattern shipped by the kit (button, card, modal,
  …) with defined variants, states, and usage rules; belongs to a category.
- **Brand Asset**: An official file bundled with the kit — logo variant,
  product lockup, icon, photograph, font — with a documented reference name.
- **Documentation Page**: A reference-site page; either a design-system
  foundation page or a component detail page (overview entries link to these).
- **Release**: A published, semantically versioned snapshot of the kit with a
  change log entry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer with no prior Novus setup goes from the install
  command to rendering their first on-brand component in under 10 minutes using
  only the reference site.
- **SC-002**: 100% of shipped components appear on the overview page and have a
  detail page with at least one live example and copyable snippet at every
  release.
- **SC-003**: Zero brand-value drift: audits of kit and site output find no
  color/size/font values outside the token set, no gradients, no radius above
  the standard, and zero occurrences of prohibited positioning strings.
- **SC-004**: The reference site passes dark-mode parity (toggle AND OS
  preference, JS off), the 375px mobile pass, and the accessibility floor with
  zero gate failures at release.
- **SC-005**: A snippet copied from any component detail page reproduces the
  documented rendering in a consuming project without modification.
- **SC-006**: After adoption, new Novus frontends contain zero hand-copied
  brand files (fonts, logos, token files) — the package is the only brand
  source.

## Assumptions

- Component scope for v1 is exactly what the Novus Design System Kit v2 already
  defines (the `references/Novus_Design_System_Kit_v2` snapshot); no new
  components are invented. Drift against the SharePoint master is flagged to
  the design-system owner, not patched locally.
- The package is published under a Novus scope; developers perform a one-time
  registry authentication, after which standard npm/yarn commands work. The
  specific registry product is chosen at planning time (must be private).
- The reference site is a public static site (like ant.design) with no login;
  search and an interactive playground are not required for v1 (a categorized,
  navigable list covers discovery at this component count). Publishing brand
  photos, logos, and sourced copy on the public site is an accepted, deliberate
  exposure — the private registry protects only the installable package.
- Reference-site copy comes from `Novus_Context.md` and the brand guide in the
  reference kit; where approved copy is missing, the page carries a sourced-copy
  placeholder rather than invented text.
- Documentation is in English.
