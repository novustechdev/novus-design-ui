/* The Novus Design Kit's rules for AI coding agents.

   THE source. Every agent instruction file in agents/ and the rules shown on the
   documentation page are rendered from this module, so a rule is written once and
   cannot drift between providers or between the files and the docs.

   Adding a rule is a MINOR release. Removing one, or moving a published path, is
   MAJOR. See specs/010-agent-adoption-guide/contracts/agent-files.md.

   Copy rules apply to this file too: no em dashes, and the product-category
   abbreviation the kit bans is never written out. Gate 1 greps for the word this
   kit bans for backgrounds, so rule text uses the phrase "no gradients", which is
   the form that gate excludes. */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(HERE, "..", "package.json"), "utf8"));

export const KIT = { name: pkg.name, version: pkg.version };

/* The package ships CSS, icons and scripts, but no markup. Component structure
   lives in the catalog, so anything that sends an agent to "the catalog" has to
   say where that is. */
export const DOCS = "https://ui-kit.novustech.dev/";

/* What a consumer actually installs. Derived from the package's own export map,
   so a prompt can never name a path this release does not ship. */
const EXPORTED = Object.keys(pkg.exports || {});
const shipped = (path) =>
  EXPORTED.includes(`./${path}`) || EXPORTED.includes(`./${path.replace(/\/[^/]+$/, "/*")}`);

export const ARTIFACTS = [
  { path: "tokens.css", what: "every design token: colour, type, spacing, radius, shadow" },
  { path: "console.css", what: "the console layer: shell, side navigation, page header, filter bar, paged list, sign-in, settings" },
  { path: "js/novus-theme.js", what: "the theme script: light by default, remembers a choice, applies before first paint" },
  { path: "js/novus-console.js", what: "progressive console behaviour, with every pattern still working when it does not run" },
  { path: "icons/novus-icons.svg", what: "the line icon sprite used across console screens" },
].filter((a) => shipped(a.path));

/* Each rule: id, the instruction itself, the scope it applies to, what breaks
   without it, and where this kit checks it. */
