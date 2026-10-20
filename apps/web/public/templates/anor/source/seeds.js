/* Anor effects: glossy aril sprites, a seed field with plate physics and shape-seeking,
   falling pomegranate petals, fireflies and dust motes. Canvas 2D only, one rAF per field,
   paused when the canvas is off-screen or the tab is hidden. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function canvasOf(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    return c;
  }

  /* Each aril is a faceted teardrop: deep ruby rim, translucent bright body, pale seed shadow
     inside and a sharp specular highlight. Gold variants are used where seeds sit on red. */
  const PALETTES = {
    ruby: { rim: '#3a020b', mid: '#8e0820', body: '#cf1d3c', light: '#ff9fae', seed: 'rgba(255,226,214,.32)', glow: 'rgba(255,60,80,.0)' },
    gold: { rim: '#6b4110', mid: '#c48a2c', body: '#f3cf7a', light: '#fff6dc', seed: 'rgba(255,255,255,.35)', glow: 'rgba(255,214,140,.0)' }
  };
  const spriteCache = new Map();
  function sprites(kind = 'ruby', size = 22) {
    const key = kind + size;
    if (spriteCache.has(key)) return spriteCache.get(key);
    const p = PALETTES[kind];
    const list = [];
    for (let v = 0; v < 6; v++) {
      const s = size, c = canvasOf(s * 1.6, s * 1.6), g = c.getContext('2d');
      const cx = c.width / 2, cy = c.height / 2;
      const rx = s * (.34 + v * .012), ry = s * (.46 - v * .008), tip = s * (.08 + (v % 3) * .03);
      g.translate(cx, cy);
      g.rotate((v - 2.5) * .22);
      const shape = () => {
        g.beginPath();
        g.moveTo(0, -ry - tip);
        g.bezierCurveTo(rx * .9, -ry * .9, rx * 1.05, ry * .35, rx * .55, ry * .85);
        g.quadraticCurveTo(0, ry * 1.12, -rx * .55, ry * .85);
        g.bezierCurveTo(-rx * 1.05, ry * .35, -rx * .9, -ry * .9, 0, -ry - tip);
        g.closePath();
      };
      shape();
      let q = g.createRadialGradient(-rx * .3, -ry * .35, s * .02, 0, 0, ry * 1.15);
      q.addColorStop(0, p.light); q.addColorStop(.22, p.body); q.addColorStop(.7, p.mid); q.addColorStop(1, p.rim);
      g.fillStyle = q; g.fill();
      g.save(); shape(); g.clip();
      g.fillStyle = p.seed; g.beginPath(); g.ellipse(rx * .08, ry * .18, rx * .28, ry * .42, .2, 0, TAU); g.fill();
      q = g.createLinearGradient(0, -ry, 0, ry);
      q.addColorStop(0, 'rgba(255,255,255,0)'); q.addColorStop(.8, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(0,0,0,.28)');
      g.fillStyle = q; g.fillRect(-s, -s, s * 2, s * 2);
      g.restore();
      g.fillStyle = 'rgba(255,255,255,.92)';
      g.beginPath(); g.ellipse(-rx * .36, -ry * .4, rx * .2, ry * .13, -.6, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,255,255,.45)';
      g.beginPath(); g.arc(rx * .32, ry * .3, s * .035, 0, TAU); g.fill();
      list.push(c);
    }
    spriteCache.set(key, list);
    return list;
  }

  /* Points that fill a glyph or a heart, on a jittered grid, centred on (0,0). */
  function textPoints(text, font, spacing, maxWidth, options = {}) {
    const probe = canvasOf(10, 10).getContext('2d');
    probe.font = font;
    const m = probe.measureText(text);
    const w = Math.ceil(m.width + spacing * 2);
    const ascent = m.actualBoundingBoxAscent || parseFloat(font) * .75;
    const descent = m.actualBoundingBoxDescent || parseFloat(font) * .2;
    const h = Math.ceil(ascent + descent + spacing * 2);
    const c = canvasOf(w, h), g = c.getContext('2d');
    g.font = font; g.fillStyle = '#000'; g.strokeStyle = '#000'; g.textBaseline = 'alphabetic';
    g.lineJoin = 'round'; g.lineWidth = options.stroke || 0;
    g.fillText(text, spacing, spacing + ascent);
    if (options.stroke) g.strokeText(text, spacing, spacing + ascent);
    const data = g.getImageData(0, 0, w, h).data;
    const pts = [];
    for (let y = 0; y < h; y += spacing * .87) {
      const row = Math.round(y / (spacing * .87));
      for (let x = (row % 2) * spacing / 2; x < w; x += spacing) {
        const xi = Math.round(x), yi = Math.round(y);
        if (data[(yi * w + xi) * 4 + 3] > 140) pts.push({ x: x - w / 2 + rand(-.6, .6), y: y - h / 2 + rand(-.6, .6) });
      }
    }
    const scale = maxWidth && w > maxWidth ? maxWidth / w : 1;
    // base: the glyph baseline in the same centred coordinates, so several glyphs can share one line.
    return { pts: scale === 1 ? pts : pts.map(p => ({ x: p.x * scale, y: p.y * scale })), w: w * scale, h: h * scale, base: (spacing + ascent - h / 2) * scale };
  }
  function heartPoints(size, spacing) {
    const pts = [];
    const inside = (x, y) => { const a = x * x + y * y - 1; return a * a * a - x * x * y * y * y <= 0; };
    for (let y = -1.25; y <= 1.25; y += spacing / size * .87) {
      const row = Math.round(y / (spacing / size * .87));
      for (let x = -1.3 + (row % 2) * spacing / size / 2; x <= 1.3; x += spacing / size) if (inside(x, -y)) pts.push({ x: x * size * .5, y: y * size * .5 });
    }
    return { pts, w: size * 1.25, h: size * 1.15 };
  }

  /* A field of seeds drawn on one canvas. Particles are free (gravity + floor) or seeking a
     target point along a curved path. */
  class SeedField {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.g = canvas.getContext('2d');
      this.dprCap = options.dprCap || 2;
      this.kind = options.kind || 'ruby';
      this.size = options.size || 12;
      this.gravity = options.gravity || 2200;
      this.floor = options.floor || null;
      this.particles = [];
      this.running = false;
      this.visible = true;
      this.last = 0;
      this.onFrame = null;
      this.resize();
      this.tick = this.tick.bind(this);
      if ('IntersectionObserver' in window) new IntersectionObserver(entries => entries.forEach(entry => { this.visible = entry.isIntersecting; if (this.visible) this.start(); })).observe(canvas);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) this.start(); });
    }
    resize() {
      const r = this.canvas.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, this.dprCap);
      this.w = r.width; this.h = r.height;
      this.canvas.width = Math.max(1, Math.round(r.width * this.dpr));
      this.canvas.height = Math.max(1, Math.round(r.height * this.dpr));
      this.sprites = sprites(this.kind, Math.round(this.size * 2 * this.dpr));
      this.goldSprites = sprites('gold', Math.round(this.size * 2 * this.dpr));
    }
    add(p) {
      const particle = Object.assign({ x: 0, y: 0, vx: 0, vy: 0, rot: rand(0, TAU), vr: rand(-6, 6), s: rand(.82, 1.18), a: 1, v: Math.random() * 6 | 0, mode: 'free', resting: false, gold: false, bounces: 0, grow: 1 }, p);
      this.particles.push(particle);
      return particle;
    }
    seek(p, tx, ty, duration, delay = 0, lift = 0) {
      p.mode = 'seek'; p.sx = p.x; p.sy = p.y; p.tx = tx; p.ty = ty; p.t = -delay; p.d = duration;
      p.cx = (p.x + tx) / 2 + rand(-40, 40); p.cy = Math.min(p.y, ty) - lift - rand(0, 60); p.resting = false;
    }
    clear() { this.particles.length = 0; this.g.clearRect(0, 0, this.canvas.width, this.canvas.height); }
    start() { if (!this.running && this.visible && !document.hidden) { this.running = true; this.last = 0; requestAnimationFrame(this.tick); } }
    stop() { this.running = false; }
    tick(now) {
      if (!this.running) return;
      if (!this.visible || document.hidden) { this.running = false; return; }
      const dt = this.last ? Math.min(.034, (now - this.last) / 1000) : .016;
      this.last = now;
      let active = this.step(dt, now);
      this.draw(now);
      if (this.onFrame) active = this.onFrame(dt, now) || active;
      if (active) requestAnimationFrame(this.tick); else this.running = false;
    }
    floorAt(p) {
      const f = this.floor;
      if (!f) return Infinity;
      const dx = (p.x - f.x) / f.rx;
      if (Math.abs(dx) >= 1) return f.table;
      if (p.depth == null) p.depth = rand(-.75, .85);
      return f.y + p.depth * f.ry * Math.sqrt(1 - dx * dx);
    }
    step(dt) {
      let active = false;
      for (const p of this.particles) {
        if (p.delay > 0) { p.delay -= dt; active = true; continue; }
        if (p.mode === 'seek') {
          p.t += dt;
          if (p.t < 0) { active = true; continue; }
          const k = clamp(p.t / p.d, 0, 1), e = easeInOut(k), u = 1 - e;
          p.x = u * u * p.sx + 2 * u * e * p.cx + e * e * p.tx;
          p.y = u * u * p.sy + 2 * u * e * p.cy + e * e * p.ty;
          p.rot += p.vr * dt * (1 - k);
          if (k >= 1) { p.mode = 'hold'; }
          active = true;
        } else if (p.mode === 'free' && !p.resting) {
          p.vy += this.gravity * dt;
          p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
          const floor = this.floorAt(p);
          if (p.y > floor && p.vy > 0) {
            p.y = floor; p.bounces++;
            p.vy *= -rand(.18, .32); p.vx *= .55; p.vr *= .5;
            if (Math.abs(p.vy) < 60 || p.bounces > 3) { p.resting = true; p.vy = 0; p.vx = 0; }
          }
          if (p.y > this.h + 40) p.resting = true;
          active = true;
        } else if (p.mode === 'fade') {
          p.a -= dt / (p.fade || .6);
          p.vy += this.gravity * .25 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.a > 0) active = true;
        }
        if (p.mode === 'hold' && p.twinkle) active = true;
      }
      return active;
    }
    draw(now) {
      const g = this.g, dpr = this.dpr;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Sprites are already rendered at device resolution, so only the seed's own scale applies.
      for (const p of this.particles) {
        if (p.a <= 0 || p.delay > 0) continue;
        const img = (p.gold ? this.goldSprites : this.sprites)[p.v];
        const tw = p.twinkle ? 1 + Math.sin(now / 240 + p.v * 1.7 + p.x * .05) * .08 : 1;
        const sc = p.s * tw * (p.grow || 1);
        g.globalAlpha = clamp(p.a, 0, 1);
        g.setTransform(sc, 0, 0, sc, p.x * dpr, p.y * dpr);
        g.rotate(p.rot);
        g.drawImage(img, -img.width / 2, -img.height / 2);
      }
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = 1;
    }
  }

  /* Falling pomegranate petals in three depths; near petals are larger and softer. */
  function petalSprite(size, hue, soft) {
    const c = canvasOf(size * 1.4, size * 1.4), g = c.getContext('2d');
    g.translate(c.width / 2, c.height / 2);
    if (soft) g.filter = `blur(${Math.max(1, size * .06)}px)`;
    const q = g.createRadialGradient(-size * .15, -size * .2, size * .05, 0, 0, size * .6);
    q.addColorStop(0, `hsl(${hue + 12} 92% 66%)`); q.addColorStop(.55, `hsl(${hue} 84% 50%)`); q.addColorStop(1, `hsl(${hue - 6} 78% 34%)`);
    g.fillStyle = q;
    g.beginPath();
    g.moveTo(0, size * .5);
    g.bezierCurveTo(-size * .55, size * .2, -size * .5, -size * .38, -size * .14, -size * .48);
    g.quadraticCurveTo(0, -size * .36, size * .14, -size * .5);
    g.bezierCurveTo(size * .52, -size * .36, size * .55, size * .22, 0, size * .5);
    g.fill();
    g.strokeStyle = 'rgba(255,220,200,.35)'; g.lineWidth = size * .025;
    g.beginPath(); g.moveTo(0, size * .45); g.quadraticCurveTo(size * .05, 0, -size * .02, -size * .38); g.stroke();
    return c;
  }
  /* Painted petals come from a one-row sprite sheet; drawn petals stand in until it loads. */
  class Petals {
    constructor(canvas, { count = 36, sheet = null, cells = 6 } = {}) {
      this.canvas = canvas; this.g = canvas.getContext('2d'); this.count = count; this.items = []; this.running = false; this.enabled = false;
      this.sheet = null; this.cells = cells;
      this.tick = this.tick.bind(this);
      addEventListener('resize', () => this.resize(), { passive: true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) this.start(); });
      this.resize();
      if (sheet) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => { this.sheet = img; this.resize(); };
        img.src = sheet;
      }
    }
    resize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = this.canvas.clientWidth || innerWidth; this.h = this.canvas.clientHeight || innerHeight;
      this.canvas.width = Math.round(this.w * this.dpr); this.canvas.height = Math.round(this.h * this.dpr);
      const unit = clamp(this.w / 22, 14, 24) * this.dpr;
      if (this.sheet) {
        const size = this.sheet.height;
        const cut = (i, px, blur) => {
          const c = canvasOf(px * 1.3, px * 1.3), g = c.getContext('2d');
          if (blur) g.filter = `blur(${Math.max(1, px * .05)}px)`;
          g.drawImage(this.sheet, i * size, 0, size, size, px * .15, px * .15, px, px);
          return c;
        };
        this.sprites = [.7, 1, 1.8].map((k, depth) => Array.from({ length: this.cells }, (_, i) => cut(i, Math.round(unit * k), depth === 2)));
      } else {
        this.sprites = [
          [petalSprite(unit * .7, 352, false), petalSprite(unit * .7, 8, false)],
          [petalSprite(unit, 356, false), petalSprite(unit, 12, false)],
          [petalSprite(unit * 1.7, 350, true), petalSprite(unit * 1.7, 6, true)]
        ];
      }
    }
    spawn(initial) {
      const depth = Math.random() < .55 ? 0 : Math.random() < .75 ? 1 : 2;
      return { depth, x: rand(-.05, 1.05) * this.w, y: initial ? rand(-.1, 1) * this.h : rand(-.25, -.05) * this.h, vy: [26, 42, 70][depth] * rand(.8, 1.25), sway: rand(14, 36) * (depth + 1) * .6, phase: rand(0, TAU), freq: rand(.5, 1.1), rot: rand(0, TAU), vr: rand(-1.4, 1.4), flip: rand(0, TAU), v: Math.random() * 6 | 0, a: [.5, .75, .38][depth] };
    }
    setEnabled(on) { this.enabled = on; if (on) { if (!this.items.length) for (let i = 0; i < this.count; i++) this.items.push(this.spawn(true)); this.start(); } }
    start() { if (!this.running && this.enabled && !document.hidden) { this.running = true; this.last = 0; requestAnimationFrame(this.tick); } }
    tick(now) {
      if (!this.enabled || document.hidden) { this.running = false; return; }
      const dt = this.last ? Math.min(.05, (now - this.last) / 1000) : .016; this.last = now;
      const g = this.g, dpr = this.dpr;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = 0; i < this.items.length; i++) {
        const p = this.items[i];
        p.phase += dt * p.freq; p.y += p.vy * dt; p.rot += p.vr * dt; p.flip += dt * 2.2;
        if (p.y > this.h + 40) { this.items[i] = this.spawn(false); continue; }
        const list = this.sprites[p.depth], x = p.x + Math.sin(p.phase) * p.sway, img = list[p.v % list.length];
        g.globalAlpha = p.a;
        g.setTransform(Math.cos(p.flip) * dpr * .5 + dpr * .5, 0, 0, dpr, x * dpr, p.y * dpr);
        g.rotate(p.rot);
        g.drawImage(img, -img.width / 2 / dpr, -img.height / 2 / dpr, img.width / dpr, img.height / dpr);
      }
      g.globalAlpha = 1;
      requestAnimationFrame(this.tick);
    }
  }

  /* Warm motes for the dark stage, fireflies for the dusk finale. */
  class Motes {
    constructor(canvas, { count = 24, color = '255,214,150', area = null, rise = 6, glow = 1 } = {}) {
      this.canvas = canvas; this.g = canvas.getContext('2d'); this.count = count; this.color = color; this.area = area; this.rise = rise; this.glow = glow;
      this.items = []; this.running = false; this.visible = true; this.tick = this.tick.bind(this);
      if ('IntersectionObserver' in window) new IntersectionObserver(e => e.forEach(x => { this.visible = x.isIntersecting; this.start(); })).observe(canvas);
      document.addEventListener('visibilitychange', () => this.start());
      this.resize();
      addEventListener('resize', () => this.resize(), { passive: true });
    }
    resize() {
      const r = this.canvas.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2); this.w = r.width; this.h = r.height;
      this.canvas.width = Math.round(r.width * this.dpr); this.canvas.height = Math.round(r.height * this.dpr);
      this.items = Array.from({ length: this.count }, () => this.spawn());
    }
    spawn() {
      const a = this.area || { x: 0, y: 0, w: 1, h: 1 };
      return { x: (a.x + Math.random() * a.w) * this.w, y: (a.y + Math.random() * a.h) * this.h, r: rand(.6, 2.2), vx: rand(-6, 6), vy: -rand(1, this.rise), ph: rand(0, TAU), sp: rand(.6, 1.8) };
    }
    start() { if (!this.running && this.visible && !document.hidden) { this.running = true; this.last = 0; requestAnimationFrame(this.tick); } }
    stop() { this.running = false; this.halt = true; }
    tick(now) {
      if (this.halt || !this.visible || document.hidden) { this.running = false; return; }
      const dt = this.last ? Math.min(.05, (now - this.last) / 1000) : .016; this.last = now;
      const g = this.g, d = this.dpr;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, this.canvas.width, this.canvas.height);
      g.globalCompositeOperation = 'lighter';
      for (const p of this.items) {
        p.ph += dt * p.sp; p.x += (p.vx + Math.sin(p.ph) * 8) * dt; p.y += p.vy * dt;
        if (p.y < -10 || p.x < -10 || p.x > this.w + 10) Object.assign(p, this.spawn(), { y: this.h * ((this.area?.y || 0) + (this.area?.h || 1)) });
        const a = (.35 + .65 * Math.max(0, Math.sin(p.ph * 1.3))) * this.glow;
        const r = p.r * d * 3.2;
        const q = g.createRadialGradient(p.x * d, p.y * d, 0, p.x * d, p.y * d, r);
        q.addColorStop(0, `rgba(${this.color},${a})`); q.addColorStop(.35, `rgba(${this.color},${a * .35})`); q.addColorStop(1, `rgba(${this.color},0)`);
        g.fillStyle = q; g.fillRect(p.x * d - r, p.y * d - r, r * 2, r * 2);
      }
      g.globalCompositeOperation = 'source-over';
      requestAnimationFrame(this.tick);
    }
  }

  /* A short juicy crack and a soft shimmer, synthesised so nothing extra downloads. */
  const sound = {
    ctx: null,
    unlock() { try { this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)(); if (this.ctx.state === 'suspended') this.ctx.resume(); } catch (_) { this.ctx = null; } },
    crack() {
      const ctx = this.ctx; if (!ctx) return;
      const t = ctx.currentTime, len = .32, buf = ctx.createBuffer(1, Math.round(ctx.sampleRate * len), ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) { const k = i / d.length; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - k, 3.2) * (k < .04 ? 1 : .55 + .45 * Math.random()); }
      const src = ctx.createBufferSource(); src.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(2400, t); bp.frequency.exponentialRampToValueAtTime(700, t + .25); bp.Q.value = 1.4;
      const gain = ctx.createGain(); gain.gain.setValueAtTime(.0001, t); gain.gain.exponentialRampToValueAtTime(.32, t + .008); gain.gain.exponentialRampToValueAtTime(.0001, t + len);
      src.connect(bp).connect(gain).connect(ctx.destination); src.start(t);
      const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(70, t + .16);
      og.gain.setValueAtTime(.0001, t); og.gain.exponentialRampToValueAtTime(.22, t + .01); og.gain.exponentialRampToValueAtTime(.0001, t + .2);
      o.connect(og).connect(ctx.destination); o.start(t); o.stop(t + .22);
    },
    shimmer() {
      const ctx = this.ctx; if (!ctx) return;
      const t = ctx.currentTime;
      [1318.5, 1975.5, 2637].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(.0001, t + i * .07); g.gain.exponentialRampToValueAtTime(.05, t + i * .07 + .02); g.gain.exponentialRampToValueAtTime(.0001, t + i * .07 + 1.4);
        o.connect(g).connect(ctx.destination); o.start(t + i * .07); o.stop(t + i * .07 + 1.5);
      });
    }
  };

  window.AnorFX = { sprites, textPoints, heartPoints, SeedField, Petals, Motes, sound, rand, clamp, easeOut, easeInOut };
})();
