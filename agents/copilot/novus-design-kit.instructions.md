---
applyTo: "**/*.{html,razor,cshtml,jsx,tsx,vue,svelte,css}"
---
<!-- Generated from novus-design-kit 0.7.0 by agents/generate.mjs. Do not edit by hand: edit agents/rules.mjs and regenerate. -->

# novus-design-kit, console and portal screens

These rules apply to admin consoles, dashboards and portals built with the
novus-design-kit, version 0.7.0. They sit on top of the repository-wide
rules in `.github/copilot-instructions.md`.

- **Build console screens on the shipped shell: a header carrying the product lockup and an account menu, a grouped side navigation with line icons, and a page header with a breadcrumb and end-aligned actions.**
  Why: every screen assembled by hand drifts from the rest of the portal. Checked by: console.css and the Admin Kit reference applications.
- **The account menu is the last element in a console header. Nothing sits to the right of it, at any width.**
  Why: operators look to the far right for their own account, and anything past it is noise. Checked by: release gate 12.
- **Collapsing the side navigation leaves a rail of icons, one per destination, with the current page still marked and each icon carrying its name for assistive technology. Never hide the navigation.**
  Why: hiding it strands the operator with no way to move until they reopen the menu. Checked by: release gate 16.
- **Sign-in sits on the near-white ground with the ambient line art on the brand panel, single sign-on beside the password form, and no theme toggle on the page.**
  Why: authentication is the first screen anyone sees, and it now follows the same neutral ground as everything else. Checked by: release gate 17.
- **A menu, popover or tooltip belonging to a table row renders outside the table's scroll wrap, not inside it. The wrap clips what it contains, so anything that needs to overflow the table has to live beyond it.**
  Why: the wrap is a containing block, so a popover inside it is clipped instead of floating over the page. Checked by: the table pattern in the catalog at https://ui-kit.novustech.dev/components/table.html.
- **Lists use the filter bar with its sub-filter sheet, active chips and quick chips with counts, and they end with the list footer: a count, page controls, and rows per page.**
  Why: hand-built filter bars were the specific complaint that produced this pattern. Checked by: console.css and the Admin Kit reference applications.
- **Charts read their colours and fonts from the tokens at render time, redraw when the theme changes, and are accompanied by the same numbers as a table so a page without scripting still answers the question.**
  Why: a chart with baked-in colours goes wrong the moment the theme flips. Checked by: the charts pattern documented in the catalog.

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
