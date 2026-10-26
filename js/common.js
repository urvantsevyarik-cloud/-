/* Общее для всех страниц: тексты из SITE, ссылки, тема, анимация появления */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = (n) => Number(n).toLocaleString("ru-RU", { maximumFractionDigits: 2 });

/* Висячие предлоги: «в», «и», «с»… не остаются в конце строки */
const noWidows = (s) => {
  const re = /(^|[\s—-])([а-яёА-ЯЁ]{1,2})\s/g;
  return String(s ?? "").replace(re, "$1$2\u00A0").replace(re, "$1$2\u00A0"); // дважды — для «а на», «и в»
};

function plural(n, f) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return f[0];
  if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return f[1];
  return f[2];
}

function platformColor(name) {
  const p = PLATFORMS.find((x) => x.name === name);
  return p ? p.c1 : "var(--lime)";
}

function initCommon() {
  $$("[data-site]").forEach((el) => (el.textContent = noWidows(SITE[el.dataset.site] || "")));
  $$("[data-link]").forEach((el) => {
    const v = SITE[el.dataset.link];
    if (!v) { el.remove(); return; }
    el.href = el.dataset.link === "email" ? `mailto:${v}` : v;
  });
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  const root = document.documentElement;
  const label = () => (root.dataset.theme === "light" ? "Тёмная" : "Светлая");
  $$("[data-theme-toggle]").forEach((b) => {
    b.textContent = label();
    b.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
      $$("[data-theme-toggle]").forEach((x) => (x.textContent = label()));
    });
  });
}

let revealIO = null;
function observeReveals() {
  const els = $$(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("in"));
  revealIO = revealIO || new IntersectionObserver((en) => en.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); }
  }), { threshold: 0.1 });
  els.forEach((el) => revealIO.observe(el));
}

function baHTML(ba) {
  if (!ba) return "";
  const max = Math.max(ba.before, ba.after) || 1;
  const w = (v) => Math.max(3, (v / max) * 100);
  return `<div class="ba">
    <span class="ba-label">${esc(ba.label)}</span>
    <div class="ba-row ba-before"><span>Было</span><div class="ba-bar"><i style="width:${w(ba.before)}%"></i></div><b>${fmt(ba.before)}</b></div>
    <div class="ba-row ba-after"><span>Стало</span><div class="ba-bar"><i style="width:${w(ba.after)}%"></i></div><b>${fmt(ba.after)}</b></div>
  </div>`;
}

initCommon();
