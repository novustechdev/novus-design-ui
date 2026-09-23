# Research: resolving three contradictions (feature 011)

All figures below were measured in this session against the built demos, not
estimated.

## R1. The overflow mechanism

`.sr-only` (console layer, line 33) is `position: absolute`. `.tablewrap` (line
14) is `overflow-x: auto` with no `position`, so it is not a containing block.
Absolutely positioned descendants therefore resolve against the initial
containing block and are not clipped by the wrap, and they extend the document's
scrollable width.

Measured on the preserved screen at 375px: three `span.sr-only` at right=692,
containing block reported as the initial containing block, `clippedByWrap:
false`. `documentElement.scrollWidth` 692 against `body.scrollWidth` 375. Hiding
those three spans gives 375. Setting `.tablewrap { position: relative }` gives
375.

The kit's own demo never showed this because it has zero absolutely positioned
elements inside a table wrap, measured across every demo page at both widths.
That is luck, not design: the kit encourages `.sr-only` for accessible names and
mandates `.tablewrap` for tables.

**Decision**: position the wrap. **Alternative rejected**: making `.sr-only`
static, which would put a 1px box back into flow in flex and grid contexts and
break the standard visually-hidden recipe.

## R2. Target size, measured

375px, 16 demo pages, visible interactive controls only:

| class | count under 44px | measured height |
|---|---|---|
| `btn btn--ghost btn--sm` | 54 | 29px |
| `input` | 26 | 38px |
| `btn btn--secondary btn--sm` | 17 | 31px |
| `select` | 6 | 38px |

103 of 169 controls, 61 percent. At 1440px, 199 of 265, which includes 72
`navlink` and 24 `navgroup__label` at 36px that are not visible at phone width.

Emulating touch (`hasTouch`, `isMobile`, media query confirmed `coarse`) produces
the identical 103, because the only pointer-keyed floor in the kit covers
`.navlink` and `.navgroup__label`.

`.btn--sm` (`padding: .4rem .75rem`), `.input` and `.select` are defined in
`tokens.css`, which is frozen, so the floor has to come from the console layer,
which already does exactly this in eight places for individual contexts
(`.authcard .input`, `.authcard__submit`, `.authcard__sso`, `.signedout__actions
.btn`, `.filterbar__search > .input`, `.userdd__trigger`, `.toggle44`,
`.filterrow > .btn`).

**Why nobody noticed**: no automation. `scripts/gates.sh` contains no target
check; the layout audit emits WRAP, OVERFLOW, HEADER, TYPE, WIDTH, RAIL and
GROUND, and nothing for target size. Gate 3 has been a manual line since the
constitution was ratified, and manual gates rot.

## R3. The three statements of one rule

Principle IV: "Mobile-first CSS with 375px as the test baseline: no horizontal
scroll, touch targets at least 44px". Gate 3: "375px pass: no horizontal scroll,
at least 44px targets". Console layer line 126: `@media (pointer: coarse)`, two
selectors. Agent rule `targets` from feature 010: "at every width", with
`enforcedBy` saying "the 375px pass in the release gates", which contradicts its
own text.

The last one is this session's error, introduced when the rules were written
down. It is worth recording that writing the rules down is what exposed the other
two.

## R4. The header conflict

`tokens.css` line 507, section 4c, marked LOCKED: "the NOVUS MASTER lockup sits
at the FAR RIGHT, as the endorsement". Gate 12, added in feature 008, and the
shipped console put the account menu last. Section 4c governs brand surfaces;
application chrome puts the operator's own account where operators look for it.

`tokens.css` is byte-frozen against the upstream master and this repository does
not own it, so the divergence is recorded rather than resolved in place.

## R5. Making the check runnable

The audit is a single Node file with one dependency, already installed for CI. It
currently hard-codes `site/dist`. Accepting a directory or a URL makes it usable
by a consumer and by an agent, which is the gap that let R1 reach a shipped
screen: the rule said to check at two widths, and the agent had no way to do it.
