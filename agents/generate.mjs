#!/usr/bin/env node
/* Novus Design Kit agent instruction generator.

   Source: agents/rules.mjs. Emits one instruction file per supported agent, each
   in the format that agent reads, so a consumer copies one into their repository
   and their agent inherits the kit's rules.

   Parity check (constitution Quality Gate 18): node agents/generate.mjs --check
   writes nothing and exits 1 listing every emitted file that differs from its
   source. */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { KIT, RULES, ALWAYS, CONSOLE, ARTIFACTS, UI_GLOB } from "./rules.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const CHECK = process.argv.includes("--check");

const drift = [];
function emit(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  const current = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (current === content) return;
  if (CHECK) { drift.push(relative(ROOT, path)); return; }
  writeFileSync(path, content);
  console.log("wrote", relative(ROOT, path));
}

const stamp = `<!-- Generated from ${KIT.name} ${KIT.version} by agents/generate.mjs. Do not edit by hand: edit agents/rules.mjs and regenerate. -->`;

const rule = (r) => `- **${r.text}**\n  Why: ${r.why}. Checked by: ${r.enforcedBy}.`;
const ruleBlock = (rules) => rules.map(rule).join("\n");
const artifactBlock = () => ARTIFACTS.map((a) => `- \`${KIT.name}/${a.path}\`: ${a.what}`).join("\n");

const intro = `These are the rules of the ${KIT.name} design system, for the coding
agent working in this repository. They come from the kit itself, version
${KIT.version}. Upgrade the package to get the current version of this file.`;

const install = `## What the kit ships

${artifactBlock()}

Import \`tokens.css\` once at the application root, and load \`js/novus-theme.js\`
in the document head so the theme applies before first paint. Console and portal
screens also load \`console.css\` after the tokens.`;

const checking = `## Checking your own work

Before you say a screen is done, confirm it at 1440px and at 375px: nothing short
wraps to a second line, no page scrolls sideways, every target is at least 44px,
and the screen still works with JavaScript turned off. If you introduced a value
that no token covers, say so rather than hiding it in a stylesheet.`;

/* AGENTS.md and CLAUDE.md: plain Markdown, no frontmatter, every rule. */
const fullFile = (title) => `${stamp}

# ${title}

${intro}

${install}

## Rules that always apply

${ruleBlock(ALWAYS)}

## Rules for console and portal screens

These apply to admin consoles, dashboards and portals. They do not apply to
marketing pages.

${ruleBlock(CONSOLE)}

${checking}
`;

emit(join(ROOT, "agents/AGENTS.md"), fullFile(`Working with the ${KIT.name}`));
emit(join(ROOT, "agents/claude/CLAUDE.md"), fullFile(`Working with the ${KIT.name}`));

/* Copilot, repository-wide: the always rules. */
emit(
  join(ROOT, "agents/copilot/copilot-instructions.md"),
  `${stamp}

# ${KIT.name} instructions

${intro}

${install}

## Rules

${ruleBlock(ALWAYS)}

${checking}

Console and portal screens carry further rules, in
\`.github/instructions/novus-design-kit.instructions.md\`.
`
);

/* Copilot, path-scoped: console rules only. applyTo is required by the format. */
emit(
  join(ROOT, "agents/copilot/novus-design-kit.instructions.md"),
  `---
applyTo: "${UI_GLOB}"
---
${stamp}

# ${KIT.name}, console and portal screens

These rules apply to admin consoles, dashboards and portals built with the
${KIT.name}, version ${KIT.version}. They sit on top of the repository-wide
rules in \`.github/copilot-instructions.md\`.

${ruleBlock(CONSOLE)}

${checking}
`
);

/* Cursor: .mdc with description, globs and alwaysApply. A plain .md here is ignored. */
emit(
  join(ROOT, "agents/cursor/novus-design-kit.mdc"),
  `---
description: Rules of the ${KIT.name} design system, version ${KIT.version}. Apply when writing or reviewing any interface code in this project.
globs: ${UI_GLOB}
alwaysApply: true
---
${stamp}

# ${KIT.name}

${intro}

${install}

## Rules that always apply

${ruleBlock(ALWAYS)}

## Rules for console and portal screens

${ruleBlock(CONSOLE)}

${checking}
`
);

if (CHECK) {
  if (drift.length) {
    console.log(`agent rule drift in ${drift.length} file(s):\n  ${drift.join("\n  ")}\nrun: node agents/generate.mjs`);
    process.exit(1);
  }
  console.log(`agent rules: every generated file matches its source (${RULES.length} rules, ${ARTIFACTS.length} artifacts)`);
}
