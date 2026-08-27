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
