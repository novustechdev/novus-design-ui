# UI contract: console patterns (feature 007)

The markup below is the public contract every flavor and every catalog example
renders. Class names are owned by `admin-kits/shared/novus-admin.css`; tokens.css
classes (`.btn`, `.badge`, `.card`, `.field`, `.input`, `.select`, `.table`,
`.vlogo`, `.wm`, `.appbar`, `.appheader*`) are composed, never redefined in
meaning. Icons are written as `{icon:name}` and expand to the rendering contract
in data-model.md. Pattern sections in the CSS are delimited by
`/* @pattern <id> */` and `/* @end */`.

## content-fit

- `.btn`, `.badge`, `.filterchip`, `.quickchip`, `.crumbs li`: single-line.
- `.tablewrap` scrolls horizontally; `.tablewrap .table th, .tablewrap .table td`
  are single-line; `td.cell--wrap` wraps with `min-width: 16rem`.
- `.num`: right-aligned tabular numerals (header and cell together).
- `td.cell--actions`, `th.cell--actions`: right-aligned, buttons in one row.
- `.cell-stack`: primary line plus `.cell-stack__meta` second line (an
  intentional two-line cell, both lines single-line).
- `.truncate`: one line with ellipsis; the element MUST carry the full value in
  `title` or visible nearby text.

## console-shell

```html
<div class="adminwrap">
  <input type="checkbox" id="navtoggle" class="navtoggle__input" aria-label="Show or hide the menu">
  <header class="appbar">
    <div class="appbar__inner appheader">
      <div class="appheader__left">
        <label for="navtoggle" class="btn btn--ghost btn--sm toggle44 navtoggle" title="Menu">{icon:menu}</label>
        <span class="theme-novapay vlogo">…pictograph svg.vmark… <span class="wm"><span class="nm">nova</span><span class="sf">pay</span></span></span>
        <span class="muted appsuffix">operations</span>
      </div>
      <div class="appheader__right">
        <span class="appheader__endorse"><span class="brandmark" role="img" aria-label="Novus Technologies"></span></span>
        <span class="appheader__sep"></span>
        …user-menu…
      </div>
    </div>
  </header>
  <label for="navtoggle" class="navscrim" aria-hidden="true"></label>
  <div class="adminbody">
    …side-navigation…
    <main class="adminmain">…page-header… content</main>
  </div>
</div>
```

States: at >= 900px unchecked = sidebar visible, checked = collapsed; below 900px
unchecked = drawer closed, checked = drawer open with scrim.

## side-navigation

```html
<nav class="adminnav" id="adminnav" aria-label="Console">
  <div class="adminnav__head"><span class="theme-novapay vlogo">…</span>
    <label for="navtoggle" class="btn btn--ghost btn--sm toggle44" title="Close menu">{icon:close}</label></div>
  <a class="navlink" href="index.html" aria-current="page">{icon:dashboard} Dashboard</a>
  <details class="navgroup" open>
    <summary class="navgroup__label">{icon:transactions}<span>Operations</span>{icon:chevron-down .navgroup__chevron}</summary>
    <a class="navlink" href="transactions.html">Transactions</a>
  </details>
</nav>
```

Admin Kit navigation (all flavors): Dashboard, Analytics (top level, icons);
group Operations (Transactions, Data grid, Terminals); group Configuration
(Settings). The group holding the current page renders `open`; the current link
carries `aria-current="page"`.

## page-header

```html
<div class="pagehead">
  <nav class="crumbs" aria-label="Breadcrumb"><ol>
    <li><a href="index.html">Operations</a></li>
    <li aria-current="page">Transactions</li>
  </ol></nav>
  <div class="pagehead__row">
    <h1>Transactions</h1>
    <div class="pagehead__actions"><a class="btn btn--secondary btn--sm" href="…">{icon:download} Export CSV</a></div>
  </div>
  <p class="muted pagehead__desc">One line of description.</p>
</div>
```

## user-menu

```html
<details class="userdd" data-dismiss>
  <summary class="btn btn--ghost btn--sm userdd__trigger" aria-label="Account menu">
    {icon:user icon--sm}<span class="userdd__name truncate" title="ops.admin">ops.admin</span>{icon:chevron-down icon--sm}
  </summary>
  <div class="card userdd__menu">
    <div class="userdd__who"><b>Operations Admin</b><span class="muted">ops.admin@novustech.com.sg</span></div>
    <div class="userdd__row"><span class="muted">Theme</span>
      <button type="button" class="btn btn--ghost btn--sm toggle44 themetoggle" data-theme-toggle aria-label="Toggle light and dark theme">{icon:moon .ic-moon}{icon:sun .ic-sun}</button></div>
    <div class="userdd__foot"><a class="btn btn--secondary btn--sm" href="signed-out.html">{icon:sign-out} Sign out</a></div>
  </div>
</details>
```

## sign-in-page

