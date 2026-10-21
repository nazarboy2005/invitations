/*
  Shared helpers for the Ko‘zgu offline art bakes (frame, wall, room, curtain, foreground).
  Everything is a height field lit with a normal map, the same technique as templates/muhr.
  The light of the whole film: warm candles low in the room (key, from below) and a weak cool
  moon fill from the upper left.
*/
"use strict";
const K = {};
K.rng = function (seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
K.canvas = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
K.clamp = (x, a, b) => x < a ? a : x > b ? b : x;
K.smooth = (e0, e1, x) => { let t = (x - e0) / (e1 - e0); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };
K.mix = (a, b, t) => a + (b - a) * t;
K.mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
K.hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
/* piecewise colour ramp: stops = [[t, "#hex"], ...] */
K.ramp = function (stops) {
  const s = stops.map(([t, c]) => [t, K.hex(c)]);
  return t => {
    if (t <= s[0][0]) return s[0][1].slice();
    for (let i = 1; i < s.length; i++) if (t <= s[i][0]) return K.mix3(s[i - 1][1], s[i][1], (t - s[i - 1][0]) / (s[i][0] - s[i - 1][0]));
    return s[s.length - 1][1].slice();
  };
};
K.gray = function (c) {
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data, o = new Float32Array(c.width * c.height);
  for (let i = 0; i < o.length; i++) o[i] = d[i * 4] / 255;
  return o;
};
K.alphaOf = function (c) {
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data, o = new Float32Array(c.width * c.height);
  for (let i = 0; i < o.length; i++) o[i] = d[i * 4 + 3] / 255;
  return o;
};
K.blurred = function (src, px, w, h) {
  w = w || src.width; h = h || src.height;
  const c = K.canvas(w, h), g = c.getContext("2d");
  g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
  g.filter = `blur(${px}px)`; g.drawImage(src, 0, 0); return K.gray(c);
};
/* value noise upsampled from a coarse random grid (smooth, cheap) */
K.noise = function (w, h, cell, seed) {
  const r = K.rng(seed), sw = Math.ceil(w / cell) + 1, sh = Math.ceil(h / cell) + 1;
  const small = K.canvas(sw, sh), g = small.getContext("2d"), id = g.createImageData(sw, sh);
  for (let i = 0; i < sw * sh; i++) { const v = r() * 255; id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
  g.putImageData(id, 0, 0);
  const big = K.canvas(w, h), bg = big.getContext("2d"); bg.imageSmoothingQuality = "high";
  bg.drawImage(small, 0, 0, sw * cell, sh * cell);
  return K.gray(big);
};
K.fbm = function (w, h, cells, seed) {
  const out = new Float32Array(w * h); let amp = 1, tot = 0;
  cells.forEach((cell, k) => { const n = K.noise(w, h, cell, seed + k * 101); for (let i = 0; i < out.length; i++) out[i] += n[i] * amp; tot += amp; amp *= .55; });
  for (let i = 0; i < out.length; i++) out[i] /= tot;
  return out;
};
/* normal from a height field at index i (clamped at borders) */
K.normal = function (h, w, hgt, x, y, k) {
  const i = y * w + x;
  const xl = x > 0 ? i - 1 : i, xr = x < w - 1 ? i + 1 : i, yu = y > 0 ? i - w : i, yd = y < hgt - 1 ? i + w : i;
  let nx = -(h[xr] - h[xl]) * k, ny = -(h[yd] - h[yu]) * k, nz = 1;
  const l = Math.hypot(nx, ny, nz); return [nx / l, ny / l, nz / l];
};
K.norm = v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; };
K.dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/* the film's lights (screen space: +x right, +y down, +z towards the viewer) */
K.KEY = K.norm([.12, .62, .78]);      // warm candles, low and in front
K.FILL = K.norm([-.45, -.55, .7]);    // cool moon, upper left
K.HALF = K.norm([K.KEY[0], K.KEY[1], K.KEY[2] + 1]);
K.WARM = [1, .8, .56];
K.COOL = [.55, .62, .86];

/* antique gilding lit by candles: shared with mirror.js so the live crest matches the bake */
K.gold = function (n, ao, glow) {
  const diff = Math.max(0, K.dot(n, K.KEY)), fill = Math.max(0, K.dot(n, K.FILL));
  const spec = Math.pow(Math.max(0, K.dot(n, K.HALF)), 34), sheen = Math.pow(Math.max(0, K.dot(n, K.HALF)), 7);
  const env = .5 + .5 * n[1];                    // facing down sees the candles, up sees the dark ceiling
  const al = [206, 156, 84];
  const out = [0, 0, 0];
  for (let c = 0; c < 3; c++) {
    let v = al[c] * (.1 + .78 * diff * K.WARM[c] * (glow || 1) + .16 * fill * K.COOL[c] + .32 * env * env * K.WARM[c]);
    v += (spec * 1.05 + sheen * .14) * 255 * [1, .9, .7][c];
    out[c] = v;
  }
  const a = .42 + .58 * ao;                      // patina settles in the recesses
  const pat = [58, 34, 26];
  for (let c = 0; c < 3; c++) out[c] = Math.min(255, out[c] * a + pat[c] * (1 - a) * .6);
  return out;
};

/* ---------- ornament drawing (white = raised) ---------- */
K.leaf = function (g, x, y, ang, len, wid, flip, groove) {
  const f = flip ? -1 : 1;
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(1, f);
  g.beginPath(); g.moveTo(0, 0);
  g.bezierCurveTo(len * .22, wid * 1.15, len * .72, wid * .95, len, -wid * .12);
  g.bezierCurveTo(len * .7, -wid * .55, len * .3, -wid * .85, 0, 0);
  g.fillStyle = "#fff"; g.fill();
  if (groove !== false) {
    g.strokeStyle = "rgba(0,0,0,.8)"; g.lineCap = "round"; g.lineWidth = Math.max(1, wid * .1);
    g.beginPath(); g.moveTo(len * .06, wid * .05); g.quadraticCurveTo(len * .5, wid * .18, len * .9, -wid * .08); g.stroke();
  }
  g.restore();
};
K.petal = function (g, r, w) {
  g.beginPath(); g.moveTo(0, 0);
  g.bezierCurveTo(-w, -r * .35, -w * 1.05, -r * .92, -w * .25, -r);
  g.quadraticCurveTo(0, -r * .9, w * .25, -r);
  g.bezierCurveTo(w * 1.05, -r * .92, w, -r * .35, 0, 0);
};
K.rosette = function (g, x, y, r, n, rot) {
  g.save(); g.translate(x, y); g.rotate(rot || 0); g.fillStyle = "#fff"; g.strokeStyle = "rgba(0,0,0,.8)"; g.lineWidth = Math.max(1, r * .05);
  for (const [k, rr, ww, off] of [[n, r, r * .4, 0], [n, r * .62, r * .32, Math.PI / n]]) {
    for (let i = 0; i < k; i++) { g.save(); g.rotate(off + i * Math.PI * 2 / k); K.petal(g, rr, ww); g.fill(); g.stroke(); g.restore(); }
  }
  g.beginPath(); g.arc(0, 0, r * .2, 0, 7); g.fill(); g.stroke();
  g.restore();
};
/* tendril winding into a spiral */
K.curl = function (g, x, y, ang, size, dir, w) {
  g.save(); g.translate(x, y); g.rotate(ang); g.lineWidth = w; g.lineCap = "round"; g.strokeStyle = "#fff";
  const cx = size * .75, cy = -dir * size * .42, r0 = Math.hypot(cx, cy), a0 = Math.atan2(-cy, -cx);
  g.beginPath(); g.moveTo(0, 0);
  for (let t = 0; t <= 1.0001; t += .02) { const a = a0 + dir * t * Math.PI * 2.2, r = r0 * (1 - t * .78); g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
  g.stroke(); g.restore();
};
/* 8-point star girih tile field, used for carved plaster */
K.girih = function (g, x0, y0, w, h, cell, line) {
  g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
  g.strokeStyle = "#fff"; g.lineWidth = line; g.lineJoin = "round";
  for (let y = y0 - cell; y < y0 + h + cell; y += cell) for (let x = x0 - cell; x < x0 + w + cell; x += cell) {
    const cx = x + cell / 2, cy = y + cell / 2, R = cell * .36, r = cell * .2;
    g.beginPath();
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + Math.PI / 8, rr = i % 2 ? r : R; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    g.closePath(); g.stroke();
    g.beginPath(); g.moveTo(cx + R * Math.cos(Math.PI / 8), cy + R * Math.sin(Math.PI / 8)); g.lineTo(x + cell + cell / 2 - R * Math.cos(Math.PI / 8), cy + R * Math.sin(Math.PI / 8)); g.stroke();
    g.beginPath(); g.moveTo(cx + R * Math.sin(Math.PI / 8), cy + R * Math.cos(Math.PI / 8)); g.lineTo(cx + R * Math.sin(Math.PI / 8), y + cell + cell / 2 - R * Math.cos(Math.PI / 8)); g.stroke();
  }
  g.restore();
};
K.done = function () { window.RENDERED = true; };
window.KozguArt = K;
