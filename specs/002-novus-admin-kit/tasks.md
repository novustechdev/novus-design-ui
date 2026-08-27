# Tasks: Novus Admin Kit (Blazor + Tailwind flavors)

**Input**: Design documents from `/specs/002-novus-admin-kit/`
**Tests**: none requested; validation = gates + parity check + verified runs (quickstart.md)

## Phase 1: Setup & Shared Data

- [X] T001 Author `admin-kits/data/dataset.json` per data-model.md (4 KPIs, 2 signals, 24 transactions, 12 terminals; conventions: lowercase products, illustrative figures, no client names)
- [X] T002 Implement `admin-kits/data/generate.mjs` emitting `admin-kits/blazor/Data/SeedData.cs` and `admin-kits/tailwind/src/data.js`; run it and commit outputs
- [X] T003 Extend `scripts/gates.sh` authored-styling scans (hex, gradient, radius, font-size, SaaS, em-dash) to cover `admin-kits/*/` sources (Razor, HTML, CSS, JS; exclude node_modules, bin, obj, dist, wwwroot/lib)

## Phase 2: User Story 2 first for shared design (Tailwind flavor, P2 built first as the design reference)

- [X] T004 [US2] Scaffold `admin-kits/tailwind`: package.json (dep novus-design-kit from public npm), vite.config.js (4 HTML inputs + @tailwindcss/vite), src/admin.css (`@import kit tokens` + `@theme inline` mapping + app shell layout CSS: header, sidebar grid, details-menu under 900px, all var())
- [X] T005 [US2] Build the shared shell partial pattern (header per screens.md contract with master lockup pair + toggle; sidebar with aria-current) and the Dashboard page (statrow, signal cards, recent-transactions table)
- [X] T006 [US2] Transactions page: full table, status filter (JS, progressive), native dialog detail, empty state; Terminals page: fleet table, degraded-first sort; Settings page: profile form (non-persisting, says so) + Appearance card with kit toggle
- [X] T007 [US2] README for the flavor (prereqs, install, run, customize); `npm run build` clean; JS-off nav sanity via built pages

## Phase 3: User Story 1 (Blazor flavor, parity port)

- [X] T008 [US1] Scaffold `admin-kits/blazor`: Blazor Web App (no sample pages), npm dep + verified MSBuild copy target, remove template Bootstrap/app.css, wire kit stylesheet + theme script + wwwroot/admin.css (same layout CSS as tailwind flavor)
- [X] T009 [US1] Port the four screens to Razor pages/components with SeedData.cs; InteractiveServer only on the transactions filter component and theme toggle; parity per contracts/screens.md
- [X] T010 [US1] README for the flavor; `dotnet build` clean; run + smoke (screens 200, kit assets served from wwwroot/lib)

## Phase 4: User Story 3 (docs page) + verification

- [X] T011 [US3] Verify both flavors per quickstart.md: build, run, puppeteer screenshots (per flavor: dashboard light + dark, transactions, dashboard 375px) into `site/src/assets/admin-kit/`; record stacks/date/results in `specs/002-novus-admin-kit/checklists/verification.md`
- [X] T012 [US3] Author `site/src/admin-kit.html` (screen inventory, conventions demonstrated, screenshots both flavors, copyable run instructions, copy-the-folder distribution note); add "Admin Kit" to site nav in `site/src/partials/header.html` + build.mjs root-page handling
- [X] T013 [US3] Parity check (`node admin-kits/data/generate.mjs && git diff --exit-code admin-kits`), full `node site/build.mjs && scripts/gates.sh`, commit, push, deploy docs, verify the live Admin Kit page

## Dependencies

- T001 → T002 → (T005, T006, T009)
- T003 anytime before T13's gates run
- Phase 2 before Phase 3 (Blazor ports the settled design); T011 needs both flavors; T012 needs T011; T013 last
