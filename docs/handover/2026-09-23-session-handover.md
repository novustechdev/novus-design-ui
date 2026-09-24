# Handover: Novus Design Kit, 2026-09-23 (features 008 to 012)

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

- Publishing: DONE. The owner published 0.8.0 on 2026-09-24, which carries the
  work of 0.5.0 through 0.7.0 as well; those never shipped separately.
- The GitHub release for v0.4.0 is still outstanding from the 008 session.

---

# Feature 011: resolving three contradictions

## Where we are

Implemented on branch `feature/011-resolve-rule-conflicts`. Constitution 1.15.0,
kit 0.7.0, 18 gates, layout audit over 84 pages at two widths with 0 findings.

## The three, and what they turned out to be

1. **A table's scroll wrap was not a containing block.** `.sr-only` is
   absolutely positioned, so inside a horizontally scrolled table it resolved
   against the initial containing block, escaped the clip, and extended the
   document's scroll width. A screen built correctly from the kit scrolled
   sideways on a phone. One line fixed it, with a fixture in
   `tests/fixtures/tablewrap-sr-only/` that fails without it.
2. **The 44px floor had never been enforced.** Principle IV has required it
   since ratification and nothing ever checked, so the kit's own screens had
   about 222 controls under it at 375px. Gate 19 now enforces it.
3. **The header conflict was a wording problem.** tokens.css section 4c is
   LOCKED and places the master lockup far right; the console puts the account
   menu there. Section 4c governs brand surfaces, application chrome does not.
   Recorded in the constitution and the catalog; tokens.css untouched.

## The lesson worth carrying

Two unenforced rules in two features: the layout audit had never audited a root
page (found in 010), and the 44px floor had never been checked at all (found
here). A rule nobody measures is a rule the codebase will drift under, quietly,
for as long as it exists. When adding a rule, add the check in the same change.

The corollary is that a new check is not trustworthy until it has been wrong.
Gate 19 produced three separate false positives before it was right: boundary
rounding on a 44px hit area, a 16px checkbox inside a compliant label, and a
control near the viewport edge whose probe point fell outside the window. Each
looked like a real defect and each would have sent someone to "fix" compliant
code.

## Open items

- Publishing: DONE. The owner published 0.8.0 on 2026-09-24, which carries the
  work of 0.5.0 through 0.7.0 as well; those were never published separately.
- The GitHub release for v0.4.0 is still outstanding.
- A top-navigation console shell was requested by novabank-py for a dense,
  many-role admin portal. The answer given was yes, as a second supported shell,
  subject to conditions (single source and parity gate, click not hover, native
  details so it works without script, no destination unreachable at any width
  with its own gate, current section marked when its menu is closed, account menu
  last, 44px targets, documented and demoed before use). That is feature 012.

---

# Feature 012: a top-navigation console shell

## Where we are

Implemented on branch `feature/012-topnav-console-shell`. Constitution 1.16.0,
kit 0.8.0, 18 gate lines with gates 16 and 20 covering one shell each, layout
audit over 86 pages at two widths.

## What it is

A second console shell, requested by novabank-py and admitted on conditions that
were given to them before any code was written. Sections sit in a bar under the
header, menus open on click, and the whole thing is native disclosure elements so
it works with scripting off. The side navigation remains the default.

The design decision that keeps it honest: both shells render from the same `NAV`
definition, so a destination cannot exist in one and not the other, and below
900px both present the same drawer. There is one phone navigation in the kit.

## Three defects found by looking rather than by measuring

1. **A clipped menu that reported itself open.** `.topnav__inner` carried
   `overflow-x: auto`, which clips an absolutely positioned dropdown, because
   overflow-x auto forces overflow-y to auto. The behavioural suite passed 15 of
   15 while the menu painted nothing, because it read `details.open` and computed
   styles. The screenshot showed the truth. The strip now wraps instead of
   scrolling.
2. **Gate 16 fired against the new shell.** The rail rule assumed every console
   has a side navigation to collapse. It now names the shell it governs, in the
   audit and in the constitution.
3. **Gate 20 fired on a documentation page.** The catalog shows both shells as
   fragments, so the new check compared one demo against another. Gates 12 and 13
   learned this in feature 008; the new gate had to learn it again, and is now
   scoped to a real console shell.

## Open items

- Publishing: DONE. The owner published 0.8.0 on 2026-09-24. Registry versions
  are 0.2.0, 0.3.0, 0.4.0 and 0.8.0.
- The GitHub release for v0.4.0 is still outstanding.
- novabank-py can now build against a shipped pattern. They were asked for their
  top-level section count and menu depth; past about nine top-level sections the
  guidance sends them to the side navigation instead.
