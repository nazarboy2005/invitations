/* O‘rik Guli: condensation on the window glass. The fog is a canvas over the view; the couple's
   initials look traced in it with a fingertip (with drips), the guest's finger wipes it clear,
   and the cleared share is measured so the opening can continue. */
(() => {
  'use strict';
  const rand = (a, b) => a + Math.random() * (b - a);

  class Fog {
    constructor(canvas, { dprCap = 2, view = null } = {}) {
      this.canvas = canvas;
      this.view = view;
      this.g = canvas.getContext('2d');
      this.dprCap = dprCap;
      this.drips = [];
      this.last = null;
      this.sample = document.createElement('canvas');
      this.sample.width = 36; this.sample.height = 64;
      this.resize();
    }
    resize() {
      const r = this.canvas.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, this.dprCap);
      this.w = r.width; this.h = r.height;
      this.canvas.width = Math.round(r.width * this.dpr);
      this.canvas.height = Math.round(r.height * this.dpr);
      this.g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    /* A cold, slightly uneven layer of condensation with tiny beads, painted once into a base
       canvas so it can be restored exactly (the traced initials redraw over it while they appear). */
    paint() {
      this.base = document.createElement('canvas');
      this.base.width = this.canvas.width; this.base.height = this.canvas.height;
      const real = this.g;
      this.g = this.base.getContext('2d');
      this.g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.paintBase();
      this.g = real;
      this.restore();
    }
    restore() {
      const g = this.g;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, this.canvas.width, this.canvas.height); g.drawImage(this.base, 0, 0); g.restore();
    }
    paintBase() {
      const { g, w, h } = this;
      g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, w, h);
      // Fogged glass shows the world outside blurred and whitened: draw the view (cover-fitted
      // like the <img>, object-position 50% 40%) through a blur, then a cold haze over it.
      const v = this.view;
      if (v && v.complete && v.naturalWidth) {
        const s = Math.max(w / v.naturalWidth, h / v.naturalHeight), dw = v.naturalWidth * s, dh = v.naturalHeight * s;
        g.save(); g.filter = 'blur(14px) saturate(.7) brightness(1.08)';
        g.drawImage(v, (w - dw) * .5, (h - dh) * .4, dw, dh); g.restore();
      }
      const base = g.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, 'rgba(232,238,244,.44)');
      base.addColorStop(.55, 'rgba(236,241,246,.52)');
      base.addColorStop(1, 'rgba(240,244,248,.62)');
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      // Soft cloudy unevenness: a few large faint blobs.
      for (let i = 0; i < 26; i++) {
        const x = rand(0, w), y = rand(0, h), r = rand(40, 140);
        const q = g.createRadialGradient(x, y, 0, x, y, r);
        const a = rand(.05, .14);
        q.addColorStop(0, `rgba(255,255,255,${a})`); q.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2);
      }
      // Beads of water.
      for (let i = 0; i < Math.round(w * h / 900); i++) {
        const x = rand(0, w), y = rand(0, h), r = Math.pow(Math.random(), 3) * 2.4 + .4;
        g.fillStyle = `rgba(150,165,180,${rand(.12, .3)})`;
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
        g.fillStyle = `rgba(255,255,255,${rand(.4, .8)})`;
        g.beginPath(); g.arc(x - r * .3, y - r * .3, r * .4, 0, Math.PI * 2); g.fill();
      }
    }
    /* Clear a soft-edged dot (one fingertip touch). */
    dab(x, y, r) {
      const g = this.g;
      g.globalCompositeOperation = 'destination-out';
      const q = g.createRadialGradient(x, y, r * .35, x, y, r);
      q.addColorStop(0, 'rgba(0,0,0,.95)'); q.addColorStop(.7, 'rgba(0,0,0,.6)'); q.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = q; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
      g.globalCompositeOperation = 'source-over';
    }
    /* A stroke of the finger from the last point, as overlapping dabs; returns its length. */
    wipeTo(x, y, r) {
      const from = this.last || { x, y };
      const d = Math.hypot(x - from.x, y - from.y), steps = Math.max(1, Math.ceil(d / (r * .3)));
      for (let i = 1; i <= steps; i++) this.dab(from.x + (x - from.x) * i / steps, from.y + (y - from.y) * i / steps, r);
      if (d > r * 1.2 && Math.random() < .35) this.addDrip(x + rand(-r * .5, r * .5), y + r * .6, rand(.6, 1.2));
      this.last = { x, y };
      return d;
    }
    lift() { this.last = null; }
    /* Initials traced with a fingertip: clear strokes of the glyph outline, revealed left to right. */
    traceText(text, cx, cy, size, progress, maxWidth = Infinity) {
      const g = this.g;
      g.save();
      // Shrink to fit the pane: a cut-off initial can't be read.
      g.font = `500 ${size}px "Great Vibes", "Cormorant Garamond", cursive`;
      const natural = g.measureText(text).width;
      if (natural > maxWidth) { size *= maxWidth / natural; g.font = `500 ${size}px "Great Vibes", "Cormorant Garamond", cursive`; }
      g.textAlign = 'center'; g.textBaseline = 'middle';
      const width = g.measureText(text).width + size * .4;
      g.beginPath(); g.rect(cx - width / 2, cy - size, width * progress, size * 2); g.clip();
      g.globalCompositeOperation = 'destination-out';
      g.lineJoin = 'round'; g.lineCap = 'round';
      // A fingertip clears a soft-edged line: a wide faint pass, then a firm core.
      g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = Math.max(6, size * .17); g.strokeText(text, cx, cy);
      g.strokeStyle = 'rgba(0,0,0,.95)'; g.lineWidth = Math.max(4, size * .1); g.strokeText(text, cx, cy);
      g.fillStyle = 'rgba(0,0,0,.85)'; g.fillText(text, cx, cy);
      g.restore();
      return { left: cx - width / 2, right: cx + width / 2, bottom: cy + size * .42 };
    }
    /* A heart traced the same way, drawn left to right. */
    traceHeart(cx, cy, size, progress) {
      const g = this.g, s = size / 2;
      g.save();
      g.beginPath(); g.rect(cx - s * 1.2, cy - s * 1.2, s * 2.4 * progress, s * 2.6); g.clip();
      g.globalCompositeOperation = 'destination-out'; g.lineJoin = 'round'; g.lineCap = 'round';
      g.beginPath();
      g.moveTo(cx, cy + s * .9);
      g.bezierCurveTo(cx - s * 1.3, cy + s * .1, cx - s * .9, cy - s * .95, cx, cy - s * .35);
      g.bezierCurveTo(cx + s * .9, cy - s * .95, cx + s * 1.3, cy + s * .1, cx, cy + s * .9);
      g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = Math.max(6, size * .12); g.stroke();
      g.strokeStyle = 'rgba(0,0,0,.95)'; g.lineWidth = Math.max(4, size * .07); g.stroke();
      g.restore();
      return { left: cx - s, right: cx + s, bottom: cy + s * .9 };
    }
    addDrip(x, y, speed = 1) { this.drips.push({ x, y, len: 0, max: rand(30, 110), w: rand(2.2, 3.6), speed: rand(14, 34) * speed }); }
    /* Drips run down, clearing a thin trail and ending in a bead. Returns true while any is moving. */
    step(dt) {
      const g = this.g; let moving = false;
      g.globalCompositeOperation = 'destination-out';
      for (const d of this.drips) {
        if (d.len >= d.max) continue;
        const grow = Math.min(d.max - d.len, d.speed * dt * (1 - d.len / d.max * .6));
        g.fillStyle = 'rgba(0,0,0,.85)';
        g.fillRect(d.x - d.w / 2, d.y + d.len, d.w, grow + .5);
        d.len += grow; moving = true;
        if (d.len >= d.max - .5) { g.beginPath(); g.arc(d.x, d.y + d.len, d.w * .9, 0, Math.PI * 2); g.fill(); }
      }
      g.globalCompositeOperation = 'source-over';
      return moving;
    }
    /* Share of the glass that is clear, measured on a small copy (cheap enough every few frames). */
    cleared(region) {
      const s = this.sample, sg = s.getContext('2d', { willReadFrequently: true });
      sg.clearRect(0, 0, s.width, s.height);
      const r = region || { x: 0, y: 0, w: this.w, h: this.h };
      sg.drawImage(this.canvas, r.x * this.dpr, r.y * this.dpr, r.w * this.dpr, r.h * this.dpr, 0, 0, s.width, s.height);
      const d = sg.getImageData(0, 0, s.width, s.height).data;
      let clear = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] < 70) clear++;
      return clear / (s.width * s.height);
    }
  }

  window.OrikFog = Fog;
})();
