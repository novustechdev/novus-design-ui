# Phase 0 Research: Novus Design Kit

All Technical Context unknowns resolved. Sources: `references/Novus_Design_System_Kit_v2/`
(tokens.css, Use_tokens_in_your_app.md, brand.html, asset folders), project constitution,
and the three spec clarifications.

## D1. Package contents & layout

- **Decision**: Publish the kit snapshot as-is: `tokens.css` at package root with
  `fonts/`, `logos/`, `photos/` beside it, plus a new `js/novus-theme.js` helper and
  README/CHANGELOG. Ship `.woff2` fonts only (no `ttf/`). Docs, deck templates, and
  `references/` are excluded via the package.json `files` allowlist.
- **Rationale**: `tokens.css` declares `@font-face` with relative `fonts/…woff2` URLs —
  preserving the layout means zero transformation and zero build step. The kit's own
  usage doc ("keep `fonts/` beside it") becomes literally true for `node_modules`
  consumers. Photos/logos ship because FR-006 requires assets resolvable from the
  package.
- **Alternatives considered**: CSS build pipeline (PostCSS, rewritten asset URLs) —
  rejected: adds tooling for no user-visible gain. Separate assets package — rejected:
  two installs, two versions to keep in sync.

## D2. Package name & registry

- **Decision**: `@novus/design-kit`, published to a private Azure Artifacts npm feed.
  One-time developer auth (`.npmrc` with the feed URL) documented in README and on the
  public site without any credential material.
- **Rationale**: Clarification locked "private registry". Novus already runs Azure
  DevOps (work tracking lives there), so Azure Artifacts is the zero-new-vendor choice;
  npm/yarn work unchanged after `.npmrc` setup. Scope name is a publish-time string —
  trivially renameable if the org registers a different scope.
- **Alternatives considered**: Public npm (rejected by clarification — proprietary
  photos/logos), GitHub Packages / Verdaccio (viable, but a second vendor or a
  self-hosted service to operate).

## D3. Reference site generator

- **Decision**: A zero-dependency Node script (`site/build.mjs`) that assembles static
  pages from shared shell partials + per-page HTML fragments, driven by
  `site/components.json` (the component manifest). Output to `site/dist/`.
- **Rationale**: ~32 pages with one shared shell. A dependency-free template-literal
  script (~100 lines) removes the duplication without adopting an SSG's config surface,
  update cadence, and lockfile. The manifest doubles as the machine-readable source for
  the overview grid and the "every component documented" release gate.
- **Alternatives considered**: Eleventy/Astro (rejected: real capability not needed at
  this page count; new dependency tree on a brand-critical artifact), hand-written
  static pages (rejected: 28 copies of header/nav is guaranteed drift), client-side
  rendering (rejected: site must work with JS off).

## D4. Component catalog scope (v1)

- **Decision**: ~20 app/web component families derived from the 90 classes in
  tokens.css: Button, Badge, Avatar, Alert, Card, Table, Stat row, Bullets, Collapse/
  Disclosure, Modal, Form field + Input, Lead form, Grid/Row/Container, App shell
  (appbar/appheader/appnav), Nav, Client logo wall, Leaders, Brand lockup, Surface,
  Product themes (`theme-nova*`). Deck/poster classes (`.novus-slides`, `.nslide*`,
  `.novus-poster`, `.vchain*`, `.vdialog*`) are excluded from the v1 catalog.
- **Rationale**: Spec scope is the web component library; decks already have their own
  template documentation in the kit (`slide-template/`). Exact family grouping is
  finalized when the manifest is authored, against the full class scan.
- **Alternatives considered**: Documenting all 90 classes flat (rejected: utilities and
  sub-elements like `.modal__actions` belong inside their family's page, not as
  catalog entries).

## D5. Theme toggle helper

- **Decision**: Ship `js/novus-theme.js`: reads persisted choice from localStorage,
  applies `data-theme` before first paint (documented as a `<head>` script), exposes a
  `toggle()` used by the site's moon/sun button. Wrapped in try/catch so storage
  failures fall back to OS preference.
- **Rationale**: The design system's locked behavior requires a persisted pre-paint
  toggle plus OS-preference support; every consumer would otherwise re-write the same
  15 lines, divergently.
- **Alternatives considered**: Documentation-only snippet (rejected: copy-paste drift
  of a locked behavior), CSS-only OS preference (rejected: constitution calls
  toggle-less dark mode a defect).

## D6. Quality gates automation

- **Decision**: `scripts/gates.sh` runs the constitution's grep-able gates against
  `site/src`, `site/dist`, README and package files: gradient grep, ad-hoc hex/px
  audit (values the tokens define), radius-outside-token-scale audit, SaaS-string grep
  (case-insensitive, includes negations), CJK leak grep, and manifest↔detail-page
  completeness. Non-zero exit blocks release. Manual gates (dark parity incl. JS off,
  375px, hover audit, contrast) are scripted as a human checklist in quickstart.md.
- **Rationale**: FR-013 makes gates release-blocking; everything grep-able should not
  depend on reviewer diligence.
- **Alternatives considered**: Full browser-automation test suite (rejected for v1:
  heavy dependency for checks a human does in minutes at release cadence; can be added
  if release frequency grows).

## D7. Versioning & change log

- **Decision**: Manual semantic versioning with a hand-maintained CHANGELOG.md
  (Keep-a-Changelog style); breaking entries carry a migration step. Publishing is
  gated on `scripts/gates.sh` passing.
- **Rationale**: FR-012 needs consumer-visible change history; one package with a
  human release cadence doesn't justify release automation.
- **Alternatives considered**: changesets/semantic-release (rejected: dependency and
  CI ceremony exceed the need for a single-package repo).

## D8. Site hosting & visibility

- **Decision**: `site/dist/` is a plain static artifact deployable to any static host;
  recommend Azure Static Web Apps (company platform). Public, no auth (clarification).
  Install page states "Novus developers only" for registry access and never embeds
  feed tokens.
- **Rationale**: Clarification locked public visibility; static output keeps hosting a
  pure ops choice that doesn't affect the codebase.
- **Alternatives considered**: GitHub Pages (fine technically; Azure keeps one vendor).

## D9. Upstream sync (SharePoint master)

- **Decision**: `references/Novus_Design_System_Kit_v2/` stays the read-only upstream
  snapshot. Root `tokens.css`/assets are refreshed from it (or from the SharePoint
  master) as a deliberate versioned change; drift found during work is flagged to the
  design-system owner (Rick), never patched locally. A diff check between root and
  reference snapshot is part of release review.
- **Rationale**: Constitution's kit-source order; keeps the npm package an exact
  distribution of the governed system.
- **Alternatives considered**: Automated SharePoint pull (rejected: auth + cadence
  complexity; releases are deliberate events).

## D10. Browser support

- **Decision**: Evergreen browsers, last 2 major versions (Chrome/Edge/Firefox/
  Safari). Everything used (CSS custom properties, `prefers-color-scheme`,
  `<details>`, `<dialog>`) is baseline in that range.
- **Rationale**: Standard enterprise web baseline; no transpilation/polyfills needed.
- **Alternatives considered**: IE/legacy support (rejected: custom properties are the
  kit's foundation; no Novus requirement exists).
