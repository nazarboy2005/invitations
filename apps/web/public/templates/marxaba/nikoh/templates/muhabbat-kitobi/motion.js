/* Muhabbat Kitobi: inner-page motion (pages laying down, ink writing, stamps, quill).
   The book-opening intro in template.js is untouched. */
(() => {
 'use strict';
 const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
 const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
 const lite = () => window.Marhamat?.tier === 'lite';
 const rand = (a, b) => a + Math.random() * (b - a);
 const write = 'inset(0 100% 0 0)', written = 'inset(0 0% 0 0)';
 const live = el => !!el && !el.closest('[hidden]');
 const guard = fn => function (targets, from, to) { const st = (to || from || {}).scrollTrigger; const t = st && (typeof st.trigger === 'string' ? document.querySelector(st.trigger) : st.trigger); if (st && !live(t)) return null; if (typeof targets === 'string' && !document.querySelector(targets)) return null; return fn.apply(this, arguments); };

 function words(el) {
  if (!el || el.dataset.split) return [];
  el.dataset.split = '1';
  const out = [];
  el.childNodes.forEach(node => {
   if (node.nodeType !== 3) return;
   const frag = document.createDocumentFragment();
   node.textContent.split(/(\s+)/).forEach(part => {
    if (!part) return;
    if (/^\s+$/.test(part)) { frag.append(part); return; }
    const w = document.createElement('span'); w.className = 'mk-word'; w.textContent = part; frag.append(w); out.push(w);
   });
   node.replaceWith(frag);
  });
  return out;
 }

 function flourish(h2) {
  if (!h2 || h2.nextElementSibling?.classList.contains('mk-flourish')) return null;
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 120 14'); svg.setAttribute('class', 'mk-flourish'); svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<path d="M2 8c14-6 26 4 40 0s20-8 18-2-10 4-4-1c8-6 22 6 36 2s18-4 26-2"/>';
  h2.after(svg);
  const path = svg.firstChild, len = path.getTotalLength();
  path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
  return path;
 }

 // The couple's names are written in ink, with a quill nib riding the edge of the reveal.
 function heroArrival() {
  const h1 = $('.hero h1'); if (!h1) return;
  const names = $$(':scope > span[data-slot]', h1), amp = $('em', h1);
  const kicker = $('.hero-kicker'), rest = $$('.hero-event, .hero-date');
  const nib = document.createElement('i'); nib.className = 'mk-nib'; nib.setAttribute('aria-hidden', 'true'); h1.append(nib);
  const kWords = words(kicker);
  gsap.set(names, { clipPath: write }); gsap.set(amp, { opacity: 0, scale: .4, rotation: -30 });
  gsap.set(kWords, { opacity: 0 }); gsap.set(rest, { opacity: 0, y: 10 }); gsap.set(nib, { opacity: 0 });
  let played = false;
  const play = () => {
   if (played) return; played = true; ScrollTrigger.refresh();
   const tl = gsap.timeline({ delay: .25 });
   tl.to(kWords, { opacity: 1, duration: .25, stagger: .12 }, 0);
   names.forEach((span, i) => {
    const at = .45 + i * 1.05;
    const y = span.offsetTop + span.offsetHeight * .72, x0 = span.offsetLeft, x1 = span.offsetLeft + span.offsetWidth;
    tl.set(nib, { x: x0, y, opacity: 1 }, at)
     .to(span, { clipPath: written, duration: .85, ease: 'power1.inOut' }, at)
     .to(nib, { x: x1, duration: .85, ease: 'power1.inOut' }, at)
     .to(nib, { y: `-=${span.offsetHeight * .18}`, duration: .1, repeat: 7, yoyo: true, ease: 'sine.inOut' }, at);
    if (i === 0) tl.to(amp, { opacity: 1, scale: 1, rotation: 0, duration: .6, ease: 'back.out(2)' }, at + .9);
   });
   tl.to(nib, { opacity: 0, x: '+=20', duration: .3 }, '>-0.05')
    .to(rest, { opacity: 1, y: 0, duration: .7, stagger: .15, ease: 'power2.out' }, '<');
  };
  if (document.body.classList.contains('is-open')) play();
  else new MutationObserver((_, obs) => { if (document.body.classList.contains('is-open')) { obs.disconnect(); play(); } }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
 }

 // Every page of the book lays down from the spine as it scrolls into view.
 function pages() {
  $$('.section.page-sheet, .footer.page-sheet').forEach(sheet => {
   gsap.fromTo(sheet, { rotationY: 32, x: 24, opacity: 0, transformPerspective: 1400, transformOrigin: '0% 50%' }, { rotationY: 0, x: 0, opacity: 1, duration: 1.15, ease: 'expo.out', scrollTrigger: { trigger: sheet, start: 'top 88%', once: true }, clearProps: 'transform' });
  });
  // Story chapters turn in like real pages, with a shadow sweeping across.
  $$('.chapter').forEach((ch, i) => {
   const shade = document.createElement('span'); shade.className = 'mk-shade'; shade.setAttribute('aria-hidden', 'true'); ch.append(shade);
   gsap.timeline({ scrollTrigger: { trigger: ch, start: 'top 85%', once: true } })
    .fromTo(ch, { rotationY: -96, opacity: 0, transformPerspective: 1300, transformOrigin: '0% 50%' }, { rotationY: 0, opacity: 1, duration: 1.3, ease: 'power3.out', clearProps: 'transform' })
    .fromTo(shade, { opacity: .55 }, { opacity: 0, duration: 1.1, ease: 'power2.out' }, 0)
    .fromTo($$('.chapter-no, h3, p', ch), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .6, stagger: .12 }, .55);
  });
 }

 function headings() {
  $$('.section').forEach(section => {
   if (!live(section)) return;
   const eyebrow = $(':scope > .eyebrow', section), h2 = $(':scope > h2', section);
   if (!h2) return;
   const swash = flourish(h2);
   const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 80%', once: true } });
   if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, letterSpacing: '.5em' }, { opacity: 1, letterSpacing: '.22em', duration: .9, ease: 'power3.out' }, .15);
   tl.fromTo(h2, { clipPath: write }, { clipPath: written, duration: 1, ease: 'power2.inOut' }, .3);
   if (swash) tl.to(swash, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, .9);
  });
 }

 function details() {
  // Letter: the message soaks in word by word, the signature is written.
  const letter = $('#invitation-text');
  const msg = words($('.message', letter));
  gsap.timeline({ scrollTrigger: { trigger: letter, start: 'top 70%', once: true } })
   .fromTo($('.letter-greeting', letter), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .7 }, .5)
   .fromTo(msg, { opacity: 0, color: '#b9a682' }, { opacity: 1, color: 'inherit', duration: .5, stagger: .045, ease: 'power1.out' }, .8)
   .fromTo($('.signoff', letter), { clipPath: write }, { clipPath: written, duration: 1.1, ease: 'power1.inOut' }, '>-0.1');

  // Calendar days are stamped onto the page.
  const days = $$('.calendar-day:not(.is-empty)');
  if (days.length) gsap.fromTo(days, { scale: 1.6, opacity: 0, rotation: () => rand(-14, 14) }, { scale: 1, opacity: 1, rotation: 0, duration: .45, ease: 'back.out(2.2)', stagger: .025, scrollTrigger: { trigger: '.calendar', start: 'top 78%', once: true } });
  gsap.fromTo('.countdown > div', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.countdown', start: 'top 85%', once: true } });
  $$('.countdown [data-unit]').forEach(el => {
   let prev = el.textContent;
   new MutationObserver(() => { if (el.textContent === prev) return; prev = el.textContent; gsap.fromTo(el, { opacity: .15, scale: 1.18, filter: 'blur(1.2px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .5, ease: 'power2.out' }); }).observe(el, { childList: true, characterData: true, subtree: true });
  });

  // Rubber stamps thump onto the paper.
  $$('.stamp').forEach(btn => {
   gsap.fromTo(btn, { scale: 1.9, rotation: -9, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .5, ease: 'back.out(1.8)', scrollTrigger: { trigger: btn, start: 'top 90%', once: true }, onComplete: () => btn.classList.add('is-stamped') });
  });

  // Program: each line is written in, left to right.
  $$('.program__item').forEach((item, i) => gsap.fromTo(item, { clipPath: write }, { clipPath: written, duration: .9, ease: 'power1.inOut', delay: i * .05, scrollTrigger: { trigger: item, start: 'top 88%', once: true } }));

  // Venue postcard drops onto the page and settles.
  const card = $('.postcard');
  if (card) gsap.fromTo(card, { y: -70, rotation: -16, scale: 1.12, opacity: 0 }, { y: 0, rotation: -1, scale: 1, opacity: 1, duration: 1.1, ease: 'back.out(1.5)', scrollTrigger: { trigger: card, start: 'top 82%', once: true } });
  gsap.fromTo('.venue-address', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .7, scrollTrigger: { trigger: '.venue-address', start: 'top 90%', once: true } });

  // Gallery plate is tipped in.
  gsap.fromTo('.gallery__frame', { rotation: 4, scale: .9, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.gallery__frame', start: 'top 82%', once: true } });

  // RSVP reply card slides up out of its pocket; choices are written in.
  gsap.fromTo('#rsvp form', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#rsvp form', start: 'top 88%', once: true } });
  gsap.fromTo('.rsvp__choices button', { clipPath: write }, { clipPath: written, duration: .7, stagger: .18, ease: 'power1.inOut', scrollTrigger: { trigger: '.rsvp__choices', start: 'top 85%', once: true } });

  // Guest book: each wish is written in; new wishes too.
  $$('.wishes__item').forEach(item => gsap.fromTo(item, { clipPath: write }, { clipPath: written, duration: 1.1, ease: 'power1.inOut', scrollTrigger: { trigger: item, start: 'top 90%', once: true } }));
  window.Marhamat?.on?.('wish', () => { const last = $('.wishes__item:last-child'); if (last) gsap.fromTo(last, { clipPath: write }, { clipPath: written, duration: 1.2, ease: 'power1.inOut' }); });

  // To'yona envelope pops in and then nudges to invite a tap.
  const env = $('.gift');
  if (env) gsap.fromTo(env, { scale: .6, rotation: -8, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .9, ease: 'back.out(1.8)', scrollTrigger: { trigger: env, start: 'top 85%', once: true }, onComplete: () => env.classList.add('is-idle') });

  // Contacts: ruled lines draw, then text follows.
  $$('.contacts li').forEach((li, i) => gsap.fromTo(li, { clipPath: write, x: 10 }, { clipPath: written, x: 0, duration: .9, delay: i * .15, ease: 'power2.out', scrollTrigger: { trigger: li, start: 'top 90%', once: true } }));

  // Footer: closing words are written.
  gsap.fromTo('.footer > p', { clipPath: write }, { clipPath: written, duration: 1.4, stagger: .3, ease: 'power1.inOut', scrollTrigger: { trigger: '.footer', start: 'top 75%', once: true } });

  // RSVP "Kelaman": a few ink hearts float up.
  window.Marhamat?.on?.('rsvp', answer => {
   if (answer?.status !== 'yes') return;
   const host = $('.rsvp__done'); if (!host) return;
   for (let i = 0; i < 7; i++) {
    const h = document.createElement('i'); h.className = 'mk-heart'; h.textContent = '♥'; h.setAttribute('aria-hidden', 'true'); host.append(h);
    gsap.fromTo(h, { x: rand(-90, 90), y: 30, opacity: 0, scale: rand(.6, 1.1) }, { y: rand(-110, -60), x: `+=${rand(-30, 30)}`, opacity: 1, duration: 1.4, ease: 'power2.out', delay: i * .06, onComplete: () => gsap.to(h, { opacity: 0, duration: .4, onComplete: () => h.remove() }) });
   }
  });
 }

 // Dust motes drifting through the window light, over the whole book.
 function motes() {
  if (lite() || $('.mk-motes')) return;
  const box = document.createElement('div'); box.className = 'mk-motes'; box.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 14; i++) { const m = document.createElement('i'); m.style.cssText = `--x:${rand(0, 100)}%;--y:${rand(0, 100)}%;--s:${rand(1.5, 3.5)}px;--d:${rand(14, 26)}s;--delay:${rand(-26, 0)}s;--dx:${rand(-60, 60)}px;--dy:${rand(-120, -40)}px`; box.append(m); }
  document.body.append(box);
 }

 function init() {
  if (!window.gsap || !window.ScrollTrigger || reduced()) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo = guard(gsap.fromTo.bind(gsap)); gsap.to = guard(gsap.to.bind(gsap));
  document.documentElement.classList.add('mk-motion');
  heroArrival(); pages(); headings(); details(); motes();
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
 }

 if (window.Marhamat?.on) window.Marhamat.on('ready', () => setTimeout(init, 0));
 else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
 else init();
})();
