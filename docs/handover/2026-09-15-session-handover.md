# Handover: Novus Design Kit, 2026-09-15 (feature 007)

## Where we are

Feature 007 (console patterns from the novalending reference) is implemented and
verified on branch `feature/007-novalending-admin-patterns` and shipped via pull
request to `main`. Constitution is 1.11.0. Catalog is 40 components. All 16 gates pass,
including the two new ones (admin pattern parity, layout audit).

## What shipped in the working tree

- `admin-kits/shared/`: the single source for console patterns.
  `novus-admin.css` (token-only, `@pattern` sections: content-fit, icons,
  console-shell, side-navigation, page-header, user-menu, sign-in, signed-out,
  filter-bar, list-footer, data-grid, console-screens), `novus-admin.js`
  (progressive behaviour), `console-pages.js` (static flavors' page logic),
  `icons.mjs` (in-house line icons).
- `admin-kits/data/generate.mjs` now emits the shared copies, the console
  shell and filter/footer markup into the static pages (SHELL markers), the
  Razor shell components (Icon, ConsoleHeader, ConsoleNav, AuthBrand,
  SignedOutCard, PasswordToggle), and mirrors the Blazor Server pages, layouts,
  and ListFooter into the WASM demo. `--check` is Quality Gate 10.
- All flavors: split sign-in, user menu with theme toggle and Sign out, new
  signed-out page, grouped nav with JS-free collapse and phone drawer, page
  headers with breadcrumbs, Transactions filter bar (quick status chips, sub-
  filter sheet: Product, Terminal, Amount; active chips) and list footers.
  Blazor Server sign-in is a static SSR form post (JS-off safe).
- `scripts/layout-audit.mjs` (Quality Gate 11): headless Chromium over
  `site/dist` at 1440 and 375; WRAP and OVERFLOW findings. Needs
  `npm install --no-save --no-package-lock playwright-core@1.55.0` at the repo
  root; locally it finds `~/.cache/ms-playwright/chromium-*`, or set
  `CHROME_PATH`. Prints SKIP locally without tooling, FAIL in CI.
- Docs: six new component pages (Templates category added), four updated,
  Icons and Alignment and content fit foundations, component pages print their
  CSS from the shared layer, refreshed Admin Kit screenshots (9 per flavor).
- Speckit: `specs/007-novalending-admin-patterns/` (spec, plan, research,
  data-model, contracts, quickstart, tasks T001-T042 done).

## Verify

- 109/109 flow checks across Tailwind, Material, Blazor WASM demo, Blazor
  Server, plus JS-off checks (recorded in
  `specs/002-novus-admin-kit/checklists/verification.md`).
- Negative tests: hand-edited generated CSS fails `--check`; removing the
  table content-fit rule yields 13 WRAP findings.

## Open items

- Follow-up for the design-system owner: upstream badge nowrap and the
  scroll-container table rule into the tokens.css master, so consumers who do
  not load the console layer also get single-line tables.
- The reference console's credentials were used only for the live capture and
  are not stored anywhere in the repository.

## Next session: start here

1. `git status` on `feature/007-novalending-admin-patterns`.
2. Build order for gates: vite build (tailwind, material), `dotnet publish -c
   Release` (blazor-demo), `node admin-kits/data/generate.mjs --check`,
   `node site/build.mjs`, `scripts/gates.sh`.
3. Commits are authored as sgultom99 with no assistant trailers (constitution).
