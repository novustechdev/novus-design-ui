---

description: "Task list for feature 011: resolving three contradictions in the kit"
---

# Tasks: Resolving three contradictions in the kit (feature 011)

**Input**: Design documents in `specs/011-resolve-rule-conflicts/`

**Tests**: no unit suite. Verification is the gate suite with both new gate
behaviours negative-tested, the layout audit before and after, and the preserved
reproduction from feature 010.

**Organization**: grouped by user story.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Add a permanent reproduction fixture for the overflow (a minimal page carrying `.sr-only` inside `.tablewrap`) somewhere the layout audit sees it, so the regression cannot depend on a scratch directory

---

## Phase 2: Foundational (blocks verification of every story)

- [X] T002 Teach `scripts/layout-audit.mjs` to audit a directory or URL other than `site/dist`, since User Story 1's reproduction, User Story 4's consumer check and the release runs all need it

---

## Phase 3: User Story 1 - A screen built by the book passes the gates (P1)

**Goal**: the confirmed overflow mechanism is fixed at its source.

**Independent test**: the preserved converted screen measures no horizontal scroll at 375px.

- [X] T003 [US1] Make `.tablewrap` a containing block in `admin-kits/shared/novus-admin.css`, so absolutely positioned descendants stop escaping its clip
- [X] T004 [US1] Regenerate every flavor copy and the packaged `console.css` through `admin-kits/data/generate.mjs`
- [X] T005 [US1] Confirm the fixture and the preserved screen report no OVERFLOW at 375px, and that `documentElement.scrollWidth` matches the viewport
- [X] T006 [US1] Negative-test: remove the line, rebuild, confirm the audit reports OVERFLOW and names the page, then restore
- [X] T007 [P] [US1] Document the trade-off in the catalog's table page and in `agents/rules.mjs`: a popover inside a scrolling table must render outside the wrap, because the wrap now clips it

**Checkpoint**: the defect that reached a consumer is closed.

---

## Phase 4: User Story 2 - The target rule matches what the kit ships (P1)

**Goal**: 44px stops being aspirational. 103 violations at 375px go to zero, and a gate keeps them there.

**Independent test**: the audit reports zero TARGET findings at 375px across every demo page.

- [X] T008 [US2] Add a TARGET finding to `scripts/layout-audit.mjs`: at 375px, every visible interactive control measures at least 44px
- [X] T009 [US2] Add gate 19 to `scripts/gates.sh`, reporting the audit's TARGET findings, worded like the existing gates
- [X] T010 [US2] Add the phone-width target floor to the console layer for the control set that breaks it (`btn--sm`, `input`, `select`, `summary`, chips and row actions), keeping desktop density and the existing `pointer: coarse` rule
- [X] T011 [US2] Reviewed the per-context 44px rules: KEPT. Measurement showed almost all of the eighteen are deliberate sizing at every width (sign-in card controls, paginator buttons, filter triggers), not phone-width compensation, so removing them would shrink desktop controls to satisfy a rule that governs only the phone baseline. The three `pointer: coarse` rules are kept as belt-and-braces for touch laptops, which a width query cannot see. Recorded in the verification record
- [X] T012 [P] [US2] Give the 44px utility a name that says what it does rather than where it was first used, keeping the current class working so nothing in flight breaks
- [X] T013 [US2] Correct the `targets` rule in `agents/rules.mjs` so its text, its `enforcedBy` and Principle IV say one thing, and regenerate the agent files
- [X] T014 [US2] Confirm the count: 103 TARGET findings before, zero after, across all demo pages at 375px
- [X] T015 [US2] Negative-test gate 19: remove the floor, confirm the failures return and are named, restore

**Checkpoint**: an accessibility rule that was never enforced is now enforced.

---

## Phase 5: User Story 3 - One answer about what sits at the far right (P2)

- [X] T016 [US3] Amend `.specify/memory/constitution.md` to 1.15.0: add gate 19, and record the deliberate divergence from the upstream token file's section 4c, naming what it diverges from and why, with a Sync Impact Report
- [X] T017 [P] [US3] Carry the same note into the brand documentation on the site, where a reader comparing the two will meet it

---

## Phase 6: User Story 4 - The instruction to check is followable (P2)

- [X] T018 [US4] Document how a consumer or an agent runs the kit's own content-fit, overflow and target checks against their project
- [X] T019 [US4] Update the rules so an agent that cannot render a page says so plainly instead of claiming the check passed, and regenerate

---

## Phase 7: Polish and delivery

- [X] T020 Rebuild every deliverable and confirm the full gate suite passes
- [X] T021 Record the verified run in `specs/011-resolve-rule-conflicts/checklists/verification.md`, including the before and after target counts and the overflow reproduction
- [X] T022 Release paperwork: version bump, CHANGELOG, README if needed
- [X] T023 Update `memory/project_state.md` and the session handover
- [X] T024 Commit as sgultom99 and open the pull request

---

## Dependencies

- T002 unblocks T005, T006 and T018.
- T003 to T007 are independent of Phase 4 and can ship alone.
- T008 and T009 must precede T014 and T015; T010 must precede T011.
- T016 depends on gate 19 existing (T009).
- T013 and T019 both edit `agents/rules.mjs` and must not run in parallel.

## Parallel opportunities

- T007, T012 and T017 touch different files from the tasks around them.
- Phase 3 and Phase 4 are independent of each other once T002 lands.

## Implementation strategy

MVP is User Story 1: it closes a defect that already reached a consumer, and it
is one line plus a regression check. User Story 2 is the larger piece and the
more valuable one, because it turns a rule the kit has broken since ratification
into something the gates enforce. Stories 3 and 4 are documentation and
packaging, and can follow in the same release.
