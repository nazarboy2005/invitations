/*
  Muhr wax seal renderer. Draws a lit, glossy wax seal with the couple's initials
  pressed in gold onto a canvas: a height field (scalloped wax blob, pressed disc,
  gold ring, raised monogram) shaded with a normal map, plus a soft cast shadow.
  window.MuhrSeal.render(canvas, { px, letters: ["J", "M"], font }) → canvas
*/
(function () {
  "use strict";

  function smooth(e0, e1, x) {
    var t = (x - e0) / (e1 - e0);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  }

  function edgeRadius(R, a) {
    return R * (1 + .042 * Math.sin(9 * a + .6) + .018 * Math.sin(5 * a + 2.1) + .011 * Math.sin(17 * a + .3) + .008 * Math.sin(23 * a + 1.7));
  }

  function monogramMask(S, R, letters, font) {
    var m = document.createElement("canvas");
    m.width = m.height = S;
    var g = m.getContext("2d");
    g.fillStyle = "#000";
    g.fillRect(0, 0, S, S);
    g.fillStyle = "#fff";
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    var c = S / 2;
    var a = letters[0] || "", b = letters[1] || "";
    g.textAlign = "left";
    function ink(t, size) {
      g.font = size + "px " + font;
      var m = g.measureText(t);
      return { l: m.actualBoundingBoxLeft || 0, r: m.actualBoundingBoxRight || m.width, up: m.actualBoundingBoxAscent || size * .7, dn: m.actualBoundingBoxDescent || 0 };
    }
    if (a && b) {
      // place letters by their ink boxes so swashes of any script font stay inside the ring
      var size = R;
      var A = ink(a, size), B = ink(b, size), gap = -size * .14;
      var w = (A.l + A.r) + (B.l + B.r) + gap, hgt = Math.max(A.up + A.dn, B.up + B.dn);
      var k = Math.min((R * 1.5) / w, (R * 1.22) / hgt);
      size *= k; A = ink(a, size); B = ink(b, size); gap *= k;
      w = (A.l + A.r) + (B.l + B.r) + gap;
      var left = c - w / 2, base = c + (Math.max(A.up, B.up) - Math.max(A.dn, B.dn)) / 2;
      g.font = size + "px " + font;
      g.strokeStyle = "#fff"; g.lineJoin = "round"; g.lineWidth = size * .022;
      g.fillText(a, left + A.l, base - size * .04); g.strokeText(a, left + A.l, base - size * .04);
      g.fillText(b, left + A.l + A.r + gap + B.l, base + size * .05); g.strokeText(b, left + A.l + A.r + gap + B.l, base + size * .05);
      var amp = size * .42, P = ink("&", amp);
      g.font = amp + "px " + font; g.lineWidth = amp * .03;
      var ax = left + A.l + A.r + gap / 2 - (P.r - P.l) / 2 + P.l, ay = base + size * .16;
      // clear a halo so the ampersand reads over the overlapping capitals
      g.save(); g.globalCompositeOperation = "destination-out"; g.lineWidth = amp * .2; g.strokeText("&", ax, ay); g.restore();
      g.fillText("&", ax, ay); g.strokeText("&", ax, ay);
    } else if (a || b) {
      var t = a || b, s1 = R, M = ink(t, s1);
      s1 *= Math.min((R * 1.15) / (M.l + M.r), (R * 1.1) / (M.up + M.dn));
      M = ink(t, s1);
      g.font = s1 + "px " + font;
      g.strokeStyle = "#fff"; g.lineWidth = s1 * .022;
      g.fillText(t, c - (M.l + M.r) / 2 + M.l, c + (M.up - M.dn) / 2);
      g.strokeText(t, c - (M.l + M.r) / 2 + M.l, c + (M.up - M.dn) / 2);
    }
    // soften to a rounded relief profile
    var out = document.createElement("canvas");
    out.width = out.height = S;
    var o = out.getContext("2d");
    o.fillStyle = "#000";
    o.fillRect(0, 0, S, S);
    o.filter = "blur(" + Math.max(.6, S * .0028) + "px)";
    o.drawImage(m, 0, 0);
    var sharp = m.getContext("2d").getImageData(0, 0, S, S).data;
    var soft = o.getImageData(0, 0, S, S).data;
    var res = { soft: new Float32Array(S * S), sharp: new Float32Array(S * S) };
    for (var i = 0; i < S * S; i++) { res.soft[i] = soft[i * 4] / 255; res.sharp[i] = sharp[i * 4] / 255; }
    return res;
  }

  function render(canvas, opts) {
    var S = Math.max(64, Math.round(opts.px));
    var letters = opts.letters || [];
    var font = opts.font || "Georgia, serif";
    canvas.width = canvas.height = S;
    var c = S / 2, R = S * .4;
    var mono = monogramMask(S, R, letters, font);

    var h = new Float32Array(S * S), gold = new Float32Array(S * S), alpha = new Float32Array(S * S), press = new Float32Array(S * S);
    for (var y = 0; y < S; y++) {
      for (var x = 0; x < S; x++) {
        var i = y * S + x, dx = x - c + .5, dy = y - c + .5;
        var r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
        var d = edgeRadius(R, a) - r;
        alpha[i] = smooth(-R * .012, R * .012, d);
        if (d < -R * .03) continue;
        var dome = Math.pow(smooth(-R * .03, R * .22, d), .75);
        var rim = Math.exp(-Math.pow((d - R * .1) / (R * .07), 2)) * .1;
        var p = smooth(R * .73, R * .66, r);
        var ring = Math.exp(-Math.pow((r - R * .6) / (R * .014), 2));
        var wobble = .018 * Math.sin(dx * .05 + dy * .03) + .012 * Math.sin(dy * .07 - dx * .02);
        h[i] = dome + rim - p * .3 + ring * .07 * p + mono.soft[i] * .2 * p + wobble * dome;
        gold[i] = Math.max(smooth(.25, .6, mono.sharp[i] * .5 + mono.soft[i] * .5), smooth(.3, .7, ring)) * p;
        press[i] = p;
      }
    }

    var tmp = document.createElement("canvas");
    tmp.width = tmp.height = S;
    var tg = tmp.getContext("2d"), img = tg.createImageData(S, S), D = img.data;
    var Lx = -.46, Ly = -.6, Lz = .65, ln = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz);
    Lx /= ln; Ly /= ln; Lz /= ln;
    var Hx = Lx, Hy = Ly, Hz = Lz + 1, hn = Math.sqrt(Hx * Hx + Hy * Hy + Hz * Hz);
    Hx /= hn; Hy /= hn; Hz /= hn;
    var amp = R * .16;
    for (y = 1; y < S - 1; y++) {
      for (x = 1; x < S - 1; x++) {
        i = y * S + x;
        var al = alpha[i];
        if (al <= 0) continue;
        var nx = -(h[i + 1] - h[i - 1]) * .5 * amp, ny = -(h[i + S] - h[i - S]) * .5 * amp, nz = 1;
        var nl = Math.sqrt(nx * nx + ny * ny + 1);
        nx /= nl; ny /= nl; nz /= nl;
        var diff = Math.max(0, nx * Lx + ny * Ly + nz * Lz);
        var nh = Math.max(0, nx * Hx + ny * Hy + nz * Hz);
        var gm = gold[i];
        // wax: deep garnet, glossy, a little translucent at the thin rim
        var thin = 1 - Math.min(1, h[i] * 1.6);
        var dark = .82 + .18 * (1 - press[i]);
        var wr = (118 * dark) * (.3 + .95 * diff) + 70 * thin, wg = (14 * dark) * (.3 + .95 * diff) + 6 * thin, wb = (30 * dark) * (.3 + .95 * diff) + 10 * thin;
        var ws = Math.pow(nh, 70) * 1.05 + Math.pow(nh, 14) * .12;
        wr += ws * 255; wg += ws * 225; wb += ws * 228;
        // gold leaf: metallic, coloured reflections from a warm environment
        var env = .55 + .45 * (-ny) + .25 * (-nx);
        var gs = Math.pow(nh, 22) * 1.1;
        var gr = 200 * (.22 + .7 * diff) * env + gs * 255, gg = 152 * (.22 + .7 * diff) * env + gs * 236, gb = 82 * (.22 + .7 * diff) * env + gs * 180;
        D[i * 4] = Math.min(255, wr * (1 - gm) + gr * gm);
        D[i * 4 + 1] = Math.min(255, wg * (1 - gm) + gg * gm);
        D[i * 4 + 2] = Math.min(255, wb * (1 - gm) + gb * gm);
        D[i * 4 + 3] = al * 255;
      }
    }
    tg.putImageData(img, 0, 0);

    // cast shadow, then the seal
    var g = canvas.getContext("2d");
    g.clearRect(0, 0, S, S);
    g.save();
    g.filter = "blur(" + (S * .022) + "px)";
    g.globalAlpha = .55;
    g.translate(S * .012, S * .035);
    g.drawImage(tmp, 0, 0);
    g.globalCompositeOperation = "source-in";
    g.fillStyle = "#2a0d0a";
    g.fillRect(-S, -S, S * 3, S * 3);
    g.restore();
    g.drawImage(tmp, 0, 0);
    return canvas;
  }

  window.MuhrSeal = { render: render };
})();
