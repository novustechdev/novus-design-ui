# Implementation Plan: Novus Admin Kit (Blazor + Tailwind flavors)

**Branch**: `main` | **Date**: 2026-08-27 | **Spec**: [spec.md](spec.md)

## Summary

Two runnable enterprise admin consoles ("novapay operations") with strict screen
parity, both consuming the published `novus-design-kit@0.2.0` from public npm: a
Blazor Web App (server-rendered pages, interactivity only on the transactions
filter and theme toggle) and a multi-page Vite + Tailwind v4 app (Tailwind
utilities for layout mapped to Novus tokens, kit classes for identity). Shared
mock dataset generated into both flavors from one JSON source. A new Admin Kit
docs page ships with verified run screenshots per constitution VII.

## Technical Context

**Blazor flavor**: .NET SDK 10 (installed at ~/.dotnet), Blazor Web App template,
InteractiveServer only on components that need it; kit copied to wwwroot/lib via
the verified MSBuild target; template Bootstrap/app.css removed (verified guide
finding).

**Tailwind flavor**: Vite 8 + @tailwindcss/vite (tailwindcss 4.x), vanilla JS,
one HTML page per screen (JS-off navigation), `@theme inline` token mapping per
the verified theme guide.

**Shared**: mock data in `admin-kits/data/dataset.json`; tiny generator scripts
emit a C# record list and an ES module so both flavors ship the same values.
App-specific layout CSS (sidebar shell, page grid) lives per flavor, tokens
only. No charting library: stat rows + signal cards (kit convention).

**Testing**: `scripts/gates.sh` extended to scan `admin-kits/*/` authored
sources (hex/gradient/radius/font-size/SaaS/em-dash); verification = build +
run + puppeteer screenshots (light/dark, and 375px spot), recorded in
`specs/002-novus-admin-kit/checklists/verification.md`.

**Constraints**: constitution VII in full (published package only, parity,
app-interface conventions, verified-run evidence). Photos/client marks not used
in the consoles (data UI, not marketing).

## Constitution Check

| Gate | Verdict |
|------|---------|
| I Token-first | PASS: flavors style via kit classes + var() layout CSS; gates extended to enforce |
| II Monochrome near-flat | PASS: data-dense console, white ground, token radii |
| III Component reuse | PASS: btn/card/table/badge/statrow/alert/field/appheader everywhere; only app-layout CSS is new |
| IV A11y/responsive | PASS: MPA/SSR nav works JS-off; 375px sidebar collapse; pre-paint toggle |
| V Brand/copy | PASS: internal-tool two-mark header; sourced product names; no SaaS/em-dash |
| VI Verified integration | PASS: flavors follow the two verified guides (Blazor, Tailwind) |
| VII Reference applications | PASS by construction: this feature implements it |

Post-design re-check: no new violations; the only new code is app layout CSS
and mock-data generators. **PASS.**

## Project Structure

```text
admin-kits/
├── data/
│   ├── dataset.json        # single source: transactions + terminals
│   └── generate.mjs        # emits blazor C# + tailwind JS data modules
├── blazor/                 # Blazor Web App "Novus Admin Kit (Blazor)"
│   ├── NovusAdminKit.csproj    # + MSBuild kit-copy target
│   ├── package.json / .npmrc?  # npm dep on novus-design-kit (public npm, no npmrc needed)
│   ├── Components/{App,Layout,Pages}/...
│   └── wwwroot/admin.css       # app layout CSS, tokens only
└── tailwind/               # Vite MPA "Novus Admin Kit (Tailwind)"
    ├── package.json, vite.config.js
    ├── src/{admin.css,app.js,data.js}
    └── index.html, transactions.html, terminals.html, settings.html

site/src/admin-kit.html     # docs page (nav item "Admin Kit")
site/src/assets/admin-kit/  # verified screenshots
specs/002-novus-admin-kit/checklists/verification.md
```

**Structure Decision**: flavors live in-repo under `admin-kits/` (excluded from
the npm package by the files allowlist); distribution is copy-the-folder,
documented on the docs page.

## Complexity Tracking

None. Charts deliberately out (kit signal-card convention); no backend.
