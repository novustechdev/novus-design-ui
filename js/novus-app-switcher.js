/* <novus-app-switcher>: the Novus app switcher, the first control in every console header.
   A nine-dot button opens a panel with a search field and a grid of the Novus apps the viewer
   may open, after the Microsoft 365 app launcher. Framework-free, light DOM, styled by
   console.css (.nv-apps*), so a React console and a plain-script console draw the same thing.
   Include it as a plain script, or import "novus-design-kit/js/novus-app-switcher.js" from a
   bundler, together with js/novus-app-marks.js, which draws each app's mark.

   <novus-app-switcher current="novabank" launcher="https://workspace.novustech.dev"></novus-app-switcher>
   Attributes
     current        this console's app id: its tile shows as current and goes nowhere
     launcher       the workspace launcher's origin; leave it out on a bank's own deployment
     catalog        the catalog's address, when it is not {launcher}/api/catalog
     allowed-hosts  host suffixes an app may live on (default ".novustech.dev .novustech.id")
     fallback       base64 JSON of the deployment's static list, [{key, name, url}]
   Property  claims: the viewer's realm roles and group names, as an array of strings
   Event     novus-app-open: detail is the app id, fired before the browser navigates; it
             bubbles and is cancelable, so a host can keep the navigation for itself

   The catalog is fetched when the panel first opens, never at page load, and is given 3 s.
   If it does not answer, or answers something unreadable, the last good copy this browser kept
   is used; failing that the static list; failing that only "All apps". An app shows when one
   of its requiredRoles is among the claims; an entry without roles, or malformed, shows to
   nobody. Only https addresses on the allowed suffixes are ever linked. Catalog text reaches
   the page through textContent and attributes only, never as markup. */
