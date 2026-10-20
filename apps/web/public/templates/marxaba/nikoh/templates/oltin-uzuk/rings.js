/* Oltin Uzuk: photoreal ring film (2.5D).
   Uses the pre-rendered ring photographs (art/rings-angle-1..3.webp) and brings them to life:
   studio light reveal, a specular sweep masked to the gold, diamond sparkles, mirrored floor
   reflection, champagne bokeh, tilt parallax that moves the highlight, a turntable on open and
   on scroll. Replaces the procedural WebGL scene from template.js (see window.__ringsPhoto). */
(() => {
  'use strict';
  window.__ringsPhoto = true;
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite = () => window.Marhamat?.tier === 'lite';
  const ART = ['art/rings-angle-1.webp', 'art/rings-angle-2.webp', 'art/rings-angle-3.webp'];
  const GEM = [[.817, .428], [.835, .386], [.729, .325]]; // diamond centre per angle (fraction of image)
  const rigs = [];
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

  /* ---------- Rig (one photographed ring set with all its effects) ---------- */
  function buildRig(host, { bokeh = 0, cls = '' } = {}) {
    if (!host) return null;
    const el = document.createElement('div');
    el.className = `rx ${cls}`; el.setAttribute('aria-hidden', 'true');
    const angles = ART.map((src, i) => `<div class="rx__angle" data-i="${i}" style="--mask:url(${src})"><img src="${src}" alt="" decoding="async"${i ? ' loading="lazy"' : ''}><span class="rx__shine"></span><span class="rx__shine rx__shine--soft"></span></div>`).join('');
    const mirror = ART.map((src, i) => `<img class="rx__mirror" data-i="${i}" src="${src}" alt="" decoding="async"${i ? ' loading="lazy"' : ''}>`).join('');
    el.innerHTML = `${bokeh ? '<canvas class="rx__bokeh"></canvas>' : ''}<div class="rx__glow"></div>
      <div class="rx__float"><div class="rx__tilt">${angles}
        <span class="rx__gem"><i></i><i></i><i></i><b></b></span></div>
        <div class="rx__reflect">${mirror}</div><span class="rx__shadow"></span></div>
      <canvas class="rx__burst"></canvas>`;
    host.append(el);
    const rig = { el, angles: $$('.rx__angle', el), mirrors: $$('.rx__mirror', el), gem: $('.rx__gem', el), tiltEl: $('.rx__tilt', el), floatEl: $('.rx__float', el), burst: $('.rx__burst', el), weights: [1, 0, 0] };
    setWeights(rig, [1, 0, 0]);
    if (bokeh && !reduced()) rig.bokeh = startBokeh($('.rx__bokeh', el), lite() ? 14 : bokeh);
    rigs.push(rig);
    return rig;
  }

  // Blend the three photographed angles (a cross-fade with a slight squash reads as rotation).
  function setWeights(rig, w) {
    rig.weights = w;
    rig.angles.forEach((a, i) => {
      const k = w[i];
      a.style.opacity = k.toFixed(3);
      a.style.transform = `scaleX(${(0.9 + 0.1 * k).toFixed(3)})`;
    });
    rig.mirrors.forEach((m, i) => { m.style.opacity = (w[i] * 0.32).toFixed(3); });
    const gx = w.reduce((s, k, i) => s + k * GEM[i][0], 0), gy = w.reduce((s, k, i) => s + k * GEM[i][1], 0);
    rig.gem.style.left = `${gx * 100}%`; rig.gem.style.top = `${gy * 100}%`;
  }
  const weightsAt = a => [Math.max(0, 1 - a), Math.max(0, 1 - Math.abs(a - 1)), Math.max(0, a - 1)].map(v => Math.min(1, v));

  // Turntable through the angles: value goes 0 → 1 → 2 (and back) with motion.
  function turn(rig, from, to, duration) {
    const s = { a: from };
    return gsap.to(s, { a: to, duration, ease: 'power2.inOut', onUpdate: () => setWeights(rig, weightsAt(s.a)) });
  }

  // A sweep of light across the gold (masked by the ring photo itself).
  function sweep(rig, { duration = 1.4, strength = 1 } = {}) {
    const shines = $$('.rx__shine:not(.rx__shine--soft)', rig.el);
    return gsap.fromTo(shines, { '--sx': '-60%', '--so': strength }, { '--sx': '160%', duration, ease: 'power2.inOut' });
  }

  /* ---------- Bokeh ---------- */
  function startBokeh(canvas, count) {
    const ctx = canvas.getContext('2d'); if (!ctx) return null;
    let w = 0, h = 0, raf = 0, rush = 0, visible = true;
    const dots = [];
    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * d; canvas.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      dots.length = 0;
      for (let i = 0; i < count; i++) {
        const depth = Math.random();
        dots.push({ x: Math.random() * w, y: Math.random() * h, r: 6 + depth * 26, depth, a: .05 + (1 - depth) * .16, s: .08 + depth * .25, p: Math.random() * 6.28, hue: Math.random() < .2 ? 1 : 0 });
      }
    };
    const draw = () => {
      raf = 0; if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * .42;
      for (const d of dots) {
        d.p += .01; d.y -= d.s * (1 + rush * 6); d.x += Math.sin(d.p) * .15;
        if (rush) { d.x += (d.x - cx) * .02 * rush; d.y += (d.y - cy) * .02 * rush; }
        if (d.y < -40 || d.x < -40 || d.x > w + 40 || d.y > h + 40) { d.x = cx + (Math.random() - .5) * w * (rush ? .3 : 1); d.y = rush ? cy + (Math.random() - .5) * h * .3 : h + 30; }
        const px = d.x + tilt.x * 30 * d.depth, py = d.y + tilt.y * 20 * d.depth;
        const g = ctx.createRadialGradient(px, py, 0, px, py, d.r);
        const c = d.hue ? '255,236,200' : '236,196,120';
        const alpha = d.a * (.75 + .25 * Math.sin(d.p * 2));
        g.addColorStop(0, `rgba(${c},${alpha})`); g.addColorStop(.62, `rgba(${c},${alpha * .7})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, d.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); addEventListener('resize', resize, { passive: true });
    new IntersectionObserver(e => { visible = e[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(draw); }).observe(canvas);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(draw); });
    draw();
    return { set rush(v) { rush = v; }, get rush() { return rush; } };
  }

  /* ---------- Sparkle burst from the diamond ---------- */
  function burst(rig, count = 46) {
    if (reduced()) return;
    const c = rig.burst, ctx = c.getContext('2d'); if (!ctx) return;
    const d = Math.min(devicePixelRatio || 1, 2), w = c.clientWidth, h = c.clientHeight;
    c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    const gr = rig.gem.getBoundingClientRect(), cr = c.getBoundingClientRect();
    const ox = gr.left + gr.width / 2 - cr.left, oy = gr.top + gr.height / 2 - cr.top;
    const parts = Array.from({ length: lite() ? 20 : count }, () => { const a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 5; return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, life: 1, s: 1 + Math.random() * 2.6, star: Math.random() < .35 }; });
    const step = () => {
      ctx.clearRect(0, 0, w, h); let alive = 0;
      for (const p of parts) {
        if (p.life <= 0) continue; alive++;
        p.x += p.vx; p.y += p.vy; p.vx *= .965; p.vy = p.vy * .965 + .05; p.life -= .016;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.star ? '#fffaf0' : '#f6d891';
        if (p.star) { const s = p.s * 3; ctx.beginPath(); ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x + s * .22, p.y - s * .22); ctx.lineTo(p.x + s, p.y); ctx.lineTo(p.x + s * .22, p.y + s * .22); ctx.lineTo(p.x, p.y + s); ctx.lineTo(p.x - s * .22, p.y + s * .22); ctx.lineTo(p.x - s, p.y); ctx.lineTo(p.x - s * .22, p.y - s * .22); ctx.fill(); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
      if (alive) requestAnimationFrame(step); else ctx.clearRect(0, 0, w, h);
    };
    step();
  }

  /* ---------- Tilt (pointer / gyroscope) moves the rings and their highlights ---------- */
  function startTilt() {
    addEventListener('pointermove', e => { tilt.tx = (e.clientX / innerWidth - .5) * 2; tilt.ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
    addEventListener('deviceorientation', e => { if (e.gamma == null) return; tilt.tx = Math.max(-1, Math.min(1, e.gamma / 25)); tilt.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25)); }, { passive: true });
    const loop = () => {
      tilt.x += (tilt.tx - tilt.x) * .06; tilt.y += (tilt.ty - tilt.y) * .06;
      rigs.forEach(r => {
        r.tiltEl.style.transform = `rotateY(${(tilt.x * 9).toFixed(2)}deg) rotateX(${(-tilt.y * 6).toFixed(2)}deg)`;
        r.el.style.setProperty('--tilt-shine', `${(50 + tilt.x * 28).toFixed(1)}%`);
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Scenes ---------- */
  function introFilm(rig) {
    // Act 1: the studio light finds the rings.
    gsap.set(rig.tiltEl, { filter: 'brightness(.06) contrast(1.2)' });
    gsap.set($('.rx__glow', rig.el), { opacity: 0, scale: .6 });
    gsap.set(rig.el, { opacity: 1 });
    const tl = gsap.timeline({ delay: .25 });
    tl.to($('.rx__glow', rig.el), { opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out' }, 0)
      .to(rig.tiltEl, { filter: 'brightness(1) contrast(1)', duration: 2, ease: 'power2.inOut' }, .2)
      .add(sweep(rig, { duration: 1.8, strength: 1 }), .45)
      .fromTo(rig.floatEl, { y: 26, scale: .94 }, { y: 0, scale: 1, duration: 2.4, ease: 'expo.out' }, 0)
      .add(() => rig.el.classList.add('is-lit'), 1.7);
    idle(rig);
  }

  function idle(rig) {
    gsap.to(rig.floatEl, { y: -8, rotation: 1.2, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    const loop = () => { if (!rig.el.isConnected) return; sweep(rig, { duration: 1.6, strength: .7 }); gsap.delayedCall(4.5 + Math.random() * 2, loop); };
    gsap.delayedCall(3.6, loop);
  }

  function openFilm(rig) {
    const t = lite() ? .55 : 1;
    const tl = gsap.timeline();
    tl.to(rig.el, { scale: 1.16, yPercent: -4, duration: 1.7 * t, ease: 'power2.inOut' }, 0)
      .add(turn(rig, 0, 1, .48 * t), .1 * t)
      .add(turn(rig, 1, 2, .48 * t), .58 * t)
      .add(turn(rig, 2, 0, .55 * t), 1.06 * t)
      .add(sweep(rig, { duration: .7 * t, strength: 1.25 }), 1.3 * t)
      .to(rig.tiltEl, { filter: 'brightness(1.35)', duration: .18, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.42 * t)
      .add(() => burst(rig), 1.45 * t);
    if (rig.bokeh) tl.to(rig.bokeh, { rush: 1, duration: .5, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 1.2 * t);
  }

  function heroScroll(rig) {
    if (!window.ScrollTrigger) return;
    const s = { a: 0 };
    gsap.to(s, { a: 2, ease: 'none', onUpdate: () => setWeights(rig, weightsAt(s.a)), scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: .6 } });
    gsap.to(rig.el, { yPercent: 18, scale: .9, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  function init() {
    document.documentElement.classList.add('rx-on');
    const introHost = $('#intro'), heroHost = $('.hero__stage'), cushion = $('.footer__cushion');
    const introRig = buildRig(introHost, { bokeh: 34, cls: 'rx--intro' });
    const heroRig = buildRig(heroHost, { bokeh: 22, cls: 'rx--hero' });
    const footRig = buildRig(cushion, { cls: 'rx--footer' });
    if (!window.gsap || reduced()) { rigs.forEach(r => r.el.classList.add('is-lit')); return; }
    startTilt();
    if (introRig) introFilm(introRig);
    [heroRig, footRig].forEach(r => { if (r) { r.el.classList.add('is-lit'); idle(r); } });
    $('#open-invitation')?.addEventListener('click', () => { if (introRig && !introRig.opened) { introRig.opened = true; openFilm(introRig); } });
    window.Marhamat?.on?.('open', () => { if (heroRig) gsap.delayedCall(lite() ? 1.6 : 2.7, () => { sweep(heroRig, { duration: 1.2, strength: 1.1 }); burst(heroRig, 30); }); });
    if (heroRig) heroScroll(heroRig);
    window.Marhamat?.on?.('rsvp', a => { if (a?.status === 'yes' && footRig) { burst(footRig, 30); } });
  }

  if (window.Marhamat?.on) window.Marhamat.on('ready', () => setTimeout(init, 0));
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
