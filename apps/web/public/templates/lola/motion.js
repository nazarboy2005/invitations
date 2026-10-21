/* Lola: fits the layered bouquet like object-fit:contain, and sends butterflies around it. */
(() => {
 'use strict';
 const $ = (s, c = document) => c.querySelector(s);
 const rand = (a, b) => a + Math.random() * (b - a);
 const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;

 function fit() {
  const wrap = $('.bq'), inner = $('.bq-inner'); if (!wrap || !inner) return;
  const w = wrap.offsetWidth, h = wrap.offsetHeight; if (!w || !h) return;
  const s = Math.min(w / 900, h / 1200), iw = 900 * s, ih = 1200 * s;
  Object.assign(inner.style, { width: iw + 'px', height: ih + 'px', left: (w - iw) / 2 + 'px', top: (h - ih) / 2 + 'px' });
 }

 const WING = (fill, edge) => `<svg viewBox="0 0 30 24" aria-hidden="true"><g class="wing wing--l"><path d="M15 12C11 2 3 0 1.5 4.5S5 13 9 13C4 15 3 21 7 22s7-5 8-10z" fill="${fill}" stroke="${edge}" stroke-width=".7"/></g><g class="wing wing--r"><path d="M15 12c4-10 12-12 13.5-7.5S25 13 21 13c5 2 6 8 2 9s-7-5-8-10z" fill="${fill}" stroke="${edge}" stroke-width=".7"/></g><path d="M15 6.5v12" stroke="#4A2C3A" stroke-width="1.4" stroke-linecap="round"/><path d="M15 7c-1-3-3-4-4-5m4 5c1-3 3-4 4-5" stroke="#4A2C3A" stroke-width=".6" fill="none"/></svg>`;

 // A butterfly wanders between random points around the bouquet, sometimes pausing on a flower.
 function butterfly(arch, colors, delay) {
  const el = document.createElement('span'); el.className = 'butterfly'; el.innerHTML = WING(colors[0], colors[1]); arch.append(el);
  const pos = { x: rand(.2, .8), y: rand(.15, .45) }, box = () => ({ w: arch.clientWidth, h: arch.clientHeight });
  let angle = 0;
  const place = () => { const b = box(); gsap.set(el, { x: pos.x * b.w - 23, y: pos.y * b.h - 18, rotation: angle }); };
  const hop = () => {
   if (!el.isConnected) return;
   const rest = Math.random() < .3;
   const tx = rest ? rand(.25, .75) : rand(.08, .92), ty = rest ? rand(.12, .42) : rand(.06, .62);
   const b = box(), dx = (tx - pos.x) * b.w, dy = (ty - pos.y) * b.h;
   angle = Math.max(-35, Math.min(35, Math.atan2(dy, Math.abs(dx) + 1) * 57 * .5)) + (dx < 0 ? -12 : 12);
   el.classList.remove('is-resting');
   const dur = Math.max(.9, Math.hypot(dx, dy) / 90);
   const flutter = { k: 0 };
   gsap.to(flutter, { k: 1, duration: dur, ease: 'sine.inOut', onUpdate: () => {
    pos.x += (tx - pos.x) * .08; pos.y += (ty - pos.y) * .08;
    const wobble = Math.sin(flutter.k * Math.PI * 6) * 6;
    const bb = box(); gsap.set(el, { x: pos.x * bb.w - 23, y: pos.y * bb.h - 18 + wobble, rotation: angle });
   }, onComplete: () => {
    if (rest) { el.classList.add('is-resting'); gsap.to(el, { rotation: 0, duration: .4 }); gsap.delayedCall(rand(1.4, 2.6), hop); }
    else hop();
   } });
  };
  place();
  gsap.to(el, { opacity: 1, duration: .8, delay });
  gsap.delayedCall(delay, hop);
 }

 function init() {
  fit(); addEventListener('resize', fit, { passive: true });
  if (!window.gsap || reduced()) return;
  const arch = $('.hero__arch'); if (!arch) return;
  const start = () => {
   butterfly(arch, ['#F2A68F', '#C8414B'], .6);
   if (window.Marhamat?.tier !== 'lite') butterfly(arch, ['#FBE3C4', '#E07A5F'], 2.2);
  };
  if (document.body.classList.contains('is-open')) start();
  else new MutationObserver((_, obs) => { if (document.body.classList.contains('is-open')) { obs.disconnect(); setTimeout(fit, 0); start(); } }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
 }

 if (window.Marhamat?.on) window.Marhamat.on('ready', () => setTimeout(init, 0));
 else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
 else init();
})();
