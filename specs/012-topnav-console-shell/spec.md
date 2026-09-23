# Feature Specification: A top-navigation console shell

**Feature Branch**: `feature/012-topnav-console-shell` (feature 012)

**Created**: 2026-09-23

**Status**: Draft

**Input**: Request from the novabank-py team, raised as a governance question:
their digital-banking admin portal for onboarded banks' sysadmin staff wants a
topbar with click-driven dropdown menus rather than the side navigation that
collapses to an icon rail. The kit's answer was yes, as a second supported
shell, subject to conditions. Those conditions are commitments and appear below
as requirements.

## What changes

The kit ships one console shell: a grouped side navigation that collapses to an
icon rail and opens as a drawer on phones. It is a good shell, and it stays the
default. It is not the only shape an enterprise console takes.

This feature admits a second shell: primary navigation in a top bar, with menus
that open on click. It is for dense, many-role admin surfaces where a horizontal
menu bar reads as the product's spine. Everything else about a console is
unchanged: the same page header, filter bar, paged lists, settings layout,
account menu, tokens and gates.

Two shells means a choice, and a choice that is not written down becomes taste.
So this feature also documents when to pick which.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Move around a console from the top bar (Priority: P1)

An operator opens a console whose navigation lives in the top bar. They press a
top-level item, its menu opens, they pick a destination. The section they are in
stays marked while they work, including when its menu is closed.

**Why this priority**: it is the feature. If the menu bar is awkward to use, the
shell has no reason to exist.

**Independent Test**: at 1440px, press each top-level item, confirm its menu
opens on click, pick a destination, and confirm the section stays marked.

**Acceptance Scenarios**:

1. **Given** the console at desktop width, **When** a top-level item is pressed,
   **Then** its menu opens and lists that section's destinations.
2. **Given** an open menu, **When** another top-level item is pressed, **Then**
   the first menu closes and the second opens, so only one is open at a time.
3. **Given** an open menu, **When** Escape is pressed or a press lands outside
   it, **Then** it closes and focus returns to the item that opened it.
4. **Given** a keyboard, **When** the menu bar is reached by tabbing, **Then**
   every top-level item and every destination can be reached and activated
   without a pointer, and the open state is exposed to assistive technology.
5. **Given** a destination inside a closed menu is the current page, **When** the
   bar renders, **Then** that top-level item carries the current marking.
6. **Given** any control in the shell, **When** it is measured, **Then** it obeys
   the same rules every console obeys: nothing to the right of the account menu,
   44px targets at the phone baseline, short content on one line.

---

### User Story 2 - Nothing is lost, at any width or without scripting (Priority: P1)

Whatever the window size, and whether or not scripting runs, every destination
remains reachable.

**Why this priority**: this is the top-bar equivalent of the rule that a
collapsed side navigation must leave a rail of icons rather than nothing. The
kit already learned this lesson once.

**Independent Test**: at 1440px, 900px and 375px, with scripting on and off,
confirm every destination can still be reached.

**Acceptance Scenarios**:

1. **Given** more top-level items than the bar can show at a given width,
   **When** it renders, **Then** the surplus stays reachable rather than
   disappearing, and the means of reaching it is visible.
2. **Given** a phone width, **When** the menu is opened, **Then** the shell uses
   the same drawer the side-navigation shell already uses, so phone behaviour is
   shared rather than reinvented.
3. **Given** scripting is unavailable, **When** a top-level item is pressed,
   **Then** its menu still opens and its destinations are still reachable.
4. **Given** a menu with more destinations than the viewport is tall, **When** it
   opens, **Then** it scrolls within itself rather than clipping or pushing the
   page sideways.
5. **Given** any width, **When** the release gates run, **Then** a gate fails if
   a destination is unreachable.

---

### User Story 3 - Choose the right shell on purpose (Priority: P2)

Someone starting a console reads which shell to use and why, and can tell which
one fits their information architecture before they build anything.

**Why this priority**: without it, two shells become a coin toss, and consoles
across the company diverge for no stated reason.

**Independent Test**: read the guidance and correctly place three example
consoles of different shapes.

**Acceptance Scenarios**:

1. **Given** the documentation, **When** a reader looks for the choice, **Then**
   it names the shape each shell suits, including the point at which a top bar
   stops working well.
2. **Given** a console with more top-level areas than the top bar is designed
   for, **When** the guidance is followed, **Then** it recommends the side
   navigation instead, and says why.

---

### User Story 4 - Adopt it without guessing (Priority: P2)

A team building on the kit finds the shell documented with its markup, and a
running demo, before they use it.

