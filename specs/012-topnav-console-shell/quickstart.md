# Quickstart: validating feature 012

## 1. One definition, two shells

```bash
node admin-kits/data/generate.mjs
node admin-kits/data/generate.mjs --check
```

Expected: the strip and the drawer are emitted from the same `NAV`, and the
parity check passes. Changing one destination in `NAV` changes both.

## 2. The shell behaves

At 1440px, on the demo screen: each top-level item opens its menu on click, only
one menu is open at a time, Escape closes it and focus returns to its trigger,
and the current section stays marked while its menu is closed.

## 3. Nothing is lost

```bash
node scripts/layout-audit.mjs
```

Expected: no NAVREACH findings. Every destination reachable from the strip
matches the drawer's set, at 1440px, 900px and 375px.

With scripting disabled, confirm every destination is still reachable at 1440px
and 375px.

## 4. Negative-test gate 20

Remove a destination from the strip only, leaving the drawer intact. Expected:
the gate fails and names the missing destination. Restore and it passes.

## 5. The rest of the console is untouched

Expected: no HEADER findings (the account menu is still last), no TARGET
findings at 375px, no WRAP or OVERFLOW findings, and the side-navigation demos
are unchanged.

## 6. The choice is documented

Read the catalog entry and the Admin Kit page. Expected: the shape each shell
suits, the top-level count beyond which the side navigation is the better
choice, and the reason.
