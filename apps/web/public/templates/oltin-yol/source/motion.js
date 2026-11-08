/* Extracted template motion; documented accessibility hooks only. */
window.OltinYolMotion = function (api) {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  /* ── long names must never clip: shrink the MonteCarlo name slots until
     the widest line fits (Muhammadyusuf-class names overflow at 390px
     viewports). Re-run once webfonts land — metrics change. ── */
  (function () {
    function fit(el, base, min) {
      if (!el) return;
      var size = base;
      el.style.fontSize = size + "px";
      var guard = 24;
      while (guard-- > 0 && size > min && el.scrollWidth > el.clientWidth + 1) {
        size -= 2;
        el.style.fontSize = size + "px";
      }
    }
    function run() {
      fit($("#oy-splash-names"), 44, 22);
      fit($("#oy-hero-names"), 58, 28);
      fit($("#oy-ticket-names"), 43, 18);
      fit($("#oy-foot-names"), 40, 20);
    }
    window.addEventListener("oltin-yol:layout", run);
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    window.addEventListener("resize", run);
  })();

  /* ── the railway spine: measured parallax + marker-follows-scroll +
     body-background lerp, ported ~1:1 from the design's own
     ensureInit()/_measure()/_frame()/_lerp() ── */
  (function () {
    var col = $("#oy-col");
    var bg = $("#oy-bg"), spine = $("#oy-spine"), marker = $("#oy-marker");
    if (!col) return;
    var paras = [];
    function measure() {
      paras = Array.prototype.map.call(col.querySelectorAll("[data-para]"), function (el) {
        var par = el.parentElement, r = par.getBoundingClientRect();
        return { el: el, k: parseFloat(el.getAttribute("data-para")) || 0.1, top: r.top + window.scrollY, h: par.offsetHeight, max: Math.max(0, (el.offsetHeight - par.offsetHeight) / 2 - 4) };
      });
    }
    function lerp(t) {
      var S = [[0,246,209,125],[0.30,223,205,140],[0.55,247,207,140],[0.80,129,61,74],[1,50,25,22]];
      var a = S[0], b = S[S.length - 1];
      for (var i = 0; i < S.length - 1; i++) { if (t >= S[i][0] && t <= S[i + 1][0]) { a = S[i]; b = S[i + 1]; break; } }
      var f = (t - a[0]) / Math.max(1e-6, b[0] - a[0]);
      function m(idx) { return Math.round(a[idx] + (b[idx] - a[idx]) * f); }
      return "rgb(" + m(1) + "," + m(2) + "," + m(3) + ")";
    }
    function frame() {
      if (api.reduced()) return;
      var y = window.scrollY, wh = window.innerHeight, dh = document.documentElement.scrollHeight;
      var prog = Math.min(1, Math.max(0, y / Math.max(1, dh - wh)));
      if (marker && spine) marker.style.transform = "translate3d(0," + (14 + prog * (spine.offsetHeight - 100)) + "px,0)";
      if (bg) bg.style.background = lerp(prog);
      for (var i = 0; i < paras.length; i++) {
        var p = paras[i];
        var d = (y + wh / 2 - (p.top + p.h / 2)) * p.k;
        d = Math.max(-p.max, Math.min(p.max, d));
        p.el.style.transform = "translate3d(0," + d.toFixed(1) + "px,0)";
      }
    }
    var raf = 0;
    function onScroll() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; frame(); }); }
    function onResize() { measure(); frame(); }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    setTimeout(onResize, 900);
    setTimeout(onResize, 2600);
    frame();
  })();

  /* ── splash open ── */
  (function () {
    var splash = $("#oy-splash");
    var opened = false;
    if (splash) { document.body.style.overflow = "hidden"; $("#oy-col").inert = true; }
    function open() {
      if (opened) return; opened = true;
      if (splash) {
        splash.style.opacity = "0";
        splash.style.transform = "scale(1.02)";
        splash.style.pointerEvents = "none";
        setTimeout(function () { splash.style.display = "none"; api.onOpened(); }, api.reduced() ? 0 : 1000);
      }
      document.body.style.overflow = "";
      $("#oy-col").inert = false;
      api.onOpen();
      setTimeout(function () {
        try { window.dispatchEvent(new Event("resize")); } catch (e) {}
      }, 400);
    }
    var ob = $("#oy-open");
    if (ob) ob.addEventListener("click", open);
    if (!splash) document.body.style.overflow = "";
    window.__oyOpenSplash = open;
  })();

  /* ── reveal on scroll (IO + no-IO fallback + reduced-motion respected),
     ported from the design's own IntersectionObserver wiring ── */
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    var reduced = api.reduced();
    try { reduced = reduced || window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].style.opacity = "1";
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.animation = "gl-rise .9s cubic-bezier(.22,.8,.32,1) both";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  })();

  /* ── drifting light motes (12 per host, deterministic formula ported
     verbatim from the design's MOTES array) ── */
  (function () {
    function build(host, color) {
      if (api.reduced()) return;
      if (!host) return;
      for (var i = 0; i < 12; i++) {
        var left = 7 + (i * 61) % 86;
        var top = 6 + (i * 37) % 74;
        var size = 4 + (i * 13) % 7;
        var dur = 9 + (i * 29) % 9;
        var delay = -((i * 17) % 13);
        var a = 0.3 + (i * 7) % 4 / 10;
        var d = document.createElement("div");
        d.style.cssText = "position:absolute;left:" + left + "%;top:" + top + "%;width:" + size + "px;height:" + size +
          "px;border-radius:50%;background:radial-gradient(circle," + color + ",rgba(255,224,150,0) 70%);opacity:" + a +
          ";animation:gl-drift " + dur + "s ease-in-out " + delay + "s infinite;pointer-events:none;";
        host.appendChild(d);
      }
    }
    build($("#oy-hero-motes"), "rgba(255,224,150,.95)");
    build($("#oy-cd-motes"), "rgba(255,214,140,.95)");
  })();


};
