# Contributing to the Novus Design Kit

Contributions are welcome. The kit is governed by a constitution
(`.specify/memory/constitution.md`) and enforced by automated gates; a change that
fails a gate cannot merge, so read this first.

## Ground rules

- `tokens.css` is the single source of truth and is byte-frozen against the design
  system master. Never add values or component classes to it in a PR; compose from
  what it ships, or raise the change with the design-system owner.
- Every color, size, radius, and font value in authored code is a token
  (`var(--…)`). No hex, no gradients, no ad-hoc radii or font sizes.
- Copy rules: no em-dashes, and the business model is "Service as Software"
  (the abbreviation it replaces must not appear, even negated).
- New docs guides must be verified in a real sample project before they ship;
  unverified guides are excluded by the build.

## Workflow

1. Fork and branch from `main` (direct pushes to `main` are for maintainers;
   `main` forbids force pushes and deletions).
2. Make the change. Docs live in `site/src/`, the generator is `site/build.mjs`,
   the Admin Kit flavors are under `admin-kits/` (keep the two flavors and the
   WASM demo in strict parity; `admin-kits/data/generate.mjs` re-emits shared data).
3. Build and gate locally:

   ```sh
   node site/build.mjs && scripts/gates.sh
   ```

   All gates must pass. For Admin Kit changes, also build both flavors.
4. Update the speckit record: the active feature's `tasks.md` under `specs/`
   gets a task line for your change, and `CHANGELOG.md` gets an entry when the
   change is user-visible.
5. Open a PR against `main`. Reviews verify the gates and the constitution;
   conversation resolution is required before merge.

## Releases (maintainers)

Every tagged release updates `CHANGELOG.md` and all version references in the
same change set, and attaches the npm tarball to the GitHub Release
(constitution v1.7.0, Governance).