export const RULES = [
  {
    id: "use-tokens",
    scope: "always",
    text: "Take every colour, size, spacing, radius and shadow from a token in tokens.css. If you are about to type a hex colour or a pixel value, there is a var(--...) for it.",
    why: "hardcoded values stop tracking the kit at the next upgrade",
    enforcedBy: "release gates 2 and 5, the hex and radius audits",
  },
  {
    id: "flat-surfaces",
    scope: "always",
    text: "Surfaces are flat and monochrome: no gradients, and colour carries meaning rather than decoration.",
    why: "the kit is a near-flat enterprise system, and decorative colour makes status colour meaningless",
    enforcedBy: "release gate 1",
  },
  {
    id: "reuse-components",
    scope: "always",
    text: "Use a component from the kit's catalog before writing new markup. The package ships the stylesheet, not the markup, so read the pattern's structure in the catalog at https://ui-kit.novustech.dev/components/overview.html rather than guessing it from class names.",
    why: "re-implemented components miss the accessibility, dark mode and responsive behaviour the originals carry",
    enforcedBy: "the component catalog at https://ui-kit.novustech.dev/components/overview.html, which carries the markup for each pattern",
  },
  {
    id: "single-line-content",
    scope: "always",
    text: "Short content stays on one line. Identifiers, names, chips, dates, amounts, buttons and column headers never wrap to two or three rows, and a table scrolls inside its own card instead of squeezing its columns.",
    why: "wrapped identifiers and squeezed tables are the defect this kit was corrected twice to prevent",
    enforcedBy: "release gate 11, the layout audit at 1440px and 375px",
  },
  {
    id: "content-width",
    scope: "always",
    text: "Do not cap portal text at a reading measure. A paragraph uses the width it has, unless it is deliberately marked as prose with the measure class.",
    why: "a reading cap leaves text wrapping into three lines beside empty space",
    enforcedBy: "release gate 14",
  },
  {
    id: "light-default",
    scope: "always",
    text: "Light is the default theme. Dark comes only from a choice the person made, which persists. Do not follow the operating system unless the app opts in explicitly.",
    why: "portals were flipping to dark on first visit for anyone with a dark operating system",
    enforcedBy: "js/novus-theme.js, which applies the default before first paint",
  },
  {
    id: "typography-parity",
    scope: "always",
    text: "Header, navigation and body text render at one size. Headings step up by their documented ratio, and never further.",
    why: "a navigation smaller than the content it sits beside reads as a different product",
    enforcedBy: "release gate 13",
  },
  {
    id: "targets",
    scope: "always",
    text: "Every interactive target is at least 44px, at every width, including icon-only controls.",
    why: "anything smaller fails on a phone and for anyone with imprecise pointing",
    enforcedBy: "the 375px pass in the release gates",
  },
  {
    id: "motion",
    scope: "always",
    text: "Motion is functional and lasts 0.2s or less, and it is removed under prefers-reduced-motion. The one exception is the slow ambient art on the sign-in panel, which also stops under reduced motion.",
    why: "decorative motion in a console gets in the way of work",
    enforcedBy: "the constitution's motion rule and the reduced-motion verification runs",
  },
  {
    id: "works-without-script",
    scope: "always",
    text: "Patterns keep working when JavaScript does not run. Menus, drawers, filter sheets and tabs are built on native elements first, with script only as an enhancement.",
    why: "a console that needs script to open its own menu fails in the environments enterprises actually run",
    enforcedBy: "the JavaScript-off verification runs recorded for every Admin Kit flavor",
  },
  {
    id: "plain-copy",
    scope: "always",
    text: "Write plain copy. No em dashes anywhere in published text, and no marketing category jargon for the product.",
    why: "the kit's copy style is checked mechanically and a stray character fails the release",
    enforcedBy: "release gates 6 and 8, the copy audits",
  },
  {
    id: "console-shell",
    scope: "console",
    text: "Build console screens on the shipped shell: a header carrying the product lockup and an account menu, a grouped side navigation with line icons, and a page header with a breadcrumb and end-aligned actions.",
    why: "every screen assembled by hand drifts from the rest of the portal",
    enforcedBy: "console.css and the Admin Kit reference applications",
  },
  {
    id: "account-menu-last",
    scope: "console",
    text: "The account menu is the last element in a console header. Nothing sits to the right of it, at any width.",
    why: "operators look to the far right for their own account, and anything past it is noise",
    enforcedBy: "release gate 12",
  },
  {
    id: "nav-rail",
    scope: "console",
    text: "Collapsing the side navigation leaves a rail of icons, one per destination, with the current page still marked and each icon carrying its name for assistive technology. Never hide the navigation.",
    why: "hiding it strands the operator with no way to move until they reopen the menu",
    enforcedBy: "release gate 16",
  },
  {
    id: "sign-in-ground",
    scope: "console",
    text: "Sign-in sits on the near-white ground with the ambient line art on the brand panel, single sign-on beside the password form, and no theme toggle on the page.",
    why: "authentication is the first screen anyone sees, and it now follows the same neutral ground as everything else",
    enforcedBy: "release gate 17",
  },
  {
    id: "filters-and-lists",
    scope: "console",
    text: "Lists use the filter bar with its sub-filter sheet, active chips and quick chips with counts, and they end with the list footer: a count, page controls, and rows per page.",
    why: "hand-built filter bars were the specific complaint that produced this pattern",
    enforcedBy: "console.css and the Admin Kit reference applications",
  },
  {
    id: "charts",
    scope: "console",
    text: "Charts read their colours and fonts from the tokens at render time, redraw when the theme changes, and are accompanied by the same numbers as a table so a page without scripting still answers the question.",
    why: "a chart with baked-in colours goes wrong the moment the theme flips",
    enforcedBy: "the charts pattern documented in the catalog",
  },
];

export const ALWAYS = RULES.filter((r) => r.scope === "always");
export const CONSOLE = RULES.filter((r) => r.scope === "console");

/* Agents this kit ships a file for. consumerPath is where the file belongs in the
   consumer's repository; packagePath is where it sits inside the installed
   package. Formats confirmed against each vendor's own documentation, recorded in
   specs/010-agent-adoption-guide/research.md. */
