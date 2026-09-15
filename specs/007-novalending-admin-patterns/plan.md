# Implementation Plan: Admin patterns from the novalending reference

**Branch**: `feature/007-novalending-admin-patterns` | **Date**: 2026-09-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/007-novalending-admin-patterns/spec.md`

## Summary

Adopt the novalending console (captured live 2026-09-15) as the reference for
the kit's console patterns: split sign-in, user menu and signed-out page,
grouped side navigation with a JS-free drawer, page header with breadcrumb,
filter bar with a two-pane sub-filter sheet and quick chips, list footer
pagination, and a line icon system. Correct the reference's defect by making
single-line short content a governed rule, enforced by CSS in one shared
pattern layer and by an automated layout audit gate. The layer, its JS
enhancements and the icon set live once in `admin-kits/shared/`, are copied into
every flavor by the parity generator (checked by a gate), and are read directly
by the docs build so catalog pages show the exact CSS the Admin Kit ships.

## Technical Context

**Language/Version**: HTML, CSS (token-only), vanilla ES modules (Node 20 for
build tooling), C# / Razor on .NET 10 (Blazor Server flavor and WASM demo)

**Primary Dependencies**: `novus-design-kit` 0.3.x from public npm (tokens,
unchanged); Vite 8 + Tailwind 4 (tailwind flavor); Vite 8 + @material/web 2.x
(material flavor); Microsoft.AspNetCore.Components.QuickGrid 10.0.11; Chart.js 4;
`playwright-core` 1.55 (audit only, installed without saving)

**Storage**: N/A (static dataset `admin-kits/data/dataset.json`)

**Testing**: `scripts/gates.sh` (existing 15 gates plus pattern parity and
layout audit), `generate.mjs --check`, headless Chromium verification runs with
DOM assertions and screenshots recorded in
`specs/002-novus-admin-kit/checklists/verification.md`

**Target Platform**: evergreen browsers (Chromium, Firefox, Safari current;
`:has()`, `@media (scripting)` baseline), GitHub Pages hosting

**Project Type**: design kit documentation site plus reference web applications

**Performance Goals**: pattern layer under 30 KB unminified; no new runtime
requests (icons inline, no fonts added); layout audit under 5 minutes in CI

**Constraints**: tokens.css and packaged files byte-unchanged; every value a
token; no gradients; radius from the scale; weights 400/600; motion 0.2s or less
and reduced-motion aware; 375px no page scroll; 44px touch targets on coarse
pointers; JS-off safe menus, drawer, sheet, and sign-in (Material flavor excepted
and labelled); no em dashes in published copy

**Scale/Scope**: 6 new catalog components (34 to 40), 4 updated; 2 new
foundations pages; 4 Admin Kit deliverables x 8 screens (signed-out page added);
constitution MINOR; 2 new gates; docs screenshots refreshed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Token-first | PASS | Pattern layer uses `var(--*)` only; audited by the existing hex, radius and font-size gates (admin-kits sources are in scope). tokens.css untouched. |
| II. Monochrome near-flat | PASS with amendment | Deep brand ground on sign-in is a tinted page ground. Justified below and scoped by constitution 1.11.0 to authentication screens only: solid `--blue-900`, no gradient, no glow. Uppercase nav labels use weight 600, not 700. Motion 0.2s max, reduced-motion aware. |
| III. Component library over re-implementation | PASS | New patterns compose `.btn`, `.badge`, `.card`, `.field`, `.input`, `.select`, `.table`, `.vlogo`; none duplicates a shipped component; each ships with docs and a demo (gate 7). Breadcrumb and pagination pages updated rather than duplicated. |
| IV. Accessibility and responsive | PASS (strengthened) | Content-fit rule added; drawer, menus and sheet on native inputs and `details`; 44px targets under `(pointer: coarse)`; focus-visible states; dual-trigger dark mode unchanged; layout audit enforces 375px. |
| V. Brand and copy | PASS | Placed lockups and endorsement; novapay copy from `Novus_Context.md`; lowercase product names; no em dashes; no SaaS strings. |
| VI. Framework-agnostic | PASS | Patterns are CSS classes and HTML; no framework wrapper shipped in the kit; guides unchanged. |
| VII. Reference applications | PASS with amendment | Kits keep consuming the published package; parity strengthened by a shared layer plus `--check` gate; verified runs and screenshots required; constitution records novalending as the pattern reference. |
| VIII. Mobile foundations | N/A | No mobile foundation page changes. |
| Governance | PASS | Feature branch plus PR; MINOR amendment with Sync Impact Report; CHANGELOG entry. |

**Post-design re-check (after Phase 1)**: PASS. The contracts introduce no
hardcoded values, keep every interactive pattern operable without scripting
(except the password visibility toggle, which is hidden when scripting is
unavailable), and route all copy through sourced strings.

## Project Structure

### Documentation (this feature)

```text
specs/007-novalending-admin-patterns/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── patterns.md
│   └── tooling.md
├── checklists/requirements.md
└── tasks.md            (speckit-tasks)
```

### Source Code (repository root)

```text
.specify/memory/constitution.md          # 1.10.0 -> 1.11.0
admin-kits/
├── shared/                              # NEW single source
│   ├── novus-admin.css                  # console layout + patterns (@pattern sections)
│   ├── novus-admin.js                   # progressive behaviour
│   └── icons.mjs                        # icon set
├── data/generate.mjs                    # + copies, SHELL injection, Icon.razor, --check
├── tailwind/  {index,analytics,transactions,datagrid,terminals,settings,login,signed-out}.html
│   ├── src/{admin.css,app.js,novus-admin.css*,novus-admin.js*}
│   └── vite.config.js                   # + signed-out entry
├── material/  (same page set; md-filled-text-field sign-in)
├── blazor/
│   ├── Components/App.razor             # + novus-admin.css/js
│   ├── Components/Layout/{MainLayout,EmptyLayout,AuthLayout}.razor
│   ├── Components/Shared/{Icon*,ListFooter,FilterBar?}.razor
│   └── Components/Pages/{Login(SSR form),SignedOut,Transactions,DataGrid,...}.razor
└── blazor-demo/ (mirrors blazor: Layout/, Shared/, Pages/, wwwroot/index.html)
scripts/
├── gates.sh                             # + pattern parity, layout audit
└── layout-audit.mjs                     # NEW
site/
├── build.mjs                            # + novus-admin.css link, manifest css blocks, ICON-INDEX, new foundations
├── components.json                      # + 6 entries, Templates category
└── src/
    ├── components/{sign-in-page,signed-out-page,user-menu,side-navigation,page-header,filter-bar}.html   # NEW
    ├── components/{pagination,table,breadcrumb,app-shell}.html                                        # UPDATED
    ├── foundations/{icons,alignment}.html                                                             # NEW
    ├── admin-kit.html, index.html                                                                     # UPDATED
    └── assets/admin-kit/*.png                                                                         # REFRESHED
.github/workflows/{pages,pr-gates}.yml   # + playwright-core install
README.md, CHANGELOG.md, CONTRIBUTING.md
specs/002-novus-admin-kit/checklists/verification.md   # + feature 007 rows
```
(`*` generated copies.)

**Structure Decision**: Keep the existing layout (docs site generator plus four
Admin Kit deliverables) and add `admin-kits/shared/` as the single source for
console patterns, consumed through the existing parity generator. No new
package, no framework wrapper.

## Implementation phases

1. **Governance and gates first**: constitution 1.11.0; `generate.mjs --check`;
   `layout-audit.mjs` wired into gates and workflows (it will fail on current
   content, which proves the gate).
2. **Shared layer**: icons, `novus-admin.css` sections (content-fit,
   console-shell, side-navigation, page-header, user-menu, sign-in, signed-out,
   filter-bar, list-footer, icons, legacy console rules migrated from the four
   admin.css copies), `novus-admin.js`.
3. **Tailwind flavor** (reference implementation): shell injection, all eight
   pages, list and filter logic in `app.js`; then **Material** by the same markup
   with Material Web controls.
4. **Blazor Server** then **WASM demo**: layouts, `Icon`, `ListFooter`, SSR
   sign-in, signed-out page, Transactions filter state, Data grid footer.
5. **Docs**: build support, six new component pages, four updates, two
   foundations pages, counts, Admin Kit page.
6. **Verify**: builds, gates including the audit at both widths, JS-off checks,
   cross-flavor count parity, screenshots, verification record, CHANGELOG, PR.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Tinted page ground on sign-in (Principle II) | Owner mandated the novalending sign-in as the reference; the deep brand ground frames the credential card and the brand panel | White ground makes the white card vanish into the page (the reference's own T745 finding); a gradient panel violates Principle II outright |
| New build-time dependency for the audit (`playwright-core`) | Wrapping can only be detected in a rendered layout; the owner wants the defect never to return | Static CSS lint cannot see wrapping; manual review already let the defect ship in the reference |
