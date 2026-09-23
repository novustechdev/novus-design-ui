# Implementation Plan: Resolving three contradictions in the kit

**Branch**: `feature/011-resolve-rule-conflicts` | **Date**: 2026-09-23 | **Spec**: [spec.md](spec.md)

## Summary

Three contradictions, one of which turned out to be larger than reported. The
sideways scroll has a confirmed mechanism and a one line fix. The target size
rule is stated three different ways in three places, and the kit breaks its own
version of it 103 times on a phone, because the gate that was supposed to catch
that was never written. The header conflict is a wording question that gets an
owner decision recorded where a reader will find it.

## Technical Context

**Language/Version**: CSS (token-only), Node 20, HTML

**Primary Dependencies**: none added; the audit already uses playwright-core

**Testing**: `scripts/gates.sh`, `scripts/layout-audit.mjs`, and the preserved
converted screen from feature 010 as the overflow reproduction

**Target Platform**: the published package and the documentation site

**Constraints**: `tokens.css` frozen, so control base heights cannot be changed
there and any floor comes from the console layer; console patterns have one
source with a parity gate; agent rules have one source with gate 18; no em
dashes; every new gate negative-tested

**Scale/Scope**: 1 CSS line for the overflow, 1 CSS block for the target floor,
1 new audit check, 1 constitution amendment, 3 documents corrected, 1 rule text
corrected at its source

## Constitution Check

| Principle | Status | Note |
|---|---|---|
| I. Token-first | PASS | No new values. The 2.75rem floor is the figure the console layer already uses in eight places. |
| II. Monochrome near-flat | PASS | No visual change beyond control heights at phone width. |
| III. Component library | PASS | No new component. |
| IV. Accessibility | IMPROVED | The 44px floor stops being aspirational. It has been unenforced since the constitution was ratified. |
| V. Brand and copy | PASS | Copy rules unchanged. |
| VI. Framework-agnostic | PASS | CSS and an audit check. |
| VII. Reference applications | FIXED | The demos currently break the kit's own target rule 103 times at 375px. |
| Governance | AMEND | Gate 19 (target size) joins the list, so the constitution goes to 1.15.0. |

## Approach

### 1. The overflow (User Story 1)

**Mechanism, confirmed by measurement**: `.sr-only` is
`position: absolute`. `.tablewrap` is `overflow-x: auto` but is **not
positioned**, so it is not the containing block for its absolutely positioned
descendants. Those descendants resolve against the initial containing block,
escape the wrap's clip, and extend the document's scrollable width. In the
preserved screen, three `.sr-only` spans sit at x=692 inside a horizontally
scrolled table: `documentElement.scrollWidth` reports 692 while
`body.scrollWidth` reports 375, which is the signature of exactly this.

**Fix**: `.tablewrap { position: relative }` in the console layer. Measured: the
failing screen returns to 375, and hiding the spans gives the same result, so the
mechanism is not in doubt.

**Trade-off to document**: a positioned wrap becomes the containing block for any
absolutely positioned descendant, so a popover rendered inside a scrolling table
will now be clipped by it. No demo page has an absolutely positioned element
inside a table wrap today (measured across every demo page at both widths), so
nothing in the kit regresses. The catalog gains a line telling consumers to
render row popovers outside the wrap.

**Regression check**: the audit gains a case built from the reproduction, and it
must fail when the line is removed.

### 2. Target size (User Story 2)

**What the measurements say**: at 375px, 103 of 169 visible interactive controls
are under 44px: 54 ghost small buttons at 29px, 26 inputs at 38px, 17 secondary
small buttons at 31px, 6 selects at 38px. Emulating a coarse pointer changes
nothing, because the kit's only pointer-keyed floor covers `.navlink` and
`.navgroup__label`, which are not visible at that width.

**Why it went unnoticed**: nothing checks it. `scripts/gates.sh` has no target
check and the layout audit emits no target finding. Gate 3 has been a manual
checklist line since ratification.

**The rule is stated three ways** and all three must end up saying one thing:

| Where | What it says today |
|---|---|
| Constitution, Principle IV and gate 3 | 375px baseline, touch targets at least 44px |
| Console layer, line 126 | keyed to `pointer: coarse`, covering two selectors |
| Agent rule `targets` (feature 010) | "at every width", while its own `enforcedBy` says the 375px pass |

**Resolution**: the constitution's width baseline wins, because it is the thing
that can be measured in a headless browser and therefore the thing that can be
enforced. The console layer keeps its pointer rule as a belt-and-braces measure
for touch laptops and extends the floor to the whole control set below the
desktop breakpoint. Desktop density is unchanged, which preserves the feature 003
decision. The agent rule text is corrected at its source so it stops contradicting
itself, and flows out through the generator.

### 3. The header (User Story 3)

`tokens.css` is frozen and belongs upstream, so the conflict is settled in this
repository's own governance: the account menu stays last, gate 12 stands, and the
constitution records the divergence from section 4c in plain terms, naming what
it diverges from so it can be revisited when the upstream kit is next updated.
The brand documentation on the site carries the same note.

### 4. A check a consumer can run (User Story 4)

The kit already owns the logic. `scripts/layout-audit.mjs` gains the ability to
audit a URL or a directory that is not this repository's `site/dist`, and the
agent rules and the docs say how to run it. The rule that tells an agent to
confirm at two widths also tells it to say plainly that it could not, rather than
claiming a pass it did not perform.

## Project Structure

```text
admin-kits/shared/novus-admin.css   # .tablewrap positioned; the target floor
agents/rules.mjs                    # targets rule corrected; how to check
scripts/layout-audit.mjs            # TARGET finding; audit an arbitrary target
scripts/gates.sh                    # gate 19
.specify/memory/constitution.md     # 1.15.0, gate 19, the header divergence
site/src/                           # catalog notes: popovers in tables, running the check
```

**Structure Decision**: every change lands in an existing single source. No new
directory, no new component, no new package artifact.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Two mechanisms for the target floor (width and pointer) | The width rule is enforceable in CI; the pointer rule catches touch laptops the width rule misses | Width alone leaves a real device class uncovered; pointer alone cannot be enforced, which is how the kit reached 103 violations |
