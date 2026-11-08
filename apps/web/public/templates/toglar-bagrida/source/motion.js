(function () {
  "use strict";
  // ── Hero parallax ─────────────────────────────────────────────────
  // Each mountain layer drifts at its own rate as the hero scrolls
  // past, so the range gains depth. We write the scroll offset to a
  // CSS variable (--py) that the .ml class composes into its
  // `transform`, so the parallax doesn't stomp on the idle-float
  // animation (which lives on the separate `translate` property).
  // rAF-throttled; disabled when the user prefers reduced motion.
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var layers = Array.prototype.slice.call(document.querySelectorAll(".ml"));
  var ticking = false;
  function parallax() {
    if (document.documentElement.hasAttribute("data-reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { ticking=false; return; }
    var y = window.scrollY || window.pageYOffset;
    layers.forEach(function (el) {
      var depth = parseFloat(el.getAttribute("data-depth")) || 0;
      el.style.setProperty("--py", (y * depth) + "px");
    });
    ticking = false;
  }
  if (!reduce) {
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  // ── Reveal on scroll ──────────────────────────────────────────────
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.16 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
})();
