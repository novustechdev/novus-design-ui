# Guide Verification Record (FR-017 / SC-007)

Every published framework/theme guide must have a `pass` row here. Enforcement is
two-fold: `site/build.mjs` publishes only guides with a passing row (an unverified
guide does not ship), and the `guide verification record` gate in `scripts/gates.sh`
fails if a page ever reaches `site/dist` without one. Re-verify a guide when its
target library ships a new major version.

Sample projects are throwaway by design (spec: "executed in a sample project");
they are rebuilt from the guide's own snippets in a scratch directory each time.
This round's samples: `vite-vanilla/` (Vite guide), `react-libs/` (React + all four
theme guides in one app), `vue-app/` (Vue guide) — session scratchpad, 2026-08-26.

| guide | library verified against | sample project | date | result |
|-------|--------------------------|----------------|------|--------|
| react | react 18.3.1 (vite 8.2.2) | react-libs | 2026-08-26 | pass |
| vite | vite 8.2.2 | vite-vanilla | 2026-08-26 | pass |
| vue | vue 3.5.41 (vite 8.2.2) | vue-app | 2026-08-26 | pass |
| blazor | — (.NET SDK not available on build machine; owner: Santo/DevOps — verify on a machine with dotnet, then flip this row) | — | 2026-08-26 | blocked |
| tailwind | tailwindcss 4.3.3 (@tailwindcss/vite) | react-libs | 2026-08-26 | pass |
| fluent2 | @fluentui/react-components 9.74.7 | react-libs | 2026-08-26 | pass |
| material | @mui/material 9.3.1 | react-libs | 2026-08-26 | pass |
| antd | antd 6.6.1 | react-libs | 2026-08-26 | pass |

## Findings folded back into the guides this round

- **Vite**: a `/node_modules` head script does not survive `vite build` — guide §4
  replaced with a verified inline pre-paint snippet. Noted that Vite copies the full
  logo set referenced by tokens.css url() tokens into build output.
- **Material**: MUI (v9) decomposes palette colours, so `var()` strings in `palette`
  throw MUI error #9 even with all variants supplied — guide rewritten to the
  runtime `getComputedStyle` read pattern (non-colour values keep `var()`).
- **Fluent 2**: `var()` values in the theme override object work as written.
- **Ant Design**: pattern works unchanged on antd v6 (guide originally written
  against the v5 API).
