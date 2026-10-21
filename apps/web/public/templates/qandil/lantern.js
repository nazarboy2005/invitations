/*
  Qandil brass lantern renderer. The lantern is a surface of revolution (finial, onion dome,
  flared brim, bulging pierced body, cone, drop) drawn front-on from a profile curve. Its skin is
  an unwrapped height field (engraved arches, ribs, beading) plus a pierced-hole mask that holds
  8-point stars, dots, teardrops and the couple's initials cut through the front medallion.
  Each pixel gets a surface normal from the profile + relief and is shaded as environment-mapped
  brass, once for the dark moonlit room ("cold") and once for the room lit by the lantern ("warm").
  A third layer holds the emissive light coming through the piercings ("glow").

  window.QandilLantern.render({ px, letters, font }) → {
    cold, warm, glow, bloom : canvases (px × px*ASPECT),
    holes : [{ x, y, z, a, kind, rot }]   hole centres in lantern units (flame at origin, y down),
    flame : { x, y } in canvas px,  ring : { x, y } in canvas px (where the chain attaches)
  }
  window.QandilLantern.chain(px) → canvas tile (one front link + one side link), repeats on y.
*/
(function () {
  "use strict";

  var ASPECT = 2.1;
  var TAU = Math.PI * 2;

  // profile: v (0 top … 1 tip) → radius in units of U (U = 0.47 × width)
  var PROFILE = [
    [.050, 0], [.056, .05], [.068, .078], [.082, .05], [.092, .03], [.100, .062], [.107, .062], [.112, .032], [.122, .04],
    [.140, .10], [.168, .22], [.198, .38], [.232, .54], [.262, .655], [.286, .70], [.296, .74],
    [.302, .87], [.314, .875], [.322, .76], [.330, .77], [.350, .77], [.358, .80],
    [.400, .88], [.450, .945], [.520, .985], [.585, .97], [.650, .915], [.705, .845], [.716, .835],
    [.724, .875], [.742, .875], [.750, .79],
    [.775, .70], [.810, .55], [.845, .38], [.885, .20], [.910, .115], [.918, .07],
    [.932, .095], [.946, .095], [.960, .06], [.978, .03], [1, 0]
  ];
  var FLAME_V = .545;           // flame centre (normalised height)
  var MEDALLION_V = .545;

  function profileTable(H) {
    // monotone cubic (Fritsch–Carlson) through the profile points, sampled per pixel row
    var n = PROFILE.length, xs = [], ys = [], d = [], m = [], i;
    for (i = 0; i < n; i++) { xs.push(PROFILE[i][0]); ys.push(PROFILE[i][1]); }
    for (i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m.push(d[0]);
    for (i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
    m.push(d[n - 2]);
    for (i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
      var a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { var t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    var r = new Float32Array(H), k = 0;
    for (var y = 0; y < H; y++) {
      var v = (y + .5) / H;
      if (v < xs[0] || v > xs[n - 1]) { r[y] = 0; continue; }
      while (k < n - 2 && v > xs[k + 1]) k++;
      var h = xs[k + 1] - xs[k], t2 = (v - xs[k]) / h, t3 = t2 * t2 * t2, tt = t2 * t2;
      r[y] = Math.max(0, (2 * t3 - 3 * tt + 1) * ys[k] + (t3 - 2 * tt + t2) * h * m[k] + (-2 * t3 + 3 * tt) * ys[k + 1] + (t3 - tt) * h * m[k + 1]);
    }
    return r;
  }
  function radiusAt(v) {
    for (var i = 0; i < PROFILE.length - 1; i++) {
      if (v <= PROFILE[i + 1][0]) { var t = (v - PROFILE[i][0]) / (PROFILE[i + 1][0] - PROFILE[i][0]); return PROFILE[i][1] + (PROFILE[i + 1][1] - PROFILE[i][1]) * t; }
    }
    return 0;
  }

  function hash(n) { var s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), w = yf * yf * (3 - 2 * yf);
    var a = hash(xi + yi * 57), b = hash(xi + 1 + yi * 57), c = hash(xi + (yi + 1) * 57), d = hash(xi + 1 + (yi + 1) * 57);
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
  }

  function star8(g, r, inner) {
    g.beginPath();
    for (var i = 0; i < 16; i++) {
      var a = i * Math.PI / 8 - Math.PI / 2, rr = i % 2 ? r * (inner || .5) : r;
      if (i) g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    g.closePath();
  }
  function drop(g, r) {
    g.beginPath();
    g.moveTo(0, -r * 1.7);
    g.bezierCurveTo(r * .55, -r * .7, r, -r * .1, r, r * .35);
    g.arc(0, r * .35, r, 0, Math.PI);
    g.bezierCurveTo(-r, -r * .1, -r * .55, -r * .7, 0, -r * 1.7);
    g.closePath();
  }

  /* --------------------------------------------- the unwrapped skin (relief + holes) */
  function buildSkin(TW, TH, U, Rref, letters, font, mirrorBack) {
    var holeC = document.createElement("canvas"), relC = document.createElement("canvas");
    holeC.width = relC.width = TW; holeC.height = relC.height = TH;
    var hg = holeC.getContext("2d"), rg = relC.getContext("2d");
    hg.fillStyle = "#000"; hg.fillRect(0, 0, TW, TH);
    rg.fillStyle = "rgb(128,128,128)"; rg.fillRect(0, 0, TW, TH);
    var holes = [];
    var X = function (th) { return ((th / TAU + .5) % 1 + 1) % 1 * TW; };
    var Y = function (v) { return v * TH; };
    // draw a shape at (th, v) on one or both canvases, squeezing x where the radius is small
    function at(g, th, v, fn) {
      var sx = Rref / Math.max(.05, radiusAt(v) * U), x = X(th);
      [x, x - TW, x + TW].forEach(function (xx) {
        if (xx < -80 || xx > TW + 80) return;
        g.save(); g.translate(xx, Y(v)); g.scale(sx, 1); fn(g); g.restore();
      });
    }
    function hole(th, v, r, kind, rot) {
      at(hg, th, v, function (g) {
        g.rotate(rot || 0); g.fillStyle = "#fff";
        if (kind === "star") star8(g, r, .52); else if (kind === "drop") drop(g, r); else { g.beginPath(); g.arc(0, 0, r, 0, TAU); }
        g.fill();
      });
      // a fine engraved outline around every piercing (the chiselled lip)
      at(rg, th, v, function (g) {
        g.rotate(rot || 0); g.strokeStyle = "rgb(70,70,70)"; g.lineWidth = Math.max(1, U * .007);
        if (kind === "star") { star8(g, r * 1.32, .56); g.stroke(); } else if (kind === "drop") { drop(g, r * 1.3); g.stroke(); }
      });
      holes.push({ th: th, v: v, r: r, kind: kind, rot: rot || 0 });
    }
    function groove(fn, width, shade) {
      rg.save(); rg.strokeStyle = shade || "rgb(40,40,40)"; rg.lineWidth = width; rg.lineCap = "round"; rg.lineJoin = "round"; fn(rg); rg.restore();
    }
    function raised(fn, width) {
      rg.save(); rg.strokeStyle = "rgb(225,225,225)"; rg.lineWidth = width; rg.lineCap = "round"; fn(rg); rg.restore();
    }
    var px = function (k) { return U * k; };  // lengths in canvas px

    // horizontal bands: collar, lower band, brim (beaded and zig-zag engraving)
    [[.333, .347], [.726, .740]].forEach(function (b) {
      groove(function (g) { g.beginPath(); g.moveTo(0, Y(b[0])); g.lineTo(TW, Y(b[0])); g.moveTo(0, Y(b[1])); g.lineTo(TW, Y(b[1])); g.stroke(); }, px(.012));
      groove(function (g) {
        g.beginPath(); var step = px(.07), mid = Y((b[0] + b[1]) / 2), amp = (Y(b[1]) - Y(b[0])) * .28;
        for (var x = 0; x <= TW + step; x += step) g.lineTo(x, mid + ((x / step) % 2 ? amp : -amp));
        g.stroke();
      }, px(.008), "rgb(60,60,60)");
    });
    // brim: a ring of small pierced dots
    for (var i = 0; i < 28; i++) hole(i / 28 * TAU - Math.PI, .308, px(.016), "dot");
    // dome: eight teardrops pointing up, a row of dots, engraved scallops
    for (i = 0; i < 8; i++) {
      var th = i / 8 * TAU - Math.PI;
      hole(th, .255, px(.04), "drop");
      hole(th + Math.PI / 8, .214, px(.014), "dot");
      hole(th + Math.PI / 8, .272, px(.012), "dot");
      at(rg, th, .25, function (g) { g.strokeStyle = "rgb(55,55,55)"; g.lineWidth = px(.008); g.beginPath(); g.moveTo(-px(.19), px(.07)); g.quadraticCurveTo(0, -px(.2), px(.19), px(.07)); g.stroke(); });
    }
    // cone: stars and dots
    for (i = 0; i < 8; i++) {
      th = i / 8 * TAU - Math.PI;
      hole(th, .792, px(.036), "star", Math.PI / 8);
      hole(th + Math.PI / 8, .835, px(.013), "dot");
      at(rg, th, .8, function (g) { g.strokeStyle = "rgb(60,60,60)"; g.lineWidth = px(.007); g.beginPath(); g.arc(0, 0, px(.058), 0, TAU); g.stroke(); });
    }
    // body panels
    var panel = TAU / 8, top = .372, bot = .712;
    for (var k = 0; k < 8; k++) {
      var c = k * panel - Math.PI;   // panel centre; k = 4 → θ = 0 (front)
      var front = Math.abs(c) < .01, back = Math.abs(Math.abs(c) - Math.PI) < .01;
      // raised rib between panels, with a dotted engraved line beside it
      var rib = c + panel / 2;
      raised(function (g) { g.beginPath(); g.moveTo(X(rib), Y(top - .012)); g.lineTo(X(rib), Y(bot + .01)); g.stroke(); }, px(.035));
      groove(function (g) { g.beginPath(); g.moveTo(X(rib) - px(.04), Y(top)); g.lineTo(X(rib) - px(.04), Y(bot)); g.moveTo(X(rib) + px(.04), Y(top)); g.lineTo(X(rib) + px(.04), Y(bot)); g.stroke(); }, px(.006), "rgb(75,75,75)");
      for (var j = 0; j < 5; j++) hole(rib, top + .03 + j * (bot - top - .06) / 4, px(.011), "dot");
      if (front || (back && mirrorBack)) {
        // the medallion: two engraved rings, a ring of pierced dots, and the initials cut through
        var mr = px(.36);
        at(rg, c, MEDALLION_V, function (g) {
          g.strokeStyle = "rgb(35,35,35)"; g.lineWidth = px(.014);
          g.beginPath(); g.arc(0, 0, mr, 0, TAU); g.stroke();
          g.lineWidth = px(.008); g.beginPath(); g.arc(0, 0, mr * .8, 0, TAU); g.stroke();
          g.strokeStyle = "rgb(215,215,215)"; g.lineWidth = px(.02); g.beginPath(); g.arc(0, 0, mr * 1.08, 0, TAU); g.stroke();
        });
        for (j = 0; j < 20; j++) {
          var a = j / 20 * TAU;
          var dth = Math.cos(a) * mr * .9 / (radiusAt(MEDALLION_V) * U);
          hole(c + dth, MEDALLION_V + Math.sin(a) * mr * .9 / TH, px(.016), j % 2 ? "dot" : "star");
        }
        if (front) drawLetters(hg, X(c), Y(MEDALLION_V), mr * .8, letters, font);
        // small stars above and below the medallion
        hole(c, top + .03, px(.035), "star", Math.PI / 8);
        hole(c, bot - .028, px(.035), "star", Math.PI / 8);
      } else {
        // a pointed arch engraved on each panel, dotted with piercings, stars inside
        var hw = .34 * panel;
        groove(function (g) {
          var x0 = X(c);
          if (x0 + px(.6) > TW) x0 -= TW;
          [0, TW].forEach(function (off) {
            var xx = x0 + off, dx = hw * Rref;
            g.beginPath();
            g.moveTo(xx - dx, Y(bot - .01)); g.lineTo(xx - dx, Y(.47));
            g.bezierCurveTo(xx - dx, Y(.41), xx - dx * .25, Y(.4), xx, Y(top + .012));
            g.bezierCurveTo(xx + dx * .25, Y(.4), xx + dx, Y(.41), xx + dx, Y(.47));
            g.lineTo(xx + dx, Y(bot - .01));
            g.stroke();
          });
        }, px(.012));
        hole(c, .545, px(.1), "star", Math.PI / 8);
        hole(c, .452, px(.05), "star", 0);
        hole(c, .642, px(.06), "star", 0);
        [[-.55, .5], [.55, .5], [-.55, .595], [.55, .595]].forEach(function (p) { hole(c + p[0] * hw, p[1], px(.017), "dot"); });
        [.68, .70].forEach(function (v, n) { hole(c + (n ? .45 : -.45) * hw, v, px(.012), "dot"); });
        // Fine perforation constellations in the open fields: these are small at rest,
        // but each one becomes a distinct projected star when the flame catches.
        for (var row = 0; row < 5; row++) {
          var rv = .485 + row * .047;
          for (var col = 0; col < 5; col++) {
            var offset = (col - 2) * .105 * hw;
            if (Math.abs(offset) > .22 * hw || (col === 2 && row === 2)) continue;
            hole(c + offset, rv, px(.0085), "dot");
          }
        }
        for (j = 0; j < 7; j++) {
          var t = j / 6, vv = .47 - t * (.47 - top - .02), sx = 1 - Math.pow(t, 1.6) * .95;
          hole(c - hw * .78 * sx, vv, px(.01), "dot"); if (j < 6) hole(c + hw * .78 * sx, vv, px(.01), "dot");
        }
      }
    }
    // soften the relief a touch so normals are smooth
    var relSoft = document.createElement("canvas");
    relSoft.width = TW; relSoft.height = TH;
    var sg = relSoft.getContext("2d");
    blurInto(sg, relC, TW, TH, Math.max(1, U * .006));
    var holeSoft = document.createElement("canvas");
    holeSoft.width = TW; holeSoft.height = TH;
    var hs = holeSoft.getContext("2d");
    hs.fillStyle = "#000"; hs.fillRect(0, 0, TW, TH);
    blurInto(hs, holeC, TW, TH, Math.max(1.5, U * .02));
    return { hole: holeC, holeSoft: holeSoft, relief: relSoft, holes: holes };
  }

  // blur that works where ctx.filter does not (older iOS WebViews): down-sample, then up-sample
  function blurInto(g, src, W, H, r) {
    if ("filter" in g) {
      g.filter = "blur(" + r + "px)"; g.drawImage(src, 0, 0);
      g.filter = "none";
      // some engines expose .filter but ignore it; detect by sampling a pixel later is overkill here
      return;
    }
    var k = Math.max(1, Math.round(r * 1.5)), s = document.createElement("canvas");
    s.width = Math.max(1, Math.round(W / k)); s.height = Math.max(1, Math.round(H / k));
    var sgc = s.getContext("2d"); sgc.imageSmoothingEnabled = true;
    sgc.drawImage(src, 0, 0, s.width, s.height);
    g.imageSmoothingEnabled = true; g.drawImage(s, 0, 0, W, H);
  }

  function drawLetters(g, cx, cy, R, letters, font) {
    var a = letters[0] || "", b = letters[1] || "";
    g.save();
    g.fillStyle = "#fff"; g.strokeStyle = "#fff"; g.lineJoin = "round";
    function ink(t, size) {
      g.font = size + "px " + font;
      var m = g.measureText(t);
      return { l: m.actualBoundingBoxLeft || 0, r: m.actualBoundingBoxRight || m.width, up: m.actualBoundingBoxAscent || size * .7, dn: m.actualBoundingBoxDescent || 0 };
    }
    if (a && b) {
      var size = R, A = ink(a, size), B = ink(b, size), gap = -size * .1;
      var w = (A.l + A.r) + (B.l + B.r) + gap, hgt = Math.max(A.up + A.dn, B.up + B.dn);
      var k = Math.min((R * 1.62) / w, (R * 1.3) / hgt);
      size *= k; A = ink(a, size); B = ink(b, size); gap *= k;
      w = (A.l + A.r) + (B.l + B.r) + gap;
      var left = cx - w / 2, base = cy + (Math.max(A.up, B.up) - Math.max(A.dn, B.dn)) / 2;
      g.font = size + "px " + font; g.lineWidth = size * .07;
      g.fillText(a, left + A.l, base - size * .05); g.strokeText(a, left + A.l, base - size * .05);
      g.fillText(b, left + A.l + A.r + gap + B.l, base + size * .05); g.strokeText(b, left + A.l + A.r + gap + B.l, base + size * .05);
      var amp = size * .46, P = ink("&", amp);
      g.font = amp + "px " + font; g.lineWidth = amp * .09;
      var ax = left + A.l + A.r + gap / 2 - (P.r - P.l) / 2 + P.l, ay = base + size * .2;
      g.save(); g.globalCompositeOperation = "destination-out"; g.lineWidth = amp * .26; g.strokeText("&", ax, ay); g.restore();
      g.fillText("&", ax, ay); g.strokeText("&", ax, ay);
    } else if (a || b) {
      var t = a || b, s1 = R, M = ink(t, s1);
      s1 *= Math.min((R * 1.2) / (M.l + M.r), (R * 1.25) / (M.up + M.dn));
      M = ink(t, s1);
      g.font = s1 + "px " + font; g.lineWidth = s1 * .05;
      g.fillText(t, cx - (M.l + M.r) / 2 + M.l, cy + (M.up - M.dn) / 2);
      g.strokeText(t, cx - (M.l + M.r) / 2 + M.l, cy + (M.up - M.dn) / 2);
    }
    g.restore();
  }

  /* ------------------------------------------------------------------- shading */
  function norm3(x, y, z) { var l = Math.sqrt(x * x + y * y + z * z) || 1; return [x / l, y / l, z / l]; }
  var MOON = norm3(-.62, -.5, .6);        // cool window light, upper left, in front
  var FILL = norm3(.75, .15, .35);         // faint bounce from the right
  var LAMP_ROOM = norm3(0, -.25, .9);

  // environment seen by the brass: returns [r,g,b] for a reflection direction
  function envCold(rx, ry, rz) {
    var k = Math.max(0, rx * MOON[0] + ry * MOON[1] + rz * MOON[2]);
    var f = Math.max(0, rx * FILL[0] + ry * FILL[1] + rz * FILL[2]);
    var sky = .5 - ry * .5;
    var r = .07 + .05 * sky, g = .06 + .045 * sky, b = .085 + .06 * sky;
    var s = Math.pow(k, 44) * 2.2 + Math.pow(k, 8) * .6 + Math.pow(k, 2) * .16;
    var fs = Math.pow(f, 10) * .16;
    return [r + s * .78 + fs * .62, g + s * .86 + fs * .45, b + s * 1.0 + fs * .52];
  }
  function envWarm(rx, ry, rz) {
    // the room around is now lit amber by the lantern: bright walls at the sides, a softer ceiling, a dim floor
    var side = 1 - Math.abs(ry);
    var up = Math.max(0, -ry), down = Math.max(0, ry);
    var base = .26 + .5 * side * side + .22 * up - .14 * down;
    var k = Math.max(0, rx * LAMP_ROOM[0] + ry * LAMP_ROOM[1] + rz * LAMP_ROOM[2]);
    var s = Math.pow(k, 30) * 1.3 + Math.pow(Math.max(0, rx * MOON[0] + ry * MOON[1] + rz * MOON[2]), 40) * .55;
    base *= .8 + .4 * vnoise(rx * 2.6 + 7, ry * 2.6 + rz * 1.7 + 3);
    return [base * 1.0 + s, base * .7 + s * .9, base * .36 + s * .72];
  }

  function render(opts) {
    var W = Math.max(120, Math.round(opts.px)), H = Math.round(W * ASPECT);
    var letters = opts.letters || [];
    var font = opts.font || "Georgia, serif";
    var U = W * .47, cx = W / 2;
    var rTab = profileTable(H);
    var Rref = U * .95, TW = Math.round(TAU * Rref), TH = H;
    var skin = buildSkin(TW, TH, U, Rref, letters, font, false);
    var holeD = skin.hole.getContext("2d").getImageData(0, 0, TW, TH).data;
    var softD = skin.holeSoft.getContext("2d").getImageData(0, 0, TW, TH).data;
    var relD = skin.relief.getContext("2d").getImageData(0, 0, TW, TH).data;

    var mk = function () { var c = document.createElement("canvas"); c.width = W; c.height = H; return c; };
    var cold = mk(), warm = mk(), glow = mk();
    var cI = cold.getContext("2d").createImageData(W, H), wI = warm.getContext("2d").createImageData(W, H), gI = glow.getContext("2d").createImageData(W, H);
    var C = cI.data, Wd = wI.data, G = gI.data;
    var flameX = cx, flameY = FLAME_V * H;
    var relAmp = U * .05;
    var brass = [1.0, .79, .44];

    for (var y = 0; y < H; y++) {
      var rr = rTab[y] * U;
      if (rr < .5) continue;
      var rPrev = rTab[Math.max(0, y - 1)] * U, rNext = rTab[Math.min(H - 1, y + 1)] * U;
      var dr = (rNext - rPrev) / 2;            // dr/dy in px per px
      var ty = y;
      for (var x = Math.floor(cx - rr - 1); x <= Math.ceil(cx + rr + 1); x++) {
        if (x < 0 || x >= W) continue;
        var dx = x + .5 - cx, ax = Math.abs(dx);
        var al = Math.min(1, Math.max(0, rr - ax + .5));
        if (al <= 0) continue;
        var u = Math.max(-.999, Math.min(.999, dx / rr));
        var th = Math.asin(u), ct = Math.cos(th);
        // base normal of the surface of revolution
        var nx = u, ny = -dr, nz = ct;
        // relief from the unwrapped skin
        var tx = Math.floor(((th / TAU + .5) % 1) * TW);
        var i4 = (ty * TW + tx) * 4;
        var txr = (tx + 1) % TW, txl = (tx - 1 + TW) % TW;
        var hx = (relD[(ty * TW + txr) * 4] - relD[(ty * TW + txl) * 4]) / 255 / 2;
        var hy = ((ty < TH - 1 ? relD[((ty + 1) * TW + tx) * 4] : relD[i4]) - (ty > 0 ? relD[((ty - 1) * TW + tx) * 4] : relD[i4])) / 255 / 2;
        nx -= hx * relAmp * ct; nz += hx * relAmp * u; ny -= hy * relAmp;
        var nl = Math.sqrt(nx * nx + ny * ny + nz * nz); nx /= nl; ny /= nl; nz /= nl;
        // reflection of the view ray (camera looks down -z)
        var rx = 2 * nz * nx, ry = 2 * nz * ny, rz = 2 * nz * nz - 1;
        var height = relD[i4] / 255;
        var cavity = height < .45 ? .45 + height : 1;          // dirt in the engraved grooves
        var patina = .86 + .22 * vnoise(tx * .05, ty * .05) - .08 * vnoise(tx * .21, ty * .17);
        var fres = .8 + .2 * Math.pow(1 - Math.max(0, nz), 3);
        var ec = envCold(rx, ry, rz), ew = envWarm(rx, ry, rz);
        var diffC = Math.max(0, nx * MOON[0] + ny * MOON[1] + nz * MOON[2]) * .07;
        var hole = holeD[i4] / 255, soft = softD[i4] / 255;
        var lip = Math.max(0, soft - hole) * (1 - hole);         // the cut edge around a piercing
        var o = (y * W + x) * 4;
        var kC = cavity * patina * fres, kW = cavity * patina * fres;
        // inside the lantern (seen through the holes): dark, a little warm in the lit version
        var inC = [.025, .018, .02], inW = [.09, .045, .02];
        var cr = (brass[0] * ec[0] + diffC) * kC, cg = (brass[1] * ec[1] + diffC * .8) * kC, cb = (brass[2] * ec[2] + diffC) * kC;
        var wr = brass[0] * ew[0] * kW, wg = brass[1] * ew[1] * kW, wb = brass[2] * ew[2] * kW;
        cr = cr * (1 - hole) + inC[0] * hole; cg = cg * (1 - hole) + inC[1] * hole; cb = cb * (1 - hole) + inC[2] * hole;
        wr = wr * (1 - hole) + inW[0] * hole; wg = wg * (1 - hole) + inW[1] * hole; wb = wb * (1 - hole) + inW[2] * hole;
        C[o] = tone(cr); C[o + 1] = tone(cg); C[o + 2] = tone(cb); C[o + 3] = al * 255;
        Wd[o] = tone(wr); Wd[o + 1] = tone(wg); Wd[o + 2] = tone(wb); Wd[o + 3] = al * 255;
        // emissive: the flame seen through the piercings, hottest close to the flame
        var fd = Math.sqrt(Math.pow((x - flameX) / U, 2) + Math.pow((y - flameY) / (U * 1.25), 2));
        var heat = Math.exp(-fd * fd * 2.2);
        var facing = .35 + .65 * ct;
        var e = hole * (.55 + .9 * heat) * facing + lip * .28 * (.4 + heat);
        if (e > .003) {
          G[o] = Math.min(255, 255 * e * 1.05);
          G[o + 1] = Math.min(255, 255 * e * (.62 + .36 * heat));
          G[o + 2] = Math.min(255, 255 * e * (.22 + .5 * heat * heat));
          G[o + 3] = Math.min(255, 255 * Math.min(1, e * 1.1)) * al;
        }
      }
    }
    // hanging ring on top (a torus facing the camera)
    var ringY = .028 * H, R0 = U * .07, rt = U * .02;
    for (y = Math.floor(ringY - R0 - rt - 1); y <= ringY + R0 + rt + 1; y++) {
      for (x = Math.floor(cx - R0 - rt - 1); x <= cx + R0 + rt + 1; x++) {
        var ddx = x + .5 - cx, ddy = y + .5 - ringY, d = Math.sqrt(ddx * ddx + ddy * ddy);
        var s = (d - R0) / rt;
        if (Math.abs(s) >= 1) continue;
        var q = Math.sqrt(1 - s * s), ux = ddx / (d || 1), uy = ddy / (d || 1);
        nx = ux * s; ny = uy * s; nz = q;
        rx = 2 * nz * nx; ry = 2 * nz * ny; rz = 2 * nz * nz - 1;
        ec = envCold(rx, ry, rz); ew = envWarm(rx, ry, rz);
        o = (y * W + x) * 4;
        var aa = Math.min(1, (1 - Math.abs(s)) * rt);
        C[o] = tone(brass[0] * ec[0]); C[o + 1] = tone(brass[1] * ec[1]); C[o + 2] = tone(brass[2] * ec[2]); C[o + 3] = 255 * aa;
        Wd[o] = tone(brass[0] * ew[0]); Wd[o + 1] = tone(brass[1] * ew[1]); Wd[o + 2] = tone(brass[2] * ew[2]); Wd[o + 3] = 255 * aa;
      }
    }
    cold.getContext("2d").putImageData(cI, 0, 0);
    warm.getContext("2d").putImageData(wI, 0, 0);
    glow.getContext("2d").putImageData(gI, 0, 0);

    // bloom: a soft halo of the glow layer
    var bloom = mk(), bg = bloom.getContext("2d");
    var small = document.createElement("canvas");
    small.width = Math.round(W / 10); small.height = Math.round(H / 10);
    var sm = small.getContext("2d");
    sm.drawImage(glow, 0, 0, small.width, small.height);
    var small2 = document.createElement("canvas");
    small2.width = Math.round(W / 5); small2.height = Math.round(H / 5);
    small2.getContext("2d").drawImage(small, 0, 0, small2.width, small2.height);
    bg.globalAlpha = 1; bg.drawImage(small2, 0, 0, W, H);
    bg.globalCompositeOperation = "lighter"; bg.globalAlpha = .7; bg.drawImage(small, 0, 0, W, H);

    // hole centres in 3D lantern units: flame at the origin, x right, y down, z towards the camera
    var holes = skin.holes.map(function (h) {
      var rad = radiusAt(h.v);
      return {
        x: rad * Math.sin(h.th), y: (h.v - FLAME_V) * H / U, z: rad * Math.cos(h.th),
        a: h.r / U, kind: h.kind, rot: h.rot
      };
    });
    return { cold: cold, warm: warm, glow: glow, bloom: bloom, holes: holes, flame: { x: flameX, y: flameY }, ring: { x: cx, y: ringY - R0 }, width: W, height: H, unit: U };
  }

  function tone(v) {
    // soft shoulder so speculars roll off instead of clipping
    var t = v / (1 + v * .35) * 1.25;
    return Math.min(255, Math.max(0, Math.pow(Math.max(0, t), 1 / 1.12) * 255));
  }

  /* chain tile: a front link (ring) above a side link (bar) */
  function chain(px) {
    var W = Math.max(8, Math.round(px)), H = Math.round(W * 2.4);
    var c = document.createElement("canvas"); c.width = W; c.height = H;
    var g = c.getContext("2d"), img = g.createImageData(W, H), D = img.data;
    var brass = [1.0, .74, .38];
    function put(x, y, nx, ny, nz, a) {
      var rx = 2 * nz * nx, ry = 2 * nz * ny, rz = 2 * nz * nz - 1, e = envCold(rx, ry, rz), o = (y * W + x) * 4;
      if (a * 255 <= D[o + 3]) return;
      D[o] = tone(brass[0] * e[0] * 1.15); D[o + 1] = tone(brass[1] * e[1] * 1.15); D[o + 2] = tone(brass[2] * e[2] * 1.15); D[o + 3] = 255 * a;
    }
    var rt = W * .16, ax = W / 2;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      // front oval link centred at H*.25
      var ex = (x + .5 - ax) / (W * .32), ey = (y + .5 - H * .27) / (H * .3);
      var d = Math.sqrt(ex * ex + ey * ey), s = (d - 1) * W * .32 / rt;
      if (Math.abs(s) < 1) { var q = Math.sqrt(1 - s * s); put(x, y, ex / (d || 1) * s, ey / (d || 1) * s, q, Math.min(1, (1 - Math.abs(s)) * rt * 1.5)); }
      // side link seen edge-on at H*.77 (a capsule)
      var by = y + .5 - H * .77, bx = x + .5 - ax, half = H * .26;
      var cyy = Math.max(-half, Math.min(half, by)), dd = Math.sqrt(bx * bx + (by - cyy) * (by - cyy));
      var s2 = dd / rt;
      if (s2 < 1) { var q2 = Math.sqrt(1 - s2 * s2); put(x, y, bx / rt, (by - cyy) / rt, q2, Math.min(1, (1 - s2) * rt * 1.5)); }
    }
    g.putImageData(img, 0, 0);
    return c;
  }

  window.QandilLantern = { render: render, chain: chain, ASPECT: ASPECT, FLAME_V: FLAME_V };
})();
