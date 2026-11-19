const motionToggle = document.querySelector(".motion-toggle");
const systemMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const preferenceKey = "luna-motion";
let preference;

try {
  preference = localStorage.getItem(preferenceKey);
} catch {
  // The control still works for this visit if storage is unavailable.
}

function updateMotion() {
  const reduced = systemMotion.matches || preference === "reduced";
  document.documentElement.dataset.motion = reduced ? "reduced" : "normal";
  motionToggle.setAttribute("aria-pressed", String(reduced));
  motionToggle.disabled = systemMotion.matches;
  motionToggle.hidden = systemMotion.matches;
}

motionToggle.addEventListener("click", () => {
  preference = preference === "reduced" ? "normal" : "reduced";
  updateMotion();
  try {
    localStorage.setItem(preferenceKey, preference);
  } catch {
    // Keep the current page preference in memory.
  }
});

systemMotion.addEventListener("change", updateMotion);
updateMotion();

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("nav-principal");
const mobileMenu = window.matchMedia("(max-width: 46rem)");

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menu.classList.toggle("is-open", open);
}

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

mobileMenu.addEventListener("change", (event) => {
  if (!event.matches) setMenu(false);
});
