# Implementation Plan: Enterprise portal defaults

**Branch**: `feature/008-enterprise-portal-defaults` | **Date**: 2026-09-23 | **Spec**: [spec.md](spec.md)

## Summary

Turn the owner's novabank feedback into enforced kit defaults: package the
console layer so consumers inherit it, make light the default theme, put one
type size across shell and content with capped heading ratios, stop text
blocks wrapping beside empty space, rebuild sign-in on the novacard 50/50
layout with ambient art and single sign-on, replace Chart.js with D3 and give
the landing page interactive statistics, and replace the settings card grid
with a sectioned settings layout. Three new gates keep each rule honest, and
the kit releases as 0.4.0.

## Technical Context

**Language/Version**: HTML, CSS (token-only), vanilla ES modules, Node 20, C#
and Razor on .NET 10

**Primary Dependencies**: `novus-design-kit` (this repo, 0.4.0), D3 7 (replacing
Chart.js 4), Vite 8, Tailwind 4, `@material/web` 2, QuickGrid 10.0.11,
`playwright-core` 1.55 for the audit

**Target Platform**: evergreen browsers, GitHub Pages

**Project Type**: design kit plus four reference applications

**Constraints**: `tokens.css` byte-frozen; every value a token; no gradients;
ambient motion only on authentication screens and reduced-motion aware; 375px
without horizontal scroll; single-line short content (007); JS-off safe shell,
sign-in, menus and settings

**Scale/Scope**: 4 deliverables x 8 screens, ~6 catalog pages touched, 2
foundations updated, 3 new gates, 1 release

## Constitution Check

| Principle | Status | Note |
|---|---|---|
| I. Token-first | PASS | New patterns and charts read tokens at render time; hex gates cover the chart source. |
| II. Monochrome near-flat | AMEND | Ambient authentication art added as a narrow exception (slow, reduced-motion aware, no layout shift). Gradient ban stands, so novacard's radial panel is not copied. |
| III. Component library | PASS | Settings layout is new; sign-in, header and filter bar are updates to shipped components. |
| IV. Accessibility and responsive | AMEND | Light default replaces "operating system decides when nothing is set"; dark rules stay dual-trigger and following the system becomes an opt-in. Charts gain keyboard-reachable tooltips. |
| V. Brand and copy | PASS | Copy stays sourced; no em dashes; lowercase product names. |
| VI. Framework-agnostic | PASS | The console layer is CSS plus a small script; D3 is a dependency of the reference apps and of the documented chart recipe, not a kit binding. |
| VII. Reference applications | AMEND | Charting standard becomes D3; portal defaults (account menu placement, typography parity, content width, settings layout, interactive landing statistics) join the app conventions. |
| VIII. Mobile foundations | N/A | No change. |
| Governance | AMEND | Release rule extended with a version agreement gate; 0.4.0 ships the console layer. |

**Post-design re-check**: PASS with the amendments above recorded in
constitution 1.12.0.

## Project Structure

```text
.specify/memory/constitution.md         # 1.11.0 -> 1.12.0
console.css                             # NEW packaged console layer (generated)
icons/novus-icons.svg                   # NEW packaged sprite (generated)
js/novus-theme.js                       # light default, documented opt-out
js/novus-console.js                     # NEW packaged progressive script (generated)
package.json                            # 0.4.0, files[] gains console.css, icons/
admin-kits/
  shared/novus-admin.css                # + typography parity, content width, sign-in art, settings layout
  shared/novus-chart.js                 # NEW single D3 chart source (replaces four Chart.js copies)
  shared/console-pages.js               # settings + chart wiring
  data/generate.mjs                     # emits packaged artifacts, date filter category, settings markup
  {tailwind,material}/                  # d3 dependency, settings screen, landing statistics
  {blazor,blazor-demo}/                 # d3 in wwwroot/lib, Settings.razor, Home.razor statistics
scripts/
  layout-audit.mjs                      # + account menu, typography, content width checks
  gates.sh                              # + version agreement gate
site/
  components.json, build.mjs            # settings layout and chart entries
  src/components/{settings-layout,sign-in-page,app-shell,pagination?}.html
  src/foundations/{typography,alignment}.html
  src/admin-kit.html, index.html, install.html
README.md CHANGELOG.md CONTRIBUTING.md
```

**Structure Decision**: keep feature 007's single-source model. Everything new
lands in `admin-kits/shared/` and is emitted outward by the generator, now also
to the repository root for packaging.

## Phases

1. Governance and packaging: constitution 1.12.0, generator emits packaged
   artifacts, `package.json` 0.4.0, version agreement gate.
2. Rules with gates: typography parity, content width, account menu placement
   in `layout-audit.mjs` (each proved by a deliberate break).
3. Theme default in `js/novus-theme.js` and every pre-paint snippet.
4. Sign-in: 50/50, ambient art, single sign-on, across four deliverables.
5. Charts: D3 source, Analytics screens, landing page statistics, Chart.js
   removal from dependencies and documentation.
6. Settings layout: pattern, four deliverables, catalog page.
7. Docs, screenshots, verified runs, release notes, PR.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Ambient motion on sign-in (Principle II) | Owner asked for novacard's animated panel | A static panel ignores the instruction; a gradient panel breaks gate 1 |
| Replacing a working chart stack | Owner chose D3 as the standard | Keeping Chart.js alongside was offered and declined |
| Packaged console layer (new shipped files) | Consumers must inherit patterns by upgrading | Repository-only delivery is what left novabank-py stranded |
