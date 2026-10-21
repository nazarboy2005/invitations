/* The entrance uses independent dust, sparks and metal rings, in CSS pixels.
   Delta time is in seconds so trajectories remain the same on slower phones. */
(() => {
  'use strict';
  const TAU = Math.PI * 2, rand = (a, b) => a + Math.random() * (b - a);
  class DoiraEffects {
    constructor(canvas, lite) {
      this.canvas = canvas; this.g = canvas.getContext('2d'); this.lite = lite;
      this.particles = []; this.live = false; this.raf = 0; this.last = 0;
      this.ring = window.DoiraDrum.ringSprite(56);
      this.dust = Array.from({ length: lite ? 18 : 46 }, () => ({ x: Math.random(), y: Math.random(), z: rand(.3, 1), phase: rand(0, TAU) }));
      this.frame = this.frame.bind(this); this.resize();
    }
    resize() {
      const r = this.canvas.getBoundingClientRect(); this.w = r.width; this.h = r.height;
      this.dpr = Math.min(devicePixelRatio || 1, this.lite ? 1.5 : 2);
      this.canvas.width = Math.round(this.w * this.dpr); this.canvas.height = Math.round(this.h * this.dpr);
    }
    start() { this.live = true; this.last = 0; if (!this.raf && !document.hidden) this.raf = requestAnimationFrame(this.frame); }
    stop() { this.live = false; cancelAnimationFrame(this.raf); this.raf = 0; }
    clear() { this.particles.length = 0; this.g.clearRect(0, 0, this.canvas.width, this.canvas.height); }
    burst(x, y, radius, power = 1, rings = false) {
      const n = Math.round((this.lite ? 15 : 34) * power);
      for (let i = 0; i < n; i++) {
        const a = rand(0, TAU), r = radius * rand(.88, 1.02), speed = rand(25, 110) * power;
        this.particles.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - rand(15, 60), age: 0, life: rand(1.1, 2.7), size: rand(.7, 2), rotation: rand(0, TAU), spin: rand(-3, 3), ring: rings && i % 5 === 0 });
      }
      this.particles = this.particles.slice(-220);
      this.start();
    }
    part() {
      // A brief shower follows the opening seam, with varied speed and depth.
      for (let i = 0; i < (this.lite ? 35 : 100); i++) {
        const side = Math.random() < .5 ? -1 : 1;
        this.particles.push({ x: this.w * .5 + rand(-5, 5), y: rand(this.h * .12, this.h * .9), vx: side * rand(20, 95), vy: rand(-35, 35), age: -rand(0, .8), life: rand(2, 4.5), size: rand(.5, 1.6), rotation: rand(0, TAU), spin: rand(-2, 2), ring: false });
      }
      this.start();
    }
    frame(now) {
      this.raf = 0;
      if (!this.live || document.hidden) return;
      const dt = this.last ? Math.min((now - this.last) / 1000, .04) : .016; this.last = now;
      const g = this.g; g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); g.clearRect(0, 0, this.w, this.h);
      for (const p of this.dust) {
        p.y -= dt * .005 * p.z; if (p.y < -.02) p.y = 1.02;
        const a = (.15 + (Math.sin(now / 1700 + p.phase) + 1) * .12) * p.z;
        g.globalAlpha = a; g.fillStyle = '#f4d9aa';
        g.beginPath(); g.arc(p.x * this.w + Math.sin(now / 5000 + p.phase) * 8, p.y * this.h, p.z * 1.15, 0, TAU); g.fill();
      }
      this.particles = this.particles.filter(p => {
        p.age += dt; if (p.age < 0) return true; if (p.age > p.life) return false;
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= Math.exp(-.6 * dt); p.vy += (p.ring ? 170 : 15) * dt; p.rotation += p.spin * dt;
        const alpha = Math.sin(Math.min(1, p.age / .08) * Math.PI / 2) * Math.pow(1 - p.age / p.life, 1.4);
        g.save(); g.globalAlpha = alpha * (p.ring ? .9 : .8); g.translate(p.x, p.y);
        if (p.ring) { g.rotate(p.rotation); const s = p.size * 9; g.scale(.45 + Math.abs(Math.cos(p.age * 4 + p.spin)) * .55, 1); g.drawImage(this.ring, -s / 2, -s / 2, s, s); }
        else { g.strokeStyle = '#fbd393'; g.lineWidth = p.size * .65; g.beginPath(); g.moveTo(0, 0); g.lineTo(-p.vx * .024, -p.vy * .024); g.stroke(); g.fillStyle = '#fff0cc'; g.beginPath(); g.arc(0, 0, p.size * .65, 0, TAU); g.fill(); }
        g.restore(); return true;
      });
      g.globalAlpha = 1; this.raf = requestAnimationFrame(this.frame);
    }
  }
  window.DoiraEffects = DoiraEffects;
})();
