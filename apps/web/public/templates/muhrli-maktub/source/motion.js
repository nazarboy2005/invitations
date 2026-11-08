// Extracted source opening/scroll/particles/reveal/name-fitting engine.
window.startEnvelopeMotion = function (tryMusic) {
  var $ = function(s) { return document.querySelector(s); };
  var hide = function(el) { if(el) el.style.display = 'none'; };
  /* ── sealed-envelope stage: sealed → opening (4.75s choreography) → done ── */
  (function () {
    var stage = $("#env-stage");
    if (!stage) return;
    var phase = "sealed";
    var doneT = null;
    document.body.style.overflow = "hidden";
    var reduced = false;
    try { reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    function anim(el, a) { if (el) el.style.animation = a; }
    function finish() {
      if (phase === "done") return;
      phase = "done";
      if (doneT) { clearTimeout(doneT); doneT = null; }
      stage.style.display = "none";
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
    }
    function openSeal() {
      if (phase !== "sealed") return;
      phase = "opening";
      hide($("#env-hint-open"));
      var sk = $("#env-hint-skip"); if (sk) sk.style.display = "inline";
      anim($("#env-seal"), "kSealLift .75s .05s cubic-bezier(.45,0,.7,.5) forwards");
      anim($("#env-flap"), "kFlapOpen .85s .4s cubic-bezier(.6,0,.3,1) forwards");
      anim($("#env-back1"), "kFadeIn .35s .55s forwards");
      anim($("#env-back2"), "kFadeIn .35s .55s forwards");
      anim($("#env-front"), "kFadeOut .3s .62s forwards");
      anim($("#env-letter"), "kLetterOut 1.35s 1.25s cubic-bezier(.5,0,.3,1) both");
      anim($("#env-p2"), "kUnfold .6s 2.7s cubic-bezier(.55,0,.35,1) both");
      anim($("#env-p3"), "kUnfoldB .55s 3.3s cubic-bezier(.55,0,.35,1) both");
      var cr = document.querySelectorAll(".env-crease");
      for (var i = 0; i < cr.length; i++) anim(cr[i], "kCrease .7s 3.35s forwards");
      anim(stage, "kFadeOut .6s 4.1s forwards");
      tryMusic();
      doneT = setTimeout(finish, reduced ? 600 : 4750);
    }
    stage.addEventListener("click", function () {
      if (phase === "sealed") openSeal(); else finish();
    });
  })();

  /* ── scroll: bg lerp ivory→dusk + hero parallax ── */
  (function () {
    var root = $("#env-root");
    var hb = $("#env-hero-bg"), he = $("#env-hero-env"), mo = $("#env-motes");
    var a = [244, 232, 210], b = [217, 184, 148];
    function applyScroll(y) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) y = 0;
      var de = document.documentElement;
      var max = Math.max(1, de.scrollHeight - window.innerHeight);
      var p = Math.min(1, Math.max(0, y / max));
      if (root) root.style.backgroundColor = "rgb(" +
        Math.round(a[0] + (b[0] - a[0]) * p) + "," +
        Math.round(a[1] + (b[1] - a[1]) * p) + "," +
        Math.round(a[2] + (b[2] - a[2]) * p) + ")";
      if (hb) hb.style.transform = "translateY(" + y * 0.3 + "px)";
      if (he) he.style.transform = "translateX(-50%) translateY(" + y * 0.14 + "px)";
      if (mo) mo.style.transform = "translateY(" + y * -0.05 + "px)";
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; applyScroll(window.scrollY || 0); });
    }, { passive: true });
    applyScroll(0);
  })();

  /* ── drifting gold flecks + wax specks around the envelope ── */
  (function () {
    var motes = [{l:8,t:12,s:34,d:13,dl:0,o:.5},{l:22,t:30,s:20,d:16,dl:2,o:.4},{l:36,t:8,s:15,d:11,dl:4,o:.55},{l:52,t:22,s:44,d:19,dl:1,o:.3},{l:66,t:14,s:22,d:14,dl:3,o:.5},{l:80,t:28,s:17,d:12,dl:5,o:.45},{l:90,t:10,s:30,d:17,dl:2,o:.35},{l:14,t:55,s:25,d:15,dl:1,o:.4},{l:44,t:48,s:15,d:12,dl:6,o:.5},{l:72,t:58,s:32,d:18,dl:0,o:.32},{l:86,t:70,s:20,d:13,dl:4,o:.45},{l:28,t:74,s:38,d:20,dl:2,o:.3},{l:58,t:82,s:17,d:14,dl:5,o:.5},{l:6,t:86,s:25,d:16,dl:3,o:.4}];
    var host = $("#env-motes");
    if (host) motes.forEach(function (m) {
      var img = document.createElement("img");
      img.src = "envelope-img/10-gold-fleck.webp";
      img.alt = "";
      img.style.cssText = "position:absolute;left:" + m.l + "%;top:" + m.t + "%;width:" + m.s + "px;opacity:" + m.o + ";animation:kFloat " + m.d + "s ease-in-out " + m.dl + "s infinite;";
      host.appendChild(img);
    });
    var specks = [{l:64,t:78,s:9,r:20},{l:34,t:74,s:6,r:-15},{l:57,t:60,s:5,r:40},{l:43,t:82,s:7,r:65}];
    var sh = $("#env-specks");
    if (sh) specks.forEach(function (sp) {
      var img = document.createElement("img");
      img.src = "envelope-img/07-wax-seal.webp";
      img.alt = "";
      img.style.cssText = "position:absolute;left:" + sp.l + "%;top:" + sp.t + "%;width:" + sp.s + "px;z-index:6;opacity:.55;transform:rotate(" + sp.r + "deg);";
      sh.appendChild(img);
    });
  })();

  /* ── reveal on scroll (IO + no-IO fallback + reduced-motion respected) ── */
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    var reduced = false;
    try { reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("env-in");
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("env-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  })();

  /* ── long names must never clip: shrink the name slots until the widest
     line fits; re-run once webfonts land and after language switches ── */
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
      fit($("#env-name1"), 37, 15);
      fit($("#env-name2"), 37, 15);
      fit($("#env-foot-names"), 17, 12);
      fit($("#env-hero-date"), 16, 11);
    }
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    window.addEventListener("resize", run);
    document.addEventListener("taklifla:langchange", function () { setTimeout(run, 0); });
  })();


};
