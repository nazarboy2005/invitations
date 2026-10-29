window.initTovusMotion = function () {
"use strict";
var $ = function (s) { return document.querySelector(s); };
  /* ── splash open ── */
  (function () {
    var splash = $("#tv-splash");
    var opened = false;
    if (splash) document.body.style.overflow = "hidden";
    function open() {
      if (opened) return; opened = true;
      if (splash) {
        splash.style.opacity = "0";
        splash.style.transform = "translateX(-50%) translateY(-26px)";
        splash.style.pointerEvents = "none";
        setTimeout(function () { splash.style.display = "none"; }, window.tvReduced ? 0 : 1100);
      }
      document.body.style.overflow = "";
    }
    var ob = $("#tv-open");
    if (ob) ob.addEventListener("click", open);
    if (!splash) document.body.style.overflow = "";
  })();

  /* ── feather-mask JS fallback (harmless duplicate of the inline style) ── */
  (function () {
    var f = $("#tv-frame-img");
    if (!f) return;
    var mVal = "radial-gradient(118% 98% at 50% 48%, #000 64%, rgba(0,0,0,0) 100%)";
    f.style.webkitMaskImage = mVal;
    f.style.maskImage = mVal;
    f.style.webkitMaskRepeat = f.style.maskRepeat = "no-repeat";
    f.style.webkitMaskSize = f.style.maskSize = "100% 100%";
  })();

  /* ── reveal on scroll (IO + no-IO fallback + reduced-motion respected) ── */
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    var reduced = !!window.tvReduced;
    try { reduced = reduced || window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("tv-in");
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          var d = parseInt(en.target.getAttribute("data-reveal-delay") || "0", 10);
          if (d) en.target.style.transitionDelay = d + "ms";
          en.target.classList.add("tv-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  })();

  /* ── floating particles (6 dots, ported from buildParticles) ── */
  (function () {
    var host = $("#tv-particles");
    if (!host || window.tvReduced) return;
    var n = 6;
    var tints = ["#C6A24A", "#0E6B62"];
    for (var i = 0; i < n; i++) {
      var size = 3 + (i % 3) * 2;
      var left = (8 + i * 15) % 100;
      var dur = 28 + (i * 13 % 14);
      var delay = -(i * 37 % 26);
      var drift = ((i % 2) ? 1 : -1) * (14 + (i * 11 % 30));
      var tint = tints[i % tints.length];
      var d = document.createElement("div");
      d.style.cssText = "position:absolute;top:-6vh;left:" + left + "%;width:" + size + "px;height:" + size +
        "px;border-radius:50%;background:radial-gradient(circle at 50% 42%, " + tint + " 0 22%, rgba(198,162,74,.26) 28% 52%, transparent 60%);" +
        "opacity:.22;--drift:" + drift + "px;animation:fall " + dur + "s linear " + delay + "s infinite;";
      host.appendChild(d);
    }
  })();


};
