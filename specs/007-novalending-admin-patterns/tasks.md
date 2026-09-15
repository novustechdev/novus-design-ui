---

description: "Task list for feature 007: admin patterns from the novalending reference"
---

# Tasks: Admin patterns from the novalending reference (feature 007)

**Input**: Design documents from `specs/007-novalending-admin-patterns/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/patterns.md, contracts/tooling.md, quickstart.md

**Tests**: No unit test suite is requested. Verification is the gate suite
(including the new pattern-parity and layout-audit gates, each negative-tested)
plus the recorded verified runs required by constitution Principle VII.

**Organization**: Tasks are grouped by user story so each story can be delivered
and checked on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 content fit, US2 sign-in and sign-out, US3 filters and paging, US4 navigation, US5 follow the patterns

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Single-source folder and local audit tooling

- [X] T001 Create `admin-kits/shared/icons.mjs` with the in-house line icon set (menu, close, chevron-left/right/down, search, filter, user, sign-out, sun, moon, eye, eye-off, dashboard, chart, transactions, grid, terminal, settings, workspace, plus, download, check) on the 24-unit grid per data-model.md, exporting `icons` and `svg(name, cls)`
- [X] T002 [P] Install `playwright-core@1.55.0` at the repository root with `--no-save --no-package-lock` and confirm a Chromium executable for `CHROME_PATH` (tooling only; nothing committed)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Governance, the shared pattern layer skeleton, parity generator, audit gate, and docs build support that every story depends on

- [X] T003 Amend `.specify/memory/constitution.md` to 1.11.0 per research R10 (Principle II authentication-ground exception, Principle IV content-fit rule, Principle VII novalending reference, required console patterns and shared layer, icon style in Design Standards, Quality Gates 10 and 11, Sync Impact Report)
- [X] T004 Create `admin-kits/shared/novus-admin.css` with `@pattern` section markers and migrate the console rules currently duplicated in `admin-kits/{tailwind,material}/src/admin.css` and `admin-kits/{blazor,blazor-demo}/wwwroot/admin.css` (wrap, body grid, brandmark, signals, tabs, chk, selectwrap, motion) plus the `icons` section
- [X] T005 [P] Create `admin-kits/shared/novus-admin.js` (document-level delegation: theme toggle, Escape and outside-click dismissal of `details[data-dismiss]`, drawer close on nav link follow and Escape, password visibility toggle)
- [X] T006 Extend `admin-kits/data/generate.mjs`: copy shared CSS and JS into the four deliverables, emit `admin-kits/blazor/Components/Shared/Icon.razor` and `admin-kits/blazor-demo/Shared/Icon.razor` from `icons.mjs`, inject SHELL header and nav blocks into `admin-kits/{tailwind,material}/*.html`, emit `DATA:filter-terminals` option markup, and add `--check` mode per contracts/tooling.md
- [X] T007 Reduce the four flavor stylesheets to their stack heads plus flavor-only rules and load the shared layer: `admin-kits/tailwind/src/admin.css`, `admin-kits/material/src/admin.css` (import), `admin-kits/blazor/Components/App.razor` and `admin-kits/blazor-demo/wwwroot/index.html` (link `novus-admin.css` and script `novus-admin.js`), `admin-kits/{tailwind,material}/src/app.js` (import shared JS)
- [X] T008 [P] Create `scripts/layout-audit.mjs` per contracts/tooling.md (static server with Blazor SPA fallback, page list, 1440 and 375 widths, text-rect line counting, 375 overflow check, scopes and skips, CI-aware SKIP/FAIL)
- [X] T009 Add the `admin pattern parity` and `layout audit` gates to `scripts/gates.sh`, and a `playwright-core` install step to `.github/workflows/pages.yml` and `.github/workflows/pr-gates.yml`
- [X] T010 Extend `site/build.mjs`: copy `admin-kits/shared/novus-admin.css` to `dist/assets/`, link it on every page before site styles, render manifest `css` sections as copyable blocks (throw on unknown), render `<!--ICON-INDEX-->` from `icons.mjs`, register `icons.html` and `alignment.html` in FOUNDATIONS, add the `Templates` category to `site/components.json`

**Checkpoint**: `node admin-kits/data/generate.mjs --check` passes, site builds, the layout audit runs and reports the current baseline findings.

---

## Phase 3: User Story 1 - Short content always stays on one line (Priority: P1) 🎯 MVP

**Goal**: No short value wraps anywhere in the Admin Kit or catalog examples; tables scroll inside their container; no page scrolls sideways at 375px.

**Independent Test**: `node scripts/layout-audit.mjs` reports zero WRAP and OVERFLOW findings; the Transactions table at 375px scrolls inside its card.

- [X] T011 [US1] Write the `content-fit` section in `admin-kits/shared/novus-admin.css` (badge and chip nowrap, `.tablewrap` scroll with single-line cells, `.cell--wrap`, `.cell--actions`, `.cell-stack`, `.truncate`, `.nowrap`, numeric alignment)
- [X] T012 [P] [US1] Apply content-fit markup to the table row templates in `admin-kits/data/generate.mjs` (actions column `cell--actions`, amounts `num`) and to table heads in `admin-kits/{tailwind,material}/{index,transactions,datagrid,terminals}.html`
- [X] T013 [P] [US1] Apply the same table markup in `admin-kits/blazor/Components/Pages/{Home,Transactions,Terminals,DataGrid}.razor` and `admin-kits/blazor-demo/Pages/{Home,Transactions,Terminals,DataGrid}.razor`
- [X] T014 [P] [US1] Update `site/src/components/table.html` (scroll container, single-line cells, wrap opt-in, actions and numeric alignment, `css: ["content-fit"]` in `site/components.json`)
- [X] T015 [P] [US1] Create `site/src/foundations/alignment.html` (single-line rule, truncation, wrap opt-in, numeric and action alignment, control-height alignment, right and wrong examples with `data-audit="skip"` on wrong ones)
- [X] T016 [US1] Run the layout audit against the rebuilt site and fix every remaining catalog or demo finding in the owning fragment under `site/src/components/` or `site/src/foundations/`

**Checkpoint**: layout audit clean; US1 deliverable independently shippable.

---

## Phase 4: User Story 2 - Sign in and sign out like the reference console (Priority: P1)

**Goal**: Split sign-in page, user menu with sign out, signed-out page in all four deliverables.

**Independent Test**: quickstart.md section 4 steps 1 and 5 pass in every deliverable; JS-off sign-in works on the Blazor Server flavor and the Tailwind build.

- [X] T017 [US2] Write the `user-menu`, `sign-in`, and `signed-out` sections in `admin-kits/shared/novus-admin.css` (deep brand ground scoped to `.authpage`, dark-lockup treatment on the panel, filled small-caps fields, `.pwtoggle` under `@media (scripting: enabled)`, forgot disclosure, ruled foot)
- [X] T018 [US2] Add the user menu to the SHELL header in `admin-kits/data/generate.mjs` (theme toggle moves into it; Sign out links to `signed-out.html`)
- [X] T019 [P] [US2] Rebuild `admin-kits/tailwind/login.html`, create `admin-kits/tailwind/signed-out.html`, add the entry to `admin-kits/tailwind/vite.config.js`, update login handling in `admin-kits/tailwind/src/app.js` (inline error, keep username)
- [X] T020 [P] [US2] Rebuild `admin-kits/material/login.html` with `md-filled-text-field` and the kit `.pwtoggle` in the trailing slot, create `admin-kits/material/signed-out.html`, add the entry to `admin-kits/material/vite.config.js`, import the filled text field in `admin-kits/material/src/app.js`
- [X] T021 [P] [US2] Blazor Server: static SSR form sign-in in `admin-kits/blazor/Components/Pages/Login.razor`, new `admin-kits/blazor/Components/Pages/SignedOut.razor`, auth ground via `admin-kits/blazor/Components/Layout/AuthLayout.razor`, user menu in `admin-kits/blazor/Components/Layout/MainLayout.razor`
- [X] T022 [P] [US2] WASM demo: `admin-kits/blazor-demo/Pages/Login.razor`, new `admin-kits/blazor-demo/Pages/SignedOut.razor`, `admin-kits/blazor-demo/Layout/AuthLayout.razor`, user menu in `admin-kits/blazor-demo/Layout/MainLayout.razor`
- [X] T023 [P] [US2] Create `site/src/components/sign-in-page.html`, `site/src/components/signed-out-page.html`, `site/src/components/user-menu.html` and their manifest entries (with `css`) in `site/components.json`

**Checkpoint**: sign-in, user menu, sign-out, sign-in again verified in all deliverables.

---

## Phase 5: User Story 3 - Find records with filters, sub-filters, and paging (Priority: P2)

**Goal**: Filter bar with quick status chips, two-pane sub-filter sheet, active chips, and list footer on Transactions; list footer on Data grid.

**Independent Test**: quickstart.md section 4 steps 3 and 4 give identical counts in all deliverables (Failed = 2; All with no filters = 24; rows per page 20 = 2 pages).

- [X] T024 [US3] Write the `filter-bar` and `list-footer` sections in `admin-kits/shared/novus-admin.css` (quick chips, search with icon, `details.filtermenu` trigger and count, two-pane sheet with generic nth-child panel switching, options, active chips, Clear all, footer range, paginator icon buttons, rows-per-page select, phone stacking)
- [X] T025 [P] [US3] Tailwind: filter bar and list footer markup in `admin-kits/tailwind/transactions.html`, list footer in `admin-kits/tailwind/datagrid.html`, one list controller (search, quick chips with live counts, sheet filters, chips, Clear all, sort, page, page size, empty state) in `admin-kits/tailwind/src/app.js`
- [X] T026 [P] [US3] Material: same markup and controller in `admin-kits/material/transactions.html`, `admin-kits/material/datagrid.html`, `admin-kits/material/src/app.js` (Material Web search field and buttons where the flavor already uses them)
- [X] T027 [P] [US3] Blazor Server: `admin-kits/blazor/Components/Shared/ListFooter.razor` bound to `PaginationState`, filter state and quick chips in `admin-kits/blazor/Components/Pages/Transactions.razor` (paged through QuickGrid-free table state), footer in `admin-kits/blazor/Components/Pages/DataGrid.razor`
- [X] T028 [P] [US3] WASM demo: `admin-kits/blazor-demo/Shared/ListFooter.razor`, `admin-kits/blazor-demo/Pages/Transactions.razor`, `admin-kits/blazor-demo/Pages/DataGrid.razor`
- [X] T029 [P] [US3] Create `site/src/components/filter-bar.html` (full bar, compact no-wrap row variant, quick chips) and update `site/src/components/pagination.html` to the list footer (numbered variant kept for long documents), manifest entries with `css`

**Checkpoint**: filtering and paging parity verified across deliverables.

---

## Phase 6: User Story 4 - Navigate a console with grouped navigation (Priority: P2)

**Goal**: Header with menu toggle and user menu, grouped side navigation with icons, desktop collapse and phone drawer without JavaScript, page headers with breadcrumbs on every screen.

**Independent Test**: quickstart.md section 4 step 2 at 1440px and 375px in all deliverables; JS-off drawer on the Blazor Server flavor and the Tailwind build.

- [X] T030 [US4] Write the `console-shell`, `side-navigation`, and `page-header` sections in `admin-kits/shared/novus-admin.css` (hidden checkbox toggle, desktop collapse, off-canvas drawer with scrim, nav groups with chevrons, coarse-pointer targets, crumbs, page header row and actions)
- [X] T031 [US4] Generate the grouped navigation (Dashboard, Analytics; Operations: Transactions, Data grid, Terminals; Configuration: Settings) with icons and the menu toggle in the SHELL blocks of `admin-kits/data/generate.mjs`, and add page headers with breadcrumbs to `admin-kits/{tailwind,material}/{index,analytics,transactions,datagrid,terminals,settings}.html`
- [X] T032 [P] [US4] Blazor Server navigation and toggle in `admin-kits/blazor/Components/Layout/MainLayout.razor`; page headers in `admin-kits/blazor/Components/Pages/{Home,Analytics,Transactions,DataGrid,Terminals,Settings}.razor`
- [X] T033 [P] [US4] WASM demo navigation in `admin-kits/blazor-demo/Layout/MainLayout.razor`; page headers in `admin-kits/blazor-demo/Pages/{Home,Analytics,Transactions,DataGrid,Terminals,Settings}.razor`
- [X] T034 [P] [US4] Create `site/src/components/side-navigation.html` and `site/src/components/page-header.html`; update `site/src/components/breadcrumb.html` (`.crumbs`, slash separator) and `site/src/components/app-shell.html` (console header, theme toggle in the user menu); manifest entries with `css`

**Checkpoint**: navigation and page structure verified across deliverables.

---

## Phase 7: User Story 5 - Anyone can follow the patterns (Priority: P3)

**Goal**: Everything is findable, copyable, counted correctly, and protected by gates.

**Independent Test**: overview shows 40 components; searches find each pattern; Icons and Alignment foundations render; both new gates fail when deliberately broken and pass when restored.

- [X] T035 [P] [US5] Create `site/src/foundations/icons.html` (style rules, sizes, accessibility, `<!--ICON-INDEX-->` grid with copyable markup)
- [X] T036 [P] [US5] Update component counts and discovery: `site/src/index.html` (34 to 40), `README.md`, and the "Choose by function" sets in `site/build.mjs` (add an Admin consoles set)
- [X] T037 [US5] Negative-test both new gates (edit a generated CSS copy for parity; remove the content-fit section for the audit), record results in `specs/002-novus-admin-kit/checklists/verification.md`, restore

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T038 Build all deliverables (`admin-kits/tailwind`, `admin-kits/material` with Vite; `admin-kits/blazor` build; `admin-kits/blazor-demo` publish), run `node site/build.mjs` and `scripts/gates.sh` to ALL GATES PASS
- [X] T039 Verified runs per quickstart.md (flows, JS-off, cross-flavor counts, 375px, dark) with results appended to `specs/002-novus-admin-kit/checklists/verification.md`
- [X] T040 Refresh Admin Kit screenshots in `site/src/assets/admin-kit/` (dashboard light and dark, transactions with open filter sheet, data grid, sign-in, signed-out, 375px) and update `site/src/admin-kit.html` (screens list, patterns, eight screens, getting-started paths to the shared layer)
- [X] T041 [P] Update `CHANGELOG.md` (Unreleased), `CONTRIBUTING.md` (shared layer and new gates), `memory/project_state.md`, `.specify/feature.json` pointer, and mark tasks complete in this file
- [X] T042 Commit on `feature/007-novalending-admin-patterns` and open the pull request against `main` with the tokens.css upstreaming follow-up noted (owner approval before push)

---

## Dependencies & Execution Order

- **Setup (T001-T002)** then **Foundational (T003-T010)**: T004 before T006 and T007; T001 before T006 and T010; T008 before T009.
- **US1 (T011-T016)** first: the content-fit rules and audit are the MVP and the guard for every later story.
- **US2, US3, US4** can proceed in parallel after US1; within each, the CSS section task comes first, then flavor tasks in parallel, then docs.
- **US4 T031** and **US2 T018** both edit the SHELL blocks in generate.mjs: do T018 then T031 (or merge).
- **US5** after US2 to US4 (counts and discovery need the final manifest).
- **Polish** last; T042 needs the owner's go-ahead to push.

## Parallel Example: User Story 3

```text
After T024:
  T025 Tailwind transactions + datagrid + app.js
  T026 Material transactions + datagrid + app.js
  T027 Blazor Server ListFooter + Transactions + DataGrid
  T028 WASM demo ListFooter + Transactions + DataGrid
  T029 Docs filter-bar + pagination
```

## Implementation Strategy

1. MVP: Phases 1 to 3. The single-line rule, shared layer, parity gate, and audit
   ship first and immediately protect every screen.
2. Increment: US2 (entry and exit screens), then US3 and US4 in parallel.
3. Close with US5 and polish: counts, foundations, gate negative tests,
   verified runs, screenshots, changelog, PR.
