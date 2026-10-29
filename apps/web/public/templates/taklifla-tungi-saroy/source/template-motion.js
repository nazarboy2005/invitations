/* Extracted from the exact midnight-palace source. See provenance.json. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  /* ── reveal on scroll (content visible by default; only elements below
     0.9×viewport get a one-shot entrance fade, reduced-motion respected) ── */
  function reveal() {
    var els = document.querySelectorAll("[data-reveal]");
    var reduced = false;
    try { reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    if (reduced || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.animation = "mpFade .95s ease both";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (r.top > window.innerHeight * 0.9) io.observe(els[i]);
    }
  }

  /* ── firefly particles (12 dots, ported from buildFlies; same array
     rendered on both Hero and Countdown) ── */
  function fireflies() {
    var flies = [];
    for (var i = 0; i < 12; i++) {
      flies.push({
        x: (((7 + i * 7.9) % 90) + 4) + "%",
        y: (((i * 13.7 + 9) % 62) + 6) + "%",
        s: ((i % 3) + 2) + "px",
        dur: (5 + (i % 5)) + "s",
        del: (i * 0.7).toFixed(1) + "s"
      });
    }
    function build(hostSel) {
      var host = $(hostSel);
      if (!host) return;
      flies.forEach(function (f) {
        var d = document.createElement("div");
        d.style.cssText = "position:absolute; left:" + f.x + "; top:" + f.y + "; width:" + f.s + "; height:" + f.s +
          "; border-radius:50%; background:#ffe9a8; box-shadow:0 0 9px 2px rgba(255,222,140,.55); opacity:.2; animation:mpTwinkle " + f.dur + " ease-in-out " + f.del + " infinite; pointer-events:none;";
        host.appendChild(d);
      });
    }
    build("#mp-hero-flies");
    build("#mp-cd-flies");
  }


  window.TungiSaroySource = { reveal: reveal, fireflies: fireflies };
})();
