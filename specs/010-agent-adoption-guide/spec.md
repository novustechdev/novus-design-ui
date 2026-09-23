# Feature Specification: Adopting the kit with an AI coding agent

**Feature Branch**: `feature/010-agent-adoption-guide` (feature 010)

**Created**: 2026-09-23

**Status**: Draft

**Input**: Owner request: "I want u put also how to prompt in claude code or
copilot or code to use this ui kit and implement it to existing project, u can
add new menu topbar and put guidance proper skill prompt for each llm provider"

## What changes

Most teams meet this kit through an AI coding agent, and today the kit says
nothing about that. A developer who asks an agent to "use the Novus kit" gets
whatever the agent guesses, which is how portals end up reinventing patterns the
package already ships.

Two deliverables:

1. **A documented route, reachable from a new entry in the site's top
   navigation.** It says what to tell an agent, in what order, and how to check
   what came back, with prompts a reader copies as they are.
2. **Instruction files for four agents, shipped inside the package.** A consumer
   copies one into their repository and their agent inherits the kit's rules,
   then keeps inheriting them by upgrading the package. The four files are
   generated from one source, so the rules cannot drift between providers, or
   between the files and the documentation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Adopt the kit in an app that already exists (Priority: P1)

A developer with a running application opens the docs, finds the new entry in
the top navigation, and copies a prompt that tells their agent to install the
package, wire the stylesheet and the theme script, and convert one screen
without inventing values the tokens already define.

**Why this priority**: it is the request, and it is the moment where a portal
either inherits the kit or starts diverging from it.

**Independent Test**: from the docs home on desktop and on a phone, reach the
page in one click, copy the adoption prompt, and confirm it names only artifacts
that exist in the current release.

**Acceptance Scenarios**:

1. **Given** the docs site, **When** a reader looks at the top navigation,
   **Then** a labelled entry leads to the guidance, and it is marked as the
   current page once opened.
2. **Given** the page, **When** a reader follows it top to bottom, **Then** it
   states the order of work: install, wire in, adopt the console layer, convert
   one screen, then check the result.
3. **Given** the adoption prompt, **When** it is read, **Then** it names the
   package, the stylesheet, the console layer, the theme and console scripts and
   the icon sprite by their real published paths.
4. **Given** any prompt on the page, **When** it is read, **Then** it carries the
   kit's non-negotiable rules, including token-first values, no gradients, short
   content on one line, the light default, the icon rail on collapse, sign-in on
   the near-white ground, 44px targets and reduced-motion behaviour.

---

### User Story 2 - Give my agent the rules permanently (Priority: P1)

A team lead copies one file from the installed package into their repository.
From then on their agent follows the kit's rules without anyone restating them,
and a package upgrade brings the updated rules with it.

**Why this priority**: a prompt is a single conversation; a file in the
repository is the standing instruction. This is what makes the guidance survive
past the first session.

**Independent Test**: install the packed artifact into a blank project, confirm
all four files are present at their documented locations, and confirm each one
carries the same rules.

**Acceptance Scenarios**:

1. **Given** the installed package, **When** a consumer looks for agent files,
   **Then** files exist for Claude Code, GitHub Copilot, Cursor and the
   cross-tool convention, each in the format that agent reads.
2. **Given** the page, **When** a reader wants to install one, **Then** the page
   says the path each file belongs at inside their repository.
3. **Given** all four files, **When** their rules are compared, **Then** they
   state the same rules, differing only in the format each agent requires.
4. **Given** a file, **When** it is opened, **Then** it names the kit release it
   describes, so a reader can tell when it is out of date.

---

### User Story 3 - Convert a screen that was built by hand (Priority: P2)

Someone with a hand-rolled admin screen copies the conversion prompt, and the
agent rebuilds the screen on the console patterns: the shell, the side
navigation with its icon rail, the filter bar, the paged list and the page
header, instead of new one-off markup.

**Why this priority**: this is the highest-value conversion, and the one that
caused the feedback rounds behind features 007 and 008.

**Independent Test**: copy the conversion prompt and confirm it names the
console patterns and the rules a converted screen has to satisfy.

**Acceptance Scenarios**:

1. **Given** the conversion prompt, **When** it is read, **Then** it names the
   console layer and the patterns a console screen is built from.
2. **Given** the conversion prompt, **When** it is read, **Then** it tells the
   agent how to check its own work against the kit's rules.

---

