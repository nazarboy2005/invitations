/* Sahifa: editorial kinetic typography for the inner page (cover arrival, spreads, tickers).
   The decode intro in template.js is untouched. */
(() => {
 'use strict';
 const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
 const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
 const lite = () => window.Marhamat?.tier === 'lite';
 const rand = (a, b) => a + Math.random() * (b - a);
 const live = el => !!el && !el.closest('[hidden]');

 // Splits text into masked words containing chars (keeps <br>, <em>, nested spans).
 function chars(el) {
  if (!el || el.dataset.split) return [];
  el.dataset.split = '1';
  const out = [];
  const walk = node => Array.from(node.childNodes).forEach(child => {
   if (child.nodeType === 3) {
    const frag = document.createDocumentFragment();
    child.textContent.split(/(\s+)/).forEach(part => {
     if (!part) return;
     if (/^\s+$/.test(part)) { frag.append(' '); return; }
     const mask = document.createElement('span'); mask.className = 'sh-mask';
     Array.from(part).forEach(ch => { const c = document.createElement('span'); c.className = 'sh-char'; c.textContent = ch; mask.append(c); out.push(c); });
     frag.append(mask);
    });
    child.replaceWith(frag);
   } else if (child.nodeType === 1 && child.tagName !== 'BR' && child.tagName !== 'EM') walk(child);
  });
  walk(el);
  return out;
 }
 function words(el) {
  if (!el || el.dataset.split) return [];
  el.dataset.split = '1';
  const out = [];
  el.childNodes.forEach(n => {
   if (n.nodeType !== 3) return;
   const frag = document.createDocumentFragment();
   n.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) { frag.append(p); return; } const w = document.createElement('span'); w.className = 'sh-word'; w.textContent = p; frag.append(w); out.push(w); });
   n.replaceWith(frag);
  });
  return out;
 }
 const once = (trigger, start = 'top 80%') => ({ trigger, start, once: true });
 // Skip animations whose trigger sits in a section hidden by core (no photos, no gift, ...).
 const guard = fn => function (targets, from, to) { const st = (to || from || {}).scrollTrigger; const t = st && (typeof st.trigger === 'string' ? document.querySelector(st.trigger) : st.trigger); if (st && !live(t)) return null; const el = typeof targets === 'string' ? document.querySelector(targets) : targets; if (typeof targets === 'string' && !el) return null; return fn.apply(this, arguments); };

 /* ---------- Cover ---------- */
 function cover() {
  const hero = $('#hero'); if (!hero) return;
  const mast = $('.hero__masthead span:first-child'), mastChars = chars(mast);
  const groom = $('.hero__names > span[data-slot="groom"]'), bride = $('.hero__names > span[data-slot="bride"]');
  const gChars = chars(groom), bChars = chars(bride), amp = $('.hero__names em');
  const day = $('.hero__date strong'), dayValue = parseInt(day?.textContent, 10) || 0;
  const bars = $('.hero__barcode'); let barEls = [];
  if (bars && bars.firstChild?.nodeType === 3) {
   const text = bars.firstChild.textContent, frag = document.createDocumentFragment();
   Array.from(text).forEach(ch => { const s = document.createElement('span'); s.className = ch === '|' ? 'sh-bar' : ''; s.textContent = ch; frag.append(s); if (ch === '|') barEls.push(s); });
   bars.firstChild.replaceWith(frag);
  }
  const light = document.createElement('div'); light.className = 'sh-light'; light.setAttribute('aria-hidden', 'true'); hero.prepend(light);

  if (day) day.textContent = '00';
  gsap.set(mastChars, { yPercent: -110 });
  gsap.set('.hero__masthead', { '--rule': 0 });
  gsap.set('.hero__masthead span:last-child', { opacity: 0 });
  gsap.set([...gChars, ...bChars], { yPercent: 115, rotation: 8 });
  gsap.set(amp, { scale: 0, rotation: -200 });
  gsap.set('.hero__kicker', { opacity: 0, letterSpacing: '.9em' });
  gsap.set('.hero__date span', { clipPath: 'inset(0 100% 0 0)' });
  gsap.set('.hero__coverline--top', { x: -70, opacity: 0 });
  gsap.set('.hero__coverline--bottom > span', { x: 70, opacity: 0 });
  gsap.set(barEls, { scaleY: 0, transformOrigin: '50% 100%' });
  gsap.set(['.hero__folio', '.hero__barcode small'], { opacity: 0 });
  gsap.set('.marquee--hero', { yPercent: 100 });

  let played = false;
  const play = () => {
   if (played) return; played = true; ScrollTrigger.refresh();
   const counter = { v: 0 };
   gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to(mastChars, { yPercent: 0, duration: .9, stagger: .05 }, 0)
    .to('.hero__masthead', { '--rule': 1, duration: 1.1, ease: 'power3.inOut' }, .1)
    .to('.hero__masthead span:last-child', { opacity: 1, duration: .6 }, .5)
    .to('.hero__kicker', { opacity: 1, letterSpacing: '.25em', duration: 1.2 }, .3)
    .to(gChars, { yPercent: 0, rotation: 0, duration: 1.1, stagger: .045 }, .45)
    .to(amp, { scale: 1, rotation: 0, duration: 1.1, ease: 'back.out(1.8)' }, .85)
    .to(bChars, { yPercent: 0, rotation: 0, duration: 1.1, stagger: .045 }, .75)
    .to(counter, { v: dayValue, duration: 1.3, ease: 'power3.out', onUpdate: () => { if (day) day.textContent = String(Math.round(counter.v)).padStart(2, '0'); } }, .9)
    .to('.hero__date span', { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power2.inOut' }, 1.2)
    .to('.hero__coverline--top', { x: 0, opacity: 1, duration: 1 }, 1.1)
    .to('.hero__coverline--bottom > span', { x: 0, opacity: 1, duration: 1, stagger: .12 }, 1.25)
    .to(barEls, { scaleY: 1, duration: .5, stagger: { each: .03, from: 'random' }, ease: 'power2.out' }, 1.4)
    .to(['.hero__folio', '.hero__barcode small'], { opacity: 1, duration: .6 }, 1.7)
    .to('.marquee--hero', { yPercent: 0, duration: .8 }, 1.5);
   // Scrolling away: the names split apart, the masthead lifts, the watermark grows.
   const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
   gsap.to(groom, { xPercent: -45, ease: 'none', scrollTrigger: st });
   gsap.to(bride, { xPercent: 45, ease: 'none', scrollTrigger: st });
   gsap.to(amp, { rotation: 360, scale: 1.8, ease: 'none', scrollTrigger: st });
   gsap.to('.hero__masthead', { yPercent: -120, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '40% top' } });
   gsap.to('.hero__fallback', { scale: 1.35, ease: 'none', scrollTrigger: st });
   gsap.to(['.hero__coverline', '.hero__barcode', '.hero__folio'], { y: -80, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
  };
  const body = document.body;
  if (body.classList.contains('is-open')) play();
  else new MutationObserver((_, obs) => {
   if (body.classList.contains('is-open')) { obs.disconnect(); play(); }
   else if (body.classList.contains('is-opening')) { obs.disconnect(); gsap.delayedCall(1.75, play); }
  }).observe(body, { attributes: true, attributeFilter: ['class'] });
 }

 /* ---------- Tickers react to scroll speed and direction ---------- */
 function tickers() {
  const tracks = $$('[data-marquee]'); if (!tracks.length) return;
  let velocity = 0, dir = 1;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { velocity = Math.abs(self.getVelocity()); dir = self.direction; } });
  const state = tracks.map(t => { t.style.animation = 'none'; return { t, x: 0 }; });
  gsap.ticker.add((time, delta) => {
   velocity *= .92;
   const speed = (40 + Math.min(velocity, 3000) * .35) * (delta / 1000);
   state.forEach(s => {
    const half = s.t.scrollWidth / 2; if (!half) return;
    s.x -= speed * dir;
    if (s.x <= -half) s.x += half; if (s.x > 0) s.x -= half;
    s.t.style.transform = `translate3d(${s.x}px,0,0)`;
   });
  });
 }

 /* ---------- Spreads ---------- */
 function spreads() {
  $$('#page > section, #page > footer').forEach(sec => {
   if (!live(sec)) return;
   const head = $(':scope > .section-head', sec);
   if (head) {
    gsap.fromTo(head, { '--rule': 0 }, { '--rule': 1, duration: 1.1, ease: 'power3.inOut', scrollTrigger: once(sec, 'top 85%') });
    gsap.fromTo($$(':scope > span', head), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .1, ease: 'expo.out', scrollTrigger: once(sec, 'top 85%') });
    // Giant outlined page number drifting behind the spread.
    const num = (head.textContent.match(/^\s*(\d{2})/) || [])[1];
    if (num && !lite()) {
     const n = document.createElement('span'); n.className = 'sh-num'; n.setAttribute('aria-hidden', 'true'); n.textContent = num; sec.prepend(n);
     gsap.fromTo(n, { yPercent: 40, rotation: -6 }, { yPercent: -40, rotation: 4, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
   }
   const eyebrow = $(':scope > .eyebrow', sec);
   if (eyebrow) gsap.fromTo(eyebrow, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power2.inOut', scrollTrigger: once(sec, 'top 80%') });
   const title = $(':scope > .section-title', sec);
   if (title) gsap.fromTo(chars(title), { yPercent: 120, rotation: 10 }, { yPercent: 0, rotation: 0, duration: 1, stagger: .022, ease: 'expo.out', scrollTrigger: once(sec, 'top 78%') });
   const foot = $(':scope > .section-foot', sec);
   if (foot) gsap.fromTo(foot, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, scrollTrigger: once(foot, 'top 95%') });
  });
  // Reading progress bar.
  const bar = document.createElement('div'); bar.className = 'sh-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.append(bar);
  gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#page', start: 'top top', end: 'bottom bottom', scrub: .3 } });
 }

 /* ---------- Letter from the editors ---------- */
 function letter() {
  const body = $('.letter__body'), w = words(body);
  if (w.length) gsap.fromTo(w, { opacity: .12 }, { opacity: 1, stagger: .5, ease: 'none', scrollTrigger: { trigger: body, start: 'top 82%', end: 'bottom 45%', scrub: true } });
  gsap.fromTo('.dropcap', { scale: 3.2, opacity: 0, rotation: -12 }, { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: once('.letter__aside', 'top 85%') });
  gsap.fromTo('.letter__quote', { clipPath: 'inset(0 0 100% 0)', y: 20 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: once('.letter__quote', 'top 88%') });
  gsap.fromTo('.letter__sign', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .9, ease: 'expo.out', scrollTrigger: once('.letter__sign', 'top 92%') });
 }

 /* ---------- Date spread ---------- */
 function date() {
  const huge = $('.date-huge');
  if (huge) gsap.fromTo(huge, { scale: 2.4, xPercent: -18, rotation: -8, '--fill': 0 }, { scale: 1, xPercent: 0, rotation: 0, '--fill': 1, ease: 'none', scrollTrigger: { trigger: '.date-layout', start: 'top bottom', end: 'top 40%', scrub: true } });
  const vert = $('.date-vertical');
  if (vert) gsap.fromTo(chars(vert), { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, stagger: .05, ease: 'back.out(2)', scrollTrigger: once(vert, 'top 85%') });
  gsap.fromTo('.date-meta > *', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: .8, stagger: .1, ease: 'expo.out', scrollTrigger: once('.date-meta', 'top 85%') });
  const cells = $$('.calendar .calendar-day:not(.is-empty)');
  if (cells.length) gsap.fromTo(cells, { rotationX: -95, opacity: 0, transformPerspective: 500 }, { rotationX: 0, opacity: 1, duration: .6, ease: 'power3.out', stagger: { each: .022, from: 'start' }, scrollTrigger: once('.calendar', 'top 82%'), onComplete: () => $('.calendar .is-event')?.classList.add('sh-pulse') });
  gsap.fromTo('.countdown > div', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .08, ease: 'expo.out', scrollTrigger: once('.countdown', 'top 90%') });
  $$('.countdown [data-unit]').forEach(el => {
   let prev = el.textContent;
   new MutationObserver(() => { if (el.textContent === prev) return; prev = el.textContent; gsap.fromTo(el, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: 'expo.out' }); }).observe(el, { childList: true, characterData: true, subtree: true });
  });
  gsap.fromTo('.date-spread [data-ics]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power3.inOut', scrollTrigger: once('.date-spread [data-ics]', 'top 92%') });
 }

 /* ---------- Program, venue, gallery ---------- */
 function program() {
  $$('.program__item').forEach((li, i) => {
   const t = $('time', li), title = $('span', li);
   const tl = gsap.timeline({ scrollTrigger: once(li, 'top 88%') });
   if (t) tl.fromTo(t, { xPercent: -60, opacity: 0, skewX: -12 }, { xPercent: 0, opacity: 1, skewX: 0, duration: .9, ease: 'expo.out' }, 0);
   if (title) tl.fromTo(title, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: .8, ease: 'expo.out' }, .1);
   tl.fromTo($('i', li), { rotation: -90, opacity: 0 }, { rotation: 0, opacity: 1, duration: .6, ease: 'back.out(2)' }, .3);
  });
 }
 function venue() {
  const photo = $('.venue__photo');
  if (photo) gsap.fromTo(photo, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: once(photo, 'top 85%') });
  gsap.fromTo('.venue__photo img', { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: once(photo, 'top 85%') });
  gsap.fromTo('.venue__caption > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .12, ease: 'expo.out', scrollTrigger: once('.venue__caption', 'top 88%') });
  const label = $('.venue__photo-label'); if (label) gsap.fromTo(label, { xPercent: -110 }, { xPercent: 0, duration: .9, ease: 'expo.out', delay: .6, scrollTrigger: once(photo, 'top 85%') });
 }
 function gallery() {
  const items = $$('.gallery__item');
  if (items.length) gsap.fromTo(items, { y: 90, rotation: () => rand(-7, 7), opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 1.1, stagger: .09, ease: 'expo.out', scrollTrigger: once('.gallery', 'top 88%') });
  // Photos lean with scroll speed.
  const g = $('.gallery--editorial');
  if (live(g) && !lite()) { const skew = gsap.quickTo(g, 'skewX', { duration: .5, ease: 'power3' }); ScrollTrigger.create({ trigger: '.gallery-spread', start: 'top bottom', end: 'bottom top', onUpdate: s => skew(gsap.utils.clamp(-7, 7, s.getVelocity() / -260)) }); }
 }

 /* ---------- RSVP, wishes, gift, contacts, back cover ---------- */
 function rsvp() {
  const title = $('.rsvp-title'), letters = chars(title);
  if (letters.length) gsap.fromTo(letters, { yPercent: -160, rotation: () => rand(-25, 25), opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 1.1, stagger: .09, ease: 'bounce.out', scrollTrigger: once('.rsvp-spread', 'top 75%') });
  gsap.fromTo('.rsvp__intro', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, scrollTrigger: once('.rsvp__intro', 'top 90%') });
  gsap.fromTo('.rsvp__choices button', { xPercent: 110, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .9, stagger: .12, ease: 'expo.out', scrollTrigger: once('.rsvp__choices', 'top 88%') });
  gsap.fromTo('.rsvp__fields > *:not(.rsvp__choices)', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .08, ease: 'power3.out', scrollTrigger: once('.rsvp__fields', 'top 70%') });
  $$('.rsvp__choices button').forEach(b => b.addEventListener('click', () => { b.classList.remove('sh-flash'); void b.offsetWidth; b.classList.add('sh-flash'); }));
 }
 function rest() {
  $$('.wishes > li').forEach((li, i) => gsap.fromTo(li, { x: i % 2 ? 90 : -90, rotation: i % 2 ? 3 : -3, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 1, ease: 'expo.out', scrollTrigger: once(li, 'top 90%') }));
  window.Marhamat?.on?.('wish', () => { const li = $('.wishes > li:last-child'); if (li) gsap.fromTo(li, { scale: .8, opacity: 0, rotation: -4 }, { scale: 1, opacity: 1, rotation: 0, duration: .8, ease: 'back.out(1.8)' }); });
  gsap.fromTo('.wish-form > *', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .08, scrollTrigger: once('.wish-form', 'top 88%') });
  const gift = $('.gift');
  if (gift) gsap.fromTo(gift, { rotationX: -80, opacity: 0, transformPerspective: 900, transformOrigin: '50% 0%' }, { rotationX: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: once(gift, 'top 88%') });
  $$('.contacts > li').forEach((li, i) => gsap.fromTo(li, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, delay: i * .12, ease: 'power3.inOut', scrollTrigger: once(li, 'top 92%') }));
  const mono = $('.back-cover__monogram');
  if (mono) gsap.fromTo(chars(mono), { scale: 3, yPercent: 60, opacity: 0 }, { scale: 1, yPercent: 0, opacity: 1, duration: 1.3, stagger: .1, ease: 'expo.out', scrollTrigger: once('.back-cover', 'top 75%') });
  gsap.fromTo('.back-cover__rule', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut', scrollTrigger: once('.back-cover', 'top 70%') });
  gsap.fromTo(['.back-cover__date', '.back-cover > p[data-slot="footer"]', '.back-cover__top'], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, stagger: .12, scrollTrigger: once('.back-cover', 'top 75%') });
 }

 function init() {
  if (!window.gsap || !window.ScrollTrigger || reduced()) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo = guard(gsap.fromTo.bind(gsap)); gsap.to = guard(gsap.to.bind(gsap));
  document.documentElement.classList.add('sh-motion');
  cover(); tickers(); spreads(); letter(); date(); program(); venue(); gallery(); rsvp(); rest();
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
 }
 if (window.Marhamat?.on) window.Marhamat.on('ready', () => setTimeout(init, 0));
 else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
 else init();
})();
