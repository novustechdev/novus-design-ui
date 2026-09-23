---

description: "Task list for feature 012: a top-navigation console shell"
---

# Tasks: A top-navigation console shell (feature 012)

**Input**: Design documents in `specs/012-topnav-console-shell/`

**Tests**: no unit suite. Verification is the gate suite with the new gate
negative-tested, the layout audit at three widths, and runs with scripting
disabled, as set out in quickstart.md.

**Organization**: grouped by user story.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Add the `@pattern top-navigation` section to `admin-kits/shared/novus-admin.css`. It must exist before any catalog entry references it, because the site build throws on an unknown pattern name

---

## Phase 2: Foundational (blocks every story)

**Purpose**: one navigation definition renders as a strip. Nothing else can start until it does.

- [X] T002 Add `navbarHtml(current)` to `admin-kits/data/generate.mjs`, rendering the existing `NAV` array as a horizontal strip: an ungrouped entry becomes a link, a group becomes a `details[data-dismiss]` whose summary is the section and whose contents are its destinations
- [X] T003 Add `navbarRazor()` mirroring it for both Blazor projects, using the same `NAV` and the same current-section test `navRazor` already uses
- [X] T004 Emit the top-bar shell between its own SHELL marker, emitting the strip AND the existing drawer from the same definition, so phone behaviour is shared rather than duplicated

---

## Phase 3: User Story 1 - Move around a console from the top bar (P1)

**Independent test**: at 1440px each menu opens on click, one at a time, Escape closes it, and the current section stays marked.

- [X] T005 [US1] Style the strip and its menus in the top-navigation pattern: click to open, accent on the current section, and the menu surface using the kit's existing raised surface treatment
- [X] T006 [US1] Keyboard and assistive technology: every item and destination reachable by keyboard, the open state exposed, Escape closing the menu and returning focus to its trigger
- [X] T007 [US1] Verify at 1440px: each top-level item opens its menu on click, only one menu is open at a time, Escape restores focus, and a current page inside a closed menu still marks its section

**Checkpoint**: the shell is usable on its own.

---

## Phase 4: User Story 2 - Nothing is lost, at any width or without scripting (P1)

**Independent test**: every destination reachable at 1440px, 900px and 375px, with scripting on and off.

- [X] T008 [US2] Show the strip above the desktop breakpoint and the existing drawer below it, leaving the drawer's own behaviour untouched
- [X] T009 [US2] Add a NAVREACH check to `scripts/layout-audit.mjs`: in a top-bar console, compare the destinations reachable from the strip (including inside menus opened in the audit's second pass) against the destinations in the same page's drawer, which is rendered from the same definition and is therefore the reference
- [X] T010 [US2] Add gate 20 to `scripts/gates.sh`, reported through the layout audit like gates 12 to 19
- [X] T011 [US2] Negative-test gate 20: remove a destination from the strip only, leaving the drawer intact, confirm the gate fails naming it, then restore
- [X] T012 [US2] Verify with scripting disabled at 1440px and 375px that every destination is still reachable, and that more than one open menu does not break the layout
- [X] T013 [US2] Verify a menu with more destinations than the viewport is tall scrolls within itself rather than clipping or pushing the page sideways

**Checkpoint**: the rule that cost the kit a defect in feature 009 cannot repeat here.

---

## Phase 5: User Story 3 - Choose the right shell on purpose (P2)

- [X] T014 [US3] Write the choosing guidance on the Admin Kit page and the catalog entry: the shape each shell suits, the top-level item count beyond which the side navigation is the better choice, and why
- [X] T015 [US3] Add a console rule to `agents/rules.mjs` so an agent picks the right shell, and regenerate the agent files

---

## Phase 6: User Story 4 - Adopt it without guessing (P2)

- [X] T016 [P] [US4] Create `site/src/components/top-navigation.html` with the markup, the states, and the accessibility requirements
- [X] T017 [US4] Add the `top-navigation` entry to `site/components.json`, owning its classes so the orphan and double-ownership gates stay satisfied
- [X] T018 [US4] Demonstrate the shell on a real screen in the Tailwind flavor. Three registrations are needed: the page itself, its entry in `rollupOptions.input` in the flavor's vite config, and the generator's `PAGES` list
- [X] T019 [US4] Verify the demo builds, is linked from the Admin Kit page, and carries the provenance bar like every other demo

---

## Phase 7: Polish and delivery

- [X] T020 Amend `.specify/memory/constitution.md` to 1.16.0: a console uses one of two documented shells, the side navigation remains the default, and gate 20 joins the enumerated list, with a Sync Impact Report
- [X] T021 Rebuild every deliverable and confirm the full gate suite passes
- [X] T022 Record the verified run in `specs/012-topnav-console-shell/checklists/verification.md`, including the three widths, the scripting-off runs, and the gate 20 negative test
- [X] T023 Release paperwork: version bump, CHANGELOG, README if needed
- [X] T024 Update `memory/project_state.md` and the session handover, and tell the requesting team the pattern is available
- [X] T025 Commit as sgultom99 and open the pull request

---

## Dependencies

- T001 must precede T017: the site build throws when a manifest entry names a pattern section that does not exist.
- T002 to T004 block every story.
- T009 and T010 must precede T011.
- T018 needs all three registrations or the page silently fails to build.
- T015 and any other edit to `agents/rules.mjs` must not run in parallel with each other.
- T020 depends on gate 20 existing (T010).

## Parallel opportunities

- T016 is independent of the generator and gate work.
- T005 and T006 touch the pattern section together and should not be split across parallel edits.
- Phase 5 and Phase 6 are independent of each other once Phase 4 lands.

## Implementation strategy

MVP is User Stories 1 and 2 together: a top bar that works and loses nothing is
the whole commitment made to the requesting team, and it can ship before the
guidance and the catalog entry are written. Story 4 is what lets anyone else use
it, and Story 3 is what stops the kit acquiring two shells and no opinion about
when to use which.
