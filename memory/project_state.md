# Project state (as of 2026-08-26)

- **Package**: `novus-design-kit@0.2.0` on public npm (tokenless installs; third-party marks stripped from the artifact). Historical: `@sgultom99/novus-design-kit@0.1.0` on GitHub Packages
  (npm.pkg.github.com), private visibility; installs need a GitHub token with
  `read:packages`. Scope is interim (GitHub Packages requires scope = repo
  owner); moving to a Novus org scope is a planned MAJOR.
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
- **Docs site**: https://sgultom99.github.io/novus-design-ui/ via GitHub Pages
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
