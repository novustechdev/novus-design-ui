# Quickstart: validate feature 007

Prerequisites: Node 20, .NET SDK 10 (`~/.dotnet`), a Chromium binary
(`CHROME_PATH`), repository dependencies installed in each admin-kits flavor.

## 1. Parity by construction

```sh
node admin-kits/data/generate.mjs
node admin-kits/data/generate.mjs --check     # expect: exit 0
```

Edit one copy of `novus-admin.css` inside a flavor and re-run `--check`:
expect exit 1 naming that file. Revert.

## 2. Build everything

```sh
(cd admin-kits/tailwind && npx vite build)
(cd admin-kits/material && npx vite build)
(cd admin-kits/blazor-demo && dotnet publish -c Release -v q)
(cd admin-kits/blazor && dotnet build -v q)
node site/build.mjs
```

## 3. Gates, including the layout audit

```sh
npm install --no-save --no-package-lock playwright-core@1.55.0
CHROME_PATH=/path/to/chrome scripts/gates.sh     # expect: ALL GATES PASS
```

Negative test: temporarily remove the content-fit section from
`admin-kits/shared/novus-admin.css`, regenerate, rebuild, rerun: expect `WRAP`
findings on the Transactions and Data grid screens. Restore.

## 4. Walk the flows (each flavor and the hosted Blazor demo)

1. Open `login`: split layout at 1440px, stacked at 375px; wrong credentials show
   the inline error and keep the username; the eye button shows and hides the
   password; `admin` / `admin` lands on the dashboard.
2. Menu toggle collapses the sidebar at 1440px; at 375px it opens the drawer,
   and following a link closes it.
3. Transactions: choose the Failed quick chip: 2 rows, footer "Showing 1-2 of 2".
   Open Filters, choose Product, tick novapay: chip "Product novapay" appears,
   trigger count 1; counts match across flavors. Clear all and All: 24 rows,
   "Showing 1-10 of 24", "Page 1 of 3". Change rows per page to 20: page 1 of 2.
4. Data grid: sort, search, page with the list footer.
5. Open the user menu, toggle the theme, Sign out: signed-out page; Sign in again
   returns to login.
6. With JavaScript disabled on the Blazor Server flavor and the Tailwind build:
   sign-in posts and routes, menus and the filter sheet open and close, the drawer
   opens and closes, tables render all rows.

## 5. Docs

Open `site/dist/components/overview.html`: 40 components; search "filter",
"sign", "pagination", "navigation" find the pattern pages, each with a live
example, a copyable snippet, and its CSS block. Open Foundations > Icons and
Foundations > Alignment and content fit.
