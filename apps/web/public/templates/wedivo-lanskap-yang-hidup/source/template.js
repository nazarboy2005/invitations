
(function () {
  "use strict";
  /* ================= INTI ================= */
  var doc = document, body = doc.body, win = window;
  function $(id) { return doc.getElementById(id); }
  function qsa(sel, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(sel)); }
  function mq(q) { try { return win.matchMedia(q).matches; } catch (e) { return false; } }
  var reduce = win.lanskapPlatform.reducedMotion || mq("(prefers-reduced-motion: reduce)");
  function clean(s) { s = s == null ? "" : String(s).replace(/\s+/g, " ").trim(); return /\{\{/.test(s) ? "" : s; }
  function cleanML(s) {
    s = s == null ? "" : String(s);
    if (/\{\{/.test(s)) { return ""; }
    return s.replace(/\r\n?/g, "\n").split("\n").map(function (l) { return l.replace(/[ \t]+/g, " ").trim(); }).join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\n+|\n+$/g, "");
  }
  function txt(id) { var e = $(id); return e ? clean(e.textContent) : ""; }
  function mtx(id) { var e = $(id); return e ? cleanML(e.textContent) : ""; }
  function c01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function pad2(n) { n = Math.floor(Math.abs(n)); return (n < 10 ? "0" : "") + n; }
  var uidN = 0;
  function mkId(p) { uidN += 1; return (p || "x") + "-r" + uidN; }
  function el(tag, cls, parent, text) { var e = doc.createElement(tag); if (cls) { e.className = cls; } e.id = mkId(tag.charAt(0)); if (text != null) { e.textContent = text; } if (parent) { parent.appendChild(e); } return e; }
  var NS = "http://www.w3.org/2000/svg";
  function sv(tag, attrs, parent) { var e = doc.createElementNS(NS, tag); e.id = mkId("v"); if (attrs) { for (var k in attrs) { if (attrs.hasOwnProperty(k)) { e.setAttribute(k, k === "aria-label" ? win.lanskapTranslate(attrs[k]) : attrs[k]); } } } if (parent) { parent.appendChild(e); } return e; }
  function useIc(name, parent, cls) { var s = sv("svg", { "class": "ic " + (cls || "") }, parent), u = sv("use", {}, s); u.setAttribute("href", "#" + name); return s; }
  function hide(e) { if (e) { e.classList.add("is-empty"); } }
  function setText(id, s) { var e = $(id); if (e) { e.textContent = win.lanskapTranslate(s); } }
  function hashStr(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }
  function idAll(r, p) { if (!r) { return; } if (!r.id) { r.id = mkId(p); } qsa("*", r).forEach(function (n) { if (!n.id) { n.id = mkId(p); } }); }
  var KEY = "lsh1:" + win.lanskapPlatform.invitationId + ":";
  var store = {
    get: function (k, d) { try { var v = win.sessionStorage.getItem(KEY + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { win.sessionStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {} }
  };
  function vib(ms) { try { if (navigator.vibrate) { navigator.vibrate(ms); } } catch (e) {} }
  var toastT = 0;
  function toast(m) { var t = $("toast"); if (!t) { return; } t.textContent = win.lanskapTranslate(m); t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2800); }
  function copyText(s, okMsg) {
    var done = function () { toast(okMsg); };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(s).then(done, fallback); return; } } catch (e) {}
    fallback();
    function fallback() { var ta = doc.createElement("textarea"); ta.id = mkId("cp"); ta.value = s; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; body.appendChild(ta); ta.select(); try { doc.execCommand("copy"); done(); } catch (e) { toast(s); } body.removeChild(ta); }
  }
  /* ================= MESIN LANSKAP ================= */
  var LAND = (function () {
    var PI = Math.PI, TAU = PI * 2;
    function c01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function sm(a, b, x) { var t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
    function hx(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function mul(a, b) { return [a[0] * b[0] / 255, a[1] * b[1] / 255, a[2] * b[2] / 255]; }
    function css(c, a) {
      var r = c[0] < 0 ? 0 : c[0] > 255 ? 255 : c[0] | 0, g = c[1] < 0 ? 0 : c[1] > 255 ? 255 : c[1] | 0, b = c[2] < 0 ? 0 : c[2] > 255 ? 255 : c[2] | 0;
      if (a == null || a >= 1) { return "rgb(" + r + "," + g + "," + b + ")"; }
      return "rgba(" + r + "," + g + "," + b + "," + (a < 0 ? 0 : a).toFixed(3) + ")";
    }
    function rnd(seed) {
      var s = seed >>> 0;
      return function () { s = (s + 0x6d2b79f5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    }
    function hash1(n) {
      n = n | 0; n = (n << 13) ^ n;
      var a = (Math.imul(Math.imul(n, n), 15731) + 789221) | 0;
      return 1 - ((Math.imul(n, a) + 1376312589) & 0x7fffffff) / 1073741824;
    }
    function vn(x, s) { var i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); var a = hash1(i + s * 131), b = hash1(i + 1 + s * 131); return a + (b - a) * u; }
    function fbm(x, s) { return vn(x, s) * 0.58 + vn(x * 2.13, s + 5) * 0.28 + vn(x * 4.7, s + 11) * 0.14; }

    /* ---------- palet waktu ---------- */
    function keys(arr) { return arr.map(function (k) { var o = [k[0]]; for (var i = 1; i < k.length; i++) { o.push(typeof k[i] === "string" ? hx(k[i]) : k[i]); } return o; }); }
    var SKY = keys([
      [4.4, "#060a20", "#10173a", "#1f2550"],
      [5.05, "#101844", "#263066", "#5b527f"],
      [5.45, "#1f3472", "#5c6497", "#d69288"],
      [5.85, "#3a5ea3", "#9aa0c4", "#ffc28a"],
      [6.4, "#4b86c9", "#a2c6e6", "#fde0b2"],
      [7.6, "#3d88d4", "#8bbfeb", "#d7ecf7"],
      [12, "#2e7ed3", "#76b2ea", "#cfe8f8"],
      [15, "#4185cc", "#8cbbe3", "#e6e5d3"],
      [16.6, "#5579b3", "#caa98c", "#ffd08a"],
      [17.35, "#465b98", "#df9072", "#ffb35e"],
      [17.9, "#343d78", "#c06a7e", "#f58c5c"],
      [18.4, "#20275a", "#5a4a86", "#c27a8e"],
      [19.0, "#131a45", "#283168", "#58588c"],
      [20.0, "#0a102f", "#151e4a", "#2a3669"],
      [22.6, "#060a22", "#0d1540", "#1c2858"]
    ]);
    var LIGHT = keys([
      [4.4, "#4a5282", "#1e2552", 1],
      [5.1, "#5f6594", "#343b6c", 0.9],
      [5.5, "#9a8aa6", "#7a6f98", 0.6],
      [5.9, "#e8c0a0", "#c9a9a8", 0.25],
      [6.6, "#ffe6c8", "#d4e0ea", 0.04],
      [8, "#fff5e6", "#d4e5f2", 0],
      [12, "#ffffff", "#cfe3f4", 0],
      [15, "#fff3da", "#e0e0d4", 0],
      [16.7, "#ffd79c", "#eccfa6", 0],
      [17.5, "#ffb47a", "#e3a48b", 0.06],
      [18, "#d98c7c", "#a9758e", 0.3],
      [18.5, "#86769f", "#56558c", 0.62],
      [19.2, "#56628f", "#2b3366", 0.86],
      [20, "#46527f", "#1d2555", 1],
      [22.6, "#404c78", "#151d47", 1]
    ]);
    function at(ks, h) {
      var n = ks.length, i, a, b, t, o = [];
      if (h <= ks[0][0]) { return ks[0]; }
      if (h >= ks[n - 1][0]) { return ks[n - 1]; }
      for (i = 1; i < n; i++) { if (h <= ks[i][0]) { break; } }
      a = ks[i - 1]; b = ks[i]; t = (h - a[0]) / (b[0] - a[0]);
      o.push(h);
      for (var j = 1; j < a.length; j++) { o.push(typeof a[j] === "number" ? lerp(a[j], b[j], t) : mix(a[j], b[j], t)); }
      return o;
    }
    var SUNRISE = 5.78, SUNSET = 17.95;

    /* ---------- warna dasar (siang) ---------- */
    var C = {
      ridge: hx("#6f8fb6"), volc: hx("#6883a8"), volcS: hx("#46597d"), near: hx("#5a857d"),
      forest: hx("#3c6f45"), forestL: hx("#4f8a50"), terr: hx("#6b9a56"),
      palmL: hx("#4a8745"), palmT: hx("#7b6a52"),
      bare: hx("#8a8e60"), green: hx("#76a851"), warm: hx("#94ad4f"), groundD: hx("#4f7d36"),
      grass: [hx("#467b33"), hx("#5f9642"), hx("#84b456")],
      leaf: [hx("#2c6436"), hx("#3d8044"), hx("#61a657")],
      trunk: hx("#5b4535"), bark: hx("#7a5f48"),
      flam: hx("#e8552f"), flamD: hx("#b8391f"),
      bamboo: hx("#9bb466"), bambooL: hx("#5f9446"),
      stone: hx("#cfc6b3"), stoneD: hx("#9d937f"),
      chair: hx("#f5efe4"), chairD: hx("#cfc4b2"),
      wood: hx("#9a7552"), drape: hx("#fbf7f0"), drapeS: hx("#e6ddd0"),
      janur: hx("#ecd86d"), janurD: hx("#c9b04c"), pole: hx("#cbb46a"),
      cloth: hx("#f7f3ea"), clothS: hx("#ddd3c2"),
      lotus: hx("#f3a2b7"), lotusD: hx("#d86f8d"), pad: hx("#3d7c49"),
      telang: hx("#2f55d4"), cream: hx("#f7f0d8"),
      port: [hx("#e2358d"), hx("#ff8a3d"), hx("#ffd23f"), hx("#f25f8c")],
      sun: hx("#f7c531"), sunC: hx("#6b3f1d"),
      p4: [hx("#d6337f"), hx("#f2c14e"), hx("#e9519b")],
      white: hx("#fffdf5"), bush: hx("#3f7a3f"),
      blos: hx("#f4a6c1"), petal: hx("#f7b8cc"),
      night: hx("#0c1330")
    };
    var CLOTHES = ["#7b4b3a", "#3f5f4a", "#8a3b4b", "#2f4468", "#b58b4f", "#6c5a8e", "#a35f3d", "#4d6b6b", "#c9a27a", "#5b3f5e", "#7d8a4a", "#39485c"].map(hx);
    var SKIN = ["#c68b62", "#a8714e", "#d9a27a", "#8d5d3e", "#e0b08c"].map(hx);

    /* ---------- sprite pendar ---------- */
    var glowCache = {};
    function glowSprite(col) {
      var k = col.join(",");
      if (glowCache[k]) { return glowCache[k]; }
      var c = document.createElement("canvas"); c.width = c.height = 64;
      var g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, css(col, 1)); gr.addColorStop(0.18, css(col, 0.75)); gr.addColorStop(0.45, css(col, 0.22)); gr.addColorStop(1, css(col, 0));
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      glowCache[k] = c; return c;
    }

    /* ---------- tata letak ---------- */
    function layout(W, H) {
      var portrait = H >= W * 1.02, wide = W >= 1000 && W > H * 1.1;
      var u = portrait ? Math.min(H / 94, W / 40) : Math.min(H / 62, W / 100);
      var L = { W: W, H: H, u: u, portrait: portrait, wide: wide, pan: 0, ms: portrait ? 0.72 : 1 };
      L.cx = W * (wide ? 0.665 : 0.5);
      L.yHor = H * (portrait ? 0.335 : 0.54);
      L.yMea = L.yHor + (portrait ? 5 : 4.4) * u;
      L.yBot = H * (portrait ? 0.88 : 1.04);
      L.lat = wide ? 2.3 : 2.0;
      L.sx0 = wide ? W * 0.84 : W * 0.88; L.sx1 = wide ? W * 0.42 : W * 0.1;
      L.sunH = L.yHor - H * (portrait ? 0.075 : 0.1);
      L.mx0 = wide ? W * 0.8 : W * 0.84; L.mx1 = wide ? W * 0.7 : W * 0.72; L.moonH = L.yHor - H * (portrait ? 0.1 : 0.16);
      return L;
    }
    var PP = { x: 0, y: 0, s: 0 };
    function proj(L, wx, z, o) {
      o = o || PP;
      var zz = z < 0 ? 0 : z, s = (0.3 + 0.95 * z) * L.u;
      o.y = L.yMea + (L.yBot - L.yMea) * Math.pow(zz, 1.3);
      o.s = s;
      o.x = L.cx + L.pan * (0.55 + z * 0.5) + wx * L.lat * s;
      return o;
    }
    function wxRange(L, z) { var s = (0.3 + 0.95 * z) * L.u * L.lat; return [(-L.cx - 40) / s, (L.W - L.cx + 40) / s]; }
    function pathX(z) { return 0.5 * Math.sin((z - 0.33) * 4.6) * sm(0.33, 0.6, z); }

    /* ---------- struktur pohon ---------- */
    function genTree(seed, o) {
      var r = rnd(seed), segs = [], tips = [], blobs = [];
      function grow(x, y, ang, len, w, d) {
        var x2 = x + Math.sin(ang) * len, y2 = y - Math.cos(ang) * len;
        segs.push({ x1: x, y1: y, x2: x2, y2: y2, w: w, d: d });
        if (d >= o.depth || len < 0.03) { tips.push({ x: x2, y: y2, d: d }); return; }
        var n = d === 0 ? o.first : 2 + (r() < o.branchy ? 1 : 0);
        for (var i = 0; i < n; i++) {
          var a = ang + (i - (n - 1) / 2) * o.spread * (0.75 + r() * 0.5) + (r() - 0.5) * 0.35;
          a = a * o.flat + ang * (1 - o.flat) * 0.2;
          grow(x2, y2, a, len * (o.decay + r() * 0.1), w * 0.64, d + 1);
        }
      }
      grow(0, 0, (r() - 0.5) * 0.08, o.trunk, o.width, 0);
      var minY = 0, minX = 0, maxX = 0;
      tips.forEach(function (t) { minY = Math.min(minY, t.y); minX = Math.min(minX, t.x); maxX = Math.max(maxX, t.x); });
      var hgt = -minY || 1;
      segs.forEach(function (s) { s.x1 /= hgt; s.y1 /= hgt; s.x2 /= hgt; s.y2 /= hgt; s.w /= hgt; });
      tips.forEach(function (t) {
        t.x /= hgt; t.y /= hgt;
        var k = 2 + Math.floor(r() * 2);
        for (var i = 0; i < k; i++) { blobs.push({ x: t.x + (r() - 0.5) * 0.12, y: t.y + (r() - 0.35) * 0.08, r: o.blob * (0.75 + r() * 0.6), p: r() * TAU, dep: t.d }); }
      });
      blobs.sort(function (a, b) { return a.y - b.y; });
      return { segs: segs, blobs: blobs, w: (maxX - minX) / hgt };
    }

    /* ---------- adegan ---------- */
    function Scene(canvas, opt) {
      this.cv = canvas; this.ctx = canvas.getContext("2d");
      this.opt = opt || {};
      this.fx = { rain: 0, birds: 0, wind: 0, crickets: 0, frogs: 0, river: 0 };
      this.fxT = { rain: 0, birds: 0, wind: 0, crickets: 0, frogs: 0, river: 0 };
      this.parts = []; this.flocks = []; this.rockets = []; this.sparks = []; this.waves = [];
      this.guests = []; this.wish = 0; this.gust = 0; this.lastFlock = -99; this.nextShoot = 6;
      this.tree = genTree(7, { depth: 5, first: 3, branchy: 0.35, spread: 0.62, decay: 0.72, trunk: 0.36, width: 0.085, flat: 1, blob: 0.1 });
      this.flam = genTree(23, { depth: 4, first: 3, branchy: 0.5, spread: 0.55, decay: 0.7, trunk: 0.42, width: 0.075, flat: 1, blob: 0.11 });
      var r = rnd(99), i;
      this.stars = [];
      for (i = 0; i < 190; i++) { this.stars.push({ x: r(), y: Math.pow(r(), 1.4) * 0.62, s: 0.5 + r() * 1.3, p: r() * TAU, f: 0.6 + r() * 2.2 }); }
      this.clouds = [];
      for (i = 0; i < 8; i++) {
        var puffs = [], n = 5 + Math.floor(r() * 4);
        for (var k = 0; k < n; k++) { var a = (k / (n - 1)) * PI; puffs.push({ x: -Math.cos(a) * (0.85 + r() * 0.2), y: -Math.sin(a) * (0.28 + r() * 0.3), r: 0.3 + Math.sin(a) * 0.22 + r() * 0.12 }); }
        this.clouds.push({ x: r(), y: 0.06 + r() * 0.34, sc: 0.7 + r() * 0.9, v: 0.004 + r() * 0.006, puffs: puffs, far: r() < 0.5 });
      }
      this.smoke = [];
      for (i = 0; i < 7; i++) { this.smoke.push({ p: i / 7, o: r() }); }
      this.stones = [];
      for (i = 0; i < 17; i++) { var z = 1.09 - i * 0.047; this.stones.push({ z: z, dx: (r() - 0.5) * 0.35, w: 0.9 + r() * 0.35, r: r() }); }
      this.chairs = [];
      var rows = [0.45, 0.53, 0.61, 0.69];
      for (var ri = 0; ri < rows.length; ri++) { for (var side = -1; side <= 1; side += 2) { for (var c = 0; c < 3; c++) { this.chairs.push({ z: rows[ri], wx: side * (1.25 + c * 1.18), row: ri, side: side, c: c }); } } }
      this.seat = [];
      var order = [0, 3, 1, 4, 2, 5, 12, 15, 6, 9, 13, 16, 7, 10, 18, 21, 19, 14, 22, 8];
      for (i = 0; i < 16; i++) { var ch = this.chairs[order[i]]; this.seat.push({ ch: ch, a: 15.95 + i * 0.075, col: CLOTHES[i % CLOTHES.length], skin: SKIN[i % SKIN.length], hij: r() < 0.45, ph: r() * TAU }); }
      this.lotus = [];
      for (i = 0; i < 9; i++) { this.lotus.push({ x: r(), y: r(), s: 0.7 + r() * 0.6, f: r() < 0.6, p: r() * TAU }); }
      this.sunfl = [];
      for (i = 0; i < 7; i++) { this.sunfl.push({ wx: -8.6 + (i % 4) * 0.75 + r() * 0.3, z: 0.36 + Math.floor(i / 4) * 0.08 + r() * 0.03, h: 2.4 + r() * 1.1, p: r() * TAU }); }
      this.p4 = [];
      for (i = 0; i < 26; i++) { var sd = i < 13 ? -1 : 1; this.p4.push({ wx: sd * (5.2 + r() * 1.6), z: 0.74 + r() * 0.1, dy: r(), c: Math.floor(r() * 3), p: r() * TAU }); }
      this.melati = [];
      for (i = 0; i < 30; i++) { var sd2 = i % 2 ? -1 : 1; this.melati.push({ wx: sd2 * (0.95 + r() * 0.9), z: 0.335 + r() * 0.04, dy: r(), dx: r(), p: r() * TAU }); }
      this.sedap = [];
      for (i = 0; i < 5; i++) { this.sedap.push({ wx: 6.2 + i * 0.45 + r() * 0.2, z: 0.47 + r() * 0.04, h: 2.6 + r() * 0.8, p: r() * TAU }); }
      this.telang = [];
      for (i = 0; i < 16; i++) { this.telang.push({ t: r(), side: i % 2 ? -1 : 1, dy: r(), p: r() * TAU }); }
      this.bamboo = [];
      for (i = 0; i < 8; i++) { this.bamboo.push({ dx: (i - 3.5) * 0.28 + (r() - 0.5) * 0.15, h: 0.75 + r() * 0.35, lean: (i - 3.5) * 0.05 + (r() - 0.5) * 0.06, p: r() * TAU }); }
      this.palms = [{ wx: -13.5, z: 0.02, h: 1 }, { wx: 10.5, z: 0.03, h: 0.9 }, { wx: 12.4, z: 0.015, h: 1.08 }];
      this.clumps = [];
      [[-7.2, 0.7, "p9"], [6.4, 0.66, "p9"], [-3.6, 0.97, "p9"], [8.2, 0.9, "matahari"], [-8.6, 0.88, "melati"], [4.6, 1.03, "telang"], [-5.8, 0.6, "teratai"], [2.6, 0.78, "sedap"]].forEach(function (c, ci) {
        var fl2 = [];
        for (var k = 0; k < 13; k++) { fl2.push({ dx: (r() - 0.5) * 2.6, dy: 0.3 + r() * 1.5, c: Math.floor(r() * 3), p: r() * TAU, s: 0.8 + r() * 0.5 }); }
        this.clumps.push({ wx: c[0], z: c[1], k: c[2], f: fl2, i: ci });
      }, this);
      this.bulbs = null;
    }
    Scene.prototype.resize = function (W, H, dpr) {
      this.W = W; this.H = H; this.dpr = dpr;
      this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr);
      this.L = layout(W, H);
      this.genGrass();
    };
    Scene.prototype.genGrass = function () {
      var L = this.L, r = rnd(4242), n = Math.round(Math.min(620, 240 + L.W * 0.28) * (this.opt.thumb ? 0.5 : 1)), i;
      var bands = [];
      for (i = 0; i < 24; i++) { bands.push([]); }
      this.blades = [];
      for (i = 0; i < n; i++) {
        var z = 0.01 + Math.pow(r(), 0.8) * 1.06, rg = wxRange(L, z), wx = lerp(rg[0], rg[1], r());
        if (z > 0.3 && Math.abs(wx - pathX(z)) < 0.55 + z * 0.25 && r() < 0.85) { continue; }
        var b = { z: z, wx: wx, h: 0.7 + r() * 1.3, lean: (r() - 0.5) * 0.5, sh: Math.floor(r() * 3), p: r() * TAU, f: r() < (z > 0.5 ? 0.2 : 0.09) ? 1 + Math.floor(r() * 5) : 0 };
        var bi = Math.min(23, Math.floor(z / 1.1 * 24));
        bands[bi].push(b);
      }
      this.bands = bands;
      this.fg = [];
      var fr = wxRange(L, 1.12);
      for (i = 0; i < (this.opt.thumb ? 20 : 80); i++) { this.fg.push({ wx: lerp(fr[0], fr[1], r()), z: 1.1 + r() * 0.06, h: 2.2 + r() * 3.2, lean: (r() - 0.5) * 0.7, p: r() * TAU, f: r() < 0.3 }); }
    };

    /* ---------- keadaan per bingkai ---------- */
    Scene.prototype.compute = function (st) {
      var L = this.L, sky = at(SKY, st.h), li = at(LIGHT, st.h);
      st.top = sky[1]; st.mid = sky[2]; st.hor = sky[3];
      st.lc = li[1]; st.haze = li[2]; st.night = li[3];
      var rain = this.fx.rain;
      if (rain > 0) {
        var grey = [130, 138, 150];
        st.top = mix(st.top, mix(grey, st.top, 0.4), rain * 0.55); st.mid = mix(st.mid, grey, rain * 0.45); st.hor = mix(st.hor, grey, rain * 0.4);
        st.lc = mix(st.lc, mul(st.lc, [205, 210, 220]), rain * 0.6);
      }
      var f = (st.h - SUNRISE) / (SUNSET - SUNRISE), alt = f < 0 ? f * 2.2 : f > 1 ? (1 - f) * 2.2 : Math.sin(f * PI);
      st.sun = { x: lerp(L.sx0, L.sx1, f), y: L.yHor - alt * L.sunH, alt: alt, f: f };
      var mf = (st.h - 18.25) / 4.6, malt = mf < 0 ? mf * 2 : Math.sin(c01(mf) * PI * 0.5) * 0.92 + 0.08 * c01(mf * 3);
      st.moon = { x: lerp(L.mx0, L.mx1, c01(mf)), y: L.yHor - malt * L.moonH, alt: malt };
      st.sunDir = st.sun.x > L.cx ? 1 : -1;
      st.day = 1 - st.night;
    };
    function shade(st, base, hz) { var c = mul(base, st.lc); return hz ? mix(c, st.haze, hz) : c; }

    /* ---------- langit ---------- */
    Scene.prototype.drawSky = function (ctx, st) {
      var L = this.L, g = ctx.createLinearGradient(0, 0, 0, L.yHor + L.u * 4);
      g.addColorStop(0, css(st.top)); g.addColorStop(0.55, css(st.mid)); g.addColorStop(1, css(st.hor));
      ctx.fillStyle = g; ctx.fillRect(0, 0, L.W, L.H);
      var s = st.sun, low = 1 - c01(s.alt * 1.6), vis = c01((s.alt + 0.25) * 3);
      if (vis > 0) {
        var gr = ctx.createRadialGradient(s.x, Math.min(s.y, L.yHor), 0, s.x, Math.min(s.y, L.yHor), L.W * 0.9);
        var gc = mix([255, 214, 150], [255, 150, 90], low);
        gr.addColorStop(0, css(gc, 0.55 * vis * (0.35 + low * 0.65))); gr.addColorStop(0.35, css(gc, 0.16 * vis * (0.3 + low))); gr.addColorStop(1, css(gc, 0));
        ctx.fillStyle = gr; ctx.fillRect(0, 0, L.W, L.yHor + L.u * 8);
      }
      if (st.night > 0.35) {
        var mw = ctx.createLinearGradient(L.W * 0.1, 0, L.W * 0.9, L.yHor);
        var a = (st.night - 0.35) * 0.22;
        mw.addColorStop(0, "rgba(160,170,230,0)"); mw.addColorStop(0.45, "rgba(170,175,235," + a.toFixed(3) + ")"); mw.addColorStop(0.55, "rgba(200,190,240," + (a * 1.2).toFixed(3) + ")"); mw.addColorStop(1, "rgba(160,170,230,0)");
        ctx.fillStyle = mw; ctx.fillRect(0, 0, L.W, L.yHor);
      }
    };
    Scene.prototype.drawStars = function (ctx, st) {
      var n = st.night * (1 - this.fx.rain);
      if (n < 0.08) { return; }
      var L = this.L, t = st.time;
      ctx.fillStyle = "#fffbe8";
      for (var i = 0; i < this.stars.length; i++) {
        var s = this.stars[i], y = s.y * L.yHor;
        var a = n * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.f + s.p))) * c01((L.yHor - y) / (L.u * 12));
        if (a < 0.03) { continue; }
        ctx.globalAlpha = a; ctx.fillRect(s.x * L.W, y, s.s, s.s);
      }
      ctx.globalAlpha = 1;
      if (!this.opt.thumb && n > 0.6) {
        if (t > this.nextShoot) { this.shoot = { t: t, x: L.W * (0.25 + Math.random() * 0.6), y: L.yHor * (0.08 + Math.random() * 0.25) }; this.nextShoot = t + 7 + Math.random() * 9; }
        if (this.shoot && t - this.shoot.t < 1.1) {
          var k = (t - this.shoot.t) / 1.1, sx = this.shoot.x - k * L.u * 26, sy = this.shoot.y + k * L.u * 11;
          var gl = ctx.createLinearGradient(sx, sy, sx + L.u * 9, sy - L.u * 3.8);
          gl.addColorStop(0, "rgba(255,250,230," + (0.9 * (1 - k)).toFixed(3) + ")"); gl.addColorStop(1, "rgba(255,250,230,0)");
          ctx.strokeStyle = gl; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + L.u * 9, sy - L.u * 3.8); ctx.stroke();
        }
      }
    };
    Scene.prototype.drawSunMoon = function (ctx, st) {
      var L = this.L, u = L.u, s = st.sun;
      if (s.alt > -0.3) {
        var low = 1 - c01(s.alt * 1.5), r = u * (3.1 + low * 0.9);
        var halo = ctx.createRadialGradient(s.x, s.y, r * 0.5, s.x, s.y, r * 5);
        halo.addColorStop(0, "rgba(255,236,190,0.55)"); halo.addColorStop(1, "rgba(255,210,150,0)");
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(s.x, s.y, r * 5, 0, TAU); ctx.fill();
        ctx.fillStyle = css(mix([255, 250, 232], [255, 196, 120], low)); ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, TAU); ctx.fill();
        if (low > 0.3 && s.alt > -0.05 && !this.opt.thumb) {
          ctx.save(); ctx.globalCompositeOperation = "lighter";
          for (var i = 0; i < 7; i++) {
            var a0 = -PI / 2 + (i - 3) * 0.26 + Math.sin(st.time * 0.1 + i) * 0.03, len = L.H * 0.55;
            var gl = ctx.createLinearGradient(s.x, s.y, s.x + Math.cos(a0) * len, s.y - Math.sin(a0) * -len);
            var al = 0.05 * (low - 0.3) * (1 - this.fx.rain);
            gl.addColorStop(0, "rgba(255,200,140," + al.toFixed(3) + ")"); gl.addColorStop(1, "rgba(255,200,140,0)");
            ctx.fillStyle = gl; ctx.beginPath(); ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + Math.cos(a0 - 0.05) * len, s.y + Math.sin(a0 - 0.05) * len); ctx.lineTo(s.x + Math.cos(a0 + 0.05) * len, s.y + Math.sin(a0 + 0.05) * len); ctx.fill();
          }
          ctx.restore();
        }
      }
      var m = st.moon;
      if (m.alt > -0.2 && st.night > 0.2) {
        var mr = u * 2.5, ma = c01((st.night - 0.2) * 1.6);
        var mh = ctx.createRadialGradient(m.x, m.y, mr * 0.6, m.x, m.y, mr * 6);
        mh.addColorStop(0, "rgba(230,232,255," + (0.35 * ma).toFixed(3) + ")"); mh.addColorStop(1, "rgba(200,210,255,0)");
        ctx.fillStyle = mh; ctx.beginPath(); ctx.arc(m.x, m.y, mr * 6, 0, TAU); ctx.fill();
        ctx.globalAlpha = ma;
        ctx.fillStyle = "#f5f0dc"; ctx.beginPath(); ctx.arc(m.x, m.y, mr, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(190,184,160,0.45)";
        [[-0.3, -0.2, 0.28], [0.25, 0.1, 0.2], [-0.05, 0.4, 0.16], [0.35, -0.38, 0.12]].forEach(function (c) { ctx.beginPath(); ctx.arc(m.x + c[0] * mr, m.y + c[1] * mr, c[2] * mr, 0, TAU); ctx.fill(); });
        var ms = ctx.createRadialGradient(m.x + mr * 0.35, m.y - mr * 0.3, mr * 0.2, m.x, m.y, mr); ms.addColorStop(0, "rgba(255,255,245,0)"); ms.addColorStop(1, "rgba(150,150,170,0.28)");
        ctx.fillStyle = ms; ctx.beginPath(); ctx.arc(m.x, m.y, mr, 0, TAU); ctx.fill();
        ctx.globalAlpha = 1;
      }
    };
    Scene.prototype.drawClouds = function (ctx, st, far) {
      var L = this.L, u = L.u, rain = this.fx.rain;
      var lit = mix(mix([255, 255, 255], st.lc, 0.55), st.hor, 0.2), sh = mix(mix([214, 218, 232], st.lc, 0.25), [118, 124, 142], 0.12 + rain * 0.6);
      if (st.day < 0.95) { sh = mix(sh, mix(st.mid, st.hor, 0.4), 0.5 * (1 - st.day)); }
      if (st.night > 0.4) { lit = mix(lit, [96, 104, 150], st.night * 0.75); sh = mix(sh, [30, 36, 70], st.night * 0.7); }
      var cov = 0.62 + rain * 0.38, alpha = (0.9 + rain * 0.1) * (1 - st.night * 0.35);
      for (var i = 0; i < this.clouds.length; i++) {
        var c = this.clouds[i];
        if (c.far !== far || i / this.clouds.length > cov) { continue; }
        var w = u * (far ? 5.2 : 7.5) * c.sc * (1 + rain * 0.35), span = L.W + w * 4;
        var x = ((c.x * span + st.time * c.v * u * (1.4 + st.wind * 1.2)) % span) - w * 2, y = c.y * L.yHor * (far ? 0.8 : 1) + u * 2;
        ctx.save(); ctx.globalAlpha = alpha * (far ? 0.75 : 1);
        ctx.beginPath(); ctx.rect(x - w * 2.2, y - w * 2.2, w * 4.4, w * 2.2 + w * 0.02); ctx.clip();
        var g = ctx.createLinearGradient(0, y - w * 0.9, 0, y);
        g.addColorStop(0, css(lit)); g.addColorStop(0.55, css(mix(lit, sh, 0.35))); g.addColorStop(1, css(sh));
        ctx.fillStyle = g; ctx.beginPath();
        for (var k = 0; k < c.puffs.length; k++) { var p = c.puffs[k], px = x + p.x * w, py = y + p.y * w * 0.9 + w * 0.1, pr = p.r * w * 1.05; ctx.moveTo(px + pr, py); ctx.arc(px, py, pr, 0, TAU); }
        ctx.fill();
        ctx.fillStyle = css(mix(lit, [255, 255, 255], 0.25), 0.55 * (1 - st.night)); ctx.beginPath();
        for (var q = 0; q < c.puffs.length; q++) { var pp = c.puffs[q]; if (pp.y > -0.25) { continue; } var qx = x + pp.x * w + st.sunDir * pp.r * w * 0.2, qy = y + pp.y * w * 0.9 - pp.r * w * 0.15, qr = pp.r * w * 0.6; ctx.moveTo(qx + qr, qy); ctx.arc(qx, qy, qr, 0, TAU); }
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };
    /* ---------- gunung ---------- */
    Scene.prototype.drawSmoke = function (ctx, st) {
      if (this.opt.thumb) { return; }
      var L = this.L, u = L.u, v = [-15.5, 21.5, 3.4];
      var cx = L.cx + v[0] * u + L.pan * 0.18, hgt = v[1] * u * L.ms, top = L.yHor - hgt, crt = v[2] * u * 0.5;
      for (var s = 0; s < this.smoke.length; s++) {
        var sp = this.smoke[s], ph = (sp.p + st.time * 0.018) % 1, sx = cx - crt * 0.2 - ph * u * 9 * (0.6 + st.wind * 0.3) + Math.sin(ph * 6 + sp.o * 6) * u * 0.6, sy = top - u * 0.4 - ph * u * 7;
        var sc = mix(shade(st, [235, 235, 235], 0.3), st.hor, 0.3), sr = u * (0.8 + ph * 3.2), sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        sg.addColorStop(0, css(sc, 0.32 * (1 - ph) * (1 - st.night * 0.6))); sg.addColorStop(1, css(sc, 0));
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
      }
    };
    Scene.prototype.drawMountains = function (ctx, st) {
      var L = this.L, u = L.u, W = L.W, x, i, step = Math.max(4, W / 160), pan = L.pan * 0.12;
      // punggung terjauh
      ctx.fillStyle = css(shade(st, C.ridge, 0.62));
      ctx.beginPath(); ctx.moveTo(-10, L.yHor + u);
      for (x = -10; x <= W + 10; x += step) { var wx = (x - pan) / u; ctx.lineTo(x, L.yHor - u * L.ms * (6 + 7 * (fbm(wx * 0.045, 3) * 0.5 + 0.5))); }
      ctx.lineTo(W + 10, L.yHor + u); ctx.fill();
      // gunung kembar
      var sd = st.sunDir, self = this;
      [[-15.5, 21.5, 3.4, 0], [15, 18, 3, 1]].forEach(function (v) {
        var cx = L.cx + v[0] * u + L.pan * 0.18, hgt = v[1] * u * L.ms, wd = v[1] * u * 1.65, top = L.yHor - hgt, crt = v[2] * u * 0.5, base = L.yHor + u * 1.5;
        var body = shade(st, C.volc, 0.48), dark = shade(st, C.volcS, 0.42);
        var vg = ctx.createLinearGradient(0, top, 0, base); vg.addColorStop(0, css(mix(body, dark, 0.35))); vg.addColorStop(0.55, css(body)); vg.addColorStop(1, css(mix(body, st.haze, 0.35)));
        ctx.fillStyle = vg; ctx.beginPath(); ctx.moveTo(cx - wd, base);
        ctx.quadraticCurveTo(cx - wd * 0.35, top + hgt * 0.62, cx - crt, top); ctx.lineTo(cx + crt, top);
        ctx.quadraticCurveTo(cx + wd * 0.35, top + hgt * 0.62, cx + wd, base); ctx.fill();
        // sisi bayangan
        ctx.fillStyle = css(dark, 0.55 + st.day * 0.2); ctx.beginPath();
        var sgn = -sd;
        ctx.moveTo(cx + sgn * crt * 0.2, top); ctx.lineTo(cx + sgn * crt, top);
        ctx.quadraticCurveTo(cx + sgn * wd * 0.35, top + hgt * 0.62, cx + sgn * wd, base);
        ctx.lineTo(cx + sgn * wd * 0.2, base); ctx.quadraticCurveTo(cx + sgn * wd * 0.05, top + hgt * 0.5, cx + sgn * crt * 0.2, top); ctx.fill();
        // alur lereng
        ctx.strokeStyle = css(dark, 0.22); ctx.lineWidth = Math.max(1, u * 0.12); ctx.beginPath();
        for (var k = -4; k <= 4; k++) { if (!k) { continue; } var ex = cx + k * wd * 0.2, ey = base - u * 0.5; ctx.moveTo(cx + k * crt * 0.22, top + u * 0.4); ctx.quadraticCurveTo(cx + k * wd * 0.07, top + hgt * 0.45, ex, ey); }
        ctx.stroke();
      });
      // punggung dekat
      ctx.fillStyle = css(shade(st, C.near, 0.38));
      ctx.beginPath(); ctx.moveTo(-10, L.yMea);
      for (x = -10; x <= W + 10; x += step) { var wx2 = (x - L.pan * 0.25) / u; ctx.lineTo(x, L.yHor + u * 1.3 - u * (1.8 + 2.4 * (fbm(wx2 * 0.07, 9) * 0.5 + 0.5)) - u * 0.5 * Math.max(0, Math.sin(wx2 * 1.7)) * 0.5); }
      ctx.lineTo(W + 10, L.yMea); ctx.fill();
      // kabut cakrawala
      var hz = ctx.createLinearGradient(0, L.yHor - u * 7, 0, L.yHor + u * 3);
      hz.addColorStop(0, css(st.hor, 0)); hz.addColorStop(1, css(mix(st.hor, st.haze, 0.5), 0.55));
      ctx.fillStyle = hz; ctx.fillRect(0, L.yHor - u * 7, W, u * 10);
    };
    /* ---------- bukit tengah: terasering, hutan, kelapa ---------- */
    Scene.prototype.drawHills = function (ctx, st) {
      var L = this.L, u = L.u, gh = st.gh, pan = L.pan * 0.35;
      // bukit hutan kanan
      var fx0 = L.cx + 6 * u + pan, fx1 = L.W + 30 * u, top = L.yMea - 8.5 * u;
      ctx.fillStyle = css(shade(st, C.forest, 0.26));
      ctx.beginPath(); ctx.moveTo(fx0 - 6 * u, L.yMea + u);
      ctx.bezierCurveTo(fx0 + 2 * u, top + 2 * u, fx0 + 9 * u, top, fx0 + 18 * u, top + 0.5 * u);
      ctx.lineTo(fx1, top + u); ctx.lineTo(fx1, L.yMea + u); ctx.fill();
      ctx.fillStyle = css(shade(st, C.forestL, 0.24));
      ctx.beginPath();
      for (var i = 0; i < 26; i++) { var tx = fx0 + i * 1.6 * u - 2 * u, ty = top + 0.9 * u + (i < 5 ? (5 - i) * 1.1 * u : 0) + Math.sin(i * 2.1) * 0.4 * u; ctx.moveTo(tx + 1.2 * u, ty); ctx.arc(tx, ty, (1 + (i % 3) * 0.25) * u, 0, TAU); }
      ctx.fill();
      // bukit terasering kiri
      var hx0 = L.cx - 40 * u + pan, hx1 = L.cx - 1 * u + pan, peak = L.yMea - 10 * u, baseY = L.yMea + 1.2 * u;
      var top2 = function (x) { var k = (x - hx0) / (hx1 - hx0); return baseY - (baseY - peak) * Math.pow(Math.sin(c01(k) * PI), 0.9) * (0.8 + 0.2 * Math.sin(k * 5)); };
      var water = mix(mix(st.mid, st.hor, 0.3), [70, 104, 112], 0.4), young = hx("#86c05a"), rice = hx("#5f9e3f"), gold = hx("#c9b04a");
      var gcol = gh < 7.6 ? water : gh < 10 ? mix(water, young, sm(7.6, 10, gh)) : gh < 14.5 ? mix(young, rice, sm(10, 12.5, gh)) : mix(rice, gold, sm(14.5, 17, gh));
      var nb = 9, step = (hx1 - hx0) / 60, x, k;
      for (k = 0; k < nb; k++) {
        var f0 = k / nb, f1 = (k + 1) / nb;
        var c = gh < 7.6 ? mix(water, st.hor, (k % 2) * 0.15) : mix(gcol, k % 2 ? [255, 255, 230] : [30, 60, 20], 0.06);
        ctx.fillStyle = css(shade(st, gh < 7.6 ? mul(c, [255, 255, 255]) : c, 0.22));
        if (gh < 7.6) { ctx.fillStyle = css(mix(c, st.haze, 0.2)); }
        ctx.beginPath();
        for (x = hx0; x <= hx1 + 1; x += step) { var ty = top2(x); ctx.lineTo(x, ty + (baseY - ty) * f0); }
        for (x = hx1; x >= hx0 - 1; x -= step) { var ty2 = top2(x); ctx.lineTo(x, ty2 + (baseY - ty2) * f1); }
        ctx.fill();
      }
      ctx.strokeStyle = css(mix(shade(st, hx("#d9d2a0"), 0.3), st.hor, gh < 7.6 ? 0.5 : 0), 0.55); ctx.lineWidth = Math.max(0.8, u * 0.1);
      ctx.beginPath();
      for (k = 1; k < nb; k++) { var ff = k / nb; for (x = hx0; x <= hx1 + 1; x += step) { var t3 = top2(x), yy = t3 + (baseY - t3) * ff; if (x === hx0) { ctx.moveTo(x, yy); } else { ctx.lineTo(x, yy); } } }
      ctx.stroke();
      this.terr = { hx0: hx0, hx1: hx1, peak: peak, baseY: baseY };
      // saung di sawah
      var sx2 = hx1 - 9 * u, sy2 = top2(sx2) + (baseY - top2(sx2)) * 0.45, su = u * 0.55;
      ctx.strokeStyle = css(shade(st, C.wood, 0.25)); ctx.lineWidth = Math.max(1, su * 0.35);
      ctx.beginPath(); ctx.moveTo(sx2 - su * 2, sy2); ctx.lineTo(sx2 - su * 2, sy2 - su * 3.2); ctx.moveTo(sx2 + su * 2, sy2); ctx.lineTo(sx2 + su * 2, sy2 - su * 3.2); ctx.moveTo(sx2 - su * 2.2, sy2 - su * 1.4); ctx.lineTo(sx2 + su * 2.2, sy2 - su * 1.4); ctx.stroke();
      ctx.fillStyle = css(shade(st, hx("#b89a5e"), 0.25)); ctx.beginPath(); ctx.moveTo(sx2 - su * 3.4, sy2 - su * 2.9); ctx.lineTo(sx2, sy2 - su * 5.6); ctx.lineTo(sx2 + su * 3.4, sy2 - su * 2.9); ctx.fill();
    };
    Scene.prototype.drawHillsLive = function (ctx, st) {
      var L = this.L, u = L.u, gh = st.gh, T = this.terr, k;
      if (T && gh < 8.4) {
        var hx0 = T.hx0, hx1 = T.hx1, peak = T.peak, baseY = T.baseY;
        var top2 = function (x) { var kk = (x - hx0) / (hx1 - hx0); return baseY - (baseY - peak) * Math.pow(Math.sin(c01(kk) * PI), 0.9) * (0.8 + 0.2 * Math.sin(kk * 5)); };
        ctx.strokeStyle = "rgba(255,255,255," + (0.25 * (1 - sm(7.6, 8.4, gh)) * (st.day * 0.8 + 0.2)).toFixed(3) + ")"; ctx.lineWidth = 1;
        ctx.beginPath();
        for (k = 0; k < 22; k++) { var sx = lerp(hx0 + 4 * u, hx1 - 4 * u, (k * 0.618) % 1), f = ((k * 0.37) % 1), sy = top2(sx) + (baseY - top2(sx)) * f; var ww = u * (0.6 + (k % 3) * 0.3); var sh = Math.sin(st.time * 1.2 + k) * u * 0.3; ctx.moveTo(sx - ww + sh, sy); ctx.lineTo(sx + ww + sh, sy); }
        ctx.stroke();
      }
      // kelapa
      for (var p = 0; p < this.palms.length; p++) { this.drawPalm(ctx, st, this.palms[p]); }
    };
    Scene.prototype.drawPalm = function (ctx, st, pm) {
      var L = this.L, pr = proj(L, pm.wx, pm.z, {}), u = pr.s * 1.25 * pm.h, x = pr.x, y = pr.y + L.u * 0.3, hgt = u * 13;
      var sway = Math.sin(st.time * 0.9 + pm.wx) * (0.3 + st.wind * 0.5);
      var tx = x + u * 2.2 + sway * u * 0.6, ty = y - hgt;
      ctx.strokeStyle = css(shade(st, C.palmT, 0.2)); ctx.lineWidth = u * 0.55; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + u * 0.2, y - hgt * 0.6, tx, ty); ctx.stroke();
      ctx.strokeStyle = css(shade(st, C.palmL, 0.2)); ctx.lineWidth = Math.max(1, u * 0.22);
      ctx.beginPath();
      for (var i = 0; i < 9; i++) {
        var a = -PI / 2 + (i - 4) * 0.42 + sway * 0.12, len = u * (4.2 + (i % 3) * 0.6), droop = 0.9 + Math.abs(i - 4) * 0.25;
        var ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len * 0.35 + len * 0.55 * droop * 0.5;
        var mx = tx + Math.cos(a) * len * 0.55, my = ty + Math.sin(a) * len * 0.45 - u * 0.5;
        ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx, my, ex, ey);
        for (var k = 1; k < 7; k++) {
          var t = k / 7, qx = (1 - t) * (1 - t) * tx + 2 * (1 - t) * t * mx + t * t * ex, qy = (1 - t) * (1 - t) * ty + 2 * (1 - t) * t * my + t * t * ey;
          var ll = u * 1.1 * (1 - t * 0.6);
          ctx.moveTo(qx, qy); ctx.lineTo(qx + Math.cos(a + 1.2) * ll * 0.5, qy + ll); ctx.moveTo(qx, qy); ctx.lineTo(qx + Math.cos(a - 1.2) * ll * 0.5, qy + ll * 0.9);
        }
      }
      ctx.stroke();
    };
    /* ---------- telaga ---------- */
    Scene.prototype.drawLake = function (ctx, st) {
      var L = this.L, u = L.u, pan = L.pan * 0.45;
      var x0 = L.cx - 33 * u + pan, x1 = L.cx - 3.2 * u + pan, y0 = L.yMea - 1.6 * u, y1 = L.yMea + 2.6 * u;
      var cxl = (x0 + x1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2;
      var g = ctx.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, css(mix(st.hor, st.haze, 0.25))); g.addColorStop(1, css(mix(mix(st.mid, st.top, 0.4), [40, 70, 70], 0.35)));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cxl, (y0 + y1) / 2, rx, ry, 0, 0, TAU); ctx.fill();
    };
    Scene.prototype.drawLakeLive = function (ctx, st) {
      var L = this.L, u = L.u, pan = L.pan * 0.45;
      var x0 = L.cx - 33 * u + pan, x1 = L.cx - 3.2 * u + pan, y0 = L.yMea - 1.6 * u, y1 = L.yMea + 2.6 * u;
      var cxl = (x0 + x1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2;
      var s = st.sun;
      if (s.alt > -0.05 && s.x > x0 && s.x < x1) {
        var sa = 0.55 * c01(1 - s.alt) * (1 - this.fx.rain);
        ctx.fillStyle = "rgba(255,226,170," + sa.toFixed(3) + ")"; ctx.beginPath();
        for (var gi = 0; gi < 9; gi++) { var gy = y0 + ry * 0.3 + gi * ry * 0.19, gw = u * (0.4 + gi * 0.16) * (0.6 + 0.4 * Math.sin(st.time * 3 + gi * 1.9)); ctx.moveTo(s.x - gw, gy); ctx.ellipse(s.x + Math.sin(gi * 2.3) * u * 0.3, gy, gw, Math.max(0.6, u * 0.08), 0, 0, TAU); }
        ctx.fill();
      }
      var sparkle = 0.22 + this.fx.river * 0.4;
      ctx.strokeStyle = "rgba(255,255,255," + (sparkle * (0.3 + st.day * 0.7)).toFixed(3) + ")"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i < 18; i++) {
        var fx = ((i * 0.618 + st.time * 0.01 * (i % 3 + 1)) % 1), fy = (i * 0.383) % 1;
        var lx = cxl + (fx - 0.5) * rx * 1.7 * Math.sqrt(1 - Math.pow(fy * 2 - 1, 2)), ly = y0 + ry * 0.25 + fy * ry * 1.6, ww = u * (0.5 + (i % 4) * 0.35) * (0.6 + 0.4 * Math.sin(st.time * 2 + i));
        ctx.moveTo(lx - ww, ly); ctx.lineTo(lx + ww, ly);
      }
      ctx.stroke();
      // teratai
      var open = st.fl.teratai;
      for (var k = 0; k < this.lotus.length; k++) {
        var lo = this.lotus[k], lx2 = cxl + (lo.x - 0.5) * rx * 1.25, ly2 = y0 + ry * 0.55 + lo.y * ry * 1.2, sc = u * 0.5 * lo.s * (0.6 + lo.y * 0.6);
        ctx.fillStyle = css(shade(st, C.pad, 0.15)); ctx.beginPath(); ctx.ellipse(lx2, ly2, sc * 1.6, sc * 0.55, 0, 0.35, TAU - 0.05); ctx.lineTo(lx2, ly2); ctx.fill();
        if (lo.f) {
          var o = open * (0.85 + 0.15 * Math.sin(st.time + lo.p)), fx2 = lx2 + sc * 0.4, fy2 = ly2 - sc * 0.3;
          ctx.fillStyle = css(shade(st, C.lotusD, 0.1));
          ctx.beginPath(); ctx.ellipse(fx2, fy2 - sc * 0.35, sc * (0.28 + o * 0.1), sc * 0.7, 0, 0, TAU); ctx.fill();
          if (o > 0.05) {
            ctx.fillStyle = css(shade(st, C.lotus, 0.08));
            ctx.beginPath();
            for (var pt = -2; pt <= 2; pt++) { var a = pt * 0.42 * o; ctx.ellipse(fx2 + Math.sin(a) * sc * 0.5, fy2 - Math.cos(a) * sc * 0.45, sc * 0.26, sc * 0.62, a, 0, TAU); }
            ctx.fill();
          }
        }
      }
    };
    Scene.prototype.drawBoat = function (ctx, st) {
      if (!this.boat) { return; }
      var L = this.L, u = L.u, pan = L.pan * 0.45, x0 = L.cx - 33 * u + pan, x1 = L.cx - 3.2 * u + pan, cxl = (x0 + x1) / 2, rx = (x1 - x0) / 2, t = st.time;
      var bx = cxl + Math.sin(t * 0.045) * rx * 0.55, by = L.yMea + 0.9 * u + Math.sin(t * 1.3) * u * 0.08, bs = u * 0.85;
      ctx.fillStyle = css(shade(st, [250, 246, 232], 0.05));
      ctx.beginPath(); ctx.moveTo(bx - bs * 1.6, by - bs * 0.25); ctx.lineTo(bx + bs * 1.6, by - bs * 0.25); ctx.lineTo(bx + bs, by + bs * 0.35); ctx.lineTo(bx - bs, by + bs * 0.35); ctx.fill();
      ctx.fillStyle = css(shade(st, [236, 230, 212], 0.05));
      ctx.beginPath(); ctx.moveTo(bx - bs * 0.1, by - bs * 0.25); ctx.lineTo(bx - bs * 0.1, by - bs * 1.7); ctx.lineTo(bx + bs * 0.95, by - bs * 0.25); ctx.fill();
      if (st.night > 0.3) { var g = glowSprite([255, 214, 150]), r = bs * 2.2; ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = st.night * 0.8; ctx.drawImage(g, bx - r, by - bs * 0.6 - r, r * 2, r * 2); ctx.restore(); }
    };
    Scene.prototype.drawMist = function (ctx, st, front) {
      var fog = ((1 - sm(6.2, 8.4, st.h)) * (st.coverFog || 1) + this.fx.rain * 0.25) * (this.L.wide ? 0.62 : 1);
      if (fog < 0.02) { return; }
      var L = this.L, u = L.u, col = mix(mix(st.haze, [244, 244, 252], 0.5), st.hor, 0.25), key = col.map(function (v) { return Math.round(v / 8); }).join(",");
      if (!this.mistSpr || this.mistKey !== key) {
        var c = this.mistSpr || document.createElement("canvas"); c.width = 256; c.height = 64;
        var g = c.getContext("2d"), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        g.clearRect(0, 0, 256, 64); g.save(); g.scale(1, 0.25);
        gr.addColorStop(0, css(col, 0.62)); gr.addColorStop(0.6, css(col, 0.3)); gr.addColorStop(1, css(col, 0));
        g.fillStyle = gr; g.fillRect(0, 0, 256, 256); g.restore();
        this.mistSpr = c; this.mistKey = key;
      }
      var list = front ? [[0.7, 14, 0.75], [0.95, 20, 0.5]] : [[-0.1, 9, 1.25], [0.12, 12, 1.1], [0.36, 12, 0.8]];
      for (var i = 0; i < list.length; i++) {
        var b = list[i], y = L.yMea + b[0] * (L.H - L.yMea) - (front ? 0 : u * 1.5), off = Math.sin(st.time * 0.05 + i * 1.7) * L.W * 0.08 + (st.time * 3 * (i % 2 ? 1 : -1)) % (L.W * 0.4);
        var w = L.W * 1.8, hgt = b[1] * u * 2.2;
        ctx.globalAlpha = Math.min(1, fog * b[2]);
        ctx.drawImage(this.mistSpr, L.W / 2 + off - w / 2, y - hgt / 2, w, hgt);
      }
      ctx.globalAlpha = 1;
    };
    /* ---------- padang ---------- */
    Scene.prototype.drawGround = function (ctx, st) {
      var L = this.L, u = L.u, gh = st.gh, W = L.W;
      var base = gh < 9.5 ? mix(C.bare, C.green, sm(5.8, 9.5, gh)) : mix(C.green, C.warm, sm(14.5, 17, gh));
      var g = ctx.createLinearGradient(0, L.yMea - u, 0, L.H);
      g.addColorStop(0, css(shade(st, mix(base, [150, 170, 120], 0.15), 0.16))); g.addColorStop(0.45, css(shade(st, base, 0.04))); g.addColorStop(1, css(shade(st, mix(base, C.groundD, 0.55), 0)));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(-10, L.H + 10);
      var pan = L.pan * 0.55, stp = Math.max(6, W / 90);
      for (var ex = -10; ex <= W + 10; ex += stp) { var nx = (ex - pan - L.cx) / (u * 26); ctx.lineTo(ex, L.yMea + u * (0.5 - 1.6 * (fbm(nx + 2.3, 17) * 0.5 + 0.5)) + u * 0.8 * Math.max(0, Math.abs(nx) - 0.8)); }
      ctx.lineTo(W + 10, L.H + 10); ctx.fill();
      var r0 = rnd(303), light = mix(base, [200, 214, 120], 0.18), dark = mix(base, C.groundD, 0.3);
      for (var pi = 0; pi < 9; pi++) {
        var pz = 0.05 + r0() * 0.95, prg = wxRange(L, pz), pwx = lerp(prg[0], prg[1], r0()), pp = proj(L, pwx, pz, {}), pr = pp.s * (8 + r0() * 10) * L.lat;
        var pc = shade(st, pi % 2 ? light : dark, 0.02), pg = ctx.createRadialGradient(pp.x, pp.y, 0, pp.x, pp.y, pr);
        pg.addColorStop(0, css(pc, 0.35)); pg.addColorStop(1, css(pc, 0));
        ctx.save(); ctx.translate(pp.x, pp.y); ctx.scale(1, 0.28); ctx.translate(-pp.x, -pp.y); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(pp.x, pp.y, pr, 0, TAU); ctx.fill(); ctx.restore();
      }
    };
    Scene.prototype.drawDew = function (ctx, st) {
      var L = this.L;
      if (st.h < 8.2 && st.h > 5.2 && !this.opt.thumb) {
        var dew = (1 - sm(7.4, 8.2, st.h)) * sm(5.2, 5.9, st.h);
        ctx.fillStyle = "rgba(255,255,255," + (0.7 * dew).toFixed(3) + ")";
        for (var di = 0; di < 60; di++) { var dz = ((di * 0.618) % 1) * 1.02, drg = wxRange(L, dz), dp = proj(L, lerp(drg[0], drg[1], (di * 0.7549) % 1), dz), tw = Math.max(0, Math.sin(st.time * 2.2 + di * 1.7)); if (tw < 0.4) { continue; } var dr = 0.6 + tw * dp.s * 0.09; ctx.fillRect(dp.x - dr, dp.y - dp.s * 0.6, dr * 2, 0.8); ctx.fillRect(dp.x - 0.4, dp.y - dp.s * 0.6 - dr, 0.8, dr * 2); }
      }
      // bintik tekstur
      if (!this.opt.thumb) {
        ctx.fillStyle = css(shade(st, C.groundD, 0), 0.16);
        ctx.beginPath();
        for (var i = 0; i < 90; i++) { var z = ((i * 0.618) % 1) * 1.05, rg = wxRange(L, z), wx = lerp(rg[0], rg[1], (i * 0.3819) % 1); var p = proj(L, wx, z); ctx.moveTo(p.x + p.s * 0.7, p.y); ctx.ellipse(p.x, p.y, p.s * 0.7, p.s * 0.18, 0, 0, TAU); }
        ctx.fill();
      }
    };
    Scene.prototype.drawPath = function (ctx, st) {
      var L = this.L, gh = st.gh;
      for (var i = 0; i < this.stones.length; i++) {
        var sn = this.stones[i], a = 8.0 + (i / this.stones.length) * 1.4, k = sm(a, a + 0.18, gh);
        if (k <= 0) { continue; }
        var p = proj(L, pathX(sn.z) + sn.dx, sn.z), w = p.s * 1.2 * sn.w * (0.4 + 0.6 * k) * L.lat * 0.62, h = p.s * 0.42 * (0.4 + 0.6 * k);
        ctx.fillStyle = css(shade(st, C.stoneD, 0.05), 0.8 * k); ctx.beginPath(); ctx.ellipse(p.x, p.y + h * 0.3, w, h, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = css(shade(st, C.stone, 0.05), k); ctx.beginPath(); ctx.ellipse(p.x, p.y, w * 0.96, h * 0.85, 0, 0, TAU); ctx.fill();
      }
      var pk = sm(12.6, 13.6, gh);
      if (pk > 0) {
        var r = rnd(55);
        ctx.fillStyle = css(shade(st, C.petal, 0.05), 0.9);
        ctx.beginPath();
        for (var j = 0; j < 70 * pk; j++) { var z = 0.36 + r() * 0.42, pp = proj(L, pathX(z) + (r() - 0.5) * 0.9, z), rr = pp.s * 0.13; ctx.moveTo(pp.x + rr, pp.y); ctx.ellipse(pp.x, pp.y, rr, rr * 0.55, r() * 3, 0, TAU); }
        ctx.fill();
        ctx.fillStyle = css(shade(st, C.white, 0.05), 0.9);
        ctx.beginPath();
        for (var j2 = 0; j2 < 40 * pk; j2++) { var z2 = 0.36 + r() * 0.42, p2 = proj(L, pathX(z2) + (r() - 0.5) * 0.9, z2), r2 = p2.s * 0.11; ctx.moveTo(p2.x + r2, p2.y); ctx.ellipse(p2.x, p2.y, r2, r2 * 0.55, r() * 3, 0, TAU); }
        ctx.fill();
      }
    };
    Scene.prototype.drawPools = function (ctx, st) {
      var on = st.lights;
      if (on < 0.02) { return; }
      var L = this.L, spots = [[0, 0.42, 5], [-4, 0.36, 4], [4.8, 0.34, 4], [9.5, 0.42, 4]];
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < spots.length; i++) {
        var p = proj(L, spots[i][0], spots[i][1]), r = p.s * spots[i][2] * 2.2;
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, "rgba(255,190,110," + (0.16 * on).toFixed(3) + ")"); g.addColorStop(1, "rgba(255,190,110,0)");
        ctx.fillStyle = g; ctx.save(); ctx.translate(p.x, p.y); ctx.scale(1, 0.38); ctx.translate(-p.x, -p.y); ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, TAU); ctx.fill(); ctx.restore();
      }
      ctx.restore();
    };
    /* ---------- pohon ---------- */
    Scene.prototype.drawTree = function (ctx, st, T, o) {
      var L = this.L, p = proj(L, o.wx, o.z, {}), g = o.g, H = p.s * o.hgt * (0.18 + 0.82 * g), x0 = p.x, y0 = p.y, t = st.time, sx = o.spread;
      var wind = st.wind, maxD = 0.6 + g * 5.2, lf = o.leaf, sd = st.sunDir;
      function sw(y) { return wind * Math.sin(t * 1.05 + y * 4 + o.ph) * (-y) * H * 0.018 + wind * (-y) * H * 0.012; }
      ctx.lineCap = "round"; ctx.strokeStyle = css(shade(st, C.trunk, 0.06));
      for (var i = 0; i < T.segs.length; i++) {
        var s = T.segs[i];
        if (s.d > maxD) { continue; }
        var part = c01(maxD - s.d);
        var x2 = s.x1 + (s.x2 - s.x1) * part, y2 = s.y1 + (s.y2 - s.y1) * part;
        ctx.lineWidth = Math.max(0.8, s.w * H * (0.55 + 0.45 * g) * (s.d === 0 ? 1.15 : 1));
        ctx.beginPath(); ctx.moveTo(x0 + s.x1 * H * sx + sw(s.y1), y0 + s.y1 * H); ctx.lineTo(x0 + x2 * H * sx + sw(y2), y0 + y2 * H); ctx.stroke();
      }
      if (lf <= 0.01) { return p; }
      var night = st.night, passes = [[o.leaf0, 0.26, 1.05, 0, 0], [o.leaf1, 0, 0.92, -0.1, 0], [o.leaf2, -0.3, 0.55, 0.28, 1]];
      for (var q = 0; q < 3; q++) {
        var pc = passes[q];
        if (q === 2 && night > 0.8) { break; }
        ctx.fillStyle = css(shade(st, pc[0], o.hz), q === 2 ? 0.85 * (1 - night) : 1);
        ctx.beginPath();
        for (var k = 0; k < T.blobs.length; k++) {
          var b = T.blobs[k];
          if (b.dep > maxD + 0.5) { continue; }
          if (q === 2 && b.y > -0.62) { continue; }
          var r = b.r * H * lf * pc[2] * (0.9 + 0.1 * Math.sin(t * 0.8 + b.p));
          var bx = x0 + b.x * H * sx + sw(b.y) + sd * r * pc[3], by = y0 + b.y * H + r * pc[1];
          ctx.moveTo(bx + r, by); ctx.arc(bx, by, r, 0, TAU);
        }
        ctx.fill();
      }
      if (o.bloom > 0.01) {
        ctx.fillStyle = css(shade(st, o.bloomCol, 0.05), 0.95 - st.night * 0.45);
        ctx.beginPath();
        for (var m = 0; m < T.blobs.length; m++) {
          var bb = T.blobs[m];
          var n = Math.floor(o.bloom * o.bloomN + ((m * 7) % 3) * o.bloom * 0.5);
          for (var j = 0; j < n; j++) {
            var ang = bb.p + j * 2.4, rr = bb.r * H * lf * (0.35 + ((j * 0.37) % 0.55));
            var fx = x0 + bb.x * H * sx + sw(bb.y) + Math.cos(ang) * rr, fy = y0 + bb.y * H + Math.sin(ang) * rr * 0.8 - bb.r * H * 0.2;
            var fr = Math.max(0.9, H * 0.012 * o.bloomSize);
            ctx.moveTo(fx + fr, fy); ctx.arc(fx, fy, fr, 0, TAU);
          }
        }
        ctx.fill();
      }
      p.H = H; return p;
    };
    Scene.prototype.bigTree = function (ctx, st) {
      var gh = st.gh, g = 0.42 + 0.58 * sm(5.6, 11, gh);
      var o = { wx: this.L.portrait ? 5 : 4.4, z: 0.26, hgt: this.L.portrait ? 38 : 44, g: g, spread: 1.22, leaf: 0.08 + 0.92 * sm(5.9, 9.6, gh), ph: 0.4, hz: 0.04, leaf0: C.leaf[0], leaf1: C.leaf[1], leaf2: C.leaf[2], bloom: sm(12.7, 14.2, gh), bloomCol: C.blos, bloomSize: 0.8, bloomN: 1.05 };
      var p = this.drawTree(ctx, st, this.tree, o);
      this.treeAnchor = { x: p.x, y: p.y, H: (p.H || 0), g: g };
    };
    Scene.prototype.flamTree = function (ctx, st) {
      var gh = st.gh;
      this.drawTree(ctx, st, this.flam, { wx: -10.4, z: 0.2, hgt: 30, g: 0.32 + 0.68 * sm(5.8, 11.5, gh), spread: 0.95, leaf: 0.06 + 0.94 * sm(6.2, 10, gh), ph: 2.1, hz: 0.1, leaf0: hx("#2f6a3a"), leaf1: hx("#468a47"), leaf2: hx("#6db05c"), bloom: sm(13.6, 15.2, gh), bloomCol: C.flam, bloomSize: 1.5, bloomN: 4 });
    };
    Scene.prototype.drawBamboo = function (ctx, st) {
      var L = this.L, p = proj(L, 14.2, 0.14, {}), t = st.time, gh = st.gh, gr = 0.55 + 0.45 * sm(5.5, 9, gh);
      ctx.lineCap = "round";
      for (var i = 0; i < this.bamboo.length; i++) {
        var b = this.bamboo[i], hgt = p.s * 30 * b.h * gr, sw = (st.wind * 0.8 + 0.2) * Math.sin(t * 0.9 + b.p) * 0.06 + st.wind * 0.05;
        var bx = p.x + b.dx * p.s * 6, tx = bx + (b.lean + sw) * hgt, ty = p.y - hgt;
        ctx.strokeStyle = css(shade(st, C.bamboo, 0.14)); ctx.lineWidth = Math.max(1, p.s * 0.45);
        ctx.beginPath(); ctx.moveTo(bx, p.y); ctx.quadraticCurveTo(bx + (tx - bx) * 0.3, p.y - hgt * 0.6, tx, ty); ctx.stroke();
        ctx.strokeStyle = css(shade(st, C.bambooL, 0.14)); ctx.lineWidth = Math.max(1, p.s * 0.32);
        ctx.beginPath();
        for (var k = 3; k < 10; k++) {
          var f = k / 10, lx = bx + (tx - bx) * f * f, ly = p.y - hgt * f, dir = k % 2 ? 1 : -1, ll = p.s * (1.6 + (k % 3) * 0.5);
          ctx.moveTo(lx, ly); ctx.quadraticCurveTo(lx + dir * ll * 0.6, ly - ll * 0.2, lx + dir * ll + sw * ll * 3, ly + ll * 0.35);
        }
        ctx.stroke();
      }
    };
    /* ---------- tiang & lampu gantung ---------- */
    Scene.prototype.poleTops = function (st) {
      var L = this.L, a = proj(L, -6.8, 0.36, {}), b = proj(L, 12.2, 0.36, {}), k = sm(14, 14.5, st.gh);
      return [{ x: a.x, y: a.y, top: a.y - a.s * 15 * k, s: a.s, k: k }, { x: b.x, y: b.y, top: b.y - b.s * 15 * k, s: b.s, k: k }];
    };
    Scene.prototype.drawPoles = function (ctx, st) {
      var pt = this.poleTops(st);
      if (pt[0].k <= 0) { return; }
      ctx.strokeStyle = css(shade(st, C.wood, 0.05)); ctx.lineCap = "round";
      for (var i = 0; i < 2; i++) { ctx.lineWidth = Math.max(1, pt[i].s * 0.45); ctx.beginPath(); ctx.moveTo(pt[i].x, pt[i].y); ctx.lineTo(pt[i].x, pt[i].top); ctx.stroke(); }
    };
    Scene.prototype.wires = function (st) {
      var pt = this.poleTops(st), ta = this.treeAnchor;
      if (!ta || pt[0].k < 1) { return []; }
      var ax = ta.x - ta.H * 0.12, ay = ta.y - ta.H * 0.5, bx = ta.x + ta.H * 0.2, by = ta.y - ta.H * 0.46;
      return [[pt[0].x, pt[0].top, ax, ay, 0.12], [bx, by, pt[1].x, pt[1].top, 0.1], [pt[0].x, pt[0].top, pt[1].x, pt[1].top, 0.16]];
    };
    Scene.prototype.drawWires = function (ctx, st) {
      var ws = this.wires(st), k = sm(14.4, 15, st.gh);
      if (!ws.length || k <= 0) { this.bulbs = []; return; }
      var L = this.L, bulbs = [], wind = Math.sin(st.time * 0.8) * st.wind * L.u * 0.3;
      ctx.strokeStyle = css(shade(st, [60, 50, 40], 0.1), 0.7 * k); ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (var i = 0; i < ws.length; i++) {
        var w = ws[i], mx = (w[0] + w[2]) / 2, my = Math.max(w[1], w[3]) + Math.abs(w[2] - w[0]) * w[4] + wind;
        ctx.moveTo(w[0], w[1]); ctx.quadraticCurveTo(mx, my, w[2], w[3]);
        var len = Math.abs(w[2] - w[0]), n = Math.max(4, Math.floor(len / (L.u * 1.3)));
        for (var j = 1; j < n; j++) { var t = j / n, x = (1 - t) * (1 - t) * w[0] + 2 * (1 - t) * t * mx + t * t * w[2], y = (1 - t) * (1 - t) * w[1] + 2 * (1 - t) * t * my + t * t * w[3]; bulbs.push({ x: x, y: y + 2, i: bulbs.length }); }
      }
      ctx.stroke();
      var on = st.lights, nb = bulbs.length;
      for (var b = 0; b < nb; b++) {
        var bl = bulbs[b], ok = on * sm(17.85 + (b / nb) * 0.55, 17.95 + (b / nb) * 0.55, st.h);
        bl.on = ok;
        ctx.fillStyle = ok > 0.1 ? css(mix(shade(st, [250, 245, 230], 0), [255, 220, 150], ok)) : css(shade(st, [240, 236, 226], 0.05), k);
        ctx.beginPath(); ctx.arc(bl.x, bl.y, Math.max(1.1, L.u * 0.2), 0, TAU); ctx.fill();
      }
      this.bulbs = bulbs;
    };
    /* ---------- gerbang pelaminan ---------- */
    Scene.prototype.drawArch = function (ctx, st) {
      var gh = st.gh, kp = sm(10.3, 10.9, gh);
      if (kp <= 0) { return; }
      var L = this.L, p = proj(L, 0, 0.4, {}), s = p.s, t = st.time, hw = 2.35 * L.lat * s, hgt = 15 * s * kp, x = p.x, y = p.y;
      var kb = sm(10.8, 11.1, gh), kd = sm(11, 11.4, gh), kf = sm(11.2, 11.7, gh);
      ctx.lineCap = "round";
      ctx.strokeStyle = css(shade(st, C.wood, 0.04)); ctx.lineWidth = Math.max(1.2, s * 0.55);
      ctx.beginPath(); ctx.moveTo(x - hw, y); ctx.lineTo(x - hw, y - hgt); ctx.moveTo(x + hw, y); ctx.lineTo(x + hw, y - hgt); ctx.stroke();
      if (kb > 0) {
        var ty = y - hgt, ov = s * 1.2;
        ctx.lineWidth = Math.max(1.2, s * 0.6);
        ctx.beginPath(); ctx.moveTo(x - hw - ov * kb, ty); ctx.lineTo(x - hw + (hw * 2 + ov) * kb, ty); ctx.stroke();
        if (kd > 0) {
          var sway = Math.sin(t * 0.9) * st.wind * s * 0.5;
          ctx.fillStyle = css(shade(st, C.drape, 0.02), 0.92);
          [-1, 1].forEach(function (d) {
            var ex = x + d * hw, dx = d * s * 0.6;
            ctx.beginPath(); ctx.moveTo(x, ty + s * 0.2); ctx.quadraticCurveTo(x + d * hw * 0.5, ty + hgt * 0.25 * kd, ex + dx * 0.3, ty + s * 0.2);
            ctx.lineTo(ex + dx * 0.4, ty + s * 0.2); ctx.quadraticCurveTo(ex + dx * 1.4 + sway, ty + hgt * 0.5 * kd, ex + dx + sway * 1.5, y - s * 0.2 - hgt * (1 - kd) * 0.9);
            ctx.lineTo(ex - dx * 0.2, y - s * 0.2 - hgt * (1 - kd) * 0.9); ctx.quadraticCurveTo(ex - dx * 0.2 + sway * 0.5, ty + hgt * 0.4, ex - d * s * 0.4, ty + s * 0.6);
            ctx.quadraticCurveTo(x + d * hw * 0.5, ty + hgt * 0.32 * kd, x, ty + s * 0.9); ctx.fill();
          });
        }
        if (kf > 0) {
          var r = rnd(17), cols = [C.white, C.blos, hx("#f7d6c9"), hx("#fbf0d9")], lc = shade(st, C.leaf[1], 0.03);
          ctx.fillStyle = css(lc); ctx.beginPath();
          for (var i = 0; i < 26 * kf; i++) { var a = r(), lx = x - hw * 1.15 + a * hw * 0.9 * (i % 2 ? 1 : -1) + (i % 2 ? hw * 1.4 : 0), ly = ty + (r() - 0.6) * s * 1.6; ctx.moveTo(lx + s * 0.5, ly); ctx.ellipse(lx, ly, s * 0.55, s * 0.25, r() * 3, 0, TAU); }
          ctx.fill();
          for (var c = 0; c < cols.length; c++) {
            ctx.fillStyle = css(shade(st, cols[c], 0.02)); ctx.beginPath();
            for (var j = 0; j < 12 * kf; j++) { var sideX = j % 2 ? x - hw - s * 0.3 : x + hw + s * 0.3, fx = sideX + (r() - 0.5) * s * 3.2, fy = ty + (r() - 0.5) * s * 2, fr = s * (0.28 + r() * 0.22); ctx.moveTo(fx + fr, fy); ctx.arc(fx, fy, fr, 0, TAU); }
            ctx.fill();
          }
          ctx.fillStyle = css(shade(st, C.white, 0.02));
          ctx.beginPath();
          for (var q = -1; q <= 1; q += 2) { for (var m = 0; m < 3; m++) { var rx = x + q * (hw - s * 0.2 - m * s * 0.35) + Math.sin(t * 1.2 + m + q) * st.wind * s * 0.25; for (var d = 1; d < 13 * kf; d++) { var dy = ty + d * s * 0.62; if (dy > y - s * 1.5) { break; } ctx.moveTo(rx + s * 0.17, dy); ctx.arc(rx, dy, s * 0.17, 0, TAU); } } }
          ctx.fill();
        }
      }
      this.archTop = { x: x, y: y - hgt, hw: hw, s: s, k: kf };
    };
    Scene.prototype.drawMelatiBush = function (ctx, st) {
      var gh = st.gh, k = sm(10.9, 11.6, gh);
      if (k <= 0) { return; }
      var L = this.L, t = st.time, op = st.fl.melati;
      ctx.fillStyle = css(shade(st, C.bush, 0.04));
      ctx.beginPath();
      [-1, 1].forEach(function (d) { for (var i = 0; i < 4; i++) { var p = proj(L, d * (1.1 + i * 0.35), 0.405 + (i % 2) * 0.01), r = p.s * (1 + (i % 3) * 0.25) * k; ctx.moveTo(p.x + r, p.y - r * 0.5); ctx.arc(p.x, p.y - r * 0.5, r, 0, TAU); } });
      ctx.fill();
      var sz = 0.22 + op * 0.2;
      ctx.fillStyle = css(mix(shade(st, C.white, 0), [255, 255, 250], st.night * 0.35), 0.35 + op * 0.65);
      ctx.beginPath();
      for (var j = 0; j < this.melati.length; j++) {
        var m = this.melati[j], pp = proj(L, m.wx, m.z), fx = pp.x + (m.dx - 0.5) * pp.s * 2.2, fy = pp.y - pp.s * (0.3 + m.dy * 1.6) * k, fr = pp.s * sz;
        if (op > 0.3) { for (var a = 0; a < 5; a++) { var an = a * 1.2566 + m.p; ctx.moveTo(fx + Math.cos(an) * fr * 1.4 + fr * 0.6, fy + Math.sin(an) * fr * 1.4); ctx.arc(fx + Math.cos(an) * fr * 1.4, fy + Math.sin(an) * fr * 1.4, fr * 0.6, 0, TAU); } }
        else { ctx.moveTo(fx + fr, fy); ctx.arc(fx, fy, fr, 0, TAU); }
      }
      ctx.fill();
    };
    /* ---------- janur kuning ---------- */
    Scene.prototype.drawJanur = function (ctx, st) {
      var gh = st.gh, kp = sm(9.2, 9.7, gh);
      if (kp <= 0) { return; }
      var L = this.L, t = st.time, kc = sm(9.5, 9.9, gh), ko = sm(9.7, 10.3, gh);
      var self = this;
      [-1, 1].forEach(function (d) {
        var p = proj(L, d * 2.5, 0.9, {}), s = p.s, hgt = 13 * s * kp, x = p.x, y = p.y;
        var sway = Math.sin(t * 0.7 + d) * (0.5 + st.wind) * s * 0.5;
        var tipX = x - d * s * 5.2 * kc + sway, tipY = y - hgt + s * 3.4 * kc, cx = x + sway * 0.4, cy = y - hgt - s * 1.2 * kc;
        ctx.strokeStyle = css(shade(st, C.pole, 0.02)); ctx.lineCap = "round"; ctx.lineWidth = Math.max(1.2, s * 0.42);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sway * 0.2, y - hgt * 0.62); ctx.quadraticCurveTo(cx, cy, tipX, tipY); ctx.stroke();
        if (ko > 0) {
          ctx.strokeStyle = css(shade(st, C.janur, 0.02)); ctx.lineWidth = Math.max(1, s * 0.22);
          ctx.beginPath();
          for (var i = 0; i < 9; i++) {
            var f = 0.25 + i / 11, qx = (1 - f) * (1 - f) * (x + sway * 0.2) + 2 * (1 - f) * f * cx + f * f * tipX, qy = (1 - f) * (1 - f) * (y - hgt * 0.62) + 2 * (1 - f) * f * cy + f * f * tipY;
            var ln = s * (1.6 + (i % 3) * 0.8) * ko, sw2 = Math.sin(t * 1.6 + i + d) * (0.4 + st.wind) * s * 0.4;
            ctx.moveTo(qx, qy); ctx.quadraticCurveTo(qx + sw2, qy + ln * 0.5, qx + sw2 * 1.8, qy + ln);
            ctx.moveTo(qx + s * 0.25, qy); ctx.quadraticCurveTo(qx + sw2 + s * 0.3, qy + ln * 0.45, qx + sw2 * 1.5 + s * 0.4, qy + ln * 0.85);
          }
          ctx.stroke();
          ctx.fillStyle = css(shade(st, C.janur, 0.02)); ctx.beginPath(); ctx.ellipse(tipX, tipY + s * 0.8 * ko, s * 0.7 * ko, s * 1.2 * ko, 0, 0, TAU); ctx.fill();
          ctx.fillStyle = css(shade(st, C.janurD, 0.02)); ctx.beginPath(); ctx.ellipse(tipX, tipY + s * 0.8 * ko, s * 0.35 * ko, s * 0.8 * ko, 0, 0, TAU); ctx.fill();
          // pagar bambu kecil + telang
          var fk = 1;
          ctx.strokeStyle = css(shade(st, C.pole, 0.03)); ctx.lineWidth = Math.max(1, s * 0.2);
          ctx.beginPath();
          for (var f2 = 0; f2 < 4; f2++) { var fxp = x + d * s * (2.6 + f2 * 1.6); ctx.moveTo(fxp, y + s * 0.8); ctx.lineTo(fxp, y - s * 2.6 * fk); }
          ctx.moveTo(x + d * s * 2.2, y - s * 1.9); ctx.lineTo(x + d * s * 7.6, y - s * 1.7); ctx.stroke();
        }
        self.drawTelang(ctx, st, x, y, s, d);
      });
    };
    Scene.prototype.drawTelang = function (ctx, st, x, y, s, d) {
      var op = st.fl.telang, grow = sm(5, 6.2, st.gh);
      if (grow <= 0) { return; }
      ctx.strokeStyle = css(shade(st, C.leaf[1], 0.03)); ctx.lineWidth = Math.max(0.8, s * 0.12);
      ctx.beginPath(); ctx.moveTo(x + d * s * 2.3, y - s * 1.85);
      for (var i = 1; i <= 10; i++) { ctx.lineTo(x + d * s * (2.3 + i * 0.55 * grow), y - s * (1.85 + Math.sin(i * 1.3) * 0.5)); }
      ctx.stroke();
      for (var k = 0; k < this.telang.length; k++) {
        var tl = this.telang[k];
        if (tl.side !== d || tl.t > grow) { continue; }
        var fx = x + d * s * (2.5 + tl.t * 5), fy = y - s * (1.7 + tl.dy * 0.9), r = s * (0.18 + op * 0.3);
        ctx.fillStyle = css(shade(st, C.telang, 0.02)); ctx.beginPath(); ctx.ellipse(fx, fy, r, r * (0.8 + op * 0.2), tl.p, 0, TAU); ctx.fill();
        if (op > 0.3) { ctx.fillStyle = css(shade(st, C.cream, 0.02)); ctx.beginPath(); ctx.arc(fx, fy + r * 0.2, r * 0.3, 0, TAU); ctx.fill(); }
      }
    };
    /* ---------- meja & bunga ---------- */
    Scene.prototype.drawTable = function (ctx, st) {
      var k = sm(13.6, 14.3, st.gh);
      if (k <= 0) { return; }
      var L = this.L, a = proj(L, 7.2, 0.47, {}), b = proj(L, 11.8, 0.47, {}), s = a.s, h = s * 1.6, w = b.x - a.x, t = st.time;
      ctx.globalAlpha = k;
      ctx.fillStyle = css(shade(st, C.clothS, 0.03)); ctx.fillRect(a.x - s * 0.3, a.y - h, w + s * 0.6, h);
      ctx.fillStyle = css(shade(st, C.cloth, 0.03)); ctx.fillRect(a.x - s * 0.5, a.y - h - s * 0.5, w + s, s * 0.9);
      ctx.fillStyle = css(shade(st, C.chair, 0.03));
      for (var i = 0; i < 6; i++) { var cx = a.x + (i + 0.5) * w / 6; ctx.fillRect(cx - s * 0.4, a.y - h - s * 1.3, s * 0.8, s * 1.2); }
      var cols = [C.blos, C.white, hx("#f3c3a0")];
      for (var j = 0; j < 3; j++) { var vx = a.x + (j + 0.5) * w / 3; ctx.fillStyle = css(shade(st, C.leaf[1], 0.03)); ctx.beginPath(); ctx.arc(vx, a.y - h - s * 1.1, s * 0.55, 0, TAU); ctx.fill(); ctx.fillStyle = css(shade(st, cols[j], 0.03)); ctx.beginPath(); ctx.arc(vx - s * 0.25, a.y - h - s * 1.3, s * 0.3, 0, TAU); ctx.arc(vx + s * 0.28, a.y - h - s * 1.25, s * 0.26, 0, TAU); ctx.fill(); }
      ctx.globalAlpha = 1;
      this.candles = [];
      for (var c = 0; c < 4; c++) { this.candles.push({ x: a.x + (c + 0.75) * w / 4.5, y: a.y - h - s * 0.9, s: s }); }
    };
    Scene.prototype.drawSedap = function (ctx, st) {
      var gr = sm(14, 15.6, st.gh);
      if (gr <= 0) { return; }
      var L = this.L, op = st.fl.sedap, t = st.time;
      for (var i = 0; i < this.sedap.length; i++) {
        var sp = this.sedap[i], p = proj(L, sp.wx, sp.z), hgt = p.s * sp.h * 1.4 * gr, sw = Math.sin(t * 1.1 + sp.p) * (0.3 + st.wind) * p.s * 0.35;
        ctx.strokeStyle = css(shade(st, C.leaf[1], 0.04)); ctx.lineWidth = Math.max(0.8, p.s * 0.14);
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(p.x, p.y - hgt * 0.6, p.x + sw, p.y - hgt); ctx.stroke();
        ctx.fillStyle = css(mix(shade(st, C.white, 0), [255, 255, 245], st.night * 0.4), 0.4 + op * 0.6);
        ctx.beginPath();
        for (var k = 0; k < 5; k++) { var fy = p.y - hgt * (0.62 + k * 0.08), fx = p.x + sw * (0.62 + k * 0.08) + (k % 2 ? 1 : -1) * p.s * 0.3, r = p.s * (0.12 + op * 0.16); ctx.moveTo(fx + r, fy); ctx.arc(fx, fy, r, 0, TAU); }
        ctx.fill();
      }
    };
    Scene.prototype.drawSunflowers = function (ctx, st) {
      var gr = sm(7.2, 9.4, st.gh);
      if (gr <= 0) { return; }
      var L = this.L, op = st.fl.matahari, t = st.time, sun = st.sun;
      for (var i = 0; i < this.sunfl.length; i++) {
        var sf = this.sunfl[i], p = proj(L, sf.wx, sf.z, {}), hgt = p.s * sf.h * 1.6 * gr, sw = Math.sin(t * 0.9 + sf.p) * (0.3 + st.wind) * p.s * 0.3;
        var hx0 = p.x + sw, hy0 = p.y - hgt;
        ctx.strokeStyle = css(shade(st, C.leaf[1], 0.05)); ctx.lineWidth = Math.max(0.9, p.s * 0.2);
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(p.x, p.y - hgt * 0.5, hx0, hy0); ctx.stroke();
        ctx.fillStyle = css(shade(st, C.leaf[2], 0.05)); ctx.beginPath(); ctx.ellipse(p.x + p.s * 0.5, p.y - hgt * 0.45, p.s * 0.7, p.s * 0.3, -0.5, 0, TAU); ctx.ellipse(p.x - p.s * 0.5, p.y - hgt * 0.3, p.s * 0.7, p.s * 0.3, 0.5, 0, TAU); ctx.fill();
        var face = c01((sun.x - hx0) / (L.W * 0.5)) * 2 - 1, droop = 1 - op, r = p.s * 0.95 * (0.4 + 0.6 * gr);
        ctx.save(); ctx.translate(hx0, hy0); ctx.rotate(face * 0.35 + droop * 0.6); ctx.scale(0.55 + 0.45 * (1 - Math.abs(face) * 0.4), 1);
        if (op > 0.05) {
          ctx.fillStyle = css(shade(st, C.sun, 0.03));
          ctx.beginPath();
          for (var k = 0; k < 12; k++) { var a = k / 12 * TAU; ctx.moveTo(Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05); ctx.ellipse(Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05, r * 0.55 * op, r * 0.22, a, 0, TAU); }
          ctx.fill();
        }
        ctx.fillStyle = css(shade(st, C.sunC, 0.03)); ctx.beginPath(); ctx.arc(0, 0, r * (0.55 + 0.1 * op), 0, TAU); ctx.fill();
        ctx.restore();
      }
    };
    Scene.prototype.drawClump = function (ctx, st, c) {
      var gh = st.gh, gr = sm(7.4 + c.i * 0.35, 9.4 + c.i * 0.35, gh);
      if (gr <= 0) { return; }
      var L = this.L, p = proj(L, c.wx, c.z, {}), s = p.s, t = st.time, sw = Math.sin(t * 1.2 + c.i) * (0.3 + st.wind) * s * 0.25;
      var k = c.k === "teratai" ? "p9" : c.k, op = k === "p9" ? st.fl.p9 : k === "matahari" ? st.fl.matahari : k === "melati" ? st.fl.melati : k === "telang" ? st.fl.telang : st.fl.sedap;
      ctx.fillStyle = css(shade(st, C.bush, 0.03));
      ctx.beginPath();
      for (var b = 0; b < 4; b++) { var bx = p.x + (b - 1.5) * s * 0.95 * L.lat * 0.5, r0 = s * (0.9 + (b % 2) * 0.35) * gr; ctx.moveTo(bx + r0, p.y - r0 * 0.55); ctx.arc(bx, p.y - r0 * 0.55, r0, 0, TAU); }
      ctx.fill();
      ctx.fillStyle = css(shade(st, C.leaf[2], 0.03), 0.9);
      ctx.beginPath();
      for (var b2 = 0; b2 < 3; b2++) { var lx = p.x + (b2 - 1) * s * 1.1, ly = p.y - s * (1.3 + (b2 % 2) * 0.3) * gr; ctx.moveTo(lx + s * 0.5, ly); ctx.ellipse(lx, ly, s * 0.5, s * 0.22, -0.4 + b2 * 0.4, 0, TAU); }
      ctx.fill();
      var cols = k === "p9" ? C.port.slice(0, 3) : k === "matahari" ? [C.sun, C.sun, C.sunC] : k === "telang" ? [C.telang, C.telang, C.cream] : [C.white, C.white, hx("#f3ead2")];
      for (var ci = 0; ci < 3; ci++) {
        ctx.fillStyle = css(shade(st, cols[ci], 0.02), k === "melati" || k === "sedap" ? 0.45 + op * 0.55 : 1);
        ctx.beginPath();
        for (var j = 0; j < c.f.length; j++) {
          var f = c.f[j];
          if (f.c !== ci) { continue; }
          var fx = p.x + f.dx * s * L.lat * 0.5 + sw, fy = p.y - f.dy * s * gr, r = s * 0.2 * f.s * (0.45 + 0.55 * op);
          if (op > 0.4) { for (var a = 0; a < 5; a++) { var an = a * 1.2566 + f.p; ctx.moveTo(fx + Math.cos(an) * r + r * 0.65, fy + Math.sin(an) * r * 0.85); ctx.arc(fx + Math.cos(an) * r, fy + Math.sin(an) * r * 0.85, r * 0.65, 0, TAU); } }
          else { ctx.moveTo(fx + r, fy); ctx.arc(fx, fy, r, 0, TAU); }
        }
        ctx.fill();
      }
    };
    Scene.prototype.drawP4 = function (ctx, st) {
      var gr = sm(11.5, 13, st.gh);
      if (gr <= 0) { return; }
      var L = this.L, op = st.fl.p4;
      ctx.fillStyle = css(shade(st, C.bush, 0.03));
      ctx.beginPath();
      [-1, 1].forEach(function (d) { for (var i = 0; i < 5; i++) { var p = proj(L, d * (5.4 + i * 0.4), 0.8 + (i % 3) * 0.035), r = p.s * (1.3 + (i % 2) * 0.4) * gr; ctx.moveTo(p.x + r, p.y - r * 0.6); ctx.arc(p.x, p.y - r * 0.6, r, 0, TAU); } });
      ctx.fill();
      for (var c = 0; c < 3; c++) {
        ctx.fillStyle = css(shade(st, C.p4[c], 0.02));
        ctx.beginPath();
        for (var j = 0; j < this.p4.length; j++) {
          var f = this.p4[j];
          if (f.c !== c) { continue; }
          var pp = proj(L, f.wx, f.z), fx = pp.x, fy = pp.y - pp.s * (0.8 + f.dy * 1.5) * gr, r = pp.s * (0.12 + op * 0.3);
          ctx.moveTo(fx + r, fy); ctx.arc(fx, fy, r, 0, TAU);
        }
        ctx.fill();
      }
    };
    Scene.prototype.drawWijaya = function (ctx, st) {
      var gr = sm(15, 17, st.gh);
      if (gr <= 0) { return; }
      var L = this.L, p = proj(L, -4.6, 1.0, {}), s = p.s, t = st.time, bud = sm(19, 20.8, st.gh), op = st.fl.wijaya * bud;
      var sw = Math.sin(t * 0.6) * (0.3 + st.wind * 0.6) * s * 0.3;
      ctx.fillStyle = css(shade(st, hx("#3f7d3a"), 0.02));
      ctx.beginPath();
      [[-0.5, -1], [0.4, -0.7], [-0.1, -1.3], [0.9, -0.9], [-1, -0.5]].forEach(function (lv, i) {
        var bx = p.x + lv[0] * s * 1.2, by = p.y, ex = bx + lv[0] * s * 4 * gr + sw * (i % 2 ? 1 : -1), ey = by + lv[1] * s * 4.5 * gr;
        ctx.moveTo(bx, by); ctx.quadraticCurveTo((bx + ex) / 2 - s * 0.9, (by + ey) / 2, ex, ey); ctx.quadraticCurveTo((bx + ex) / 2 + s * 0.9, (by + ey) / 2, bx + s * 0.3, by);
      });
      ctx.fill();
      if (bud <= 0) { return; }
      var tx = p.x + s * 1.6 + sw, ty = p.y - s * 5.2 * gr, fx = tx + s * 1.5 * bud, fy = ty - s * 1.4 * bud;
      ctx.strokeStyle = css(shade(st, hx("#b9786a"), 0.02)); ctx.lineWidth = Math.max(1, s * 0.22);
      ctx.beginPath(); ctx.moveTo(p.x + s * 0.4, p.y - s * 3); ctx.quadraticCurveTo(tx, ty + s * 1.5, fx, fy); ctx.stroke();
      var R = s * (0.5 + 1.9 * op) * (0.6 + 0.4 * bud);
      if (op < 0.1) {
        ctx.fillStyle = css(shade(st, hx("#e7c8b8"), 0.02)); ctx.beginPath(); ctx.ellipse(fx, fy, s * 0.45 * bud + s * 0.2, s * 1.1 * bud + s * 0.3, -0.7, 0, TAU); ctx.fill();
      } else {
        ctx.save(); ctx.translate(fx, fy); ctx.rotate(-0.35);
        ctx.fillStyle = css(shade(st, hx("#d9a08a"), 0), 0.9);
        ctx.beginPath();
        for (var i = 0; i < 12; i++) { var a = i / 12 * TAU + 0.13; ctx.moveTo(0, 0); ctx.ellipse(Math.cos(a) * R * 0.62, Math.sin(a) * R * 0.62, R * 0.62, R * 0.07, a, 0, TAU); }
        ctx.fill();
        ctx.fillStyle = css(mix(C.white, [255, 255, 255], st.night * 0.5), 0.97);
        ctx.beginPath();
        for (var k = 0; k < 14; k++) { var a2 = k / 14 * TAU, rr = R * (0.72 + (k % 2) * 0.12); ctx.moveTo(0, 0); ctx.ellipse(Math.cos(a2) * rr * 0.5, Math.sin(a2) * rr * 0.5, rr * 0.5, rr * 0.17, a2, 0, TAU); }
        ctx.fill();
        ctx.fillStyle = "rgba(255,250,210,0.9)"; ctx.beginPath(); ctx.arc(0, 0, R * 0.16, 0, TAU); ctx.fill();
        ctx.restore();
      }
      this.wijayaAt = { x: fx, y: fy, r: R, op: op };
    };
    /* ---------- kursi & orang ---------- */
    function drawChair(ctx, st, x, y, s, k) {
      var w = s * 1.05, bh = s * 1.55, lift = (1 - k) * s * 0.8;
      ctx.globalAlpha = k;
      ctx.strokeStyle = css(shade(st, C.chairD, 0.03)); ctx.lineWidth = Math.max(0.7, s * 0.14);
      ctx.beginPath(); ctx.moveTo(x - w * 0.42, y - lift); ctx.lineTo(x - w * 0.42, y - s * 1 - lift); ctx.moveTo(x + w * 0.42, y - lift); ctx.lineTo(x + w * 0.42, y - s * 1 - lift); ctx.stroke();
      ctx.fillStyle = css(shade(st, C.chair, 0.03));
      ctx.fillRect(x - w / 2, y - s * 1.05 - bh - lift, w, bh);
      ctx.fillStyle = css(shade(st, C.chairD, 0.03));
      ctx.fillRect(x - w * 0.3, y - s * 1.05 - bh * 0.75 - lift, w * 0.14, bh * 0.6); ctx.fillRect(x + w * 0.16, y - s * 1.05 - bh * 0.75 - lift, w * 0.14, bh * 0.6);
      ctx.globalAlpha = 1;
    }
    function drawPerson(ctx, st, x, y, s, o) {
      var warm = st.lights * 0.35, lc = function (c) { var v = shade(st, c, 0.02); return warm ? mix(v, mul(c, [255, 200, 150]), warm) : v; };
      var headY = y - s * 3.62, hr = s * 0.42, step = o.walk != null ? Math.sin(o.walk) : 0, bob = o.walk != null ? Math.abs(Math.cos(o.walk)) * s * 0.12 : 0;
      y -= bob; headY -= bob;
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      if (o.kind === 1) {
        // pengantin wanita: gaun & kerudung panjang
        ctx.fillStyle = css(lc(hx("#f3eee4")), 0.55);
        ctx.beginPath(); ctx.moveTo(x - s * 0.35, headY - hr * 0.4); ctx.quadraticCurveTo(x - s * 1.5, y - s * 1.8, x - s * 1.3 + step * s * 0.1, y - s * 0.3); ctx.lineTo(x + s * 1.1, y - s * 0.3); ctx.quadraticCurveTo(x + s * 1.2, y - s * 2, x + s * 0.35, headY - hr * 0.4); ctx.fill();
        ctx.fillStyle = css(lc(hx("#fbf8f1")));
        ctx.beginPath(); ctx.moveTo(x - s * 0.5, y - s * 3.05); ctx.lineTo(x + s * 0.5, y - s * 3.05); ctx.lineTo(x + s * 0.42, y - s * 2.1); ctx.quadraticCurveTo(x + s * 1.25, y - s * 0.6, x + s * 1.2 + step * s * 0.08, y); ctx.lineTo(x - s * 1.2 + step * s * 0.08, y); ctx.quadraticCurveTo(x - s * 1.25, y - s * 0.6, x - s * 0.42, y - s * 2.1); ctx.fill();
        ctx.beginPath(); ctx.arc(x, headY, hr * 1.12, 0, TAU); ctx.fill();
        ctx.fillStyle = css(lc(hx("#e6dccb"))); ctx.beginPath(); ctx.arc(x, headY + hr * 0.1, hr * 0.62, 0, TAU); ctx.fill();
        ctx.fillStyle = css(lc(C.blos)); ctx.beginPath(); ctx.arc(x + s * 0.45 * (o.face || 1), y - s * 2.35, s * 0.3, 0, TAU); ctx.fill();
      } else if (o.kind === 2) {
        // pengantin pria: jas gelap & peci
        ctx.strokeStyle = css(lc(hx("#2a2c3c"))); ctx.lineWidth = s * 0.34; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x - s * 0.2, y - s * 1.7); ctx.lineTo(x - s * 0.22 + step * s * 0.25, y); ctx.moveTo(x + s * 0.2, y - s * 1.7); ctx.lineTo(x + s * 0.22 - step * s * 0.25, y); ctx.stroke();
        ctx.fillStyle = css(lc(hx("#e9e1cf"))); ctx.fillRect(x - s * 0.52, y - s * 3.1, s * 1.04, s * 1.5);
        ctx.fillStyle = css(lc(hx("#1f2740")));
        ctx.beginPath(); ctx.moveTo(x - s * 0.55, y - s * 3.1); ctx.lineTo(x - s * 0.08, y - s * 3.1); ctx.lineTo(x, y - s * 2.3); ctx.lineTo(x + s * 0.08, y - s * 3.1); ctx.lineTo(x + s * 0.55, y - s * 3.1); ctx.lineTo(x + s * 0.6, y - s * 1.5); ctx.lineTo(x - s * 0.6, y - s * 1.5); ctx.fill();
        ctx.fillStyle = css(lc(SKIN[1])); ctx.beginPath(); ctx.arc(x, headY, hr, 0, TAU); ctx.fill();
        ctx.fillStyle = css(lc(hx("#15161e"))); ctx.fillRect(x - hr * 0.95, headY - hr * 1.35, hr * 1.9, hr * 0.85);
      } else {
        var col = lc(o.col);
        if (o.hij) {
          ctx.fillStyle = css(col);
          ctx.beginPath(); ctx.moveTo(x - s * 0.5, y - s * 3.1); ctx.lineTo(x + s * 0.5, y - s * 3.1); ctx.lineTo(x + s * 0.7, y); ctx.lineTo(x - s * 0.7, y); ctx.fill();
          ctx.fillStyle = css(mix(col, [255, 255, 255], 0.25)); ctx.beginPath(); ctx.arc(x, headY, hr * 1.1, 0, TAU); ctx.fill();
          ctx.beginPath(); ctx.moveTo(x - hr * 1.1, headY); ctx.quadraticCurveTo(x - s * 0.8, y - s * 2.6, x - s * 0.5, y - s * 2.3); ctx.lineTo(x + s * 0.5, y - s * 2.3); ctx.quadraticCurveTo(x + s * 0.8, y - s * 2.6, x + hr * 1.1, headY); ctx.fill();
        } else {
          ctx.strokeStyle = css(lc(hx("#30303a"))); ctx.lineWidth = s * 0.32; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(x - s * 0.2, y - s * 1.7); ctx.lineTo(x - s * 0.22 + step * s * 0.25, y); ctx.moveTo(x + s * 0.2, y - s * 1.7); ctx.lineTo(x + s * 0.22 - step * s * 0.25, y); ctx.stroke();
          ctx.fillStyle = css(col); ctx.beginPath(); ctx.moveTo(x - s * 0.52, y - s * 3.1); ctx.lineTo(x + s * 0.52, y - s * 3.1); ctx.lineTo(x + s * 0.5, y - s * 1.6); ctx.lineTo(x - s * 0.5, y - s * 1.6); ctx.fill();
          ctx.fillStyle = css(lc(o.skin)); ctx.beginPath(); ctx.arc(x, headY, hr, 0, TAU); ctx.fill();
          ctx.fillStyle = css(lc(hx("#1e1a18"))); ctx.beginPath(); ctx.arc(x, headY - hr * 0.2, hr * 0.95, PI, TAU); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    Scene.prototype.drawRow = function (ctx, st, row) {
      var L = this.L, gh = st.gh;
      for (var i = 0; i < this.chairs.length; i++) {
        var ch = this.chairs[i];
        if (ch.row !== row) { continue; }
        var a = 11.8 + row * 0.26 + ch.c * 0.05, k = sm(a, a + 0.14, gh);
        if (k <= 0) { continue; }
        var p = proj(L, ch.wx, ch.z);
        var sg = this.seatOf(ch);
        if (sg && gh >= sg.a + 0.45) { drawPerson(ctx, st, p.x, p.y - p.s * 0.55, p.s * 0.92, { col: sg.col, skin: sg.skin, hij: sg.hij }); }
        drawChair(ctx, st, p.x, p.y, p.s, k);
      }
    };
    Scene.prototype.seatOf = function (ch) { for (var i = 0; i < this.seat.length; i++) { if (this.seat[i].ch === ch) { return this.seat[i]; } } return null; };
    Scene.prototype.walkers = function (st, items) {
      var L = this.L, gh = st.gh, t = st.time, self = this;
      this.seat.forEach(function (sg) {
        var k = (gh - sg.a) / 0.45;
        if (k <= 0 || k >= 1) { return; }
        var k1 = c01(k / 0.78), k2 = c01((k - 0.78) / 0.22), z = lerp(1.1, sg.ch.z + 0.015, k1), wx = lerp(pathX(z) + (sg.ch.side * 0.25), sg.ch.wx, k2);
        items.push({ z: z, fn: function () { var p = proj(L, wx, z); drawPerson(ctx(), st, p.x, p.y, p.s, { col: sg.col, skin: sg.skin, hij: sg.hij, walk: t * 7 + sg.ph }); } });
      });
      var ck = (gh - 16.95) / 0.8;
      if (ck > 0) {
        var z, bx, gx, walk = null, face = 1;
        if (ck < 1) { var e = ck * ck * (3 - 2 * ck); z = lerp(1.08, 0.43, e); bx = pathX(z) - 0.32; gx = pathX(z) + 0.32; walk = t * 5.5; }
        else { z = 0.425; var dance = sm(19, 19.6, st.h) * Math.sin(t * 0.9) * 0.12; bx = -0.52 + dance; gx = 0.52 + dance; }
        items.push({ z: z, fn: function () { var c = ctx(), pb = proj(L, bx, z, {}), pg = proj(L, gx, z, {}); drawPerson(c, st, pb.x, pb.y, pb.s * 1.05, { kind: 1, walk: walk, face: face }); drawPerson(c, st, pg.x, pg.y, pg.s * 1.05, { kind: 2, walk: walk == null ? null : walk + PI }); } });
      }
      this.guests.forEach(function (g, gi) {
        if (g.status === "not") { return; }
        var n = g.status === "maybe" ? 1 : Math.min(4, Math.max(1, g.n || 1)), k = c01((t - g.t0) / 7);
        for (var i = 0; i < n; i++) {
          (function (i) {
            var tz = g.status === "maybe" ? 0.97 : 0.545 + (i % 2) * 0.035, twx = g.status === "maybe" ? 3.6 : 7.6 + i * 0.95;
            var z = g.status === "maybe" ? tz : lerp(1.12, tz, sm(0, 0.75, k)), wx = g.status === "maybe" ? twx : lerp(pathX(z) + (i - 1) * 0.3, twx, sm(0.35, 1, k));
            items.push({ z: z, fn: function () { var c = ctx(), p = proj(L, wx, z, {}); if (i === 0) { self.meAt = { x: p.x, y: p.y - p.s * 4.6, s: p.s, name: g.name, maybe: g.status === "maybe" }; } drawPerson(c, st, p.x, p.y, p.s * 1.02, { col: CLOTHES[(gi * 3 + i + 2) % CLOTHES.length], skin: SKIN[(i + gi) % SKIN.length], hij: (i + gi) % 2 === 1, walk: k < 1 ? t * 6 + i : null }); } });
          })(i);
        }
      });
      var cur = this.ctx;
      function ctx() { return cur; }
    };
    /* ---------- rumput ---------- */
    Scene.prototype.drawBand = function (ctx, st, arr) {
      if (!arr.length) { return; }
      var L = this.L, t = st.time, gh = st.gh, grow = 0.34 + 0.66 * sm(5.8, 10, gh), wind = st.wind;
      var cols = C.grass.map(function (c) { var v = mix(mix(C.bare, c, 0.35 + 0.65 * sm(5.8, 9.5, gh)), [168, 170, 78], sm(15, 17.2, gh) * 0.22); return v; });
      var P = [new Path2D(), new Path2D(), new Path2D()], F = null, PT = null, zsum = 0, n = 0;
      var fl = sm(8, 10.2, gh), p9 = st.fl.p9, psp = sm(8.4, 9, gh);
      for (var i = 0; i < arr.length; i++) {
        var b = arr[i], p = proj(L, b.wx, b.z);
        zsum += b.z; n++;
        if (b.port) {
          if (psp <= 0) { continue; }
          PT = PT || [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
          var r = p.s * (0.12 + 0.24 * p9) * psp, px = p.x, py = p.y - p.s * 0.35 * psp;
          if (p9 > 0.25) { for (var a = 0; a < 5; a++) { var an = a * 1.2566 + b.p; PT[b.c].moveTo(px + Math.cos(an) * r + r * 0.62, py + Math.sin(an) * r * 0.7); PT[b.c].arc(px + Math.cos(an) * r, py + Math.sin(an) * r * 0.7, r * 0.62, 0, TAU); } }
          else { PT[b.c].moveTo(px + r, py); PT[b.c].arc(px, py, r, 0, TAU); }
          continue;
        }
        var hh = b.h * p.s * 1.3 * grow;
        if (hh < 0.7) { continue; }
        var sw = (wind * 0.5 + 0.12) * Math.sin(t * 1.7 + b.p + b.wx * 0.35) + wind * 0.35, w = Math.max(0.6, p.s * 0.13);
        var tx = p.x + (b.lean + sw) * hh * 0.55, ty = p.y - hh * (1 - Math.abs(b.lean + sw) * 0.12), qx = p.x + (tx - p.x) * 0.25;
        var q = P[b.sh];
        q.moveTo(p.x - w, p.y); q.quadraticCurveTo(qx - w * 0.3, p.y - hh * 0.55, tx, ty); q.quadraticCurveTo(qx + w * 0.4, p.y - hh * 0.5, p.x + w, p.y);
        if (b.f) {
          var fo = b.f === 5 ? st.fl.telang : b.f === 4 ? st.fl.p4 : fl;
          if (fo > 0.02) {
            F = F || [new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D()];
            var fr = p.s * (b.z > 0.7 ? 0.2 : 0.17) * (0.45 + 0.55 * fo), q2 = F[b.f - 1];
            if (b.z > 0.62 && fo > 0.5) { for (var pa = 0; pa < 5; pa++) { var an2 = pa * 1.2566 + b.p; q2.moveTo(tx + Math.cos(an2) * fr + fr * 0.62, ty + Math.sin(an2) * fr * 0.8); q2.arc(tx + Math.cos(an2) * fr, ty + Math.sin(an2) * fr * 0.8, fr * 0.62, 0, TAU); } F[5].moveTo(tx + fr * 0.4, ty); F[5].arc(tx, ty, fr * 0.4, 0, TAU); }
            else { q2.moveTo(tx + fr, ty); q2.arc(tx, ty, fr, 0, TAU); }
          }
        }
      }
      var zm = n ? zsum / n : 0.5, hz = c01((0.4 - zm) * 0.4);
      for (var k = 0; k < 3; k++) { ctx.fillStyle = css(shade(st, cols[k], hz)); ctx.fill(P[k]); }
      if (F) { var fc = [[255, 252, 240], [250, 214, 90], [200, 170, 235], [226, 70, 150], [70, 100, 220], [255, 222, 120]]; for (var j = 0; j < 6; j++) { ctx.fillStyle = css(shade(st, fc[j], hz)); ctx.fill(F[j]); } }
      if (PT) { for (var m = 0; m < 4; m++) { ctx.fillStyle = css(shade(st, C.port[m], 0.02)); ctx.fill(PT[m]); } }
    };
    Scene.prototype.drawFG = function (ctx, st) {
      var L = this.L, t = st.time, grow = 0.35 + 0.65 * sm(5.8, 10, st.gh), P = new Path2D(), F = new Path2D();
      for (var i = 0; i < this.fg.length; i++) {
        var b = this.fg[i], p = proj(L, b.wx, b.z), hh = b.h * p.s * grow, sw = (st.wind * 0.6 + 0.15) * Math.sin(t * 1.3 + b.p) + st.wind * 0.3, w = p.s * 0.16;
        var tx = p.x + (b.lean + sw) * hh * 0.5, ty = p.y - hh, qx = p.x + (tx - p.x) * 0.25;
        P.moveTo(p.x - w, p.y); P.quadraticCurveTo(qx, p.y - hh * 0.55, tx, ty); P.quadraticCurveTo(qx + w, p.y - hh * 0.5, p.x + w, p.y);
        if (b.f && st.gh > 8) { F.moveTo(tx + p.s * 0.28, ty); F.arc(tx, ty, p.s * 0.28, 0, TAU); }
      }
      ctx.fillStyle = css(shade(st, mix(C.groundD, [20, 40, 20], 0.35), 0)); ctx.fill(P);
      ctx.fillStyle = css(shade(st, [250, 246, 230], 0), 0.9); ctx.fill(F);
    };
    /* ---------- partikel & efek ---------- */
    Scene.prototype.addPart = function (o) { if (this.parts.length < 260) { this.parts.push(o); } };
    Scene.prototype.burst = function (x, y, night) {
      var cols = [C.blos, C.port[0], C.port[2], C.white, C.lotus, C.telang, C.p4[1]];
      for (var i = 0; i < (night ? 14 : 18); i++) {
        var a = Math.random() * TAU, v = 30 + Math.random() * 90;
        this.addPart({ k: night ? 2 : 1, x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, r: Math.random() * 6, vr: (Math.random() - 0.5) * 8, life: 0, max: 2.2 + Math.random() * 1.6, c: cols[i % cols.length], sz: 0.5 + Math.random() * 0.6, p: Math.random() * TAU });
      }
      this.gust = Math.min(1.5, this.gust + 0.8);
    };
    Scene.prototype.launch = function (n) {
      var L = this.L;
      for (var i = 0; i < (n || 1); i++) { this.rockets.push({ x0: L.cx + (Math.random() - 0.5) * Math.min(L.W, 60 * L.u) * 0.8, y0: L.yMea + L.u * 3, x1: L.cx + (Math.random() - 0.5) * Math.min(L.W, 80 * L.u) * 0.85, y1: L.yHor * (0.42 + Math.random() * 0.4), t0: this.now + i * 0.42 + Math.random() * 0.2, d: 1 + Math.random() * 0.35, c: Math.floor(Math.random() * 5) }); }
    };
    var FW = [["#ffd36e", "#fff3c4"], ["#ff8fb1", "#ffe0ea"], ["#8fe3ff", "#e6f9ff"], ["#c9a2ff", "#f1e6ff"], ["#9dffb0", "#eafff0"]].map(function (a) { return a.map(hx); });
    Scene.prototype.drawFireworks = function (ctx, st) {
      if (!this.rockets.length && !this.sparks.length) { return; }
      var now = this.now, dt = st.dt;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      for (var i = this.rockets.length - 1; i >= 0; i--) {
        var r = this.rockets[i], k = (now - r.t0) / r.d;
        if (k < 0) { continue; }
        if (k >= 1) {
          var pal = FW[r.c];
          for (var j = 0; j < 80; j++) { var a = j / 80 * TAU + Math.random() * 0.1, v = (70 + Math.random() * 70) * (this.L.u / 8); this.sparks.push({ x: r.x1, y: r.y1, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 1.7 + Math.random() * 0.9, c: pal[j % 2] }); }
          this.rockets.splice(i, 1); if (this.onPop) { this.onPop(); } continue;
        }
        var e = 1 - (1 - k) * (1 - k), x = lerp(r.x0, r.x1, e), y = lerp(r.y0, r.y1, e);
        ctx.fillStyle = "rgba(255,230,180,0.9)"; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill();
        ctx.strokeStyle = "rgba(255,210,150,0.35)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(r.x0, r.x1, Math.max(0, e - 0.12)), lerp(r.y0, r.y1, Math.max(0, e - 0.12))); ctx.stroke();
      }
      for (var s = this.sparks.length - 1; s >= 0; s--) {
        var sp = this.sparks[s];
        sp.life += dt; if (sp.life > sp.max) { this.sparks.splice(s, 1); continue; }
        sp.vx *= 0.982; sp.vy = sp.vy * 0.982 + 34 * dt * (this.L.u / 8); var ox = sp.x, oy = sp.y; sp.x += sp.vx * dt; sp.y += sp.vy * dt;
        var al = 1 - sp.life / sp.max, g = glowSprite(sp.c), sz = (9 * al + 3) * (this.L.u / 8);
        ctx.globalAlpha = al * 0.8; ctx.strokeStyle = css(sp.c, 0.9); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ox - sp.vx * 0.06, oy - sp.vy * 0.06); ctx.lineTo(sp.x, sp.y); ctx.stroke();
        ctx.globalAlpha = al; ctx.drawImage(g, sp.x - sz, sp.y - sz, sz * 2, sz * 2);
      }
      ctx.restore(); ctx.globalAlpha = 1;
    };
    Scene.prototype.wave = function (col) {
      var c = hx(col), L = this.L;
      this.waves.push({ c: c, t0: this.now }); if (this.waves.length > 3) { this.waves.shift(); }
      for (var i = 0; i < 46; i++) { this.addPart({ k: 1, x: Math.random() * L.W, y: -20 - Math.random() * L.H * 0.5, vx: 10 + Math.random() * 20, vy: 30 + Math.random() * 40, r: Math.random() * 6, vr: (Math.random() - 0.5) * 5, life: 0, max: 9, c: i % 3 ? c : mix(c, [255, 255, 255], 0.45), sz: 0.55 + Math.random() * 0.45, p: Math.random() * TAU }); }
    };
    Scene.prototype.drawWaves = function (ctx, st) {
      if (!this.waves.length) { return; }
      var L = this.L, now = this.now;
      for (var w = this.waves.length - 1; w >= 0; w--) {
        var wv = this.waves[w], age = now - wv.t0;
        if (age > 8) { this.waves.splice(w, 1); continue; }
        var r = rnd(777 + w), light = mix(wv.c, [255, 255, 255], 0.35), P1 = new Path2D(), P2 = new Path2D(), P3 = new Path2D();
        for (var i = 0; i < 90; i++) {
          var z = 0.45 + r() * 0.62, rg = wxRange(L, z), wx = lerp(rg[0], rg[1], r()), p = proj(L, wx, z), d = (p.x / L.W) * 1.3 + r() * 0.3, k = sm(d, d + 0.45, age) * (1 - sm(6.2, 7.6, age));
          if (k <= 0) { continue; }
          var rr = p.s * 0.34 * k, y = p.y - p.s * 0.6 * k, tgt = i % 3 ? P1 : P2;
          for (var a = 0; a < 5; a++) { var an = a * 1.2566 + i; tgt.moveTo(p.x + Math.cos(an) * rr + rr * 0.6, y + Math.sin(an) * rr * 0.75); tgt.arc(p.x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.75, rr * 0.6, 0, TAU); }
          P3.moveTo(p.x + rr * 0.35, y); P3.arc(p.x, y, rr * 0.35, 0, TAU);
        }
        ctx.fillStyle = css(shade(st, wv.c, 0)); ctx.fill(P1);
        ctx.fillStyle = css(shade(st, light, 0)); ctx.fill(P2);
        ctx.fillStyle = css(shade(st, [255, 240, 190], 0)); ctx.fill(P3);
      }
    };
    Scene.prototype.drawParts = function (ctx, st) {
      var dt = st.dt, L = this.L, wind = st.wind;
      // kelopak dari trembesi
      var ta = this.treeAnchor, bloom = sm(12.8, 14, st.gh);
      if (ta && bloom > 0 && !this.opt.thumb && Math.random() < dt * 2.2 * bloom) {
        this.addPart({ k: 1, x: ta.x + (Math.random() - 0.5) * ta.H * 1.1, y: ta.y - ta.H * (0.55 + Math.random() * 0.35), vx: 10 + wind * 20, vy: 10, r: Math.random() * 6, vr: (Math.random() - 0.5) * 4, life: 0, max: 7, c: C.blos, sz: 0.45 + Math.random() * 0.3, p: Math.random() * TAU });
      }
      if (this.fx.wind > 0.3 && Math.random() < dt * 3 * this.fx.wind) {
        this.addPart({ k: 3, x: -10, y: L.yMea + Math.random() * (L.H - L.yMea) * 0.8, vx: 120 + Math.random() * 80, vy: -20, r: Math.random() * 6, vr: (Math.random() - 0.5) * 9, life: 0, max: 6, c: C.leaf[2], sz: 0.6 + Math.random() * 0.4, p: Math.random() * TAU });
      }
      for (var i = this.parts.length - 1; i >= 0; i--) {
        var p = this.parts[i];
        p.life += dt;
        if (p.life > p.max || p.y > L.H + 30 || p.x > L.W + 60) { this.parts.splice(i, 1); continue; }
        var al = Math.min(1, (p.max - p.life) * 1.5, p.life * 6);
        if (p.k === 2) {
          p.vx = p.vx * 0.96 + Math.sin(this.now * 3 + p.p) * 12; p.vy = p.vy * 0.96 + Math.cos(this.now * 2.6 + p.p) * 10 - 4;
          p.x += p.vx * dt; p.y += p.vy * dt;
          var bl = 0.5 + 0.5 * Math.sin(this.now * 7 + p.p), gs = glowSprite([220, 255, 150]), sz = L.u * 1.6;
          ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = al * bl; ctx.drawImage(gs, p.x - sz, p.y - sz, sz * 2, sz * 2); ctx.restore();
          continue;
        }
        p.vx += (wind * 26 + Math.sin(this.now * 1.7 + p.p) * 14 - p.vx) * dt * 0.8; p.vy += (26 - p.vy) * dt * 0.9;
        p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        var s = L.u * p.sz;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.sin(this.now * 3 + p.p)));
        ctx.globalAlpha = al; ctx.fillStyle = css(shade(st, p.c, 0)); ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.55, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };
    Scene.prototype.drawAmbientLife = function (ctx, st) {
      if (this.opt.thumb) { return; }
      var L = this.L, t = this.now, h = st.h, u = L.u, i;
      // debu cahaya
      var mote = (sm(6.6, 7.4, h) * (1 - sm(10.5, 11.5, h)) + sm(15.8, 16.6, h) * (1 - sm(17.6, 18.1, h))) * (1 - this.fx.rain);
      if (mote > 0.02) {
        ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = "rgba(255,236,190," + (0.5 * mote).toFixed(3) + ")";
        ctx.beginPath();
        for (i = 0; i < 46; i++) { var mx = ((i * 0.618 + Math.sin(t * 0.07 + i) * 0.04 + t * 0.004 * (i % 3 + 1)) % 1) * L.W, my = L.yHor * 0.6 + ((i * 0.377 + Math.sin(t * 0.11 + i * 2) * 0.05) % 1) * (L.H - L.yHor * 0.6), mr = 0.6 + (i % 4) * 0.35; ctx.moveTo(mx + mr, my); ctx.arc(mx, my, mr, 0, TAU); }
        ctx.fill(); ctx.restore();
      }
      // kupu-kupu
      var bf = sm(7.9, 8.8, h) * (1 - sm(16.2, 17, h)) * (1 - this.fx.rain);
      if (bf > 0.02) {
        var homes = [[-7.4, 0.45], [2.8, 0.78], [-2.4, 0.84], [6.5, 0.6], [-5.6, 0.95], [1.2, 0.5]], cols = [hx("#ffd84a"), hx("#fffaf0"), hx("#ff9a3c"), hx("#7fb8ff"), hx("#ffd84a"), hx("#f4a6c1")];
        for (i = 0; i < homes.length; i++) {
          var hp = proj(L, homes[i][0], homes[i][1], {}), bx = hp.x + Math.sin(t * 0.55 + i * 2) * hp.s * 4 + Math.sin(t * 1.3 + i) * hp.s * 1.2, by = hp.y - hp.s * (3.5 + Math.sin(t * 0.8 + i * 3) * 1.6), fl = Math.abs(Math.sin(t * 13 + i * 5)), ws = hp.s * 0.7;
          ctx.globalAlpha = bf; ctx.fillStyle = css(shade(st, cols[i], 0));
          ctx.beginPath(); ctx.ellipse(bx - ws * 0.55 * fl, by, ws * 0.6 * fl + 0.4, ws * 0.8, -0.4, 0, TAU); ctx.ellipse(bx + ws * 0.55 * fl, by, ws * 0.6 * fl + 0.4, ws * 0.8, 0.4, 0, TAU); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      // capung dekat telaga
      var df = sm(9.8, 10.6, h) * (1 - sm(15.2, 16, h)) * (1 - this.fx.rain);
      if (df > 0.02) {
        ctx.strokeStyle = css(shade(st, hx("#c8402f"), 0), df); ctx.lineWidth = Math.max(1, u * 0.14);
        for (i = 0; i < 3; i++) {
          var seg = Math.floor(t / 1.7 + i), fr = (t / 1.7 + i) % 1, e = fr < 0.3 ? sm(0, 0.3, fr) : 1;
          var ax = L.cx - (18 + (hash1(seg * 7 + i) * 6)) * u, ay = L.yMea - (1 + Math.abs(hash1(seg * 3 + i)) * 3) * u, bx2 = L.cx - (18 + (hash1((seg + 1) * 7 + i) * 6)) * u, by2 = L.yMea - (1 + Math.abs(hash1((seg + 1) * 3 + i)) * 3) * u;
          var dx = lerp(ax, bx2, e), dy = lerp(ay, by2, e);
          ctx.beginPath(); ctx.moveTo(dx - u * 0.7, dy); ctx.lineTo(dx + u * 0.5, dy); ctx.stroke();
          ctx.fillStyle = "rgba(230,240,255," + (0.5 * df).toFixed(3) + ")"; ctx.beginPath(); ctx.ellipse(dx, dy - u * 0.25, u * 0.45, u * 0.14, -0.3, 0, TAU); ctx.ellipse(dx, dy + u * 0.25, u * 0.45, u * 0.14, 0.3, 0, TAU); ctx.fill();
        }
      }
      // burung
      var morning = sm(5.9, 6.3, h) * (1 - sm(8, 8.5, h)), evening = sm(16.9, 17.3, h) * (1 - sm(18.6, 19, h)), want = Math.max(morning, evening, this.fx.birds);
      if (want > 0.1 && t - this.lastFlock > (this.fx.birds > 0.5 ? 3.2 : 7.5)) {
        this.lastFlock = t; var dir = evening > morning ? 1 : -1, n = 5 + Math.floor(Math.random() * 5), fy = L.yHor * (0.15 + Math.random() * 0.45);
        this.flocks.push({ t0: t, dir: dir, y: fy, n: n, v: L.W * (0.05 + Math.random() * 0.03), sc: 0.7 + Math.random() * 0.5 });
      }
      ctx.strokeStyle = css(mix(st.top, [20, 24, 36], 0.7), 0.8 * (1 - sm(19, 19.8, h) * 0.9)); ctx.lineWidth = Math.max(1, u * 0.14); ctx.lineCap = "round";
      ctx.beginPath();
      for (i = this.flocks.length - 1; i >= 0; i--) {
        var f = this.flocks[i], age = t - f.t0, x0 = f.dir > 0 ? -40 + age * f.v : L.W + 40 - age * f.v;
        if (age * f.v > L.W + 200) { this.flocks.splice(i, 1); continue; }
        for (var b = 0; b < f.n; b++) {
          var row = Math.ceil(b / 2), side = b % 2 ? 1 : -1, bx3 = x0 - f.dir * row * u * 2.2, by3 = f.y + side * row * u * 1.1 + Math.sin(t * 1.4 + b) * u * 0.4, fl2 = Math.sin(t * 9 + b * 1.7), ws2 = u * 1.1 * f.sc;
          ctx.moveTo(bx3 - ws2, by3 - fl2 * ws2 * 0.5); ctx.quadraticCurveTo(bx3 - ws2 * 0.4, by3 - ws2 * 0.35, bx3, by3); ctx.quadraticCurveTo(bx3 + ws2 * 0.4, by3 - ws2 * 0.35, bx3 + ws2, by3 - fl2 * ws2 * 0.5);
        }
      }
      ctx.stroke();
      if (this.fx.birds > 0.2 && this.bulbs && this.bulbs.length > 6) {
        ctx.fillStyle = css(mix(st.top, [25, 28, 40], 0.75), this.fx.birds);
        for (i = 0; i < 6; i++) { var bb = this.bulbs[Math.floor((i + 0.5) / 6 * this.bulbs.length)], hop = Math.max(0, Math.sin(t * 2 + i * 1.7)) * u * 0.25; ctx.beginPath(); ctx.ellipse(bb.x, bb.y - u * 0.55 - hop, u * 0.42, u * 0.3, 0, 0, TAU); ctx.arc(bb.x + u * 0.3, bb.y - u * 0.85 - hop, u * 0.2, 0, TAU); ctx.fill(); }
      }
      // kodok & riak
      if (this.fx.frogs > 0.05) {
        var lx0 = L.cx - 18 * u + L.pan * 0.45, ly0 = L.yMea;
        ctx.fillStyle = css(shade(st, hx("#6aa84f"), 0), this.fx.frogs);
        for (i = 0; i < 3; i++) { var fx2 = lx0 + (i - 1) * 6 * u, fy2 = ly0 + (i % 2) * u * 0.8 - Math.max(0, Math.sin(t * 1.5 + i * 2)) * u * 0.6; ctx.beginPath(); ctx.ellipse(fx2, fy2, u * 0.45, u * 0.3, 0, 0, TAU); ctx.fill(); }
      }
      if (this.fx.frogs > 0.05 || this.fx.rain > 0.05) {
        ctx.strokeStyle = "rgba(255,255,255," + (0.35 * Math.max(this.fx.frogs, this.fx.rain)).toFixed(3) + ")"; ctx.lineWidth = 1; ctx.beginPath();
        for (i = 0; i < 7; i++) { var rp = (t * 0.6 + i * 0.37) % 1, rx = L.cx - (6 + ((i * 4.3) % 24)) * u + L.pan * 0.45, ry = L.yMea - u * 0.6 + ((i * 0.61) % 1) * u * 2.4; ctx.moveTo(rx + rp * u * 2, ry); ctx.ellipse(rx, ry, rp * u * 2, rp * u * 0.5, 0, 0, TAU); }
        ctx.stroke();
      }
    };
    Scene.prototype.drawGlow = function (ctx, st) {
      var L = this.L, t = this.now || 0, u = L.u, i;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      var warm = glowSprite([255, 200, 120]);
      if (this.bulbs && st.lights > 0.02) {
        for (i = 0; i < this.bulbs.length; i++) { var b = this.bulbs[i]; if (!b.on) { continue; } var fl = 0.85 + 0.15 * Math.sin(t * 3 + i * 1.3), sz = u * 2.2 * b.on * fl; ctx.globalAlpha = 0.75 * b.on; ctx.drawImage(warm, b.x - sz, b.y - sz, sz * 2, sz * 2); }
      }
      if (this.candles && st.lights > 0.02 && st.gh > 14.3) {
        for (i = 0; i < this.candles.length; i++) { var c = this.candles[i], f2 = 0.8 + 0.2 * Math.sin(t * 9 + i * 2), s2 = c.s * 1.6 * f2; ctx.globalAlpha = st.lights; ctx.drawImage(warm, c.x - s2, c.y - s2, s2 * 2, s2 * 2); }
      }
      if (this.archTop && this.archTop.k > 0 && st.lights > 0.02) {
        var a = this.archTop, gs = glowSprite([255, 236, 190]);
        for (i = 0; i < 14; i++) { var side = i % 2 ? -1 : 1, f = Math.floor(i / 2) / 7, gx = a.x + side * a.hw * (f < 0.5 ? 1 : 1 - (f - 0.5) * 2), gy = a.y + (f < 0.5 ? f * 2 * (a.s * 12) : 0), tw = 0.6 + 0.4 * Math.sin(t * 4 + i); ctx.globalAlpha = st.lights * tw; ctx.drawImage(gs, gx - a.s, gy - a.s, a.s * 2, a.s * 2); }
      }
      if (this.wijayaAt && this.wijayaAt.op > 0.1) {
        var w = this.wijayaAt, ws = glowSprite([255, 250, 225]), wr = w.r * 3.2 * (0.9 + 0.1 * Math.sin(t * 1.4));
        ctx.globalAlpha = w.op * (0.35 + st.night * 0.45); ctx.drawImage(ws, w.x - wr, w.y - wr, wr * 2, wr * 2);
      }
      var ff = st.night > 0.45 ? (st.night - 0.45) / 0.55 : 0, count = Math.floor(ff * (26 + Math.min(64, this.wish * 3)) + this.fx.crickets * 26);
      if (count > 0) {
        var fs = glowSprite([214, 255, 140]), r = rnd(31);
        for (i = 0; i < Math.min(count, 110); i++) {
          var z = 0.18 + r() * 0.85, rg = wxRange(L, z), hwx = lerp(rg[0], rg[1], r()), hp = proj(L, hwx, z);
          var x = hp.x + Math.sin(t * (0.25 + r() * 0.3) + i) * hp.s * 3, y = hp.y - hp.s * (1.5 + r() * 5) + Math.sin(t * (0.3 + r() * 0.3) + i * 2) * hp.s * 1.5;
          var bl = Math.pow(Math.max(0, Math.sin(t * (0.8 + r() * 0.9) + r() * 9)), 3), sz3 = hp.s * 1.3 + 2;
          ctx.globalAlpha = 0.25 + bl * 0.75; ctx.drawImage(fs, x - sz3, y - sz3, sz3 * 2, sz3 * 2);
        }
      }
      ctx.restore(); ctx.globalAlpha = 1;
      if (this.meAt && !this.opt.thumb) {
        var m = this.meAt, lab = m.maybe ? "masih menimbang…" : "kamu";
        ctx.font = "600 " + Math.max(10, Math.round(u * 1.25)) + "px Geologica, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        var tw2 = ctx.measureText(lab).width + u * 1.6, bob = Math.sin(t * 2) * u * 0.25;
        ctx.fillStyle = "rgba(255,250,236,0.94)"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(m.x - tw2 / 2, m.y - u * 1.1 + bob, tw2, u * 2.2, u * 1.1) : ctx.rect(m.x - tw2 / 2, m.y - u * 1.1 + bob, tw2, u * 2.2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(m.x - u * 0.5, m.y + u * 1.05 + bob); ctx.lineTo(m.x + u * 0.5, m.y + u * 1.05 + bob); ctx.lineTo(m.x, m.y + u * 1.7 + bob); ctx.fill();
        ctx.fillStyle = "#3a3325"; ctx.fillText(lab, m.x, m.y + bob + 0.5);
      }
      this.meAt = null;
    };
    Scene.prototype.drawRain = function (ctx, st) {
      var r = this.fx.rain;
      if (r < 0.03 || this.opt.thumb) { return; }
      var L = this.L, t = this.now, i;
      ctx.strokeStyle = "rgba(220,230,245," + (0.4 * r).toFixed(3) + ")"; ctx.lineWidth = 1; ctx.beginPath();
      for (i = 0; i < 170 * r; i++) { var sp = 0.9 + (i % 7) * 0.08, x = ((i * 97.13) % L.W + t * 60) % (L.W + 40) - 20, y = ((i * 53.7) % L.H + t * L.H * sp) % (L.H + 40) - 20, len = L.u * (1.4 + (i % 3) * 0.5); ctx.moveTo(x, y); ctx.lineTo(x - len * 0.25, y + len); }
      ctx.stroke();
    };
    Scene.prototype.drawBranch = function (ctx, st) {
      var L = this.L;
      if (L.portrait && !L.wide) { return; }
      var t = this.now || 0, len = Math.min(L.W, L.H) * 0.42, ang = Math.sin(t * 0.6) * 0.02 * (1 + st.wind), gh = st.gh;
      ctx.save(); ctx.translate(L.W + 8, -12); ctx.rotate(0.62 + ang);
      var col = shade(st, mix(C.leaf[0], [20, 30, 20], 0.3), 0), col2 = shade(st, C.leaf[1], 0);
      ctx.strokeStyle = css(shade(st, C.trunk, 0)); ctx.lineWidth = len * 0.022; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-len * 0.4, len * 0.12, -len, len * 0.05); ctx.moveTo(-len * 0.45, len * 0.1); ctx.quadraticCurveTo(-len * 0.6, len * 0.28, -len * 0.78, len * 0.34); ctx.stroke();
      var r = rnd(8);
      for (var pass = 0; pass < 2; pass++) {
        ctx.fillStyle = css(pass ? col2 : col); ctx.beginPath();
        for (var i = 0; i < 26; i++) { var f = 0.12 + r() * 0.88, br = i % 3 === 0, bx = br ? -len * (0.45 + f * 0.33) : -len * f, by = br ? len * (0.1 + f * 0.24) : len * (0.05 + Math.sin(f * 2.4) * 0.1), a = r() * PI - 0.2 + Math.sin(t * 1.3 + i) * 0.08 * (1 + st.wind), l = len * (0.06 + r() * 0.05); if ((i % 2) !== pass) { continue; } ctx.moveTo(bx, by); ctx.ellipse(bx + Math.cos(a) * l * 0.5, by + Math.sin(a) * l * 0.5, l * 0.55, l * 0.2, a, 0, TAU); }
        ctx.fill();
      }
      var bl = sm(12.8, 14.2, gh);
      if (bl > 0) { ctx.fillStyle = css(shade(st, C.blos, 0), bl); ctx.beginPath(); for (var k = 0; k < 16; k++) { var f2 = 0.2 + r() * 0.75, x2 = -len * f2 + (r() - 0.5) * len * 0.1, y2 = len * (0.08 + r() * 0.2), rr = len * 0.012; ctx.moveTo(x2 + rr, y2); ctx.arc(x2, y2, rr, 0, TAU); } ctx.fill(); }
      ctx.restore();
    };
    /* ---------- gambar satu bingkai ---------- */
    function flowers(h) {
      return {
        telang: sm(4.95, 5.5, h) * (1 - sm(12.8, 13.8, h)),
        teratai: sm(5.95, 6.9, h) * (1 - sm(14.8, 16.2, h)),
        p9: sm(8.95, 9.35, h) * (1 - sm(15.3, 16.2, h)),
        matahari: sm(7.4, 9.2, h) * (1 - 0.7 * sm(18.2, 19.6, h)),
        p4: sm(15.95, 16.45, h),
        melati: sm(17.95, 18.5, h),
        sedap: sm(18.95, 19.6, h),
        wijaya: sm(20.85, 21.6, h)
      };
    }
    Scene.prototype.setFx = function (k, v) { if (k in this.fxT) { this.fxT[k] = v ? 1 : 0; } };
    Scene.prototype.ensureBack = function (st) {
      var W = this.cv.width, H = this.cv.height;
      if (!this.bgA) { this.bgA = document.createElement("canvas"); this.bgB = document.createElement("canvas"); this.bgC = document.createElement("canvas"); this.bk = null; }
      if (this.bgA.width !== W || this.bgA.height !== H) { this.bgA.width = this.bgB.width = this.bgC.width = W; this.bgA.height = this.bgB.height = this.bgC.height = H; this.bk = null; }
      this.fn = (this.fn || 0) + 1;
      var k = this.bk, need = !k || Math.abs(st.h - k.h) > 0.012 || Math.abs(st.gh - k.gh) > 0.025 || Math.abs(this.fx.rain - k.r) > 0.03 || this.L !== k.L;
      if (!need || (k && k.L === this.L && this.fn - k.f < 3 && Math.abs(st.h - k.h) < 0.4 && Math.abs(st.gh - k.gh) < 0.4)) { return; }
      var a = this.bgA.getContext("2d"), b = this.bgB.getContext("2d"), c = this.bgC.getContext("2d");
      a.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); this.drawSky(a, st);
      b.setTransform(1, 0, 0, 1, 0, 0); b.clearRect(0, 0, W, H); b.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.drawMountains(b, st); this.drawHills(b, st); this.drawLake(b, st);
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.drawGround(c, st);
      this.bk = { h: st.h, gh: st.gh, r: this.fx.rain, L: this.L, f: this.fn };
    };
    Scene.prototype.draw = function (st) {
      var ctx = this.ctx, L = this.L, self = this, dt = st.dt || 0.016;
      this.now = st.time;
      for (var k in this.fx) { if (this.fx.hasOwnProperty(k)) { this.fx[k] += (this.fxT[k] - this.fx[k]) * Math.min(1, dt * 1.2); if (Math.abs(this.fx[k]) < 0.001) { this.fx[k] = 0; } } }
      this.gust *= Math.pow(0.4, dt);
      st.wind = (st.wind == null ? 0.35 : st.wind) + this.fx.wind * 0.9 + this.gust + this.fx.rain * 0.3;
      L.pan = st.pan || 0;
      this.compute(st);
      st.fl = flowers(st.h);
      st.lights = sm(17.85, 18.5, st.h) * sm(14.4, 15, st.gh);
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      var cache = !this.opt.thumb;
      if (cache) { this.ensureBack(st); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(this.bgA, 0, 0); ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); }
      else { this.drawSky(ctx, st); }
      this.drawStars(ctx, st); this.drawSunMoon(ctx, st);
      this.drawClouds(ctx, st, true); this.drawFireworks(ctx, st); this.drawClouds(ctx, st, false);
      if (cache) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(this.bgB, 0, 0); ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); }
      else { this.drawMountains(ctx, st); this.drawHills(ctx, st); this.drawLake(ctx, st); }
      this.drawSmoke(ctx, st); this.drawHillsLive(ctx, st); this.drawLakeLive(ctx, st); this.drawBoat(ctx, st); this.drawMist(ctx, st, false);
      if (cache) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(this.bgC, 0, 0); ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); }
      else { this.drawGround(ctx, st); }
      this.drawDew(ctx, st); this.drawPath(ctx, st); this.drawPools(ctx, st);
      var items = [
        { z: 0.14, fn: function () { self.drawBamboo(ctx, st); } },
        { z: 0.2, fn: function () { self.flamTree(ctx, st); } },
        { z: 0.26, fn: function () { self.bigTree(ctx, st); } },
        { z: 0.36, fn: function () { self.drawPoles(ctx, st); self.drawWires(ctx, st); } },
        { z: 0.4, fn: function () { self.drawArch(ctx, st); } },
        { z: 0.405, fn: function () { self.drawMelatiBush(ctx, st); } },
        { z: 0.42, fn: function () { self.drawSunflowers(ctx, st); } },
        { z: 0.47, fn: function () { self.drawTable(ctx, st); } },
        { z: 0.5, fn: function () { self.drawSedap(ctx, st); } },
        { z: 0.84, fn: function () { self.drawP4(ctx, st); } },
        { z: 0.9, fn: function () { self.drawJanur(ctx, st); } },
        { z: 1.0, fn: function () { self.drawWijaya(ctx, st); } }
      ];
      [0.45, 0.53, 0.61, 0.69].forEach(function (z, r) { items.push({ z: z + 0.001, fn: function () { self.drawRow(ctx, st, r); } }); });
      this.clumps.forEach(function (c) { items.push({ z: c.z, fn: function () { self.drawClump(ctx, st, c); } }); });
      this.walkers(st, items);
      for (var b = 0; b < this.bands.length; b++) { (function (b) { items.push({ z: (b + 0.5) / 24 * 1.1, fn: function () { self.drawBand(ctx, st, self.bands[b]); } }); })(b); }
      items.sort(function (a, b) { return a.z - b.z; });
      this.wijayaAt = null;
      for (var i = 0; i < items.length; i++) { items[i].fn(); }
      this.drawWaves(ctx, st);
      this.drawFG(ctx, st);
      this.drawMist(ctx, st, true);
      this.drawGlow(ctx, st);
      this.drawAmbientLife(ctx, st);
      this.drawParts(ctx, st);
      this.drawRain(ctx, st);
      this.drawBranch(ctx, st);
      if (this.fx.crickets > 0.02 && st.night < 0.5) { ctx.fillStyle = "rgba(20,24,60," + (0.22 * this.fx.crickets * (1 - st.night)).toFixed(3) + ")"; ctx.fillRect(0, 0, L.W, L.H); }
    };
    return { Scene: Scene, flowers: flowers, sky: function (h) { return at(SKY, h); }, light: function (h) { return at(LIGHT, h); }, css: css, mix: mix, hx: hx, sm: sm, SUNRISE: SUNRISE, SUNSET: SUNSET };
  })();
  /* ================= DATA & WAKTU ================= */
  var BR = txt("cv-bride"), GR = txt("cv-groom");
  function hm(s) { var m = /^(\d{1,2})[:.](\d{2})/.exec(clean(s)); if (!m) { return null; } var h = +m[1], mi = +m[2]; if (h > 23 || mi > 59) { return null; } return h + mi / 60; }
  function ymd(s) { var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(clean(s)); return m ? { y: +m[1], m: +m[2], d: +m[3] } : null; }
  var TZ = win.lanskapPlatform.timezone;
  function fmtHM(h) { if (h == null || isNaN(h)) { return ""; } h = ((h % 24) + 24) % 24; var H = Math.floor(h), M = Math.round((h - H) * 60); if (M === 60) { H = (H + 1) % 24; M = 0; } return pad2(H) + "." + pad2(M); }
  var HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  function fmtDate(o, noDay) { return win.lanskapFormatDate(o, noDay); }
  function absT(o, h) { if (!o) { return null; } h = h == null ? 0 : h; var H = Math.floor(h), M = Math.round((h - H) * 60); return Date.UTC(o.y, o.m - 1, o.d, H, M) - TZ.o * 3600000; }
  var EV1 = { name: txt("ev-1-name"), d: ymd(txt("pv-date")), s: hm(txt("pv-time")), e: hm(txt("pv-e1end")), venue: txt("ev-1-venue"), addr: txt("ev-1-addr") };
  
  var EV2 = { name: txt("ev-2-name"), d: ymd(txt("pv-e2date")) || EV1.d, s: hm(txt("pv-e2time")), e: hm(txt("pv-e2end")), venue: txt("ev-2-venue") || EV1.venue, addr: txt("ev-2-addr") || EV1.addr };
  var PLACE = txt("pv-place"), MKEY = txt("pv-key");
  function timeRange(s, e) { return fmtHM(s) + (e != null ? " – " + fmtHM(e) : " – selesai") + " " + TZ.l; }
  function mapLink(venue, addr) {
    if (win.lanskapPlatform.mapUrl) { return win.lanskapPlatform.mapUrl; }
    if (PLACE) { return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(venue || "Tujuan") + "&travelmode=driving&destination_place_id=" + encodeURIComponent(PLACE); }
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([venue, addr].filter(Boolean).join(", "));
  }
  function gcal(name, o, s, e, venue, addr) {
    var st = absT(o, s), en = absT(o, e != null ? e : s + 2);
    if (st == null) { return "#"; }
    if (en <= st) { en = st + 7200000; }
    function f(t) { return new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(name + " · " + BR + " & " + GR) + "&dates=" + f(st) + "/" + f(en) + "&details=" + encodeURIComponent(win.lanskapTranslate("Sampai jumpa di lembah — ") + BR + " & " + GR) + "&location=" + encodeURIComponent([venue, addr].filter(Boolean).join(", "));
  }

  /* ================= BUNGA JAM ================= */
  var FL = [
    { k: "telang", n: win.lanskapTranslate("Telang"), h: 5, o: [4.95, 13.3], c: "#3558d6", c2: "#fbf3d6", f: win.lanskapTranslate("Kelopak birunya membuka sebelum matahari terbit; diseduh, ia jadi teh biru.") },
    { k: "teratai", n: win.lanskapTranslate("Teratai"), h: 6, o: [5.95, 15.5], c: "#f09bb2", c2: "#f4d15f", f: win.lanskapTranslate("Bangun bersama matahari dari lumpur telaga, dan tetap bersih tanpa noda.") },
    { k: "matahari", n: win.lanskapTranslate("Bunga Matahari"), h: 8, o: [7.4, 18.9], c: "#f6c22e", c2: "#6b3f1d", f: win.lanskapTranslate("Sepanjang hari menoleh mengikuti matahari, dari timur ke barat.") },
    { k: "p9", n: win.lanskapTranslate("Bunga Pukul Sembilan"), h: 9, o: [8.95, 15.7], c: "#e2358d", c2: "#ffd23f", f: win.lanskapTranslate("Namanya adalah janjinya: mekar sekitar pukul sembilan pagi.") },
    { k: "p4", n: win.lanskapTranslate("Bunga Pukul Empat"), h: 16, o: [15.95, 30], c: "#d6337f", c2: "#f2c14e", f: win.lanskapTranslate("Tidur seharian, bangun pukul empat sore, lalu harum sampai malam.") },
    { k: "melati", n: win.lanskapTranslate("Melati"), h: 18, o: [17.95, 30], c: "#fffdf4", c2: "#e8d27c", f: win.lanskapTranslate("Kuncupnya dirangkai jadi ronce pengantin; harumnya menguat selepas senja.") },
    { k: "sedap", n: win.lanskapTranslate("Sedap Malam"), h: 19, o: [18.95, 30], c: "#fff7e8", c2: "#e5d3b0", f: win.lanskapTranslate("Wanginya baru terasa saat malam — penghias meja pesta di banyak pernikahan.") },
    { k: "wijaya", n: win.lanskapTranslate("Wijayakusuma"), h: 21, o: [20.85, 30], c: "#fffaf0", c2: "#d99a86", f: win.lanskapTranslate("Mekar hanya satu malam, lalu menutup sebelum fajar. Langka, dan layak ditunggu.") }
  ];
  function flByKey(k) { for (var i = 0; i < FL.length; i++) { if (FL[i].k === k) { return FL[i]; } } return FL[0]; }
  function isOpen(f, h) { return h >= f.o[0] && h < f.o[1]; }
  function bloomAt(h) { var r = null; for (var i = 0; i < FL.length; i++) { if (isOpen(FL[i], h) && (!r || FL[i].o[0] > r.o[0])) { r = FL[i]; } } return r || (h < 5 ? flByKey("wijaya") : flByKey("telang")); }
  function nearestFl(h) { var best = FL[0], bd = 99; FL.forEach(function (f) { var d = Math.abs(f.h - h); d = Math.min(d, 24 - d); if (d < bd - 0.01) { bd = d; best = f; } }); return best; }
  var PETAL = {
    round: "M0 0C-13-7-15-31 0-40C15-31 13-7 0 0Z",
    point: "M0-2C-11-13-10-33 0-45C10-33 11-13 0-2Z",
    slim: "M0 0C-5-14-5-36 0-47C5-36 5-14 0 0Z",
    ray: "M0-13C-5-21-5-33 0-44C5-33 5-21 0-13Z",
    short: "M0 0C-9-6-10-22 0-27C10-22 9-6 0 0Z",
    star: "M0 0C-8-8-7-26 0-36C7-26 8-8 0 0Z",
    lobe: "M0 0C-17-5-20-27-3-33C8-35 17-26 12-12C9-6 5-2 0 0Z"
  };
  function flowerG(k, parent, o) {
    var f = flByKey(k), g = sv("g", { "class": "flw" }, parent), gid = mkId("gr");
    g.style.setProperty("--o", o == null ? 1 : o);
    var defs = sv("defs", {}, g), lg = sv("radialGradient", { id: gid, cx: "0", cy: "0", r: "46", gradientUnits: "userSpaceOnUse" }, defs);
    var dark = k === "melati" || k === "sedap" || k === "wijaya" ? "#efe4cf" : f.c;
    sv("stop", { offset: "0", "stop-color": k === "telang" ? "#fbf3d6" : f.c2 }, lg); sv("stop", { offset: ".28", "stop-color": f.c }, lg); sv("stop", { offset: "1", "stop-color": dark }, lg);
    var fill = "url(#" + gid + ")", stroke = k === "melati" || k === "sedap" || k === "wijaya" ? "#cdbd9c" : "rgba(0,0,0,.18)";
    function petals(shape, n, off, sc, fl) { for (var i = 0; i < n; i++) { var p = sv("path", { d: PETAL[shape], fill: fl || fill, stroke: stroke, "stroke-width": ".8", "class": "pt" }, g); p.style.setProperty("--r", (off + i * 360 / n) + "deg"); } }
    sv("path", { d: k === "wijaya" ? "M0 6C-9 2-10-20 0-34C10-20 9 2 0 6Z" : "M0 4C-7 1-8-14 0-24C8-14 7 1 0 4Z", fill: k === "melati" || k === "sedap" || k === "wijaya" ? "#efe2c8" : f.c, stroke: stroke, "stroke-width": ".8", "class": "pt-bud" }, g);
    if (k === "telang") { petals("lobe", 1, -8); petals("short", 2, 150, 0, "#2a44b8"); sv("ellipse", { cx: "0", cy: "-8", rx: "5", ry: "11", fill: "#fbf3d6", "class": "fc" }, g); }
    else if (k === "teratai") { petals("point", 5, -72); petals("point", 3, -36); sv("circle", { r: "8", fill: "#e9cf5b" }, g); }
    else if (k === "matahari") { petals("ray", 16, 0); sv("circle", { r: "15", fill: "#6b3f1d" }, g); sv("circle", { r: "9", fill: "#8a5426", opacity: ".7" }, g); }
    else if (k === "p9") { petals("round", 5, 0); sv("circle", { r: "7", fill: "#ffd23f" }, g); }
    else if (k === "p4") { petals("lobe", 5, 0); sv("circle", { r: "5", fill: "#fff2b8" }, g); }
    else if (k === "melati") { petals("short", 8, 22); petals("short", 6, 0); sv("circle", { r: "4.5", fill: "#f0dc88" }, g); }
    else if (k === "sedap") { petals("star", 6, 0); sv("circle", { r: "4", fill: "#f2e3bf" }, g); }
    else { petals("slim", 12, 15, 0, "#d99a86"); petals("slim", 14, 0); sv("circle", { r: "7", fill: "#fff6cf" }, g); }
    return g;
  }
  function flowerSVG(k, parent, o, vb) {
    var s = sv("svg", { viewBox: vb || "-50 -50 100 100", "aria-hidden": "true" }, parent);
    flowerG(k, s, o);
    return s;
  }
  function setOpen(g, o) { if (g) { g.style.setProperty("--o", o); } }

  /* ================= CATATAN JAM ================= */
  var NOTES = [
    [0, win.lanskapTranslate("Lembah masih biru. Kabut tidur di atas sawah.")],
    [5.55, win.lanskapTranslate("Langit timur memerah muda. Telang membuka kelopak birunya.")],
    [6.05, win.lanskapTranslate("Matahari naik dari balik gunung. Embun berkilau di ujung rumput.")],
    [6.7, win.lanskapTranslate("Teratai di telaga mulai mekar. Burung-burung pagi melintas.")],
    [7.4, win.lanskapTranslate("Kabut pergi. Rumput tumbuh setinggi mata kaki.")],
    [8.1, win.lanskapTranslate("Batu-batu jalan setapak muncul satu per satu.")],
    [8.9, win.lanskapTranslate("Pukul sembilan: bunga pukul sembilan menepati janjinya.")],
    [9.6, win.lanskapTranslate("Janur kuning berdiri di mulut jalan. Kupu-kupu berdatangan.")],
    [10.4, win.lanskapTranslate("Gerbang kayu didirikan di bawah pohon trembesi.")],
    [11.3, win.lanskapTranslate("Matahari tepat di atas kepala. Bunga matahari menengadah.")],
    [12.1, win.lanskapTranslate("Kursi-kursi disusun, baris demi baris.")],
    [12.9, win.lanskapTranslate("Trembesi berbunga merah muda. Kelopaknya jatuh di lorong.")],
    [13.7, win.lanskapTranslate("Meja panjang digelar, tiang-tiang lampu dibentangkan.")],
    [14.8, win.lanskapTranslate("Padi menguning di teras sawah. Angin sore mulai turun.")],
    [15.8, win.lanskapTranslate("Pukul empat: bunga pukul empat bangun. Tamu mulai berdatangan.")],
    [16.8, win.lanskapTranslate("Cahaya keemasan. Dua orang berjalan pelan menuju gerbang.")],
    [17.6, win.lanskapTranslate("Matahari tenggelam. Janji diucapkan di bawah langit jingga.")],
    [18.0, win.lanskapTranslate("Lampu-lampu menyala satu per satu. Melati mulai harum.")],
    [18.7, win.lanskapTranslate("Bulan naik. Sedap malam menebar wangi.")],
    [19.5, win.lanskapTranslate("Kunang-kunang keluar dari rumput. Lembah berpesta pelan.")],
    [20.5, win.lanskapTranslate("Wijayakusuma bersiap. Ia hanya mekar satu malam.")],
    [21.3, win.lanskapTranslate("Wijayakusuma mekar. Malam ini tak akan terulang.")]
  ];
  function noteAt(h) { var r = NOTES[0][1]; for (var i = 0; i < NOTES.length; i++) { if (h >= NOTES[i][0]) { r = NOTES[i][1]; } } return win.lanskapTranslate(r); }
  var TEMPS = [[4, 19], [6, 20], [8, 23], [10, 26], [12, 29], [14, 30], [16, 28], [18, 25], [20, 22], [23, 21]];
  function tempAt(h) { for (var i = 1; i < TEMPS.length; i++) { if (h <= TEMPS[i][0]) { var a = TEMPS[i - 1], b = TEMPS[i]; return Math.round(lerp(a[1], b[1], (h - a[0]) / (b[0] - a[0]))); } } return 21; }
  var rainOn = false;
  function wxAt(h) { if (rainOn) { return win.lanskapTranslate("gerimis"); } return h < 5.8 ? win.lanskapTranslate("subuh berkabut") : h < 7.3 ? win.lanskapTranslate("berkabut tipis") : h < 11 ? win.lanskapTranslate("cerah") : h < 15 ? win.lanskapTranslate("cerah berawan") : h < 17.2 ? win.lanskapTranslate("hangat") : h < 18.2 ? win.lanskapTranslate("keemasan") : h < 19.2 ? win.lanskapTranslate("senja") : win.lanskapTranslate("malam cerah"); }
  function phaseOf(h) { return h < 6.7 ? "fajar" : h < 15.8 ? "siang" : h < 18.75 ? win.lanskapTranslate("senja") : "malam"; }
  function skyCss(h, i) { var s = LAND.sky(h); return LAND.css(s[i == null ? 2 : i]); }

  /* ================= BAGIAN & JAM ================= */
  var H0 = 5.35, H1 = 22.05, SECS = [], ANCH = [], secH = {};
  function secEl(id) { return doc.querySelector('[data-section="' + id + '"]'); }
  function navItem(id) { return doc.querySelector('#nav [data-nav-target="' + id + '"]'); }
  function hideSec(id) { var s = secEl(id); if (s) { s.style.display = "none"; } var n = navItem(id); if (n) { n.style.display = "none"; } }
  function isShown(s) { if (!s) { return false; } var cs = win.getComputedStyle(s); return cs.display !== "none" && cs.visibility !== "hidden"; }
  function journal(s, i, h) {
    var id = s.getAttribute("data-section"), jr = s.querySelector(".jr"), f = bloomAt(h);
    if (jr) {
      jr.textContent = "";
      el("span", "jr-no", jr, "Catatan " + pad2(i));
      var t = el("span", "jr-time", jr), dot = el("i", "jr-sun", t); dot.style.background = "radial-gradient(circle at 50% 70%, " + skyCss(h, 3) + ", " + skyCss(h, 1) + ")"; el("b", "", t, "pukul " + fmtHM(h));
      el("span", "jr-wx", jr, wxAt(h) + " · " + tempAt(h) + "°");
      var b = el("span", "jr-bloom", jr), bi = el("i", "", b); bi.style.background = f.c; bi.style.boxShadow = "0 0 0 1px rgba(0,0,0,.15)"; el("span", "", b, "mekar: " + f.n.toLowerCase());
    }
    var vn = s.querySelector(".vn");
    if (vn) { vn.textContent = ""; el("span", "vn-time", vn, fmtHM(h)); el("span", "vn-t", vn, noteAt(h)); }
    var orn = s.querySelector(".orn");
    if (orn && orn.getAttribute("data-k") !== f.k) { orn.textContent = ""; orn.setAttribute("data-k", f.k); ornament(orn, f.k, h); }
  }
  function ornament(box, k, h) {
    var s = sv("svg", { viewBox: "0 0 100 120", "aria-hidden": "true" }, box), g = sv("g", { "class": "orn-sway" }, s);
    g.style.animationDelay = (-(hashStr(k + h) % 50) / 10) + "s";
    sv("path", { d: "M58 118C56 96 62 80 52 58C46 46 50 36 50 34", fill: "none", stroke: "#5d8a47", "stroke-width": "2.2", "stroke-linecap": "round" }, g);
    sv("path", { d: "M55 92C40 88 32 78 30 66C44 68 53 77 55 92Z", fill: "#6fa152" }, g);
    sv("path", { d: "M57 76C70 70 78 60 78 48C66 52 58 62 57 76Z", fill: "#85b562" }, g);
    var fw = sv("g", { transform: "translate(50 32) scale(.62)" }, g);
    flowerG(k, fw, 1);
  }
  function layoutSecs() {
    SECS = qsa("body > [data-section]").filter(function (s) { return s.getAttribute("data-section") !== "cover" && isShown(s); });
    var n = SECS.length;
    SECS.forEach(function (s, i) {
      var h = n > 1 ? H0 + (H1 - H0) * i / (n - 1) : H0, id = s.getAttribute("data-section");
      s._h = h; secH[id] = h;
      if (id !== "hero") { s.setAttribute("data-phase", phaseOf(h)); journal(s, i, h); }
      var ni = navItem(id), hh = ni && ni.querySelector(".ni-h");
      if (hh) { hh.textContent = fmtHM(h); }
    });
    setText("hero-note-time", fmtHM(H0)); setText("hero-note-t", noteAt(H0).toLowerCase().replace(/\.$/, ""));
    measure();
  }
  function measure() {
    var sy = win.pageYOffset;
    ANCH = SECS.map(function (s) { var c = s.querySelector(".card"); return (c || s).getBoundingClientRect().top + sy; });
    if (ANCH.length) { ANCH[0] = win.innerHeight * 0.66; }
  }
  function scrollHour() {
    if (!ANCH.length) { return H0; }
    var y = win.pageYOffset + win.innerHeight * 0.66;
    if (y <= ANCH[0]) { return SECS[0]._h; }
    for (var i = 0; i < ANCH.length - 1; i++) {
      if (y < ANCH[i + 1]) { var f = (y - ANCH[i]) / Math.max(1, ANCH[i + 1] - ANCH[i]); return lerp(SECS[i]._h, SECS[i + 1]._h, c01(f)); }
    }
    return SECS[SECS.length - 1]._h;
  }

  /* ================= PENGGERAK LANSKAP ================= */
  var cvs = $("land"), scene = null, lw = 0, lhh = 0, quality = 1;
  var st = { h: 4.9, gh: 5.25, time: 0, dt: 0.016, wind: 0.35, pan: 0, coverFog: 1.6 };
  var hDisp = 4.9, ghDisp = 5.25, coverHold = true, coverRamp = false, OV = null, lastT = 0, t0 = 0, scrollVel = 0, lastSY = 0, idleT = 0, frameSkip = 0, staticDirty = true, lastStaticH = -1;
  function initLand() {
    try { if (!cvs || !cvs.getContext || !cvs.getContext("2d")) { throw new Error("no2d"); } scene = new LAND.Scene(cvs, {}); } catch (e) { scene = null; body.classList.add("no-land"); return; }
    sizeLand(true);
    win.requestAnimationFrame(frame);
  }
  function sizeLand(force) {
    if (!scene) { return; }
    var w = cvs.clientWidth || win.innerWidth, h = cvs.clientHeight || win.innerHeight;
    if (!force && w === lw && Math.abs(h - lhh) < 140) { return; }
    lw = w; lhh = h;
    var dpr = Math.min(win.devicePixelRatio || 1, w < 760 ? 1.4 : 1.5) * quality;
    scene.resize(w, h, Math.max(0.6, dpr));
    staticDirty = true;
  }
  function setOverride(o) { OV = o; staticDirty = true; }
  var fiAvg = 16.7, fiN = 0, fiLast = 0;
  function frame(now) {
    win.requestAnimationFrame(frame);
    if (doc.hidden || !scene) { lastT = now; fiLast = 0; return; }
    if (fiLast && !coverHold) {
      var fi = now - fiLast;
      if (fi < 200) { fiAvg = fiAvg * 0.95 + fi * 0.05; fiN++; }
      if (fiN > 150 && fiAvg > 24 && quality > 0.56) { quality = Math.max(0.55, quality - 0.15); fiN = 0; fiAvg = 16.7; sizeLand(true); }
    }
    fiLast = now;
    render(now);
  }
  function render(now) {
    var dt = lastT ? clamp((now - lastT) / 1000, 0.001, 0.05) : 0.016;
    lastT = Math.max(lastT, now); if (!t0) { t0 = now; }
    var sy = win.pageYOffset, dy = Math.abs(sy - lastSY); lastSY = sy;
    scrollVel = scrollVel * 0.9 + dy * 0.1;
    idleT = dy > 0.5 ? 0 : idleT + dt;
    var tgt = coverHold ? 4.9 : scrollHour(), tg = coverHold ? 5.25 : tgt;
    if (OV) { tgt = OV.h; if (OV.gh != null) { tg = OV.gh; } }
    if (reduce) {
      var snap = tgt;
      if (!OV && SECS.length) { snap = SECS[0]._h; var line = win.innerHeight * 0.5; for (var i = 0; i < SECS.length; i++) { if (SECS[i].getBoundingClientRect().top < line) { snap = SECS[i]._h; } } tg = snap; }
      if (!staticDirty && Math.abs(snap - lastStaticH) < 0.01) { return; }
      staticDirty = false; lastStaticH = snap; hDisp = snap; ghDisp = tg;
      st.h = hDisp; st.gh = ghDisp; st.time = 3; st.dt = 0.016; st.wind = 0.2; st.pan = 0; st.coverFog = coverHold ? 1.6 : 1;
      scene.draw(st); hudTick(true); return;
    }
    if (idleT > 4 && !OV && !coverRamp) { frameSkip = (frameSkip + 1) % 2; if (frameSkip) { return; } dt *= 2; }
    var rate = coverRamp ? 0.75 : OV ? (OV.rate || 3) : 4.5, k = 1 - Math.exp(-dt * rate);
    hDisp += (tgt - hDisp) * k; ghDisp += (tg - ghDisp) * k;
    st.h = hDisp; st.gh = ghDisp; st.time = (now - t0) / 1000; st.dt = dt;
    st.wind = 0.3 + 0.16 * Math.sin(st.time * 0.37) + 0.08 * Math.sin(st.time * 1.9) + Math.min(0.7, scrollVel * 0.012);
    st.pan = 0; st.coverFog = coverHold ? 1.6 : lerp(st.coverFog, 1, k);
    scene.draw(st);
    hudTick(false);
  }

  /* ================= HUD ================= */
  var hudLast = -9, hudNight = null;
  function hudTick(force) {
    var h = hDisp;
    if (!force && Math.abs(h - hudLast) < 1 / 60) { return; }
    hudLast = h;
    setText("hud-time", fmtHM(h));
    setText("hud-sub", wxAt(h) + " · " + tempAt(h) + "°");
    var f = bloomAt(h); setText("hud-bloom-v", f.n.toLowerCase());
    var sky = LAND.sky(h);
    body.style.setProperty("--g-sky", "linear-gradient(" + LAND.css(sky[1]) + "," + LAND.css(sky[3]) + ")");
    var dial = $("hud-dial"); if (dial) { dial.style.background = "linear-gradient(" + LAND.css(sky[1]) + "," + LAND.css(sky[3]) + ")"; }
    var sun = $("hud-sun"), fr = (h - LAND.SUNRISE) / (LAND.SUNSET - LAND.SUNRISE), night = h > 18.4 || h < 5.6;
    if (sun) {
      if (!night) { sun.setAttribute("cx", (5 + 30 * c01(fr)).toFixed(1)); sun.setAttribute("cy", (25 - Math.sin(c01(fr) * Math.PI) * 15 + (fr < 0 || fr > 1 ? 6 : 0)).toFixed(1)); sun.setAttribute("fill", fr < 0.12 || fr > 0.88 ? "#ffb070" : "#ffd27a"); }
      else { var mf = c01((h - 18.3) / 4.5); sun.setAttribute("cx", (31 - mf * 6).toFixed(1)); sun.setAttribute("cy", (22 - mf * 11).toFixed(1)); sun.setAttribute("fill", "#f1eedc"); }
    }
    if (night !== hudNight) { hudNight = night; body.classList.toggle("is-night", night); }
    var acc = h < 6.7 ? "#ffc28a" : h < 15.8 ? "#ffd27a" : h < 18.75 ? "#ffb070" : "#f1c46a";
    body.style.setProperty("--g-acc", acc);
  }

  /* ================= NAVIGASI ================= */
  var activeId = "", navLockUntil = 0, centerT = 0;
  function navSync() {
    if (Date.now() < navLockUntil || !SECS.length) { return; }
    var line = win.innerHeight * 0.35, cur = SECS[0].getAttribute("data-section");
    for (var i = 0; i < SECS.length; i++) { if (SECS[i].getBoundingClientRect().top <= line) { cur = SECS[i].getAttribute("data-section"); } }
    setActive(cur, false);
  }
  function setActive(id, instant) {
    if (id === activeId) { return; }
    activeId = id;
    qsa("#nav [data-nav-target]").forEach(function (b) { var on = b.getAttribute("data-nav-target") === id; b.classList.toggle("is-active", on); if (on) { b.setAttribute("aria-current", "true"); } else { b.removeAttribute("aria-current"); } });
    clearTimeout(centerT);
    if (instant) { centerRail(id); } else { centerT = setTimeout(function () { centerRail(id); }, 180); }
  }
  function centerRail(id) {
    var rail = $("nav-list"), it = rail && rail.querySelector('[data-nav-target="' + id + '"]');
    if (!it || !it.offsetParent) { return; }
    var rr = rail.getBoundingClientRect(), ir = it.getBoundingClientRect(), beh = reduce ? "auto" : "smooth";
    var horiz = rail.scrollWidth > rail.clientWidth + 2, vert = rail.scrollHeight > rail.clientHeight + 2;
    if (horiz) {
      var tl = clamp(rail.scrollLeft + (ir.left - rr.left - rail.clientLeft) - (rail.clientWidth - ir.width) / 2, 0, rail.scrollWidth - rail.clientWidth);
      if (Math.abs(tl - rail.scrollLeft) > 2) { try { rail.scrollTo({ left: tl, behavior: beh }); } catch (e) { rail.scrollLeft = tl; } }
    } else if (vert) {
      var tt = clamp(rail.scrollTop + (ir.top - rr.top - rail.clientTop) - (rail.clientHeight - ir.height) / 2, 0, rail.scrollHeight - rail.clientHeight);
      if (Math.abs(tt - rail.scrollTop) > 2) { try { rail.scrollTo({ top: tt, behavior: beh }); } catch (e) { rail.scrollTop = tt; } }
    }
  }
  function goSection(id) {
    var t = secEl(id);
    if (!t || !isShown(t)) { return; }
    var y = 0;
    if (id !== "hero") { var c = t.querySelector(".card") || t; y = c.getBoundingClientRect().top + win.pageYOffset - (win.innerWidth >= 1024 ? 84 : 70); }
    navLockUntil = Date.now() + 1200; clearTimeout(centerT); activeId = ""; setActive(id, true);
    try { win.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" }); } catch (e) { win.scrollTo(0, Math.max(0, y)); }
    setTimeout(function () { navLockUntil = 0; activeId = ""; navSync(); }, 1300);
  }
  $("nav-list").addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-nav-target]") : null;
    if (!b) { return; }
    e.preventDefault(); tock(); goSection(b.getAttribute("data-nav-target"));
  });
  $("hud-clock").addEventListener("click", function () { tock(); if (isShown(secEl("jambunga"))) { goSection("jambunga"); } else { toast("Pukul " + fmtHM(hDisp) + " di lembah — sedang mekar: " + bloomAt(hDisp).n.toLowerCase() + "."); } });

  /* ================= REVEAL ================= */
  var IO = null;
  function onReveal(t) { if (t.classList.contains("plot")) { t.classList.add("in-view"); } if (t._onReveal) { t._onReveal(); } }
  function initReveal() {
    var els = qsa(".rv, .vn, .plot").filter(function (e) { return !e.closest("#sec-hero") && !e.closest("#sec-cover"); });
    if (reduce || !("IntersectionObserver" in win)) { els.forEach(function (e) { e.classList.add("in-view"); onReveal(e); }); return; }
    IO = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in-view"); IO.unobserve(en.target); onReveal(en.target); } }); }, { threshold: 0, rootMargin: "0px 0px -33% 0px" });
    els.forEach(function (e) { IO.observe(e); });
  }
  function observe(e) { if (IO) { IO.observe(e); } else { e.classList.add("in-view"); onReveal(e); } }
  function bottomRelease() {
    if (win.innerHeight + win.pageYOffset >= doc.documentElement.scrollHeight - 4) {
      qsa(".rv:not(.in-view), .vn:not(.in-view), .plot:not(.in-view)").forEach(function (e) { if (!e.closest("#sec-cover")) { e.classList.add("in-view"); onReveal(e); } });
    }
  }
  function stagger(parentSel, step) { qsa(parentSel).forEach(function (p) { var i = 0; Array.prototype.forEach.call(p.children, function (c) { if (c.classList.contains("rv")) { c.style.setProperty("--d", ((i % 5) * (step || 0.08)).toFixed(2) + "s"); i++; } }); }); }
  var heroDone = false;
  function revealHero() { if (heroDone) { return; } heroDone = true; var h = $("sec-hero"); if (h) { h.classList.add("in-view"); } }

  /* ================= SUARA (Web Audio) ================= */
  var AC = null, MG = null, SFX = null, AMB = null, SCP = null, NB = null, sndOn = false, bgm = $("bgm");
  var hasMusic = !!(bgm && clean(bgm.getAttribute("src")) && !/\{\{/.test(bgm.getAttribute("src")));
  function ac() {
    if (AC) { return AC; }
    var C = win.AudioContext || win.webkitAudioContext;
    if (!C) { return null; }
    try { AC = new C(); } catch (e) { AC = null; return null; }
    MG = AC.createGain(); MG.gain.value = 0; MG.connect(AC.destination);
    SFX = AC.createGain(); SFX.gain.value = 0.5; SFX.connect(MG);
    AMB = AC.createGain(); AMB.gain.value = 0.2; AMB.connect(MG);
    SCP = AC.createGain(); SCP.gain.value = 0.85; SCP.connect(MG);
    var len = AC.sampleRate * 2, buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) { d[i] = Math.random() * 2 - 1; }
    NB = buf;
    return AC;
  }
  function noiseSrc() { var s = AC.createBufferSource(); s.buffer = NB; s.loop = true; s.loopStart = Math.random(); return s; }
  function env(g, t, a, d, pk) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(pk, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function tone(f, dur, type, vol, when, f2, out) {
    if (!sndOn || !ac()) { return; }
    var t = AC.currentTime + (when || 0), o = AC.createOscillator(), g = AC.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (f2) { o.frequency.exponentialRampToValueAtTime(f2, t + dur); }
    env(g, t, 0.006, dur, vol || 0.2); o.connect(g); g.connect(out || SFX); o.start(t); o.stop(t + dur + 0.05);
  }
  function noiseHit(dur, freq, q, vol, when, type, out) {
    if (!sndOn || !ac()) { return; }
    var t = AC.currentTime + (when || 0), s = noiseSrc(), f = AC.createBiquadFilter(), g = AC.createGain();
    f.type = type || "bandpass"; f.frequency.value = freq; f.Q.value = q || 1;
    env(g, t, 0.004, dur, vol || 0.2); s.connect(f); f.connect(g); g.connect(out || SFX); s.start(t); s.stop(t + dur + 0.05);
  }
  var PENTA = [1046.5, 1174.7, 1318.5, 1568, 1760, 2093];
  function chime(n) { for (var i = 0; i < (n || 1); i++) { var f = PENTA[Math.floor(Math.random() * PENTA.length)], w = i * 0.09; tone(f, 1.4, "sine", 0.12, w); tone(f * 2.76, 0.5, "sine", 0.03, w); } }
  function plink() { tone(1700 + Math.random() * 500, 0.16, "sine", 0.16, 0, 900); }
  function tock() { tone(520 + Math.random() * 80, 0.07, "triangle", 0.14); noiseHit(0.03, 2400, 3, 0.05); }
  function pop() { tone(420, 0.12, "sine", 0.16, 0, 160); }
  function whoosh() { if (!sndOn || !ac()) { return; } var t = AC.currentTime, s = noiseSrc(), f = AC.createBiquadFilter(), g = AC.createGain(); f.type = "bandpass"; f.Q.value = 0.7; f.frequency.setValueAtTime(260, t); f.frequency.exponentialRampToValueAtTime(1700, t + 1.3); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7); s.connect(f); f.connect(g); g.connect(SFX); s.start(t); s.stop(t + 1.8); }
  function thud() { tone(140, 0.22, "sine", 0.3, 0, 60); noiseHit(0.08, 300, 1, 0.12, 0, "lowpass"); }
  function twinkle() { for (var i = 0; i < 5; i++) { tone(1900 + i * 260 + Math.random() * 90, 0.3, "sine", 0.05, i * 0.06); } }
  function boom() { noiseHit(0.5, 180, 0.7, 0.35, 0, "lowpass"); for (var i = 0; i < 14; i++) { noiseHit(0.03, 3000 + Math.random() * 3000, 4, 0.06, 0.25 + Math.random() * 0.7); } }
  function chirp(out, vol) { var base = 2600 + Math.random() * 1600, n = 2 + Math.floor(Math.random() * 3); for (var i = 0; i < n; i++) { tone(base, 0.07, "sine", vol || 0.07, i * 0.1, base * (1.25 + Math.random() * 0.3), out); } }
  function croak(out, vol) { if (!sndOn || !ac()) { return; } var t = AC.currentTime, o = AC.createOscillator(), f = AC.createBiquadFilter(), g = AC.createGain(), n = 3 + Math.floor(Math.random() * 3); o.type = "sawtooth"; o.frequency.value = 150 + Math.random() * 70; f.type = "bandpass"; f.frequency.value = 650; f.Q.value = 5; g.gain.value = 0.0001; for (var i = 0; i < n; i++) { var tt = t + i * 0.085; g.gain.setValueAtTime(0.0001, tt); g.gain.exponentialRampToValueAtTime(vol || 0.12, tt + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.07); } o.connect(f); f.connect(g); g.connect(out || AMB); o.start(t); o.stop(t + n * 0.085 + 0.1); }
  function cricket(out, vol) { var f = 4300 + Math.random() * 500; for (var i = 0; i < 3; i++) { tone(f, 0.035, "sine", vol || 0.04, i * 0.055, 0, out); } }
  function cicada(out) { if (!sndOn || !ac()) { return; } var t = AC.currentTime, s = noiseSrc(), f = AC.createBiquadFilter(), g = AC.createGain(), lfo = AC.createOscillator(), lg = AC.createGain(); f.type = "bandpass"; f.frequency.value = 5200; f.Q.value = 6; lfo.frequency.value = 38; lg.gain.value = 0.02; lfo.connect(lg); lg.connect(g.gain); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03, t + 1.2); g.gain.linearRampToValueAtTime(0.0001, t + 3.4); s.connect(f); f.connect(g); g.connect(out || AMB); s.start(t); lfo.start(t); s.stop(t + 3.5); lfo.stop(t + 3.5); }
  var windBed = null;
  function startBed() {
    if (windBed || !ac()) { return; }
    var s = noiseSrc(), f = AC.createBiquadFilter(), g = AC.createGain(), l = AC.createOscillator(), lg = AC.createGain();
    f.type = "lowpass"; f.frequency.value = 420; g.gain.value = 0.05; l.frequency.value = 0.07; lg.gain.value = 0.03; l.connect(lg); lg.connect(g.gain);
    s.connect(f); f.connect(g); g.connect(AMB); s.start(); l.start(); windBed = { s: s, g: g };
  }
  var musicVol = 0.6;
  function playMusic() { if (!hasMusic || !bgm) { return; } try { if (!bgm.getAttribute("data-ok")) { bgm.setAttribute("data-ok", "1"); bgm.preload = "auto"; } bgm.volume = musicVol; var p = bgm.play(); if (p && p.then) { p.then(function () { win.lanskapPlatform.musicPlayed = true; }).catch(function () { if (!win.lanskapPlatform.musicPlayed) { sndOn = false; $("hud-snd").setAttribute("aria-pressed", "false"); $("hud-snd").setAttribute("aria-label", win.lanskapTranslate(win.lanskapTranslate("Nyalakan suara"))); body.classList.remove("sound-on"); } }); } } catch (e) {} }
  function duckMusic(on) { musicVol = on ? 0.28 : 0.6; if (bgm) { try { bgm.volume = musicVol; } catch (e) {} } }
  var videoPlaying = false;
  function soundOn(v) {
    if (win.lanskapPlatform.silentPlayback) { v = false; }
    sndOn = v; store.set("snd", v ? 1 : 0);
    var c = ac();
    if (c) { if (c.state === "suspended" && c.resume) { c.resume(); } MG.gain.setTargetAtTime(v ? 1 : 0, c.currentTime, 0.3); if (v) { startBed(); } }
    if (hasMusic) { if (v && !videoPlaying) { playMusic(); } else { try { bgm.pause(); } catch (e) {} } }
    var b = $("hud-snd"); if (b) { b.setAttribute("aria-pressed", v ? "true" : "false"); b.setAttribute("aria-label", v ? win.lanskapTranslate("Matikan suara") : win.lanskapTranslate("Nyalakan suara")); }
    if (!v) { scapeAllOff(true); }
  }
  $("hud-snd").addEventListener("click", function () { win.lanskapPlatform.guestPaused = sndOn; soundOn(!sndOn); if (sndOn) { chime(2); } });
  doc.addEventListener("visibilitychange", function () {
    if (!AC) { return; }
    if (doc.hidden) { try { AC.suspend(); } catch (e) {} if (hasMusic) { try { bgm.pause(); } catch (e2) {} } }
    else if (sndOn) { try { AC.resume(); } catch (e) {} if (hasMusic && !videoPlaying) { playMusic(); } }
  });
  setInterval(function () {
    if (!sndOn || !AC || doc.hidden) { return; }
    var h = hDisp, r = Math.random();
    if ((h > 5.4 && h < 9.4) || (h > 16.3 && h < 18.4)) { if (r < 0.14) { chirp(AMB, 0.05); } }
    else if (h > 11 && h < 15.4) { if (r < 0.03) { cicada(AMB); } }
    if (h > 18.3) { if (Math.random() < 0.3) { cricket(AMB, 0.03); } }
    if (h > 19) { if (Math.random() < 0.05) { croak(AMB, 0.06); } }
  }, 260);

  /* ================= BUNYI: LAPISAN SUARA ================= */
  var SCAPE = {};
  function scapeStart(k) {
    if (SCAPE[k] || !ac()) { return; }
    var t = AC.currentTime, o = { stops: [], tm: 0 };
    function nz(type, freq, q, vol) {
      var s = noiseSrc(), f = AC.createBiquadFilter(), g = AC.createGain();
      f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = 0.0001; g.gain.setTargetAtTime(vol, t, 0.5);
      s.connect(f); f.connect(g); g.connect(SCP); s.start();
      o.stops.push(function () { g.gain.setTargetAtTime(0.0001, AC.currentTime, 0.35); setTimeout(function () { try { s.stop(); } catch (e) {} }, 1600); });
      return { f: f, g: g };
    }
    function lfo(freq, depth, param) { var l = AC.createOscillator(), lg = AC.createGain(); l.frequency.value = freq; lg.gain.value = depth; l.connect(lg); lg.connect(param); l.start(); o.stops.push(function () { try { l.stop(AC.currentTime + 1.7); } catch (e) {} }); }
    if (k === "rain") { nz("highpass", 800, 0.5, 0.14); nz("lowpass", 1100, 0.6, 0.1); o.tm = setInterval(function () { if (Math.random() < 0.8) { noiseHit(0.02, 2200 + Math.random() * 3500, 6, 0.045, Math.random() * 0.15, "bandpass", SCP); } }, 80); }
    else if (k === "river") { var r1 = nz("bandpass", 620, 3, 0.15); lfo(0.55, 260, r1.f.frequency); var r2 = nz("bandpass", 1350, 4, 0.1); lfo(1.35, 480, r2.f.frequency); nz("lowpass", 300, 0.7, 0.07); }
    else if (k === "wind") { var w1 = nz("lowpass", 520, 1, 0.13); lfo(0.12, 320, w1.f.frequency); lfo(0.08, 0.07, w1.g.gain); o.tm = setInterval(function () { if (Math.random() < 0.45) { var f = 300 + Math.random() * 260; tone(f, 0.2, "triangle", 0.06, 0, f * 0.97, SCP); tone(f * 2.4, 0.09, "sine", 0.02, 0, 0, SCP); } }, 700); }
    else if (k === "birds") { o.tm = setInterval(function () { if (Math.random() < 0.55) { chirp(SCP, 0.07); } }, 450); }
    else if (k === "crickets") { o.tm = setInterval(function () { cricket(SCP, 0.05); if (Math.random() < 0.5) { cricket(SCP, 0.03); } }, 380); }
    else if (k === "frogs") { o.tm = setInterval(function () { if (Math.random() < 0.45) { croak(SCP, 0.11); } }, 650); }
    SCAPE[k] = o;
  }
  function scapeStop(k) { var o = SCAPE[k]; if (!o) { return; } clearInterval(o.tm); o.stops.forEach(function (f) { f(); }); delete SCAPE[k]; }
  function setScape(k, on) {
    var b = $("snd-" + k);
    if (b) { b.setAttribute("aria-pressed", on ? "true" : "false"); }
    if (on) { scapeStart(k); } else { scapeStop(k); }
    if (scene) { scene.setFx(k, on); }
    if (k === "rain") { rainOn = on; hudLast = -9; }
    duckMusic(Object.keys(SCAPE).length > 0);
  }
  function scapeAllOff() { ["rain", "river", "wind", "birds", "crickets", "frogs"].forEach(function (k) { var b = $("snd-" + k); if (SCAPE[k] || (b && b.getAttribute("aria-pressed") === "true")) { setScape(k, false); } }); }
  function initBunyi() {
    var any = 0;
    qsa(".snd").forEach(function (b) {
      var k = b.getAttribute("data-snd"), m = b.querySelector(".snd-m");
      if (!m || !clean(m.textContent)) { b.style.display = "none"; b.classList.remove("rv"); return; }
      any++;
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") !== "true";
        if (on && !sndOn) { soundOn(true); }
        setScape(k, on);
        if (on) { toast(b.querySelector("b").textContent + " menyala — lihat lembahnya."); }
      });
    });
    if (!any) { hideSec("bunyi"); return; }
    $("snd-stop").addEventListener("click", function () { scapeAllOff(); tock(); });
  }

  /* ================= SAMPUL & HERO ================= */
  var guestName = txt("guest-name");
  body.classList.toggle("has-guest", guestName !== "");
  if (guestName) { setText("rsvp-hi-name", guestName + "?"); setText("close-bye-n", guestName + "."); } else { hide($("close-bye-n")); setText("close-bye-a", win.lanskapTranslate("Sampai jumpa di lembah.")); }
  var dateStr = fmtDate(EV1.d);
  setText("cv-date", dateStr ? dateStr.toUpperCase() : "");
  setText("hero-date", dateStr);
  setText("hero-time", fmtHM(EV1.s) + " " + TZ.l);
  if (!txt("cv-line")) { hide($("cv-line")); }
  if (!txt("hero-line")) { hide($("hero-line")); }
  if (!txt("hero-venue-t")) { hide($("hero-venue")); }
  $("hero-cue").addEventListener("click", function () { var n = SECS[1]; if (n) { goSection(n.getAttribute("data-section")); } });

  /* ================= SALAM ================= */
  function initSalam() {
    ["salam-greet", "salam-ar", "salam-verse", "salam-src", "salam-invite"].forEach(function (id) { if (!clean($(id).textContent)) { hide($(id)); } });
    if (!txt("salam-ar") && !txt("salam-verse")) { hide($("salam-rule")); }
    var svg = $("web-svg"), cx = 80, cy = 80, spokes = 9, rings = 5, pts = [], i, k;
    for (i = 0; i < spokes; i++) { var a = i / spokes * Math.PI * 2 + 0.2; sv("path", { d: "M" + cx + " " + cy + "L" + (cx + Math.cos(a) * 78).toFixed(1) + " " + (cy + Math.sin(a) * 78).toFixed(1), "class": "web-l" }, svg); }
    for (k = 1; k <= rings; k++) {
      var d = "", r = k * 14 + 4;
      for (i = 0; i <= spokes; i++) { var a2 = i / spokes * Math.PI * 2 + 0.2, rr = r * (0.92 + 0.08 * Math.sin(i * 1.7 + k)), x = cx + Math.cos(a2) * rr, y = cy + Math.sin(a2) * rr; d += (i ? "Q" + (cx + Math.cos(a2 - 0.35) * rr * 0.9).toFixed(1) + " " + (cy + Math.sin(a2 - 0.35) * rr * 0.9).toFixed(1) + " " : "M") + x.toFixed(1) + " " + y.toFixed(1); if (i < spokes && (i + k) % 2 === 0) { pts.push([x, y]); } }
      sv("path", { d: d, "class": "web-l" }, svg);
    }
    var drops = [];
    function addDrop(p, j) { var c = sv("circle", { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: (1.6 + (j % 3) * 0.7).toFixed(1), "class": "dew" }, svg); c.style.animationDelay = (-(j * 0.37) % 3.2).toFixed(2) + "s"; drops.push(c); return c; }
    pts.forEach(addDrop);
    $("web").addEventListener("click", function () {
      var w = $("web"); w.classList.remove("shake"); void w.offsetWidth; w.classList.add("shake");
      drops.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 3).forEach(function (c, j) {
        setTimeout(function () { c.classList.add("dew-fall"); plink(); setTimeout(function () { c.classList.remove("dew-fall"); c.style.opacity = "0"; setTimeout(function () { c.style.opacity = ""; }, 2400); }, 1150); }, j * 220);
      });
    });
  }

  /* ================= MEMPELAI ================= */
  var ovTimer = 0;
  function previewHour(h, msg) {
    clearTimeout(ovTimer);
    setOverride({ h: clamp(h, 4.5, 22.6), gh: null, rate: 2.2, sy: win.pageYOffset, cancel: 150 });
    toast(msg);
    ovTimer = setTimeout(function () { if (OV && OV.cancel) { setOverride(null); } }, 6500);
  }
  function buildWreath(box, k, who) {
    var s = sv("svg", { viewBox: "0 0 276 292", "aria-hidden": "true" }, box), g = sv("g", { "class": "wreath-f" }, s);
    g.style.setProperty("--o", 1);
    var pts = [], i, cx = 138, cy = 138, r = 110;
    for (i = 0; i <= 12; i++) { var a = Math.PI + i / 12 * Math.PI; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.02, a]); }
    [[29, 176], [26, 214], [30, 250], [247, 176], [250, 214], [246, 250]].forEach(function (p) { pts.push([p[0], p[1], p[0] < 138 ? Math.PI : 0]); });
    var leafC = ["#5f8f45", "#7aa75a", "#4c7a3a"];
    pts.forEach(function (p, j) {
      var la = p[2] + (j % 2 ? 0.6 : -0.6);
      sv("ellipse", { cx: (p[0] + Math.cos(la) * 12).toFixed(1), cy: (p[1] + Math.sin(la) * 12).toFixed(1), rx: "11", ry: "4.2", transform: "rotate(" + (la * 180 / Math.PI).toFixed(0) + " " + (p[0] + Math.cos(la) * 12).toFixed(1) + " " + (p[1] + Math.sin(la) * 12).toFixed(1) + ")", fill: leafC[j % 3] }, g);
    });
    pts.forEach(function (p, j) {
      if (j % 2 && j < 13) { return; }
      var sc = j === 6 ? 0.42 : (j % 3 === 0 ? 0.32 : 0.26), w = sv("g", { transform: "translate(" + p[0].toFixed(1) + " " + p[1].toFixed(1) + ") scale(" + sc + ")" }, g);
      flowerG(k, w, 1);
    });
    return g;
  }
  function arcPath(cx, cy, r, a0, a1) { var large = Math.abs(a1 - a0) > Math.PI ? 1 : 0, sw = a1 > a0 ? 1 : 0; return "M" + (cx + Math.cos(a0) * r).toFixed(2) + " " + (cy + Math.sin(a0) * r).toFixed(2) + "A" + r + " " + r + " 0 " + large + " " + sw + " " + (cx + Math.cos(a1) * r).toFixed(2) + " " + (cy + Math.sin(a1) * r).toFixed(2); }
  function ang(h) { return ((h - 12) / 24) * Math.PI * 2 - Math.PI / 2; }
  function initMempelai() {
    var times = { b: hm(txt("pv-bbloom")), g: hm(txt("pv-gbloom")) }, meet = hm(txt("pv-meet"));
    if (times.b == null) { times.b = 21.5; }
    if (times.g == null) { times.g = 5.25; }
    ["b", "g"].forEach(function (w) {
      var pf = $("pf-" + w), img = $("pf-" + w + "-img"), src = img ? clean(img.getAttribute("src")) : "", nm = w === "b" ? BR : GR;
      if (!src) { pf.classList.add("no-photo"); } else { img.addEventListener("error", function () { pf.classList.add("no-photo"); }); }
      setText("pf-" + w + "-ini", nm.charAt(0).toUpperCase());
      var h = times[w], f = nearestFl(h);
      setText("pf-" + w + "-when", "mekar pukul " + fmtHM(h)); setText("pf-" + w + "-fl", f.n.toLowerCase());
      var wr = buildWreath($("pf-" + w + "-wreath"), f.k, w);
      if (!txt("pf-" + w + "-parents")) { hide($("pf-" + w + "-par")); }
      if (!txt("pf-" + w + "-note")) { hide($("pf-" + w + "-note")); }
      if (!txt("pf-" + w + "-full")) { hide($("pf-" + w + "-full")); }
      var ig = txt("pf-" + w + "-ig-t"), a = $("pf-" + w + "-ig");
      if (!ig) { hide(a); } else { var handle = ig.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/[/?#].*$/, ""); a.href = "https://instagram.com/" + encodeURIComponent(handle); setText("pf-" + w + "-ig-t", "@" + handle); }
      setText("pf-" + w + "-see-t", "Lihat lembah pukul " + fmtHM(h));
      $("pf-" + w + "-see").addEventListener("click", function () { tock(); previewHour(h, "Lembah pukul " + fmtHM(h) + " — jam mekar " + nm + "."); });
      var open = true;
      $("pf-" + w + "-frame").addEventListener("click", function () {
        var fr = this; open = !open; setOpen(wr, open ? 1 : 0.15);
        fr.classList.remove("pop"); void fr.offsetWidth; fr.classList.add("pop");
        if (open) { chime(2); } else { pop(); }
      });
    });
    var svg = $("meet-svg"), cx = 100, cy = 100, R = 76;
    sv("circle", { cx: cx, cy: cy, r: R, "class": "mt-ring" }, svg);
    for (var i = 0; i < 24; i++) { var a = ang(i), r1 = R + 9, r2 = R + (i % 6 === 0 ? 15 : 12); sv("line", { x1: (cx + Math.cos(a) * r1).toFixed(1), y1: (cy + Math.sin(a) * r1).toFixed(1), x2: (cx + Math.cos(a) * r2).toFixed(1), y2: (cy + Math.sin(a) * r2).toFixed(1), "class": "mt-tick" }, svg); }
    [[0, "00"], [6, "06"], [12, "12"], [18, "18"]].forEach(function (p) { var a = ang(p[0]); var tx = sv("text", { x: (cx + Math.cos(a) * (R + 24)).toFixed(1), y: (cy + Math.sin(a) * (R + 24) + 3).toFixed(1), "text-anchor": "middle", "class": "mt-lbl" }, svg); tx.textContent = p[1]; });
    var m = meet == null ? 17.5 : meet;
    function span(h0, h1, col) { var a0 = ang(h0), a1 = ang(h1); if (a1 < a0) { a1 += Math.PI * 2; } if (a1 - a0 > Math.PI * 1.9) { return; } sv("path", { d: arcPath(cx, cy, R, a0, a1), stroke: col, "class": "mt-arc", opacity: ".85" }, svg); }
    span(times.g, m, "#e8b34a");
    span(m, times.b + (times.b < m ? 24 : 0), "#7b86c9");
    function marker(h, fill, label) { var a = ang(h), x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R; sv("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: "9", fill: fill, "class": "mt-dot" }, svg); var t = sv("text", { x: x.toFixed(1), y: (y + 3.2).toFixed(1), "text-anchor": "middle", "class": "mt-lbl", fill: "#fff", style: "fill:#fff;font-size:8px" }, svg); t.textContent = label; }
    marker(times.g, "#d99b2b", GR.charAt(0).toUpperCase());
    marker(times.b, "#5b67b0", BR.charAt(0).toUpperCase());
    var ma = ang(m), hx = cx + Math.cos(ma) * R, hy = cy + Math.sin(ma) * R, hg = sv("g", { transform: "translate(" + hx.toFixed(1) + " " + hy.toFixed(1) + ")" }, svg);
    sv("circle", { r: "13", fill: "var(--paper)", stroke: "var(--line)" }, hg);
    sv("path", { d: "M0 6.5S-7.5 2-7.5-2.4A3.9 3.9 0 0 1 0-4.7a3.9 3.9 0 0 1 7.5 2.3C7.5 2 0 6.5 0 6.5z", "class": "mt-heart" }, hg);
    var inner = sv("g", {}, svg);
    var f1 = sv("g", { transform: "translate(" + (cx - 20) + " " + (cy - 4) + ") scale(.3)" }, inner); flowerG(nearestFl(times.g).k, f1, 1);
    var f2 = sv("g", { transform: "translate(" + (cx + 20) + " " + (cy - 4) + ") scale(.3)" }, inner); flowerG(nearestFl(times.b).k, f2, 1);
    var cap = sv("text", { x: cx, y: cy + 26, "text-anchor": "middle", "class": "mt-lbl" }, inner); cap.textContent = win.lanskapTranslate("24 jam");
    setText("meet-time", fmtHM(m));
    if (!txt("meet-note")) { hide($("meet-note")); }
  }

  /* ================= KISAH: DARI SEMAI KE PANEN ================= */
  function riceArt(box, stage) {
    var s = sv("svg", { viewBox: "0 0 70 88", "aria-hidden": "true" }, box);
    sv("path", { d: "M2 74c10-3 20 3 33 0s22-3 33 0", fill: "none", stroke: stage < 2 ? "#7fa7c9" : "#8a7a52", "stroke-width": "2", "stroke-linecap": "round", opacity: ".7" }, s);
    if (stage < 2) { sv("path", { d: "M8 80c9-2 17 2 27 0s18-2 27 0", fill: "none", stroke: "#a9c6de", "stroke-width": "1.4", "stroke-linecap": "round", opacity: ".6" }, s); }
    var gr = sv("g", { "class": "grow" }, s), g = sv("g", { "class": "rice-g" }, gr);
    var green = ["#7cb85a", "#5f9e3f", "#4e8a34", "#c9ae45"][stage], n = [3, 5, 7, 7][stage], hmax = [22, 36, 54, 52][stage];
    for (var i = 0; i < n; i++) {
      var off = (i - (n - 1) / 2) * 4.2, h = hmax * (0.75 + ((i * 37) % 10) / 40), lean = off * 0.9 + (stage === 3 ? 6 : 0);
      sv("path", { d: "M" + (35 + off * 0.4).toFixed(1) + " 74Q" + (35 + off * 0.5).toFixed(1) + " " + (74 - h * 0.6).toFixed(1) + " " + (35 + lean).toFixed(1) + " " + (74 - h).toFixed(1), fill: "none", stroke: green, "stroke-width": stage ? "2.2" : "2", "stroke-linecap": "round" }, g);
    }
    if (stage >= 2) {
      var gold = stage === 3 ? "#e0b84a" : "#b9c95a";
      for (var p = 0; p < (stage === 3 ? 3 : 2); p++) {
        var bx = 35 + (p - 1) * 9, by = 74 - hmax * (stage === 3 ? 0.9 : 1.02), ex = bx + (stage === 3 ? 14 : 4), ey = by + (stage === 3 ? 14 : -6);
        sv("path", { d: "M" + bx + " " + by + "Q" + (bx + 8) + " " + (by - 6) + " " + ex + " " + ey, fill: "none", stroke: gold, "stroke-width": "1.6", "stroke-linecap": "round" }, g);
        for (var q = 1; q < 6; q++) { var tt = q / 6, gx = (1 - tt) * (1 - tt) * bx + 2 * (1 - tt) * tt * (bx + 8) + tt * tt * ex, gy = (1 - tt) * (1 - tt) * by + 2 * (1 - tt) * tt * (by - 6) + tt * tt * ey; sv("ellipse", { cx: gx.toFixed(1), cy: gy.toFixed(1), rx: "2.1", ry: "1.3", fill: gold, transform: "rotate(" + (30 + q * 8) + " " + gx.toFixed(1) + " " + gy.toFixed(1) + ")" }, g); }
      }
    }
    return s;
  }
  function initKisah() {
    var items = [];
    for (var i = 1; i <= win.lanskapPlatform.story.length; i++) {
      var t = txt("ks-" + i + "-t"), d = txt("ks-" + i + "-d"), x = mtx("ks-" + i + "-x"), p = $("ks-" + i + "-p"), ps = p ? clean(p.getAttribute("src")) : "";
      if (t || x) { items.push({ t: t, d: d, x: x, p: ps }); }
    }
    if (!items.length) { hideSec("kisah"); return; }
    if (!txt("kisah-intro")) { hide($("kisah-intro")); }
    var ol = $("plots"), names = [win.lanskapTranslate("Musim Semai"), win.lanskapTranslate("Musim Tanam"), win.lanskapTranslate("Musim Rawat"), win.lanskapTranslate("Musim Menguning")], n = items.length;
    items.forEach(function (it, i) {
      var stage = n > 1 ? Math.round(i * 3 / (n - 1)) : 0, li = el("li", "plot", ol), art = el("div", "plot-art", li);
      li.dataset.itemId = win.lanskapPlatform.story[i].id; riceArt(art, stage); el("span", "plot-stage", art, names[stage]);
      var b = el("div", "plot-body", li);
      if (it.d) { el("p", "plot-date", b, it.d); }
      if (it.t) { el("h3", "plot-t", b, it.t); }
      if (it.x) { el("p", "plot-x", b, it.x); }
      if (it.p) { var ph = el("div", "plot-ph", b), im = el("img", "", ph); im.alt = it.t || "Kenangan"; im.loading = "lazy"; im.src = it.p; im.addEventListener("error", function () { ph.style.display = "none"; }); }
    });
    var hs = $("harvest-svg"), g = sv("g", { "class": "rice-g" }, hs);
    for (var k = 0; k < 9; k++) { var a = -0.55 + k * 0.14, len = 70 + (k % 3) * 6; sv("path", { d: "M60 104L" + (60 + Math.sin(a) * len).toFixed(1) + " " + (104 - Math.cos(a) * len).toFixed(1), stroke: k % 2 ? "#d9b24a" : "#c49a36", "stroke-width": "2.2", "stroke-linecap": "round" }, g); for (var q = 0; q < 5; q++) { var tt = 0.62 + q * 0.08, gx = 60 + Math.sin(a) * len * tt + Math.cos(a) * 3, gy = 104 - Math.cos(a) * len * tt; sv("ellipse", { cx: gx.toFixed(1), cy: gy.toFixed(1), rx: "2.6", ry: "1.5", fill: "#e9c45a", transform: "rotate(" + (a * 57 + 60) + " " + gx.toFixed(1) + " " + gy.toFixed(1) + ")" }, g); } }
    sv("path", { d: "M44 78c8 5 24 5 32 0l-2 9c-8 4-20 4-28 0z", fill: "#b24a3a" }, hs);
    sv("path", { d: "M60 82c-10 4-18 14-20 22M60 82c10 4 18 14 20 22", fill: "none", stroke: "#b24a3a", "stroke-width": "3", "stroke-linecap": "round" }, hs);
    setText("harvest-date", dateStr || "hari pernikahan kami");
    $("harvest-go").onclick = function () { tock(); goSection(isShown(secEl("acara")) ? "acara" : "menanti"); };
  }

  /* ================= JAM BUNGA ================= */
  var dialH = 9, dialFl = [], dialHand = null, dialTip = null, playing = 0, dialHeld = false;
  function initJamBunga() {
    var svg = $("dial"), i;
    if (!svg) { return; }
    sv("circle", { r: "152", "class": "d-face" }, svg);
    for (i = 0; i < 48; i++) {
      var h0 = i / 2, h1 = (i + 1) / 2, hc = clamp(h0 + 0.25, 4.4, 22.6);
      if (h0 + 0.25 < 4.4 || h0 + 0.25 > 22.6) { hc = 22.6; }
      sv("path", { d: arcPath(0, 0, 134, ang(h0), ang(h1) + 0.01), stroke: skyCss(hc, 2), "class": "d-ring" }, svg);
    }
    for (i = 0; i < 24; i++) { var a = ang(i), maj = i % 3 === 0; sv("line", { x1: (Math.cos(a) * 118).toFixed(1), y1: (Math.sin(a) * 118).toFixed(1), x2: (Math.cos(a) * (maj ? 108 : 112)).toFixed(1), y2: (Math.sin(a) * (maj ? 108 : 112)).toFixed(1), "class": "d-tick" + (maj ? " maj" : "") }, svg); if (maj) { var tn = sv("text", { x: (Math.cos(a) * 98).toFixed(1), y: (Math.sin(a) * 98).toFixed(1), "class": "d-num" }, svg); tn.textContent = pad2(i); } }
    FL.forEach(function (f) {
      var a = ang(f.h), x = Math.cos(a) * 134, y = Math.sin(a) * 134, w = sv("g", { transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")", "class": "d-fl" }, svg);
      sv("circle", { r: "17", fill: "var(--paper)", stroke: "var(--line)" }, w);
      var fg = sv("g", { transform: "scale(.3)" }, w), gg = flowerG(f.k, fg, 1);
      dialFl.push({ f: f, g: gg });
      w.addEventListener("click", function (e) { e.stopPropagation(); dialTo(f.h + 0.3, true); tock(); });
    });
    dialHand = sv("g", {}, svg);
    sv("line", { x1: "0", y1: "0", x2: "0", y2: "-86", "class": "d-hand" }, dialHand);
    dialTip = sv("circle", { cx: "0", cy: "-90", r: "11", fill: "#ffd27a", "class": "d-tip" }, dialHand);
    sv("circle", { r: "6", "class": "d-hub" }, svg);
    var list = $("flist");
    FL.forEach(function (f) {
      var li = el("li", "", list), b = el("button", "fr", li); b.type = "button";
      el("span", "fr-h", b, pad2(f.h) + ".00");
      var ic = el("span", "fr-ic", b), s = sv("svg", { viewBox: "-50 -50 100 100", "aria-hidden": "true" }, ic), gg = flowerG(f.k, s, 1);
      var tx = el("span", "fr-x", b); el("span", "fr-n", tx, f.n); el("span", "fr-f", tx, f.f);
      f._row = b; f._ic = gg;
      b.addEventListener("click", function () { tock(); dialTo(f.h + 0.3, true); });
    });
    function fromEvent(e) { var r = svg.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2), a = Math.atan2(y, x), h = ((a + Math.PI / 2) / (Math.PI * 2)) * 24 + 12; h = ((h % 24) + 24) % 24; if (h > 22.6) { h = 22.6; } if (h < 4.4) { h = h < 1.6 ? 22.6 : 4.4; } return h; }
    svg.addEventListener("pointerdown", function (e) { if (e.target.closest && e.target.closest(".d-fl")) { return; } dialHeld = true; stopPlay(); try { svg.setPointerCapture(e.pointerId); } catch (x) {} dialTo(fromEvent(e), true); });
    svg.addEventListener("pointermove", function (e) { if (dialHeld) { dialTo(fromEvent(e), true); } });
    function up() { dialHeld = false; }
    svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
    svg.addEventListener("keydown", function (e) { if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); dialTo(Math.min(22.6, dialH + 0.25), true); } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); dialTo(Math.max(4.4, dialH - 0.25), true); } });
    $("dial-play").addEventListener("click", function () { if (playing) { stopPlay(); } else { startPlay(); } });
    $("dial-reset").addEventListener("click", function () { tock(); stopPlay(); setOverride(null); dialFollow = true; toast(win.lanskapTranslate("Lembah kembali mengikuti guliranmu.")); });
    var mine = [];
    function openNames(h) { var o = FL.filter(function (f) { return isOpen(f, h); }).sort(function (a, b) { return b.o[0] - a.o[0]; }).slice(0, 2).map(function (f) { return f.n.toLowerCase(); }); return o.length ? o.join(" dan ") : bloomAt(h).n.toLowerCase(); }
    if (EV1.s != null) { mine.push(["fc-akad", EV1.name + " kami pukul <b>" + fmtHM(EV1.s) + "</b> — saat " + openNames(EV1.s) + " sedang mekar."]); }
    if (EV2.name && EV2.s != null) { mine.push(["fc-res", EV2.name + " pukul <b>" + fmtHM(EV2.s) + "</b> — saat " + bloomAt(EV2.s).n.toLowerCase() + " mulai harum."]); }
    mine.forEach(function (m) { var p = $(m[0]); p.textContent = ""; var parts = m[1].split(/<b>|<\/b>/); p.appendChild(doc.createTextNode(parts[0])); el("b", "", p, parts[1]); p.appendChild(doc.createTextNode(parts[2])); });
    function nowLine() { var d = new Date(), h = d.getHours() + d.getMinutes() / 60, f = bloomAt(h < 4.4 || h > 23.9 ? 22 : h), p = $("fc-now"); p.textContent = ""; p.appendChild(doc.createTextNode("Di tempatmu sekarang pukul ")); el("b", "", p, fmtHM(h)); p.appendChild(doc.createTextNode(" — yang sedang mekar: " + f.n.toLowerCase() + ".")); }
    nowLine(); setInterval(nowLine, 60000);
    if (!txt("jambunga-intro")) { hide($("jambunga-intro")); }
    if (!txt("jambunga-note")) { hide($("jambunga-note")); }
    dialTo(secH.jambunga || 9, false);
  }
  var dialFollow = true;
  function dialTo(h, user) {
    dialH = h;
    if (dialHand) { dialHand.setAttribute("transform", "rotate(" + ((h - 12) * 15).toFixed(2) + ")"); }
    var night = h > 18.4 || h < 5.6;
    if (dialTip) { dialTip.setAttribute("fill", night ? "#eef0ff" : h < 6.6 || h > 17.4 ? "#ffb070" : "#ffd27a"); }
    var op = LAND.flowers(h);
    dialFl.forEach(function (d) { setOpen(d.g, (0.12 + 0.88 * (op[d.f.k] || 0)).toFixed(2)); });
    FL.forEach(function (f) { if (f._ic) { setOpen(f._ic, (0.12 + 0.88 * (op[f.k] || 0)).toFixed(2)); } if (f._row) { f._row.classList.toggle("is-now", bloomAt(h) === f); } });
    setText("dial-time", fmtHM(h));
    var opening = null; FL.forEach(function (f) { if (h >= f.o[0] - 0.05 && h < f.o[0] + 0.6) { opening = f; } });
    setText("dial-what", opening ? opening.n.toLowerCase() + " mulai mekar" : "mekar: " + bloomAt(h).n.toLowerCase());
    var d = $("dial"); if (d) { d.setAttribute("aria-valuenow", h.toFixed(1)); d.setAttribute("aria-valuetext", "pukul " + fmtHM(h)); }
    if (user) { dialFollow = false; setOverride({ h: h, gh: h, rate: 5, sy: win.pageYOffset, cancel: 260 }); }
  }
  function startPlay() {
    var sec = $("sec-jambunga"), t0p = 0, dur = reduce ? 1 : 15000;
    stopPlay(); sec.classList.add("is-playing"); setText("dial-play-t", win.lanskapTranslate("Hentikan")); $("dial-play").querySelector("use").setAttribute("href", "#i-pause");
    chime(1);
    function step(now) { if (!playing) { return; } if (!t0p) { t0p = now; } var k = c01((now - t0p) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, h = lerp(4.6, 22.5, e); dialTo(h, false); setOverride({ h: h, gh: h, rate: 14 }); if (k < 1) { playing = win.requestAnimationFrame(step); } else { playing = 0; setTimeout(function () { stopPlay(); setOverride({ h: 22.5, gh: 22.5, rate: 3, sy: win.pageYOffset, cancel: 200 }); }, 300); } }
    playing = win.requestAnimationFrame(step);
  }
  function stopPlay() { if (playing) { win.cancelAnimationFrame(playing); } playing = 0; var sec = $("sec-jambunga"); if (sec) { sec.classList.remove("is-playing"); } setText("dial-play-t", win.lanskapTranslate("Putar sehari")); var u = $("dial-play") && $("dial-play").querySelector("use"); if (u) { u.setAttribute("href", "#i-play"); } }

  /* ================= MENANTI ================= */
  var menantiTimer = 0;
  function initMenanti() {
    clearInterval(menantiTimer);
    var target = absT(EV1.d, EV1.s), sec = $("sec-menanti");
    if (target == null) { hideSec("menanti"); return; }
    var last = {};
    function put(id, v) { var e = $(id); if (!e || last[id] === v) { return; } last[id] = v; e.textContent = v; e.classList.remove("tick"); void e.offsetWidth; e.classList.add("tick"); }
    function daysLeft() { var now = new Date(Date.now() + TZ.o * 3600000), today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()), wd = Date.UTC(EV1.d.y, EV1.d.m - 1, EV1.d.d); return Math.round((wd - today) / 864e5); }
    var built = -1;
    function tiles(n) {
      if (built === n) { return; } built = n;
      var box = $("dawns"); box.textContent = "";
      var show = Math.min(n, 119);
      for (var i = 0; i < show; i++) { var d = el("span", "dw", box); d.style.opacity = (0.55 + 0.45 * (i / Math.max(1, show))).toFixed(2); }
      if (n > 119) { el("span", "dw more", box, "+" + (n - 119)); }
      el("span", "dw wd", box);
      setText("dawns-cap", n > 0 ? win.lanskapTranslate("setiap kotak adalah satu fajar — yang berkilau di ujung adalah hari kami") : "");
    }
    function upd() {
      target = absT(EV1.d, EV1.s);
      var now = Date.now(), diff = target - now, dl = daysLeft();
      if (dl > 0) { setText("menanti-pre", win.lanskapTranslate("Tinggal")); setText("menanti-n", String(dl)); setText("menanti-post", win.lanskapTranslate("Fajar Lagi")); }
      else if (dl === 0) { setText("menanti-pre", ""); setText("menanti-n", ""); setText("menanti-post", diff > 0 ? win.lanskapTranslate("Hari Ini Harinya") : win.lanskapTranslate("Hari Ini, Kami Menikah")); }
      else { setText("menanti-pre", ""); setText("menanti-n", ""); setText("menanti-post", win.lanskapTranslate("Kami Sudah Menikah")); }
      sec.classList.toggle("is-today", dl === 0 && diff <= 0); sec.classList.toggle("is-past", dl < 0);
      if (dl < 0) { setText("menanti-done", "Kami menikah pada " + dateStr + ". Terima kasih sudah menemani fajar-fajar sebelumnya."); }
      tiles(Math.max(0, dl));
      if (diff > 0) { var s = Math.floor(diff / 1000); put("cd-d-v", pad2(Math.floor(s / 86400))); put("cd-h-v", pad2(Math.floor(s % 86400 / 3600))); put("cd-m-v", pad2(Math.floor(s % 3600 / 60))); put("cd-s-v", pad2(s % 60)); }
    }
    upd(); menantiTimer = setInterval(upd, 1000);
    if (!txt("menanti-kick")) { hide($("menanti-kick")); }
    $("cal-g").href = gcal(EV1.name, EV1.d, EV1.s, EV1.e, EV1.venue, EV1.addr);
    $("cal-ics").onclick = function () { tock(); downloadIcs(); };
  }
  function downloadIcs() {
    function f(t) { return new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
    function ev(uid, name, o, s, e, venue, addr) { var st = absT(o, s), en = absT(o, e != null ? e : s + 2); if (st == null) { return ""; } if (en <= st) { en = st + 7200000; } return "BEGIN:VEVENT\r\nUID:" + uid + "\r\nDTSTAMP:" + f(Date.now()) + "\r\nDTSTART:" + f(st) + "\r\nDTEND:" + f(en) + "\r\nSUMMARY:" + name + " · " + BR + " & " + GR + "\r\nLOCATION:" + [venue, addr].filter(Boolean).join(", ").replace(/,/g, "\\,") + "\r\nDESCRIPTION:" + win.lanskapText("calendarFarewell") + " " + BR + " & " + GR + "\r\nBEGIN:VALARM\r\nTRIGGER:-P1D\r\nACTION:DISPLAY\r\nDESCRIPTION:" + win.lanskapText("calendarTomorrow") + " " + name + "\r\nEND:VALARM\r\nEND:VEVENT\r\n"; }
    var ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lanskap yang Hidup//ID\r\nCALSCALE:GREGORIAN\r\n" + ev("ev1-" + hashStr(BR + GR) + "@lembah", EV1.name, EV1.d, EV1.s, EV1.e, EV1.venue, EV1.addr) + (EV2.name && EV2.s != null ? ev("ev2-" + hashStr(GR + BR) + "@lembah", EV2.name, EV2.d, EV2.s, EV2.e, EV2.venue, EV2.addr) : "") + "END:VCALENDAR\r\n";
    try { var a = doc.createElement("a"); a.id = mkId("ics"); a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics); a.download = "pernikahan-" + (BR + "-" + GR).toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".ics"; body.appendChild(a); a.click(); body.removeChild(a); toast("Berkas kalender diunduh."); } catch (e) { toast("Unduhan tidak didukung di sini."); }
  }

  /* ================= ACARA ================= */
  var thumbs = [];
  function initAcara() {
    function fill(n, E, show) {
      if (!show) { $("ev-" + n).style.display = "none"; return; }
      setText("ev-" + n + "-date", fmtDate(E.d)); setText("ev-" + n + "-time", timeRange(E.s, E.e));
      ["venue", "addr", "note"].forEach(function (k) { if (!txt("ev-" + n + "-" + k)) { hide($("ev-" + n + "-" + k)); } });
      $("ev-" + n + "-map").href = mapLink(E.venue, E.addr);
      $("ev-" + n + "-cal").href = gcal(E.name, E.d, E.s, E.e, E.venue, E.addr);
      var f = bloomAt(E.s == null ? 12 : E.s); setText("ev-" + n + "-bloom", "pukul " + fmtHM(E.s) + " · " + f.n.toLowerCase() + " mekar");
      thumbs.push({ cv: $("ev-" + n + "-cv"), h: clamp(E.s == null ? 12 : E.s, 4.6, 22.5), done: 0 });
    }
    fill(1, EV1, true);
    fill(2, EV2, !!EV2.name);
    if (!EV2.name) { setText("ev-1-no", win.lanskapTranslate("Acara")); }
  }
  function drawThumbs(force) {
    thumbs.forEach(function (t) {
      var w = t.cv.clientWidth, h = t.cv.clientHeight;
      if (!w || !h || (!force && t.done === w)) { return; }
      t.done = w;
      try { var sc = t.sc || (t.sc = new LAND.Scene(t.cv, { thumb: true })); sc.resize(w, h, Math.min(win.devicePixelRatio || 1, 2)); for (var i = 0; i < 2; i++) { sc.draw({ h: t.h, gh: 22.6, time: 9.3 + i * 0.1, dt: 0.05, wind: 0.3, pan: 0 }); } } catch (e) {}
    });
  }

  /* ================= SUSUNAN ACARA ================= */
  var rdItems = [], rdTimer = 0;
  function initSusunan() {
    var items = [];
    try { items = JSON.parse(($("wedivo-rundown-data") || {}).textContent || "[]"); } catch (e) { items = []; }
    if (!Array.isArray(items) || !items.length) { hideSec("susunan"); return; }
    if (!txt("susunan-intro")) { hide($("susunan-intro")); }
    var box = $("stalk"), dates = [], list = null, lastD = null;
    items.forEach(function (it) { if (dates.indexOf(it.date) < 0) { dates.push(it.date); } });
    items.forEach(function (it, i) {
      if (it.date !== lastD || !list) {
        lastD = it.date;
        if (dates.length > 1) { el("h3", "st-day rv", box, fmtDate(ymd(it.date))); }
        list = el("ol", "st-list", box);
      }
      var li = el("li", "st-it rv", list), s = hm(it.startTime), e = hm(it.endTime), f = it.isAllDay ? flByKey("matahari") : bloomAt(s == null ? 12 : s);
      var node = el("span", "st-node", li); flowerSVG(f.k, node, 1);
      var b = el("div", "st-b", li);
      el("p", "st-time", b, it.isAllDay ? "Sepanjang hari" : (fmtHM(s) + (e != null ? " – " + fmtHM(e) : "") + " " + TZ.l));
      el("p", "st-t", b, clean(it.title) || win.lanskapTranslate("Acara"));
      if (clean(it.location)) { el("p", "st-loc", b, clean(it.location)); }
      if (clean(it.description)) { el("p", "st-d", b, cleanML(it.description)); }
      li.dataset.itemId = it.id; li.style.setProperty("--d", ((i % 4) * 0.07).toFixed(2) + "s");
      rdItems.push({ li: li, d: ymd(it.date), s: it.isAllDay ? 0 : s, e: it.isAllDay ? 24 : (e != null ? e : (s != null ? s + 1 : 24)) });
    });
    function now() { var t = Date.now(); rdItems.forEach(function (r) { var a = absT(r.d, r.s || 0), b = absT(r.d, r.e); if (a == null) { return; } r.li.classList.toggle("is-now", t >= a && t < b); r.li.classList.toggle("is-past", t >= b); }); }
    now(); clearInterval(rdTimer); rdTimer = setInterval(now, 30000);
  }

  /* ================= LOKASI ================= */
  function initLokasi() {
    if (!txt("loc-addr")) { hide($("loc-addr")); }
    if (!txt("loc-note")) { hide($("loc-note")); }
    $("loc-map").href = mapLink(txt("loc-name"), txt("loc-addr"));
    $("loc-copy").addEventListener("click", function () { tock(); copyText([txt("loc-name"), txt("loc-addr")].filter(Boolean).join(", "), win.lanskapTranslate("Alamat disalin.")); });
    if (MKEY && PLACE) { var fr = $("gmap"); fr.src = fr.getAttribute("data-src"); $("map-box").classList.add("has-embed"); }
    var s = $("vmap");
    sv("rect", { width: "340", height: "250", fill: "#efe6cc" }, s);
    for (var i = 0; i < 7; i++) { sv("path", { d: "M-10 " + (26 + i * 13) + "C60 " + (14 + i * 13) + " 110 " + (40 + i * 12) + " 150 " + (30 + i * 13), fill: "none", stroke: i % 2 ? "#b9cf8c" : "#a7c47a", "stroke-width": "11", opacity: ".75" }, s); }
    sv("path", { d: "M-10 150C40 138 70 170 120 160S190 118 230 128 300 176 350 160", fill: "none", stroke: "#8fb9d6", "stroke-width": "13", "stroke-linecap": "round", opacity: ".85" }, s);
    sv("path", { d: "M-10 150C40 138 70 170 120 160S190 118 230 128 300 176 350 160", fill: "none", stroke: "#dff0fb", "stroke-width": "2", "stroke-dasharray": "6 14", "class": "vm-wave" }, s);
    sv("ellipse", { cx: "268", cy: "62", rx: "44", ry: "22", fill: "#9cc4d8" }, s);
    sv("ellipse", { cx: "262", cy: "58", rx: "30", ry: "12", fill: "#b8d8e6" }, s);
    [[22, 196], [150, 232], [300, 214], [318, 190], [150, 30], [120, 44], [96, 206], [248, 206], [190, 226]].forEach(function (p, j) { sv("circle", { cx: p[0], cy: p[1], r: 9 + (j % 3) * 3, fill: j % 2 ? "#6f9f55" : "#5d8f47" }, s); sv("circle", { cx: p[0] - 3, cy: p[1] - 3, r: 4 + (j % 2), fill: "#8dbb66" }, s); });
    sv("path", { d: "M40 238C70 214 92 206 118 190S150 160 170 150 206 118 214 100", fill: "none", stroke: "#c9b78e", "stroke-width": "9", "stroke-linecap": "round" }, s);
    sv("path", { d: "M40 238C70 214 92 206 118 190S150 160 170 150 206 118 214 100", "class": "vm-route" }, s);
    var you = sv("g", { transform: "translate(40 236)" }, s); sv("circle", { r: "9", fill: "#c3573a", opacity: ".25", "class": "vm-you" }, you); sv("circle", { r: "4.5", fill: "#c3573a", stroke: "#fff", "stroke-width": "2" }, you);
    var yt = sv("text", { x: "52", y: "234", "font-family": "Waiting for the Sunrise, cursive", "font-size": "15", fill: "#5a4632" }, s); yt.textContent = win.lanskapTranslate("kamu di sini");
    var tree = sv("g", { transform: "translate(214 100)" }, s);
    sv("path", { d: "M0 0V-14", stroke: "#6b4f38", "stroke-width": "3" }, tree); sv("ellipse", { cx: "0", cy: "-22", rx: "24", ry: "12", fill: "#4f8a47" }, tree); sv("ellipse", { cx: "-6", cy: "-26", rx: "12", ry: "6", fill: "#6fa85d" }, tree);
    var pin = sv("g", { "class": "vm-pin" }, tree); sv("path", { d: "M0-36c-7 0-12-5-12-11s5-11 12-11 12 5 12 11-12 11-12 11z", fill: "#c3573a", transform: "translate(0 -4)" }, pin); sv("path", { d: "M0-47.5c-2-1.4-3.4-2.8-3.4-4.3a1.7 1.7 0 0 1 3.4-.8 1.7 1.7 0 0 1 3.4.8c0 1.5-1.4 2.9-3.4 4.3z", fill: "#fff" }, pin);
    var vn = txt("loc-name") || "lembah"; if (vn.length > 20) { vn = vn.slice(0, 19).replace(/\s+\S*$/, "") + "…"; }
    var vt = sv("text", { x: "194", y: "70", "text-anchor": "end", "font-family": "Waiting for the Sunrise, cursive", "font-size": "15", fill: "#5a4632" }, s); vt.textContent = vn;
    var lab = [[win.lanskapTranslate("sawah"), 30, 60], [win.lanskapTranslate("sungai"), 250, 176], [win.lanskapTranslate("telaga"), 248, 66]];
    lab.forEach(function (l) { var t = sv("text", { x: l[1], y: l[2], "font-family": "Waiting for the Sunrise, cursive", "font-size": "13", fill: "#6e5a44", opacity: ".8" }, s); t.textContent = l[0]; });
    var cp = sv("g", { transform: "translate(306 30)" }, s); sv("circle", { r: "15", fill: "none", stroke: "#8a7658", "stroke-width": "1" }, cp); sv("path", { d: "M0-13l4 13-4 13-4-13z", fill: "#c3573a" }, cp); var ct = sv("text", { x: "0", y: "-17", "text-anchor": "middle", "font-size": "8", fill: "#6e5a44", "font-family": "Fragment Mono, monospace" }, cp); ct.textContent = win.lanskapTranslate("U");
  }

  /* ================= RAMBU ================= */
  function signIcon(t) { t = t.toLowerCase(); return /parkir|mobil|motor|kendara/.test(t) ? "i-car" : /musala|musholla|mushola|salat|shalat|ibadah/.test(t) ? "i-dome" : /alas|sepatu|sandal|kaki/.test(t) ? "i-shoe" : /anak/.test(t) ? "i-child" : /hujan|cuaca|payung/.test(t) ? "i-umbrella" : /foto|ponsel|kamera|hp/.test(t) ? "i-camera" : /makan|hidang|jamuan/.test(t) ? "i-basket" : "i-leaf"; }
  function initRambu() {
    var box = $("signs"), n = 0;
    for (var i = 1; i <= 6; i++) {
      var t = txt("rb-" + i + "-t"), x = txt("rb-" + i + "-x");
      if (!t) { continue; }
      n++;
      var w = el("div", "sign rv", box), pl = el("button", "sign-plank", w); pl.type = "button";
      pl.style.setProperty("--tilt", ((hashStr(t) % 7) - 3) + "deg");
      useIc(signIcon(t), pl); el("span", "", pl, t);
      el("span", "sign-post", w);
      if (x) { el("p", "sign-x", w, x); }
      w.style.setProperty("--d", ((n - 1) % 3 * 0.08).toFixed(2) + "s");
      pl.addEventListener("click", function () { var p = this; p.classList.remove("wob"); void p.offsetWidth; p.classList.add("wob"); tock(); });
    }
    if (!n) { hideSec("rambu"); }
  }

  /* ================= BUSANA ================= */
  function initBusana() {
    var cols = [];
    for (var i = 1; i <= win.lanskapPlatform.colors.length; i++) { var c = txt("dc-" + i + "-c"), nm = txt("dc-" + i + "-n"); if (/^#?[0-9a-f]{3,8}$/i.test(c)) { cols.push({ c: c.charAt(0) === "#" ? c : "#" + c, n: nm || c }); } }
    var hasText = !!txt("busana-text");
    if (!cols.length && !hasText) { hideSec("busana"); return; }
    if (!hasText) { hide($("busana-text")); }
    if (!cols.length) { hide($("dress-stage")); hide($("swatches")); hide($("swatch-hint")); return; }
    var s = $("dress-svg");
    sv("ellipse", { cx: "130", cy: "178", rx: "118", ry: "10", fill: "rgba(80,110,60,.18)" }, s);
    for (var g2 = 0; g2 < 26; g2++) { var gx = 12 + g2 * 9.5, gh = 8 + (g2 * 7) % 9; sv("path", { d: "M" + gx + " 180q2-" + gh / 2 + " " + ((g2 % 2) ? 4 : -3) + "-" + gh, fill: "none", stroke: "#7aa35a", "stroke-width": "1.6", "stroke-linecap": "round", "class": "rice-g" }, s); }
    var fem = sv("g", { "class": "dress-fig" }, s);
    sv("path", { d: "M84 176l-14-62c-2-10 4-18 14-20h12c10 2 16 10 14 20l-14 62z", "class": "dress-fill", fill: cols[0].c }, fem);
    sv("path", { d: "M72 118c4-26 12-40 18-40s14 14 18 40c-12 6-24 6-36 0z", fill: "rgba(255,255,255,.18)" }, fem);
    sv("path", { d: "M90 30c-13 0-20 10-20 22 0 8 3 14 6 20l-8 30c14 8 30 8 44 0l-8-30c3-6 6-12 6-20 0-12-7-22-20-22z", "class": "dress-fill2", fill: "#f4ead8" }, fem);
    sv("ellipse", { cx: "90", cy: "52", rx: "11", ry: "13", fill: "#d9a47e" }, fem);
    sv("path", { d: "M78 48c2-12 22-12 24 0-4-5-20-5-24 0z", fill: "#f4ead8" }, fem);
    var mal = sv("g", { "class": "dress-fig" }, s); mal.style.animationDelay = "-2.2s";
    sv("path", { d: "M160 176l3-58h24l3 58h-11l-4-44-4 44z", fill: "#3b3a42" }, mal);
    sv("path", { d: "M152 74c6-4 14-6 23-6s17 2 23 6l4 50c-18 5-36 5-54 0z", "class": "dress-fill", fill: cols[0].c }, mal);
    for (var bt = 0; bt < 5; bt++) { sv("path", { d: "M" + (156 + bt * 8) + " " + (84 + (bt % 2) * 16) + "q4-4 8 0q-4 4-8 0z", fill: "rgba(255,255,255,.35)" }, mal); }
    sv("ellipse", { cx: "175", cy: "54", rx: "11", ry: "13", fill: "#c68b62" }, mal);
    sv("path", { d: "M163 44h24v-7c0-3-2-5-5-5h-14c-3 0-5 2-5 5z", fill: "#22222a" }, mal);
    var sw = $("swatches");
    cols.forEach(function (c, j) {
      var b = el("button", "sw rv", sw); b.type = "button"; b.style.setProperty("--d", (j * 0.07).toFixed(2) + "s");
      var cl = el("span", "sw-cloth", b); cl.style.setProperty("--c", c.c);
      el("span", "sw-n", b, c.n); el("span", "sw-h", b, c.c.toUpperCase());
      if (!j) { b.classList.add("is-on"); }
      b.addEventListener("click", function () {
        qsa(".sw", sw).forEach(function (x) { x.classList.toggle("is-on", x === b); });
        qsa(".dress-fill", s).forEach(function (p) { p.setAttribute("fill", c.c); });
        qsa(".dress-fig", s).forEach(function (f) { f.classList.remove("hop"); void f.getBoundingClientRect(); f.classList.add("hop"); });
        if (scene) { scene.wave(c.c); }
        chime(1); toast("Padang di belakang berbunga " + c.n.toLowerCase() + ".");
      });
    });
  }

  /* ================= GALERI: KOLAM KENANGAN ================= */
  var gal = win.lanskapPlatform.gallery.map(function (p) { return p.src; });
  var pondW = 0, koiRun = false, koiEls = [], galleryInitialized = false;
  function initGaleri() {
    if (!gal.length) { hideSec("galeri"); return; } if (galleryInitialized) { return; } galleryInitialized = true;
    if (!txt("galeri-intro")) { hide($("galeri-intro")); }
    layoutPond();
    var ks = $("pond-koi");
    [["#f28a3c", "#fff4e6"], ["#fff4ec", "#e25b3a"], ["#f6b046", "#2d2a2a"]].forEach(function (c, i) {
      var g = sv("g", { "class": "koi" }, ks);
      sv("path", { d: "M0 0C8-7 26-7 34-2C38 0 38 2 34 4C26 9 8 9 0 2L-10-6-9 1-11 8z", fill: c[0] }, g);
      sv("path", { d: "M14-3c4-2 9-2 12 1-4 2-8 3-12-1z", fill: c[1], opacity: ".85" }, g);
      sv("path", { d: "M10 5c3 4 5 7 4 10M18 5c2 3 3 6 2 9", fill: "none", stroke: c[0], "stroke-width": "2", "stroke-linecap": "round", opacity: ".8" }, g);
      koiEls.push({ g: g, p: i * 2.1, sp: 0.16 + i * 0.05, rx: 0.3 + i * 0.07, ry: 0.22 + i * 0.05 });
    });
    if ("IntersectionObserver" in win) { new IntersectionObserver(function (en) { en.forEach(function (x) { var was = koiRun; koiRun = x.isIntersecting && !reduce; if (koiRun && !was) { win.requestAnimationFrame(koiStep); } }); }).observe($("pond")); }
  }
  function koiStep(now) {
    if (!koiRun) { return; }
    var t = now / 1000;
    koiEls.forEach(function (k) { var a = t * k.sp + k.p, x = 200 + Math.cos(a) * 400 * k.rx, y = 200 + Math.sin(a * 1.3) * 400 * k.ry, dx = -Math.sin(a) * k.rx, dy = Math.cos(a * 1.3) * 1.3 * k.ry, rot = Math.atan2(dy, dx) * 180 / Math.PI + 180, sw = Math.sin(t * 5 + k.p) * 6; k.g.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + (rot + sw).toFixed(1) + ")"); });
    win.requestAnimationFrame(koiStep);
  }
  function layoutPond() {
    var pond = $("pond"), box = $("pond-pads"), W = pond.clientWidth;
    if (!W || W === pondW) { return; }
    pondW = W; box.textContent = "";
    var n = gal.length, cols = n === 1 ? 1 : W >= 560 && n > 4 ? 3 : 2, colW = W / cols, base = clamp(Math.min(colW * (cols === 1 ? 0.62 : 0.74), 230), 96, 230), rowH = base * 0.97, r = (function (sd) { return function () { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; }; })(97 + n), placed = [];
    var rows = Math.ceil(n / cols), H = Math.max(300, rows * rowH + base * 0.5 + 36);
    for (var i = 0; i < n; i++) {
      var row = Math.floor(i / cols), c = i % cols, inRow = Math.min(cols, n - row * cols), sz = base * (0.86 + r() * 0.22);
      var slot = inRow < cols ? (c + (cols - inRow) / 2) : c, shift = cols > 1 ? (row % 2 ? 0.11 : -0.11) * colW : 0;
      var x = (slot + 0.5) * colW + shift + (r() - 0.5) * colW * 0.12, y = 24 + base * 0.5 + row * rowH + (r() - 0.5) * base * 0.12;
      x = clamp(x, sz / 2 + 6, W - sz / 2 - 6);
      placed.push({ x: x, y: y, s: sz });
    }
    pond.style.height = H + "px";
    placed.forEach(function (p, i) {
      var b = el("button", "pad", box); b.type = "button"; b.setAttribute("aria-label", "Buka foto " + (i + 1));
      b.style.setProperty("--x", p.x.toFixed(0) + "px"); b.style.setProperty("--y", p.y.toFixed(0) + "px"); b.style.setProperty("--sz", p.s.toFixed(0) + "px");
      b.style.setProperty("--r", ((r() - 0.5) * 16).toFixed(1) + "deg"); b.style.setProperty("--notch", (100 + r() * 70).toFixed(0) + "deg"); b.style.setProperty("--dur", (6 + r() * 4).toFixed(1) + "s"); b.style.setProperty("--dl", (-r() * 6).toFixed(1) + "s");
      el("span", "pad-leaf", b);
      var im = el("span", "pad-img", b), img = el("img", "", im); img.alt = win.lanskapPlatform.gallery[i].alt || ""; b.dataset.itemId = win.lanskapPlatform.gallery[i].id; img.loading = "lazy"; img.src = gal[i];
      el("span", "pad-no", b, "№ " + pad2(i + 1));
      b.addEventListener("click", function (e) { var rc = pond.getBoundingClientRect(), rp = el("span", "ripple", pond); rp.style.left = (e.clientX - rc.left) + "px"; rp.style.top = (e.clientY - rc.top) + "px"; setTimeout(function () { rp.remove(); }, 1300); plink(); setTimeout(function () { openViewer(i); }, reduce ? 0 : 260); });
    });
    var spots = [];
    for (var k = 0; k < 40 && spots.length < Math.min(5, n + 1); k++) {
      var sx = 20 + r() * (W - 40), sy = 20 + r() * (H - 40), ok = true;
      placed.forEach(function (p) { if (Math.hypot(p.x - sx, p.y - sy) < p.s / 2 + 26) { ok = false; } });
      spots.forEach(function (q) { if (Math.hypot(q[0] - sx, q[1] - sy) < 60) { ok = false; } });
      if (ok) { spots.push([sx, sy]); }
    }
    spots.forEach(function (q, j) { var lf = el("span", "lotusf", box); lf.style.left = q[0].toFixed(0) + "px"; lf.style.top = q[1].toFixed(0) + "px"; lf.style.animationDelay = (-j * 1.7) + "s"; flowerSVG(j % 3 ? "teratai" : "melati", lf, 1); });
  }
  var vIdx = 0, vLast = null;
  function openViewer(i) {
    var v = $("viewer");
    vLast = doc.activeElement; showViewer(i, true);
    v.classList.toggle("single", gal.length <= 1); v.classList.add("is-open"); v.setAttribute("aria-hidden", "false");
    body.classList.add("is-locked");
    setTimeout(function () { try { $("viewer-close").focus(); } catch (e) {} }, 60);
  }
  function showViewer(i, instant) {
    vIdx = (i + gal.length) % gal.length;
    var img = $("viewer-img");
    function put() { img.src = gal[vIdx]; img.alt = win.lanskapPlatform.gallery[vIdx].alt || ""; setText("viewer-count", (vIdx + 1) + " / " + gal.length); setText("viewer-cap", win.lanskapPlatform.gallery[vIdx].caption || ""); img.classList.remove("swap"); }
    if (instant || reduce) { put(); } else { img.classList.add("swap"); setTimeout(put, 180); }
  }
  function closeViewer() {
    var v = $("viewer");
    if (!v.classList.contains("is-open")) { return; }
    v.classList.remove("is-open"); v.setAttribute("aria-hidden", "true");
    if (!$("sec-cover") || $("sec-cover").classList.contains("is-gone") || body.classList.contains("is-open")) { body.classList.remove("is-locked"); }
    if (vLast && vLast.focus) { try { vLast.focus({ preventScroll: true }); } catch (e) {} }
  }
  $("viewer-close").addEventListener("click", closeViewer);
  $("viewer-bg").addEventListener("click", closeViewer);
  $("viewer-prev").addEventListener("click", function () { showViewer(vIdx - 1); });
  $("viewer-next").addEventListener("click", function () { showViewer(vIdx + 1); });
  doc.addEventListener("keydown", function (e) {
    if (!$("viewer").classList.contains("is-open")) { return; }
    if (e.key === "Escape") { closeViewer(); } else if (e.key === "ArrowLeft") { showViewer(vIdx - 1); } else if (e.key === "ArrowRight") { showViewer(vIdx + 1); }
  });
  (function () { var sx = 0, sy = 0, fig = $("viewer-fig"); fig.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true }); fig.addEventListener("touchend", function (e) { var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { showViewer(vIdx + (dx < 0 ? 1 : -1)); } else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { closeViewer(); } }, { passive: true }); })();

  /* ================= VIDEO: LAYAR TANCAP ================= */
  function ytId(u) { var m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/.exec(u || ""); return m ? m[1] : ""; }
  function initVideo() {
    var fsrc = clean(($("film-src") || {}).getAttribute ? $("film-src").getAttribute("src") : ""), live = txt("pv-live"), scr = $("screen"), film = $("film");
    if (!fsrc && !live) { hideSec("video"); return; }
    if (!txt("video-intro")) { hide($("video-intro")); }
    if (!clean(film.getAttribute("poster"))) { film.removeAttribute("poster"); }
    var yid = ytId(live);
    if (live) { if (yid) { $("live").setAttribute("data-src", "https://www.youtube.com/embed/" + yid + "?rel=0&playsinline=1"); } else { $("live-link").href = live; } }
    function show(which) {
      scr.classList.remove("show-live", "show-link");
      $("vtab-film").setAttribute("aria-selected", which === "film" ? "true" : "false"); $("vtab-live").setAttribute("aria-selected", which === "live" ? "true" : "false");
      if (which === "live") { try { film.pause(); } catch (e) {} if (yid) { var lf = $("live"); if (!lf.getAttribute("src")) { lf.src = lf.getAttribute("data-src"); } scr.classList.add("show-live"); } else { scr.classList.add("show-link"); } }
    }
    if (fsrc && live) { $("sec-video").classList.add("has-both"); }
    $("vtab-film").addEventListener("click", function () { tock(); show("film"); });
    $("vtab-live").addEventListener("click", function () { tock(); show("live"); });
    if (!fsrc) { hide(film); show("live"); } else { show("film"); }
    film.addEventListener("play", function () { videoPlaying = true; if (hasMusic) { try { bgm.pause(); } catch (e) {} } });
    function resume() { videoPlaying = false; if (sndOn && hasMusic) { playMusic(); } }
    film.addEventListener("pause", resume); film.addEventListener("ended", resume);
    var s = $("tancap-svg");
    for (var i = 0; i < 26; i++) { sv("circle", { cx: (7 + (i * 53) % 350).toFixed(0), cy: (6 + (i * 29) % 60).toFixed(0), r: (0.6 + (i % 3) * 0.4).toFixed(1), fill: "#fff", opacity: (0.3 + (i % 4) * 0.15).toFixed(2), "class": "dew" }, s); }
    sv("path", { d: "M0 282C60 270 110 276 180 272S300 268 360 280V300H0z", fill: "#0e1a1a" }, s);
    [38, 322].forEach(function (x, j) { sv("path", { d: "M" + x + " 292L" + (x + (j ? 2 : -2)) + " 16", stroke: "#b9a66a", "stroke-width": "5", "stroke-linecap": "round" }, s); for (var k = 0; k < 6; k++) { sv("path", { d: "M" + (x - 3) + " " + (40 + k * 44) + "h6", stroke: "#8a7a48", "stroke-width": "2" }, s); } });
    sv("path", { d: "M36 20Q180 6 324 20", fill: "none", stroke: "#cbbf96", "stroke-width": "1.4" }, s);
    sv("path", { d: "M40 30L45 27M320 30L315 27M40 170L45 168M320 170L315 168", stroke: "#cbbf96", "stroke-width": "1.4" }, s);
    var pj = sv("g", { transform: "translate(180 262)" }, s);
    sv("rect", { x: "-22", y: "4", width: "44", height: "22", rx: "3", fill: "#3a2a1c" }, pj);
    sv("rect", { x: "-16", y: "-12", width: "32", height: "18", rx: "4", fill: "#2a2c34" }, pj);
    sv("circle", { cx: "-7", cy: "-18", r: "8", fill: "#383a44", stroke: "#555", "stroke-width": "1" }, pj); sv("circle", { cx: "9", cy: "-18", r: "8", fill: "#383a44", stroke: "#555", "stroke-width": "1" }, pj);
    sv("circle", { cx: "0", cy: "-4", r: "4", fill: "#fff6d6" }, pj);
    var aud = [[40, 276, 1], [72, 280, 0], [104, 274, 1], [252, 276, 0], [284, 280, 1], [318, 274, 0], [136, 286, 1], [226, 286, 0]];
    aud.forEach(function (a, j) { var g = sv("g", { "class": "aud" }, s); g.style.animationDelay = (-j * 0.7) + "s"; sv("path", { d: "M" + (a[0] - 13) + " 300C" + (a[0] - 12) + " " + (a[1] - 6) + " " + (a[0] + 12) + " " + (a[1] - 6) + " " + (a[0] + 13) + " 300z", fill: "#070b12" }, g); sv("circle", { cx: a[0], cy: a[1] - 14, r: "8", fill: "#070b12" }, g); if (a[2]) { sv("path", { d: "M" + (a[0] - 9) + " " + (a[1] - 16) + "Q" + a[0] + " " + (a[1] - 30) + " " + (a[0] + 9) + " " + (a[1] - 16) + "L" + (a[0] + 11) + " " + (a[1] - 6) + "H" + (a[0] - 11) + "z", fill: "#0b1018" }, g); } });
    sv("path", { d: "M0 300L0 288Q90 284 180 292T360 288V300Z", fill: "#3f3526", opacity: ".8" }, s);
    for (var m2 = 0; m2 < 3; m2++) { var mo = sv("g", { "class": "moth", transform: "translate(" + (150 + m2 * 26) + " " + (210 - m2 * 14) + ")" }, s); var mi = sv("g", { "class": "moth" }, mo); mi.style.animationDelay = (-m2 * 1.2) + "s"; sv("ellipse", { cx: "-2", cy: "0", rx: "2.6", ry: "1.6", fill: "#fff3d0", opacity: ".8" }, mi); sv("ellipse", { cx: "2", cy: "0", rx: "2.6", ry: "1.6", fill: "#fff3d0", opacity: ".8" }, mi); }
  }

  /* ================= RSVP: JEJAK ================= */
  var fps = [];
  function initRsvp() {
    var dl = ymd(txt("pv-deadline"));
    if (dl) { setText("rsvp-dl-t", "Mohon kabari kami sebelum " + fmtDate(dl)); } else { hide($("rsvp-dl")); }
    if (!txt("rsvp-intro")) { hide($("rsvp-intro")); }
    var s = $("steps-svg");
    for (var i = 0; i < 14; i++) { var x = 14 + i * 21.5, y = 36 + Math.sin(i * 0.55) * 12 + (i % 2 ? 8 : -8), g = sv("g", { transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + (80 + Math.cos(i * 0.55) * 12).toFixed(0) + ")" }, s), fp = sv("g", { "class": "fp" }, g); sv("ellipse", { cx: "0", cy: "0", rx: "4.2", ry: "7", fill: "currentColor" }, fp); sv("circle", { cx: "-2.8", cy: "-9.5", r: "1.3" }, fp); sv("circle", { cx: "0", cy: "-10.4", r: "1.3" }, fp); sv("circle", { cx: "2.8", cy: "-9.5", r: "1.3" }, fp); fps.push(fp); }
    var name = $("rsvp-name");
    function stepsUpd() { var n = Math.min(fps.length, (name.value || "").trim().length); fps.forEach(function (f, i) { f.classList.toggle("on", i < n); }); }
    name.addEventListener("input", stepsUpd);
    setTimeout(stepsUpd, 900);
    var pax = $("rsvp-pax");
    function setPax(v) { v = clamp(isNaN(v) ? 1 : v, 1, 20); pax.value = 1; try { pax.dispatchEvent(new Event("input", { bubbles: true })); pax.dispatchEvent(new Event("change", { bubbles: true })); } catch (e) {} }
    $("pax-m").addEventListener("click", function () { tock(); setPax(parseInt(pax.value, 10) - 1); });
    $("pax-p").addEventListener("click", function () { tock(); setPax(parseInt(pax.value, 10) + 1); });
    var chosen = "";
    qsa("#rsvp-st [data-wedivo-status]").forEach(function (b) { b.addEventListener("click", function () { chosen = b.getAttribute("data-wedivo-status"); tock(); }); });
    var form = $("rsvp-form"), was = false;
    new MutationObserver(function () {
      var sub = form.classList.contains("is-submitted");
      if (sub && !was) {
        var sel = form.querySelector("[data-wedivo-status].is-selected"), stt = sel ? sel.getAttribute("data-wedivo-status") : chosen, map = { attending: "yes", not_attending: "not", maybe: "maybe" };
        var g = { name: clean(name.value) || guestName || "Tamu", n: parseInt(pax.value, 10) || 1, status: map[stt] || "yes" };
        store.set("rsvp", g); addGuest(g, false);
        chime(3); twinkle();
        var msg = g.status === "yes" ? [win.lanskapTranslate("Jejakmu sudah tercetak."), win.lanskapTranslate("Lihat lembah di belakang — ada yang sedang berjalan menuju pesta.")] : g.status === "not" ? [win.lanskapTranslate("Salammu kami terima."), win.lanskapTranslate("Sebuah perahu kertas berlayar di telaga membawa salammu.")] : [win.lanskapTranslate("Kami tunggu kabar baiknya."), win.lanskapTranslate("Seseorang berdiri di mulut jalan, masih menimbang.")];
        setText("rsvp-ok-t", msg[0]); setText("rsvp-ok-s", msg[1]);
      }
      was = sub;
    }).observe(form, { attributes: true, attributeFilter: ["class"] });
    var old = store.get("rsvp", null);
    if (old && old.status) { addGuest(old, true); }
  }
  function addGuest(g, instant) { if (!scene) { return; } scene.guests = [{ name: g.name, n: g.n, status: g.status, t0: instant ? -99 : scene.now || 0 }]; scene.boat = g.status === "not"; }

  /* ================= HADIAH: BUAH TANGAN ================= */
  var FRUITS = ["mangga", "rambutan", "manggis", "jeruk", "salak", "pisang"];
  function fruit(parent, k, x, y, rot) {
    var g = sv("g", { transform: "translate(" + x + " " + y + ") rotate(" + (rot || 0) + ")" }, parent), f = sv("g", { "class": "fruit" }, g);
    if (k === "mangga") { sv("path", { d: "M-16 2C-18-10-6-18 4-16 16-14 20 0 12 10 4 18-14 14-16 2z", fill: "#e9b949" }, f); sv("path", { d: "M-12-2C-10-10-2-14 6-12", fill: "none", stroke: "#f5d98a", "stroke-width": "3", "stroke-linecap": "round", opacity: ".7" }, f); sv("path", { d: "M8-14c4-4 10-4 12-2-4 2-8 3-12 2z", fill: "#5f9446" }, f); }
    else if (k === "rambutan") { sv("circle", { r: "12", fill: "#d33a3a" }, f); for (var i = 0; i < 16; i++) { var a = i / 16 * Math.PI * 2; sv("path", { d: "M" + (Math.cos(a) * 11).toFixed(1) + " " + (Math.sin(a) * 11).toFixed(1) + "q" + (Math.cos(a + 0.6) * 5).toFixed(1) + " " + (Math.sin(a + 0.6) * 5).toFixed(1) + " " + (Math.cos(a) * 7).toFixed(1) + " " + (Math.sin(a) * 7).toFixed(1), fill: "none", stroke: i % 2 ? "#6fa04a" : "#e25a4a", "stroke-width": "1.6", "stroke-linecap": "round" }, f); } }
    else if (k === "manggis") { sv("circle", { r: "12", fill: "#5b2a4a" }, f); sv("path", { d: "M0-11l3-5 3 4 4-1-2 5-8 1-8-1-2-5 4 1 3-4z", fill: "#4f7d3a" }, f); sv("circle", { cx: "-4", cy: "-3", r: "3", fill: "#7a3d64", opacity: ".7" }, f); }
    else if (k === "jeruk") { sv("circle", { r: "12", fill: "#f29a2e" }, f); sv("circle", { cx: "-4", cy: "-4", r: "3", fill: "#f8c06a", opacity: ".7" }, f); sv("path", { d: "M1-12c3-5 9-5 11-3-4 3-8 4-11 3z", fill: "#5f9446" }, f); }
    else if (k === "salak") { sv("path", { d: "M0-14C9-14 13-4 12 4 11 12 5 15 0 15-5 15-11 12-12 4-13-4-9-14 0-14z", fill: "#7a4a2a" }, f); for (var r = 0; r < 4; r++) { sv("path", { d: "M-9 " + (-8 + r * 6) + "q9 -3 18 0", fill: "none", stroke: "#a26b40", "stroke-width": "1.3" }, f); } }
    else { sv("path", { d: "M-18-2C-10 8 10 8 18-6", fill: "none", stroke: "#f2d24a", "stroke-width": "7", "stroke-linecap": "round" }, f); sv("path", { d: "M-16 4C-6 14 12 12 20 0", fill: "none", stroke: "#e9c43a", "stroke-width": "7", "stroke-linecap": "round" }, f); sv("path", { d: "M18-6l4-3", stroke: "#6b5a2a", "stroke-width": "3", "stroke-linecap": "round" }, f); }
    return f;
  }
  var basketFruit = null, fruitN = 0;
  function initHadiah() {
    if (!txt("hadiah-intro")) { hide($("hadiah-intro")); }
    var s = $("basket-svg");
    sv("ellipse", { cx: "140", cy: "188", rx: "104", ry: "10", fill: "rgba(0,0,0,.14)" }, s);
    basketFruit = sv("g", {}, s);
    [["mangga", 92, 92, -12], ["rambutan", 128, 84, 0], ["pisang", 168, 88, 8], ["manggis", 196, 98, 0], ["jeruk", 110, 104, 0], ["salak", 150, 102, -6]].forEach(function (f) { fruit(basketFruit, f[0], f[1], f[2], f[3]); });
    var bk = sv("g", { "class": "bk-body" }, s);
    sv("path", { d: "M46 104h188l-16 74c-2 7-8 12-15 12H77c-7 0-13-5-15-12z", fill: "#c9985a" }, bk);
    for (var i = 0; i < 6; i++) { sv("path", { d: "M" + (52 + i * 2.4) + " " + (116 + i * 12) + "H" + (228 - i * 2.4), stroke: i % 2 ? "#a97a42" : "#dcb176", "stroke-width": "5" }, bk); }
    for (var j = 0; j < 13; j++) { var x = 64 + j * 12.6; sv("path", { d: "M" + x + " 108L" + (x + (j - 6) * 0.9) + " 186", stroke: "#8a5f30", "stroke-width": "1.3", opacity: ".55" }, bk); }
    sv("rect", { x: "40", y: "96", width: "200", height: "13", rx: "6.5", fill: "#b3814a" }, bk);
    sv("path", { d: "M44 102c20-5 40-5 60 0s40 5 60 0 40-5 60 0", fill: "none", stroke: "#e2bb82", "stroke-width": "2" }, bk);
    sv("path", { d: "M70 98C76 40 204 40 210 98", fill: "none", stroke: "#a97a42", "stroke-width": "6", "stroke-linecap": "round" }, s);
    sv("path", { d: "M70 98C76 40 204 40 210 98", fill: "none", stroke: "#dcb176", "stroke-width": "2", "stroke-dasharray": "4 6", "stroke-linecap": "round" }, s);
    var amt = $("gift-amt");
    qsa(".chip").forEach(function (c) { c.addEventListener("click", function () { amt.value = c.getAttribute("data-v"); try { amt.dispatchEvent(new Event("input", { bubbles: true })); } catch (e) {} qsa(".chip").forEach(function (x) { x.classList.toggle("is-on", x === c); }); tone(880, 0.12, "triangle", 0.08); tone(1320, 0.18, "sine", 0.06, 0.06); }); });
    amt.addEventListener("input", function () { qsa(".chip").forEach(function (x) { x.classList.toggle("is-on", x.getAttribute("data-v") === amt.value); }); });
    var form = $("gift-form"), was = false;
    new MutationObserver(function () {
      var sub = form.classList.contains("is-submitted");
      if (sub && !was) { dropFruit(); }
      was = sub;
    }).observe(form, { attributes: true, attributeFilter: ["class"] });
  }
  function dropFruit() {
    var k = FRUITS[fruitN % FRUITS.length], f = fruit(basketFruit, k, 110 + (fruitN * 37) % 70, 80 - (fruitN % 3) * 6, (fruitN % 5) * 7 - 14);
    fruitN++;
    if (!reduce) { f.classList.add("drop"); }
    setTimeout(function () { var b = $("basket"); b.classList.remove("thud"); void b.offsetWidth; b.classList.add("thud"); thud(); chime(2); }, reduce ? 0 : 750);
  }

  /* ================= DOA: KUNANG-KUNANG ================= */
  var flyMap = [], pendingMine = "", bubT = 0;
  function initDoa() {
    if (!txt("doa-intro")) { hide($("doa-intro")); }
    var s = $("meadow-svg");
    sv("path", { d: "M0 170V120C40 112 80 128 130 118S230 104 280 116 340 110 360 114V170Z", fill: "#0b1420" }, s);
    for (var i = 0; i < 60; i++) { var x = (i * 6.3) % 360, h = 18 + (i * 13) % 38, lean = ((i * 7) % 9) - 4; sv("path", { d: "M" + x.toFixed(1) + " 170Q" + (x + lean * 0.5).toFixed(1) + " " + (170 - h * 0.6).toFixed(1) + " " + (x + lean).toFixed(1) + " " + (170 - h), fill: "none", stroke: i % 3 ? "#0f1c26" : "#132433", "stroke-width": "2.2", "stroke-linecap": "round" }, s); }
    for (var k = 0; k < 5; k++) { var rx = 30 + k * 72, g = sv("g", { "class": "rice-g" }, s); g.style.animationDelay = (-k * 1.1) + "s"; sv("path", { d: "M" + rx + " 170Q" + (rx + 4) + " 120 " + (rx + 10) + " 84", fill: "none", stroke: "#15283a", "stroke-width": "2" }, g); sv("ellipse", { cx: rx + 11, cy: 78, rx: "3.4", ry: "10", fill: "#1a3244", transform: "rotate(14 " + (rx + 11) + " 78)" }, g); }
    for (var a = 0; a < 6; a++) { var f = el("span", "fly amb", $("flies")); f.setAttribute("aria-hidden", "true"); f.style.setProperty("--x", (8 + a * 16 + (a % 2) * 5) + "%"); f.style.setProperty("--y", (30 + ((a * 37) % 40)) + "%"); f.style.setProperty("--fd", (8 + a) + "s"); f.style.setProperty("--fdl", (-a * 1.3) + "s"); f.style.setProperty("--fb", (2.2 + a * 0.3) + "s"); }
    var list = $("wish-list");
    new MutationObserver(syncFlies).observe(list, { childList: true });
    $("wish-form").addEventListener("submit", function () { pendingMine = clean($("wish-name").value) || "x"; });
    syncFlies();
  }
  function syncFlies() {
    var list = $("wish-list"), cards = Array.prototype.slice.call(list.children), box = $("flies"), n = 0;
    cards.forEach(function (c) { idAll(c, "wc"); });
    setText("fly-count", cards.length ? cards.length + " kunang-kunang doa menyala di lembah" : win.lanskapTranslate("jadilah kunang-kunang pertama"));
    $("wish-empty").style.display = cards.length ? "none" : "";
    if (scene) { scene.wish = cards.length; }
    var known = flyMap.map(function (f) { return f.card; });
    cards.forEach(function (c, idx) {
      if (known.indexOf(c) >= 0 || idx >= 40) { return; }
      var nm = clean((c.querySelector('[data-field="name"]') || {}).textContent), msg = clean((c.querySelector('[data-field="message"]') || {}).textContent), hsh = hashStr(nm + msg + idx);
      var b = el("button", "fly", box); b.type = "button"; b.setAttribute("aria-label", "Doa dari " + (nm || "tamu"));
      b.style.setProperty("--x", (6 + (hsh % 88)) + "%"); b.style.setProperty("--y", (14 + ((hsh >> 3) % 58)) + "%"); b.style.setProperty("--fd", (7 + (hsh % 6)) + "s"); b.style.setProperty("--fdl", (-(hsh % 50) / 10) + "s"); b.style.setProperty("--fb", (2 + (hsh % 20) / 10) + "s");
      if (pendingMine && nm && nm.toLowerCase().indexOf(pendingMine.toLowerCase()) === 0) { b.classList.add("is-mine", "is-new"); pendingMine = ""; twinkle(); toast("Kunang-kunangmu sudah terbang."); }
      b.addEventListener("click", function () { showBubble(nm, msg); twinkle(); });
      flyMap.push({ card: c, btn: b });
      n++;
    });
    flyMap = flyMap.filter(function (f) { if (cards.indexOf(f.card) < 0) { f.btn.remove(); return false; } return true; });
  }
  function showBubble(n, m) { var b = $("bubble"); setText("bubble-n", n || "Tamu"); setText("bubble-m", m || ""); b.classList.add("show"); clearTimeout(bubT); bubT = setTimeout(function () { b.classList.remove("show"); }, 4200); }

  /* ================= PENUTUP: WIJAYAKUSUMA ================= */
  function initPenutup() {
    ["wj-note", "close-msg", "close-fam", "close-salam"].forEach(function (id) { if (!txt(id)) { hide($(id)); } });
    if (!txt("close-par-b-v")) { hide($("close-par-b")); }
    if (!txt("close-par-g-v")) { hide($("close-par-g")); }
    if (!mtx("turut-v")) { hide($("turut")); }
    var tag = txt("tag-t");
    if (!tag || tag === "#") { hide($("tag")); } else { $("tag").addEventListener("click", function () { tock(); copyText(tag, "Tagar disalin: " + tag); }); }
    var wj = $("wj"), img = $("wj-img"), src = img ? clean(img.getAttribute("src")) : "";
    if (!src) { wj.classList.add("no-photo"); } else { img.addEventListener("error", function () { wj.classList.add("no-photo"); }); }
    var s = $("wj-svg"), defs = sv("defs", {}, s), gid = mkId("wjg"), pg = mkId("wjp");
    var rg = sv("radialGradient", { id: gid }, defs); sv("stop", { offset: "0", "stop-color": "#fffbe6", "stop-opacity": ".9" }, rg); sv("stop", { offset: ".5", "stop-color": "#fff3c8", "stop-opacity": ".25" }, rg); sv("stop", { offset: "1", "stop-color": "#fff3c8", "stop-opacity": "0" }, rg);
    var lg = sv("linearGradient", { id: pg, x1: "0", y1: "0", x2: "0", y2: "-1", gradientUnits: "objectBoundingBox" }, defs); sv("stop", { offset: "0", "stop-color": "#f3ead6" }, lg); sv("stop", { offset: ".6", "stop-color": "#fffdf6" }, lg); sv("stop", { offset: "1", "stop-color": "#ffffff" }, lg);
    sv("circle", { r: "150", fill: "url(#" + gid + ")", "class": "wj-glow" }, s);
    sv("path", { d: "M8 150C14 110 30 86 22 52", fill: "none", stroke: "#b9786a", "stroke-width": "5", "stroke-linecap": "round", opacity: ".8" }, s);
    var i, a;
    for (i = 0; i < 14; i++) { a = i / 14 * 360 + 12; var p1 = sv("path", { d: "M0 0C-5-30-6-90 0-128C6-90 5-30 0 0Z", fill: "#d9a08a", opacity: ".92", "class": "wjp" }, s); p1.style.setProperty("--r", a + "deg"); p1.style.setProperty("--dl", (i * 0.03) + "s"); }
    for (i = 0; i < 18; i++) { a = i / 18 * 360; var p2 = sv("path", { d: "M0 0C-15-26-18-80 0-112C18-80 15-26 0 0Z", fill: "url(#" + pg + ")", stroke: "#e8dcc4", "stroke-width": ".8", "class": "wjp" }, s); p2.style.setProperty("--r", a + "deg"); p2.style.setProperty("--dl", (0.25 + (i % 6) * 0.05) + "s"); }
    for (i = 0; i < 12; i++) { a = i / 12 * 360 + 7; var p3 = sv("path", { d: "M0 0C-11-18-12-52 0-74C12-52 11-18 0 0Z", fill: "#fffef9", stroke: "#efe4cc", "stroke-width": ".8", "class": "wjp" }, s); p3.style.setProperty("--r", a + "deg"); p3.style.setProperty("--dl", (0.5 + (i % 4) * 0.06) + "s"); }
    for (i = 0; i < 22; i++) { a = i / 22 * Math.PI * 2; var len = 34 + (i % 4) * 6, st2 = sv("g", { "class": "wjp" }, s); st2.style.setProperty("--r", "0deg"); st2.style.setProperty("--dl", "1s"); sv("path", { d: "M0 0Q" + (Math.cos(a + 0.3) * len * 0.6).toFixed(1) + " " + (Math.sin(a + 0.3) * len * 0.6).toFixed(1) + " " + (Math.cos(a) * len).toFixed(1) + " " + (Math.sin(a) * len).toFixed(1), fill: "none", stroke: "#f1e4b0", "stroke-width": "1.1" }, st2); sv("circle", { cx: (Math.cos(a) * len).toFixed(1), cy: (Math.sin(a) * len).toFixed(1), r: "2.2", fill: "#f4d774" }, st2); }
    wj._onReveal = function () { setTimeout(function () { wj.classList.add("bloom"); chime(3); }, reduce ? 0 : 350); };
    wj.addEventListener("click", function () {
      if (!wj.classList.contains("bloom")) { wj.classList.add("bloom"); }
      for (var k = 0; k < 16; k++) { var sp = el("span", "scent", wj), an = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90; sp.style.setProperty("--sx", (Math.cos(an) * d).toFixed(0) + "px"); sp.style.setProperty("--sy", (Math.sin(an) * d - 40).toFixed(0) + "px"); sp.style.animationDelay = (k * 0.05) + "s"; (function (x) { setTimeout(function () { x.remove(); }, 3000); })(sp); }
      twinkle(); vib(12);
    });
    function finale(n) { if (scene) { scene.launch(n || 6); } else { toast(win.lanskapTranslate("Kembang api menyala di hati kami.")); } vib(20); }
    $("fw-btn").addEventListener("click", function () { tock(); var end = $("penutup-end"); try { win.scrollTo({ top: end.getBoundingClientRect().top + win.pageYOffset + end.offsetHeight - win.innerHeight + 10, behavior: reduce ? "auto" : "smooth" }); } catch (e) {} setTimeout(function () { finale(7); }, reduce ? 50 : 700); });
    var endVn = $("penutup-end-vn"), fwDone = false;
    if (endVn) { endVn._onReveal = function () { if (!fwDone) { fwDone = true; setTimeout(function () { finale(5); }, 600); } }; }
    $("back-top").addEventListener("click", function () { tock(); toast(win.lanskapTranslate("Memutar ulang hari dari fajar…")); try { win.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); } catch (e) { win.scrollTo(0, 0); } });
  }

  /* ================= SAMPUL: BUKA ================= */
  var coverOpened = false;
  function openCover() {
    if (coverOpened) { return; }
    coverOpened = true;
    var cov = $("sec-cover");
    if (!win.lanskapPlatform.guestPaused) { soundOn(win.lanskapPlatform.musicEnabled); }
    whoosh(); setTimeout(function () { chime(3); }, 400); setTimeout(function () { chirp(SFX, 0.06); }, 900);
    body.classList.add("cover-opening");
    coverHold = false; coverRamp = true; setTimeout(function () { coverRamp = false; }, 3600);
    if (reduce) { revealHero(); } else { setTimeout(revealHero, 260); }
    setTimeout(function () { body.classList.remove("is-locked"); body.classList.add("is-open"); measure(); navSync(); }, reduce ? 60 : 850);
    var sky = $("cv-sky"), done = false;
    function gone(e) { if (e && (e.target !== sky || e.propertyName !== "opacity")) { return; } if (done) { return; } done = true; cov.classList.add("is-gone"); cov.style.display = "none"; sky.removeEventListener("transitionend", gone); }
    sky.addEventListener("transitionend", gone);
    setTimeout(gone, reduce ? 700 : 2600);
  }

  /* ================= MULAI ================= */
  try { if ("scrollRestoration" in win.history) { win.history.scrollRestoration = "manual"; } } catch (e) {}
  function safe(fn) { try { fn(); } catch (e) { if (win.console && win.console.error) { win.console.error(e); } } }
  [initSalam, initMempelai, initKisah, initJamBunga, initBunyi, initMenanti, initAcara, initSusunan, initLokasi, initRambu, initBusana, initGaleri, initVideo, initHadiah, initDoa, initPenutup].forEach(safe);
  layoutSecs();
  stagger("#snds", 0.07);
  initReveal();
  initLand();
  if (scene) { scene.onPop = function () { boom(); vib(8); }; }
  safe(initRsvp);
  setTimeout(function () { layoutSecs(); navSync(); }, 900);
  setTimeout(function () { layoutSecs(); navSync(); }, 2400);
  var ticking = false;
  win.addEventListener("scroll", function () {
    if (ticking) { return; }
    ticking = true;
    win.requestAnimationFrame(function () {
      ticking = false; navSync(); bottomRelease();
      if (OV && OV.cancel && Math.abs(win.pageYOffset - OV.sy) > OV.cancel) { setOverride(null); stopPlay(); dialFollow = true; }
    });
  }, { passive: true });
  var rzT = 0;
  win.addEventListener("resize", function () { clearTimeout(rzT); rzT = setTimeout(function () { sizeLand(false); measure(); if (gal.length) { pondW = 0; layoutPond(); } drawThumbs(false); centerRail(activeId); navSync(); }, 160); });
  new MutationObserver(function () { layoutSecs(); navSync(); }).observe(body, { childList: true });
  if ("ResizeObserver" in win) { var roT = 0; new ResizeObserver(function () { clearTimeout(roT); roT = setTimeout(measure, 120); }).observe(body); }
  if ("IntersectionObserver" in win) { var ac2 = $("acara-card"); if (ac2) { new IntersectionObserver(function (en, ob) { en.forEach(function (x) { if (x.isIntersecting) { drawThumbs(true); ob.disconnect(); } }); }, { rootMargin: "600px 0px" }).observe(ac2); } } else { drawThumbs(true); }
  var lastDialH = -1;
  setInterval(function () { if (dialFollow && !OV && Math.abs(hDisp - lastDialH) > 0.02) { lastDialH = hDisp; dialTo(hDisp, false); } }, 400);
  doc.addEventListener("pointerdown", function (e) {
    if (!scene || !body.classList.contains("is-open")) { return; }
    var t = e.target;
    if (!t || !t.closest || t.closest("button, a, input, textarea, .card, #nav, #hud, #viewer")) { return; }
    if (t.closest(".vista") || t.closest("#sec-hero") || t === body) { scene.burst(e.clientX, e.clientY, hDisp > 18.6); if (hDisp > 18.6) { twinkle(); } else { plink(); } }
  });
  var cov = $("sec-cover");
  if (!cov || !isShown(cov) || !$("cv-open")) { coverHold = false; body.classList.remove("is-locked"); body.classList.add("is-open"); revealHero(); if (cov) { cov.style.display = "none"; } }
  else { $("cv-open").addEventListener("click", openCover); }
  navSync(); hudTick(true);

  win.lanskapRuntime = {
    update: function () {
      reduce = win.lanskapPlatform.reducedMotion; staticDirty = true;
      BR = txt("cv-bride"); GR = txt("cv-groom"); guestName = txt("guest-name");
      TZ = win.lanskapPlatform.timezone;
      EV1.name = txt("ev-1-name"); EV1.d = ymd(txt("pv-date")); EV1.s = hm(txt("pv-time")); EV1.e = null;
      EV1.venue = txt("ev-1-venue"); EV1.addr = txt("ev-1-addr");
      EV2.name = ""; EV2.s = null; EV2.d = null;
      dateStr = fmtDate(EV1.d);
      safe(initMenanti);
      setText("cv-date", dateStr ? dateStr.toUpperCase() : ""); setText("hero-date", dateStr); setText("hero-time", fmtHM(EV1.s) + (EV1.s == null ? "" : " " + TZ.l));
      gal = win.lanskapPlatform.gallery.map(function (p) { return p.src; });
      $("plots").textContent = ""; $("harvest-svg").textContent = "";
      safe(initKisah);
      $("stalk").textContent = ""; rdItems = []; safe(initSusunan);
      $("dress-svg").textContent = ""; $("swatches").textContent = ""; safe(initBusana);
      pondW = 0; if (gal.length) { safe(initGaleri); layoutPond(); } else { $("pond-pads").textContent = ""; }
      if (win.lanskapPlatform.colors.length) { staticDirty = true; }
      thumbs = []; safe(initAcara); drawThumbs(true);
      qsa(".rv, .vn, .plot").filter(function (e) { return !e.closest("#sec-hero") && !e.closest("#sec-cover"); }).forEach(observe);
      layoutSecs(); measure(); navSync(); hudLast = -9; hudTick(true);
      win.lanskapLocalizeGenerated();
    },
    music: function () {
      hasMusic = !!bgm.getAttribute("src");
      if (win.lanskapPlatform.silentPlayback) { soundOn(false); }
      else if (win.lanskapPlatform.musicEnabled && !win.lanskapPlatform.guestPaused) { soundOn(true); }
      else if (!win.lanskapPlatform.musicEnabled) { bgm.pause(); }
    }
  };
  win.lanskapLocalizeGenerated();
  win.lanskapRuntime.music();
  new MutationObserver(function () { win.lanskapLocalizeGenerated(); }).observe(doc.body, { childList: true, subtree: true, characterData: true });

})();
