window.startYomgirMotion = function () {
var $ = s => document.querySelector(s);
  /* ── reveal on scroll (IO + riseIn keyframe; no-IO / reduced-motion
     fallback settles elements immediately) ── */
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    var reduced = false;
    try { reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    function settle(el) { el.style.opacity = "1"; el.style.transform = "none"; }
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) settle(els[i]);
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.animation = "riseIn .8s cubic-bezier(.22,.8,.3,1) both";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  })();

  /* ── rain generator (34 drops per container, ported from the design's
     `this.rain = Array.from({ length: 34 }, ...)`; Math.random is fine —
     both the splash and hero containers render the same array so the two
     screens' rain reads as one continuous downpour) ── */
  (function () {
    var rain = Array.from({ length: 34 }, function () {
      return {
        left: (Math.random() * 100).toFixed(1) + "%",
        h: (60 + (Math.random() * 70 | 0)) + "px",
        dur: (0.9 + Math.random() * 0.9).toFixed(2) + "s",
        delay: (-Math.random() * 2).toFixed(2) + "s",
        op: (0.25 + Math.random() * 0.5).toFixed(2)
      };
    });
    function build(hostSel) {
      var host = $(hostSel);
      if (!host) return;
      var frag = document.createDocumentFragment();
      rain.forEach(function (r) {
        var d = document.createElement("div");
        d.style.cssText = "position:absolute;top:-140px;left:" + r.left + ";width:1.5px;height:" + r.h +
          ";background:linear-gradient(rgba(190,215,255,0),rgba(190,215,255,.5));animation:rainFall " + r.dur +
          " linear infinite;animation-delay:" + r.delay + ";opacity:" + r.op + ";";
        frag.appendChild(d);
      });
      host.appendChild(frag);
    }
    build("#yg-splash-rain");
    build("#yg-hero-rain");
  })();

  /* ── scroll-driven body background-color interpolation through the
     design's 7 sky stops (rAF-throttled — ported 1:1 from the dc source) ── */
  (function () {
    var stops = [[0, [5, 12, 24]], [0.16, [14, 25, 67]], [0.34, [73, 54, 113]], [0.5, [223, 130, 137]], [0.62, [234, 182, 153]], [0.76, [217, 233, 240]], [1, [108, 178, 224]]];
    var raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var max = document.documentElement.scrollHeight - innerHeight;
        var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
        var j = 1; while (j < stops.length - 1 && p > stops[j][0]) j++;
        var p0 = stops[j - 1][0], c0 = stops[j - 1][1], p1 = stops[j][0], c1 = stops[j][1];
        var t = Math.min(1, Math.max(0, (p - p0) / ((p1 - p0) || 1)));
        var col = c0.map(function (v, k) { return Math.round(v + (c1[k] - v) * t); });
        document.body.style.background = "rgb(" + col.join(",") + ")";
      });
    }
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();


};
