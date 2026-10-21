/* Samarqand Kechasi: invitation typography and section entrances.
   template.js controls the opening and the title reveal; fireworks.js runs the salute. */
(() => {
 'use strict';
 const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
 const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
 const lite = () => window.Marhamat?.tier === 'lite';
 const rand = (a, b) => a + Math.random() * (b - a);
 const live = el => !!el && !el.closest('[hidden]');

 // Wraps each word (or char) in a mask so it can rise into view.
 function split(el, mode) {
  if (!el || el.dataset.split) return [];
  el.dataset.split = mode;
  const out = [];
  const walk = node => {
   Array.from(node.childNodes).forEach(child => {
    if (child.nodeType === 3) {
     const frag = document.createDocumentFragment();
     child.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.append(part); return; }
      const mask = document.createElement('span'); mask.className = 'sk-mask';
      if (mode === 'chars') {
       Array.from(part).forEach(ch => { const c = document.createElement('span'); c.className = 'sk-unit'; c.textContent = ch; mask.append(c); out.push(c); });
      } else { const w = document.createElement('span'); w.className = 'sk-unit'; w.textContent = part; mask.append(w); out.push(w); }
      frag.append(mask);
     });
     child.replaceWith(frag);
    } else if (child.nodeType === 1 && child.tagName !== 'EM') walk(child);
   });
  };
  walk(el);
  return out;
 }

 function ornament(h2) {
  if (!h2 || h2.nextElementSibling?.classList.contains('sk-ornament')) return null;
  const o = document.createElement('div');
  o.className = 'sk-ornament'; o.setAttribute('aria-hidden', 'true');
  o.innerHTML = '<i></i><svg viewBox="0 0 24 24"><path d="M12 0l3 7.5 7.5-3L19 12l3.5 7.5L15 16.5 12 24l-3-7.5-7.5 3L5 12 1.5 4.5 9 7.5z"/></svg><i></i>';
  h2.after(o);
  return o;
 }

 function sweep(host) {
  if (!host || $('.sk-sweep', host)) return;
  const s = document.createElement('span'); s.className = 'sk-sweep'; s.setAttribute('aria-hidden', 'true'); host.append(s);
 }


 function heroArrival() {
  const copy = $('.hero__copy'); if (!copy) return;
  let played = false;
  const play = () => {
   if (played) return; played = true;
   // Reveal a distinct title composition after the courtyard has moved into place.
   gsap.fromTo(copy.children, { opacity: 0, y: 18, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.25, stagger: .16, delay: .2, ease: 'power2.out', clearProps: 'transform,filter' });
  };
  if (document.body.classList.contains('is-open')) play();
  else new MutationObserver((_, obs) => { if (document.body.classList.contains('is-open')) { obs.disconnect(); play(); } }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
 }

 function headings() {
  $$('.section').forEach(section => {
   if (!live(section)) return;
   const eyebrow = $('.eyebrow', section), h2 = $('h2', section);
   const words = split(h2, 'words');
   const orn = ornament(h2);
   const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 82%', once: true } });
   if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, letterSpacing: '.6em' }, { opacity: 1, letterSpacing: '.25em', duration: .9, ease: 'power3.out' }, 0);
   if (words.length) tl.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: .85, stagger: .07, ease: 'expo.out' }, .1);
   if (orn) tl.fromTo($$('i', orn), { scaleX: 0 }, { scaleX: 1, duration: .9, ease: 'power3.inOut' }, .35)
    .fromTo($('svg', orn), { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.8)' }, .4);
  });
 }

 // Reveals children of a section when it scrolls in.
 function reveal(trigger, targets, from, extra = {}) {
  const els = typeof targets === 'string' ? $$(targets) : targets;
  if (!trigger || !live(trigger) || !els.length) return null;
  return gsap.fromTo(els, from, { x: 0, y: 0, scale: 1, rotation: 0, rotationY: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .08, ...extra, scrollTrigger: { trigger, start: 'top 80%', once: true } });
 }

 function sections() {
  // Invitation: the arch panel lifts like a gate, then its lines follow.
  const panel = $('.arch-panel');
  reveal($('#invitation-text'), [panel], { y: 60, scale: .92, opacity: 0 }, { duration: 1.2 });
  reveal(panel, $$('.arch-panel > p, .arch-panel .star-divider'), { y: 22, opacity: 0 }, { delay: .35, stagger: .12 });

  // Tile band drifts sideways with scroll.
  gsap.fromTo('.tile-band__inner', { x: -36 }, { x: 36, ease: 'none', scrollTrigger: { trigger: '.tile-band', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Calendar: tiles cascade in, then the wedding star flips and starts to glow.
  const cal = $('.calendar');
  if (live(cal)) {
   const days = $$('.calendar-day:not(.is-empty)', cal), event = $('.calendar-day.is-event', cal);
   gsap.timeline({ scrollTrigger: { trigger: cal, start: 'top 80%', once: true } })
    .fromTo(cal, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out' })
    .fromTo($$('.calendar-top, .calendar-weekdays', cal), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .6, stagger: .1 }, .2)
    .fromTo(days, { scale: .2, rotation: -45, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .55, ease: 'back.out(1.6)', stagger: { each: .018, from: 'start' } }, .3)
    .fromTo(event, { rotationY: 180, scale: 1.6 }, { rotationY: 0, scale: 1, duration: 1, ease: 'expo.out', immediateRender: false }, '-=.2')
    .add(() => event?.classList.add('is-pulsing'));
  }
  reveal($('.countdown'), $$('.countdown > div'), { y: 50, opacity: 0, scale: .8 }, { ease: 'back.out(1.5)', stagger: .1 });
  reveal($('.date__time'), $$('.date__time, .date-section [data-ics]'), { y: 18, opacity: 0 }, { stagger: .12 });
  // Countdown digits roll on every change.
  $$('.countdown [data-unit]').forEach(el => {
   let prev = el.textContent;
   new MutationObserver(() => { if (el.textContent === prev) return; prev = el.textContent; gsap.fromTo(el, { yPercent: -70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: 'back.out(1.6)' }); }).observe(el, { childList: true, characterData: true, subtree: true });
  });

  // Program: each line slides in and lights up as the gold rail reaches it.
  $$('.program__item').forEach((item, i) => {
   gsap.fromTo(item, { x: 46, opacity: 0 }, { x: 0, opacity: 1, duration: .8, ease: 'expo.out', delay: i * .04, scrollTrigger: { trigger: item, start: 'top 86%', once: true } });
   ScrollTrigger.create({ trigger: item, start: 'top 66%', end: 'bottom top', toggleClass: 'is-lit' });
  });

  // Venue: arch photo rises, the photo slowly drifts (Ken Burns), details follow.
  const photo = $('.venue__photo'); sweep(photo);
  reveal($('#venue'), [photo], { y: 60, scale: .9, opacity: 0 }, { duration: 1.2, onComplete: () => photo?.classList.add('is-lit') });
  if (!lite()) gsap.fromTo('.venue__photo img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true } });
  reveal(photo, $$('.venue-section h3, .venue-section > .muted, .venue-section .button'), { y: 22, opacity: 0 }, { delay: .3, stagger: .1 });

  // Gallery: arches fly in from the right, then hand control back to the coverflow.
  const rail = $('.gallery'), items = $$('.gallery__item');
  if (rail && items.length) gsap.fromTo(items, { x: 160, rotationY: -60, opacity: 0 }, { x: 0, rotationY: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: rail, start: 'top 82%', once: true }, onComplete: () => { gsap.set(items, { clearProps: 'transform,opacity' }); rail.dispatchEvent(new Event('scroll')); } });

  // RSVP: the frame glows, choices slide in, a tap gives a little press + sparkle.
  const rsvp = $('#rsvp');
  ScrollTrigger.create({ trigger: rsvp, start: 'top 70%', once: true, onEnter: () => rsvp?.classList.add('is-lit') });
  reveal(rsvp, $$('.rsvp__choices button'), { x: -60, opacity: 0 }, { stagger: .12, delay: .3 });
  reveal($('.rsvp__fields .field'), $$('.rsvp__fields .field, .rsvp__party, .rsvp__deadline, .rsvp__fields [data-rsvp-submit]'), { y: 20, opacity: 0 }, { stagger: .08 });
  $$('.rsvp__choices button').forEach(btn => btn.addEventListener('click', () => {
   gsap.fromTo(btn, { scale: .95 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
   const spark = document.createElement('span'); spark.className = 'sk-tap'; spark.setAttribute('aria-hidden', 'true'); btn.append(spark); setTimeout(() => spark.remove(), 700);
  }));

  // Wishes: cards land from alternating sides.
  $$('.wishes__item').forEach((card, i) => gsap.fromTo(card, { x: i % 2 ? 50 : -50, rotation: i % 2 ? 4 : -4, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } }));
  reveal($('.wish-form'), $$('.wish-form > *'), { y: 18, opacity: 0 }, { stagger: .08 });
  window.Marhamat?.on?.('wish', () => { const last = $('.wishes__item:last-child'); if (last) gsap.fromTo(last, { y: -30, scale: .9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .7, ease: 'back.out(1.8)' }); });

  // To'yona: the lacquer box pops in, then bobs and sparkles to invite a tap.
  const box = $('.lacquer-box');
  if (live(box)) {
   const sparks = document.createElement('span'); sparks.className = 'sk-sparks'; sparks.setAttribute('aria-hidden', 'true');
   for (let i = 0; i < 6; i++) { const s = document.createElement('i'); s.style.cssText = `--a:${i * 60 + rand(-12, 12)}deg;--r:${rand(78, 104)}px;--delay:${(i * .45).toFixed(2)}s`; sparks.append(s); }
   box.append(sparks);
   gsap.fromTo(box, { scale: .4, rotation: -12, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.1, ease: 'back.out(1.7)', scrollTrigger: { trigger: box, start: 'top 85%', once: true }, onComplete: () => box.classList.add('is-idle') });
  }

  // Contacts and footer.
  reveal($('.contacts'), $$('.contacts li'), { x: 40, opacity: 0 }, { stagger: .12 });
  const footer = $('#footer');
  const fWords = $$('#footer > p > span[data-slot]').flatMap(el => split(el, 'chars'));
  gsap.timeline({ scrollTrigger: { trigger: footer, start: 'top 85%', once: true } })
   .fromTo('.footer__portal', { scale: .3, y: 40, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.6)' })
   .fromTo(fWords, { yPercent: 115 }, { yPercent: 0, duration: .8, stagger: .03, ease: 'expo.out' }, .4)
   .fromTo('#footer small', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .7, stagger: .15 }, .8)
   .add(() => $('.footer__portal')?.classList.add('is-lit'));
 }

 function init() {
  if (!window.gsap || !window.ScrollTrigger || reduced()) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('sk-motion');

  // The title is revealed by the first firework (template.js revealNames), not here.
  headings();
  sections();
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
 }

 if (window.Marhamat?.on) window.Marhamat.on('ready', init);
 else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
 else init();
})();
