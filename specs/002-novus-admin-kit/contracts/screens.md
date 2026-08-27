# Contract: Admin Kit screen parity

Both flavors implement exactly these screens against the shared dataset. A screen
change edits this contract first, then both flavors in the same change.

## Shell (every screen)

- Internal-tool header (two-mark rule): app identifier "novapay operations · admin"
  left; utility cluster (theme toggle); divider; Novus master lockup far right
  (colour/white pair). Below 520px the divider drops, endorsement steps down.
- Sidebar nav: Dashboard, Transactions, Terminals, Settings; current page carries
  `aria-current="page"`; collapses to a native details menu under 900px.
- Content in the shared centered column; white page ground; one accent (default
  Novus Blue).

## Screens

| Screen | Route (tailwind / blazor) | Contents |
|---|---|---|
| Dashboard | `index.html` / `/` | KPI statrow (4 kpis), signal cards (danger first, red; then warning), recent transactions table (latest 6, link to Transactions) |
| Transactions | `transactions.html` / `/transactions` | Full table (24 rows): id, time, terminal, product, amount (num, right), status chip; status filter (All/Settled/Pending/Failed); row action opens native dialog with details; empty state = text + reset button |
| Terminals | `terminals.html` / `/terminals` | Fleet table (12): id, location, product, uptime (num), health chip, last seen; degraded/offline sorted first |
| Settings | `settings.html` / `/settings` | Profile form (name, email, role select: does not persist, states so) + Appearance card with the kit theme toggle |

## Conventions demonstrated (and asserted in review)

- Traffic-light only on status/health chips and signal accents; amounts/uptime
  numerals neutral.
- Risk message (failed settlement signal) red, always.
- Chips self-describing: "Status · Settled", "Health · Degraded".
- Hover lift only on clickable cards/rows that open something.
- Tables scroll inside their container at 375px; no page-level horizontal scroll.