```html
<body class="authpage">
<div class="authsplit">
  <aside class="authbrand"><div class="authbrand__inner">
    <span class="theme-novapay vlogo authbrand__lockup">…</span>
    <p class="authbrand__tagline">…</p>
    <ul class="authbrand__modules"><li>Transactions</li>…</ul>
  </div></aside>
  <main class="authmain">
    <form class="card authcard" …>
      <svg class="authcard__mark" …pictograph…></svg>
      <h1 class="authcard__title">Sign in to the operations console</h1>
      <p class="muted authcard__sub">…</p>
      <div class="field [field--error]">
        <label for="l-user">Username<span class="field__req" aria-hidden="true">*</span></label>
        <input class="input" id="l-user" name="username" autocomplete="username" required aria-describedby="loginerror">
        <p class="field__error" id="loginerror" role="alert" [hidden]>Wrong username or password. Use admin / admin.</p>
      </div>
      <div class="field">
        <label for="l-pass">Password<span class="field__req" aria-hidden="true">*</span></label>
        <div class="pwgroup">
          <input class="input" id="l-pass" name="password" type="password" autocomplete="current-password" required>
          <button type="button" class="pwtoggle" data-password-toggle aria-controls="l-pass" aria-pressed="false" aria-label="Show password">{icon:eye .pwtoggle__show}{icon:eye-off .pwtoggle__hide}</button>
        </div>
      </div>
      <button class="btn btn--primary btn--lg authcard__submit">Sign in</button>
      <details class="authcard__forgot"><summary>Forgot password?</summary><p class="muted">In this sample, password resets are handled by your administrator.</p></details>
      <div class="authcard__foot"><span class="muted">Managed by</span><span class="brandmark" role="img" aria-label="Novus Technologies"></span></div>
    </form>
  </main>
</div>
```

## signed-out-page

```html
<main class="signedout">
  <div class="card signedout__card">
    <div class="signedout__brand"><span class="theme-novapay vlogo">…</span><span class="muted appsuffix">operations</span></div>
    <p class="signedout__workspace">{icon:workspace icon--sm} novapay operations console</p>
    <h1 class="signedout__title">You have signed out</h1>
    <p class="muted signedout__lead">Your session on this browser is closed.</p>
    <div class="signedout__actions"><a class="btn btn--primary" href="login.html">Sign in again</a></div>
    <p class="signedout__note">If you did not sign out yourself, sign in again and tell your administrator.</p>
    <div class="signedout__foot"><span class="muted">Managed by</span><span class="brandmark" role="img" aria-label="Novus Technologies"></span></div>
  </div>
</main>
```

## filter-bar

```html
<div class="filterbar" data-filterbar>
  <div class="quickchips" role="radiogroup" aria-label="Status">
    <label class="quickchip"><input type="radio" name="status" value="all" checked><span>All</span><span class="quickchip__count">24</span></label>
    …
  </div>
  <div class="filterbar__top">
    <label class="filterbar__search">{icon:search icon--sm}<input class="input" type="search" placeholder="Search id, terminal, or product" aria-label="Search transactions"></label>
    <details class="filtermenu" data-dismiss>
      <summary class="filtermenu__trigger">{icon:filter icon--sm}<span>Filters</span><span class="filtermenu__count" hidden>0</span>{icon:chevron-down icon--sm}</summary>
      <div class="filtermenu__sheet" role="group" aria-label="Filters">
        <div class="filtermenu__tabs" role="radiogroup" aria-label="Filter category">
          <label class="filtermenu__tab"><input type="radio" name="filtercat" checked><span class="truncate">Product</span>{icon:chevron-right .filtermenu__chev}</label>
          …
        </div>
        <div class="filtermenu__panels">
          <fieldset class="filtermenu__panel"><legend class="filtermenu__head">Product</legend>
            <label class="filteropt"><input type="checkbox" name="product" value="novapay"><span class="truncate">novapay</span></label>
            …
          </fieldset>
          …
        </div>
      </div>
    </details>
  </div>
  <div class="filterchips" hidden>
    <span class="filterchip"><span class="filterchip__group">Product</span><span class="filterchip__label">novapay</span>
      <button type="button" class="filterchip__remove" data-remove="product:novapay" aria-label="Remove Product novapay">{icon:close icon--sm}</button></span>
    <button type="button" class="linkbtn" data-filter-clear>Clear all</button>
  </div>
</div>
```

The N-th tab radio shows the N-th panel (generic rule up to six categories).
The trigger takes `.filtermenu__trigger--on` and an unhidden count while any
option is ticked.

## list-footer

```html
<div class="listfooter">
  <span class="listfooter__range">Showing 1-10 of 24</span>
  <div class="listfooter__controls">
    <div class="paginator">
      <button type="button" aria-label="Previous page" disabled>{icon:chevron-left}</button>
      <span class="paginator__label">Page 1 of 3</span>
      <button type="button" aria-label="Next page">{icon:chevron-right}</button>
    </div>
    <span class="selectwrap"><select class="select listfooter__size" aria-label="Rows per page">
      <option value="10" selected>10 / page</option><option value="20">20 / page</option><option value="50">50 / page</option>
    </select></span>
  </div>
</div>
```
