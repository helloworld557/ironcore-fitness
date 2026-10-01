/* IRONCORE FITNESS — site interactions */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initActiveLink();
  initReveal();
  initCounters();
  initBackToTop();
  initFilters();
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Navbar turns solid after scrolling; inner pages start solid via .show-bg */
function initNavbar() {
  const nav = document.querySelector(".ic-nav");
  if (!nav) return;
  const update = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* Highlight the link that matches the current page */
function initActiveLink() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".ic-nav .nav-link").forEach((link) => {
    const active = link.getAttribute("href") === page;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
  });
}

/* Fade-up elements as they enter the viewport */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
}

/* Count up numbers: <span data-count="2500" data-suffix="+"> */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const run = (el) => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target.toLocaleString() + suffix; return; }
    const start = performance.now(), duration = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach((c) => io.observe(c));
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 600), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
}

/* Reusable filtering: buttons [data-filter] show items [data-category] */
function initFilters() {
  document.querySelectorAll(".filter-bar").forEach((bar) => {
    const items = document.querySelectorAll(bar.dataset.target || ".filter-item");
    bar.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        bar.querySelectorAll("[data-filter]").forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        items.forEach((item) => {
          const match = btn.dataset.filter === "all" || item.dataset.category.split(" ").includes(btn.dataset.filter);
          item.classList.toggle("is-hidden", !match);
        });
      });
    });
  });
}