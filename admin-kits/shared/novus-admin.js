/* Novus console patterns: progressive behaviour (feature 007).
   ONE source: admin-kits/shared/novus-admin.js, copied into every flavor by
   admin-kits/data/generate.mjs. Every pattern already works without this file
   (native details, checkbox drawer, form posts); this adds the conveniences:
   theme toggle, Escape and outside-click dismissal, drawer close on navigation,
   and password visibility. Document-level delegation, so it survives client
   routing (Blazor WebAssembly) and enhanced navigation (Blazor Server). */
(function () {
  if (window.novusAdmin) return;
  var doc = document;
  var small = window.matchMedia("(max-width: 899.98px)");

  /* Light is the default for portals (constitution 1.12.0). The pre-paint
     snippet sets it; this re-asserts it after any older copy of the theme
     helper, which cleared the attribute when nothing was stored. Set
     window.novusThemeFollowOS = true to follow the operating system instead. */
  try {
    var stored = localStorage.getItem("novus-theme");
    if (!window.novusThemeFollowOS && stored !== "dark" && stored !== "light") {
      doc.documentElement.setAttribute("data-theme", "light");
    }
  } catch (e) { /* private mode: the pre-paint snippet already applied light */ }

  function closeMenus(except) {
    doc.querySelectorAll("details[data-dismiss][open]").forEach(function (d) {
      if (d !== except && !d.contains(except)) d.removeAttribute("open");
    });
  }

  function closeDrawer() {
    var t = doc.getElementById("navtoggle");
    if (t && t.checked && small.matches) t.checked = false;
  }

  doc.addEventListener("click", function (e) {
    var el = e.target instanceof Element ? e.target : null;
    if (!el) return;

    closeMenus(el.closest("details[data-dismiss]"));

    if (el.closest("[data-theme-toggle]") && window.novusTheme) window.novusTheme.toggle();

    var pw = el.closest("[data-password-toggle]");
    if (pw) {
      var field = doc.getElementById(pw.getAttribute("aria-controls"));
      if (field) {
        var show = field.type === "password";
        field.type = show ? "text" : "password";
        pw.setAttribute("aria-pressed", String(show));
        pw.setAttribute("aria-label", show ? "Hide password" : "Show password");
      }
    }

    if (el.closest(".adminnav a")) closeDrawer();
  });

  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = doc.querySelector("details[data-dismiss][open]");
    if (open) {
      open.removeAttribute("open");
      var summary = open.querySelector("summary");
      if (summary) summary.focus();
      return;
    }
    closeDrawer();
  });

  window.novusAdmin = { closeMenus: closeMenus, closeDrawer: closeDrawer };
})();
