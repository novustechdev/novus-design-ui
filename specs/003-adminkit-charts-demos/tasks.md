# Tasks: feature 003

- [X] T001 Site full width + rhythm: SITE_CSS overrides (no max-width on shell, docwrap 240px+fluid, h2/h3 top margins, block spacing for pre/figure/img/table/bullets), theme-color metas, manifest.webmanifest + build copy + gate exclusion for manifest colour literals
- [X] T002 Admin shells full width: adminbody max-width none (both flavors' admin.css)
- [X] T003 Dataset: add hourly volume-by-product series; generate.mjs emits it to data.js, SeedData.cs, and blazor wwwroot/chart-data.json; regenerate + commit
- [X] T004 Tailwind flavor: analytics.html (Chart.js, token-fed novusChart module, stacked bars + total line) and datagrid.html (progressive sort/search/pagination over static rows); nav to 6 entries; package dep chart.js
- [X] T005 Blazor flavor: Analytics.razor (canvas + wwwroot/novus-chart.js interop, Chart.js served from wwwroot/lib via npm copy) and DataGrid.razor (QuickGrid + Paginator, InteractiveServer, token styling in admin.css); nav to 6 entries
- [X] T006 Blazor WASM demo app `admin-kits/blazor-demo` (standalone WebAssembly, same six screens, base "./", kit + chart.js via npm copy target); publish clean
- [X] T007 Demo hosting: tailwind vite base "./"; build.mjs copies admin-kits/tailwind/dist → dist/demos/tailwind and blazor-demo publish wwwroot → dist/demos/blazor when present; pages.yml gains setup-dotnet + demo build steps before site build
- [X] T008 Docs Admin Kit page: screenshots clickable → /demos/...; per-flavor "Open live demo" buttons; add analytics + datagrid screenshots (both flavors); update contract screens.md to 6 screens; verification record rows for new screens + demos
- [X] T009 Verify: run flavors, capture new screenshots, parity check, full build + gates (link gate now covers demo entries), commit, push, deploy, click-through demos on the live site
- [X] T010 Custom domain: Cloudflare CNAME ui-kit.novustech.dev → sgultom99.github.io (DNS-only), Pages cname + HTTPS enforced, sweep documented URLs to https://ui-kit.novustech.dev, redeploy, verify cert + redirect (needs owner CF token)

## Phase 2: Owner feedback round (2026-08-27)

- [X] T011 Content width: remove ch-measure caps from docs prose (inline max-width:NNch styles and the tokens p measure, site pages only); content follows the container full width on desktop, responsive unchanged
- [X] T012 Landing page: add a live component sampler section and an Admin Kit overview section (screenshot, links to the page and both demos)
- [X] T013 Blazor guide: explain where node_modules/novus-design-kit comes from (npm install in the project folder; alternatives: GitHub repo or the release tarball)
- [X] T014 Demo URLs shown and linked as clean directory URLs everywhere (no index.html)
- [X] T015 Fix WASM demo QuickGrid paginator (empty rectangle buttons, broken alignment): link the scoped styles bundle in the demo host page; generalize the build repair to fix any fingerprint-mismatched reference
- [X] T016 Repo authorship: commits authored as sgultom99 with no assistant trailers; speckit artifacts updated (constitution presentation note, spec wording, verification record)

## Phase 3: Owner feedback round 2 (2026-08-27)

- [X] T017 Site: footer spans the content width (no container cap); docs body type stepped down to the sm token for density
- [X] T018 Admin apps: header inner edge to edge; body type stepped to sm token
- [X] T019 Sample login page in both flavors and the WASM demo (admin/admin, error state red, nothing stored); Sign out link in the header
- [X] T020 Header identity follows the logo rules: novapay lockup (inline official pictograph + two-tone solid-set wordmark, dark-mode swap via tokens) instead of typed text
- [X] T021 Demo provenance bar on admin pages linking back to the docs (README notes it is removable)
