# Implementation Plan: Product-team feedback round (feature 004)

**Spec**: specs/004-product-feedback/spec.md · **Date**: 2026-08-27

## Technical Context

- Zero-dependency generator `site/build.mjs` (SITE_CSS constant, manifest-driven
  component pages, transformDemos for by-construction snippets, link + manifest
  + no-subdir-index gates). Catalog manifest: `site/components.json`.
- tokens.css byte-frozen by the drift gate: new visuals layer in SITE_CSS and
  `admin-kits/*/…/admin.css` (3 copies: tailwind/src, blazor/wwwroot,
  blazor-demo/wwwroot; the demo copy is a straight cp of blazor's).
- Existing native-radio + `:has()` tab pattern (Admin Kit settings) is reused
  for the Web/Mobile preview toggle: JS-off safe, no new dependencies.
- Gates forbid: hex/gradient/radius/font-size literals in authored styling,
  em-dash copy, broken links, manifest incompleteness. The select chevron is
  border-drawn (no gradient trick, no hex data-URI).

## Structure of the change

1. **Copy pass**: `site/src/components/grid-row.html` labels ("Row 1 · A" and
   friends) become plain item labels.
2. **SITE_CSS + admin.css additions** (mirrored where relevant):
   - `.tablist label:hover` background tint + color (admin.css; docs tabs if any).
   - `:where(:not(.row)) > .btn + .btn` fallback gap `--space-2`.
   - `details > summary` custom enlarged chevron (list-style none +
     border-drawn ::before rotating on [open]); `.disclosure-ic` sized up.
   - `.selectwrap` wrapper: relative container, border-drawn ::after chevron
     inset `--space-4`, child select `appearance:none` + padding-right.
   - `.pvframe` mobile preview: `.pagewrap:has(#pv-mobile:checked) .demo > *`
     constrained to 375px inside a framed container.
3. **New fragments** `site/src/components/{dropdown,date-picker,calendar,stepper}.html`
   + 4 manifest entries (Forms: dropdown, date-picker; Data Display: calendar;
   Navigation: stepper). Composition-only: `.select`, `.input`, `.table`,
   `.badge`, `.card`, token-valued inline styles.
4. **build.mjs**: overview gains (a) search input + inline filter script
   (progressive), (b) "Choose by function" module (static links); detail-page
   template gains the Web/Mobile preview toggle above the demos.
5. **Foundations page** `site/src/foundations/actions.html` (Actions and
   placement) + sidebar entry (check how foundations sidebar is built).
6. **Admin kit selects**: wrap `#statusfilter` and `#s-role` in `.selectwrap`
   across tailwind pages and both razor trees.
7. **Counts**: landing page "22" x2, README "22" → 26.
8. Rebuild all three apps + site, gates, visual verification (headless
   Chromium), deploy, live verify.

## Constitution Check (v1.7.0)

- I Token fidelity: all new CSS uses `var(--…)` values; tokens.css untouched. PASS
- II Enterprise near-flat: motion within functional rule (0.2s); no gradients,
  borders drawn 1-2px. PASS
- III Component-over-reimplementation: new pages compose shipped classes and
  native elements; no parallel widget library. PASS (Calendar is presentation
  from .table; date picking is native input).
- Copy rules: no em-dash, no SaaS strings, sourced tone. PASS by construction +
  gates.
- Release rule: this is pre-publish polish; CHANGELOG updated at next tag.