**Why this priority**: Principle III requires a pattern to exist in the kit
before a consumer builds their own. Feature 010 showed that a pattern with no
published markup forces an agent to reverse engineer structure from class names.

**Independent Test**: build a console screen using only the catalog entry and the
shipped stylesheet.

**Acceptance Scenarios**:

1. **Given** the catalog, **When** the shell is looked up, **Then** its markup,
   its states, and its accessibility requirements are documented.
2. **Given** the reference applications, **When** the shell is demonstrated,
   **Then** at least one flavor shows it running on a real screen.
3. **Given** the shell's styles and markup, **When** the release gates run,
   **Then** they come from the single shared source and the parity gate proves
   no copy has drifted.

### Edge Cases

- A top-level item with no children behaves as a direct link, not an empty menu.
- Two menus open at once when scripting is unavailable: allowed, and the layout
  must survive it.
- A very long section label, and a right-to-left reading order.
- A section whose current page is reached by deep link rather than by pressing
  through the menu: the marking still applies.
- The bar and the account menu competing for space at narrow desktop widths.
- A console with a single top-level area, where a menu bar is pointless.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The kit MUST offer a top-navigation console shell alongside the
  side-navigation shell, which remains the default.
- **FR-002**: Menus MUST open on click and MUST NOT open on hover.
- **FR-003**: The shell MUST work when scripting is unavailable, using the same
  native mechanism the kit's other dismissable surfaces use.
- **FR-004**: Only one menu is open at a time when scripting is available, and
  Escape or a press outside closes the open menu and returns focus to its
  trigger.
- **FR-005**: Every top-level item and destination MUST be reachable and
  operable by keyboard, with the open state exposed to assistive technology.
- **FR-006**: The current section MUST stay marked, including while its menu is
  closed.
- **FR-007**: No destination may be unreachable at any width. Surplus items MUST
  remain reachable by a visible means.
- **FR-008**: Below the desktop breakpoint the shell MUST use the drawer the
  side-navigation shell already provides.
- **FR-009**: The account menu MUST remain the last element in the console
  header, with navigation to its left.
- **FR-010**: Every control MUST meet the 44px floor at the 375px baseline.
- **FR-011**: The shell's styles and markup MUST come from the single shared
  console source and be emitted by the parity generator.
- **FR-012**: Release gates MUST fail when a destination is unreachable in the
  top-navigation shell, and the gate MUST be negative-tested.
- **FR-013**: The kit MUST document how to choose between the two shells,
  including the top-level item count beyond which the side navigation is the
  better choice.
- **FR-014**: The shell MUST be documented in the catalog and demonstrated in at
  least one reference application before a consumer is expected to use it.
- **FR-015**: The shell MUST NOT require any change to `tokens.css`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 1440px, every top-level item opens its menu on click, only one
  menu is open at a time, and Escape closes it and restores focus.
- **SC-002**: With scripting disabled, every destination in every section is
  still reachable at 1440px and 375px.
- **SC-003**: At 1440px, 900px and 375px, the count of reachable destinations
  equals the count defined for the console, with none lost at any width.
- **SC-004**: The current section is marked on every screen of the demo,
  including screens whose menu is closed.
- **SC-005**: The layout audit reports no findings for the demo screens at both
  widths, including target size and content fit.
- **SC-006**: Deliberately hiding a destination fails the gates and names it.
- **SC-007**: A reader given three consoles of different shapes places each on
  the correct shell using only the published guidance.
- **SC-008**: All gates pass, including the new one, and the parity gate proves
  the shell has one source.

## Assumptions

- **The side-navigation shell stays the default.** This feature adds a choice,
  it does not migrate anything. Nothing existing changes shell.
- **Designed range**: up to about nine top-level items, with menus one level
  deep. Beyond that a top bar hides more than it shows, and the guidance will say
  to use the side navigation. novabank-py were asked for their top-level count
  and menu depth; if it exceeds this range the guidance applies to them too.
- **Phone behaviour is shared, not duplicated**: below the desktop breakpoint
  both shells present the same drawer, so there is one phone navigation to
  maintain and to verify.
- **Demonstration scope**: the shell ships in the console layer, so every flavor
  can use it, and one flavor demonstrates it on a real screen. Principle VII's
  screen parity applies to the screen set, not to every shell variant, so the
  other flavors are not required to duplicate the demo.
- **Existing primitives are reused**: the top bar and its strip already exist in
  the master token file, and the click-dismissable menu mechanism already exists
  in the console layer.
- The reference for visual polish is a well-made enterprise platform rather than
  a consumer mobile application, and it informs feel rather than features.
