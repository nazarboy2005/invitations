/* Samarqand Kechasi salute: a real-time fireworks show over the Registan plate.

   Shells rise from behind the madrasahs with a sparking tail, burst at their apex into
   one of several shell types (peony, chrysanthemum, willow, ring, strobe, double), and
   their stars move with drag and gravity. Motion trails come from a persistent sky
   buffer that fades a little every frame, the way a long exposure would. The sky buffer
   is clipped to the open sky, so sparks pass behind the domes and minarets. Each burst
   lights the scene (screen-blended glow) and is mirrored, blurred, on the wet stone square.

   window.SamarqandSalute.prime()        call inside the opening tap (unlocks Web Audio)
   window.SamarqandSalute.celebrate(fn)  start the show; fn() fires when the first shell bursts
*/
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  // Roofline of registan-reveal.webp (x, y as fractions of 1024 × 1536).
  const SKYLINE = [
    [0, .155], [.109, .155], [.122, .25], [.27, .346], [.27, .423],
    [.385, .423], [.421, .417], [.434, .38], [.466, .348], [.498, .329],
    [.529, .35], [.559, .378], [.578, .417], [.617, .422], [.7, .422],
    [.711, .378], [.74, .344], [.874, .252], [.886, .158], [1, .158]
  ];
  const FLOOR = [.585, .76];            // wet stone square, as a fraction of the plate height
  const COLORS = {
    gold: [255, 184, 72], champagne: [255, 222, 156], white: [255, 247, 232],
    rose: [255, 120, 166], turquoise: [80, 224, 210], violet: [196, 150, 255], ember: [255, 104, 36]
  };
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

  function glowSprite(size) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const g = c.getContext('2d'), r = size / 2, gr = g.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.12, 'rgba(255,248,226,.9)');
    gr.addColorStop(.35, 'rgba(255,214,140,.35)'); gr.addColorStop(1, 'rgba(255,180,90,0)');
    g.fillStyle = gr; g.fillRect(0, 0, size, size); return c;
  }

  /* ------------------------------------------------------------------ sound */
  function Sound() { this.ctx = null; }
  Sound.prototype.prime = function () {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      this.ctx = this.ctx || new AC(); if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (_) { this.ctx = null; }
  };
  Sound.prototype.noise = function (seconds) {
    const n = Math.round(this.ctx.sampleRate * seconds), b = this.ctx.createBuffer(1, n, this.ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b;
  };
  Sound.prototype.launch = function (gain, seconds) {
    const a = this.ctx; if (!a) return; const t = a.currentTime, d = seconds || 1, o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(480, t); o.frequency.exponentialRampToValueAtTime(1400, t + d * .92);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.008 * gain, t + .2); g.gain.exponentialRampToValueAtTime(.0001, t + d * .95);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d);
  };
  Sound.prototype.boom = function (gain, delay) {
    const a = this.ctx; if (!a) return; const t = a.currentTime + (delay || 0), s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = this.noise(1.6); f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(140, t + .5);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.32 * gain, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + 1.5);
    s.connect(f); f.connect(g); g.connect(a.destination); s.start(t); s.stop(t + 1.6);
  };
  Sound.prototype.crackle = function (gain, delay) {
    const a = this.ctx; if (!a) return; const base = a.currentTime + (delay || 0);
    for (let i = 0; i < 26; i++) {
      const t = base + Math.random() * .9, s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
      s.buffer = this.noise(.03); f.type = 'highpass'; f.frequency.value = 2200;
      g.gain.setValueAtTime(.05 * gain * Math.random(), t); g.gain.exponentialRampToValueAtTime(.0001, t + .03);
      s.connect(f); f.connect(g); g.connect(a.destination); s.start(t); s.stop(t + .04);
    }
  };

  /* --------------------------------------------------------------- the show */
  function Show(canvas, opts) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.lite = !!opts.lite; this.sound = opts.sound; this.plateEl = opts.plate;
    this.sky = document.createElement('canvas'); this.skyCtx = this.sky.getContext('2d');
    this.small = document.createElement('canvas'); this.smallCtx = this.small.getContext('2d');
    this.glow = glowSprite(64);
    this.rockets = []; this.stars = []; this.sparks = []; this.flashes = []; this.smoke = []; this.queue = [];
    this.t = 0; this.onFirstBurst = null; this.burstCount = 0;
  }
  Show.prototype.resize = function () {
    const r = this.canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, this.lite ? 1.25 : 1.75);
    this.w = Math.max(1, r.width); this.h = Math.max(1, r.height); this.dpr = dpr;
    for (const c of [this.canvas, this.sky]) { c.width = Math.round(this.w * dpr); c.height = Math.round(this.h * dpr); }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); this.skyCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.small.width = Math.max(1, Math.round(this.w / 5)); this.small.height = Math.max(1, Math.round(this.h / 5));
    // map the painted plate (object-fit: cover) into canvas space
    const img = this.plateEl, ir = img ? img.getBoundingClientRect() : r;
    const s = Math.max(ir.width / 1024, ir.height / 1536), pos = img ? (parseFloat(getComputedStyle(img).objectPosition.split(' ')[1]) || 52) / 100 : .52;
    this.plate = { x: ir.left - r.left + (ir.width - 1024 * s) / 2, y: ir.top - r.top + (ir.height - 1536 * s) * pos, s };
    this.unit = this.w / 390;                                 // 1 at a 390 px wide phone
  };
  Show.prototype.px = function (fx, fy) { return [this.plate.x + fx * 1024 * this.plate.s, this.plate.y + fy * 1536 * this.plate.s]; };
  Show.prototype.roofAt = function (x) {
    const fx = (x - this.plate.x) / (1024 * this.plate.s);
    for (let i = 1; i < SKYLINE.length; i++) {
      const [x0, y0] = SKYLINE[i - 1], [x1, y1] = SKYLINE[i];
      if (fx >= x0 && fx <= x1) { const k = x1 === x0 ? 0 : (fx - x0) / (x1 - x0); return this.plate.y + (y0 + (y1 - y0) * k) * 1536 * this.plate.s; }
    }
    return this.plate.y + .42 * 1536 * this.plate.s;
  };
  Show.prototype.clipSky = function (g) {
    g.beginPath(); g.moveTo(-50, -50); g.lineTo(this.w + 50, -50);
    for (let i = SKYLINE.length - 1; i >= 0; i--) { const p = this.px(SKYLINE[i][0], SKYLINE[i][1]); g.lineTo(i === SKYLINE.length - 1 ? this.w + 50 : i === 0 ? -50 : p[0], p[1]); }
    g.closePath(); g.clip();
  };

  // A shell: fx/fy are the burst point as fractions of the canvas; kind and colours shape the burst.
  Show.prototype.fire = function (spec) {
    const x = spec.fx * this.w, y = spec.fy * this.h, x0 = x + (Math.random() - .5) * 30 * this.unit, y0 = this.roofAt(x0) + 30 * this.unit;
    const dur = spec.rise || (1.75 + Math.random() * .4);
    this.rockets.push({ x0, y0, x1: x, y1: y, x: x0, y: y0, age: 0, dur, spec });
    if (this.sound) this.sound.launch(spec.loud || 1, dur);
  };
  Show.prototype.burst = function (r) {
    const sp = r.spec, u = this.unit, lite = this.lite, kind = sp.kind || 'peony';
    const n = Math.round((sp.n || 110) * (lite ? .45 : 1));
    const v0 = (sp.size || 1) * 126 * u;                       // px/s initial star speed
    const c1 = COLORS[sp.color || 'gold'], c2 = COLORS[sp.color2 || sp.color || 'gold'];
    const tilt = .35 + Math.random() * .4, rot = Math.random() * TAU;
    for (let i = 0; i < n; i++) {
      let vx, vy;
      if (kind === 'ring') {
        const a = i / n * TAU, cx = Math.cos(a), cy = Math.sin(a) * tilt;
        vx = (cx * Math.cos(rot) - cy * Math.sin(rot)) * v0; vy = (cx * Math.sin(rot) + cy * Math.cos(rot)) * v0;
      } else {
        // a uniformly random direction on a sphere, projected: reads as a round 3-D shell
        const z = Math.random() * 2 - 1, a = Math.random() * TAU, s = Math.sqrt(1 - z * z);
        const k = kind === 'willow' ? .78 : (.92 + Math.random() * .12);
        vx = Math.cos(a) * s * v0 * k; vy = Math.sin(a) * s * v0 * k;
      }
      const inner = kind === 'double' && i % 3 === 0;
      this.stars.push({
        x: r.x, y: r.y, vx: inner ? vx * .5 : vx, vy: inner ? vy * .5 : vy, age: 0,
        life: (kind === 'willow' ? 4.4 : kind === 'strobe' ? 3.1 : 2.6) * (.85 + Math.random() * .3),
        color: inner ? c2 : c1, kind, drag: kind === 'willow' ? 1.2 : .82, grav: (kind === 'willow' ? 42 : 24) * u,
        phase: Math.random() * TAU, size: (kind === 'willow' ? 1.25 : 1.55) * (.8 + Math.random() * .4)
      });
    }
    this.flashes.push({ x: r.x, y: r.y, age: 0, life: .75, power: Math.min(1.4, (sp.size || 1) * (n / 110) + .2), color: c1 });
    if (!lite) for (let i = 0; i < 4; i++) this.smoke.push({ x: r.x + (Math.random() - .5) * 60 * u, y: r.y + (Math.random() - .5) * 40 * u, r: (40 + Math.random() * 50) * u, age: 0, life: 5 + Math.random() * 3, vx: (Math.random() - .3) * 4 * u });
    if (this.sound) { const d = .12 + Math.random() * .1; this.sound.boom(sp.loud || 1, d); if (kind === 'strobe' || kind === 'chrys') this.sound.crackle(sp.loud || 1, d + 1.5); }
    this.burstCount++;
    if (this.burstCount === 1 && this.onFirstBurst) { const f = this.onFirstBurst; this.onFirstBurst = null; f(); }
  };
  Show.prototype.schedule = function (at, spec) { this.queue.push({ at: this.t + at, spec }); };
  Show.prototype.step = function (dt) {
    this.t += dt;
    for (let i = this.queue.length - 1; i >= 0; i--) if (this.queue[i].at <= this.t) { this.fire(this.queue[i].spec); this.queue.splice(i, 1); }
    const u = this.unit;
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i]; r.age += dt;
      const k = clamp(r.age / r.dur, 0, 1), e = 1 - Math.pow(1 - k, 2.2);      // decelerating climb
      r.px = r.x; r.py = r.y; r.x = r.x0 + (r.x1 - r.x0) * e + Math.sin(r.age * 9) * 1.2 * u; r.y = r.y0 + (r.y1 - r.y0) * e;
      const n = this.lite ? 1 : 3;
      for (let j = 0; j < n; j++) this.sparks.push({ x: r.x, y: r.y, vx: (Math.random() - .5) * 26 * u, vy: (Math.random() * 30 + 10) * u, age: 0, life: .35 + Math.random() * .45 });
      if (k >= 1) { this.burst(r); this.rockets.splice(i, 1); }
    }
    for (let i = this.stars.length - 1; i >= 0; i--) {
      const s = this.stars[i]; s.age += dt;
      const d = Math.exp(-s.drag * dt); s.vx *= d; s.vy = s.vy * d + s.grav * dt;
      s.px = s.x; s.py = s.y; s.x += s.vx * dt; s.y += s.vy * dt;
      if ((s.kind === 'chrys' || s.kind === 'willow') && !this.lite && Math.random() < (s.kind === 'willow' ? .5 : .25))
        this.sparks.push({ x: s.x, y: s.y, vx: s.vx * .1, vy: s.vy * .1 + 8 * u, age: 0, life: s.kind === 'willow' ? .9 : .4, gold: true });
      if (s.age > s.life) this.stars.splice(i, 1);
    }
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const p = this.sparks[i]; p.age += dt; p.vy += 50 * u * dt; p.px = p.x; p.py = p.y; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.age > p.life) this.sparks.splice(i, 1);
    }
    for (const list of [this.flashes, this.smoke]) for (let i = list.length - 1; i >= 0; i--) { const f = list[i]; f.age += dt; if (f.vx) f.x += f.vx * dt; if (f.age > f.life) list.splice(i, 1); }
  };
  Show.prototype.render = function (dt) {
    const g = this.skyCtx, w = this.w, h = this.h;
    // long-exposure fade: the sky buffer keeps a little of every previous frame
    g.save(); g.globalCompositeOperation = 'destination-out';
    g.fillStyle = `rgba(0,0,0,${clamp(1 - Math.pow(.85, dt * 60), .04, .5)})`; g.fillRect(0, 0, w, h); g.restore();
    g.save(); this.clipSky(g); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    for (const s of this.smoke) {
      const a = Math.sin(clamp(s.age / s.life, 0, 1) * Math.PI) * .011, gr = g.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
      gr.addColorStop(0, `rgba(190,170,150,${a})`); gr.addColorStop(1, 'rgba(190,170,150,0)'); g.fillStyle = gr; g.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
    }
    for (const r of this.rockets) {
      g.strokeStyle = 'rgba(255,214,150,.9)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(r.px ?? r.x, r.py ?? r.y); g.lineTo(r.x, r.y); g.stroke();
      g.globalAlpha = .9; g.drawImage(this.glow, r.x - 7, r.y - 7, 14, 14); g.globalAlpha = 1;
    }
    for (const p of this.sparks) {
      const a = (1 - p.age / p.life) * (p.gold ? .55 : .8);
      g.strokeStyle = p.gold ? `rgba(255,196,110,${a})` : `rgba(255,226,170,${a})`; g.lineWidth = .9;
      g.beginPath(); g.moveTo(p.px ?? p.x, p.py ?? p.y); g.lineTo(p.x, p.y); g.stroke();
    }
    for (const s of this.stars) {
      const k = s.age / s.life;
      // white-hot at the burst, its own colour through flight, cooling to ember at the end
      const col = k < .06 ? mix(COLORS.white, s.color, k / .06) : k > .7 ? mix(s.color, COLORS.ember, (k - .7) / .3) : s.color;
      let a = k < .7 ? 1 : 1 - (k - .7) / .3;
      if (s.kind === 'strobe' && k > .45) a *= Math.sin(s.age * 38 + s.phase) > .2 ? 1 : .05;
      else if (k > .55) a *= .75 + .25 * Math.sin(s.age * 24 + s.phase);
      g.strokeStyle = rgba(col, a); g.lineWidth = s.size;
      g.beginPath(); g.moveTo(s.px ?? s.x, s.py ?? s.y); g.lineTo(s.x, s.y); g.stroke();
      if (k < .2) { g.globalAlpha = (1 - k / .2) * .32; g.drawImage(this.glow, s.x - 5, s.y - 5, 10, 10); g.globalAlpha = 1; }
    }
    for (const f of this.flashes) {   // the burst's own core light, inside the sky
      const a = Math.pow(1 - f.age / f.life, 2.4) * f.power, r = 34 * this.unit * (1 + f.age * 2.5);
      g.globalAlpha = clamp(a * .38, 0, 1); g.drawImage(this.glow, f.x - r, f.y - r, r * 2, r * 2); g.globalAlpha = 1;
    }
    g.restore();

    // compose: sky buffer, the light it throws on the scene, and its reflection on the wet stone
    const c = this.ctx; c.clearRect(0, 0, w, h);
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const f of this.flashes) {
      const a = Math.pow(1 - f.age / f.life, 1.6) * f.power * .22, R = w * .9, gr = c.createRadialGradient(f.x, f.y, 0, f.x, f.y, R);
      gr.addColorStop(0, rgba(f.color, a)); gr.addColorStop(.5, rgba(f.color, a * .35)); gr.addColorStop(1, rgba(f.color, 0));
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
    }
    c.restore();
    c.drawImage(this.sky, 0, 0, w, h);
    const fy0 = this.plate.y + FLOOR[0] * 1536 * this.plate.s, fy1 = Math.min(h, this.plate.y + FLOOR[1] * 1536 * this.plate.s);
    if (fy1 > fy0) {
      const sc = this.smallCtx, sw = this.small.width, sh = this.small.height;
      sc.clearRect(0, 0, sw, sh); sc.drawImage(this.sky, 0, 0, sw, sh);           // tiny copy = free blur
      const roof = this.px(.5, .33)[1];
      c.save(); c.beginPath(); c.rect(0, fy0, w, fy1 - fy0); c.clip();
      c.globalAlpha = this.lite ? .32 : .42; c.globalCompositeOperation = 'lighter';
      c.translate(0, fy0); c.scale(1, -.55); c.drawImage(this.small, 0, 0, sw, roof / h * sh, 0, -roof, w, roof);
      c.restore();
    }
  };
  Show.prototype.idle = function () { return !this.rockets.length && !this.stars.length && !this.sparks.length && !this.flashes.length && !this.queue.length; };

  /* ------------------------------------------------------------ choreography */
  function opening(show) {
    const L = show.lite;
    show.schedule(0, { fx: .5, fy: .4, kind: 'peony', color: 'gold', size: 1.15, n: 150, rise: 2, loud: 1.2 });
    show.schedule(3.4, { fx: .26, fy: .36, kind: 'willow', color: 'gold', size: .95, n: 90 });
    show.schedule(4.3, { fx: .74, fy: .38, kind: 'willow', color: 'gold', size: .95, n: 90 });
    show.schedule(7.2, { fx: .5, fy: .35, kind: 'ring', color: 'turquoise', size: .9, n: 72 });
    if (!L) show.schedule(9.6, { fx: .3, fy: .42, kind: 'double', color: 'champagne', color2: 'rose', size: .9, n: 120 });
    show.schedule(10.4, { fx: .7, fy: .4, kind: 'double', color: 'champagne', color2: 'rose', size: .9, n: 120 });
    show.schedule(13, { fx: .5, fy: .38, kind: 'strobe', color: 'white', size: 1, n: 110 });
    // finale: a short volley, still readable shell by shell
    const fin = L
      ? [[.3, .38, 'chrys', 'gold'], [.7, .4, 'peony', 'rose'], [.5, .34, 'willow', 'gold']]
      : [[.2, .4, 'peony', 'rose'], [.8, .39, 'peony', 'turquoise'], [.38, .33, 'chrys', 'gold'], [.62, .34, 'chrys', 'champagne'], [.5, .42, 'willow', 'gold']];
    fin.forEach((f, i) => show.schedule(16 + i * .42, { fx: f[0], fy: f[1], kind: f[2], color: f[3], size: f[2] === 'willow' ? 1.15 : 1, n: f[2] === 'willow' ? 110 : 120, loud: .9 }));
  }
  function ambient(show) {
    const kinds = ['peony', 'willow', 'chrys', 'ring', 'double'], cols = ['gold', 'champagne', 'rose', 'turquoise'];
    const k = kinds[Math.floor(Math.random() * kinds.length)];
    show.schedule(0, { fx: .25 + Math.random() * .5, fy: .33 + Math.random() * .1, kind: k, color: k === 'willow' ? 'gold' : cols[Math.floor(Math.random() * cols.length)], color2: 'gold', size: .85 + Math.random() * .25, n: 100, loud: .55 });
  }

  /* ------------------------------------------------------------------ mount */
  function mount() {
    const canvas = document.querySelector('[data-fireworks="hero"]'); if (!canvas) return null;
    const hero = document.getElementById('hero');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const lite = () => document.documentElement.dataset.tier === 'lite' || window.Marhamat?.tier === 'lite';
    const sound = new Sound();
    const show = new Show(canvas, { lite: lite(), sound, plate: document.querySelector('.hero__scene') });
    let raf = 0, last = 0, started = false, heroVisible = true, nextAmbient = 0;
    function frame(now) {
      raf = 0; if (document.hidden || !heroVisible) { last = 0; return; }
      const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60; last = now;
      show.step(dt); show.render(dt);
      if (show.t > 22 && show.queue.length === 0 && show.t > nextAmbient) { ambient(show); nextAmbient = show.t + 8 + Math.random() * 5; }
      raf = requestAnimationFrame(frame);
    }
    function resume() { if (started && !raf && !document.hidden && heroVisible) raf = requestAnimationFrame(frame); }
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { heroVisible = es.some(e => e.isIntersecting); resume(); }, { threshold: .05 }).observe(hero);
    document.addEventListener('visibilitychange', resume);
    addEventListener('resize', () => show.resize(), { passive: true });
    return {
      prime() { if (!motion.matches) sound.prime(); },
      celebrate(onFirstBurst) {
        if (started) return; started = true;
        if (motion.matches) { onFirstBurst && onFirstBurst(); return; }
        show.lite = lite(); show.resize(); show.onFirstBurst = onFirstBurst || null; opening(show); resume();
      },
      get show() { return show; }
    };
  }
  const boot = () => { window.SamarqandSalute = mount(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
