# Admin Kit Verification Record (constitution VII / FR-009)

| flavor | stack verified against | date | evidence | result |
|---|---|---|---|---|
| blazor | .NET SDK 10.0.400 (Blazor Web App, InteractiveServer on transactions), novus-design-kit 0.2.0 from public npm | 2026-08-27 | build clean; all four screens 200; kit served from wwwroot/lib; 4 KPIs and 24 rows SSR (JS-off complete); Carlito confirmed; 375px scrollWidth 375; screenshots on the docs page | pass |
| tailwind | vite 8.2.2, tailwindcss 4.3.3 (@tailwindcss/vite), novus-design-kit 0.2.0 from public npm | 2026-08-27 | build clean; four pages 200; 24 static rows injected (JS-off complete); Carlito confirmed; 375px scrollWidth 375; screenshots on the docs page | pass |

Parity: both flavors generated from `admin-kits/data/dataset.json` by
`generate.mjs`; check = regenerate + `git diff --exit-code admin-kits`.
