# Feature Specification: Resolving three contradictions in the kit

**Feature Branch**: `feature/011-resolve-rule-conflicts` (feature 011)

**Created**: 2026-09-23

**Status**: Draft

**Input**: Owner decision after feature 010: resolve all three contradictions
the agent adoption run exposed. Evidence is recorded in
`specs/010-agent-adoption-guide/checklists/verification.md`.

## What changes

Feature 010 wrote the kit's rules down and then watched an outside agent follow
them against a real screen. Writing rules down is a good way to find out that
you do not follow them. Three contradictions came out of it, and this feature
settles each one so that the rule, the shipped code, and the gate agree.

1. The kit tells everyone that every target is at least 44px, and then ships
   controls at 29px.
2. The console header rule and a locked section of the upstream token file
   describe two different headers, and both claim to be authoritative.
3. A screen built by correctly following the kit's own adoption prompt fails the
   kit's own layout gate on a phone.

A fourth item rides along, because it is why the third went unnoticed: the rules
tell an agent to check its work at two widths, and an agent without a browser
cannot do that.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A screen built by the book passes the gates (Priority: P1)

Someone converts a screen by following the kit's adoption prompt exactly. The
result does not scroll sideways on a phone, and it passes the same layout audit
the kit runs on itself.

**Why this priority**: this is the one that reaches a real consumer as a broken
screen. Everything else is a wording problem.

**Independent Test**: reproduce with the preserved converted screen, confirm the
current failure, apply the fix, and confirm the same screen passes at 375px.

**Acceptance Scenarios**:

1. **Given** the preserved converted screen, **When** it is measured at 375px,
   **Then** the mechanism behind the sideways scroll is identified and written
   down in plain language.
2. **Given** that mechanism, **When** the cause lies in the shipped console
   layer, **Then** the layer is corrected; **When** it lies in the markup the
   consumer wrote, **Then** the requirement is stated in the rules and the
   catalog so the next reader cannot miss it.
3. **Given** the corrected screen, **When** it is audited at 1440px and 375px,
   **Then** it reports no findings.
4. **Given** the repository, **When** the gates run, **Then** a regression check
   covers this case, and it fails when the fix is reverted.

---

### User Story 2 - The target rule matches what the kit ships (Priority: P1)

A developer reads "every interactive target is at least 44px", looks at the
kit's own console, and finds the same statement true there.

**Why this priority**: a rule the kit itself breaks teaches every agent and
every reader that the rules are approximate.

**Independent Test**: measure every interactive control in all four Admin Kit
deliverables at 1440px and 375px and compare against the rule as written.

**Acceptance Scenarios**:

1. **Given** the kit's own console screens, **When** every interactive control
   is measured, **Then** each one either meets the 44px floor or falls under a
   documented, named exception.
2. **Given** the rule text shipped to agents, **When** it is read, **Then** it
   states the floor and any exception precisely enough that a reader can tell
   which applies without measuring.
3. **Given** a phone width, **When** any control is measured, **Then** it meets
   44px, with no exception.
4. **Given** the console layer, **When** the 44px floor is applied, **Then** it
   comes from one shared rule rather than being patched per context.
5. **Given** a control that breaks the floor, **When** the gates run, **Then**
   they fail and name it.

---

### User Story 3 - One answer about what sits at the far right (Priority: P2)

A designer or an agent asks what belongs at the end of a console header and gets
one answer, with the reason recorded.

**Why this priority**: it confuses anyone comparing the brand documentation with
the shipped console, but nothing renders incorrectly today.

**Independent Test**: read the constitution, the rule text and the brand
documentation, and confirm they describe the same header, with the divergence
from the upstream wording named where a reader will find it.

**Acceptance Scenarios**:

1. **Given** the shipped console header, **When** its order is compared with the
   governing documents, **Then** they agree.
2. **Given** the upstream token file's section 4c, **When** a reader follows it
   to the console, **Then** a note explains which rule governs application
   chrome and why, without the token file being edited.
3. **Given** the gate that enforces header order, **When** it runs, **Then** it
   enforces the resolved answer.

---

### User Story 4 - The instruction to check is followable (Priority: P2)

An agent told to confirm a screen at 1440px and 375px can actually do it, or is
told plainly what to do when it cannot.

**Why this priority**: the third contradiction reached a consumer precisely
because this instruction was unfollowable in practice.