export const AGENTS = [
  {
    id: "claude-code",
    label: "Claude Code",
    packagePath: "agents/claude/CLAUDE.md",
    consumerPath: "CLAUDE.md",
    note: "Claude Code reads CLAUDE.md at the project root, or .claude/CLAUDE.md. It also reads AGENTS.md when no CLAUDE.md is present, so use one or the other rather than both.",
  },
  {
    id: "copilot",
    label: "GitHub Copilot",
    packagePath: "agents/copilot/copilot-instructions.md",
    consumerPath: ".github/copilot-instructions.md",
    note: "Applies to every request in the repository.",
  },
  {
    id: "copilot-console",
    label: "GitHub Copilot, console screens",
    packagePath: "agents/copilot/novus-design-kit.instructions.md",
    consumerPath: ".github/instructions/novus-design-kit.instructions.md",
    note: "Path-scoped. The applyTo glob limits the console rules to interface files.",
  },
  {
    id: "cursor",
    label: "Cursor",
    packagePath: "agents/cursor/novus-design-kit.mdc",
    consumerPath: ".cursor/rules/novus-design-kit.mdc",
    note: "Must keep the .mdc extension: a plain .md file in .cursor/rules is ignored.",
  },
  {
    id: "agents-md",
    label: "Any AGENTS.md reader",
    packagePath: "agents/AGENTS.md",
    consumerPath: "AGENTS.md",
    note: "The cross-tool convention, read by Codex, Windsurf, Zed, Jules and others.",
  },
];

/* The glob the path-scoped formats use for console rules. Scope is semantic
   rather than structural, so this matches interface files broadly and the rule
   text says which screens it means. */
export const UI_GLOB = "**/*.{html,razor,cshtml,jsx,tsx,vue,svelte,css}";

const artifactLines = () => ARTIFACTS.map((a) => `- ${a.path}: ${a.what}`).join("\n");
const ruleLines = (rules) => rules.map((r) => `- ${r.text}`).join("\n");

/* Prompts a reader copies as they are. Each renders the artifact list and the
   rules from the same source the files use. */
export const PROMPTS = [
  {
    id: "adopt",
    title: "Adopt the kit in an application that already exists",
    checks: [
      "the app still builds and runs",
      "no hex colour or pixel value was introduced where a token exists",
      "one screen is converted, not all of them",
    ],
    body: () => `Adopt the ${KIT.name} design kit in this project.

1. Install it from public npm: npm install ${KIT.name}
2. Wire it in. Each file has its own place:
   - ${KIT.name}/tokens.css: import once at the application root, before your own styles.
   - ${KIT.name}/console.css: import after tokens.css, on console and portal screens only.
   - ${KIT.name}/js/novus-theme.js: load in the document head, so the theme applies before first paint.
   - ${KIT.name}/js/novus-console.js: load at the end of the body. It enhances behaviour; every pattern still works when it does not run.
   - ${KIT.name}/icons/novus-icons.svg: the icon sprite, referenced from markup. Serve it over http, because a browser blocks an external sprite from a file:// page.
   The markup for each pattern is in the catalog, not in the package: ${DOCS}components/overview.html
3. Convert exactly one screen to the kit, and stop there so I can review it.
4. Tell me which values in that screen had no token, if any.

Follow these rules while you work:
${ruleLines(ALWAYS)}

Do not restyle anything outside the screen you convert, and do not edit files
inside node_modules.`,
  },
  {
    id: "convert-screen",
    title: "Convert a hand-built admin screen to the console patterns",
    checks: [
      "the screen uses the shell, not new layout markup",
      "the side navigation collapses to a rail of icons rather than disappearing",
      "no identifier, chip, amount or column header wraps to a second line",
    ],
    body: () => `Rebuild this screen on the ${KIT.name} console patterns.

Load ${KIT.name}/console.css after ${KIT.name}/tokens.css, then rebuild the
screen from the shipped patterns rather than the markup that is there now:
the console shell, the grouped side navigation, the page header with its
breadcrumb and end-aligned actions, the filter bar with its sub-filter sheet and
quick chips, and the list footer with its count and page controls.

Rules that apply everywhere:
${ruleLines(ALWAYS)}

Rules for console and portal screens:
${ruleLines(CONSOLE)}

When you are done, list anything in the original screen that has no equivalent
in the kit, instead of inventing a component for it.`,
  },
  {
    id: "audit-screen",
    title: "Audit an existing screen against the kit's rules",
    checks: [
      "findings name a file and a line",
      "each finding names the rule it breaks",
      "nothing was changed, only reported",
    ],
    body: () => `Audit this screen against the ${KIT.name} rules and report what
breaks them. Change nothing.

Check each of these, and for every failure give me the file, the line, the rule
it breaks, and the smallest fix:
${ruleLines(ALWAYS)}

If the screen is a console or portal screen, also check:
${ruleLines(CONSOLE)}

Check the rendered result at 1440px and at 375px, not just the source. Report
findings in severity order, worst first, and say plainly if you found nothing.`,
  },
];

export const artifactList = artifactLines;
export const rulesAsLines = ruleLines;
