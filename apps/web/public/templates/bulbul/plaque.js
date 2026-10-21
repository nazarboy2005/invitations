/*
  Bulbul enamel plaque. Renders the oval plaque that hangs on the cage door: turquoise
  champlevé enamel over a guilloché ground, a raised gold rim and the couple's initials
  in raised gold, from a height field shaded with a normal map (same light as the baked cage:
  warm, from the window behind-right). Rendered once at runtime and cached.
  window.BulbulPlaque.render(canvas, { w, h, letters: ["J", "M"], font }) → canvas
*/
(function () {
  "use strict";

  function smooth(e0, e1, x) { var t = (x - e0) / (e1 - e0); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

  function letterMask(w, h, letters, font) {
    var m = document.createElement("canvas");
    m.width = w; m.height = h;
    var g = m.getContext("2d");
    g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
    g.fillStyle = g.strokeStyle = "#fff"; g.textBaseline = "alphabetic"; g.textAlign = "left"; g.lineJoin = "round";
    function ink(t, size) {
      g.font = size + "px " + font;
      var k = g.measureText(t);
      return { l: k.actualBoundingBoxLeft || 0, r: k.actualBoundingBoxRight || k.width, up: k.actualBoundingBoxAscent || size * .7, dn: k.actualBoundingBoxDescent || 0 };
    }
    var a = letters[0] || "", b = letters[1] || "", cx = w / 2, cy = h / 2;
    var boxW = w * .62, boxH = h * .5;
    if (a && b) {
      var size = h * .5, A = ink(a, size), B = ink(b, size), gap = size * .04;
      var tw = A.l + A.r + B.l + B.r + gap, th = Math.max(A.up + A.dn, B.up + B.dn);
      var k = Math.min(boxW / tw, boxH / th);
      size *= k; A = ink(a, size); B = ink(b, size); gap *= k;
      tw = A.l + A.r + B.l + B.r + gap;
      var left = cx - tw / 2, base = cy + (Math.max(A.up, B.up) - Math.max(A.dn, B.dn)) / 2;
      g.font = size + "px " + font; g.lineWidth = size * .03;
      g.fillText(a, left + A.l, base - size * .05); g.strokeText(a, left + A.l, base - size * .05);
      g.fillText(b, left + A.l + A.r + gap + B.l, base + size * .06); g.strokeText(b, left + A.l + A.r + gap + B.l, base + size * .06);
    } else if (a || b) {
      var t = a || b, s1 = h * .5, M = ink(t, s1);
      s1 *= Math.min(boxW * .7 / (M.l + M.r), boxH / (M.up + M.dn)); M = ink(t, s1);
      g.font = s1 + "px " + font; g.lineWidth = s1 * .03;
      g.fillText(t, cx - (M.l + M.r) / 2 + M.l, cy + (M.up - M.dn) / 2);
      g.strokeText(t, cx - (M.l + M.r) / 2 + M.l, cy + (M.up - M.dn) / 2);
    }
    var o = document.createElement("canvas");
    o.width = w; o.height = h;
    var og = o.getContext("2d");
    og.filter = "blur(" + Math.max(.5, w * .006) + "px)";
    og.drawImage(m, 0, 0);
    var sharp = g.getImageData(0, 0, w, h).data, soft = og.getImageData(0, 0, w, h).data;
    var res = { soft: new Float32Array(w * h), sharp: new Float32Array(w * h) };
    for (var i = 0; i < w * h; i++) { res.soft[i] = soft[i * 4] / 255; res.sharp[i] = sharp[i * 4] / 255; }
    return res;
  }

  function render(canvas, opts) {
    var w = Math.max(32, Math.round(opts.w)), h = Math.max(36, Math.round(opts.h));
    canvas.width = w; canvas.height = h;
    var mono = letterMask(w, h, opts.letters || [], opts.font || "Georgia, serif");
    var cx = w / 2, cy = h / 2, rx = w / 2 - .5, ry = h / 2 - .5;
    var N = w * h, H = new Float32Array(N), gold = new Float32Array(N), al = new Float32Array(N), guil = new Float32Array(N);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var i = y * w + x, u = (x + .5 - cx) / rx, v = (y + .5 - cy) / ry, r = Math.sqrt(u * u + v * v), a = Math.atan2(v, u);
      al[i] = smooth(1.0, .97, r);
      if (r > 1.01) continue;
      var dome = (1 - r * r) * .35;
      var rim = Math.exp(-Math.pow((r - .9) / .045, 2));          // raised gold rim
      var bead = r > .78 && r < .84 ? Math.pow(Math.max(0, Math.cos(a * 18)), 3) * smooth(.78, .8, r) * smooth(.84, .82, r) : 0;
      H[i] = dome + rim * .5 + bead * .22 + mono.soft[i] * .55 - smooth(.86, .97, r) * .1;
      gold[i] = Math.max(smooth(.25, .6, rim + bead * .9), smooth(.25, .65, mono.sharp[i] * .5 + mono.soft[i] * .5), smooth(.955, 1, r));
      // guilloché engraving seen through the enamel: concentric waves
      guil[i] = .5 + .5 * Math.sin(r * 46 + Math.sin(a * 9) * 1.6);
    }
    var ctx = canvas.getContext("2d"), img = ctx.createImageData(w, h), D = img.data;
    var Lx = .5, Ly = -.62, Lz = .6, n0 = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz); Lx /= n0; Ly /= n0; Lz /= n0;
    var Hx = Lx, Hy = Ly, Hz = Lz + 1, n1 = Math.sqrt(Hx * Hx + Hy * Hy + Hz * Hz); Hx /= n1; Hy /= n1; Hz /= n1;
    var amp = Math.min(w, h) * .09;
    for (y = 1; y < h - 1; y++) for (x = 1; x < w - 1; x++) {
      i = y * w + x;
      if (al[i] <= 0) continue;
      var nx = -(H[i + 1] - H[i - 1]) * .5 * amp, ny = -(H[i + w] - H[i - w]) * .5 * amp, nz = 1, nl = Math.sqrt(nx * nx + ny * ny + 1);
      nx /= nl; ny /= nl; nz /= nl;
      var diff = Math.max(0, nx * Lx + ny * Ly + nz * Lz), nh = Math.max(0, nx * Hx + ny * Hy + nz * Hz);
      var g = gold[i];
      // enamel: deep turquoise, lighter where the guilloché lifts, glassy specular
      var depth = .78 + .22 * guil[i];
      var er = (22 + 40 * guil[i]) * (.55 + .5 * diff), eg = (112 + 52 * guil[i]) * (.55 + .5 * diff) * depth, eb = (118 + 46 * guil[i]) * (.55 + .5 * diff) * depth;
      var es = Math.pow(nh, 90) * 1.4 + Math.pow(nh, 16) * .12;
      er += es * 255; eg += es * 250; eb += es * 240;
      // gold: reflection of a warm dawn sky
      var up = -(2 * nz * ny), t = Math.max(-1, Math.min(1, up));
      var gr = t > 0 ? 214 + 41 * t : 214 + 150 * t, gg = t > 0 ? 158 + 82 * t : 158 + 120 * t, gb = t > 0 ? 70 + 118 * t : 70 + 56 * t;
      var k = .3 + .8 * diff, gs = Math.pow(nh, 30) * 1.4;
      gr = gr * k + gs * 255; gg = gg * k + gs * 238; gb = gb * k + gs * 190;
      D[i * 4] = Math.min(255, er * (1 - g) + gr * g);
      D[i * 4 + 1] = Math.min(255, eg * (1 - g) + gg * g);
      D[i * 4 + 2] = Math.min(255, eb * (1 - g) + gb * g);
      D[i * 4 + 3] = al[i] * 255;
    }
    ctx.putImageData(img, 0, 0);
    return canvas;
  }

  window.BulbulPlaque = { render: render };
})();
