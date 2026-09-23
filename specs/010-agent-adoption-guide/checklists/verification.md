# Verification: adopting the kit with an AI coding agent (feature 010)

Verified 2026-09-23 against the built site, the packed artifact, and an
end-to-end run with a separate agent.

| item | evidence | result |
|---|---|---|
| Page reachable from the top navigation | "AI agents" entry resolves at every depth, carries aria-current on its own page and not elsewhere, at 1440px and 375px | pass |
| Page layout | layout audit, 1 page x 2 widths, 0 findings; full suite 84 pages x 2 widths, 0 findings | pass |
| Dark theme | body ground rgb(11, 22, 32), text at 93% luminance, code blocks rgb(174, 188, 201) on rgb(15, 30, 43), logo swaps to white | pass |
| JavaScript off | 3 prompts and all 17 rules render at 1440px and 375px, the 3 copy buttons stay hidden so there are no dead controls, no horizontal scroll | pass |
| Packaged delivery | npm pack installed into a blank project: all five agent files present at their contract paths, rules.mjs and generate.mjs correctly absent, release stamp present, Copilot applyTo and Cursor frontmatter intact | pass |
| Gate 18, negative test | a plain hand edit fails gate 18 alone naming agents/AGENTS.md while the copy gate passes; an em dash fails gate 18 and the copy gate, the latter naming file and line | pass |
| Copy gates cover agents/ | proven by the em-dash negative test, which the gate could not have seen before agents/ joined its path list | pass |
| Full suite | 18 of 18 gates pass | pass |
| SC-007, end-to-end adopt run | see below | NOT MET |

## SC-007: the end-to-end run

A separate agent, with no access to this repository beyond the shipped prompt
and the installed package, was given the adopt prompt and a hand-built admin
screen (hardcoded colours, 11px to 34px type, a fixed table layout with broken
identifiers, a 380px reading cap).

What it produced was good: the console shell with the checkbox-driven drawer and
icon rail, grouped navigation with sprite icons, a page header with breadcrumb
and end-aligned action, the card-wrapped scrolling table, filter bar with a
sub-filter sheet built on native elements, and a list footer, all inside one
form so it works without script. Zero CSS survived; no hardcoded value remained.
At 1440px it renders correctly.

It still fails the kit's own gate. At 375px the result measures
`document.documentElement.scrollWidth` 692 against a 375px viewport, which is
exactly what gate 11 checks, so the audit would report OVERFLOW.

Diagnosis so far: hiding the table restores 375, and the kit's own transactions
demo carries a 647px table in the same `.card--flush > .tablewrap > table.table`
structure and measures 375. The ancestor chains are identical in width,
min-width, overflow and display. Neutralising the extra form wrapper
(`min-width: 0`, `overflow-x: hidden`, `display: contents`) changes nothing. The
mechanism is unresolved and is recorded here rather than guessed at.

The agent also could not perform the 1440px and 375px pass the rules demand,
because it had no browser, and said so in its report. That is the gap that let
this through.

## What the run surfaced, verified independently

Refuted by measurement:

- `.btn` is 44px with `min-height: 44px`, not the roughly 36px reported from
  reading the CSS. The `btn--sm` variant is 29px to 31px, which is where the
  real tension sits: see the open questions below.
- `.userdd__menu` is not transparent in practice. The kit composes it as
  `class="card userdd__menu"`, measuring rgb(255, 255, 255). The pairing is
  undocumented, which is the actual gap.

Confirmed and fixed in this feature:

- The rules sent agents to a component catalog that the package cannot reach,
  because the artifact ships CSS, icons and scripts but no markup. Every
  reference now carries the catalog URL.
- The wiring step said "the stylesheet" while listing five files, and never said
  where `js/novus-console.js` goes. Each file now has its own placement line.
- An external SVG sprite does not load from a `file://` page. The wiring step
  now says to serve over http.

Open questions for the owner, not settled here:

- The 44px rule is absolute, but the kit's own console demos ship `btn--sm`
  controls at 29px to 31px ("Sign out", "Open in data grid"). Either the rule
  needs a documented exception for dense secondary actions, or the demos need
  correcting.
- `tokens.css` line 507, in a section marked LOCKED, states that the Novus
  master lockup sits at the far right as the endorsement. Gate 12 and the
  account-menu rule require nothing to sit right of the account menu. Both
  cannot hold. This predates feature 010: gate 12 arrived in feature 008.
- The filter bar and list footer are mandated unconditionally, so a three-row
  list acquires invented filter categories. Whether small lists are exempt is
  undecided.
