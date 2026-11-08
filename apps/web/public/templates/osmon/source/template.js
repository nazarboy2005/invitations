(function(){"use strict";
var $ = (s) => document.querySelector(s);
  var DICT = {
    splash_kicker: ["Wedding Invitation", "Свадебное приглашение"],
    splash_open: ["Open Invitation", "Открыть приглашение"],
    hero_kicker: ["We're getting married!", "Мы создаём семью!"],
    hero_hint: ["Rising into the sky", "Поднимаемся в небо"],
    showcase_line1: ["Across the sky — toward happiness", "Сквозь небо — навстречу счастью"],
    showcase_line2: ["Fly along with us", "Летите вместе с нами"],
    inv_kicker: ["Dear guests!", "Дорогие гости!"],
    inv_lead1: ["It is with the greatest joy that we,", "С самым большим счастьем мы,"],
    inv_lead2: [", invite you to join us as we celebrate our wedding.", ", приглашаем вас разделить с нами радость нашего бракосочетания."],
    name_joiner: [" and ", " и "],
    tadbirlar_title: ["Program", "Программа"],
    tadbirlar_sub: ["the schedule of our wedding day", "расписание свадебного дня"],
    manzil_title: ["Venue", "Место"],
    manzil_sub: ["we'll be waiting for you here", "мы будем ждать вас здесь"],
    map_btn: ["Open map", "Открыть карту"],
    malumot_title: ["Good to know", "Полезно знать"],
    info_dress_default: ["Dress code: light, sky and spring tones", "Дресс-код: лёгкие тона неба и весны"],
    info_gifts_default: ["The most precious gift — your warm wishes among friends", "Самый ценный подарок — ваши тёплые пожелания в кругу друзей"],
    tilaklar_title: ["Wishes", "Пожелания"],
    tilaklar_sub: ["send the young family your blessing", "пожелайте молодой семье доброго пути"],
    wish_send: ["Send", "Отправить"],
    wish_thanks: ["Thank you — your wish has been saved ♡", "Спасибо — ваше пожелание сохранено ♡"],
    wish_empty: ["Be the first to leave a wish", "Будьте первым, кто оставит пожелание"],
    sanoq_kicker: ["until the happy day", "до счастливого дня"],
    sanoq_title: ["The countdown has begun", "Отсчёт начался"],
    cd_days: ["Days", "Дни"], cd_hours: ["Hours", "Часы"], cd_mins: ["Minutes", "Минуты"], cd_secs: ["Seconds", "Секунды"],
    footer_kicker: ["We're waiting for you!", "Мы ждём вас!"]
  };
  var PH = {
    wish_name_ph: ["Your name", "Ваше имя"],
    wish_msg_ph: ["Your wish...", "Ваше пожелание..."]
  };
window.osmonLabels = {DICT, PH};
  /* ── long names must never clip: shrink the name slots until the widest
     line fits (Muhammadyusuf-class names overflow at 390px viewports).
     Re-run once webfonts land — metrics change. ── */
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
    function fitPair(el1, el2, base, min) {
      if (!el1) return;
      var size = base;
      function set() {
        el1.style.fontSize = size + "px";
        if (el2 && el2.style.display !== "none") el2.style.fontSize = size + "px";
      }
      set();
      var guard = 24;
      function overflow() {
        var o = el1.scrollWidth - el1.clientWidth;
        if (el2 && el2.style.display !== "none") o = Math.max(o, el2.scrollWidth - el2.clientWidth);
        return o;
      }
      while (guard-- > 0 && size > min && overflow() > 1) { size -= 2; set(); }
    }
    function run() {
      fit($("#os-splash-names"), 20, 12);
      fitPair($("#os-hero-line1"), $("#os-hero-line2"), 54, 26);
      fit($("#os-inv-names"), 29, 16);
      fit($("#os-foot-mono"), 42, 22);
    }
    window.osmonFit = run;
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    window.addEventListener("resize", run);
  })();

  /* ── clouds / drifters / stars: static DOM generated at boot from the
     design's own data arrays, ported verbatim ── */
  var CLOUDS = [
    { src: "osmon-img/cloud-2.webp", top: "7%", left: "40%", w: "80%", op: ".85", par: "0.30" },
    { src: "osmon-img/cloud-5.webp", top: "15.5%", left: "-20%", w: "70%", op: ".8", par: "0.22" },
    { src: "osmon-img/cloud-3.webp", top: "22%", left: "55%", w: "62%", op: ".9", par: "0.10" },
    { src: "osmon-img/cloud-1.webp", top: "30%", left: "-12%", w: "85%", op: ".9", par: "0.16" },
    { src: "osmon-img/cloud-4.webp", top: "40%", left: "34%", w: "75%", op: ".8", par: "0.28" },
    { src: "osmon-img/cloud-2.webp", top: "50%", left: "-18%", w: "66%", op: ".85", par: "0.08" },
    { src: "osmon-img/cloud-5.webp", top: "59%", left: "48%", w: "72%", op: ".8", par: "0.20" },
    { src: "osmon-img/cloud-1.webp", top: "68%", left: "-10%", w: "88%", op: ".85", par: "0.30" },
    { src: "osmon-img/cloud-3.webp", top: "78%", left: "30%", w: "70%", op: ".75", par: "0.12" },
    { src: "osmon-img/cloud-4.webp", top: "88%", left: "-16%", w: "78%", op: ".7", par: "0.24" }
  ];
  var DRIFTERS = [
    { src: "osmon-img/obj-whale-cloud.webp", top: "1.6%", left: "62%", ow: "200px", w: "100%", ml: "0", oa: "swayX 48s ease-in-out infinite", ia: "none", op: ".4", par: "0.34" },
    { src: "osmon-img/obj-cottage.webp", top: "13%", left: "0", ow: "100%", w: "115px", ml: "12%", oa: "crossR 175s linear -40s infinite", ia: "bobTilt 11s ease-in-out infinite", op: ".75", par: "0" },
    { src: "osmon-img/obj-airship.webp", top: "27%", left: "0", ow: "100%", w: "155px", ml: "55%", oa: "crossR 150s linear -35s infinite", ia: "bobY 12s ease-in-out infinite", op: ".9", par: "0" },
    { src: "osmon-img/obj-balloon.webp", top: "81%", left: "70%", ow: "95px", w: "100%", ml: "0", oa: "none", ia: "bobY 13s ease-in-out infinite", op: ".92", par: "0.10" },
    { src: "osmon-img/obj-plane.webp", top: "48%", left: "0", ow: "100%", w: "125px", ml: "66%", oa: "crossL 95s linear -20s infinite", ia: "bobTilt 7s ease-in-out infinite", op: ".95", par: "0" },
    { src: "osmon-img/obj-island.webp", top: "57%", left: "56%", ow: "180px", w: "100%", ml: "0", oa: "none", ia: "bobTilt 17s ease-in-out infinite", op: ".95", par: "0.16" },
    { src: "osmon-img/obj-birds.webp", top: "69%", left: "0", ow: "100%", w: "105px", ml: "28%", oa: "crossR 120s linear -50s infinite", ia: "none", op: ".85", par: "0" },
    { src: "osmon-img/obj-balloon.webp", top: "37%", left: "9%", ow: "64px", w: "100%", ml: "0", oa: "none", ia: "bobY 15s ease-in-out infinite", op: ".7", par: "0.22" },
    { src: "osmon-img/obj-kite.webp", top: "90%", left: "12%", ow: "74px", w: "100%", ml: "0", oa: "none", ia: "bobTilt 9s ease-in-out infinite", op: ".9", par: "0.08" }
  ];
  (function () {
    var host = $("#os-sky-decor");
    if (!host) return;
    var frag = document.createDocumentFragment();
    CLOUDS.forEach(function (c) {
      var img = document.createElement("img");
      img.src = c.src; img.alt = ""; img.loading = "lazy";
      img.setAttribute("data-par", c.par);
      img.style.cssText = "position:absolute;top:" + c.top + ";left:" + c.left + ";width:" + c.w + ";opacity:" + c.op + ";will-change:transform;display:block;";
      frag.appendChild(img);
    });
    DRIFTERS.forEach(function (o) {
      var wrap = document.createElement("div");
      wrap.setAttribute("data-par", o.par);
      wrap.style.cssText = "position:absolute;top:" + o.top + ";left:" + o.left + ";width:" + o.ow + ";animation:" + o.oa + ";will-change:transform;";
      var img = document.createElement("img");
      img.src = o.src; img.alt = ""; img.loading = "lazy";
      img.style.cssText = "width:" + o.w + ";display:block;opacity:" + o.op + ";animation:" + o.ia + ";margin-left:" + o.ml + ";";
      wrap.appendChild(img);
      frag.appendChild(wrap);
    });
    host.appendChild(frag);
  })();

  /* ── seeded twinkle stars (LCG, verbatim from the design source) ── */
  (function () {
    var host = $("#os-stars");
    if (!host) return;
    var s = 5;
    function r() { s = s * 16807 % 2147483647; return s / 2147483647; }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 14; i++) {
      var t = (4 + r() * 88).toFixed(1) + "%";
      var l = (4 + r() * 92).toFixed(1) + "%";
      var w = (1.5 + r() * 1.8).toFixed(1) + "px";
      var a = "twinkle " + (2.4 + r() * 3).toFixed(1) + "s ease-in-out " + (r() * 3).toFixed(1) + "s infinite";
      var d = document.createElement("div");
      d.style.cssText = "position:absolute;top:" + t + ";left:" + l + ";width:" + w + ";height:" + w + ";border-radius:50%;background:#fff;box-shadow:0 0 8px rgba(255,255,255,.9);animation:" + a + ";";
      frag.appendChild(d);
    }
    host.appendChild(frag);
  })();

  /* ── the sky: fixed-background colour lerp + data-par parallax translate,
     a continuous rAF loop ported verbatim from the design's own
     ensureInit()/_col() (S-stops table + linear interpolation) ── */
  (function () {
    var S = [[0,203,236,254],[.125,202,231,230],[.25,146,208,245],[.375,124,194,244],[.5,148,200,237],[.625,198,188,174],[.75,189,134,124],[.875,227,152,130],[1,66,64,145]];
    function col(t) {
      t = Math.min(1, Math.max(0, t));
      var i = 0;
      while (i < S.length - 2 && t > S[i + 1][0]) i++;
      var a = S[i], b = S[i + 1], f = (t - a[0]) / (b[0] - a[0]);
      function m(k) { return Math.round(a[k] + (b[k] - a[k]) * f); }
      return "rgb(" + m(1) + "," + m(2) + "," + m(3) + ")";
    }
    var bgEl = $("#os-sky-outside");
    var parEls = [];
    var reduced = () => document.documentElement.classList.contains("reduced-motion") || matchMedia("(prefers-reduced-motion: reduce)").matches;
    var raf, ly = -1, force = true;
    function wire() {
      parEls = [].slice.call(document.querySelectorAll("[data-par]")).map(function (n) {
        return { n: n, k: parseFloat(n.getAttribute("data-par")) || 0 };
      });
      force = true;
    }
    function loop() {
      if (!document.hidden) raf = requestAnimationFrame(loop);
      if (reduced()) { parEls.forEach(p => p.n.style.transform = ""); return; }
      var y = window.scrollY;
      if (y === ly && !force) return;
      ly = y; force = false;
      var dh = document.documentElement.scrollHeight - window.innerHeight;
      var t = dh > 0 ? y / dh : 0;
      if (bgEl) bgEl.style.background = col(t);
      for (var i = 0; i < parEls.length; i++) {
        var p = parEls[i];
        if (p.k) p.n.style.transform = "translate3d(0," + (y * p.k).toFixed(1) + "px,0)";
      }
    }
    setTimeout(wire, 90);
    setTimeout(wire, 900);
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", function () { force = true; });
    document.addEventListener("visibilitychange", function () { cancelAnimationFrame(raf); if (!document.hidden) { force = true; raf = requestAnimationFrame(loop); } });
  })();
  /* ── splash open ── */
  (function () {
    var splash = $("#os-splash");
    var opened = false;
    if (splash) document.body.style.overflow = "hidden";
    function open() {
      if (opened) return; opened = true;
      if (splash) {
        splash.style.opacity = "0";
        splash.style.pointerEvents = "none";
        setTimeout(function () { splash.style.display = "none"; splash.inert = true; }, document.documentElement.classList.contains("reduced-motion") ? 0 : 800);
      }
      document.body.style.overflow = "";
      document.dispatchEvent(new Event("osmon:opened"));
      document.querySelector("#os-col").focus({preventScroll:true});
    }
    var ob = $("#os-open");
    if (ob) ob.addEventListener("click", open);
    if (!splash) document.body.style.overflow = "";
  })();

  /* ── reveal on scroll (IO + no-IO fallback + reduced-motion respected) ── */
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    var reduced = false;
    try { reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("os-in");
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("os-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  })();


})();
