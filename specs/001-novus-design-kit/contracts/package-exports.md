# Contract: `@sgultom99/novus-design-kit` package exports

The public interface consumers depend on. Any breaking change here is a MAJOR bump.

## Install

The registry is GitHub Packages (npm.pkg.github.com), private-style: installs
always require a GitHub token with `read:packages`. The `@sgultom99` scope is
interim (GitHub Packages requires scope = repo owner); it moves to a Novus org
scope when one exists, as a MAJOR rename.

```bash
# one-time, per developer (token goes in the user ~/.npmrc, never committed)
npm config set @sgultom99:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken YOUR_GITHUB_TOKEN
npm install @sgultom99/novus-design-kit    # or: yarn add @sgultom99/novus-design-kit
```

## Import paths (the contract surface)

| Path | Contents | Notes |
|------|----------|-------|
| `@sgultom99/novus-design-kit/tokens.css` | All tokens + component classes + @font-face + dark-mode rules | The one required import. `fonts/` resolves relatively — bundlers and static servers must serve the package's `fonts/` dir (standard behavior) |
| `@sgultom99/novus-design-kit/fonts/*.woff2` | Carlito 400/700 latin | Self-referenced by tokens.css; direct import rarely needed |
| `@sgultom99/novus-design-kit/logos/*` | Master logo 6 treatments, wordmarks, product lockups, icons, client logos | Filenames are API — renames are breaking |
| `@sgultom99/novus-design-kit/photos/*` | Approved photography | Filenames are API — renames are breaking |
| `@sgultom99/novus-design-kit/js/novus-theme.js` | Pre-paint persisted theme helper | See below |

`package.json` `files` allowlist: `tokens.css`, `fonts/`, `logos/`, `photos/`,
`js/`, `README.md`, `CHANGELOG.md`. Nothing else ships (no site/, specs/,
references/).

## Wiring patterns (documented on the site's install page)

```html
<!-- Plain HTML -->
<link rel="stylesheet" href="/node_modules/@sgultom99/novus-design-kit/tokens.css">
```

```js
// Bundler (Vite / webpack / Next.js) — once at app root
import "@sgultom99/novus-design-kit/tokens.css";
```

## `novus-theme.js` behavior contract

- Executed in `<head>` (before paint): applies `data-theme` from localStorage if
  a choice was persisted; otherwise leaves resolution to `prefers-color-scheme`.
- Exposes `window.novusTheme.toggle()` → flips theme, persists choice, updates
  `data-theme` on `<html>`.
- All storage access wrapped in try/catch; on failure behaves as if no choice
  was persisted (OS preference rules).
- With JS disabled, dark mode still works via `@media (prefers-color-scheme)`
  (guaranteed by tokens.css, not by this script).

## Versioning contract

- Semver. Breaking = removed/renamed import path, removed/renamed asset file,
  removed/renamed CSS class or custom property, or a visual change that alters
  documented component anatomy.
- Every release has a CHANGELOG.md entry; breaking entries include a migration
  step.
- Published versions are immutable.
