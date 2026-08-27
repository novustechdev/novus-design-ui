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
- [ ] T010 Custom domain: Cloudflare CNAME ui-kit.novustech.dev → sgultom99.github.io (DNS-only), Pages cname + HTTPS enforced, sweep documented URLs to https://ui-kit.novustech.dev, redeploy, verify cert + redirect (needs owner CF token)
