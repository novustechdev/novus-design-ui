---

description: "Task list for feature 009: icon rail and the light sign-in ground"
---

# Tasks: Icon rail and the light sign-in ground (feature 009)

**Input**: Design documents in `specs/009-nav-rail-light-auth/`

**Tests**: the gate suite with both new gates negative-tested, plus verified
runs across the four Admin Kit deliverables.

## Phase 1: Governance

- [X] T001 Amend `.specify/memory/constitution.md` to 1.13.0: collapsed navigation must be an icon rail, the tinted authentication ground is withdrawn, gates 16 and 17

## Phase 2: Pattern work

- [X] T002 [US1] Replace the collapse-to-nothing rule in `admin-kits/shared/novus-admin.css` with the icon rail (3.5rem column, centred 44px targets, visually hidden labels, groups flattened to icons)
- [X] T003 [US1] Give every navigation destination an icon and a `title` in `admin-kits/data/generate.mjs`, for both the static and Razor renderers
- [X] T004 [US2] Move the sign-in ground to `--bg-subtle` in `admin-kits/shared/novus-admin.css`, retint the ambient art for a light surface, restore the normal lockup treatment, and give the card a border

## Phase 3: Gates

- [X] T005 Add RAIL and GROUND checks to `scripts/layout-audit.mjs`, collapsing the navigation in the audit's second pass so gate 16 has a state to judge
- [X] T006 Negative-test both gates (hidden collapsed navigation, stripped rail icons, dark sign-in ground) and restore

## Phase 4: Documentation and delivery

- [X] T007 [P] Update `site/src/components/side-navigation.html` and `site/src/components/sign-in-page.html` for the rail and the light ground
- [X] T008 Rebuild every deliverable and confirm the audit and the full gate suite are clean
- [X] T009 Verified runs across the four deliverables: rail icons and naming at 1440px, drawer unchanged at 375px, sign-in ground luminance, art under reduced motion
- [X] T010 Refresh the Admin Kit screenshots (sign-in and a collapsed rail) and update `site/src/admin-kit.html`
- [X] T011 Release: version bump, CHANGELOG, README if needed, with the npm publish recorded for the owner
- [ ] T012 Update `memory/project_state.md` and the session handover, then open the pull request
