# Feature Specification: Icon rail and the light sign-in ground

**Feature Branch**: `feature/009-nav-rail-light-auth` (feature 009)

**Created**: 2026-09-23

**Status**: Draft

**Input**: Owner request: "in admin kit, I want u put mandatory nav bar sidemenu
when hide/collapse, it should show as icon rather than nothing also use
mandatory background login that we are using canvas animation to be more light
theme adjust to nearly white"

## What changes

Two mandatory corrections to patterns shipped in features 007 and 008.

1. **Collapsing the side navigation must leave an icon rail, not emptiness.**
   Today the menu button hides the navigation entirely at desktop width, so the
   operator loses every destination and has to reopen the menu to move. The
   collapsed state becomes a narrow rail of icons: every destination stays one
   click away, with its name available on hover and to assistive technology.
2. **The sign-in page uses a near-white ground.** The deep brand panel
   introduced in 007 goes; the ambient canvas animation stays and is retinted
   for a light surface. This also removes the tinted-ground exception that
   Principle II carried for authentication screens.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Collapse the menu, keep the map (Priority: P1)

An operator working in a wide table collapses the side navigation to gain
width. The navigation narrows to a rail of icons, the current screen stays
marked, and hovering an icon names its destination. Nothing disappears.

**Why this priority**: the owner calls it mandatory, and losing navigation on
collapse is the defect being corrected.

**Independent Test**: at 1440px, collapse the menu in every Admin Kit
deliverable and confirm the rail shows an icon per destination, the current one
is marked, and each carries an accessible name.

**Acceptance Scenarios**:

1. **Given** a console at 1440px, **When** the menu button is pressed, **Then**
   the navigation becomes a rail roughly one icon wide and the content takes
   the reclaimed width.
2. **Given** the collapsed rail, **When** it renders, **Then** every navigation
   destination is present as an icon, the current page keeps the accent
   treatment, and no label text is visible.
3. **Given** the collapsed rail, **When** a pointer rests on an icon or a
   screen reader reaches it, **Then** the destination is named.
4. **Given** the collapsed rail, **When** the menu button is pressed again,
   **Then** the full labelled navigation returns.
5. **Given** a phone, **When** the menu button is pressed, **Then** the drawer
   behaviour from feature 007 is unchanged: the rail is a desktop state only.

---

### User Story 2 - Sign in on a light ground (Priority: P1)

Someone opens a portal sign-in page and sees a near-white page with the brand
panel and its slow ambient line work rendered in light tints, and the
credential card sitting on that ground.

**Why this priority**: the owner calls it mandatory, and it aligns
authentication with the light default shipped in 008.

**Independent Test**: open the sign-in page in every deliverable at 1440px and
375px and confirm the ground is near-white, the animation still runs, and text
contrast holds.

**Acceptance Scenarios**:

1. **Given** the sign-in page in the default theme, **When** it renders,
   **Then** the page ground is near-white rather than deep brand colour.
2. **Given** the brand panel, **When** it renders, **Then** the ambient line
   work is visible in light tints, still animates on its slow loop, and still
   stops under `prefers-reduced-motion`.
3. **Given** the brand panel on the light ground, **When** it renders, **Then**
   the product lockup uses the normal light-mode treatment and every text
   element meets AA contrast.
4. **Given** the dark theme, **When** the sign-in page renders, **Then** it
   follows the dark tokens like every other screen, with the same art.
5. **Given** the credential card, **When** it renders on the near-white ground,
   **Then** it stays visibly separate from the page.

### Edge Cases

- A navigation item without an icon: not allowed; every destination carries one,
  so the rail can never show a blank row.
- A group in the rail: group labels and chevrons hide, and the group's children
  appear as icons, so a destination is never hidden behind a collapsed group.
- Reduced motion: the ambient art stops, as before.
- Dark theme: both the rail and the sign-in page follow the dark tokens.
- Narrow desktop widths just above the drawer breakpoint: the rail keeps its
  44px targets.

## Requirements *(mandatory)*

- **FR-001**: Collapsing the side navigation at desktop width MUST leave a rail
  of icons, one per destination, and MUST NOT hide the navigation.
- **FR-002**: The rail MUST mark the current page, keep 44px targets, name each
  destination on hover and to assistive technology, and hide label text.
- **FR-003**: Every navigation destination MUST carry an icon, including items
  inside groups.
- **FR-004**: The drawer behaviour below 900px MUST be unchanged.
- **FR-005**: The sign-in page ground MUST be near-white in the default theme,
  and the authentication-screen exception for a tinted ground is withdrawn.
- **FR-006**: The ambient canvas animation MUST remain, retinted for a light
  ground, still stopped under `prefers-reduced-motion`.
- **FR-007**: The sign-in brand panel MUST use the normal light-mode lockup
  treatment and hold AA contrast on the light ground.
- **FR-008**: Release gates MUST fail when a collapsed console navigation shows
  no icons, and when a sign-in ground is not near-white in the default theme.
- **FR-009**: Both patterns MUST ship in the packaged console layer, be
  documented in the catalog, and be verified in all four Admin Kit
  deliverables.

## Success Criteria *(mandatory)*

- **SC-001**: In all four deliverables at 1440px, collapsing the menu leaves a
  rail no wider than 4rem containing one icon per destination, with the current
  page marked and every icon named.
- **SC-002**: No label text is visible in the collapsed rail, and the expanded
  navigation returns unchanged on a second press.
- **SC-003**: The sign-in ground in the default theme measures at least 95%
  relative luminance of white in all four deliverables.
- **SC-004**: The ambient art animates on the light ground and reports no
  animation under reduced motion.
- **SC-005**: All gates pass, including the two new checks, and each fails when
  deliberately broken.

## Assumptions

- "Nearly white" is the kit's own near-white surface token rather than a new
  value, so the ground still comes from tokens.css.
- The rail follows the shape the reference console uses: a narrow column of
  44px icon targets with the accent tint on the current page.
- Icons for group children come from the existing in-house set; no new icon
  style is introduced.
- The change is visual behaviour in a shipped package, so it releases as a new
  kit version once the owner publishes.
