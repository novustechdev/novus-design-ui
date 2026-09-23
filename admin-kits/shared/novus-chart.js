/* Novus dashboard charts on D3 (feature 008; constitution 1.12.0, Principle VII).
   ONE source for every flavor: admin-kits/shared/novus-chart.js, copied by
   admin-kits/data/generate.mjs. Classic script: reads the global `d3` and
   exposes `window.novusChart`, so the Vite flavors and the Blazor flavors load
   the same file.

   Locked rules: every colour and font read from tokens at render time (no
   literals), soft dashed gridlines at low alpha, rounded bars with constrained
   thickness, no axis borders or tick marks, dark rounded tooltip, one
   composition read plus one trajectory read on the primary series. Charts
   redraw on a theme change, answer hover and keyboard focus, and sit beside a
   table carrying the same numbers for pages without scripting. */
(function () {
  var token = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };
  var alpha = function (name, a) {
    var value = token(name);
    if (value.charAt(0) !== "#") return value;
    var n = parseInt(value.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  };
  var PRODUCTS = [
    { key: "novapay", token: "--blue-500" },
    { key: "novabank", token: "--green-500" },
    { key: "novastore", token: "--amber-400" },
  ];
  var BAR_MAX = 28;

  function frame(el) {
    var d3 = window.d3;
    el.innerHTML = "";
    var box = el.getBoundingClientRect();
    var width = Math.max(320, Math.round(box.width));
    var height = Math.max(200, Math.round(box.height || 320));
    var svg = d3.select(el).append("svg")
      .attr("class", "chart")
      .attr("width", width).attr("height", height)
      .attr("viewBox", "0 0 " + width + " " + height);
    var tip = d3.select(el).append("div").attr("class", "charttip").attr("hidden", true);
    return { d3: d3, svg: svg, tip: tip, width: width, height: height };
  }

  function showTip(ctx, html, x, y) {
    ctx.tip.attr("hidden", null).html(html);
    var node = ctx.tip.node();
    var left = Math.min(Math.max(x - node.offsetWidth / 2, 0), ctx.width - node.offsetWidth);
    ctx.tip.style("left", left + "px").style("top", Math.max(0, y - node.offsetHeight - 12) + "px");
  }
  var hideTip = function (ctx) { ctx.tip.attr("hidden", true); };

  /* Composition (stacked product volume) plus trajectory (total line) by hour. */
  function volumeChart(el, hourly) {
    var ctx = frame(el), d3 = ctx.d3;
    var pad = { top: 16, right: 12, bottom: 28, left: 44 };
    var innerW = ctx.width - pad.left - pad.right;
    var innerH = ctx.height - pad.top - pad.bottom;
    var rows = hourly.hours.map(function (hour, i) {
      var row = { hour: hour, total: 0 };
      PRODUCTS.forEach(function (p) { row[p.key] = hourly.series[p.key][i]; row.total += hourly.series[p.key][i]; });
      return row;
    });
    var x = d3.scaleBand().domain(rows.map(function (r) { return r.hour; })).range([0, innerW]).padding(0.38);
    var y = d3.scaleLinear().domain([0, d3.max(rows, function (r) { return r.total; })]).nice().range([innerH, 0]);
    var g = ctx.svg.append("g").attr("transform", "translate(" + pad.left + "," + pad.top + ")");

    g.append("g").attr("class", "chart__grid").selectAll("line").data(y.ticks(4)).enter().append("line")
      .attr("x1", 0).attr("x2", innerW).attr("y1", y).attr("y2", y)
      .attr("stroke", alpha("--neutral-500", 0.13)).attr("stroke-dasharray", "4 4");

    g.append("g").attr("class", "chart__axis").selectAll("text").data(y.ticks(4)).enter().append("text")
      .attr("x", -10).attr("y", function (d) { return y(d) + 4; }).attr("text-anchor", "end")
      .attr("fill", token("--text-muted")).text(function (d) { return d3.format("~s")(d); });

    g.append("g").attr("class", "chart__axis").selectAll("text").data(rows.filter(function (_, i) { return i % 2 === 0; }))
      .enter().append("text")
      .attr("x", function (r) { return x(r.hour) + x.bandwidth() / 2; }).attr("y", innerH + 20)
      .attr("text-anchor", "middle").attr("fill", token("--text-muted")).text(function (r) { return r.hour; });

    var bw = Math.min(x.bandwidth(), BAR_MAX);
    var stack = d3.stack().keys(PRODUCTS.map(function (p) { return p.key; }))(rows);
    stack.forEach(function (layer, li) {
      var topLayer = li === stack.length - 1;
      g.append("g").selectAll("path").data(layer).enter().append("path")
        .attr("fill", token(PRODUCTS[li].token))
        .attr("d", function (d) {
          var bx = x(d.data.hour) + (x.bandwidth() - bw) / 2;
          var top = y(d[1]), bottom = y(d[0]);
          var r = topLayer ? Math.min(6, bw / 2, bottom - top) : 0;
          return "M" + bx + "," + bottom + "V" + (top + r) +
            (r ? "a" + r + "," + r + " 0 0 1 " + r + ",-" + r + "h" + (bw - 2 * r) + "a" + r + "," + r + " 0 0 1 " + r + "," + r : "h" + bw) +
            "V" + bottom + "Z";
        });
    });

    var line = d3.line().x(function (r) { return x(r.hour) + x.bandwidth() / 2; }).y(function (r) { return y(r.total); }).curve(d3.curveMonotoneX);
    g.append("path").datum(rows).attr("fill", "none").attr("stroke", token("--text-secondary")).attr("stroke-width", 2).attr("d", line);

    var label = function (r) {
      return "<b>" + r.hour + "</b>" + PRODUCTS.map(function (p) {
        return "<span><i style=\"background:" + token(p.token) + "\"></i>" + p.key + " " + d3.format(",")(r[p.key]) + "</span>";
      }).join("") + "<span class=\"charttip__total\">total " + d3.format(",")(r.total) + "</span>";
    };
    g.append("g").selectAll("rect").data(rows).enter().append("rect")
      .attr("x", function (r) { return x(r.hour); }).attr("y", 0)
      .attr("width", x.bandwidth()).attr("height", innerH)
      .attr("fill", "transparent").attr("tabindex", 0).attr("role", "img")
      .attr("aria-label", function (r) {
        return r.hour + ", total " + r.total + ", " + PRODUCTS.map(function (p) { return p.key + " " + r[p.key]; }).join(", ");
      })
      .on("mouseenter focus", function (event, r) {
        showTip(ctx, label(r), pad.left + x(r.hour) + x.bandwidth() / 2, pad.top + y(r.total));
      })
      .on("mouseleave blur", function () { hideTip(ctx); });
  }

  /* Composition share as a donut, with the total in the middle. */
  function donutChart(el, parts) {
    var ctx = frame(el), d3 = ctx.d3;
    var radius = Math.min(ctx.width, ctx.height) / 2;
    var g = ctx.svg.append("g").attr("transform", "translate(" + ctx.width / 2 + "," + ctx.height / 2 + ")");
    var total = parts.reduce(function (sum, p) { return sum + p.value; }, 0);
    var arcs = d3.pie().sort(null).padAngle(0.02).value(function (p) { return p.value; })(parts);
    var arc = d3.arc().innerRadius(radius * 0.62).outerRadius(radius * 0.95).cornerRadius(3);
    g.selectAll("path").data(arcs).enter().append("path")
      .attr("d", arc).attr("fill", function (d) { return token(d.data.token); })
      .attr("tabindex", 0).attr("role", "img")
      .attr("aria-label", function (d) { return d.data.label + " " + d.data.value; })
      .on("mouseenter focus", function (event, d) {
        showTip(ctx, "<b>" + d.data.label + "</b><span>" + d3.format(",")(d.data.value) + " (" + Math.round((d.data.value / total) * 100) + "%)</span>",
          ctx.width / 2 + arc.centroid(d)[0], ctx.height / 2 + arc.centroid(d)[1]);
      })
      .on("mouseleave blur", function () { hideTip(ctx); });
    g.append("text").attr("class", "chart__centre").attr("text-anchor", "middle").attr("dy", "0.35em")
      .attr("fill", token("--text")).text(d3.format("~s")(total));
  }

  /* Re-render on theme change and on resize; both re-read the tokens. */
  function themeAware(render) {
    render();
    var again = function () { render(); };
    new MutationObserver(again).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", again); } catch (e) { /* older engines */ }
    var timer;
    window.addEventListener("resize", function () { clearTimeout(timer); timer = setTimeout(again, 150); });
  }

  window.novusChart = { volumeChart: volumeChart, donutChart: donutChart, themeAware: themeAware };
})();