**Independent Test**: with no browser available, follow the rules' check step and
see whether it produces a real answer or a guess.

**Acceptance Scenarios**:

1. **Given** a consumer project, **When** someone wants the kit's own content-fit
   and overflow checks, **Then** a documented way to run them exists.
2. **Given** an agent that cannot render a page, **When** it reaches the check
   step, **Then** the rules tell it to say so rather than claim the check passed.

### Edge Cases

- A control that is small by design and not interactive, such as a status dot,
  is not a target and is out of scope for the floor.
- A dense data grid with many row actions: whatever exception is chosen must
  still hold on a phone, where rows stack.
- The upstream token file may be updated by its owner later; the divergence note
  must say what it is diverging from, so it can be revisited.
- The overflow mechanism may turn out to be a browser behaviour rather than a
  defect in either the kit or the markup. That is still an answer, and it gets
  written down with whatever guard is possible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The mechanism behind the 375px overflow in the preserved converted
  screen MUST be identified and recorded in plain language.
- **FR-002**: Where the cause lies in the shipped console layer, the layer MUST
  be corrected; where it lies in consumer markup, the requirement MUST be stated
  in the agent rules and the catalog.
- **FR-003**: A regression check MUST cover the overflow case, and MUST fail when
  the fix is reverted.
- **FR-004**: Every interactive control in the kit's own console screens MUST
  meet the 44px floor or fall under a single named, documented exception.
- **FR-005**: At phone widths every interactive control MUST meet 44px, with no
  exception.
- **FR-006**: The 44px floor MUST be expressed once in the console layer rather
  than patched per context, and the utility that carries it MUST be named for
  what it does rather than for where it was first used.
- **FR-007**: The rule text shipped to agents MUST state the floor and its
  exception precisely, and MUST flow from the rule source through the generator.
- **FR-008**: A gate MUST fail when an interactive control breaks the floor, and
  MUST be negative-tested.
- **FR-009**: The console header order MUST be settled, stated in the
  constitution, and enforced by the existing header gate.
- **FR-010**: The divergence from the upstream token file's section 4c MUST be
  recorded where a reader comparing them will find it, naming what it diverges
  from and why. The token file MUST NOT be edited.
- **FR-011**: The kit MUST offer a documented way for a consumer or an agent to
  run the same content-fit and overflow checks the kit runs on itself.
- **FR-012**: The rules MUST tell an agent that cannot verify a rendered page to
  say so plainly instead of claiming the check passed.
- **FR-013**: All existing gates MUST continue to pass, and any rule change MUST
  reach the shipped agent files through the generator, never by hand.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The preserved converted screen, after the fix, measures no
  horizontal scroll at 375px and reports zero audit findings at both widths.
- **SC-002**: Reverting the fix makes the gates fail and name the case.
- **SC-003**: Across all four Admin Kit deliverables, at 1440px and 375px, every
  interactive control either measures at least 44px or matches the one
  documented exception, and at 375px every control measures at least 44px.
- **SC-004**: The 44px floor is defined in one place in the console layer, and
  the per-context patches are gone.
- **SC-005**: A reader following the constitution, the agent rules and the brand
  documentation finds one consistent description of the console header, with the
  divergence from the upstream wording named.
- **SC-006**: Someone with a consumer project can run the kit's content-fit and
  overflow checks against their own screens by following written instructions.
- **SC-007**: All gates pass, including every new or changed one, and each new
  gate fails when deliberately broken.

## Assumptions

These are the resolutions this specification proposes. Each is a judgement that
the owner can overturn at planning time, and each is recorded so that overturning
it is a deliberate act rather than a surprise.

- **Targets**: the floor stays 44px. The exception is dense secondary actions in
  a desktop console, which may use the small variant, provided they reach 44px at
  phone widths. The alternative, correcting the demos to stop using the small
  variant for real actions, was not chosen because the density it buys is a
  deliberate console decision from feature 003.
- **Header**: the account menu stays last, because an operator looks to the far
  right for their own account, and the existing gate already enforces it. The
  endorsement mark sits immediately before it. This diverges from the upstream
  section 4c wording, which governs brand surfaces rather than application
  chrome, and the divergence is documented rather than resolved by editing a
  file this repository does not own.
- **Checking**: the kit already owns the check logic it runs on itself, so
  exposing it is a packaging question rather than new behaviour.
- The preserved converted screen from feature 010 remains available as the
  reproduction case for the overflow.
