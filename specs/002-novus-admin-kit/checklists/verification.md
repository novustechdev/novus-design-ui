# Admin Kit Verification Record (constitution VII / FR-009)

| flavor | stack verified against | date | evidence | result |
|---|---|---|---|---|
| blazor | .NET SDK 10.0.400 (Blazor Web App, InteractiveServer on transactions), novus-design-kit 0.2.0 from public npm | 2026-08-27 | build clean; all four screens 200; kit served from wwwroot/lib; 4 KPIs and 24 rows SSR (JS-off complete); Carlito confirmed; 375px scrollWidth 375; screenshots on the docs page | pass |
| tailwind | vite 8.2.2, tailwindcss 4.3.3 (@tailwindcss/vite), novus-design-kit 0.2.0 from public npm | 2026-08-27 | build clean; four pages 200; 24 static rows injected (JS-off complete); Carlito confirmed; 375px scrollWidth 375; screenshots on the docs page | pass |

| blazor analytics + datagrid | Chart.js 4 (umd, via wwwroot/lib) + QuickGrid 10.0.11 | 2026-08-27 | chart canvas painted (81k px verified), grid sorts/searches/pages; screenshots on the docs page | pass |
| tailwind analytics + datagrid | chart.js 4 (npm module) | 2026-08-27 | chart canvas painted (188k px verified), progressive grid over static rows; screenshots on the docs page | pass |
| blazor WASM demo (hosted) | .NET 10 standalone WebAssembly publish (22 MB static) | 2026-08-27 | publish clean; hosted at /demos/blazor/ | pass |
| tailwind demo (hosted) | vite build, base "./" | 2026-08-27 | hosted at /demos/tailwind/ | pass |

Parity: both flavors generated from `admin-kits/data/dataset.json` by
`generate.mjs`; check = regenerate + `git diff --exit-code admin-kits`.

Feature 003 finding folded back: url() inside an unregistered CSS custom
property resolves against the document base, not the defining stylesheet, so
the Blazor flavors place the endorsement asset with stylesheet-relative urls
(bundlers hide this in the Tailwind flavor).

Feature 003 second finding folded back: an MSBuild copy into wwwroot must run
BeforeTargets="PrepareForBuild", not "Build". Mutating wwwroot after the static
web asset scan silently breaks .NET's importmap and fingerprint substitution on
clean builds (CI), while incremental local builds mask it. The Blazor guide and
both csproj files updated; build.mjs additionally repairs a stale boot-script
reference defensively.

Feature 003 third finding folded back: a standalone WASM host page must link the
app's scoped styles bundle (NovusAdminDemo.styles.css); QuickGrid's Paginator
icons and layout live in it, and without it the pager renders as empty buttons.
The generic build repair also covers its fingerprint reference.

Feature 003 round 3 (2026-08-27): header identity corrected to the novapay
lockup (official pictograph inlined, two-tone wordmark, token dark swap);
sample login verified in the Tailwind build (wrong creds show the red error,
admin/admin routes to the dashboard); demo provenance bar links back to the
docs; header inner and footer are full width; body type stepped to the sm
token for density.
- 2026-08-27: Tabbed settings verified in both flavors (headless Chromium): Profile visible by default, API access panel switches on tab click, panels swap via :has, 375px scrollWidth 375 in both. Gates all green after site rebuild.

## Feature 007: console patterns from the novalending reference (2026-09-15)

| deliverable | stack verified against | date | evidence | result |
|---|---|---|---|---|
| tailwind | vite 8, tailwindcss 4.3, novus-design-kit 0.3.x | 2026-09-15 | 27/27 flow checks (sign-in error keeps username, password toggle, admin/admin to dashboard, user menu, sign out, sign in again, Failed chip 2 rows, Failed + novapay 2 rows with chip and count, Clear all + All 24, 20 per page 2 pages, last page 21-24, grid search failed 2, desktop collapse, 375 no scroll, drawer opens and closes after navigation); JS off: toggle hidden, 24 static rows, drawer, filter sheet and radio tabs, user menu | pass |
| material | vite 8, @material/web 2.x | 2026-09-15 | same 27/27 flow checks with Material Web filled and outlined fields and checkboxes | pass |
| blazor (server) | .NET SDK 10.0.400, QuickGrid 10.0.11 | 2026-09-15 | same 27/27 flow checks; JS off: static form post shows the error and keeps the username, admin/admin redirects, 10 prerendered rows, drawer, filter sheet, user menu | pass |
| blazor WASM demo (hosted) | .NET 10 WebAssembly publish | 2026-09-15 | same 27/27 flow checks; pages mirrored from the server flavor by generate.mjs | pass |
| docs + demos layout audit | playwright-core 1.55 + Chromium | 2026-09-15 | 79 pages x 1440/375, 0 findings; negative test (content-fit table rule removed) 13 WRAP findings | pass |
| pattern parity gate | node generate.mjs --check | 2026-09-15 | clean; negative test (hand edit of tailwind/src/novus-admin.css) exit 1 naming the file | pass |

