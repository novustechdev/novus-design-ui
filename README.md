# novus-design-kit

The Novus Technologies design kit: design tokens, component styles, the Carlito
typeface, dark mode, and the official brand assets, as one installable package.
It is framework-agnostic CSS: you import one stylesheet and use documented HTML
class patterns, so it works the same in Blazor, React, Vite, Vue, or plain HTML.

**Documentation site**: https://ui-kit.novustech.dev/
(foundations, all 26 components with live examples and copyable snippets,
verified framework and theme guides, and the full asset index)

> The package installs tokenless from public npm. Third-party marks (client
> and card-scheme logos) are deliberately NOT in the npm artifact; they live in
> the repository and on the docs site for approved proof-wall use. The bundled
> Novus logos and photography remain proprietary. Don't republish them.

## What's inside

| Import path | Contents |
|---|---|
| `novus-design-kit/tokens.css` | Everything: tokens, component classes, Carlito @font-face, dark mode |
| `novus-design-kit/js/novus-theme.js` | Persisted light/dark toggle helper (pre-paint safe) |
| `novus-design-kit/fonts/*` | Carlito 400/700 woff2 (self-referenced by tokens.css) |
| `novus-design-kit/logos/*` | Master logo (6 treatments), product lockups, pictographs (client and scheme marks are repository-only) |
| `novus-design-kit/photos/*` | Approved Novus photography |

## Quick start

**1. Install.** No registry setup, no token:

```bash
npm install novus-design-kit    # or: yarn add novus-design-kit
```

**2. Wire it in.** With a bundler, once at the app entry (theme helper first so
a saved dark-mode choice applies early):

```js
import "novus-design-kit/js/novus-theme.js";
import "novus-design-kit/tokens.css";
```

Plain HTML served over http(s):

```html
<link rel="stylesheet" href="/node_modules/novus-design-kit/tokens.css">
<script src="/node_modules/novus-design-kit/js/novus-theme.js"></script>
```

Carlito loads automatically: tokens.css self-hosts it via relative URLs.

**3. Build your first screen.**

```html
<header class="appbar">
  <div class="appbar__inner">
    <div class="brandlock">
      <img class="brandlogo--light" src="node_modules/novus-design-kit/logos/Novus_Logo_Colour_transparent.png" alt="Novus Technologies">
      <img class="brandlogo--dark"  src="node_modules/novus-design-kit/logos/Novus_Logo_White_transparent.png"  alt="Novus Technologies">
      <span class="appname">my app</span>
    </div>
    <button class="btn btn--ghost btn--sm" onclick="novusTheme.toggle()">Theme</button>
  </div>
</header>
<main class="appmain">
  <div class="row">
    <button class="btn btn--primary">Talk to us</button>
    <span class="badge badge--success"><span class="badge__dot"></span> Live</span>
  </div>
  <div class="card card--interactive" style="position:relative;max-width:320px">
    <h3>novapay</h3>
    <p class="muted">Digital payments, full stack.</p>
    <button class="card-trigger" aria-label="Open novapay"></button>
  </div>
</main>
```

Golden rule: never hardcode a value the tokens define. If you are about to type
a hex colour or a pixel size, there is a `var(--…)` for it. Semantic tokens
first: `--bg`, `--surface`, `--text`, `--text-secondary`, `--border`,
`--accent`; spacing `--space-0…9`; radius `--radius-sm|md|lg|xl|pill`; type
`--text-xs…display`; shadows `--shadow-1|2|3`.

## Use it with your framework

Every guide below was executed in a real sample project before publication;
each page shows the rendered result and the verified library version.

