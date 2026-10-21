/*
  Doira renderer.
  - DoiraDrum.render({ px, letters, font }) paints the frame drum seen from above from a
    height field lit with a normal map: goatskin (fibres, mottling, a darker glued band),
    a walnut rim with bone inlay, and a gold-leaf rosette with the couple's monogram.
    Returns { color, maps }: the lit image and a data map (R = skin, G = gold leaf,
    B = how thin the skin is, i.e. how much light passes through it from behind).
  - DoiraDrum.skin(canvas, art) puts that image on a WebGL surface that ripples where it is
    struck and glows from behind (uniform "glow"); falls back to a plain 2D draw.
  - DoiraDrum.ringSprite(px) / coinSprite(px): small metal sprites for the jingle rings
    and the coins they turn into.
*/
(function () {
  "use strict";

  var RIM_IN = .885;      // skin edge / inner edge of the wooden frame, in units of the outer radius
  var BAND_IN = .80;      // start of the darker glued band of skin

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function smooth(e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  function mk(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h || w; return c; }
  function rng(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  // smooth value noise from upscaled random tiles (the GPU does the interpolation)
  function noiseField(S, octaves, seed, stretchX, stretchY) {
    var r = rng(seed), out = mk(S), g = out.getContext("2d");
    g.fillStyle = "#808080"; g.fillRect(0, 0, S, S);
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    var amp = .55;
    for (var o = 0; o < octaves.length; o++) {
      var n = octaves[o], t = mk(Math.max(2, Math.round(n * (stretchX || 1))), Math.max(2, Math.round(n * (stretchY || 1)))), tg = t.getContext("2d"), id = tg.createImageData(t.width, t.height);
      for (var i = 0; i < id.data.length; i += 4) { var v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
      tg.putImageData(id, 0, 0);
      g.globalAlpha = amp; g.drawImage(t, 0, 0, S, S); amp *= .62;
    }
    g.globalAlpha = 1;
    var d = g.getImageData(0, 0, S, S).data, f = new Float32Array(S * S);
    for (var k = 0; k < S * S; k++) f[k] = d[k * 4] / 255 - .5;
    return f;
  }

  /* ---------------------------------------------------- the painted rosette */
  function rosette(S, R, letters, font) {
    var c = mk(S), g = c.getContext("2d"), cx = S / 2, cy = S / 2;
    g.fillStyle = "#000"; g.fillRect(0, 0, S, S);
    g.fillStyle = g.strokeStyle = "#fff"; g.lineJoin = "round"; g.lineCap = "round";
    function ring(r, w) { g.lineWidth = w * R; g.beginPath(); g.arc(cx, cy, r * R, 0, Math.PI * 2); g.stroke(); }
    function dot(x, y, r) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
    ring(.748, .022); ring(.71, .008);
    // dotted ring on the glued band
    for (var i = 0; i < 72; i++) { var a = i / 72 * Math.PI * 2; dot(cx + Math.cos(a) * .778 * R, cy + Math.sin(a) * .778 * R, .0095 * R); }
    // sixteen almond petals (bodom), alternating long and short, hollow with a seed inside
    for (i = 0; i < 16; i++) {
      var long = i % 2 === 0, r0 = .51, r1 = long ? .695 : .64, w = long ? .085 : .062;
      g.save(); g.translate(cx, cy); g.rotate(i / 16 * Math.PI * 2);
      var petal = function (rr0, rr1, ww) {
        g.beginPath(); g.moveTo(0, -rr0 * R);
        g.bezierCurveTo(ww * R, -(rr0 + (rr1 - rr0) * .3) * R, ww * .7 * R, -(rr0 + (rr1 - rr0) * .8) * R, 0, -rr1 * R);
        g.bezierCurveTo(-ww * .7 * R, -(rr0 + (rr1 - rr0) * .8) * R, -ww * R, -(rr0 + (rr1 - rr0) * .3) * R, 0, -rr0 * R);
      };
      g.fillStyle = "#fff"; petal(r0, r1, w); g.fill();
      g.fillStyle = "#000"; petal(r0 + .045, r1 - .045, w * .38); g.fill();
      g.fillStyle = "#fff"; dot(0, -(r0 + (r1 - r0) * .52) * R, .014 * R);
      if (!long) dot(0, -(r1 + .03) * R, .009 * R);
      g.restore();
    }
    ring(.5, .02);
    // eight-pointed star (two squares) as a band, dots on its points
    g.save(); g.translate(cx, cy);
    for (var sq = 0; sq < 2; sq++) {
      g.save(); g.rotate(sq * Math.PI / 4 + Math.PI / 8);
      var s = .335 * R; g.lineWidth = .026 * R; g.strokeRect(-s, -s, s * 2, s * 2);
      g.lineWidth = .007 * R; s *= .885; g.strokeRect(-s, -s, s * 2, s * 2);
      g.restore();
    }
    for (i = 0; i < 8; i++) { a = i / 8 * Math.PI * 2 + Math.PI / 8 + Math.PI / 4; g.fillStyle = "#fff"; dot(Math.cos(a) * .474 * R, Math.sin(a) * .474 * R, .017 * R); }
    g.restore();
    ring(.305, .016);
    ring(.285, .005);
    // monogram
    var A = letters[0] || "", B = letters[1] || "";
    function ink(t, size) { g.font = size + "px " + font; var m = g.measureText(t); return { l: m.actualBoundingBoxLeft || 0, r: m.actualBoundingBoxRight || m.width, up: m.actualBoundingBoxAscent || size * .7, dn: m.actualBoundingBoxDescent || 0 }; }
    g.fillStyle = "#fff"; g.textAlign = "left"; g.textBaseline = "alphabetic";
    if (A && B) {
      var size = R * .3, IA = ink(A, size), IB = ink(B, size), gap = -size * .1;
      var wd = IA.l + IA.r + IB.l + IB.r + gap, ht = Math.max(IA.up + IA.dn, IB.up + IB.dn), k = Math.min(R * .5 / wd, R * .4 / ht);
      size *= k; IA = ink(A, size); IB = ink(B, size); gap *= k; wd = IA.l + IA.r + IB.l + IB.r + gap;
      var left = cx - wd / 2, base = cy + (Math.max(IA.up, IB.up) - Math.max(IA.dn, IB.dn)) / 2;
      g.font = size + "px " + font; g.lineWidth = size * .034; g.strokeStyle = "#fff";
      g.fillText(A, left + IA.l, base - size * .05); g.strokeText(A, left + IA.l, base - size * .05);
      g.fillText(B, left + IA.l + IA.r + gap + IB.l, base + size * .06); g.strokeText(B, left + IA.l + IA.r + gap + IB.l, base + size * .06);
      var amp = size * .42, P = ink("&", amp), ax = left + IA.l + IA.r + gap / 2 - (P.r - P.l) / 2 + P.l, ay = base + size * .2;
      g.font = amp + "px " + font;
      g.save(); g.globalCompositeOperation = "destination-out"; g.lineWidth = amp * .22; g.strokeText("&", ax, ay); g.restore();
      g.fillText("&", ax, ay);
    } else if (A || B) {
      var t = A || B, s1 = R * .3, M = ink(t, s1);
      s1 *= Math.min(R * .42 / (M.l + M.r), R * .42 / (M.up + M.dn)); M = ink(t, s1);
      g.font = s1 + "px " + font; g.fillText(t, cx - (M.l + M.r) / 2 + M.l, cy + (M.up - M.dn) / 2);
    }
    return c;
  }

  /* ------------------------------------------------------------- the drum */
  function render(opts) {
    var S = Math.max(128, Math.round(opts.px)), c = S / 2, R = S * .5 - 1, Rin = R * RIM_IN;
    var letters = opts.letters || [], font = opts.font || "Georgia, serif";
    var ros = rosette(S, R, letters, font);
    // sharp mask for colour, a softened copy for relief
    var soft = mk(S), sg = soft.getContext("2d");
    sg.filter = "blur(" + Math.max(.7, S * .0022) + "px)"; sg.drawImage(ros, 0, 0);
    var rd = ros.getContext("2d").getImageData(0, 0, S, S).data, sd = sg.getImageData(0, 0, S, S).data;
    var mottle = noiseField(S, [5, 11, 23, 48], 11), fibre = noiseField(S, [30, 90], 23, 1, 4), fine = noiseField(S, [140], 31), grainN = noiseField(S, [9, 26], 47);

    var N = S * S, h = new Float32Array(N), kind = new Uint8Array(N), gold = new Float32Array(N), thin = new Float32Array(N), alpha = new Float32Array(N), alb = new Float32Array(N * 3);
    var x, y, i, dx, dy, r, a;
    for (y = 0; y < S; y++) for (x = 0; x < S; x++) {
      i = y * S + x; dx = x - c + .5; dy = y - c + .5; r = Math.sqrt(dx * dx + dy * dy);
      alpha[i] = smooth(R + .8, R - .8, r);
      if (r > R + 1) continue;
      var u = r / R;
      if (u > RIM_IN) {
        // walnut frame: rounded profile, circular grain, bone inlay dots, varnish
        kind[i] = 1;
        var t = (u - RIM_IN) / (1 - RIM_IN);
        a = Math.atan2(dy, dx);
        var inlay = 0, mid = Math.abs(t - .5) < .3 ? 1 : 0;
        if (mid) { var seg = a / (Math.PI * 2) * 40, f = seg - Math.floor(seg) - .5; var dd = Math.sqrt(f * f * (2 * Math.PI * u * R / 40) * (2 * Math.PI * u * R / 40) + Math.pow((t - .5) * (1 - RIM_IN) * R, 2)); inlay = smooth(.02 * R, .013 * R, dd) * .85; }
        h[i] = .42 + .2 * Math.pow(Math.sin(Math.PI * t), .55) + inlay * .03;
        var gr = .5 + .5 * Math.sin(u * 260 + grainN[i] * 14 + fibre[i] * 3);
        var wr = 66 + gr * 30 + mottle[i] * 20, wg = 34 + gr * 15 + mottle[i] * 10, wb = 22 + gr * 8;
        alb[i * 3] = wr + (226 - wr) * inlay; alb[i * 3 + 1] = wg + (206 - wg) * inlay; alb[i * 3 + 2] = wb + (172 - wb) * inlay;
        gold[i] = inlay * -1; // negative marks bone inlay (pearly, not metal)
      } else {
        // goatskin: taut, fibrous, mottled; thicker and darker where it is glued over the frame
        kind[i] = 2;
        var band = smooth(BAND_IN, RIM_IN, u), lip = smooth(RIM_IN - .03, RIM_IN, u);
        var mot = mottle[i] * 1.6 + fibre[i] * .35;
        var vein = Math.max(0, 1 - Math.abs(mottle[i] * 9 + fine[i] * 1.5) * 1.6) * .35;
        var gm = sd[i * 4] / 255, gs = rd[i * 4] / 255;
        h[i] = .3 + fibre[i] * .006 + fine[i] * .004 + lip * .1 + gm * .018;
        var dark = clamp(.15 + mot * .8 + vein * .6 + band * .55, 0, 1);
        alb[i * 3] = 250 - dark * 58; alb[i * 3 + 1] = 228 - dark * 80; alb[i * 3 + 2] = 182 - dark * 98;
        // madder-red field behind the monogram, brushed (uneven at the edge, darker where it pooled)
        var madder = smooth(.292 + mottle[i] * .012, .278, u) * (.86 + fibre[i] * .5 + mottle[i] * .4);
        if (madder > 0) { madder = clamp(madder, 0, 1); var mr = 132 - dark * 30, mgc = 34 - dark * 8, mb = 42 - dark * 8; alb[i * 3] += (mr - alb[i * 3]) * madder; alb[i * 3 + 1] += (mgc - alb[i * 3 + 1]) * madder; alb[i * 3 + 2] += (mb - alb[i * 3 + 2]) * madder; }
        // a whisper of henna-brown under the gold edges, like a painter's outline
        var outline = clamp(gm * 1.6 - gs, 0, 1) * .55;
        alb[i * 3] *= 1 - outline * .55; alb[i * 3 + 1] *= 1 - outline * .62; alb[i * 3 + 2] *= 1 - outline * .7;
        gold[i] = smooth(.35, .7, gs * .6 + gm * .4);
        thin[i] = clamp(1 - dark * 1.15 - band * .5, 0, 1);
      }
    }

    var col = mk(S), cg = col.getContext("2d"), img = cg.createImageData(S, S), D = img.data;
    var map = mk(S), mg = map.getContext("2d"), mimg = mg.createImageData(S, S), MD = mimg.data;
    var Lx = -.45, Ly = -.6, Lz = .66, ln = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz); Lx /= ln; Ly /= ln; Lz /= ln;
    var Hx = Lx, Hy = Ly, Hz = Lz + 1, hn = Math.sqrt(Hx * Hx + Hy * Hy + Hz * Hz); Hx /= hn; Hy /= hn; Hz /= hn;
    var amp = R * .14;
    for (y = 1; y < S - 1; y++) for (x = 1; x < S - 1; x++) {
      i = y * S + x;
      var al = alpha[i]; if (al <= 0) continue;
      var nx = -(h[i + 1] - h[i - 1]) * .5 * amp, ny = -(h[i + S] - h[i - S]) * .5 * amp, nl = Math.sqrt(nx * nx + ny * ny + 1);
      nx /= nl; ny /= nl; var nz = 1 / nl;
      var diff = Math.max(0, nx * Lx + ny * Ly + nz * Lz), nh = Math.max(0, nx * Hx + ny * Hy + nz * Hz);
      var ar = alb[i * 3], ag = alb[i * 3 + 1], ab = alb[i * 3 + 2], o0, o1, o2, gm2 = gold[i];
      if (kind[i] === 1) {
        var sp = Math.pow(nh, 48) * .8 + Math.pow(nh, 9) * .08, pearl = Math.max(0, -gm2);
        o0 = ar * (.28 + .9 * diff) + sp * 255; o1 = ag * (.28 + .9 * diff) + sp * 232; o2 = ab * (.28 + .9 * diff) + sp * 205;
        if (pearl) { var ir = Math.sin(nx * 9 + ny * 7); o0 += pearl * ir * 14; o2 += pearl * (-ir) * 16; }
      } else {
        var sheen = Math.pow(nh, 18) * .07;
        o0 = ar * (.44 + .7 * diff) + sheen * 255; o1 = ag * (.44 + .7 * diff) + sheen * 240; o2 = ab * (.44 + .7 * diff) + sheen * 220;
        if (gm2 > 0) {
          var env = 1.05 + .9 * (-ny) + .5 * (-nx), gs2 = Math.pow(nh, 20) * 1.1, leafN = .88 + fine[i] * .6;
          var gr2 = 228 * (.32 + .62 * diff) * env * leafN + gs2 * 255, gg2 = 172 * (.32 + .62 * diff) * env * leafN + gs2 * 232, gb2 = 82 * (.32 + .62 * diff) * env * leafN + gs2 * 160;
          o0 = o0 * (1 - gm2) + gr2 * gm2; o1 = o1 * (1 - gm2) + gg2 * gm2; o2 = o2 * (1 - gm2) + gb2 * gm2;
        }
      }
      D[i * 4] = clamp(o0, 0, 255); D[i * 4 + 1] = clamp(o1, 0, 255); D[i * 4 + 2] = clamp(o2, 0, 255); D[i * 4 + 3] = al * 255;
      MD[i * 4] = kind[i] === 2 ? 255 * (1 - smooth(RIM_IN - .02, RIM_IN, Math.sqrt((x - c) * (x - c) + (y - c) * (y - c)) / R)) : 0;
      MD[i * 4 + 1] = Math.max(0, gm2) * 255; MD[i * 4 + 2] = thin[i] * 255; MD[i * 4 + 3] = 255;
    }
    cg.putImageData(img, 0, 0); mg.putImageData(mimg, 0, 0);
    return { color: col, maps: map, px: S };
  }

  /* -------------------------------------------------------- metal sprites */
  function metal(S, heightFn, tint) {
    var c = mk(S), g = c.getContext("2d"), img = g.createImageData(S, S), D = img.data, h = new Float32Array(S * S), al = new Float32Array(S * S);
    for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) { var v = heightFn((x + .5) / S * 2 - 1, (y + .5) / S * 2 - 1); h[y * S + x] = v[0]; al[y * S + x] = v[1]; }
    var Lx = -.45, Ly = -.6, Lz = .66, ln = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz); Lx /= ln; Ly /= ln; Lz /= ln;
    var Hx = Lx, Hy = Ly, Hz = Lz + 1, hn = Math.sqrt(Hx * Hx + Hy * Hy + Hz * Hz); Hx /= hn; Hy /= hn; Hz /= hn;
    for (y = 1; y < S - 1; y++) for (x = 1; x < S - 1; x++) {
      var i = y * S + x; if (al[i] <= 0) continue;
      var nx = -(h[i + 1] - h[i - 1]) * S * .25, ny = -(h[i + S] - h[i - S]) * S * .25, nl = Math.sqrt(nx * nx + ny * ny + 1); nx /= nl; ny /= nl; var nz = 1 / nl;
      var diff = Math.max(0, nx * Lx + ny * Ly + nz * Lz), nh = Math.max(0, nx * Hx + ny * Hy + nz * Hz);
      var env = .5 + .45 * (-ny) + .2 * (-nx), sp = Math.pow(nh, 26) * 1.2;
      D[i * 4] = clamp(tint[0] * (.25 + .75 * diff) * env + sp * 255, 0, 255);
      D[i * 4 + 1] = clamp(tint[1] * (.25 + .75 * diff) * env + sp * 238, 0, 255);
      D[i * 4 + 2] = clamp(tint[2] * (.25 + .75 * diff) * env + sp * 190, 0, 255);
      D[i * 4 + 3] = al[i] * 255;
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  function ringSprite(px) {
    return metal(px, function (u, v) {
      var r = Math.sqrt(u * u + v * v), d = Math.abs(r - .68) / .26;
      return d < 1 ? [Math.sqrt(1 - d * d) * .26, smooth(1, .9, d)] : [0, 0];
    }, [214, 168, 92]);
  }
  function coinSprite(px) {
    return metal(px, function (u, v) {
      var r = Math.sqrt(u * u + v * v); if (r > .97) return [0, 0];
      var a = Math.atan2(v, u), rimH = smooth(.78, .86, r) * .1, field = .04;
      // stamped eight-point star and a dotted ring
      var star = Math.cos(4 * a), sr = .42 + .14 * Math.pow(Math.abs(star), 3);
      var st = smooth(sr + .03, sr - .02, r) * smooth(.12, .16, r) * .035;
      var dots = smooth(.05, .02, Math.abs(r - .66)) * smooth(.4, .9, Math.cos(a * 24)) * .03;
      var core = smooth(.12, .06, r) * .05;
      return [field + rimH + st + dots + core - smooth(.9, .97, r) * .06, smooth(.97, .94, r)];
    }, [226, 176, 86]);
  }

  /* ------------------------------------------------- the rippling surface */
  var VS = "attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "precision mediump float;varying vec2 v;uniform sampler2D C,M;uniform float T,G,F;uniform vec4 Rp[8];",
    "float wave(vec2 q){float h=0.;for(int i=0;i<8;i++){vec4 r=Rp[i];float age=T-r.z;if(r.w<=0.||age<0.||age>3.)continue;",
    " float d=distance(q,r.xy),x=age*.62-d;if(x<0.)continue;h+=r.w*exp(-age*2.1)*exp(-x*4.5)*sin(x*64.);}return h;}",
    "void main(){vec4 m0=texture2D(M,v);float sk=m0.r;vec2 e=vec2(.0035,0.);",
    " vec2 gr=vec2(wave(v+e.xy)-wave(v-e.xy),wave(v+e.yx)-wave(v-e.yx))/(2.*e.x)*sk;",
    " vec2 uv=v-gr*.00035;vec4 c=texture2D(C,uv);vec4 m=texture2D(M,uv);",
    " vec3 n=normalize(vec3(-gr*.011,1.));vec3 L=normalize(vec3(-.45,-.6,.66));vec3 H=normalize(L+vec3(0.,0.,1.));",
    " float lit=dot(n,L)-L.z;float sp=max(pow(max(dot(n,H),0.),70.)-pow(H.z,70.),0.);",
    " vec3 col=c.rgb*(1.+lit*1.5*sk)+sp*.55*sk;",
    " float through=m.r*(1.-m.g);vec3 tint=mix(vec3(1.),c.rgb/max(max(c.r,c.g),max(c.b,.05)),.7);vec3 emit=tint*(vec3(1.,.6,.28)*(.3+.85*m.b)+vec3(1.,.88,.66)*pow(m.b,4.)*.55);",
    " col=mix(col,col*.28+emit,G*through);col=mix(col,col*(1.-.6*G)+vec3(.35,.18,.05)*G*.25,G*m.g*m.r);",
    " col+=emit*F*through*.55;gl_FragColor=vec4(col*c.a,c.a);}"
  ].join("\n");

  function skin(canvas, art) {
    var gl = null;
    try { gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: false }); } catch (_) {}
    var rip = [], state = { glow: 0, flash: 0 }, start = performance.now(), raf = 0, prog, uT, uG, uF, uR;
    canvas.width = art.px; canvas.height = art.px;
    function compile(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    var textures = [];
    function tex(unit, img) { gl.activeTexture(gl.TEXTURE0 + unit); var t = textures[unit] || gl.createTexture(); textures[unit] = t; gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); }
    if (gl) {
      try {
        prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
        gl.useProgram(prog);
        var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        tex(0, art.color); tex(1, art.maps);
        gl.uniform1i(gl.getUniformLocation(prog, "C"), 0); gl.uniform1i(gl.getUniformLocation(prog, "M"), 1);
        uT = gl.getUniformLocation(prog, "T"); uG = gl.getUniformLocation(prog, "G"); uF = gl.getUniformLocation(prog, "F"); uR = gl.getUniformLocation(prog, "Rp");
        gl.viewport(0, 0, canvas.width, canvas.height);
      } catch (err) { gl = null; }
    }
    var g2 = null;
    if (!gl) {
      // a canvas that already had a webgl context can't give a 2d one: swap in a fresh element
      var fresh = canvas.cloneNode(false); canvas.parentNode && canvas.parentNode.replaceChild(fresh, canvas); canvas = fresh;
      canvas.width = canvas.height = art.px; g2 = canvas.getContext("2d");
    }
    function now() { return (performance.now() - start) / 1000; }
    function draw() {
      var t = now();
      if (gl) {
        var arr = new Float32Array(32);
        for (var k = 0; k < 8; k++) { var r = rip[k]; if (r) { arr[k * 4] = r[0]; arr[k * 4 + 1] = r[1]; arr[k * 4 + 2] = r[2]; arr[k * 4 + 3] = r[3]; } }
        gl.uniform4fv(uR, arr); gl.uniform1f(uT, t); gl.uniform1f(uG, state.glow); gl.uniform1f(uF, state.flash);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      } else if (g2) {
        g2.clearRect(0, 0, canvas.width, canvas.height); g2.drawImage(art.color, 0, 0);
      }
      return t;
    }
    function busy(t) { for (var k = 0; k < rip.length; k++) if (rip[k] && t - rip[k][2] < 3) return true; return state.live; }
    function loop() { raf = 0; var t = draw(); if (busy(t)) raf = requestAnimationFrame(loop); }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }
    draw();
    return {
      gl: !!gl,
      canvas: canvas,
      // x, y in 0..1 of the drum box
      hit: function (x, y, amp) { rip.push([x, y, now(), amp == null ? 1 : amp]); if (rip.length > 8) rip.shift(); kick(); },
      set: function (k, v) { state[k] = v; if (!gl && g2) return; kick(); },
      update: function (next) { art = next; canvas.width = canvas.height = art.px; if (gl) { tex(0, art.color); tex(1, art.maps); gl.viewport(0, 0, canvas.width, canvas.height); } else if (g2) { g2.drawImage(art.color, 0, 0); } draw(); },
      live: function (on) { state.live = !!on; kick(); },
      redraw: draw,
      destroy: function () { if (raf) cancelAnimationFrame(raf); raf = 0; state.live = false; var ext = gl && gl.getExtension("WEBGL_lose_context"); if (ext) ext.loseContext(); }
    };
  }

  window.DoiraDrum = { render: render, skin: skin, ringSprite: ringSprite, coinSprite: coinSprite, RIM_IN: RIM_IN, BAND_IN: BAND_IN };
})();
