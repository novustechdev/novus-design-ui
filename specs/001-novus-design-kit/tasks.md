# Tasks: Novus Design Kit — Component Library & Reference Site

**Input**: Design documents from `/specs/001-novus-design-kit/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in the spec — no test-first tasks. Validation is via
`scripts/gates.sh` (automated constitution gates) and quickstart.md checks, which are
built and run as tasks below.

**Organization**: Tasks grouped by user story so each story is an independently
testable increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (install & build), US2 (component catalog), US3 (foundations), US4 (brand assets)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository becomes the npm package skeleton; kit files land in their
published layout.

- [X] T001 Copy kit files from `references/Novus_Design_System_Kit_v2/` into package layout at repo root: `tokens.css` (verbatim), `fonts/*.woff2` (woff2 only, no ttf), `logos/` (full tree), `photos/` — preserving relative layout so `@font-face` paths resolve
- [X] T002 Create `package.json` (`@novus/design-kit`, version 0.1.0, `files` allowlist: tokens.css, fonts/, logos/, photos/, js/, README.md, CHANGELOG.md; `publishConfig` pointing at the private feed placeholder) and `.gitignore` (node_modules, site/dist/, *.tgz)
- [X] T003 [P] Initialize git repository with initial commit of scaffold + specs (repo is not yet under version control)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The three pieces every story leans on — theme helper (package + site),
gate script (all checkpoints), and the site shell/generator (US2–US4 pages).

**⚠️ CRITICAL**: Complete before any user story phase.

- [X] T004 [P] Implement `js/novus-theme.js`: pre-paint application of persisted `data-theme` from localStorage, `window.novusTheme.toggle()`, try/catch around all storage access, OS-preference fallback — per contracts/package-exports.md behavior contract
- [X] T005 [P] Implement `scripts/gates.sh`: gradient grep, ad-hoc hex/px audit (values tokens define, excluding tokens.css itself), radius-outside-token-scale audit, SaaS-string grep (case-insensitive, negations count), CJK leak grep, manifest↔detail-page completeness (both directions, tolerant of manifest not existing yet), orphan-class check; non-zero exit on any failure
- [X] T006 Implement `site/build.mjs` (zero-dependency Node ≥ 20) + `site/src/partials/` shared shell: header with master lockup at `--logo-height` linking `/`, nav (Foundations / Components / Install), moon-sun theme toggle wired to novus-theme.js, footer; builds any `site/src/**/*.html` fragment into `site/dist/` inside the shell; fails loudly on missing fragments; all styling via `var(--*)` from the root `tokens.css`

**Checkpoint**: `node site/build.mjs` produces an empty-but-shelled site; `scripts/gates.sh` runs clean on the scaffold.

---

## Phase 3: User Story 1 — Install and build with the kit (Priority: P1) 🎯 MVP

**Goal**: A Novus developer installs `@novus/design-kit` with one npm/yarn command and
gets tokens, Carlito, dark mode, and component styles with zero manual copying.

**Independent Test**: quickstart.md §3 — `npm pack`, install the tarball in a fresh
temp project, paste the Button/Card/App-shell patterns, verify correct light + dark
rendering and no asset 404s.

### Implementation for User Story 1

- [X] T007 [US1] Write `README.md`: private-registry one-time setup (`.npmrc`, no credential material, "Novus developers only" note), install command, wiring patterns (plain HTML link, bundler import), theme-helper `<head>` usage, asset reference examples, and token override/extension guidance (consumer values layer on top after the tokens.css import; never edit kit files; upgrades preserve overrides) — per contracts/package-exports.md
- [X] T008 [P] [US1] Create `CHANGELOG.md` with Keep-a-Changelog structure and a 0.1.0 entry
- [X] T009 [US1] Verify the tarball: run `npm pack` and confirm contents exactly match the `files` allowlist (tokens.css at root, fonts/logos/photos/js trees, README, CHANGELOG; no site/, specs/, references/)
- [X] T010 [US1] Run the install smoke test per quickstart.md §3 in `/tmp` (fresh project, install tgz, sample page with Button + Card + App shell, static server): Carlito loads, Novus Blue accent, dark mode via OS and via toggle, zero 404s; record result in specs/001-novus-design-kit/checklists/us1-smoke.md

**Checkpoint**: Package is installable and usable on its own — MVP shippable.

---

## Phase 4: User Story 2 — Component overview & detail pages (Priority: P2)

**Goal**: ant.design-style catalog: overview grid of every component, detail pages
with live examples, copyable snippets, do/don't guidance.

**Independent Test**: Open built site → components/index.html shows every manifest
entry with preview + link; any detail-page snippet pasted into the US1 smoke project
renders identically.

### Implementation for User Story 2

- [X] T011 [US2] Author `site/components.json`: all v1 families from contracts/component-classes.md (7 categories, ~21 components, root classes, one-line summaries, fragment paths); every root class in tokens.css owned by exactly one entry, deck/poster classes excluded
- [X] T012 [US2] Extend `site/build.mjs` to generate `components/index.html` from the manifest: category-grouped grid of `.card--interactive` cards with live mini-preview, name, summary, `.card-trigger` link to detail page
- [X] T013 [US2] Extend `site/build.mjs` to generate `components/<id>.html` from each manifest entry + fragment: page title, class list, fragment content (live examples + snippets + guidance), prev/next nav within category
- [X] T014 [P] [US2] Author General fragments in `site/src/components/`: button.html, badge.html, avatar.html, brand-lockup.html — each variant/state as live example + `<pre><code>` snippet (JS copy button progressive, works without JS) + do/don't bullets using `.bullets`
- [X] T015 [P] [US2] Author Layout fragments: container.html, grid-row.html, surface.html, app-shell.html (same structure as T014)
- [X] T016 [P] [US2] Author Data Display fragments: card.html, table.html, stats.html, bullets.html, leaders.html, logo-wall.html, collapse.html (collapse demo must work JS-off via `<details>`)
- [X] T017 [P] [US2] Author Feedback + Forms fragments: alert.html, modal.html (native `<dialog>` pattern, JS-off fallback documented), field-input.html, lead-form.html
- [X] T018 [P] [US2] Author Navigation + Theming fragments: nav.html, product-themes.html (all seven `.theme-nova*` with one-accent rule and dark-mode lockup behavior shown)
- [X] T019 [US2] Enable strict manifest↔page completeness + orphan-class gates in `scripts/gates.sh` (drop the "manifest missing" tolerance), rebuild site, run gates to exit 0, and spot-check SC-005: paste 3 snippets into the US1 smoke project and compare against the site rendering

**Checkpoint**: Catalog complete — every shipped component discoverable and copyable.

---

## Phase 5: User Story 3 — Design-system overview section (Priority: P3)

**Goal**: Foundations section like ant.design/docs/spec: principles, color,
typography, layout, logos, photography, dark mode — illustrated from the kit itself.

**Independent Test**: Each of the 7 foundation pages exists in the built site with
live token-rendered examples; landing and install pages route into both sections.

### Implementation for User Story 3

- [X] T020 [P] [US3] Author `site/src/foundations/principles.html` (from constitution principles + Novus_Context.md positioning; `<!-- copy: Novus_Context.md -->` slots where approved copy is missing) and `site/src/foundations/color.html` (semantic tokens, ramps, product accents swatch grid rendered from `var(--*)`, one-accent rule)
- [X] T021 [P] [US3] Author `site/src/foundations/typography.html` (Carlito specimen, `--text-*` scale table, weights) and `site/src/foundations/layout.html` (`--space-*` scale, container widths, grid, app shell anatomy)
- [X] T022 [P] [US3] Author `site/src/foundations/logos.html` (six master treatments, wordmarks, product lockups from `logos/`, placement rules, dark-mode swap demo) and `site/src/foundations/photography.html` (approved photos from `photos/` with usage guidance)
- [X] T023 [P] [US3] Author `site/src/foundations/dark-mode.html`: dual-trigger explanation, pre-paint toggle pattern with copyable `<head>` snippet, JS-off behavior
- [X] T024 [US3] Author landing page `site/src/index.html` (what the kit is, entry cards into Foundations/Components/Install — copy sourced, no invented taglines) and `site/src/install.html` (mirrors README; "Novus developers only" registry note; zero credentials), then rebuild and run gates

**Checkpoint**: Full reference site content complete.

---

## Phase 6: User Story 4 — Bundled brand assets (Priority: P4)

**Goal**: Every bundled asset discoverable by documented package path.

**Independent Test**: Asset page lists every file in `logos/` and `photos/` with
preview + `@novus/design-kit/...` path; referencing one of each from the smoke
project resolves the official file.

### Implementation for User Story 4

- [X] T025 [US4] Extend `site/build.mjs` to enumerate `logos/` and `photos/` at build time and generate an asset index (preview + copyable `@novus/design-kit/<path>` reference) injected into a new `site/src/foundations/assets.html` page; add the page to nav
- [X] T026 [US4] Verify asset resolution from the US1 smoke project: `<img src="node_modules/@novus/design-kit/logos/...">` for a master logo, a product lockup, and a photo; confirm official files render; record in specs/001-novus-design-kit/checklists/us1-smoke.md

**Checkpoint**: All four stories functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T027 Run the full manual gate checklist from quickstart.md §4 (dark parity with toggle AND OS+JS-off, 375px pass, hover audit, contrast + focus states) across all built pages; fix findings; record results in specs/001-novus-design-kit/checklists/release-gates.md
- [X] T028 Release readiness: drift check of shipped files against `references/Novus_Design_System_Kit_v2/` — `tokens.css` identical, `fonts/` woff2 files identical (`ttf/` deliberately not shipped), `logos/` and `photos/` trees identical; full `scripts/gates.sh` run, `npm pack` final inspection, `npm publish --dry-run`; actual feed URL + publish is an ops handoff noted in README

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none — start immediately
- **Foundational (Phase 2)**: needs T001–T002 (files + package layout in place)
- **US1 (Phase 3)**: needs Phase 2 (T004 ships in the package; T005 for checkpoint)
- **US2 (Phase 4)**: needs Phase 2 (shell + generator); independent of US1
- **US3 (Phase 5)**: needs Phase 2; independent of US1/US2 (nav links to components section degrade gracefully until US2 lands)
- **US4 (Phase 6)**: needs Phase 2; T026 additionally uses the US1 smoke project
- **Polish (Phase 7)**: needs all desired stories complete

### Within stories

- T011 → T012/T013 (generator consumes manifest) → T019 (gates strict) after fragments T014–T018
- T024 last in US3 (links to all other pages)
- T025 → T026

### Parallel Opportunities

- Phase 2: T004 ∥ T005 (T006 independent files too, but reviews shell decisions — run after T004 so the toggle wiring exists)
- US2 fragments: T014 ∥ T015 ∥ T016 ∥ T017 ∥ T018 (five different file sets)
- US3 pages: T020 ∥ T021 ∥ T022 ∥ T023
- After Phase 2, US1 and US2 and US3 can proceed in parallel by different people

## Parallel Example: User Story 2

```bash
# After T011–T013, launch all five fragment groups together:
Task: "Author General fragments in site/src/components/ (T014)"
Task: "Author Layout fragments in site/src/components/ (T015)"
Task: "Author Data Display fragments in site/src/components/ (T016)"
Task: "Author Feedback + Forms fragments in site/src/components/ (T017)"
Task: "Author Navigation + Theming fragments in site/src/components/ (T018)"
```

## Implementation Strategy

**MVP first**: Phases 1–3 only (T001–T010). Result: a publishable package any Novus
developer can install and build with — before a single docs page exists. Stop,
validate via the smoke test, and the package could ship as 0.1.0.

**Incremental delivery**: add US2 (catalog) → complete, internally previewable
catalog section (the site gains its landing and install pages in US3, so public
deployment waits for US3); add US3 (foundations + landing/install) → full
ant.design-style site, publicly deployable; add US4 (asset index) → complete. Each
phase ends with a gates run, so every increment is releasable.

## Notes

- No test-first tasks: validation = gates script + quickstart checks (spec requested no TDD)
- All site styling derives from root `tokens.css`; gates fail the build on ad-hoc values
- Copy on all pages is sourced (Novus_Context.md / constitution); leave sourced-copy slots rather than inventing text

---

## Phase 8: Convergence

- [X] T029 Create the guide-verification record at specs/001-novus-design-kit/checklists/guide-verification.md (one row per guide: guide, library + version verified against, sample-project location, date, pass/fail) and wire a release gate into scripts/gates.sh that fails when any page built under site/dist/frameworks/ or site/dist/themes/ lacks a passing row, per FR-017/SC-007 (missing)
- [X] T030 Verify the React, Vite, and Vue.js guides: scaffold throwaway Vite sample projects, install the packed kit tarball, execute each guide's wiring and snippets end-to-end, correct site/src/frameworks/{react,vite,vue}.html where behavior differs, and record results in the verification record, per FR-017 (missing)
- [X] T031 Verify the Blazor guide in a sample Blazor app (.NET SDK required): MSBuild copy target, head wiring, Razor markup, IJSRuntime toggle; if the SDK is unavailable in the build environment, record the guide as blocked-by-environment with a named owner and do not mark it verified, per FR-017 (missing)
- [X] T032 Verify the four theme guides (Tailwind CSS, Fluent 2, Material, Ant Design) in sample projects with the real libraries installed — specifically prove the MUI all-variants var() passthrough and the antd getComputedStyle runtime-read pattern — correct site/src/themes/*.html where reality differs, and record results, per FR-017 (missing)
- [X] T033 Add the GitHub Pages deployment workflow .github/workflows/pages.yml (checkout → node site/build.mjs → upload site/dist → deploy-pages) plus a README/ops note covering pushing the repository to GitHub and enabling Pages, per FR-016 and the GitHub Pages hosting clarification (missing)
- [X] T034 Extend the orphan-class gate in scripts/gates.sh to also fail when a tokens.css root class is claimed by more than one components.json entry, per data-model.md manifest rules (partial)
