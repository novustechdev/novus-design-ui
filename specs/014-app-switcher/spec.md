# Feature Specification: One Novus App Switcher, Top Left

**Feature Branch**: `feature/014-app-switcher`

**Created**: 2026-10-04

**Status**: Specified

**Input**: Owner, 2026-10-04: "modify the widget launcher in each novabank, novahub, novatrace,
novacard to put in the top left (so we change it with more best better widget app launcher
switcher like azure …) — we change the widget menu option top like for menu search to apps
switcher launcher, so not confused the user journey — so we add also more apps directly to
supernova launcher at workspace.novustech.id — you should improve also the launcher of supernova
to be more enterprised widget launcher and make sure it sync with the small widget app switcher
in each product/platform apps already available in supernova launcher". The reference is the
Microsoft 365 app launcher: a waffle at the top left that opens a panel with a search field, a
grid of app tiles, and "More apps".

Owner decisions the same day:
- Apps added to the workspace launcher later appear in every product's switcher by themselves
  ("later if we added in supernova workspace.novustech.dev so automate added to the widget").
- The in-app destination menu that sits at the top left today folds into the search palette.

The workspace launcher's side (its catalog as data, the catalog endpoint, the new apps, the
launcher's own screen) is supernova-launchpad spec `004-enterprise-launcher`.

## Where we are

Four consoles ship their own copy of the same switcher: a waffle at the **top right**, a 2- or
3-column grid of the products the deployment lists, and four fixed product marks.
- novabank and novahub have it in React (`portal/src/os/AppSwitcher.tsx`), novatrace in plain
  script (`platform/ui/src/shell/apps.js`), and novacard has its own.
- Each copy reads its app list from its own deployment setting (`apps`, `console.apps`). So the
  four lists and the workspace launcher's catalog drift apart, and an app added to the workspace
  appears nowhere else.
- novabank and novahub also carry a second waffle-like button at the **top left**: the in-app
  destination menu (browse every screen by domain, with a filter). Two grid buttons on one bar is
  the confusion the owner names.

## Decisions

### D1 One switcher, first in the header

- The app switcher is the **first control in the console header**, at the far left, in both
  supported shells (side navigation and top navigation). On a narrow screen, the drawer toggle
  follows it. The product lockup comes after both.
- A console draws **exactly one** grid button. The top-right switcher is removed. The in-app
  destination menu is retired: its "browse by domain" view moves into the search palette
  (Ctrl/Cmd+K) as a "Browse all" view, so nothing it offered is lost.
- The rule joins the console header rules beside "nothing to the right of the account menu":
  nothing to the left of the app switcher.

### D2 The panel, after Microsoft 365

- **Button:** the nine-dot waffle, 40 × 40, with the label "Novus apps", `aria-haspopup="dialog"`
  and `aria-expanded`.
- **Panel:** anchored under the button at the left edge. 640 px wide on a desktop; a full-width
  sheet under the header below 600 px. The kit's surface, border, radius and elevation, in both
  themes, with no motion under `prefers-reduced-motion`.
- **Search** first, focused on open, with the placeholder "Find Novus apps". It filters by name,
  description and category as you type. "No app matches" is said in words.
- **Tiles:** a grid of the apps the viewer may open: 5 columns on a desktop, 4 on a tablet, 3 on a
  phone. Each tile is the product mark (48 px) with the name under it, and the description as its
  tooltip and accessible description. This console's own tile shows as current, and neither moves
  focus nor navigates.
- **Order:** the viewer's recent apps first (the last four this console's switcher opened, kept
  in its own `localStorage`, since storage is per origin), then the catalog's category order,
  then catalog order.
- **"All apps"** is the last tile. It opens the workspace launcher, where every app is grouped by
  category and can be pinned. It is drawn whenever a workspace launcher is declared.
- **Keyboard:** the arrow keys walk the grid as drawn, Home and End jump to the ends, typing goes
  to the search field, Tab stays inside the panel, and Escape closes the panel and returns focus to
  the button. A click outside closes it.
- **Links:** they open in the same tab. Every app signs in through the same realm, so a second tab
  would only be a second copy of the session.

### D3 One catalog, read at run time

- **Source.** The workspace launcher publishes its catalog at `GET {launcher}/api/catalog`, the
  one list its own screen reads (supernova-launchpad 004). The switcher fetches it when the
  panel first opens, not at page load.
- **Contract:** `{version, categories: [{id, name}], apps: [{id, name, description, category,
  url, mark: {colour, glyph}, requiredRoles}]}`.
  - `glyph` names a mark in the kit's registry (D5).
  - The endpoint answers with CORS `*`, no credentials and `Cache-Control: max-age=300`. It carries
    nothing secret: names, addresses and role names.
