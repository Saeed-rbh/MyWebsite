const EXIT_DURATION = 260;

let leaving = false;

window.addEventListener("pageshow", () => {
  leaving = false;
  document.documentElement.classList.remove("site-document-exit");
});

export function navigateWithExit(event, destination) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) return;

  event.preventDefault();
  if (leaving) return;
  leaving = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.location.assign(destination);
    return;
  }

  document.documentElement.classList.add("site-document-exit");
  window.setTimeout(() => window.location.assign(destination), EXIT_DURATION);
}
