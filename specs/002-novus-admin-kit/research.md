# Phase 0 Research: Novus Admin Kit

## D1. Screen set and domain

- **Decision**: novapay operations console; four screens: Dashboard, Transactions,
  Terminals, Settings. Sidebar + internal-tool header shell.
- **Rationale**: Matches what TailAdmin-class templates prove (shell, KPIs, data
  table, form) while staying in sourced Novus domain language. Terminals and
  transactions are the natural novapay nouns.
- **Alternatives**: CRM-style demo (rejected: off-domain); more screens (rejected:
  parity cost doubles per screen; four covers every component category).

## D2. No charting library

- **Decision**: stat rows + signal cards instead of charts.
- **Rationale**: The design system's own locked convention prefers plain-language
  signal cards wherever a chart would be re-read into a sentence; also keeps both
  flavors dependency-light and identical. Charts (Chart.js with the anti-Excel
  defaults) can be feature 003 if wanted.
- **Alternatives**: Chart.js in both flavors (rejected for v1: two integrations +
  the locked chart-styling rules double the surface).

## D3. Parity mechanism: one dataset, generated twice

- **Decision**: `admin-kits/data/dataset.json` is the single source;
  `generate.mjs` writes `blazor/Data/SeedData.cs` and `tailwind/src/data.js`.
  Generated files are committed (no build-time coupling between flavors).
- **Rationale**: SC-002 parity is checkable by regenerating and diffing; committed
  outputs keep each flavor copy-and-run standalone.
- **Alternatives**: hand-maintained duplicates (drift guaranteed); runtime fetch of
  shared JSON (Blazor SSR + file URLs complicate copy-standalone).

## D4. Blazor flavor shape

- **Decision**: Blazor Web App, global SSR; `@rendermode InteractiveServer` only on
  the transactions filter component and the theme-toggle button. Kit via npm +
  the verified MSBuild copy target; template Bootstrap and app.css removed.
- **Rationale**: Exactly the verified Blazor guide path; SSR keeps JS-off
  navigation.

## D5. Tailwind flavor shape

- **Decision**: Vite 8 MPA (four HTML inputs), tailwindcss 4 via @tailwindcss/vite,
  `@theme inline` mapping per the verified theme guide, vanilla JS only for the
  toggle and the transactions filter.
- **Rationale**: MPA = JS-off navigation; matches the verified Tailwind guide;
  no framework keeps the flavor about Tailwind itself.

## D6. Sidebar pattern

- **Decision**: New app-layout CSS per flavor (grid: sidebar + main; sidebar links
  as block anchors with aria-current, tokens only). Mobile: sidebar becomes a
  native `<details>` menu above content (pattern proven on the docs site).
- **Rationale**: tokens.css ships no sidebar component; constitution III allows
  app-layout composition. Both flavors share the same CSS file contents.

## D7. Verification & docs evidence

- **Decision**: build + run both flavors; puppeteer screenshots: per flavor
  dashboard light + dark, transactions light, 375px dashboard; record in
  `checklists/verification.md`; screenshots into `site/src/assets/admin-kit/`;
  docs page embeds them (constitution VII).
- **Rationale**: Same discipline as guide verification, applied to apps.
