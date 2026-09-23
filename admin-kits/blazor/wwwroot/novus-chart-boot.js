/* GENERATED copy of admin-kits/shared/novus-chart-boot.js by admin-kits/data/generate.mjs. Edit the source, then regenerate. */
/* Chart bootstrap for the Blazor flavors (feature 008). The static flavors call
   window.novusChart from their page module; Blazor renders server-side or from
   WebAssembly, so the charts mount whenever their container appears and remount
   after enhanced navigation or a theme change. Data comes from chart-data.json,
   the same file the dataset generator writes. */
(function () {
  var data = null;
  var mounted = { volume: null, mix: null };

  function mix(hourly) {
    return [
      { label: "novapay", token: "--blue-500", value: sum(hourly.series.novapay) },
      { label: "novabank", token: "--green-500", value: sum(hourly.series.novabank) },
      { label: "novastore", token: "--amber-400", value: sum(hourly.series.novastore) },
    ];
  }
  function sum(values) { return values.reduce(function (a, b) { return a + b; }, 0); }

  function draw(force) {
    if (!window.novusChart || !window.d3 || !data) return;
    var volume = document.getElementById("volumechart");
    var share = document.getElementById("mixchart");
    if (volume && (force || mounted.volume !== volume)) {
      mounted.volume = volume;
      window.novusChart.volumeChart(volume, data);
    }
    if (share && (force || mounted.mix !== share)) {
      mounted.mix = share;
      window.novusChart.donutChart(share, mix(data));
    }
    if (!volume) mounted.volume = null;
    if (!share) mounted.mix = null;
  }

  function start() {
    if (data) { draw(false); return; }
    fetch("chart-data.json").then(function (r) { return r.json(); }).then(function (hourly) {
      data = hourly;
      draw(true);
    }).catch(function () { /* a page without charts does not need the data */ });
  }

  document.addEventListener("DOMContentLoaded", start);
  new MutationObserver(function () { start(); }).observe(document.documentElement, { childList: true, subtree: true });
  new MutationObserver(function () { draw(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  var timer;
  window.addEventListener("resize", function () { clearTimeout(timer); timer = setTimeout(function () { draw(true); }, 150); });
})();
