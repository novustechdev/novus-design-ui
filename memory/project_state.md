# Project state (as of 2026-08-27)

- **Admin Kit**: two flavors (`admin-kits/blazor` Server, `admin-kits/tailwind`
  Vite MPA) + WASM demo twin (`admin-kits/blazor-demo`) hosted at
  /demos/blazor/ and /demos/tailwind/ on the docs site; one dataset
  (`admin-kits/data`, `node generate.mjs` for parity). 6 screens + login
  (admin/admin). Settings is tabbed (radio + `:has`, JS-off safe); functional
  motion allowed since constitution 1.6.0 (0.2s max, reduced-motion aware).
  Header = novapay lockup + icon theme toggle; below 520px the suffix hides and
  the endorsement mark steps to 20px (375px overflow guard).
- **Speckit (current)**: active feature `specs/003-adminkit-charts-demos`
  (tasks through T036 done); constitution v1.7.0.

- **Package**: `novus-design-kit` on PUBLIC npm (npm serves 0.2.0; repo at v0.3.0, npm publish of 0.3.0 pending owner passkey; packaged kit files identical), tokenless install
  (`npm install novus-design-kit`); third-party marks (logos/clients,
  logos/schemes) stripped from the artifact, repository-only. npm account
  sgultom99, 2FA via passkey: publishing needs the owner in a real terminal.
  Historical: `@sgultom99/novus-design-kit@0.1.0` on GitHub Packages (private,
  auth-gated), kept as an artifact only.
- **Repo**: github.com/sgultom99/novus-design-ui, default branch **main**
  (protected: no force pushes or deletions, conversation resolution required;
  direct pushes allowed). Branch 001-novus-design-kit frozen at the same
  commit. SSH auth works; gh CLI authed as sgultom99 with repo +
  write:packages scopes; repo-local git identity is configured.
- **Releases**: semantic tags + GitHub Releases with the npm tarball attached;
  v0.1.0: https://github.com/sgultom99/novus-design-ui/releases/tag/v0.1.0.
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