- **Who sees what.** The rule is the launcher's own: an app shows when one of its `requiredRoles`
  is among the viewer's realm roles and group names. The host console hands the switcher those
  claims from its own session. An entry with no roles, a malformed entry, or a viewer with no
  claims shows nothing.
- **Address safety.** Only `https` addresses on the deployment's allowed host suffixes open
  (default `.novustech.dev` and `.novustech.id`). Any other entry is dropped, so a tampered
  catalog cannot send an operator to a look-alike host.
- **Failure never breaks the console.** If the catalog does not answer within 3 s, or answers
  something unreadable, the switcher uses the last good copy for this browser. Failing that, it
  uses the deployment's own static list (the `apps` setting that exists today). Failing that, it
  shows only "All apps". The page never waits on the catalog.
- **A bank deployment without the workspace.** A deployment whose operators do not sign in to
  the Novus workspace realm (a bank's own staff realm) declares no launcher. Its switcher shows
  the deployment's static list, and draws no "All apps" tile.

### D4 One implementation in the kit

- `js/novus-app-switcher.js` defines the custom element `<novus-app-switcher>`, without a
  framework, in light DOM, styled by `console.css` (`.nv-apps*`), so React consoles and plain
  script consoles draw the same thing.
  - Attributes: `current` (this console's app id), `launcher` (the workspace launcher's origin),
    `catalog` (overrides `{launcher}/api/catalog`), `allowed-hosts` and `fallback` (base64 JSON
    of the static list).
  - Property: `claims` (string array).
  - Events: `novus-app-open` (detail: the app id) before navigating.
- It is exported as `novus-design-kit/js/novus-app-switcher.js` and listed in `files`. The demo
  and the catalog page live in `site/`.
- The four per-product copies are deleted when each console adopts the element.

### D5 Product marks live in the kit

- The four marks (colour and white line glyph, 24 × 24, stroke 1.8, round caps) move into the kit
  as a registry, `js/novus-app-marks.js`, plus SVGs under `logos/marks/`. They keep their
  colours in the dark theme.
- New marks in the same style for the apps the workspace adds:
  - NovaLending (a stack of coins under an arrow; its own glyph, on green-900, the nearest
    palette step to the teal it asked for that keeps every mark distinct);
  - NovaMerchant (a shopfront under an awning), NovaMerchant POS (a payment terminal) and
    NovaMerchant Biller (a receipt with a bolt), at NovaMerchant's request NB-01, with its own
    glyphs. The three share one ground, indigo-700, and are told apart by glyph: with thirteen
    colours taken, no three free palette steps stay 20 apart in Lab from the rest and from each
    other (the best three reach 17.8), and indigo-700 is the free step farthest from every other
    product (26.9, from Novus ID's blue-800) and reads white at 13:1. The distinctness rule holds
    between products, and every mark keeps a glyph of its own;
  - NovaPlan (a board);
  - NovaSearch (a lens);
  - NovaTicket (a ticket);
  - NovaEdge (an agent and branch pin);
  - Novus ID (an identity badge);
  - Design kit (a palette);
  - Internet banking (a browser window);
  - Mobile banking (a phone).
- An app with no mark in the registry shows its initial on grey (#5B6472).

### D6 Adoption by each console

| Console | Replace | Also |
|---|---|---|
| novabank (`portal/src/os`) | `AppSwitcher` (top right) and `AppLauncher` (top left) | the palette gains "Browse all"; `apps` stays as the fallback |
| novahub (`portal/src/os`) | the same pair | the same |
| novatrace (`platform/ui/src/shell/apps.js`) | the top-right switcher | `apps.json` stays as the fallback |
| novacard (`web/`) | its switcher | the same |

- Each console sets `launcher` to `https://workspace.novustech.dev` on kube dev, and leaves it
  empty for a bank's own deployment.
- Each console's gate keeps a test that the switcher is the first control in the header and the
  only grid button.

## Success criteria

- **SC-001** In all four consoles on kube dev, the first control at the top left is the same
  switcher. No other grid button exists on the bar.
- **SC-002** An operator with the same roles sees the same apps, in the same order, in each
  console's switcher and on the workspace launcher.
- **SC-003** An app added to the workspace catalog appears in every console's switcher within
  five minutes (the cache age), with no console rebuilt or redeployed.
- **SC-004** If the catalog is down or answers garbage, every console still loads at once, and its
  switcher falls back as D3 says. An entry on a host outside the allowed suffixes is never shown.
- **SC-005** The panel passes the kit's layout audit and axe at 390, 1366 and 1920 px, in both
  themes. It is operable by keyboard alone, and Escape returns focus to the button.
- **SC-006** Everything the retired destination menu offered is reachable from the search
  palette's "Browse all" view.