### User Story 4 - The rules stay in step (Priority: P3)

A maintainer changes a rule once. The documentation page and all four agent
files change with it, and a release cannot ship them out of step.

**Why this priority**: the kit already learned this lesson with the console
layer. Four hand-maintained copies of the same rules would diverge within a
release or two.

**Independent Test**: edit one generated file by hand and confirm the release
gates fail by name; restore and confirm they pass.

**Acceptance Scenarios**:

1. **Given** the repository, **When** the rules are changed, **Then** they are
   changed in one place and every provider file is regenerated from it.
2. **Given** a hand-edited provider file, **When** the gates run, **Then** they
   fail and name the file that drifted.

### Edge Cases

- An agent that reads none of the four formats: the cross-tool file is the
  fallback, and the page's prompts work in any chat window.
- A consumer pinned to an older release: each file names the release it came
  from, so stale rules are visible rather than silent.
- A rule that only applies to console screens: the files separate rules that
  apply everywhere from rules that apply to console screens, so a marketing page
  is not told to grow a side navigation.
- Prompts must carry no credentials, no private hostnames and no client names.
- The page carries long prompt blocks: they scroll inside their own container
  rather than pushing the page sideways at 375px.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The docs site MUST gain a top navigation entry leading to the
  guidance, resolving at every depth and marked as current when open.
- **FR-002**: The page MUST state the order of work for adopting the kit in an
  existing application, and how to check the result.
- **FR-003**: The page MUST carry at least three prompts a reader can copy
  without editing: adopt the kit in an existing application, convert a
  hand-built admin screen to the console patterns, and audit an existing screen
  against the kit's rules.
- **FR-004**: Every prompt MUST name only artifacts that exist in the current
  release, by their published paths.
- **FR-005**: Every prompt MUST carry the kit's non-negotiable rules.
- **FR-006**: The package MUST ship agent instruction files for Claude Code,
  GitHub Copilot, Cursor and the cross-tool convention, each in that agent's
  own format, listed in the package manifest so they install with the package.
- **FR-007**: All four files and the rules shown on the page MUST be generated
  from one source in the repository. Hand editing a generated file is a defect.
- **FR-008**: Release gates MUST fail when a generated agent file differs from
  its source, and the check MUST be negative-tested.
- **FR-009**: The page MUST say where each provider's file belongs inside a
  consumer's repository.
- **FR-010**: Each generated file MUST name the kit release it describes.
- **FR-011**: The page MUST obey the existing copy and layout rules: no em
  dashes, no use of the word SaaS, every internal link resolving, and no layout
  audit findings at 1440px or 375px.
- **FR-012**: The feature MUST be verified in a real run, including the built
  page and an install of the packed artifact into a blank project.
- **FR-013**: The feature MUST NOT change `tokens.css` or any console pattern.

### Key Entities

- **Rule set**: the single source holding the kit's rules, each rule marked as
  applying everywhere or only to console screens.
- **Agent profile**: one supported agent, its file format, and the path that
  file belongs at in a consumer repository.
- **Prompt recipe**: one copyable prompt, its purpose, and the rules it carries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reader reaches the guidance in one click from the top navigation
  at 1440px and at 375px, and the entry is marked as the current page.
- **SC-002**: A blank project installing the packed artifact finds all four
  agent files, each at its documented path inside the package.
- **SC-003**: All four files and the page state the same rules; changing a rule
  in the source changes all five outputs in one regeneration.
- **SC-004**: Hand editing any generated agent file fails the release gates by
  name, and passes again once restored.
- **SC-005**: The three prompts name only artifacts present in the release, and
  carry every non-negotiable rule.
- **SC-006**: All gates pass, including the new one, with no layout audit
  findings on the new page at either width.
- **SC-007**: An agent given the adoption prompt against a small sample
  application produces a screen that passes the kit's own layout audit, with the
  run recorded in the verification record.

## Assumptions

- "code" in the owner's request means coding agents generally, so the cross-tool
  file covers agents beyond the three named ones.
- Consumers copy the file they want into their repository. The package does not
  write into a consumer's repository during install, because a package that
  edits its host's configuration without being asked is a bad neighbour.
- Rules are text, not enforcement. The kit's own gates remain the enforcement,
  and the prompts point at them.
- The four formats named are the ones these agents read today. If an agent
  changes its convention, that is a content change to one profile, not a
  redesign.
- No new tokens, components or console patterns are introduced by this feature.
