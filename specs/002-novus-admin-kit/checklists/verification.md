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