Cross-flavor parity: Failed quick chip = 2 and Failed + Product novapay = 2 in all
four deliverables; default footer "Showing 1-10 of 24", "Page 1 of 3".

## Feature 008: enterprise portal defaults (2026-09-23)

| deliverable | stack verified against | date | evidence | result |
|---|---|---|---|---|
| tailwind | vite 8, tailwindcss 4.3, d3 7 | 2026-09-23 | 19/19 checks: light default on a dark OS (sign-in and console), 50/50 split, single sign-on, no theme toggle on sign-in, ambient art present and stopped under reduced motion, one type size across shell and content, title 1.71x body, no reading cap on portal text, landing charts with table, tooltip on hover and on keyboard focus, redraw and persistence on theme change, settings sections and rows, date range narrows and clears | pass |
| material | vite 8, @material/web 2.x, d3 7 | 2026-09-23 | same 19/19 with Material Web controls in the settings rows and the filter sheet | pass |
| blazor (server) | .NET SDK 10.0.400, d3 7 from wwwroot/lib | 2026-09-23 | same 20/20 including the server-rendered sign-in | pass |
| blazor WASM demo (hosted) | .NET 10 WebAssembly publish | 2026-09-23 | same 19/19; pages mirrored from the server flavor by generate.mjs | pass |
| JavaScript off (tailwind) | static build | 2026-09-23 | settings sections render; the analytics chart falls back to its table | pass |
| packaged install | npm pack of 0.4.0 into a blank project | 2026-09-23 | importing tokens.css plus console.css renders sign-in (720/720 at 1440), console shell, settings rows and the icon sprite, and renders light on a dark OS, with nothing copied from the repository | pass |
| gates 12 to 15 | negative tests | 2026-09-23 | element right of the account menu, a navbar smaller than content, a paragraph capped at 26ch, and a version mismatch each fail the suite and pass again after restore | pass |

Total: 79/79 checks. Chart.js is gone from every flavor; D3 draws the
composition bars, the trajectory line and the share donut from tokens.

## Feature 009: icon rail and the light sign-in ground (2026-09-23)

| deliverable | stack verified against | date | evidence | result |
|---|---|---|---|---|
| tailwind | vite 8, tailwindcss 4.3, d3 7 | 2026-09-23 | 11/11 checks: rail narrows 240px to 56px, 6 of 6 destinations painted as icons (hit-tested, not measured), no label text visible, every icon named by title and text, current page still marked, all targets at least 36px, second press restores the labelled navigation, sign-in ground rgb(244, 247, 250) at 96% of white, ambient art animating, art stopped under reduced motion, 375px drawer unchanged | pass |
| material | vite 8, @material/web 2.x, d3 7 | 2026-09-23 | same 11/11 | pass |
| blazor (server) | .NET SDK 10.0.400, QuickGrid 10.0.11 | 2026-09-23 | same 11/11 plus a reachability check, against the running server flavor | pass |
| blazor WASM demo (hosted) | .NET 10 WebAssembly publish | 2026-09-23 | same 11/11; ConsoleNav mirrored from the server flavor by generate.mjs | pass |
| docs + demos layout audit | playwright-core 1.55 + Chromium 151 | 2026-09-23 | 81 pages x 1440/375 with the navigation collapsed in the second pass, 0 findings | pass |
| gates 16 and 17 | negative tests | 2026-09-23 | hiding the collapsed navigation, stripping the rail icons, dropping the closed-group rule, and restoring the dark sign-in ground each fail the suite by name and pass again after restore | pass |

Total: 45/45 checks.

### Defect found during verification, and the correction

The first pass of gate 16 and of the verified run judged the rail by bounding
boxes, and reported 6 of 6 destinations present. A hit test showed only 5 of
them painted: `Settings`, the child of a closed `details` group, reported a
44x36 box at the right place while the browser never rendered it, because a
closed details subtree is not painted. The screenshots showed five icons and an
empty gap, which is what prompted the recheck.

Two corrections followed. The console layer asks for the closed group's
children back in rail mode only
(`.navgroup::details-content { content-visibility: visible }`), so the phone
drawer keeps ordinary group behaviour. Gate 16 and the verified run now judge
the rail with `elementFromPoint`, so a destination that measures but never
renders fails; rows below the fold are left unjudged rather than blamed. Both
were negative-tested against the fixed build.
