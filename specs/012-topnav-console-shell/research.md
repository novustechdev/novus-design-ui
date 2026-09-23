# Research: a top-navigation console shell (feature 012)

Measured or read in this session, not assumed.

## R1. The kit already describes its navigation once

`admin-kits/data/generate.mjs` holds a single `NAV` array of ungrouped entries
and groups. `navHtml(current)` renders it as the console's side navigation and
`navRazor()` renders the same array for Blazor, including the rule that a group
is open when it contains the current page. A top bar is therefore a third
rendering of an existing definition.

**Decision**: add `navbarHtml` and `navbarRazor`. Do not introduce a second
navigation description.

## R2. The primitives exist and are sanctioned upstream

`tokens.css` (frozen, the upstream master) defines `.appbar`, `.appnav` and
`.appnav__inner`, the last with `overflow-x: auto`. The documentation site runs
on them. A top application bar is therefore already part of the master kit, not
an invention of this repository.

## R3. Click menus are already the kit's mechanism

`details[data-dismiss]` drives the account menu and the filter sheet. The shared
progressive script closes an open one on an outside press and on Escape. Because
`details` is native, the menus open without scripting. The hover ban in
Principle IV concerns hover, not top bars, so it raises no objection here.

## R4. What a narrow top bar actually does today

Measured on the documentation site with eight entries: at 1440px and 900px the
bar is one row; at 600px, 375px and 320px it wraps to two rows and the strip is
scrollable (scroll width 707 against a 375px client width). Adding an eighth
entry did not cause the wrap, seven wrapped too.

**Consequence**: a scrolling strip is a real mechanism but not a visible
affordance. Rather than add a scripted overflow menu, which would fail the
no-scripting requirement, the shell keeps every top-level item rendered, hands
phone widths to the drawer, and the guidance keeps information architectures
inside the range a bar can hold.

## R5. The range a top bar holds

Roughly five to nine top-level items before structure starts hiding behind
menus, against a side rail that shows every destination at once. The requesting
team was asked to record their top-level count and menu depth. The guidance will
name the range and say plainly when to choose the side navigation instead, so
the decision is documented rather than left to taste.

## R6. The gate has a free reference

The audit's second pass already opens dismissable menus. In a top-bar console
the shell emits both the strip and the drawer from the same definition, so the
drawer's destination set is the correct answer, and the strip can be checked
against it without declaring an expected count anywhere. A mismatch means a
destination was lost.

## R7. Catalog bookkeeping

`site/components.json` entries carry `id`, `name`, `category`, `classes`,
`fragment`, `summary` and `css` (the `@pattern` sections to render). The gates
check manifest against fragment against built page, and that every class block in
the stylesheet is owned by exactly one entry, so the new pattern needs its own
`@pattern top-navigation` section and a matching entry.
