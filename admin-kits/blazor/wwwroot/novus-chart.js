/* Novus dashboard-chart defaults (locked rules) for the Blazor flavor.
   Token-fed at runtime, zero colour literals; window.Chart from chart.umd.js. */
(function () {
  var current = null;
  var t = function (n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); };
  var rgba = function (name, a) {
    var n = parseInt(t(name).slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  };

  function build(canvas, hourly) {
    var products = [["novapay", t("--blue-500")], ["novabank", t("--green-500")], ["novastore", t("--amber-400")]];
    var totals = hourly.hours.map(function (_, i) {
      return products.reduce(function (s, p) { return s + hourly.series[p[0]][i]; }, 0);
    });
    var datasets = products.map(function (p, idx) {
      return {
        type: "bar", label: p[0], data: hourly.series[p[0]], backgroundColor: p[1], stack: "volume",
        maxBarThickness: 28, categoryPercentage: 0.62,
        borderRadius: idx === products.length - 1 ? { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 } : 0,
        borderSkipped: false,
      };
    });
    datasets.push({ type: "line", label: "total", data: totals, borderColor: t("--text-secondary"), borderWidth: 2, pointRadius: 0, tension: 0.3 });
    return new window.Chart(canvas, {
      data: { labels: hourly.hours, datasets: datasets },
      options: {
        responsive: true, maintainAspectRatio: false, color: t("--text-secondary"),
        plugins: {
          legend: { labels: { color: t("--text-secondary"), font: { family: t("--font-sans") }, boxWidth: 12 } },
          tooltip: { backgroundColor: t("--neutral-900"), titleColor: t("--text-on-accent"), bodyColor: t("--text-on-accent"), cornerRadius: 8, usePointStyle: true },
        },
        scales: {
          x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { color: t("--text-muted"), font: { family: t("--font-sans") } } },
          y: { stacked: true, grid: { color: rgba("--neutral-500", 0.13), borderDash: [4, 4] }, border: { display: false }, ticks: { color: t("--text-muted"), font: { family: t("--font-sans") } } },
        },
      },
    });
  }

  var bound = null;
  function init(force) {
    var canvas = document.getElementById("volumechart");
    if (!canvas || !window.Chart) { bound = null; return; }
    if (!force && bound === canvas) return;
    bound = canvas;
    fetch("chart-data.json").then(function (r) { return r.json(); }).then(function (hourly) {
      if (current) { current.destroy(); }
      current = build(canvas, hourly);
    });
  }

  document.addEventListener("DOMContentLoaded", function () { init(false); });
  /* Server flavor: enhanced navigation swaps the DOM; WASM demo: the page renders after load. */
  new MutationObserver(function () { init(false); }).observe(document.documentElement, { childList: true, subtree: true });
  new MutationObserver(function () { init(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