**Blazor** ([verified guide](https://ui-kit.novustech.dev/frameworks/blazor.html)):
copy the package into `wwwroot/lib` with an MSBuild target, link the stylesheet
in `App.razor`, use the classes in Razor markup, and toggle the theme through
`IJSRuntime`. Remove the template's Bootstrap and app.css: Bootstrap's `.btn`
collides with the kit's.

```razor
<button class="btn btn--primary" @onclick="Submit">Talk to us</button>
```

**React** ([verified guide](https://ui-kit.novustech.dev/frameworks/react.html)):
no wrapper library, the classes are the API. Import once in `main.tsx`, then:

```jsx
<button className="btn btn--primary" onClick={submit}>Talk to us</button>
<button className="btn btn--ghost btn--sm" onClick={() => window.novusTheme.toggle()}>Theme</button>
```

**Vite** ([verified guide](https://ui-kit.novustech.dev/frameworks/vite.html)):
zero configuration. Import in the entry module and Vite bundles the fonts and
assets with hashed URLs:

```js
import "novus-design-kit/tokens.css";
import lockup from "novus-design-kit/logos/lockups/novapay.png";
```

**Vue.js** ([verified guide](https://ui-kit.novustech.dev/frameworks/vue.html)):
import in `main.js`, use the classes in templates; scoped styles keep
referencing `var(--…)` tokens:

```vue
<button class="btn btn--primary" @click="submit">Talk to us</button>
```

## Theme a UI component library

The rule is one-directional: tokens.css is the source of truth and the
library's theme is derived from it, by `var(--…)` reference where the library
accepts CSS values, or by runtime `getComputedStyle` reads where it must
compute derived colours. Never paste token values into a config.

**Tailwind CSS** ([verified guide](https://ui-kit.novustech.dev/themes/tailwind.html)):
map tokens in CSS and utilities resolve to them, dark mode included:

```css
@import "tailwindcss";
@theme inline { --color-accent: var(--accent); --font-sans: var(--font-sans); }
```

**Fluent 2** ([verified guide](https://ui-kit.novustech.dev/themes/fluent2.html)):
Fluent UI React v9 theme values land in CSS custom properties, so point them at
the Novus variables directly:

```js
const novusFluent = { ...webLightTheme, colorBrandBackground: "var(--accent)", fontFamilyBase: "var(--font-sans)" };
```

**Material** ([verified guide](https://ui-kit.novustech.dev/themes/material.html)):
MUI decomposes palette colours, so read the computed values at runtime (a
`var()` string in the palette throws MUI error #9):

```js
const t = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const theme = () => createTheme({ palette: { primary: { main: t("--accent") } } });
```

**Material Web** ([verified guide](https://ui-kit.novustech.dev/themes/material-web.html)):
the m3.material.io web components consume CSS custom properties directly, so the
mapping is one CSS file and dark mode is free:

```css
:root { --md-sys-color-primary: var(--accent); --md-ref-typeface-plain: var(--font-sans); }
```

**Ant Design** ([verified guide](https://ui-kit.novustech.dev/themes/antd.html)):
same runtime-read pattern feeding `ConfigProvider`, with antd's dark algorithm
keyed off the kit's toggle.

## Native mobile foundations

The system extends to native mobile as token mappings for each platform's
standard stack, machine-checked against tokens.css by the build
(every colour on those pages must be a token value):

- **Android**, Jetpack Compose + Material 3: [Android foundations](https://ui-kit.novustech.dev/foundations/mobile-android.html)
- **iOS**, SwiftUI + HIG: [iOS foundations](https://ui-kit.novustech.dev/foundations/mobile-ios.html)

These are design mappings, not run-verified guides: the pages are labelled
accordingly and name the platform versions they target. Carlito ships per
platform as TTF (from the design system master or Google Fonts; this package
carries woff2 for the web).

## Dark mode

Built in and dual-triggered: an explicit `<html data-theme="dark">`, or the OS
preference when nothing is set (works with JavaScript disabled). Wire any
button to `window.novusTheme.toggle()`; the choice persists and applies before
first paint. Logos swap to their dark treatments automatically when you use the
`.brandlogo--light` / `.brandlogo--dark` pair.

## Brand assets

Reference logos, lockups, and photos by package path (the
[asset index](https://ui-kit.novustech.dev/foundations/assets.html)
lists every file):

```jsx
import logo from "novus-design-kit/logos/Novus_Logo_Colour_transparent.png";
```

Logos are placed assets: never retype, redraw, recolour, or CSS-filter one.
Product names are lowercase and solid-set (`novapay`, never `NovaPay`).

## Overriding and extending tokens

Layer your app's values after the import. Never edit kit files:

```css
/* after tokens.css */
:root { --container: 1400px; }
```

Anything you don't override keeps tracking the kit across upgrades. Brand
values (colours, type, logos) are locked. If one looks wrong, raise it with the
design-system owner instead of patching locally.

## Guide verification policy

Framework and theme guides only ship after their snippets are executed in a
real sample project; each page embeds the rendered result and the verified
library version, and re-verification happens when a target library ships a new
major. History: `specs/001-novus-design-kit/checklists/guide-verification.md`.

## Reference site deployment (ops)

The public reference site deploys to GitHub Pages via
`.github/workflows/pages.yml` (build, quality gates, deploy of `site/dist`).
The workflow fails the deploy if any gate is red. If a push does not trigger a
run (a known quirk on this repo), dispatch manually: `gh workflow run pages.yml`.

## Versioning

Semantic versioning with a maintained [CHANGELOG](CHANGELOG.md). Breaking
changes (removed or renamed class, custom property, import path, or asset
file) ship only in a MAJOR with a migration note. The `@sgultom99` scope is
interim (GitHub Packages requires scope = repo owner); moving to a Novus org
scope will ship as a MAJOR rename.
