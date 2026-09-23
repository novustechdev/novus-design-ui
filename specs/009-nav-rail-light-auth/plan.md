# Implementation Plan: Icon rail and the light sign-in ground

**Branch**: `feature/009-nav-rail-light-auth` | **Date**: 2026-09-23 | **Spec**: [spec.md](spec.md)

## Summary

Two corrections to patterns the kit already ships, both mandatory per the
owner. Collapsing a console's side navigation now leaves a rail of icons
instead of nothing, and the sign-in page moves from the deep brand panel to the
kit's near-white ground with the ambient art retinted for a light surface. Both
land in the packaged console layer, so consumers inherit them by upgrading, and
both gain a gate so neither can regress.

## Technical Context

**Language/Version**: CSS (token-only), HTML, vanilla ES modules, Node 20, Razor on .NET 10

**Primary Dependencies**: unchanged from 008 (`novus-design-kit` console layer, D3 7, Vite 8, Tailwind 4, `@material/web` 2, QuickGrid, `playwright-core` for the audit)

**Constraints**: `tokens.css` frozen; every value a token; 44px targets on the rail; the drawer below 900px unchanged; ambient art still stopped under reduced motion; AA contrast on the light panel

**Scale/Scope**: 1 CSS pattern section rewritten, 1 generator definition extended, 2 new audit checks, 2 catalog pages updated, 4 deliverables rebuilt, 1 release

## Constitution Check

| Principle | Status | Note |
|---|---|---|
| I. Token-first | PASS | Rail widths and art tints come from tokens; the near-white ground is `--bg-subtle`. |
| II. Monochrome near-flat | IMPROVED | The tinted authentication ground is withdrawn, so sign-in now obeys the neutral-ground rule. Ambient art stays the single motion exception. |
| III. Component library | PASS | The rail is a state of the shipped side navigation, not a new component. |
| IV. Accessibility | PASS | Rail keeps 44px targets, marks the current page, and keeps label text in the markup for assistive technology while hiding it visually. |
| V. Brand and copy | PASS | The lockup returns to its normal light treatment on a light panel. |
| VI. Framework-agnostic | PASS | CSS and markup only. |
| VII. Reference applications | AMEND | Collapsed navigation must be a rail; recorded in constitution 1.13.0. |
| Governance | PASS | Feature branch and PR; gates 16 and 17 added and negative-tested. |

## Approach

1. **Console layer**: replace the `display: none` collapse with a 3.5rem grid
   column; centre the icons; visually hide labels, group labels and chevrons
   while leaving them in the accessibility tree; keep group children visible as
   icons. Sign-in: ground to `--bg-subtle`, art strokes to `--blue-200` with
   raised opacity, panel text to `--text-secondary`, module chips to surface
   plus border, card gains a border with a softer shadow, and the dark-lockup
   overrides are removed.
2. **Generator**: every NAV entry carries an icon, including group children, and
   every link renders `title` so the rail names its destination on hover.
3. **Gates**: `layout-audit.mjs` gains RAIL (collapsed navigation shows one icon
   per destination and no visible labels) and GROUND (sign-in ground is at least
   95% of white in the default theme). The audit's second pass now collapses the
   navigation at desktop width so there is a collapsed state to judge.
4. **Docs**: side navigation and sign-in pages describe the new behaviour.
5. **Release**: version bump, CHANGELOG, screenshots, verified runs, PR.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Visually hidden labels in the rail | Icon-only rows still need names for assistive technology | `display: none` on labels would strip the accessible name; `title` alone is not reliably announced |
