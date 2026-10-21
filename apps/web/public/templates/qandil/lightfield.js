/*
  Qandil light field: one canvas that holds the dark room, the light the lantern throws through
  its piercings, and the night sky those light spots turn into.

  The room is a box seen in one-point perspective (back wall, ceiling, floor, side walls). Every
  piercing of the lantern is a ray from the flame; it is intersected with the box, and the spot is
  drawn as a star sprite whose affine frame comes from projecting two nearby rays onto the same
  wall, so spots stretch and grow on the ceiling and side walls the way real lantern light does.
  When the lantern swings, the flame moves and every ray tilts with it.
  Then each spot (and a few children born from it) flies to a place in the sky and shrinks into a
  twinkling star; the stars keep sliding gently with the lantern's swing.

  var L = new QandilLight(canvas, { lite })
  L.layout({ w, h, flameX, flameY, pivotY, unit })   unit = css px per lantern unit at the lantern
  L.setHoles(holes)
  L.draw(t, state)  state: { swing, spin, lit, focus, beams, room, moon, sky, cam:{y,s}, flicker }
*/
(function () {
  "use strict";

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function rnd(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  function sprite(size, kind, soft) {
    var c = document.createElement("canvas"); c.width = c.height = size;
    var g = c.getContext("2d"), r = size / 2;
    g.translate(r, r);
    if (kind === "star") {
      // an 8-point star of light, blurred by `soft`
      var core = document.createElement("canvas"); core.width = core.height = size;
      var k = core.getContext("2d"); k.translate(r, r);
      k.beginPath();
      for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8 - Math.PI / 2, rr = (i % 2 ? .5 : 1) * r * (.62 - soft * .12); k[i ? "lineTo" : "moveTo"](Math.cos(a) * rr, Math.sin(a) * rr); }
      k.closePath(); k.fillStyle = "#fff"; k.fill();
      g.translate(-r, -r);
      blurDraw(g, core, size, soft * size * .09 + size * .012);
      g.globalCompositeOperation = "source-over";
    } else {
      var gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
      var hard = 1 - soft;
      gr.addColorStop(0, "rgba(255,255,255,1)");
      gr.addColorStop(.25 + hard * .35, "rgba(255,255,255," + (.75 + hard * .2) + ")");
      gr.addColorStop(.55 + hard * .35, "rgba(255,255,255,.12)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
    }
    return c;
  }
  function blurDraw(g, src, size, r) {
    if ("filter" in g) { g.filter = "blur(" + r.toFixed(1) + "px)"; g.drawImage(src, 0, 0); g.filter = "none"; return; }
    var k = Math.max(1, Math.round(r)), s = document.createElement("canvas");
    s.width = s.height = Math.max(2, Math.round(size / k));
    s.getContext("2d").drawImage(src, 0, 0, s.width, s.height);
    g.drawImage(s, 0, 0, size, size);
  }
  function tint(src, rgb) {
    var c = document.createElement("canvas"); c.width = src.width; c.height = src.height;
    var g = c.getContext("2d"); g.drawImage(src, 0, 0);
    g.globalCompositeOperation = "source-in"; g.fillStyle = "rgb(" + rgb.join(",") + ")"; g.fillRect(0, 0, c.width, c.height);
    return c;
  }

  function QandilLight(canvas, opts) {
    this.c = canvas; this.g = canvas.getContext("2d");
    this.lite = !!(opts && opts.lite);
    this.dpr = 1; this.holes = []; this.stars = []; this.shoot = null; this.nextShoot = 6;
    var amber = [255, 196, 118];
    var S = 64;
    this.spr = {
      star: [0, .5, 1].map(function (s) { return tint(sprite(S, "star", s), amber); }),
      dot: [0, .5, 1].map(function (s) { return tint(sprite(S, "dot", s), amber); }),
      starW: tint(sprite(32, "dot", .4), [255, 244, 220]),
      beam: (function () {
        var c = document.createElement("canvas"); c.width = 256; c.height = 8;
        var g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 256, 0);
        gr.addColorStop(0, "rgba(255,200,120,.9)"); gr.addColorStop(.25, "rgba(255,190,110,.35)"); gr.addColorStop(1, "rgba(255,180,100,0)");
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(0, 4); g.lineTo(256, 0); g.lineTo(256, 8); g.closePath(); g.fill();
        return c;
      })()
    };
  }

  QandilLight.prototype.layout = function (o) {
    var dpr = Math.min(window.devicePixelRatio || 1, this.lite ? 1 : 1.5);
    this.dpr = dpr; this.w = o.w; this.h = o.h;
    this.c.width = Math.round(o.w * dpr); this.c.height = Math.round(o.h * dpr);
    this.fx = o.flameX; this.fy = o.flameY; this.pivotY = o.pivotY; this.unit = o.unit;
    // camera: the lantern (z = 0) is drawn at `unit` px per world unit
    var C = 6, D = 5.5, f = o.unit * C;
    var wr = o.w * .36 * (C + D) / f;
    var hc = (o.flameY - o.h * .1) * (C + D) / f, hf = (o.h * .8 - o.flameY) * (C + D) / f;
    this.room = { C: C, D: D, f: f, W: wr, Hc: hc, Hf: hf };
    this.back = { l: o.flameX - f * wr / (C + D), r: o.flameX + f * wr / (C + D), t: o.flameY - f * hc / (C + D), b: o.flameY + f * hf / (C + D) };
    this.paintRoom();
    this.placeStars();
  };

  QandilLight.prototype.project = function (x, y, z) {
    var R = this.room, k = R.f / (R.C - z);
    return [this.fx + x * k, this.fy + y * k];
  };

  /* ---------------------------------------------------------------- the room */
  QandilLight.prototype.paintRoom = function () {
    var w = this.w, h = this.h, B = this.back, self = this;
    var mk = function () { var c = document.createElement("canvas"); c.width = Math.round(w * self.dpr); c.height = Math.round(h * self.dpr); var g = c.getContext("2d"); g.scale(self.dpr, self.dpr); return [c, g]; };
    var planes = {
      ceil: [[0, 0], [w, 0], [B.r, B.t], [B.l, B.t]],
      floor: [[0, h], [B.l, B.b], [B.r, B.b], [w, h]],
      left: [[0, 0], [B.l, B.t], [B.l, B.b], [0, h]],
      right: [[w, 0], [w, h], [B.r, B.b], [B.r, B.t]],
      back: [[B.l, B.t], [B.r, B.t], [B.r, B.b], [B.l, B.b]]
    };
    var path = function (g, p) { g.beginPath(); p.forEach(function (q, i) { g[i ? "lineTo" : "moveTo"](q[0], q[1]); }); g.closePath(); };
    var noise = (function () {
      // plaster: soft mottling + fine grain, multiplied over the walls
      var n = document.createElement("canvas"); n.width = n.height = 160;
      var g = n.getContext("2d"), img = g.createImageData(160, 160), d = img.data, R = rnd(7);
      for (var i = 0; i < d.length; i += 4) { var v = 200 + R() * 55; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
      g.putImageData(img, 0, 0);
      var big = document.createElement("canvas"); big.width = big.height = 160;
      var bg = big.getContext("2d"); bg.drawImage(n, 0, 0, 20, 20); bg.imageSmoothingEnabled = true; bg.drawImage(big, 0, 0, 20, 20, 0, 0, 160, 160);
      g.globalCompositeOperation = "multiply"; g.globalAlpha = .9; g.drawImage(big, 0, 0);
      return n;
    })();

    // cold: the room before the lantern is lit, only moonlight from a lattice window on the left
    var cold = mk(), g = cold[1];
    g.fillStyle = "#0d0b13"; g.fillRect(0, 0, w, h);
    var base = { ceil: "#0b0912", floor: "#120d13", left: "#100c16", right: "#0d0a13", back: "#151019" };
    Object.keys(planes).forEach(function (k) { path(g, planes[k]); g.fillStyle = base[k]; g.fill(); });
    // depth: walls darken towards the camera
    var v = g.createRadialGradient(this.fx, this.fy, 0, this.fx, this.fy, Math.max(w, h) * .75);
    v.addColorStop(0, "rgba(40,30,48,.0)"); v.addColorStop(1, "rgba(0,0,0,.55)");
    g.fillStyle = v; g.fillRect(0, 0, w, h);
    // moonlight: an arched lattice window patch on the back wall and a long one on the floor
    this.moonPatch(g, B);
    // a carved niche around the lantern on the back wall
    this.niche(g, B, "rgba(150,160,200,.07)", "rgba(0,0,0,.35)");
    g.globalCompositeOperation = "multiply"; g.fillStyle = g.createPattern(noise, "repeat"); g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = "source-over";
    this.cornerLines(g, B, "rgba(150,140,170,.06)");

    // warm: the same room in the lantern's amber wash (spots are drawn live on top)
    var warm = mk(); g = warm[1];
    g.fillStyle = "#24130f"; g.fillRect(0, 0, w, h);
    var tone = { ceil: [70, 36, 20], floor: [48, 24, 14], left: [82, 42, 22], right: [76, 38, 20], back: [96, 50, 26] };
    var fx = this.fx, fy = this.fy;
    Object.keys(planes).forEach(function (k) {
      path(g, planes[k]);
      var t = tone[k], gr = g.createRadialGradient(fx, fy, 0, fx, fy, Math.max(w, h) * (k === "back" ? .55 : .8));
      gr.addColorStop(0, "rgb(" + t.map(function (c) { return Math.round(c * 1.7); }).join(",") + ")");
      gr.addColorStop(.45, "rgb(" + t.join(",") + ")");
      gr.addColorStop(1, "rgb(" + t.map(function (c) { return Math.round(c * .32); }).join(",") + ")");
      g.fillStyle = gr; g.fill();
    });
    this.niche(g, B, "rgba(255,200,130,.16)", "rgba(40,14,4,.45)");
    g.globalCompositeOperation = "multiply"; g.fillStyle = g.createPattern(noise, "repeat"); g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = "source-over";
    this.cornerLines(g, B, "rgba(255,190,120,.10)");
    this.roomCold = cold[0]; this.roomWarm = warm[0];
  };

  QandilLight.prototype.cornerLines = function (g, B, col) {
    // Separate plaster planes with broad tonal falloff rather than hard perspective
    // strokes. The old hairline box corners looked like a vector room outline.
    var w = this.w, h = this.h, warm = col.indexOf("255,190") >= 0;
    var shade = warm ? "rgba(27,10,5,.34)" : "rgba(0,0,8,.38)";
    function plane(points, grad) {
      g.save(); g.beginPath(); points.forEach(function (p, i) { g[i ? "lineTo" : "moveTo"](p[0], p[1]); }); g.closePath(); g.clip();
      g.fillStyle = grad; g.fillRect(0, 0, w, h); g.restore();
    }
    var left = g.createLinearGradient(0, 0, B.l, 0); left.addColorStop(0, shade); left.addColorStop(.72, "rgba(0,0,0,.08)"); left.addColorStop(1, "rgba(0,0,0,0)");
    plane([[0,0],[B.l,B.t],[B.l,B.b],[0,h]], left);
    var right = g.createLinearGradient(w, 0, B.r, 0); right.addColorStop(0, shade); right.addColorStop(.72, "rgba(0,0,0,.08)"); right.addColorStop(1, "rgba(0,0,0,0)");
    plane([[w,0],[w,h],[B.r,B.b],[B.r,B.t]], right);
    var ceil = g.createLinearGradient(0, 0, 0, B.t); ceil.addColorStop(0, shade); ceil.addColorStop(.78, "rgba(0,0,0,.04)"); ceil.addColorStop(1, "rgba(0,0,0,0)");
    plane([[0,0],[w,0],[B.r,B.t],[B.l,B.t]], ceil);
    var floor = g.createLinearGradient(0, h, 0, B.b); floor.addColorStop(0, shade); floor.addColorStop(.8, "rgba(0,0,0,.03)"); floor.addColorStop(1, "rgba(0,0,0,0)");
    plane([[0,h],[B.l,B.b],[B.r,B.b],[w,h]], floor);
    var back = g.createRadialGradient(this.fx, this.fy, 0, this.fx, this.fy, Math.max(w,h)*.48);
    back.addColorStop(0, "rgba(255,214,155,.045)"); back.addColorStop(1, "rgba(0,0,0,.14)");
    plane([[B.l,B.t],[B.r,B.t],[B.r,B.b],[B.l,B.b]], back);
  };

  QandilLight.prototype.niche = function (g, B, lit, shade) {
    var cx = (B.l + B.r) / 2, hw = (B.r - B.l) * .3, top = B.t + (B.b - B.t) * .02, spring = B.t + (B.b - B.t) * .3, bot = B.b;
    var arch = function (o) {
      g.beginPath();
      g.moveTo(cx - hw - o, bot); g.lineTo(cx - hw - o, spring);
      g.bezierCurveTo(cx - hw - o, spring - (spring - top) * .55, cx - hw * .3, top + (spring - top) * .2 - o, cx, top - o);
      g.bezierCurveTo(cx + hw * .3, top + (spring - top) * .2 - o, cx + hw + o, spring - (spring - top) * .55, cx + hw + o, spring);
      g.lineTo(cx + hw + o, bot);
    };
    g.save();
    arch(0); g.closePath(); g.fillStyle = shade; g.globalAlpha = .55; g.fill(); g.globalAlpha = 1;
    g.lineWidth = 2; g.strokeStyle = lit; arch(3); g.stroke();
    g.lineWidth = 1; arch(9); g.stroke();
    g.restore();
  };

  QandilLight.prototype.moonPatch = function (g, B) {
    // lattice window seen as light on the back wall (left of the niche), sheared by the moon's angle
    var bw = B.r - B.l, bh = B.b - B.t;
    var draw = function (x0, y0, ww, hh, shearX, alpha) {
      var c = document.createElement("canvas"); c.width = 120; c.height = 200;
      var k = c.getContext("2d");
      k.fillStyle = "#fff";
      k.beginPath(); k.moveTo(0, 200); k.lineTo(0, 70); k.bezierCurveTo(0, 30, 40, 18, 60, 0); k.bezierCurveTo(80, 18, 120, 30, 120, 70); k.lineTo(120, 200); k.closePath(); k.fill();
      // girih-like lattice: diagonal bars and small square knots
      k.globalCompositeOperation = "destination-out"; k.lineWidth = 6;
      for (var i = -200; i < 320; i += 30) { k.beginPath(); k.moveTo(i, 0); k.lineTo(i + 200, 200); k.stroke(); k.beginPath(); k.moveTo(i + 200, 0); k.lineTo(i, 200); k.stroke(); }
      k.lineWidth = 4; k.beginPath(); k.moveTo(60, 0); k.lineTo(60, 200); k.stroke();
      var soft = document.createElement("canvas"); soft.width = 120; soft.height = 200;
      blurDraw(soft.getContext("2d"), c, 200, 2.2);
      var t = tint(soft, [168, 186, 235]);
      g.save(); g.globalAlpha = alpha; g.globalCompositeOperation = "lighter";
      g.translate(x0, y0); g.transform(1, 0, shearX, 1, 0, 0);
      g.drawImage(t, 0, 0, ww, hh);
      g.restore();
    };
    draw(B.l + bw * .02, B.t + bh * .2, bw * .2, bh * .5, -.18, .2);
    // floor patch, foreshortened
    var fl = this.back.b;
    g.save(); g.globalAlpha = .14; g.globalCompositeOperation = "lighter";
    var grd = g.createLinearGradient(0, fl, 0, this.h);
    grd.addColorStop(0, "rgba(160,180,230,.6)"); grd.addColorStop(1, "rgba(160,180,230,0)");
    g.fillStyle = grd;
    g.beginPath(); g.moveTo(B.l + bw * .05, fl + 2); g.lineTo(B.l + bw * .32, fl + 2); g.lineTo(this.w * .55, this.h); g.lineTo(-this.w * .1, this.h); g.closePath(); g.fill();
    g.restore();
  };

  /* ------------------------------------------------------------- light spots */
  QandilLight.prototype.setHoles = function (holes) {
    var R = rnd(42), list = [];
    holes.forEach(function (h) {
      var l = Math.sqrt(h.x * h.x + h.y * h.y + h.z * h.z) || 1;
      list.push({ dx: h.x / l, dy: h.y / l, dz: h.z / l, a: (h.a / l) * 1.15, kind: h.kind === "star" ? "star" : "dot", rot: h.rot, ph: R() * 6.28 });
    });
    if (this.lite) list = list.filter(function (_, i) { return i % 2 === 0; });
    this.holes = list;
    this.placeStars();
  };

  QandilLight.prototype.placeStars = function () {
    if (!this.w || !this.holes.length) return;
    var R = rnd(1405), n = this.lite ? 140 : 330, w = this.w, h = this.h, list = [];
    for (var i = 0; i < n; i++) {
      // denser and smaller towards the zenith, a clear band around the names is not needed: stars are faint
      var y = Math.pow(R(), 1.35) * h * .66;
      var mag = R();
      list.push({
        parent: i % this.holes.length, x: R() * w, y: y,
        size: .7 + Math.pow(mag, 3) * 2.6, alpha: .35 + mag * .65,
        delay: R() * .55, ph: R() * 6.28, sp: .6 + R() * 1.8, depth: .3 + R() * .7,
        warm: R() < .25, born: i >= this.holes.length
      });
    }
    this.stars = list;
  };

  // intersect a ray from F along d with the room box → { p:[x,y,z], plane } or null
  QandilLight.prototype.hit = function (F, d, only) {
    var R = this.room, best = 1e9, plane = -1;
    var tests = [
      [0, -R.W, -1], [0, R.W, 1], [1, -R.Hc, -1], [1, R.Hf, 1], [2, -R.D, -1]
    ];
    for (var i = 0; i < tests.length; i++) {
      if (only != null && only !== i) continue;
      var ax = tests[i][0], val = tests[i][1], dir = d[ax];
      if (dir * tests[i][2] <= 1e-6) continue;
      var t = (val - F[ax]) / dir;
      if (t > 0 && t < best) { best = t; plane = i; }
    }
    if (plane < 0) return null;
    var p = [F[0] + d[0] * best, F[1] + d[1] * best, F[2] + d[2] * best];
    if (p[2] > R.C - .6) return null;
    return { p: p, plane: plane, t: best };
  };

  QandilLight.prototype.draw = function (t, s) {
    var g = this.g, w = this.w, h = this.h, dpr = this.dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    var cam = s.cam || { y: 0, s: 1 };
    var camT = function () { g.setTransform(dpr * cam.s, 0, 0, dpr * cam.s, dpr * (w / 2 - w / 2 * cam.s), dpr * cam.y); };

    // the room (fades away as the sky takes over)
    if (s.room > .002) {
      camT();
      g.globalAlpha = s.room;
      g.drawImage(this.roomCold, 0, 0, w, h);
      if (s.lit > .002) { g.globalAlpha = s.room * clamp(s.lit, 0, 1) * (.92 + .08 * (s.flicker || 1)); g.drawImage(this.roomWarm, 0, 0, w, h); }
      g.globalAlpha = 1;
    }

    // flame position in world units (the lantern swings around the pivot above it)
    var Lp = (this.fy - this.pivotY) / this.unit;
    var sw = s.swing || 0, sp = s.spin || 0;
    var F = [Math.sin(sw) * Lp, (1 - Math.cos(sw)) * Lp, 0];
    var cs = Math.cos(sw), sn = Math.sin(sw), cp = Math.cos(sp), spn = Math.sin(sp);
    var spots = this._spots || (this._spots = []);
    spots.length = 0;
    var lit = clamp(s.lit, 0, 1.4) * (s.flicker || 1);
    var showSpots = lit > .01 && (s.room > .01 || s.sky < 1);
    var stretch = s.stretch == null ? 1 : s.stretch;

    if (showSpots) {
      camT();
      g.globalCompositeOperation = "lighter";
      var focus = clamp(s.focus == null ? 1 : s.focus, 0, 1);
      for (var i = 0; i < this.holes.length; i++) {
        var H = this.holes[i];
        // spin about the vertical axis, then tilt with the swing (rotation in the x–y plane)
        var x0 = H.dx * cp + H.dz * spn, z0 = -H.dx * spn + H.dz * cp, y0 = H.dy;
        var d = [x0 * cs - y0 * sn, x0 * sn + y0 * cs, z0];
        var hit = this.hit(F, d);
        if (!hit) { spots.push(null); continue; }
        // two neighbour rays on the same wall give the spot's footprint
        var up = Math.abs(d[1]) > .95 ? [1, 0, 0] : [0, 1, 0];
        var e1 = norm(cross(d, up)), e2 = cross(d, e1);
        var a = H.a * (1.25 - .25 * focus) * stretch;
        var h1 = this.hit(F, norm([d[0] + e1[0] * a, d[1] + e1[1] * a, d[2] + e1[2] * a]), hit.plane);
        var h2 = this.hit(F, norm([d[0] + e2[0] * a, d[1] + e2[1] * a, d[2] + e2[2] * a]), hit.plane);
        if (!h1 || !h2) { spots.push(null); continue; }
        var P0 = this.project(hit.p[0], hit.p[1], hit.p[2]), P1 = this.project(h1.p[0], h1.p[1], h1.p[2]), P2 = this.project(h2.p[0], h2.p[1], h2.p[2]);
        var ax = P1[0] - P0[0], ay = P1[1] - P0[1], bx = P2[0] - P0[0], by = P2[1] - P0[1];
        var area = Math.abs(ax * by - ay * bx);
        if (area > w * h * .02) { spots.push(null); continue; }
        var dist = hit.t;
        var inten = clamp(2.6 / (1 + dist * dist * .045), 0, 1) * lit;
        var blur = clamp((1 - focus) * 2 + dist * .06, 0, 2);
        spots.push({ x: P0[0], y: P0[1], r: Math.sqrt(area), i: inten });
        if (s.room < .01) continue;
        g.globalAlpha = clamp(inten * s.room * (.85 + .15 * Math.sin(t * 2 + H.ph)), 0, 1);
        var spr = this.spr[H.kind][Math.round(blur)];
        g.setTransform(dpr * cam.s * ax, dpr * cam.s * ay, dpr * cam.s * bx, dpr * cam.s * by, dpr * (w / 2 - w / 2 * cam.s + P0[0] * cam.s), dpr * (cam.y + P0[1] * cam.s));
        g.drawImage(spr, -1.15, -1.15, 2.3, 2.3);
      }
      // dusty god-rays from the lantern to each spot
      if (s.beams > .01 && !this.lite) {
        var fs = this.project(F[0], F[1], 0);
        for (i = 0; i < spots.length; i++) {
          var p = spots[i]; if (!p) continue;
          var vx = p.x - fs[0], vy = p.y - fs[1], len = Math.sqrt(vx * vx + vy * vy);
          if (len < 20) continue;
          var wdt = Math.min(26, 2 + p.r * .5);
          g.globalAlpha = clamp(s.beams * s.room * p.i * .16, 0, .25);
          var cx = vx / len, cy = vy / len;
          g.setTransform(dpr * cam.s * cx * len / 256, dpr * cam.s * cy * len / 256, -dpr * cam.s * cy * wdt / 8, dpr * cam.s * cx * wdt / 8,
            dpr * (w / 2 - w / 2 * cam.s + fs[0] * cam.s), dpr * (cam.y + fs[1] * cam.s));
          g.drawImage(this.spr.beam, 0, -4);
        }
      }
      g.globalCompositeOperation = "source-over";
    }

    // stars: born from the spots, flying to their places in the sky
    if (s.sky > .001 && this.stars.length) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.globalCompositeOperation = "lighter";
      var drift = Math.sin(sw) * this.unit * 2.2;   // the sky's stars still slide with the swing
      var camY = cam.y, csx = cam.s;
      for (i = 0; i < this.stars.length; i++) {
        var st = this.stars[i];
        var m = smooth((s.sky - st.delay) / .45);
        if (m <= 0) continue;
        var tw = .62 + .38 * Math.sin(t * st.sp + st.ph);
        var tx = st.x + drift * st.depth * .35, ty = st.y + (s.skyY || 0) * st.depth;
        var sx = tx, sy = ty, size = st.size * (st.warm ? 1.1 : 1), alpha = st.alpha * tw;
        if (m < 1) {
          var par = spots[st.parent];
          var ox = par ? w / 2 - w / 2 * csx + par.x * csx : this.fx, oy = par ? camY + par.y * csx : this.fy;
          var e = m * m * (3 - 2 * m);
          sx = ox + (tx - ox) * e; sy = oy + (ty - oy) * e;
          size = (par ? Math.min(14, par.r * .4) : 4) * (1 - e) + size * e;
          alpha = (st.born ? clamp(m * 4, 0, 1) : 1) * ((par ? par.i : .6) * (1 - e) + alpha * e);
        }
        g.globalAlpha = clamp(alpha, 0, 1);
        var sz = size * 2.6;
        g.drawImage(m < 1 || st.warm ? this.spr.dot[1] : this.spr.starW, sx - sz / 2, sy - sz / 2, sz, sz);
      }
      // a shooting star now and then
      if (s.sky >= 1 && s.shooting) this.shootingStar(g, t);
      g.globalCompositeOperation = "source-over";
    }
    g.globalAlpha = 1;
    g.setTransform(1, 0, 0, 1, 0, 0);
  };

  QandilLight.prototype.shootingStar = function (g, t) {
    if (!this.shoot) {
      if (t < this.nextShoot) return;
      var R = Math.random;
      this.shoot = { t0: t, x: this.w * (.15 + R() * .7), y: this.h * (.04 + R() * .2), ang: .35 + R() * .5, dir: R() < .5 ? -1 : 1, len: 90 + R() * 70 };
    }
    var S = this.shoot, k = (t - S.t0) / 1.1;
    if (k >= 1) { this.shoot = null; this.nextShoot = t + 7 + Math.random() * 7; return; }
    var dx = Math.cos(S.ang) * S.dir, dy = Math.sin(S.ang), dist = k * 260;
    var hx = S.x + dx * dist, hy = S.y + dy * dist;
    var gr = g.createLinearGradient(hx, hy, hx - dx * S.len, hy - dy * S.len);
    var a = Math.sin(Math.PI * k);
    gr.addColorStop(0, "rgba(255,246,225," + (.9 * a) + ")"); gr.addColorStop(1, "rgba(255,220,170,0)");
    g.globalAlpha = 1; g.strokeStyle = gr; g.lineWidth = 1.4; g.lineCap = "round";
    g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx - dx * S.len, hy - dy * S.len); g.stroke();
  };

  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(v) { var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }

  window.QandilLight = QandilLight;
})();
