# Project state (as of 2026-09-23)

- **Feature 012 (top-navigation console shell, constitution 1.16.0)**: the kit
  now admits TWO console shells, requested by novabank-py for a dense,
  many-role banking admin portal (their specs/028-digital-bank-onboarding). The
  side navigation stays the DEFAULT; the new shell puts sections in a bar under
  the header with menus on CLICK (never hover), built on native details so they
  work with JavaScript off. Both render from ONE `NAV` definition
  (`navbarHtml`/`navbarRazor` beside `navHtml`/`navRazor`), and below 900px both
  present the SAME drawer. Opt in with `adminwrap--topnav`. GATE 20 (NAVREACH)
  checks the bar reaches every destination the drawer defines, judged by paint.
  Gate 16 was rescoped: the rail rule belongs to the side-nav shell only.
  Catalog entry `top-navigation`, demo at demos/tailwind/topnav.html, shell
  guidance on the Admin Kit page. Kit version 0.8.0.

- **Feature 011 (resolving three contradictions, constitution 1.15.0)**: writing
  the rules down in 010 exposed three places the kit contradicted itself.
  (1) `.tablewrap` is now a containing block: `.sr-only` is absolutely
  positioned, and without this it escaped the wrap's clip and made a console
  screen scroll sideways on a phone. Popovers in a table row must render outside
  the wrap. (2) The 44px floor was never automated, so the kit's own screens had
  about 222 controls under it at 375px; the console layer now floors them at
  phone width (desktop density unchanged) and GATE 19 enforces it, measuring the
  hit area, judging form controls by their label, and leaving edge controls
  unjudged. (3) The console header's divergence from tokens.css section 4c (which
  is LOCKED and puts the master lockup far right) is recorded in the constitution
  and catalog: account menu stays last, tokens.css untouched. The audit now ships
  in the package and takes `--target`, so consumers and agents can run it.
  Kit version 0.7.0.

- **Feature 010 (agent adoption guide, constitution 1.14.0)**: the kit now tells
  coding agents how to adopt it. `agents/rules.mjs` is THE source for the kit's
  rules; `agents/generate.mjs` renders five outputs (AGENTS.md, CLAUDE.md,
  two Copilot files, a Cursor .mdc) and the docs page renders the same rules, so
  they cannot drift. The four provider files ship in the package (`files` and
  `exports`); the source and generator deliberately do not. New docs page
  `site/src/agents.html` with an "AI agents" top navigation entry, carrying
  three copyable prompts (adopt, convert a hand-built screen, audit a screen).
  Gate 18 (agent rule parity) added and negative-tested. Two gate gaps closed on
  the way: the copy gates never scanned a new top-level directory, and the
  layout audit had never audited ANY root page (landing, install), only
  components, foundations, the Admin Kit page and the demos. Kit version 0.6.0.

- **Feature 009 (icon rail and the light sign-in ground, constitution 1.13.0)**:
  two mandatory owner corrections. Collapsing a console's side navigation leaves
  a RAIL of icons (3.5rem column, 44px targets, labels visually hidden but kept
  for assistive technology); hiding the navigation is now a defect. A closed
  `details` group needs `::details-content { content-visibility: visible }` in
  rail mode, or the browser never paints its children. Sign-in moved to the
  near-white ground (`--bg-subtle`) with the ambient art retinted, so the
  tinted-ground exception for authentication is withdrawn. Gates 16 (rail) and
  17 (ground) added; gate 16 hit-tests paint rather than measuring boxes,
  because a box check passed a destination that never rendered. Kit version
  0.5.0 (needs an owner npm publish). Handover:
  docs/handover/2026-09-23-session-handover.md.

- **Feature 008 (enterprise portal defaults, constitution 1.12.0)**: owner
  feedback round on novabank.novustech.dev turned into kit defaults. The console
  layer is now PACKAGED (`console.css`, `js/novus-console.js`,
  `icons/novus-icons.svg`, all generated from `admin-kits/shared/`), so consumers
  inherit the patterns by upgrading; kit version 0.4.0, published to npm on
  2026-09-23. Light is the default theme (`window.novusThemeFollowOS` opts back into
  the OS). D3 replaced Chart.js everywhere (`admin-kits/shared/novus-chart.js`,
  one source, `novus-chart-boot.js` for the Blazor flavors). Typography parity
  (shell and content at --text-sm, page title --text-xl), portal text resets
  tokens.css's 68ch cap, sign-in is 50/50 with ambient art and single sign-on,
  settings screens use the settings layout, filter sheet gained a Date range.
  Gates 12 to 15 added (account menu placement, typography parity, content
  width, version agreement), all negative-tested. Catalog 42 components.
  Handover: docs/handover/2026-09-23-session-handover.md.