(function (global) {
  "use strict";

  var TAG = "novus-app-switcher";
  var LABEL = "Novus apps";
  var TIMEOUT_MS = 3000;
  var FRESH_MS = 300000;
  var RECENT_MAX = 4;
  var RECENT_KEY = "novus-apps.recent";
  var CACHE_KEY = "novus-apps.catalog";
  var DEFAULT_HOSTS = ".novustech.dev .novustech.id";
  var ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
  var COLOUR = /^#[0-9a-fA-F]{6}$/;

  /* ---- pure rules, shared by the element and its tests ---- */

  function suffixes(attr) {
    var text = typeof attr === "string" && attr.trim() ? attr : DEFAULT_HOSTS;
    return text.split(/[\s,]+/).map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
  }

  /* The address as https on an allowed host, or null. A leading dot admits subdomains only. */
  function allowedUrl(value, allowed) {
    if (typeof value !== "string" || !value) return null;
    var url;
    try { url = new URL(value); } catch (notAUrl) { return null; }
    if (url.protocol !== "https:" || url.username || url.password) return null;
    var host = url.hostname.toLowerCase();
    var ok = (allowed || suffixes()).some(function (s) {
      return s.charAt(0) === "." ? host.length > s.length && host.slice(-s.length) === s
        : host === s || host.slice(-(s.length + 1)) === "." + s;
    });
    return ok ? url.href : null;
  }

  function text(value, max) {
    return typeof value === "string" && value.trim() && value.length <= max ? value.trim() : "";
  }

  function roleList(value) {
    if (!Array.isArray(value) || !value.length) return null;
    for (var i = 0; i < value.length; i++) if (typeof value[i] !== "string" || !value[i]) return null;
    return value.slice();
  }

  /* The catalog as {categories, apps}, or null when it is unreadable as a whole. A malformed
     entry is kept with roles null, which no viewer satisfies; an unsafe address drops it. */
  function parseCatalog(json, allowed) {
    if (!json || typeof json !== "object" || !Array.isArray(json.apps)) return null;
    var categories = (Array.isArray(json.categories) ? json.categories : []).filter(function (c) {
      return c && typeof c.id === "string" && typeof c.name === "string";
    }).map(function (c) { return { id: c.id, name: c.name }; });
    var names = {};
    categories.forEach(function (c) { names[c.id] = c.name; });
    var seen = {};
    var apps = [];
    json.apps.forEach(function (entry) {
      if (!entry || typeof entry !== "object" || typeof entry.id !== "string" || !ID.test(entry.id) || seen[entry.id]) return;
      var url = allowedUrl(entry.url, allowed);
      if (!url) return;
      seen[entry.id] = true;
      var name = text(entry.name, 64);
      var mark = entry.mark && typeof entry.mark === "object" ? entry.mark : {};
      var category = typeof entry.category === "string" ? entry.category : "";
      apps.push({
        id: entry.id,
        name: name,
        description: typeof entry.description === "string" ? entry.description.trim() : "",
        category: category,
        categoryName: Object.prototype.hasOwnProperty.call(names, category) ? names[category] : "",
        url: url,
        colour: typeof mark.colour === "string" && COLOUR.test(mark.colour) ? mark.colour : "",
        glyph: typeof mark.glyph === "string" ? mark.glyph : "",
        roles: name ? roleList(entry.requiredRoles) : null
      });
    });
    return { categories: categories, apps: apps };
  }

  /* The deployment's static list: every usable entry, shown to every viewer, as it is today. */
  function parseStatic(encoded, allowed) {
    if (typeof encoded !== "string" || !encoded) return [];
    var list;
    try {
      var bytes = global.atob(encoded);
      var json = typeof global.TextDecoder === "function"
        ? new global.TextDecoder().decode(Uint8Array.from(bytes, function (c) { return c.charCodeAt(0); }))
        : bytes;
      list = JSON.parse(json);
    } catch (unreadable) { return []; }
    if (!Array.isArray(list)) return [];
    var seen = {};
    var apps = [];
    list.forEach(function (entry) {
      if (!entry || typeof entry !== "object") return;
      var id = typeof entry.key === "string" ? entry.key : entry.id;
      var name = text(entry.name, 64);
      var url = allowedUrl(entry.url, allowed);
      if (typeof id !== "string" || !ID.test(id) || seen[id] || !name || !url) return;
      seen[id] = true;
      apps.push({ id: id, name: name, description: "", category: "", categoryName: "", url: url,
        colour: "", glyph: id, roles: "any" });
    });
    return apps;
  }

  function isVisible(app, claims) {
    if (app.roles === "any") return true;
    if (!Array.isArray(app.roles) || !Array.isArray(claims)) return false;
    return app.roles.some(function (role) { return claims.indexOf(role) !== -1; });
  }

  /* Recent apps first, most recent first; then the catalog's category order; then catalog order. */
  function ordered(apps, categories, recents) {
    var rank = {};
    (categories || []).forEach(function (c, i) { rank[c.id] = i; });
    var last = (categories || []).length;
    var recent = (recents || []).map(function (id) {
      return apps.filter(function (app) { return app.id === id; })[0];
    }).filter(Boolean);
    var rest = apps.map(function (app, i) { return { app: app, i: i }; })
      .filter(function (x) { return recent.indexOf(x.app) === -1; })
      .sort(function (a, b) {
        var ra = Object.prototype.hasOwnProperty.call(rank, a.app.category) ? rank[a.app.category] : last;
        var rb = Object.prototype.hasOwnProperty.call(rank, b.app.category) ? rank[b.app.category] : last;
        return ra - rb || a.i - b.i;
      })
      .map(function (x) { return x.app; });
    return recent.concat(rest);
  }

  function matches(app, query) {
    var q = (query || "").trim().toLowerCase();
    if (!q) return true;
    return [app.name, app.description, app.categoryName].some(function (field) {
      return field.toLowerCase().indexOf(q) !== -1;
    });
  }

  function readRecents(storage) {
    try {
      var parsed = JSON.parse(storage.getItem(RECENT_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (id, i) {
        return typeof id === "string" && ID.test(id) && parsed.indexOf(id) === i;
      }).slice(0, RECENT_MAX);
    } catch (unavailable) { return []; }
  }

  function remember(storage, id) {
    var next = [id].concat(readRecents(storage).filter(function (x) { return x !== id; })).slice(0, RECENT_MAX);
    try { storage.setItem(RECENT_KEY, JSON.stringify(next)); } catch (unavailable) { /* lasts this page */ }
    return next;
  }

  function fetchJson(url, fetcher, timeoutMs) {
    var controller = typeof global.AbortController === "function" ? new global.AbortController() : null;
    var timer = null;
    var bound = new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        if (controller) controller.abort();
        reject(new Error("catalog did not answer in time"));
      }, timeoutMs);
    });
    var request = fetcher(url, {
      credentials: "omit",
      headers: { Accept: "application/json" },
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (!response.ok) throw new Error("catalog answered " + response.status);
      return response.json();
    });
    return Promise.race([request, bound]).then(function (json) {
      clearTimeout(timer);
      return json;
    }, function (error) {
      clearTimeout(timer);
      throw error;
    });
  }

  /* The apps to offer, by D3's chain: the catalog, this browser's last good copy of it, the
     static list, or none (the panel then holds only "All apps"). Never rejects. */
  function resolve(options) {
    var allowed = options.allowed || suffixes();
    var storage = options.storage;
    var staticList = function () {
      var apps = parseStatic(options.fallback, allowed);
      return { source: apps.length ? "static" : "none", categories: [], apps: apps };
    };
    var cached = function () {
      try {
        var kept = JSON.parse(storage.getItem(CACHE_KEY) || "null");
        var parsed = kept && kept.url === options.url ? parseCatalog(kept.catalog, allowed) : null;
        if (parsed) return { source: "cache", categories: parsed.categories, apps: parsed.apps };
      } catch (unavailable) { /* fall through */ }
      return staticList();
    };
    if (!options.url || typeof options.fetch !== "function") return Promise.resolve(staticList());
    return fetchJson(options.url, options.fetch, options.timeoutMs || TIMEOUT_MS).then(function (json) {
      var parsed = parseCatalog(json, allowed);
      if (!parsed) return cached();
      try { storage.setItem(CACHE_KEY, JSON.stringify({ url: options.url, catalog: json })); } catch (full) { /* not kept */ }
      return { source: "catalog", categories: parsed.categories, apps: parsed.apps };
    }, cached);
  }

  global.NovusAppSwitcher = Object.freeze({
    suffixes: suffixes, allowedUrl: allowedUrl, parseCatalog: parseCatalog, parseStatic: parseStatic,
    isVisible: isVisible, ordered: ordered, matches: matches, readRecents: readRecents,
    remember: remember, resolve: resolve, timeoutMs: TIMEOUT_MS, recentMax: RECENT_MAX
  });

  if (!global.customElements || !global.HTMLElement || global.customElements.get(TAG)) return;

  /* ---- the element ---- */

  var WAFFLE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">' +
    '<circle cx="5" cy="5" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="19" cy="5" r="1.8"/>' +
    '<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>' +
    '<circle cx="5" cy="19" r="1.8"/><circle cx="12" cy="19" r="1.8"/><circle cx="19" cy="19" r="1.8"/></svg>';
  var LENS = '<svg class="icon icon--sm nv-apps__lens" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>';
  var ALL = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/>' +
    '<rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>' +
    '<path d="m16.75 3.6 3.15 3.15-3.15 3.15-3.15-3.15Z"/></svg>';
  var count = 0;

  function storage() {
    try { return global.localStorage; } catch (blocked) { return null; }
  }
  var safeStorage = {
    getItem: function (k) { var s = storage(); return s ? s.getItem(k) : null; },
    setItem: function (k, v) { var s = storage(); if (s) s.setItem(k, v); }
  };

  function el(tag, cls, textValue) {
    var node = global.document.createElement(tag);
    if (cls) node.className = cls;
    if (textValue) node.textContent = textValue;
    return node;
  }

  function mark(app) {
    var marks = global.NovusAppMarks;
    var known = marks && marks.has(app.glyph) ? marks.get(app.glyph) : null;
    var node = el("span", "nv-apps__mark");
    node.setAttribute("aria-hidden", "true");
    if (known) {
      node.style.background = app.colour || known.colour;
      node.innerHTML = marks.svg(app.glyph, 26);
    } else {
      node.style.background = marks ? marks.unknown.colour : "var(--neutral-600)";
      node.classList.add("nv-apps__mark--initial");
      node.textContent = app.name.charAt(0).toUpperCase();
    }
    return node;
  }

  class NovusAppSwitcherElement extends global.HTMLElement {
    static get observedAttributes() { return ["current", "launcher", "catalog", "allowed-hosts", "fallback"]; }

    constructor() {
      super();
      this._claims = [];
      this._data = null;
      this._at = 0;
      this._pending = null;
      this._query = "";
      this._onAway = this._onAway.bind(this);
      this._onEscape = this._onEscape.bind(this);
      this._onResize = this._place.bind(this);
    }

    get claims() { return this._claims.slice(); }
    set claims(value) {
      this._claims = Array.isArray(value) ? value.filter(function (c) { return typeof c === "string"; }) : [];
      if (this._data) this._render();
    }

    connectedCallback() {
      /* A host that set claims before this script defined the element left a plain property
         behind, which would hide the accessor; it is taken over here. */
      if (Object.prototype.hasOwnProperty.call(this, "claims")) {
        var early = this.claims;
        delete this.claims;
        this.claims = early;
      }
      if (!this._button) this._build();
      this._sync();
    }

    disconnectedCallback() { this.close(false); }

    attributeChangedCallback() {
      this._data = null;
      this._pending = null;
      if (this._button) this._sync();
    }

    get _launcher() { return allowedUrl(this.getAttribute("launcher") || "", suffixes(this.getAttribute("allowed-hosts"))); }

    get _catalogUrl() {
      var explicit = this.getAttribute("catalog");
      if (explicit) return explicit;
      var launcher = this._launcher;
      return launcher ? new URL("api/catalog", launcher).href : "";
    }

    _sync() {
      this.hidden = !this._catalogUrl && !this.getAttribute("fallback") && !this._launcher;
    }

    _build() {
      var id = "nv-apps-" + (++count);
      this._button = el("button", "nv-apps__button");
      this._button.type = "button";
      this._button.setAttribute("aria-label", LABEL);
      this._button.title = LABEL;
      this._button.setAttribute("aria-haspopup", "dialog");
      this._button.setAttribute("aria-expanded", "false");
      this._button.setAttribute("aria-controls", id);
      this._button.innerHTML = WAFFLE;

      this._panel = el("div", "nv-apps__panel");
      this._panel.id = id;
      this._panel.hidden = true;
      this._panel.setAttribute("role", "dialog");
      this._panel.setAttribute("aria-label", LABEL);
      this._panel.tabIndex = -1;
      var search = el("div", "nv-apps__search");
      search.innerHTML = LENS;
      this._input = el("input", "input nv-apps__input");
      this._input.type = "search";
      this._input.placeholder = "Find Novus apps";
      this._input.setAttribute("aria-label", "Find Novus apps");
      this._input.autocomplete = "off";
      this._input.spellcheck = false;
      search.appendChild(this._input);
      this._status = el("p", "nv-apps__status");
      this._status.setAttribute("role", "status");
      this._grid = el("ul", "nv-apps__grid");
      this._grid.setAttribute("aria-label", "Apps");
      this._panel.append(search, this._status, this._grid);
      this.append(this._button, this._panel);

      var self = this;
      this._button.addEventListener("click", function () { if (self.isOpen) self.close(false); else self.open(); });
      this._input.addEventListener("input", function () { self._query = self._input.value; self._render(); });
      this._panel.addEventListener("keydown", function (event) { self._onKey(event); });
      this._grid.addEventListener("click", function (event) { self._onActivate(event); });
    }

    get isOpen() { return !!this._panel && !this._panel.hidden; }

    open() {
      if (!this._button || this.isOpen) return;
      this._panel.hidden = false;
      this._button.setAttribute("aria-expanded", "true");
      this._place();
      global.document.addEventListener("pointerdown", this._onAway, true);
      global.document.addEventListener("keydown", this._onEscape);
      global.addEventListener("resize", this._onResize);
      this._input.focus();
      this._load();
      this._render();
    }

    close(returnFocus) {
      if (!this.isOpen) return;
      this._panel.hidden = true;
      this._button.setAttribute("aria-expanded", "false");
      global.document.removeEventListener("pointerdown", this._onAway, true);
      global.document.removeEventListener("keydown", this._onEscape);
      global.removeEventListener("resize", this._onResize);
      if (returnFocus) this._button.focus();
    }

    /* Below 600px the panel is a sheet under the header, so it needs the header's lower edge. */
    _place() {
      var bar = this.closest("header, .appbar") || this;
      this.style.setProperty("--nv-apps-top", Math.round(bar.getBoundingClientRect().bottom) + "px");
    }

    _onAway(event) {
      if (event.target instanceof global.Node && this.contains(event.target)) return;
      var self = this;
      this.close(false);
      setTimeout(function () {
        var active = global.document.activeElement;
        if (!active || active === global.document.body) self._button.focus();
      }, 0);
    }

    /* Escape closes from anywhere while open, even after a press on the panel's blank space. */
    _onEscape(event) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      this.close(true);
    }

    _load() {
      if (this._pending || (this._data && Date.now() - this._at < FRESH_MS)) return;
      var self = this;
      this._pending = resolve({
        url: this._catalogUrl,
        fetch: typeof global.fetch === "function" ? global.fetch.bind(global) : null,
        storage: safeStorage,
        fallback: this.getAttribute("fallback") || "",
        allowed: suffixes(this.getAttribute("allowed-hosts"))
      }).then(function (data) {
        self._data = data;
        self._at = Date.now();
        self._pending = null;
        self._render();
      });
    }

    _render() {
      if (!this._grid) return;
      this._grid.textContent = "";
      if (!this._data) {
        this._status.textContent = "Loading apps";
        this._status.className = "nv-apps__status";
        return;
      }
      var claims = this._claims;
      var query = this._query;
      var current = this.getAttribute("current") || "";
      var apps = ordered(this._data.apps.filter(function (app) { return isVisible(app, claims); }),
        this._data.categories, readRecents(safeStorage)).filter(function (app) { return matches(app, query); });
      var self = this;
      apps.forEach(function (app) { self._grid.appendChild(self._tile(app, app.id === current)); });
      var launcher = this._launcher;
      if (launcher) {
        var all = el("a", "nv-apps__tile nv-apps__tile--all");
        all.href = launcher;
        all.title = "Every Novus app, grouped by category";
        var allMark = el("span", "nv-apps__mark nv-apps__mark--all");
        allMark.setAttribute("aria-hidden", "true");
        allMark.innerHTML = ALL;
        all.append(allMark, el("span", "nv-apps__name", "All apps"));
        var li = el("li");
        li.appendChild(all);
        this._grid.appendChild(li);
      }
      var said = !apps.length && query.trim() ? "No app matches" : !apps.length && !launcher ? "No app is available to your sign-in" : "";
      this._status.textContent = said || (apps.length === 1 ? "1 app" : apps.length + " apps");
      this._status.className = said ? "nv-apps__status" : "nv-apps__status sr-only";
    }

    _tile(app, current) {
      var tile = el(current ? "span" : "a", "nv-apps__tile" + (current ? " nv-apps__tile--current" : ""));
      tile.setAttribute("data-app", app.id);
      if (current) {
        tile.setAttribute("aria-current", "page");
        tile.title = "You're here";
      } else {
        tile.href = app.url;
        if (app.description) tile.title = app.description;
      }
      tile.append(mark(app), el("span", "nv-apps__name", app.name));
      var li = el("li");
      li.appendChild(tile);
      if (app.description) {
        /* The description is the tile's accessible description, not part of its name. */
        var said = el("span", "", app.description);
        said.id = this._panel.id + "-" + app.id;
        said.hidden = true;
        tile.setAttribute("aria-describedby", said.id);
        li.appendChild(said);
      }
      return li;
    }

    _onActivate(event) {
      var link = event.target && event.target.closest ? event.target.closest("a.nv-apps__tile[data-app]") : null;
      if (!link || !this._grid.contains(link)) return;
      var id = link.getAttribute("data-app");
      remember(safeStorage, id);
      var go = this.dispatchEvent(new global.CustomEvent("novus-app-open", { detail: id, bubbles: true, composed: true, cancelable: true }));
      if (!go) event.preventDefault();
      else if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) this.close(false);
    }

    _cells() { return Array.prototype.slice.call(this._grid.querySelectorAll(".nv-apps__tile")); }

    _columns(cells) {
      if (!cells.length) return 1;
      var top = cells[0].offsetTop;
      var n = cells.filter(function (c) { return c.offsetTop === top; }).length;
      return Math.max(1, n);
    }

    _onKey(event) {
      var doc = global.document;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
        return;
      }
      var cells = this._cells();
      var links = cells.filter(function (c) { return c.tagName === "A"; });
      var focusables = [this._input].concat(links);
      var active = doc.activeElement;
      if (event.key === "Tab") {
        var at = focusables.indexOf(active);
        if (event.shiftKey && at <= 0) { event.preventDefault(); focusables[focusables.length - 1].focus(); }
        else if (!event.shiftKey && at === focusables.length - 1) { event.preventDefault(); focusables[0].focus(); }
        return;
      }
      if (active === this._input) {
        if (event.key === "ArrowDown" && links.length) { event.preventDefault(); links[0].focus(); }
        return;
      }
      var from = cells.indexOf(active);
      if (from === -1) return;
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== " ") {
        event.preventDefault();
        this._input.focus();
        this._input.value += event.key;
        this._query = this._input.value;
        this._render();
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        this._input.focus();
        return;
      }
      var target = this._step(event.key, from, cells);
      if (target === undefined) return;
      event.preventDefault();
      if (target === -1) this._input.focus();
      else cells[target].focus();
    }

    /* Where an arrow, Home or End moves focus in the grid as drawn: an index, -1 for the search
       field, or undefined when the key is not one of these. The current tile takes no focus. */
    _step(key, from, cells) {
      var ok = function (i) { return cells[i] && cells[i].tagName === "A"; };
      var first = -1, last = -1;
      cells.forEach(function (c, i) { if (ok(i)) { if (first === -1) first = i; last = i; } });
      if (key === "Home") return first === -1 ? from : first;
      if (key === "End") return last === -1 ? from : last;
      var cols = this._columns(cells);
      var delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols }[key];
      if (!delta) return undefined;
      var i = from + delta;
      if (key === "ArrowDown" && i >= cells.length && Math.floor(from / cols) < Math.floor((cells.length - 1) / cols)) i = cells.length - 1;
      while (i >= 0 && i < cells.length && !ok(i)) i += delta;
      if (i < 0) return key === "ArrowUp" ? -1 : from;
      return i < cells.length ? i : from;
    }
  }

  global.customElements.define(TAG, NovusAppSwitcherElement);
}(typeof window !== "undefined" ? window : globalThis));
