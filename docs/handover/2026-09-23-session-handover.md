# Handover: Novus Design Kit, 2026-09-23 (features 008, 009 and 010)

## Where we are

Feature 008 (enterprise portal defaults) is implemented and verified on branch
`feature/008-enterprise-portal-defaults`. Constitution is 1.12.0, kit version is
0.4.0, catalog is 42 components, and all 17 gates pass (the three new layout
rules ride inside the layout audit gate; version agreement is its own gate).

## What the owner asked for, and where it landed

The round came from novabank.novustech.dev. Eight items:

1. Account menu at the far right: already the kit's order; now gate 12 keeps it.
2. Text wrapping beside unused space: root cause was `tokens.css` capping every
   paragraph at 68ch. The console layer resets it for portal surfaces, `.measure`
   opts prose back in, and gate 14 catches regressions.
3. Navbar and content typography: one size across shell and content
   (`--text-sm`), page title `--text-xl`, sections `--text-lg`; gate 13.
4. Audit page filter bar: the 007 filter bar already matched the reference. What
   was missing was delivery, so the console layer is now packaged; a Date range
   category joined the sub-filter sheet for audit-style screens.
5. Sign-in on the novacard layout: 50/50 split, ambient line art (the one
   decoration the kit allows, stopped under reduced motion), single sign-on
   beside the password form, no theme toggle. novacard's radial gradient was NOT
   adopted; the ban stands and the ground stays flat.
6. Light default everywhere: `js/novus-theme.js` applies light when nothing is
   stored; `window.novusThemeFollowOS = true` restores the old behaviour.
7. D3 statistics: Chart.js is gone from every flavor and the docs.
   `admin-kits/shared/novus-chart.js` draws composition bars with a trajectory
   line and a share donut, reading tokens at render time, with hover and
   keyboard tooltips and a table of the same numbers for JS-off.
8. Account page: the settings layout (section menu beside grouped rows) replaces
   the card grid and tab strip.

## Verify

- 79/79 verified checks across Tailwind, Material, Blazor Server and the WASM
  demo, plus JavaScript-off runs, recorded in
  `specs/002-novus-admin-kit/checklists/verification.md`.
- Packaged-install check: a blank project installing the 0.4.0 tarball and
  importing `tokens.css` plus `console.css` renders the sign-in (720/720 split),
  console shell, settings layout and icon sprite, and renders light on a dark
  operating system.
- All four new gates negative-tested (element right of the account menu, a
  smaller navbar, a capped paragraph, a version mismatch) and restored.

## Open items

- 0.4.0 published to npm by the owner on 2026-09-23, so novabank-py can pin it.
  The granular token in ~/projects/credentials was never accepted for this
  package (403 on every authenticated call, 404 on PUT); `npm login` worked.
- novabank's authenticated screens were never inspected (no credentials); the
  patterns follow the written feedback plus the novacard and novalending
  references.
- novabank-py implements its own page-level fixes against this release.

## Next session: start here

1. Build order: `node admin-kits/data/generate.mjs`, vite build (tailwind,
   material), `dotnet publish -c Release` (blazor-demo), `node site/build.mjs`,
   `scripts/gates.sh`.
2. The layout audit needs `playwright-core` at the repo root and a Chromium
   (`CHROME_PATH`, or `~/.cache/ms-playwright`).
3. Commits are authored as sgultom99 with no assistant trailers.

---

# Feature 009: icon rail and the light sign-in ground

## Where we are

Implemented and verified on branch `feature/009-nav-rail-light-auth`.
Constitution is 1.13.0, kit version 0.5.0, all 17 gates pass, and the layout
audit covers 81 pages at two widths with the navigation collapsed in the second
pass.

## What the owner asked for

"in admin kit, I want u put mandatory nav bar sidemenu when hide/collapse, it
should show as icon rather than nothing also use mandatory background login that
we are using canvas animation to be more light theme adjust to nearly white."

1. Collapsing the side navigation at desktop width now leaves a rail of icons:
   a 3.5rem column, 44px targets, the current page still accented, labels
   visually hidden but kept in the accessibility tree, and a `title` on every
   link. The drawer below 900px is untouched.
2. Sign-in sits on `--bg-subtle`. The ambient line art is retinted for a light
   surface and still stops under reduced motion; the lockup returns to its
   normal light treatment and the card gains a border. Principle II's
   tinted-ground exception for authentication is withdrawn.

## The defect worth remembering

A closed `details` group does not paint its children, even when CSS gives them
`display: flex` and a box. The first gate and verified run measured bounding
boxes, so both reported 6 of 6 rail destinations when only 5 rendered; the
screenshots showed the truth. The console layer now asks for the subtree back in
rail mode (`.navgroup::details-content { content-visibility: visible }`), scoped
inside the desktop media block so the drawer is unaffected, and gate 16 plus the
verified run judge the rail with `elementFromPoint`. Rule of thumb: for
"is it visible", hit-test; a rectangle is not proof.

## Open items

- 0.5.0 is not published. The owner publishes (`npm login`, then
  `npm publish`); the granular token has never been accepted for this package.
- The GitHub release for v0.4.0 was never created: `gh release create v0.4.0
  --target ebe257b` returned HTTP 422 and the retry was blocked by the
  permission classifier. Needs the owner, or an approved rerun.

---

# Feature 010: adopting the kit with an AI coding agent

## Where we are

Implemented on branch `feature/010-agent-adoption-guide`. Constitution 1.14.0,
kit version 0.6.0, 18 gates, layout audit over 84 pages at two widths.

## What the owner asked for

"I want u put also how to prompt in claude code or copilot or code to use this
ui kit and implement it to existing project, u can add new menu topbar and put
guidance proper skill prompt for each llm provider."

Two deliverables. A documentation page at an "AI agents" top navigation entry,
carrying the order of work and three prompts to copy. And instruction files
shipped in the package, one per agent, so the rules survive past the first
conversation.

## The design decision that matters

Everything is generated from `agents/rules.mjs`: the five files and the rules
shown on the page. Four hand-maintained copies of the same rules would drift
within a release, which is the lesson the console layer already taught. Gate 18
makes drift a build failure.

Formats were confirmed against each vendor's documentation rather than from
memory, and one fact changed the design: Claude Code reads `AGENTS.md` when no
`CLAUDE.md` is present, and Cursor is on the AGENTS.md reader list too, so a
consumer can have two of our files loaded at once. They must never contradict
each other, which is exactly what single-source generation guarantees.

## Two gate gaps found while building this

- The copy gates (em dash, banned category word) scan an explicit path list. A
  new top-level directory was invisible to them. `agents/` now joins the list.
- The layout audit had never audited a single root page. It enumerated
  components, foundations, `admin-kit.html` and the demos, so the landing page
  and the install page went unchecked for their whole life. It now enumerates
  every root page: 84 pages, still 0 findings.

## Open items

- Publishing: 0.4.0 is the published version. 0.5.0 and 0.6.0 are merged but
  unpublished, so a single `npm publish` of 0.6.0 ships both.
- The GitHub release for v0.4.0 is still outstanding from the 008 session.
