(function () { "use strict"; var $ = function(s) { return document.querySelector(s); };
  /* ── scene-centered parallax + desk-gradient scroll interpolation, ported
     ~1:1 from the design's own ensureInit()/wire()/applyScroll() ── */
  (function () {
    var desk = $("#qg-desk");
    var scenes = [];
    function buildScenes() {
      scenes = Array.prototype.map.call(document.querySelectorAll("[data-scene]"), function (sc) {
        return { sc: sc, ls: Array.prototype.map.call(sc.querySelectorAll("[data-par]"), function (el) {
          return { el: el, sp: parseFloat(el.getAttribute("data-par")) || 0 };
        }) };
      });
    }
    function applyScroll() {
      if (window.qogozReduced()) return;
      var vh = window.innerHeight || 1;
      scenes.forEach(function (o) {
        var rc = o.sc.getBoundingClientRect();
        if (rc.bottom < -100 || rc.top > vh + 100) return;
        var p = Math.max(-1.2, Math.min(1.2, ((rc.top + rc.height / 2) - vh / 2) / vh));
        o.ls.forEach(function (l) { l.el.style.transform = "translate3d(0," + (p * l.sp).toFixed(1) + "px,0)"; });
      });
      if (desk) {
        var doc = document.documentElement;
        var t = Math.max(0, Math.min(1, (window.scrollY || 0) / Math.max(1, doc.scrollHeight - vh)));
        var S = [[181,124,78,138,90,56],[199,146,90,152,102,60],[122,74,46,84,50,32]];
        var seg = t < .5 ? [S[0], S[1], t * 2] : [S[1], S[2], (t - .5) * 2];
        var mm = seg[0].map(function (v, i) { return Math.round(v + (seg[1][i] - v) * seg[2]); });
        desk.style.background = "radial-gradient(130% 90% at 50% 12%, rgb(" + mm[0] + "," + mm[1] + "," + mm[2] + ") 0%, rgb(" + mm[3] + "," + mm[4] + "," + mm[5] + ") 82%)";
      }
    }
    var tick = false;
    function onScroll() { if (tick) return; tick = true; requestAnimationFrame(function () { tick = false; applyScroll(); }); }
    buildScenes();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { buildScenes(); onScroll(); }, { passive: true });
    applyScroll();
  })();

  /* ── pmPop reveal (3D flip-in via IntersectionObserver) ── */
  (function () {
    var els = document.querySelectorAll("[data-pop]");
    var reduced = window.qogozReduced();
    try { reduced = reduced || window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].style.opacity = "1";
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          el.style.transformOrigin = "50% 100%";
          el.style.animation = "pmPop .85s cubic-bezier(.22,.85,.3,1.02) both";
          io.unobserve(el);
        }
      });
    }, { threshold: .16 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  })();

  (function () {
    var cover = $("#qg-cover"), splash = $("#qg-splash");
    var opening = false, opened = false;
    if (splash) document.body.style.overflow = "hidden";
    function open() {
      if (opening || opened) return;
      opening = true;
      if (cover && !window.qogozReduced()) cover.style.transform = "perspective(1500px) rotateY(-148deg)";
      if (splash) { splash.style.opacity = "0"; splash.style.pointerEvents = "none"; }
      window.qogozPlay();
      setTimeout(function () {
        opened = true;
        if (splash) splash.style.display = "none";
        document.body.style.overflow = "";
      }, window.qogozReduced() ? 0 : 1250);
    }
    var ob = $("#qg-open");
    if (ob) ob.addEventListener("click", open);
    if (!splash) document.body.style.overflow = "";
  })();


})();
