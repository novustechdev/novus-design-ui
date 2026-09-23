<!-- Generated from novus-design-kit 0.6.0 by agents/generate.mjs. Do not edit by hand: edit agents/rules.mjs and regenerate. -->

# novus-design-kit instructions

These are the rules of the novus-design-kit design system, for the coding
agent working in this repository. They come from the kit itself, version
0.6.0. Upgrade the package to get the current version of this file.

## What the kit ships

- `novus-design-kit/tokens.css`: every design token: colour, type, spacing, radius, shadow
- `novus-design-kit/console.css`: the console layer: shell, side navigation, page header, filter bar, paged list, sign-in, settings
- `novus-design-kit/js/novus-theme.js`: the theme script: light by default, remembers a choice, applies before first paint
- `novus-design-kit/js/novus-console.js`: progressive console behaviour, with every pattern still working when it does not run
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
- **Do not cap portal text at a reading measure. A paragraph uses the width it has, unless it is deliberately marked as prose with the measure class.**
  Why: a reading cap leaves text wrapping into three lines beside empty space. Checked by: release gate 14.
- **Light is the default theme. Dark comes only from a choice the person made, which persists. Do not follow the operating system unless the app opts in explicitly.**
  Why: portals were flipping to dark on first visit for anyone with a dark operating system. Checked by: js/novus-theme.js, which applies the default before first paint.
- **Header, navigation and body text render at one size. Headings step up by their documented ratio, and never further.**
  Why: a navigation smaller than the content it sits beside reads as a different product. Checked by: release gate 13.
- **Every interactive target is at least 44px, at every width, including icon-only controls.**
  Why: anything smaller fails on a phone and for anyone with imprecise pointing. Checked by: the 375px pass in the release gates.
- **Motion is functional and lasts 0.2s or less, and it is removed under prefers-reduced-motion. The one exception is the slow ambient art on the sign-in panel, which also stops under reduced motion.**
  Why: decorative motion in a console gets in the way of work. Checked by: the constitution's motion rule and the reduced-motion verification runs.
- **Patterns keep working when JavaScript does not run. Menus, drawers, filter sheets and tabs are built on native elements first, with script only as an enhancement.**
  Why: a console that needs script to open its own menu fails in the environments enterprises actually run. Checked by: the JavaScript-off verification runs recorded for every Admin Kit flavor.
- **Write plain copy. No em dashes anywhere in published text, and no marketing category jargon for the product.**
  Why: the kit's copy style is checked mechanically and a stray character fails the release. Checked by: release gates 6 and 8, the copy audits.

## Checking your own work

Before you say a screen is done, confirm it at 1440px and at 375px: nothing short
wraps to a second line, no page scrolls sideways, every target is at least 44px,
and the screen still works with JavaScript turned off. If you introduced a value
that no token covers, say so rather than hiding it in a stylesheet.

Console and portal screens carry further rules, in
`.github/instructions/novus-design-kit.instructions.md`.
