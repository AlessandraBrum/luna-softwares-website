const languageToggle = document.querySelector(".language-toggle");
const translatedText = [...document.querySelectorAll("[data-pt]")];
const translatedLabels = [...document.querySelectorAll("[data-pt-label]")];
const translatedLinks = [...document.querySelectorAll("[data-pt-href]")];
const englishText = translatedText.map((element) => element.textContent);
const englishLabels = translatedLabels.map((element) => element.getAttribute("aria-label"));
const englishLinks = translatedLinks.map((link) => link.getAttribute("href"));
const languageKey = "luna-language";
const browserLanguage = navigator.languages?.[0] ?? navigator.language;
let selectedLanguage = /^pt(?:-|$)/i.test(browserLanguage) ? "pt-BR" : "en";

try {
  const savedLanguage = localStorage.getItem(languageKey);
  if (savedLanguage === "en" || savedLanguage === "pt-BR") selectedLanguage = savedLanguage;
} catch {
  // The switch still works for this visit if storage is unavailable.
}

function applyLanguage() {
  const portuguese = selectedLanguage === "pt-BR";
  document.documentElement.lang = selectedLanguage;
  translatedText.forEach((element, index) => {
    element.textContent = portuguese ? element.dataset.pt : englishText[index];
  });
  translatedLabels.forEach((element, index) => {
    element.setAttribute("aria-label", portuguese ? element.dataset.ptLabel : englishLabels[index]);
  });
  translatedLinks.forEach((link, index) => {
    link.href = portuguese ? link.dataset.ptHref : englishLinks[index];
  });
  languageToggle.lang = portuguese ? "en" : "pt-BR";
  languageToggle.textContent = portuguese ? "English" : "Português";
  languageToggle.hidden = false;
}

languageToggle.addEventListener("click", () => {
  selectedLanguage = selectedLanguage === "en" ? "pt-BR" : "en";
  applyLanguage();
  try {
    localStorage.setItem(languageKey, selectedLanguage);
  } catch {
    // Keep the current page language in memory.
  }
});

applyLanguage();

const motionControls = document.querySelector(".motion-controls");
const motionHome = motionControls.parentElement;
const motionToggle = motionControls.querySelector(".motion-toggle");
const motionSystem = motionControls.querySelector(".motion-system");
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
  motionSystem.hidden = !systemMotion.matches;
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
const drawer = document.getElementById("menu-movel");
const drawerClose = drawer.querySelector("button");
const desktop = window.matchMedia("(min-width: 64rem)");

function closeMenu(focusTarget = menuToggle) {
  if (!drawer.open) return;
  drawer.close();
  menuToggle.after(menu);
  motionHome.append(motionControls);
  menuToggle.setAttribute("aria-expanded", "false");
  focusTarget?.focus({ preventScroll: true });
}

menuToggle.addEventListener("click", () => {
  drawer.append(menu, motionControls);
  drawer.showModal();
  menuToggle.setAttribute("aria-expanded", "true");
  drawerClose.focus();
});

drawerClose.addEventListener("click", () => closeMenu());

drawer.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeMenu();
});

drawer.addEventListener("click", (event) => {
  if (event.target !== drawer) return;
  const bounds = drawer.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX >= bounds.right
    || event.clientY < bounds.top || event.clientY >= bounds.bottom;
  if (outside) closeMenu();
});

menu.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  if (drawer.open) {
    const destination = link.getAttribute("href").startsWith("#")
      ? document.getElementById(link.hash.slice(1))
      : menuToggle;
    closeMenu(destination);
  }
});

desktop.addEventListener("change", (event) => {
  if (event.matches) closeMenu(menu.querySelector("a"));
});

document.documentElement.classList.add("js");

const topButton = document.querySelector(".back-to-top");
const pageTop = document.getElementById("topo");
const sectionEnds = document.querySelectorAll("main section, .principles");
let topButtonFrame = 0;
let returningToTop = false;

function updateTopButton() {
  topButtonFrame = 0;
  const nearTop = window.scrollY < 120;
  if (nearTop) returningToTop = false;

  const boundaryVisible = [...sectionEnds].some((section) => {
    const { bottom } = section.getBoundingClientRect();
    return bottom >= innerHeight * .40 && bottom <= innerHeight + 24;
  });
  const visible = !nearTop && !returningToTop
    && (boundaryVisible || document.activeElement === topButton);
  topButton.classList.toggle("is-visible", visible);
}

function queueTopButtonUpdate() {
  if (!topButtonFrame) topButtonFrame = requestAnimationFrame(updateTopButton);
}

window.addEventListener("scroll", queueTopButtonUpdate, { passive: true });
window.addEventListener("resize", queueTopButtonUpdate);
topButton.addEventListener("blur", queueTopButtonUpdate);
topButton.addEventListener("click", () => {
  returningToTop = true;
  pageTop.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: document.documentElement.dataset.motion === "reduced" ? "instant" : "smooth" });
  queueTopButtonUpdate();
});
new ResizeObserver(queueTopButtonUpdate).observe(document.querySelector("main"));
queueTopButtonUpdate();

function espalharEstrelas() {
  const ceu = document.createElement("div");
  ceu.className = "site-stars";
  ceu.setAttribute("aria-hidden", "true");
  let semente = 7;
  const sortear = () => {
    semente = (semente * 9301 + 49297) % 233280;
    return semente / 233280;
  };
  const altura = document.documentElement.scrollHeight;
  const total = Math.max(14, Math.round(altura / 110));
  for (let i = 0; i < total; i++) {
    const estrela = document.createElement("span");
    estrela.className = "site-star" + (sortear() < 0.3 ? " site-star--gold" : "");
    estrela.style.left = `${(sortear() * 96 + 2).toFixed(2)}%`;
    estrela.style.top = `${(sortear() * 97 + 1.5).toFixed(2)}%`;
    estrela.style.setProperty("--tamanho", `${(sortear() * 6 + 7).toFixed(1)}px`);
    estrela.style.animationDelay = `${(-sortear() * 9).toFixed(2)}s`;
    estrela.style.animationDuration = `${(sortear() * 5 + 4).toFixed(2)}s`;
    ceu.append(estrela);
  }
  document.body.append(ceu);
}

espalharEstrelas();
