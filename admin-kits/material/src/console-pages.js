/* GENERATED copy of admin-kits/shared/console-pages.js by admin-kits/data/generate.mjs. Edit the source, then regenerate. */
/* Novus Admin Kit, static flavors (Tailwind, Material): page behaviour (feature 007).
   ONE source: admin-kits/shared/console-pages.js, copied into each static flavor's
   src/ by admin-kits/data/generate.mjs. Progressive enhancement over complete
   JS-off pages: search, quick status chips with live counts, sub-filter sheet,
   active chips, list footer paging, data grid sorting, detail dialog, sample
   sign-in. Reads values through .value / .checked so native inputs and Material
   Web fields behave the same. */
import { transactions, hourly } from "./data.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* List footer: "Showing x-y of z", previous/next, page label, rows per page */
function pagedList(table, prefix) {
  const body = table.tBodies[0];
  const all = [...body.rows];
  const range = $(`#${prefix}-range`), label = $(`#${prefix}-page`);
  const prev = $(`#${prefix}-prev`), next = $(`#${prefix}-next`), size = $(`#${prefix}-size`);
  let rows = all, page = 1;
  size.value = "10";
  const render = () => {
    const per = Number(size.value), total = rows.length;
    const pages = Math.max(1, Math.ceil(total / per));
    page = Math.min(Math.max(1, page), pages);
    const start = (page - 1) * per;
    body.replaceChildren(...rows.slice(start, start + per));
    range.textContent = total ? `Showing ${start + 1}-${Math.min(start + per, total)} of ${total}` : "Showing 0 of 0";
    label.textContent = `Page ${page} of ${pages}`;
    prev.disabled = page <= 1;
    next.disabled = page >= pages;
  };
  prev.addEventListener("click", () => { page--; render(); });
  next.addEventListener("click", () => { page++; render(); });
  size.addEventListener("change", () => { page = 1; render(); });
  return { all, show(list) { rows = list; page = 1; render(); } };
}

/* ---- Transactions: filter bar with sub-filters + list footer + detail dialog ---- */
const txTable = $("#txtable");
if (txTable) {
  const list = pagedList(txTable, "tx");
  const bar = $("[data-filterbar]");
  const search = $("#txsearch");
  const chips = $(".filterchips", bar);
  const clearAll = $('[data-filter-clear="sheet"]', bar);
  const chipTpl = $("#filterchip-template");
  const trigger = $(".filtermenu__trigger", bar);
  const triggerCount = $(".filtermenu__count", bar);
  const empty = $("#txempty");
  const CATS = { product: "Product", terminal: "Terminal", amount: "Amount" };
  const inAmount = (amount, bucket) =>
    bucket === "lt200" ? amount < 200 : bucket === "200to500" ? amount >= 200 && amount < 500 : amount >= 500;
  const options = (cat) => $$(`.filtermenu__panel [name="${cat}"]`, bar);
  const ticked = (cat) => options(cat).filter((o) => o.checked);
  const optionLabel = (o) => o.closest(".filteropt").textContent.trim();

  const apply = () => {
    const q = (search.value || "").trim().toLowerCase();
    const sel = Object.fromEntries(Object.keys(CATS).map((c) => [c, ticked(c).map((o) => o.value)]));
    const base = list.all.filter((r) =>
      (!q || r.textContent.toLowerCase().includes(q)) &&
      (!sel.product.length || sel.product.includes(r.dataset.product)) &&
      (!sel.terminal.length || sel.terminal.includes(r.dataset.terminal)) &&
      (!sel.amount.length || sel.amount.some((b) => inAmount(Number(r.dataset.amount), b))));
    let status = "all";
    for (const radio of $$('[name="quickstatus"]', bar)) {
      if (radio.checked) status = radio.value;
      radio.closest(".quickchip").querySelector(".quickchip__count").textContent =
        base.filter((r) => radio.value === "all" || r.dataset.status === radio.value).length;
    }
    const rows = base.filter((r) => status === "all" || r.dataset.status === status);

    const active = Object.keys(CATS).flatMap((c) => ticked(c).map((o) => [c, o]));
    chips.replaceChildren(...active.map(([c, o]) => {
      const node = chipTpl.content.firstElementChild.cloneNode(true);
      node.querySelector(".filterchip__group").textContent = CATS[c];
      node.querySelector(".filterchip__label").textContent = optionLabel(o);
      const remove = node.querySelector(".filterchip__remove");
      remove.setAttribute("aria-label", `Remove ${CATS[c]} ${optionLabel(o)}`);
      remove.addEventListener("click", () => { o.checked = false; apply(); });
      return node;
    }), clearAll);
    chips.hidden = active.length === 0;
    triggerCount.textContent = active.length;
    triggerCount.hidden = active.length === 0;
    trigger.classList.toggle("filtermenu__trigger--on", active.length > 0);
    for (const badge of $$(".filtermenu__tabcount", bar)) {
      const n = ticked(badge.dataset.cat).length;
      badge.textContent = n;
      badge.hidden = n === 0;
    }
    empty.hidden = rows.length > 0;
    list.show(rows);
  };

  bar.addEventListener("change", apply);
  search.addEventListener("input", apply);
  clearAll.addEventListener("click", () => { Object.keys(CATS).forEach((c) => ticked(c).forEach((o) => { o.checked = false; })); apply(); });
  $('[data-filter-clear="all"]').addEventListener("click", () => {
    search.value = "";
    Object.keys(CATS).forEach((c) => ticked(c).forEach((o) => { o.checked = false; }));
    $('[name="quickstatus"][value="all"]', bar).checked = true;
    apply();
  });
  apply();

  const dialog = $("#txdialog");
  const byId = new Map(transactions.map((t) => [t.id, t]));
  $("#d-close").addEventListener("click", () => dialog.close());
  txTable.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-detail]");
    if (!btn) return;
    const t = byId.get(btn.dataset.detail);
    $("#d-id").textContent = t.id;
    $("#d-terminal").textContent = t.terminal;
    $("#d-product").textContent = t.product;
    $("#d-amount").textContent = `${t.amount.toFixed(2)} ${t.currency}`;
    $("#d-ts").textContent = t.ts.replace("T", " ").slice(0, 16);
    $("#d-status").textContent = `Status · ${t.status[0].toUpperCase()}${t.status.slice(1)}`;
    dialog.showModal();
  });
}

