# Handover — Novus Design Kit — 2026-08-26

## Where we are

The kit is **shipped**. `@sgultom99/novus-design-kit@0.1.0` is published to GitHub
Packages (private visibility, install verified from a fresh project), and the docs
site is live at https://sgultom99.github.io/novus-design-ui/ (repo:
github.com/sgultom99/novus-design-ui, branch `001-novus-design-kit` = default).
All 35 speckit tasks are complete, the constitution is at v1.3.0, and all 14
release gates pass. The speckit artifacts were synced to the shipped state at the
end of this session.

## Done this session

- Full speckit lifecycle: constitution (v1.0.0 → 1.3.0), spec (18 FRs, 7
  clarifications), plan, 35 tasks, 2 converge passes, all implemented.
- Package: root-is-the-package layout (tokens.css verbatim + woff2 fonts + logos +
  photos + `js/novus-theme.js`), published to GitHub Packages under the interim
  `@sgultom99` scope. `.npmrc` uses env-var auth only.
- Docs site: 41 static pages built by zero-dependency `site/build.mjs` from
  `site/components.json` + fragments. Ant-design-style sidebars, 22-component
  catalog with by-construction-faithful snippets, 8 foundations pages, version
  badge, generated asset index.
- Framework/theme guides, ALL verified in real sample projects (versions in
  `specs/001-novus-design-kit/checklists/guide-verification.md`): Blazor (.NET
  10), React 18, Vite 8, Vue 3.5, Tailwind 4.3, Fluent UI 9.74, MUI 9.3, antd
  6.6. Each page embeds its rendered-sample screenshot. Verification caught and
  fixed 3 real guide bugs (Vite head-script, MUI var() palette, Blazor template
  Bootstrap collision).
- Quality: `scripts/gates.sh` (14 gates incl. link gate, orphan/double-ownership,
  guide-verification, em-dash copy style), build-time FR-017 publication filter,
  GitHub Pages deploy workflow that runs gates before deploying.
- T027 browser pass done against the live site via Chromium/CDP (dark toggle +
  persistence, OS-dark with JS off, 375px, logo swap); toggle touch target fixed.
- README rewritten as a developer manual (quick start, per-framework and
  per-theme sections with links to verified guides); proven by building a fresh
  sample app from the published registry package (screenshots sent to owner).

## Verify

- [ ] `node site/build.mjs && scripts/gates.sh` after any content change (last
      full run this session: ALL GATES PASS)
- [ ] Speckit-sync commit at session end pushed and Pages redeployed (deploy is
      only needed when `site/` changes; README/spec-only commits don't affect it)

## Open items

- **Push-event workflow triggers drop on this repo** (3 occurrences): deploys
  succeed via `gh workflow run pages.yml --repo sgultom99/novus-design-ui --ref
  001-novus-design-kit`. If it persists, check Settings → Webhooks deliveries or
  GitHub support.
- **Scope rename**: moving `@sgultom99/novus-design-kit` → a Novus org scope is a
  planned MAJOR (documented in contract + README) once the org exists.
- **Next release nicety**: add `"./package.json": "./package.json"` to the
  `exports` map in package.json (some tools read it; no consumer breakage today).
- **Human device pass**: automated T027 checks all pass; a quick real-device look
  (colour perception, hover feel) is still worthwhile before wide announcement.
- **Upstream drift**: `references/Novus_Design_System_Kit_v2/` is the read-only
  snapshot (SharePoint master owned by Rick); release step diffs shipped files
  against it (ttf/ deliberately not shipped).

## Next session: start here

1. Read `memory/MEMORY.md`, then this file. State of the world in one line:
   shipped v0.1.0, docs live, no failing gates, no open tasks.
2. If continuing development: bump version + CHANGELOG entry per release, run
   `node site/build.mjs && scripts/gates.sh`, publish with
   `NODE_AUTH_TOKEN=$(gh auth token) npm publish` (needs `write:packages` on the
   gh token), deploy docs with `gh workflow run pages.yml` if the push trigger
   drops again.
3. If a new feature starts: `/speckit-specify` opens feature 002; the constitution
   (v1.3.0) and gates carry over unchanged.
4. Known environment facts (details in `memory/project_operations.md`): snap
   Chromium + puppeteer-core drive browser checks; .NET SDK is at `~/.dotnet`;
   never `pkill -f` a pattern contained in your own command line.
