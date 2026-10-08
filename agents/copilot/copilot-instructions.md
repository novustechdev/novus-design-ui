<!-- Generated from novus-design-kit 0.9.0 by agents/generate.mjs. Do not edit by hand: edit agents/rules.mjs and regenerate. -->

# novus-design-kit instructions

These are the rules of the novus-design-kit design system, for the coding
agent working in this repository. They come from the kit itself, version
0.9.0. Upgrade the package to get the current version of this file.

## What the kit ships

- `novus-design-kit/tokens.css`: every design token: colour, type, spacing, radius, shadow
- `novus-design-kit/console.css`: the console layer: shell, side navigation, page header, filter bar, paged list, sign-in, settings
- `novus-design-kit/js/novus-theme.js`: the theme script: light by default, remembers a choice, applies before first paint
- `novus-design-kit/js/novus-console.js`: progressive console behaviour, with every pattern still working when it does not run
- `novus-design-kit/js/novus-app-switcher.js`: the Novus app switcher element, first in every console header, fed by the workspace launcher's catalog
- `novus-design-kit/js/novus-app-marks.js`: the product mark registry the app switcher draws from
- `novus-design-kit/icons/novus-icons.svg`: the line icon sprite used across console screens

Import `tokens.css` once at the application root, and load `js/novus-theme.js`
in the document head so the theme applies before first paint. Console and portal
screens also load `console.css` after the tokens.

## Rules

- **Take every colour, size, spacing, radius and shadow from a token in tokens.css. If you are about to type a hex colour or a pixel value, there is a var(--...) for it.**
  Why: hardcoded values stop tracking the kit at the next upgrade. Checked by: release gates 2 and 5, the hex and radius audits.
- **Surfaces are flat and monochrome: no gradients, and colour carries meaning rather than decoration.**
  Why: the kit is a near-flat enterprise system, and decorative colour makes status colour meaningless. Checked by: release gate 1.
- **Use a component from the kit's catalog before writing new markup. The package ships the stylesheet, not the markup, so read the pattern's structure in the catalog at https://ui-kit.novustech.dev/components/overview.html rather than guessing it from class names.**
  Why: re-implemented components miss the accessibility, dark mode and responsive behaviour the originals carry. Checked by: the component catalog at https://ui-kit.novustech.dev/components/overview.html, which carries the markup for each pattern.
- **Short content stays on one line. Identifiers, names, chips, dates, amounts, buttons and column headers never wrap to two or three rows, and a table scrolls inside its own card instead of squeezing its columns.**
  Why: wrapped identifiers and squeezed tables are the defect this kit was corrected twice to prevent. Checked by: release gate 11, the layout audit at 1440px and 375px.
- **Do not cap portal text at a reading measure, and do not narrow descriptive text with a margin: a paragraph, a help line or any other descriptive copy spans the full width of its container, with inline margins of zero if any were going to be set. Only text deliberately marked as prose with the measure class takes a reading cap.**
  Why: a reading cap, or a margin narrowing the copy, leaves text wrapping into three lines beside empty space. Checked by: release gate 14.
- **Light is the default theme. Dark comes only from a choice the person made, which persists. Do not follow the operating system unless the app opts in explicitly.**
  Why: portals were flipping to dark on first visit for anyone with a dark operating system. Checked by: js/novus-theme.js, which applies the default before first paint.
- **Header, navigation and body text render at one size. Headings step up by their documented ratio, and never further.**
  Why: a navigation smaller than the content it sits beside reads as a different product. Checked by: release gate 13.
- **Every control a person can press measures at least 44px at the 375px baseline, icon-only controls included. A control may look smaller if it carries an expanded hit area that still reaches 44px. Desktop density is a separate decision, so this floor is the phone baseline rather than every width.**
  Why: anything smaller fails on a phone and for anyone with imprecise pointing, and this rule went unenforced long enough for the kit's own screens to drift under it. Checked by: release gate 19, the layout audit's TARGET check at 375px, which measures the hit area rather than the box.
- **Motion is functional and lasts 0.2s or less, and it is removed under prefers-reduced-motion. The one exception is the slow ambient art on the sign-in panel, which also stops under reduced motion.**
  Why: decorative motion in a console gets in the way of work. Checked by: the constitution's motion rule and the reduced-motion verification runs.
- **Patterns keep working when JavaScript does not run. Menus, drawers, filter sheets and tabs are built on native elements first, with script only as an enhancement.**
  Why: a console that needs script to open its own menu fails in the environments enterprises actually run. Checked by: the JavaScript-off verification runs recorded for every Admin Kit flavor.
- **Write plain copy. No em dashes anywhere in published text, and no marketing category jargon for the product.**
  Why: the kit's copy style is checked mechanically and a stray character fails the release. Checked by: release gates 6 and 8, the copy audits.
- **When generating a component, add no white space just to make a layout look symmetric: no empty element balancing one side against the other, no padding on one column to match its neighbour. Balance comes from the grid or flex rules the pattern already sets. Every other gap is deliberate too, coming from a spacing token or a container that carries it (.row spaces its children, .field pairs its label and control).**
  Why: space invented to look balanced is invisible to the next change, so it drifts the moment one side moves and it never had a token behind it. Checked by: the spacing tokens in tokens.css and the container patterns in the catalog.
- **A field's default edit mode is a real label above the control, the .field pattern. A placeholder is a hint that disappears once someone types, so it never stands in for the label, and an input ships with no placeholder-only field. Keep the placeholder for format examples, like name@novustech.com.sg.**
  Why: a placeholder standing in for the label is gone the moment the field is filled, so the person cannot check what they typed. Checked by: the .field pattern in the catalog, and the field and input component docs.
- **A field the person cannot edit carries no padlock icon. Say it with the control itself: readonly on an input the person may focus and copy from, disabled on one they cannot, and a .field__help line naming why it is locked, like Set by your administrator. The state stays legible from the styling the control already has, so no new icon joins the label.**
  Why: a padlock in a field is decoration that competes with the control, and it disappears from the accessibility tree, so the state it describes is left to colour alone. Checked by: the form field pattern in tokens.css, which styles the control states and needs no extra element.

## Checking your own work

Before you say a screen is done, confirm it at 1440px and at 375px: nothing short
wraps to a second line, no page scrolls sideways, every control a finger can
press reaches 44px at the phone width, and the screen still works with JavaScript
turned off. If you introduced a value that no token covers, say so rather than
hiding it in a stylesheet.

You can run the same audit this kit runs on itself, against your own build:

    node node_modules/novus-design-kit/scripts/layout-audit.mjs --target dist

It needs a Chromium and playwright-core. If you cannot render the page at
all, say so plainly and name what you did check. Do not report a check you did
not run: a screen that was never rendered is a screen nobody has looked at, and
saying that honestly is more useful than a confident guess.

Console and portal screens carry further rules, in
`.github/instructions/novus-design-kit.instructions.md`.
