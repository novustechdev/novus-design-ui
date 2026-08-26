# @sgultom99/novus-design-kit

The Novus Technologies design kit: design tokens, component styles, the Carlito
typeface, and the official brand assets, as one installable package. Framework-
agnostic: import one stylesheet and build with documented HTML patterns in any
web stack.

> **Novus developers only.** The package is published to GitHub Packages
> (a private-style registry: installs always require authentication). It is
> not on public npm, and the bundled logos and photography are proprietary,
> don't republish them.

## Install

One-time setup (per machine): create a GitHub personal access token (classic)
with the `read:packages` scope, then point the scope at GitHub Packages and
store your token in your user `~/.npmrc`. Never commit tokens.

```bash
npm config set @sgultom99:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken YOUR_GITHUB_TOKEN
npm install @sgultom99/novus-design-kit        # or: yarn add @sgultom99/novus-design-kit
```

## Wire it in

**Plain HTML** (served over http(s)):

```html
<link rel="stylesheet" href="/node_modules/@sgultom99/novus-design-kit/tokens.css">
<script src="/node_modules/@sgultom99/novus-design-kit/js/novus-theme.js"></script>
```

**Bundler** (Vite / webpack / Next.js), once at the app root:

```js
import "@sgultom99/novus-design-kit/tokens.css";
import "@sgultom99/novus-design-kit/js/novus-theme.js";
```

`tokens.css` self-hosts Carlito via relative `fonts/…woff2` URLs, so fonts work
with no extra setup. Put the theme script in `<head>` (it is tiny and must run
before first paint so a persisted dark-mode choice doesn't flash).

## Use it

Everything derives from the tokens, never hardcode a value they define:

```html
<button class="btn btn--primary">Talk to us</button>
<div class="card card--interactive">…</div>
```

- Semantic tokens first: `--bg`, `--surface`, `--text`, `--text-secondary`,
  `--border`, `--accent`; spacing `--space-0…9`; radius `--radius-sm|md|lg|xl|pill`;
  type `--text-xs…display`; shadows `--shadow-1|2|3`.
- Dark mode is built in: force with `<html data-theme="dark">`, follow the OS by
  setting nothing, and wire a toggle to `window.novusTheme.toggle()` (persisted,
  applied before paint).
- Logos are placed assets: `<img src=".../logos/Novus_Logo_Colour_transparent.png">`
  in light, the White variant in dark (use the `.brandlogo--light`/`--dark` pair).
  Never retype or redraw a logo.

Full documentation, foundations, every component with live examples and
copyable snippets, and the asset index, is on the reference site (see
`site/` in this repository; each release publishes it).

## Framework and theme guides

The reference site carries verified integration guides: frameworks (Blazor,
React, Vite, Vue.js) and UI-library themes (Tailwind CSS, Fluent 2, Material,
Ant Design). Every guide's snippets are executed in a real sample project
before publication, each page shows the rendered result and the library
version it was verified against, and an unverified guide does not ship
(enforced at build time). Verification history lives in
`specs/001-novus-design-kit/checklists/guide-verification.md`.

## Overriding and extending tokens

Layer your app's values **after** the import, never edit kit files:

```css
/* after tokens.css */
:root { --container: 1400px; }
```

Anything you don't override keeps tracking the kit across upgrades. Brand
values (colors, type, logos) are locked, if one looks wrong, raise it with the
design-system owner instead of patching locally.

## Reference site deployment (ops)

The public reference site deploys to **GitHub Pages** via
`.github/workflows/pages.yml` (build → gates → deploy of `site/dist`). One-time
setup: push this repository to GitHub, then in repo Settings → Pages set Source
to "GitHub Actions". The site uses relative URLs throughout, so it works under
the `/repo-name/` sub-path; a custom domain is optional. The workflow runs the
quality gates and fails the deploy if any gate is red.

## Versioning

Semantic versioning with a maintained [CHANGELOG](CHANGELOG.md). Breaking
changes (removed/renamed class, custom property, import path, or asset file)
only ship in a MAJOR with a migration note.
