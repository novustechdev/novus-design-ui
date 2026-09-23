# Verification: a top-navigation console shell (feature 012)

Verified 2026-09-23. Every visibility claim below is a paint test, not a reading
of DOM state or computed style. That distinction is not pedantic here: the first
run of this suite passed 15 of 15 while the menu it declared open painted
nothing.

| item | evidence | result |
|---|---|---|
| The bar renders | both direct links and both sections paint at 1440px | pass |
| Current section marked while shut | Operations carries the marking with its menu closed, and the marking paints | pass |
| Menus open on click | each section's menu paints its destinations when opened (3 and 1) | pass |
| One menu at a time | opening the second closes the first, with scripting | pass |
| Escape | no menu paints afterwards, and focus returns to the trigger that opened it | pass |
| Nothing lost | the bar reaches 6 destinations, the drawer defines 6 | pass |
| Without scripting | both menus open natively, 4 destinations paint with two open at once, and the page does not scroll sideways | pass |
| Phone | the bar is gone below 900px, the drawer takes over, 6 of 6 destinations paint once its groups are opened, no sideways scroll | pass |
| Blazor | `ConsoleTopNav.razor` compiles, 0 errors | pass |
| Gate 20 negative test | removing Terminals from the bar only, leaving the drawer intact, reports `NAVREACH ... 1 destination(s) unreachable from the top bar: terminals.html`; restored clean | pass |
| Layout audit | 86 pages x 2 widths, 0 findings | pass |
| Full suite | all gates pass at kit 0.8.0, constitution 1.16.0 | pass |

## Three defects, each found by looking rather than by measuring

1. **A menu that reported itself open and painted nothing.** `.topnav__inner`
   carried `overflow-x: auto`. An absolutely positioned dropdown whose containing
   block sits inside a scroll container is clipped by it, because `overflow-x:
   auto` forces `overflow-y` to `auto` rather than leaving it visible. The
   behavioural suite passed because it read `details.open` and computed
   `overflow-y`. The screenshot showed an accented trigger, a rotated chevron and
   no menu. The strip now wraps instead of scrolling, which also serves the
   reachability requirement better than a scroller.
2. **Gate 16 fired against the new shell.** The icon rail rule assumed every
   console has a side navigation to collapse. A top-bar console has none at
   desktop width by design. The gate and the constitution now name the shell the
   rule governs, and gate 20 covers the other shell.
3. **Gate 20 fired on a documentation page.** The catalog shows both shells as
   illustrative fragments, so the new check compared one demo against another and
   called a docs link a lost destination. Gates 12 and 13 learned this in feature
   008; the new gate had to be scoped to a real console shell the same way.

## Known limitation

The demo's menus hold three destinations and one, so the case of a menu taller
than the viewport is covered by the pattern's `max-height` and `overflow-y: auto`
rather than exercised against a long menu. A console with a long section menu
should check that case on its own screens.

## What was NOT changed

The side-navigation shell, its rail, its drawer, and every other console pattern
are untouched. Nothing existing changes shell. The `.toggle44` class kept working
when it was renamed in feature 011, and the same courtesy applies here: opting
into this shell is adding one class, and opting out is removing it.
