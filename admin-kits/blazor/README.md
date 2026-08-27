# Novus Admin Kit (Blazor flavor)

A realistic novapay operations console built on `novus-design-kit` as a Blazor
Web App. Four screens: Dashboard, Transactions (InteractiveServer filter and
detail dialog), Terminals, Settings. Pages are server-rendered, so navigation
and content work with JavaScript disabled.

## Prerequisites

.NET SDK 10, Node.js (npm pulls the kit package).

## Run

```bash
npm install     # kit into node_modules; the build copies it to wwwroot/lib
dotnet run
```

## Customize

- Screens live in `Components/Pages`; the shell in `Components/Layout/MainLayout.razor`.
- Layout CSS is `wwwroot/admin.css` (tokens only); identity comes from kit classes.
- Mock data: edit `../data/dataset.json`, then `node ../data/generate.mjs`
  (regenerates `Data/SeedData.cs`); replace SeedData with your services later.
- The template's Bootstrap was removed on purpose: its `.btn` collides with the kit's.

Conventions demonstrated: traffic-light status only on judgement chips, risk
messages red, self-describing chips, one accent per view, dual-trigger dark
mode with the persisted toggle.

The slim bar at the top links back to the design kit docs: remove it in your
own application. The login page is a sample (admin / admin) and stores nothing.