/* ---- Analytics: chart loaded only where the canvas exists ---- */
const volCanvas = $("#volumechart");
if (volCanvas) {
  import("./novus-chart.js").then((m) => {
    m.themeAware(() => m.volumeChart(volCanvas, hourly));
  });
}

/* ---- Data grid: search + sort + list footer ---- */
const grid = $("#gridtable");
if (grid) {
  const list = pagedList(grid, "grid");
  const search = $("#gridsearch");
  const count = $("#gridcount");
  const empty = $("#gridempty");
  const COL = { id: 0, ts: 1, terminal: 2, product: 3, amount: 4, status: 5 };
  const cell = (tr, key) => {
    const txt = tr.cells[COL[key]].textContent.trim();
    return key === "amount" ? parseFloat(txt) : txt.toLowerCase();
  };
  let sortKey = null, sortDir = 1;
  const apply = () => {
    const q = (search.value || "").trim().toLowerCase();
    let rows = list.all.filter((r) => !q || r.textContent.toLowerCase().includes(q));
    if (sortKey) rows = [...rows].sort((a, b) => (cell(a, sortKey) > cell(b, sortKey) ? sortDir : -sortDir));
    count.textContent = `${rows.length} of ${list.all.length} rows`;
    empty.hidden = rows.length > 0;
    list.show(rows);
  };
  search.addEventListener("input", apply);
  $$(".gridsort", grid).forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.key;
    sortDir = sortKey === k ? -sortDir : 1;
    sortKey = k;
    $$(".gridsort", grid).forEach((x) => x.removeAttribute("data-dir"));
    b.dataset.dir = sortDir > 0 ? "asc" : "desc";
    apply();
  }));
  apply();
}

/* ---- Sample sign-in (demo only): admin / admin ---- */
const loginForm = $("#loginform");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = $("#l-user"), pass = $("#l-pass");
    const ok = user.value === "admin" && pass.value === "admin";
    $("#loginerror").hidden = ok;
    $("#userfield").classList.toggle("field--error", !ok);
    if (ok) location.href = "index.html";
    else user.focus();
  });
}
