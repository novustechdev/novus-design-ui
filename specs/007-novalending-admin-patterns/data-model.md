# Data model: Admin patterns (feature 007)

The feature adds no persisted data. The entities below are view models and
documentation records; field names are the ones the flavors and the build use.

## Pattern (documentation record, `site/components.json`)

| field | type | rule |
|---|---|---|
| id | string | kebab-case, unique; page `components/<id>.html` |
| name | string | sentence case |
| category | enum | General, Layout, Data Display, Feedback, Forms, Navigation, Theming, Templates (new) |
| classes | string[] | one line in the JSON (ownership gates count lines); new pattern classes are listed plainly, tokens.css classes only as "composes .x" |
| fragment | path | must exist (gate) |
| summary | string | one sentence, no em dash |
| css | string[] (new, optional) | names of `@pattern` sections in `admin-kits/shared/novus-admin.css`; the build renders each as a copyable CSS block and fails if a name is missing |

New records: `sign-in-page`, `signed-out-page` (Templates); `user-menu`,
`side-navigation` (Navigation); `page-header` (Layout); `filter-bar` (Forms).
Updated: `pagination` (list footer), `table` (content fit), `breadcrumb`
(`.crumbs`, slash separator), `app-shell` (console header). Total 34 to 40.

## Icon (`admin-kits/shared/icons.mjs`)

| field | type | rule |
|---|---|---|
| name | string | kebab-case, unique |
| body | string | inner SVG elements on a 24-unit grid; no fill, no colour, no transforms |
| label | string | human name for the Icons page |

Rendering contract: `<svg class="icon[ icon--sm|icon--lg]" viewBox="0 0 24 24"
fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
stroke-linejoin="round" aria-hidden="true">body</svg>`.

## Filter category and option (Transactions)

| entity | fields | rules |
|---|---|---|
| FilterCategory | key (`product`, `terminal`, `amount`), label, options[] | shown in this order; six categories maximum per sheet |
| FilterOption | category key, value, label | product values from the dataset; terminal values = distinct terminals sorted; amount values `lt200`, `200to500`, `gte500` |
| ActiveFilter | category key, value | a category with no ticked option does not narrow; ticked options within a category OR together; categories AND together |
| QuickChip | value (`all`, `settled`, `pending`, `failed`), label, count | exactly one selected; count = records matching search + active filters + this status (`all` ignores status) |

Amount buckets: `lt200` amount < 200; `200to500` 200 <= amount < 500;
`gte500` amount >= 500.

## List view state

| field | type | rules |
|---|---|---|
| query | string | case-insensitive substring over id, terminal, product, status |
| status | QuickChip value | default `all` |
| filters | ActiveFilter[] | default empty |
| sort | key + direction | Data grid only |
| page | int (1-based) | clamps to 1..pageCount; resets to 1 when query, status, filters, or pageSize change |
| pageSize | 10, 20, 50 | default 10 |

Derived: `total` = matching records; `pageCount` = max(1, ceil(total/pageSize));
range text = `Showing {start}-{end} of {total}` where start = total ? (page-1)*pageSize+1 : 0
and end = min(page*pageSize, total); when total is 0 the text is `Showing 0 of 0`;
previous disabled when page = 1; next disabled when page = pageCount.

## Session (sample only)

Sign-in accepts `admin` / `admin` and routes to the dashboard; any other pair
shows the inline error and keeps the username. Sign out routes to the
signed-out page; "Sign in again" routes to sign-in. Nothing is stored.
