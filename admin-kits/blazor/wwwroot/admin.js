// Progressive wiring: theme toggle buttons call the kit helper.
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-theme-toggle]")) window.novusTheme.toggle();
});
