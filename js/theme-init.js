// theme-init.js: runs in <head> before the page paints, so a saved theme
// never flashes the wrong colors. Kept tiny on purpose.
(() => {
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem("lj-theme");
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  } catch (_) { /* storage blocked: follow the system setting */ }
})();
