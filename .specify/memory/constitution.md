<!--
Sync Impact Report
- Version change: 1.8.0 → 1.8.1 (PATCH: Principle VIII Android target corrected to
  the team's actual stack — Material Components for Android / View system per
  m3.material.io, not Jetpack Compose; Android tech lead via owner, 2026-08-27)
- Prior amendment (1.7.0 -> 1.8.0): Principle VIII added — Mobile Foundation
  Parity for native Android and iOS (SwiftUI / HIG), with a token-parity gate;
  owner decision 2026-08-27
- Prior amendment (1.6.0 -> 1.7.0): Governance gains a release rule — changelog
  and all version references updated with every tagged release; owner decision
  2026-08-27
- Prior amendment (1.5.1 -> 1.6.0): Principle II motion rule expanded to allow
  functional state-change motion, reduced-motion aware; owner decision 2026-08-27
- Prior amendment (1.5.0 -> 1.5.1): presentation wording; owner decision
- Changed: docs prose follows the container full width on desktop; no fixed
  ch-measure caps on documentation text (supersedes "prose keeps a readable
  measure"). Commit authorship: repository commits are authored by the owner
  (sgultom99) with no assistant trailers.
- Prior amendment (1.4.0 -> 1.5.0): Principle VII expanded; presentation standards added
- Modified: VII. Reference Applications now also requires an Analytics screen (charts
  following the locked Novus dashboard-chart rules: token-fed Chart.js defaults, soft
  dashed gridlines, rounded bars, no axis borders, composition plus trajectory reads,
  colours read from tokens at runtime) and a Data Grid screen (sortable, paginated,
  searchable; native framework grid where one exists, e.g. Blazor QuickGrid), plus a
  LIVE, clickable demo of each flavor hosted with the docs site; docs screenshots link
  to the running demos.
- Added to Design Standards: the docs site and admin consoles use full-width fluid
  layout on desktop (gutters only, no fixed max-width container), remain mobile-first
  responsive, and the docs site ships PWA basics (manifest, theme-color). Vertical
  rhythm: headings, code blocks, figures, and tables carry token-scale block spacing.
  Canonical host: https://ui-kit.novustech.dev (Cloudflare DNS to GitHub Pages).
- Prior amendment (1.3.0 -> 1.4.0): Principle VII added
- Added: VII. Reference Applications (Admin Kits) — enterprise demo apps (Novus Admin
  Kit, Blazor and Tailwind flavors) must consume the PUBLISHED npm package, keep screen
  parity across flavors, follow every kit principle and the app-interface conventions
  (traffic-light status, risk messages red, self-describing chips, one accent per
  view), and ship only after a verified run with rendered screenshots on the docs site.
- Prior amendment (1.2.0 -> 1.3.0): two principles materially expanded
- Modified principles:
  V. Brand & Copy Fidelity: house copy style added: published site and README copy
  avoids em-dash punctuation (reads as machine-generated); enforced by a quality gate.
  VI. Framework-Agnostic Integration: every guide page must embed the rendered result
  of its verified sample project and name the library version it was verified against;
  verification is recorded per guide and an unverified guide does not ship (build-time
  publication filter + release gate).
- Added sections: none
- Removed sections: none (Quality Gates list extended with gates 8 and 9)
- Follow-up TODOs: none
- Prior amendments: 1.1.0 → 1.2.0 (Principle VI guide sets expanded); 1.0.1 → 1.1.0
  (Principle VI added); 1.0.0 → 1.0.1 (Principle II radius rule reworded).
-->

# Novus Design Kit Constitution

## Core Principles

### I. Token-First, Single Source of Truth

`tokens.css` is the single source of truth for every color, type size, spacing step,
radius, shadow, and the Carlito typeface. Components MUST consume `var(--*)` tokens;
ad-hoc hex or px literals for anything the tokens define are defects. The accent is
Novus Blue `#0070C0` (`--accent`), ONE accent per view; green is reserved for
success/status. No value, component, or brand string may be invented — everything
derives from the kit.

**Rationale**: A design kit that permits parallel values stops being a standard; drift
is eliminated at the token layer or not at all.

### II. Enterprise Monochrome, Near-Flat (NON-NEGOTIABLE)

The kit targets Ant Design-grade enterprise UI: solid neutral grounds (white `--bg`,
never gradients or tinted page grounds), border radius only from the tokens.css
radius scale (`--radius-*`; no ad-hoc radius values), 1px solid borders over
box-shadows (any shadow subtle, no glows), monochrome grays plus the single accent,
font weights 400/600 only, and compact information-dense layouts. Motion is
functional only: brief transitions (0.2s or less) on interactive state changes
(hover, active navigation, tab switches, opening panels), always disabled under
`prefers-reduced-motion` (owner decision, 2026-08-27). Decorative illustration,
page entrance animation, and "AI-bot look" styling MUST NOT ship.

**Rationale**: Enterprise and back-office buyers reject gradient/glow aesthetics on
sight; the product's data is the design.

### III. Component Library Over Re-implementation

Every UI need MUST be met by a shipped component class (`.btn`, `.card`, `.badge`,
`.table`, `.statrow`, `.bullets`, `.modal`, `.appbar`, `.container`, `.theme-nova*`)
before new code is written. A new component is admitted only when no existing one
covers the need, and MUST be self-contained, documented, and demoed in the kit's
reference page before consumers may use it. Parallel widgets duplicating an existing
component are rejected in review.

**Rationale**: Reuse is the entire value proposition of a kit; every parallel
implementation is future drift and double maintenance.

### IV. Accessibility & Responsive Baseline (NON-NEGOTIABLE)

Mobile-first CSS with 375px as the test baseline: no horizontal scroll, touch targets
≥ 44px, no hover-only interactions, native open/close (`<details>`, `<dialog>`)
preferred so UI works with JS off. Body text contrast MUST be ≥ 4.5:1 and every
interactive element MUST have a visible focus state (1px accent border, at most a 2px
pale ring). Dark mode is dual-trigger: every dark rule under BOTH
`[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`, with a persisted
toggle applied before paint. Hover treatment is single and reserved for clickables:
`translateY(-4px)` + raised shadow + accent border; static tiles get no hover.

**Rationale**: Accessibility and responsiveness are trust boundaries, not polish;
retrofitting them costs more than building on them.

### V. Brand & Copy Fidelity

Logos are placed assets (`--logo-master-*`, `--logo-product-*`) — a typed or
CSS-drawn "NOVUS" is not the logo; dark mode swaps master lockup to white and all
lockups to the two light blues. Product names are lowercase and solid-set
(`novapay`, never `NovaPay`). Copy is sourced from `Novus_Context.md` and the master
decks, never written fresh; missing copy gets a `<!-- copy: Novus_Context.md -->`
slot. The business model is "Service as Software": the strings "SaaS" and "Software
as a Service" MUST NOT appear in any output, including negated or contrast uses.
House copy style: published site and README copy MUST NOT use em-dash punctuation
(it reads as machine-generated); prefer commas, colons, or shorter sentences.

**Rationale**: The kit is the brand's enforcement point; if it leaks off-brand
assets or copy, every consumer inherits the leak.

### VI. Framework-Agnostic Integration

The kit MUST remain consumable from any web stack: its contract is CSS custom
properties, component classes, and static assets — never a binding to one
framework. The reference site MUST carry two sets of integration guides:
**framework guides** — Blazor, React, Vite, Vue.js — showing each application
stack consuming the kit, and **UI theme guides** — Tailwind CSS, Fluent 2,
Material, Ant Design — showing each UI library re-skinned with Novus tokens.
All framework- and library-side theming MUST derive from tokens.css **by
reference**: `var(--…)` where the library accepts CSS values, or a runtime read
of the computed token value where a library must calculate derived colors.
Copying a token's value into a config forks the brand and breaks dark mode, and
is a defect. A framework or library supplies behaviour and layout, but identity
(colour, type, radius, shadow, logos, components) comes from the kit; no view
runs two accent systems. Framework-specific component wrappers remain out of
the kit itself — integration is documented, not shipped as code. Every guide's
snippets MUST be executed in a sample project before publication; each guide
page embeds its sample's rendered result and names the verified library
version; verification is recorded per guide, and an unverified guide MUST NOT
ship (enforced by a build-time publication filter and a release gate).

**Rationale**: Novus teams build on different stacks; a kit that locks to one
framework stops being the company standard, and duplicated values drift the
moment tokens change.

### VII. Reference Applications (Admin Kits)

Reference applications (the Novus Admin Kit, in Blazor and Tailwind flavors)
are governed deliverables, not throwaway demos. Each flavor MUST consume the
PUBLISHED `novus-design-kit` npm package, never repo-relative kit files, so the
demo proves the real developer path. The flavors MUST keep screen parity: the
same screens, domain, and mock dataset, differing only in stack. All kit
principles apply in full, plus the app-interface conventions: white page
ground, one accent per view, traffic-light status colour only on judgement
metrics (never pure data), risk and alert messages always red, self-describing
chips, hover only on clickables, mobile-first at 375px, dual-trigger dark mode
with the persisted pre-paint toggle. Layout CSS specific to an app is composed
from tokens; re-implementing a shipped component is a defect. An admin kit
flavor ships only after a verified build-and-run with rendered screenshots
published on the docs site (the Principle VI verification discipline applied
to applications). The screen set includes an Analytics screen and a Data Grid
screen: charts follow the locked Novus dashboard-chart rules (Chart.js
defaults fed from tokens at runtime: Carlito, soft dashed gridlines at low
alpha, rounded bars with constrained thickness, no axis borders or tick
marks, dark rounded tooltips, and a composition read plus a trajectory read
on the primary series; series colours are the product accents, read from
tokens, never literals). Data grids are sortable, paginated, and searchable,
using the framework's native grid where one exists and kit-token styling
always. Each flavor MUST have a live demo hosted with the docs site, and the
docs page's screenshots MUST link to the running demos.

**Rationale**: A design kit is judged by its first real application; an
unverified or off-convention demo teaches every consumer the wrong patterns.

### VIII. Mobile Foundation Parity (Android & iOS)

The design system extends to native mobile as FOUNDATION MAPPINGS: guidance
that maps tokens.css onto each platform's dominant native system: Material 3
as published at m3.material.io on Android, delivered through Material
Components for Android (the View system: XML themes, styles, and resources;
the Android team's standard, owner decision 2026-08-27), and SwiftUI with the
Human Interface Guidelines on iOS. Mobile foundation pages MUST derive every colour, radius, spacing,
and type value from tokens.css (rem values map at 16px per rem to dp/pt) and
MUST NOT invent platform-only values; a build gate verifies that every hex
literal on a mobile foundation page exists verbatim in tokens.css. Carlito
remains the only typeface (bundled per platform; the TTF source is the design
system master, not this package). Dark mode keeps the dual-trigger discipline
in platform terms: follow the system appearance AND offer a persisted in-app
override. The kit's judgement rules carry over unchanged: one accent per
view, traffic-light colour only on judgements, lowercase solid-set product
names, placed logo assets. Mobile foundation pages are design mappings, NOT
run-verified guides in the Principle VI sense: they are labelled as such on
the page, and their verification standard is the token-parity gate plus
review, because the toolchains (Xcode especially) cannot run in the docs
build environment. A mobile page MUST name the platform library versions its
mapping targets.

**Rationale**: Product teams ship native apps; without an authoritative
token mapping each team re-derives the brand by eye and drifts. A mapping
whose every value is machine-checked against tokens.css keeps one source of
truth across web and mobile, while honest labelling separates it from
run-verified guides.

## Design Standards & Constraints

- Typeface: Carlito via `var(--font-sans)` only; no other font, no raw font-family.
- App shell: one centered content column `--container` (1200px) shared by header,
  nav, and main; master lockup in the header at `--logo-height` (26px).
- Product accents (light mode): novapay blue, novabank green `#00A04A`, novastore
  amber `#E8A300`, novatrust deep blue, novaboost orange `#E87830`, novaai indigo
  `#534AB7`; platform layers deep blue. Dark-mode lockups always drop identity color.
- Offline/single-file output inlines `tokens.css` and embeds woff2 fonts as base64;
  never `<link>` a stylesheet on a `file://` page.
- Docs site and admin consoles: full-width fluid layout on desktop (side gutters
  only, no fixed max-width page container); documentation content follows the
  container width with no fixed ch-measure caps; mobile-first responsive
  throughout; the docs site ships PWA basics (web app manifest and theme-color). Vertical rhythm on docs pages: headings, standalone
  code blocks, figures, and tables carry token-scale top/bottom spacing.
- Canonical docs host: https://ui-kit.novustech.dev (Cloudflare DNS CNAME to
  GitHub Pages; HTTPS enforced). Demo apps live under /demos/ on the same host.
- Kit source order: project copy of `tokens.css` first, skill snapshot second, the
  SharePoint master (`novaAI1.0program` → `Novus Design System/`) as living source.
  Drift is flagged to the design-system owner, never patched in one file alone.

## Development Workflow & Quality Gates

Every change to the kit MUST pass these gates before merge:

1. Token audit: grep the diff for hex/px literals the tokens define → replace with
   `var(--*)`. Grep for `gradient` → zero matches.
2. Dark parity: verified with the toggle AND with OS-dark + JS off — logo swaps to
   white, lockups go light-blue, no dark-on-dark text.
3. 375px pass: no horizontal scroll, ≥ 44px targets, menus/modals work with JS off.
4. Hover audit: every hover box does something on click; static tiles do not react.
5. Radius audit: no radius value outside the tokens.css radius scale.
6. Copy audit: `grep -ri "saas\|software as a service"` → zero matches; no leftover
   template/placeholder text (including CJK scaffold leaks).
7. New components ship with documentation and a reference-page demo in the same
   change; a component without a demo is incomplete.
8. Copy style: `grep -r "—"` on published site copy and README → zero matches.
9. Guide verification: every published framework/theme guide has a passing row
   in the verification record; unverified guides are excluded from the build.

Reviews reject on any gate failure; gates are not advisory.

## Governance

This constitution supersedes all other styling and component practices in the Novus
Design Kit. Any complexity beyond the shipped tokens and components MUST be justified
in the PR description against Principle III.

- Amendments: proposed as a PR to this file with a Sync Impact Report, approved by
  the design-system owner, and applied with a migration note for affected consumers.
- Versioning: semantic — MAJOR for principle removals/redefinitions, MINOR for new
  or materially expanded principles/sections, PATCH for clarifications.
- Compliance: every PR review verifies the Quality Gates above; a release of the kit
  MUST NOT ship with a known gate failure.
- Releases: every tagged release MUST, in the same change set, update CHANGELOG.md
  (Keep a Changelog format; state explicitly when packaged kit files are unchanged)
  and every version reference (package.json, README, release notes; the site
  version stamp derives from package.json at build time). A GitHub Release with
  the npm tarball attached accompanies every tag; publishing to npm requires the
  owner (passkey) and is recorded as pending in the release notes until done
  (owner decision, 2026-08-27).

**Version**: 1.8.1 | **Ratified**: 2026-08-26 | **Last Amended**: 2026-08-27
