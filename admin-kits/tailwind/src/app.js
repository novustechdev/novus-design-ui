import "novus-design-kit/js/novus-theme.js";
import "./admin.css";
import { transactions } from "./data.js";

document.querySelectorAll("[data-theme-toggle]").forEach((b) =>
  b.addEventListener("click", () => window.novusTheme.toggle())
);

/* Transactions: progressive filter + native detail dialog */
const table = document.getElementById("txtable");
if (table) {
  const filter = document.getElementById("statusfilter");
  const count = document.getElementById("txcount");
  const empty = document.getElementById("txempty");
  const rows = [...table.querySelectorAll("tbody tr")];
  const apply = () => {
    const v = filter.value;
    let shown = 0;
    rows.forEach((r) => {
      const on = v === "all" || r.dataset.status === v;
      r.hidden = !on;
      if (on) shown++;
    });
    count.textContent = `${shown} of ${rows.length}`;
    empty.hidden = shown > 0;
  };
  filter.addEventListener("change", apply);
  document.getElementById("txreset").addEventListener("click", () => { filter.value = "all"; apply(); });
  apply();

  const dialog = document.getElementById("txdialog");
  const byId = new Map(transactions.map((t) => [t.id, t]));
  document.getElementById("d-close").addEventListener("click", () => dialog.close());
  table.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-detail]");
    if (!btn) return;
    const t = byId.get(btn.dataset.detail);
    document.getElementById("d-id").textContent = t.id;
    document.getElementById("d-terminal").textContent = t.terminal;
    document.getElementById("d-product").textContent = t.product;
    document.getElementById("d-amount").textContent = `${t.amount.toFixed(2)} ${t.currency}`;
    document.getElementById("d-ts").textContent = t.ts.replace("T", " ").slice(0, 16);
    document.getElementById("d-status").textContent = `Status · ${t.status[0].toUpperCase()}${t.status.slice(1)}`;
    dialog.showModal();
  });
}

/* Analytics: chart loaded only where the canvas exists */
const volCanvas = document.getElementById("volumechart");
if (volCanvas) {
  Promise.all([import("./novus-chart.js"), import("./data.js")]).then(([m, d]) => {
    m.themeAware(() => m.volumeChart(volCanvas, d.hourly));
  });
}

/* Data grid: progressive sort + search + pagination over the static rows */
const grid = document.getElementById("gridtable");
if (grid) {
  const PAGE = 10;
  const body = grid.querySelector("tbody");
  const all = [...body.querySelectorAll("tr")];
  const cellVal = (tr, key) => {
    const i = { id: 0, ts: 1, terminal: 2, product: 3, amount: 4, status: 5 }[key];
    const txt = tr.cells[i].textContent.trim();
    return key === "amount" ? parseFloat(txt) : txt.toLowerCase();
  };
  let rows = all, page = 0, sortKey = null, sortDir = 1;
  const search = document.getElementById("gridsearch");
  const count = document.getElementById("gridcount");
  const label = document.getElementById("gridpage");
  const render = () => {
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    page = Math.min(page, pages - 1);
    body.replaceChildren(...rows.slice(page * PAGE, page * PAGE + PAGE));
    count.textContent = `${rows.length} of ${all.length} rows`;
    label.textContent = `Page ${page + 1} of ${pages}`;
  };
  const apply = () => {
    const q = search.value.trim().toLowerCase();
    rows = all.filter((r) => !q || r.textContent.toLowerCase().includes(q));
    if (sortKey) rows = [...rows].sort((a, b) => (cellVal(a, sortKey) > cellVal(b, sortKey) ? sortDir : -sortDir));
    page = 0;
    render();
  };
  search.addEventListener("input", apply);
  document.getElementById("gridprev").addEventListener("click", () => { page--; render(); });
  document.getElementById("gridnext").addEventListener("click", () => { page++; render(); });
  grid.querySelectorAll(".gridsort").forEach((b) =>
    b.addEventListener("click", () => {
      const k = b.dataset.key;
      sortDir = sortKey === k ? -sortDir : 1;
      sortKey = k;
      grid.querySelectorAll(".gridsort").forEach((x) => x.removeAttribute("data-dir"));
      b.dataset.dir = sortDir > 0 ? "asc" : "desc";
      apply();
    })
  );
  apply();
}
