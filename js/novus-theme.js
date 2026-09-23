/* Novus theme helper — persisted light/dark toggle, applied before first paint.
   Usage: <script src=".../js/novus-theme.js"></script> in <head> (blocking, tiny),
   then wire a button to window.novusTheme.toggle().
   Light is the default (constitution 1.12.0): with no stored choice the kit
   applies light whatever the operating system says. To follow the operating
   system instead, set window.novusThemeFollowOS = true before this script. */
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
  var stored = read();
  apply(stored === "light" || stored === "dark" ? stored : (window.novusThemeFollowOS ? null : "light"));
  window.novusTheme = {
    current: current,
    toggle: function () {
      var next = current() === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* private mode: choice lasts for this page */ }
      return next;
    }
  };
})();
