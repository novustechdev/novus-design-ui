/* Novus dashboard-chart defaults (locked rules): token-fed at runtime, zero
   colour literals. Composition (stacked product bars) + trajectory (total line). */
import { Chart, BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const t = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const rgba = (name, a) => {
  const c = t(name);
  const n = parseInt(c.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export function volumeChart(canvas, hourly) {
  const grid = rgba("--neutral-500", 0.13);
  const products = [
    ["novapay", t("--blue-500")],
    ["novabank", t("--green-500")],
    ["novastore", t("--amber-400")],
  ];
  const totals = hourly.hours.map((_, i) =>
    products.reduce((sum, [p]) => sum + hourly.series[p][i], 0)
  );
  const datasets = products.map(([p, color], idx) => ({
    type: "bar",
    label: p,
    data: hourly.series[p],
    backgroundColor: color,
    stack: "volume",
    maxBarThickness: 28,
    categoryPercentage: 0.62,
    /* rounded top segment only */
    borderRadius: idx === products.length - 1 ? { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 } : 0,
    borderSkipped: false,
  }));
  datasets.push({
    type: "line",
    label: "total",
    data: totals,
    borderColor: t("--text-secondary"),
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.3,
  });
  return new Chart(canvas, {
    data: { labels: hourly.hours, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      font: { family: t("--font-sans") },
      color: t("--text-secondary"),
      plugins: {
        legend: { labels: { color: t("--text-secondary"), font: { family: t("--font-sans") }, boxWidth: 12 } },
        tooltip: {
          backgroundColor: t("--neutral-900"),
          titleColor: t("--text-on-accent"),
          bodyColor: t("--text-on-accent"),
          cornerRadius: 8,
          usePointStyle: true,
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, border: { display: false },
             ticks: { color: t("--text-muted"), font: { family: t("--font-sans") } } },
        y: { stacked: true, grid: { color: grid, borderDash: [4, 4] }, border: { display: false },
             ticks: { color: t("--text-muted"), font: { family: t("--font-sans") } } },
      },
    },
  });
}

/* Re-render on theme flips so colours re-read the tokens. */
export function themeAware(build) {
  let chart = build();
  new MutationObserver(() => { chart.destroy(); chart = build(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}
