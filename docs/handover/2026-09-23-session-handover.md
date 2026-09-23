# Handover: Novus Design Kit, 2026-09-23 (feature 008)

## Where we are

Feature 008 (enterprise portal defaults) is implemented and verified on branch
`feature/008-enterprise-portal-defaults`. Constitution is 1.12.0, kit version is
0.4.0, catalog is 42 components, and all 17 gates pass (the three new layout
rules ride inside the layout audit gate; version agreement is its own gate).

## What the owner asked for, and where it landed

The round came from novabank.novustech.dev. Eight items:

1. Account menu at the far right: already the kit's order; now gate 12 keeps it.
2. Text wrapping beside unused space: root cause was `tokens.css` capping every
   paragraph at 68ch. The console layer resets it for portal surfaces, `.measure`
   opts prose back in, and gate 14 catches regressions.
3. Navbar and content typography: one size across shell and content
   (`--text-sm`), page title `--text-xl`, sections `--text-lg`; gate 13.
4. Audit page filter bar: the 007 filter bar already matched the reference. What
   was missing was delivery, so the console layer is now packaged; a Date range
   category joined the sub-filter sheet for audit-style screens.
5. Sign-in on the novacard layout: 50/50 split, ambient line art (the one
   decoration the kit allows, stopped under reduced motion), single sign-on
   beside the password form, no theme toggle. novacard's radial gradient was NOT
   adopted; the ban stands and the ground stays flat.
6. Light default everywhere: `js/novus-theme.js` applies light when nothing is
   stored; `window.novusThemeFollowOS = true` restores the old behaviour.
7. D3 statistics: Chart.js is gone from every flavor and the docs.
   `admin-kits/shared/novus-chart.js` draws composition bars with a trajectory
   line and a share donut, reading tokens at render time, with hover and
   keyboard tooltips and a table of the same numbers for JS-off.
8. Account page: the settings layout (section menu beside grouped rows) replaces
   the card grid and tab strip.

## Verify

- 79/79 verified checks across Tailwind, Material, Blazor Server and the WASM
  demo, plus JavaScript-off runs, recorded in
  `specs/002-novus-admin-kit/checklists/verification.md`.
- Packaged-install check: a blank project installing the 0.4.0 tarball and
  importing `tokens.css` plus `console.css` renders the sign-in (720/720 split),
  console shell, settings layout and icon sprite, and renders light on a dark
  operating system.
- All four new gates negative-tested (element right of the account menu, a
  smaller navbar, a capped paragraph, a version mismatch) and restored.

## Open items

- 0.4.0 published to npm by the owner on 2026-09-23, so novabank-py can pin it.
  The granular token in ~/projects/credentials was never accepted for this
  package (403 on every authenticated call, 404 on PUT); `npm login` worked.
- novabank's authenticated screens were never inspected (no credentials); the
  patterns follow the written feedback plus the novacard and novalending
  references.
- novabank-py implements its own page-level fixes against this release.

## Next session: start here

1. Build order: `node admin-kits/data/generate.mjs`, vite build (tailwind,
   material), `dotnet publish -c Release` (blazor-demo), `node site/build.mjs`,
   `scripts/gates.sh`.
2. The layout audit needs `playwright-core` at the repo root and a Chromium
   (`CHROME_PATH`, or `~/.cache/ms-playwright`).
3. Commits are authored as sgultom99 with no assistant trailers.
