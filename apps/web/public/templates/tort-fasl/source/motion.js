/* Extracted from the selected Fasllar capture; see README for changes. */
window.startFasllarMotion = function () {
  function reduced() { return document.documentElement.classList.contains("fs-reduced") || matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function rng(s) { return function () { s = Math.sin(s * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }; }
  function mk(seed, n, s0, s1, d0, d1, mode) {
    var r = rng(seed);
    var out = [];
    for (var i = 0; i < n; i++) {
      var dur = +(d0 + r() * (d1 - d0)).toFixed(1);
      var names = mode === 1 ? ["fsDropL", "fsDropR"] : mode === 2 ? ["fsFloatL", "fsFloatR"] : mode === 3 ? ["fsSeedDropL", "fsSeedDropR"] : ["fsFallL", "fsFallR"];
      var name = names[r() < .5 ? 0 : 1];
      out.push({ left: +(r() * 96 + 2).toFixed(1), size: Math.round(s0 + r() * (s1 - s0)), op: +(.5 + r() * .45).toFixed(2), anim: name + " " + dur + "s linear " + (-(r() * dur).toFixed(1)) + "s infinite" });
    }
    return out;
  }
  function spawn(hostId, list, src) {
    var host = document.getElementById(hostId);
    if (!host) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var img = document.createElement("img");
      img.src = src; img.alt = ""; img.loading = "lazy";
      img.style.cssText = "position:absolute;top:-70px;left:" + p.left + "%;width:" + p.size + "px;opacity:" + p.op + ";animation:" + p.anim + ";will-change:transform;";
      frag.appendChild(img);
    }
    host.appendChild(frag);
  }
  (function () {
    if (reduced()) return;
    var PETAL = "fasllar-img/petal.webp", SEED = "fasllar-img/dandelion-seed.webp",
        LEAF = "fasllar-img/autumn-leaf.webp", SNOW = "fasllar-img/snowflake.webp";
    spawn("fs-particles-hero", mk(11, 12, 20, 34, 10, 17), PETAL);
    spawn("fs-particles-band1", mk(21, 5, 18, 28, 7, 11, 1), PETAL);
    spawn("fs-particles-band1", mk(22, 5, 16, 26, 8, 12, 3), SEED);
    spawn("fs-particles-summer", mk(31, 9, 18, 30, 15, 24, 2), SEED);
    spawn("fs-particles-band2", mk(41, 4, 16, 26, 8, 12, 3), SEED);
    spawn("fs-particles-band2", mk(42, 5, 16, 26, 7, 11, 1), LEAF);
    spawn("fs-particles-autumn", mk(51, 12, 17, 30, 9, 16), LEAF);
    spawn("fs-particles-band3", mk(61, 4, 16, 24, 7, 11, 1), LEAF);
    spawn("fs-particles-band3", mk(62, 5, 11, 18, 9, 13, 1), SNOW);
    spawn("fs-particles-winter", mk(71, 16, 10, 20, 13, 22), SNOW);
    spawn("fs-particles-foot", mk(81, 5, 18, 26, 9, 14, 1), PETAL);
  })();

  /* ── the season scroll: body-bg lerp keyed to LIVE section midpoints +
     data-plx parallax, a continuous rAF loop ported verbatim from the
     design's own _paint()/ensureInit() scroll+rAF combo. ── */
  function paint() {
    if (!document.body) return;
    var y = window.scrollY, vh = window.innerHeight, mid = y + vh * .5;
    var ids = ["fs-hero", "fs-summer", "fs-autumn", "fs-winter"];
    var cols = [[251, 231, 238], [207, 230, 201], [242, 217, 180], [227, 211, 234]];
    var els = ids.map(function (i) { return document.getElementById(i); });
    if (els.some(function (e) { return !e; })) return;
    var pts = els.map(function (e) { var r = e.getBoundingClientRect(); return y + r.top + r.height * .5; });
    pts.push(document.documentElement.scrollHeight); cols.push(cols[0]);
    var c = cols[0];
    if (mid > pts[0]) {
      c = cols[cols.length - 1];
      for (var i = 0; i < pts.length - 1; i++) {
        if (mid >= pts[i] && mid <= pts[i + 1]) {
          var t = (mid - pts[i]) / Math.max(1, pts[i + 1] - pts[i]);
          c = cols[i].map(function (v, k) { return Math.round(v + (cols[i + 1][k] - v) * t); });
          break;
        }
      }
    }
    document.body.style.backgroundColor = "rgb(" + c.join(",") + ")";
    if (reduced()) return;
    var plx = document.querySelectorAll("[data-plx]");
    for (var j = 0; j < plx.length; j++) {
      var el = plx[j]; var sp = +el.getAttribute("data-plx"); var r = el.getBoundingClientRect();
      el.style.transform = "translateY(" + ((r.top + r.height / 2 - vh / 2) * sp).toFixed(1) + "px)";
    }
  }
  (function () {
    var raf = 0, rafLoop = 0, lastY = -1;
    function onScroll() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; paint(); }); }
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });

    setTimeout(paint, 60); setTimeout(paint, 1400);
  })();


  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add("fs-in"); io.unobserve(entry.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -7% 0px" });
  window.revealFasllar = function () {
    document.querySelectorAll("[data-reveal]").forEach(function (el) { if (reduced()) el.classList.add("fs-in"); else io.observe(el); });
    if (reduced()) document.querySelectorAll('[id^="fs-particles-"]').forEach(function (el) { el.replaceChildren(); });
    if (reduced()) document.querySelectorAll('[data-plx]').forEach(function (el) { el.style.transform = ""; });
  };
  window.revealFasllar();
};
