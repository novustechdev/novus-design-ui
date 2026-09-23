# Implementation Plan: A top-navigation console shell

**Branch**: `feature/012-topnav-console-shell` | **Date**: 2026-09-23 | **Spec**: [spec.md](spec.md)

## Summary

Admit a second console shell whose primary navigation is a top bar with menus
that open on click. The decisive fact is that the kit already describes its
navigation once, in a shared `NAV` definition that the generator renders into
static HTML and into Razor. A top bar becomes a third rendering of that same
definition rather than a second navigation to maintain, which is what keeps this
inside the single-source rule instead of doubling the surface that can drift.

Phone behaviour is not reinvented: below the desktop breakpoint the top-bar shell
shows the drawer the side-navigation shell already ships, emitted from the same
definition, so there is one phone navigation in the kit and one thing to verify.

## Technical Context

**Language/Version**: CSS (token-only), HTML, Razor on .NET 10, Node 20

**Primary Dependencies**: none added

**Testing**: `scripts/gates.sh`, `scripts/layout-audit.mjs` (new reachability
check, negative-tested), verified runs at 1440px, 900px and 375px with scripting
on and off

**Target Platform**: the published console layer and the reference applications

**Constraints**: `tokens.css` frozen; one source for console patterns with the
parity gate; the account menu stays last (gate 12); 44px at the phone baseline
(gate 19); no em dashes; every internal link resolves

**Scale/Scope**: 1 new pattern section, 2 generator emitters, 1 new gate, 1
catalog component, 1 demo screen, 1 constitution amendment

## Constitution Check

| Principle | Status | Note |
|---|---|---|
| I. Token-first | PASS | No new values. The bar and its strip already exist in the master token file. |
| II. Monochrome near-flat | PASS | No gradients, accent marks the current section only. |
| III. Component library | PASS | A documented catalog component with its markup published, so no consumer reverse engineers it from class names. |
| IV. Accessibility | PASS | Click not hover, native details so it works without scripting, keyboard operable, Escape closes and returns focus, current section exposed, 44px targets. |
| V. Brand and copy | PASS | Copy rules unchanged. |
| VI. Framework-agnostic | PASS | Emitted for the static flavors and for Razor from one definition. |
| VII. Reference applications | AMEND | Principle VII requires every flavor to ship the side-navigation shell. It becomes a choice of two documented shells, with the side navigation remaining the default. |
| VIII. Mobile parity | N/A | No mobile foundation change. |
| Governance | AMEND | Gate 20 (every destination reachable in a top-bar console) joins the list, so the constitution goes to 1.16.0. |

## Approach

### 1. One definition, three renderings

`NAV` already describes ungrouped destinations and groups of destinations, and
`navHtml` and `navRazor` render it. Add `navbarHtml` and `navbarRazor` that
render the same array as a horizontal strip: an ungrouped entry becomes a link,
a group becomes a `details[data-dismiss]` whose summary is the section and whose
contents are its destinations. A group whose items include the current page
carries the current marking on its summary, the same test `navHtml` already uses
to decide which group is open.

### 2. Shell composition

The header is unchanged, so the account menu stays last and gate 12 keeps
holding. The strip sits below the header at desktop width. The shell also emits
the existing drawer markup, and CSS decides which is shown: the strip above the
breakpoint, the drawer below it. Nothing about the drawer changes.

### 3. Menus on click, without scripting

`details[data-dismiss]` is the mechanism the account menu and the filter sheet
already use. The shared script closes an open menu on an outside press and on
Escape, and returns focus to its trigger. With scripting unavailable the menus
still open, and more than one can be open at once, which the layout must
tolerate.

### 4. Surplus destinations

`.appnav__inner` already scrolls horizontally in the master token file, and the
documentation site's own bar wraps to a second row and scrolls below 900px, both
measured. The shell keeps every top-level item rendered rather than hiding any
behind a scripted overflow menu, because an overflow menu that needs scripting
would fail the no-scripting requirement. The designed range (up to about nine
top-level items) keeps overflow the exception, and the guidance sends larger
information architectures to the side navigation.

### 5. Gate 20, reachability

The audit already opens dismissable menus in its second pass. In a top-bar
console it collects every destination reachable from the strip, including inside
opened menus, and compares that set with the destinations in the same page's
drawer navigation. The drawer is rendered from the same definition, so it is the
reference: if the strip can reach fewer, a destination has been lost and the gate
fails naming it. This is the top-bar analogue of gate 16.

### 6. Documentation and demonstration

A catalog component (`top-navigation`) with its markup and states, a section in
the Admin Kit page on choosing between the two shells, a rule in the agent rule
source so an agent picks correctly, and one flavor demonstrating the shell on a
real screen.

## Project Structure

```text
admin-kits/shared/novus-admin.css   # @pattern top-navigation
admin-kits/data/generate.mjs        # navbarHtml, navbarRazor, a SHELL marker
scripts/layout-audit.mjs            # NAVREACH finding
scripts/gates.sh                    # gate 20
site/components.json                # the top-navigation entry
site/src/components/top-navigation.html
site/src/admin-kit.html             # choosing between the shells
agents/rules.mjs                    # the choice, as a console rule
.specify/memory/constitution.md     # 1.16.0
```

**Structure Decision**: everything lands in an existing single source. The new
shell is a pattern section and two emitters, not a parallel system.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| A second console shell | The owner admitted it for dense, many-role admin surfaces, and a consumer is blocked on it | Forcing every console onto the side navigation would push that consumer into a divergent one-off, which is the outcome Principle III exists to prevent |
| The shell emits both a strip and a drawer | Phone behaviour stays literally shared with the other shell | A second phone navigation would double what has to be verified, and the drawer is already correct |