- **Feature 007 (console patterns, constitution 1.11.0)**: novalending console
  (v2.1nflow.co) is the admin pattern reference; its short-content wrapping is a
  recorded defect. Console patterns have ONE source, `admin-kits/shared/`
  (novus-admin.css with @pattern sections, novus-admin.js, console-pages.js,
  icons.mjs); `admin-kits/data/generate.mjs` emits every flavor copy, the static
  SHELL markup, Razor shell components, and the WASM demo mirrors; `--check` is
  Quality Gate 10. `scripts/layout-audit.mjs` is Gate 11 (playwright-core
  installed --no-save at repo root; Chromium from ~/.cache/ms-playwright or
  CHROME_PATH). Catalog 40 components (Templates category). Eight screens per
  flavor (signed-out page added). Handover: docs/handover/2026-09-15-session-handover.md.

- **Admin Kit**: two flavors (`admin-kits/blazor` Server, `admin-kits/tailwind`
  Vite MPA) + WASM demo twin (`admin-kits/blazor-demo`) hosted at
  /demos/blazor/ and /demos/tailwind/ on the docs site; one dataset
  (`admin-kits/data`, `node generate.mjs` for parity). 6 screens + login
  (admin/admin). Settings is tabbed (radio + `:has`, JS-off safe); functional
  motion allowed since constitution 1.6.0 (0.2s max, reduced-motion aware).
  Header = novapay lockup + icon theme toggle; below 520px the suffix hides and
  the endorsement mark steps to 20px (375px overflow guard).
- **Speckit (current)**: active feature `specs/012-topnav-console-shell` (constitution 1.16.0); earlier `specs/011-resolve-rule-conflicts`; earlier `specs/010-agent-adoption-guide` (constitution 1.14.0); earlier `specs/009-nav-rail-light-auth` (shipped via PR #7); earlier `specs/008-enterprise-portal-defaults`; earlier `specs/007-novalending-admin-patterns` (shipped via PR); earlier `specs/005-mobile-foundations` (T001-T007 done; was 004 T001-T016) (T001-T016 done, was 003 through T036)
  (tasks through T036 done); constitution v1.8.0.

- **Package**: `novus-design-kit` on PUBLIC npm (0.4.0 published 2026-09-23 and is dist-tag latest; 0.5.0 and 0.6.0 are merged but NOT published, so one publish of 0.6.0 ships both; repository field novustechdev), tokenless install
  (`npm install novus-design-kit`); third-party marks (logos/clients,
  logos/schemes) stripped from the artifact, repository-only. npm account
  sgultom99, 2FA via passkey: publishing needs the owner in a real terminal.
  Historical: `@sgultom99/novus-design-kit@0.1.0` on GitHub Packages (private,
  auth-gated), kept as an artifact only.
- **Repo**: github.com/novustechdev/novus-design-ui, default branch **main**
  (protected: no force pushes or deletions, conversation resolution required;
  direct pushes allowed). Branch 001-novus-design-kit frozen at the same
  commit. SSH auth works; gh CLI authed as sgultom99 with repo +
  write:packages scopes; repo-local git identity is configured.
- **Releases**: semantic tags + GitHub Releases with the npm tarball attached;
  v0.1.0: https://github.com/novustechdev/novus-design-ui/releases/tag/v0.1.0.
  Package visibility: owner decided PUBLIC for now (override recorded in spec
  Clarifications); flip is web-UI only, and GH Packages npm installs need a
  token even when public.
- **Docs site**: https://ui-kit.novustech.dev/ via GitHub Pages
  (workflow `.github/workflows/pages.yml`: build → 14 gates → deploy).
- **Speckit**: feature `specs/001-novus-design-kit/`, all 35 tasks [X], spec
  Status: Shipped, constitution `.specify/memory/constitution.md` at v1.3.0
  (VI principles; radius = token scale; no em-dash copy style; guide
  verification mandatory).
- **Guides**: 8 framework/theme guides, all verified against live libraries
  (Blazor/.NET 10, React 18, Vite 8, Vue 3.5, Tailwind 4.3, Fluent 9.74,
  MUI 9.3, antd 6.6); record in
  `specs/001-novus-design-kit/checklists/guide-verification.md`. Unverified
  guides are auto-excluded from the site build (FR-017).
- **Upstream**: `references/Novus_Design_System_Kit_v2/` is the read-only kit
  snapshot (SharePoint master, owner Rick). Shipped files must diff clean
  against it except `ttf/` (deliberately not shipped).
