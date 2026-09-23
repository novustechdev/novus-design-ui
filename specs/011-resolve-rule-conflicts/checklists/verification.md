# Verification: resolving three contradictions (feature 011)

Verified 2026-09-23. Every figure below was measured, not estimated.

| item | evidence | result |
|---|---|---|
| Overflow mechanism identified | `.sr-only` is absolutely positioned; `.tablewrap` had no `position`, so it was not the containing block and its absolutely positioned descendants escaped its clip and extended the document's scroll width | pass |
| Overflow fixed at source | `.tablewrap` is now a containing block; the preserved screen from feature 010 reports 0 findings where it measured `documentElement.scrollWidth` 692 at 375px | pass |
| Overflow regression guard | `tests/fixtures/tablewrap-sr-only/` reproduces it: removing the line gives `OVERFLOW 375 scrollWidth=663`, restoring gives 0 | pass |
| Target floor, before | 190 TARGET findings across 84 pages at 375px, about 222 controls once the per-page cap is counted: 54 ghost small buttons at 29px, 26 inputs at 38px, 17 secondary small buttons at 31px, 6 selects at 38px, 34 nav links and 18 group labels at 36px | recorded |
| Target floor, after | 0 TARGET findings, and 0 findings of any kind across 84 pages at both widths | pass |
| Gate 19 negative test | shrinking the floor in every served stylesheet produced 158 TARGET findings naming page, element and height; rebuilding restored 0 | pass |
| Full suite | 18 of 18 gates pass | pass |
| Constitution | 1.15.0: gate 19 added, the section 4c divergence recorded in Principle VII | pass |

## What the rule says now, in one voice

Principle IV and gate 3 set the 375px baseline. Gate 19 enforces it. The console
layer carries a phone-width floor, and keeps its `pointer: coarse` rules for
touch laptops that a width query cannot see. The shipped agent rule matches both,
and no longer contradicts its own enforcement note.

## Why the rule had drifted

Nothing checked it. `scripts/gates.sh` had no target check and the layout audit
emitted no target finding, so Principle IV's 44px requirement had been a manual
checklist line since ratification. Manual gates rot. This is the second unenforced
rule found in two features: the layout audit had also never audited a single root
page until feature 010.

## T011: the per-context 44px rules were kept, deliberately

The plan expected to delete them as redundant. Measurement said otherwise. Of the
eighteen `min-height: 2.75rem` rules in the console layer, almost all size a
control at every width (the sign-in card's inputs, submit and single sign-on
button, paginator buttons, filter triggers, the account menu trigger). They are
design decisions, not phone-width compensation, and deleting them would shrink
desktop controls to satisfy a rule that governs only the phone baseline. The
three `pointer: coarse` rules are kept alongside the new width floor rather than
replaced by it.

## Three defects in the check itself, found and fixed while verifying

The floor was the easy half. The check needed three corrections before its
findings could be trusted, each found by investigating a single stubborn result
rather than accepting it:

1. **Boundary rounding.** Probing 21.5px from centre lands on the exact edge
   pixel of a 44px target and reads as outside. A chip remove button with a 32px
   box and a 6px expanded hit area, which genuinely complies, was being failed.
2. **Label-wrapped controls.** A 16px checkbox inside a 44px label is compliant,
   because the label is the target. The check now judges a form control by its
   label when one wraps or names it.
3. **Offscreen probes.** A control near the bottom of the viewport had its lower
   probe point fall outside the window, which the code counted as a failure. The
   window running out says nothing about the target, so those are now left
   unjudged, as below-the-fold rows already were.

All three produced false positives, which is the failure mode that teaches people
to ignore a gate.
