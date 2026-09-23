---

description: "Task list for feature 010: adopting the kit with an AI coding agent"
---

# Tasks: Adopting the kit with an AI coding agent (feature 010)

**Input**: Design documents in `specs/010-agent-adoption-guide/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: no unit test suite. Verification is the gate suite with the new gate
negative-tested, the layout audit on the new page, and a packed-tarball install,
as set out in quickstart.md.

**Organization**: grouped by user story so each ships independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on unfinished work)
- **[Story]**: the user story this serves

---

## Phase 1: Setup

**Purpose**: the directory the rest of the feature lives in

- [X] T001 Create `agents/` at the repository root with `rules.mjs` and `generate.mjs`, per the structure in `specs/010-agent-adoption-guide/plan.md`

---

## Phase 2: Foundational (blocks every story)

**Purpose**: the single source every output is rendered from. Nothing else can start until the rule set exists.

- [X] T002 Write the rule set in `agents/rules.mjs`: each rule with `id`, `text`, `scope` (`always` or `console`), `why` and `enforcedBy`, covering token-first values, no gradients, the single-line content rule, the light default, 44px targets, reduced motion, and the console rules (shell, icon rail on collapse, sign-in ground, filter bar, paged list, page header)
- [X] T003 Add the artifact list to `agents/rules.mjs`, derived from `package.json` so a prompt can never name a path the release does not ship
- [X] T004 Add the three prompt recipes (`adopt`, `convert-screen`, `audit-screen`) to `agents/rules.mjs`, each rendering the artifact list and the rules it carries
- [X] T005 Write `agents/generate.mjs` using the console generator's `emit` and `--check` discipline from `admin-kits/data/generate.mjs`, stamping each output with the release read from `package.json`

---

## Phase 3: User Story 1 - Adopt the kit in an app that already exists (P1)

**Goal**: a reader reaches the guidance from the top navigation and copies a prompt that works.

**Independent test**: from the docs home at 1440px and 375px, reach the page in one click, and confirm the adopt prompt names only artifacts in the release.

- [X] T006 [US1] Create `site/src/agents.html`: the order of work (install, wire in, adopt the console layer, convert one screen, check the result) and how to check what the agent produced
- [X] T007 [US1] Register the page in the root-page loop and the navigation key list in `site/build.mjs`
- [X] T008 [US1] Add the top navigation entry in `site/src/partials/header.html`
- [X] T009 [US1] Render the `adopt` and `audit-screen` prompts into the page from `agents/rules.mjs` in `site/build.mjs`, so the page and the files cannot disagree
- [X] T010 [US1] Keep the page inside the copy rules: no em dashes, and the banned product-category word never printed literally (phrase the rule around it, as gate 1 requires for "no gradients")
- [X] T011 [US1] Verify: the entry resolves at every depth and is marked current, long prompt blocks scroll inside their own container, and `node scripts/layout-audit.mjs --only agents.html` reports 0 findings at 1440px and 375px

**Checkpoint**: the page ships on its own, even with no packaged files yet.

---

## Phase 4: User Story 2 - Give my agent the rules permanently (P1)

**Goal**: four files in the package, each in the format its agent reads.

**Independent test**: install the packed artifact into a blank project and find all five files at the contract's paths.

- [X] T012 [P] [US2] Generate `agents/AGENTS.md` (plain Markdown, no frontmatter) and `agents/claude/CLAUDE.md`, both carrying every rule in labelled scope sections
- [X] T013 [P] [US2] Generate `agents/copilot/copilot-instructions.md` (the `always` rules) and `agents/copilot/novus-design-kit.instructions.md` (the `console` rules, with the required `applyTo` glob frontmatter)
- [X] T014 [P] [US2] Generate `agents/cursor/novus-design-kit.mdc` with `description`, `globs` and `alwaysApply` frontmatter, since a plain `.md` in `.cursor/rules` is ignored
- [X] T015 [US2] Ship them: add `agents/` to `files` and `"./agents/*"` to `exports` in `package.json`, per `specs/010-agent-adoption-guide/contracts/agent-files.md`
- [X] T016 [US2] Add the install table to `site/src/agents.html`: for each agent, the package path and where the consumer copies it
- [X] T017 [US2] Verify with `npm pack` into a blank project that all five files arrive, each naming its release, and that no two outputs contradict each other (they can load together: Claude Code reads AGENTS.md when no CLAUDE.md is present)

**Checkpoint**: the rules now survive past the first conversation.

---

## Phase 5: User Story 3 - Convert a screen that was built by hand (P2)

**Goal**: the conversion prompt rebuilds a hand-rolled screen on the console patterns.

**Independent test**: copy the prompt and confirm it names the console layer, the patterns, and the self-check.

- [X] T018 [US3] Render the `convert-screen` prompt into `site/src/agents.html`, naming `console.css`, the console patterns, and how the agent should check its own work

---

## Phase 6: User Story 4 - The rules stay in step (P3)

**Goal**: drift is a build failure, not a discovery.

**Independent test**: hand edit a generated file and watch the gates fail by name.

- [X] T019 [US4] Add gate 18 to `scripts/gates.sh`, running `node agents/generate.mjs --check`, worded like gate 10
- [X] T020 [US4] Extend the audited path list in `scripts/gates.sh` so the copy gates cover `agents/`, which a new top-level directory would otherwise escape
- [X] T021 [US4] Negative-test both: hand edit a generated file (gate 18 fails naming it), put an em dash in one (the copy gate fails), then restore and confirm both pass
- [X] T022 [US4] Amend `.specify/memory/constitution.md` to 1.14.0: gate 18 joins the enumerated list, with a Sync Impact Report

---

## Phase 7: Polish and delivery

- [X] T023 Rebuild everything and confirm the full gate suite passes
- [X] T024 Verified run recorded in `specs/010-agent-adoption-guide/checklists/verification.md`, including the packed-install check and, for SC-007, an agent given the adopt prompt against a small sample application whose result passes the kit's own layout audit
- [X] T025 Release paperwork: version bump, CHANGELOG entry, and a README section naming the agent files, keeping the version-agreement gate satisfied
- [X] T026 Update `memory/project_state.md` and the session handover
- [X] T027 Commit as sgultom99 and open the pull request

---

## Dependencies

- Phase 2 blocks everything: no output exists before the rule set does.
- US1 depends on T002 to T005; US2 depends on T002 to T005; US3 depends on T004 and on the page from US1; US4 depends on generated files existing (T012 to T014).
- T015 (`package.json`) must land before T017 (the packed install).
- T022 (constitution) is independent of the page and can run any time after T019.

## Parallel opportunities

- T012, T013 and T014 write different files from the same source and run together.
- T008 (header partial) and T006 (page content) touch different files.
- T025 and T026 are independent of each other.

## Implementation strategy

MVP is User Story 1: the page alone answers the owner's request and ships
without the packaged files. User Story 2 is what makes it durable, and should
follow in the same release. Stories 3 and 4 layer on top: the conversion prompt
is content, and the parity gate protects everything already built.
