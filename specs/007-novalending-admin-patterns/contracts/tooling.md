# Tooling contract (feature 007)

## admin-kits/data/generate.mjs

```text
node admin-kits/data/generate.mjs            # write all emitted files
node admin-kits/data/generate.mjs --check    # write nothing; exit 1 listing every file that would change
```

Emits (in addition to the existing data files):

| source | emitted to |
|---|---|
| admin-kits/shared/novus-admin.css | tailwind/src/, material/src/, blazor/wwwroot/, blazor-demo/wwwroot/ |
| admin-kits/shared/novus-admin.js | tailwind/src/, material/src/, blazor/wwwroot/, blazor-demo/wwwroot/ |
| admin-kits/shared/icons.mjs | blazor/Components/Shared/Icon.razor, blazor-demo/Shared/Icon.razor |
| shell partials in generate.mjs | tailwind/*.html, material/*.html between `<!--SHELL:header-->` and `<!--SHELL:nav-->` markers |
| dataset.json | filter option markup between `<!--DATA:filter-terminals-->` markers |

Every emitted file starts with a GENERATED banner where the format allows a
comment.

## scripts/layout-audit.mjs

```text
node scripts/layout-audit.mjs [--only <substring>]
env: CHROME_PATH (optional executable), CI (when "true", missing tooling fails)
exit 0: no findings; exit 1: findings or (in CI) missing tooling; exit 2: SKIP locally
```

Output lines: `WRAP <width> <page> <selector> "<text>" lines=<n>` and
`OVERFLOW 375 <page> scrollWidth=<n>`.

Pages: every `site/dist/components/*.html` (except the redirect stub), every
`site/dist/foundations/*.html`, `site/dist/admin-kit.html`, every
`site/dist/demos/{tailwind,material}/*.html`, and the Blazor demo routes
`/demos/blazor/`, `login`, `signed-out`, `analytics`, `transactions`,
`datagrid`, `terminals`, `settings`.

## scripts/gates.sh (new gates)

- `admin pattern parity`: `node admin-kits/data/generate.mjs --check`.
- `layout audit`: `node scripts/layout-audit.mjs` (PASS, FAIL, or SKIP locally).

## site/build.mjs

- Copies `admin-kits/shared/novus-admin.css` to `dist/assets/novus-admin.css`
  and links it on every page before the site's own styles.
- Manifest `css` field: renders `<h2>CSS</h2>` plus one copyable block per named
  `@pattern` section; unknown names throw.
- Foundations page containing `<!--ICON-INDEX-->` receives the icon grid built
  from `admin-kits/shared/icons.mjs` (name, preview at three sizes, copyable
  markup).
