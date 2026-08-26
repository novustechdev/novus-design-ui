/* Novus theme helper — persisted light/dark toggle, applied before first paint.
   Usage: <script src=".../js/novus-theme.js"></script> in <head> (blocking, tiny),
   then wire a button to window.novusTheme.toggle().
   With no persisted choice, resolution is left to @media (prefers-color-scheme). */
(function () {
  var KEY = "novus-theme";
  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
  function current() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set) return set;
    try {
      return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (e) { return "light"; }
  }
  apply(read()); /* pre-paint: script is loaded in <head> */
  window.novusTheme = {
    current: current,
    toggle: function () {
      var next = current() === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* OS preference rules */ }
      return next;
    }
  };
})();
