/* Maslin — the envelope opens in place and becomes the first screen.
   Closed: the olive envelope fills the phone, lace flap and ivory seal, "a love letter from" and the names.
   On tap: the seal lifts, the flap swings open, the camera pulls back to the whole flat-lay, the card rises out,
   the cameo and the bouquet slide in, the burgundy heart seal with the date is pressed on, and the page unlocks.
   The finished scene is the hero, so there is no cut between the opening and the invitation. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const stage = $('.ms-stage'); if (!stage) return;
  const scene = $('.ms-scene', stage), world = $('.ms-world', stage), flap = $('.ms-flap', stage), seal = $('.ms-seal', stage);
  const card = $('.ms-card', stage), cameo = $('.ms-cameo', stage), bouquet = $('.ms-bouquet', stage), heart = $('.ms-heart', stage);
  const cover = $('.ms-cover', stage), button = $('#open-invitation');
  const params = new URLSearchParams(location.search);
  const WORDS = {
    uz: { from: 'MEHR BILAN YOZILGAN MAKTUB', save: 'SANANI ESLAB QOLING', open: 'Taklifnomani ochish', more: 'Marhamat', meet: 'BIZ BILAN QUVONCHINGIZNI BAHAM KO‘RING', rsvp: 'Tashrifni tasdiqlash' },
    ru: { from: 'ПИСЬМО С ЛЮБОВЬЮ', save: 'СОХРАНИТЕ ДАТУ', open: 'Открыть приглашение', more: 'Листайте', meet: 'ЖДЁМ ВАС', rsvp: 'Подтвердить присутствие' },
    en: { from: 'A LOVE LETTER FROM', save: 'SAVE THE DATE', open: 'Open the invitation', more: 'Discover', meet: 'MEET US IN', rsvp: 'Kindly confirm' }
  };
  let u = 1, opened = false, tl = null;

  /* layout: one design unit = scene width / 390, the 390 × 844 canvas always fits the screen */
  function fit() {
    const w = stage.clientWidth, h = stage.clientHeight;
    u = Math.min(w / 390, h / 844);
    stage.style.setProperty('--u', `${u}px`);
    if (!opened) closedPose();
  }
  const px = n => n * u;
  function closedPose() {
    if (!window.gsap) return;
    gsap.set(world, { transformOrigin: `${px(195)}px ${px(602)}px`, y: px(-42), scale: 4.6 });
    gsap.set(seal, { scale: .34 });  // the seal keeps a natural size while the camera is close
  }

  function fill() {
    const M = window.Marhamat, d = M?.data || {}, code = M?.langCode || M?.lang || 'uz';
    const toCyrl = value => value.replace(/o['’‘ʻʼ`]/gi, c => c === c.toUpperCase() ? 'Ў' : 'ў').replace(/g['’‘ʻʼ`]/gi, c => c === c.toUpperCase() ? 'Ғ' : 'ғ').replace(/sh/gi, c => c === c.toUpperCase() ? 'Ш' : 'ш').replace(/ch/gi, c => c === c.toUpperCase() ? 'Ч' : 'ч').replace(/yo/gi, c => c === c.toUpperCase() ? 'Ё' : 'ё').replace(/yu/gi, c => c === c.toUpperCase() ? 'Ю' : 'ю').replace(/ya/gi, c => c === c.toUpperCase() ? 'Я' : 'я').replace(/[a-z]/gi, c => { const m = {a:'а',b:'б',c:'с',d:'д',e:'е',f:'ф',g:'г',h:'ҳ',i:'и',j:'ж',k:'к',l:'л',m:'м',n:'н',o:'о',p:'п',q:'қ',r:'р',s:'с',t:'т',u:'у',v:'в',w:'в',x:'х',y:'й',z:'з'}; const x=m[c.toLowerCase()]||c; return c===c.toUpperCase()?x.toUpperCase():x; });
    const conv = code === 'uz-Cyrl' || code === 'kr' ? toCyrl : s => s;
    const w = WORDS[code] || WORDS[M?.lang] || WORDS.uz;
    const one = d.groom || d.extras?.celebrant || d.bride || '', two = d.groom ? (d.bride || '') : '';
    const set = (key, value) => $$(`[data-ms="${key}"]`).forEach(el => { el.textContent = value; });
    Object.keys(WORDS.uz).forEach(k => set(k, conv(w[k] || WORDS.uz[k])));
    set('one', one); set('two', two);
    $$('.ms-card__names i, .ms-cover__names i').forEach(el => { el.hidden = !two; });
    const dt = d.date || {};
    set('date', dt.day ? `${String(dt.day).padStart(2, '0')}.${String(dt.monthNumber).padStart(2, '0')}.${dt.year}` : '');
    heart.hidden = !dt.day;
    const long = Array.from(one + two).length > 16;
    stage.classList.toggle('ms-long', long);
    // the cameo shows the couple's first photo, or the venue
    const firstGalleryPhoto = Array.isArray(d.gallery) ? (typeof d.gallery[0] === 'string' ? d.gallery[0] : d.gallery[0]?.src) : '';
    const photo = firstGalleryPhoto || d.venue?.photo;
    const img = $('[data-ms-photo]', stage);
    if (photo && img) img.src = photo; else if (img) cameo.hidden = true;
  }

  /* ---- the opening ---- */
  function hiddenPieces() {
    gsap.set(card, { y: px(300) });
    gsap.set(cameo, { x: px(-150), rotation: -16, opacity: 0 });
    gsap.set(bouquet, { x: px(190), y: px(-20), rotation: 7, opacity: 0 });
    gsap.set(heart, { scale: 1.8, opacity: 0, rotation: -10 });
    gsap.set('.ms-card__inner > *', { opacity: 0, y: px(8) });
    gsap.set(flap, { rotationX: 0, zIndex: 6, transformPerspective: px(1500) });
  }
  function finish() {
    if (document.body.classList.contains('is-open')) return;
    document.documentElement.classList.remove('is-locked');
    document.body.classList.add('is-open');
    stage.classList.add('is-open');
    ambient();
  }
  function endState() {
    tl?.kill(); tl = null; opened = true;
    if (window.gsap) {
      gsap.set(world, { y: px(-50), scale: 1 }); gsap.set(flap, { rotationX: 180, zIndex: 1 });
      gsap.set([card, cameo, bouquet, heart], { clearProps: 'transform,opacity' });
      gsap.set('.ms-card__inner > *', { clearProps: 'all' }); gsap.set([cover, button], { autoAlpha: 0 });
      gsap.set(seal, { clearProps: 'transform' });
    }
    stage.classList.add('is-opened');
    finish();
  }
  function open() {
    if (opened) return; opened = true;
    window.Marhamat?.open?.();
    const reduced = window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!window.gsap || reduced || params.get('preview') === '1') { endState(); return; }
    stage.classList.add('is-opening');
    const light = document.createElement('i'); light.className = 'ms-light'; scene.append(light);
    tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => { stage.classList.add('is-opened'); finish(); } });
    tl.to([cover, button], { autoAlpha: 0, y: px(-10), filter: 'blur(3px)', duration: .5, ease: 'power2.in' }, 0)
      // the seal lifts a little as the wax lets go
      .to(seal, { scale: .38, y: px(-1), duration: .22, ease: 'power2.out' }, .12)
      .to(seal, { scale: .34, y: 0, duration: .3, ease: 'power2.inOut' }, .34)
      .to(seal, { scale: 1, duration: 1.7, ease: 'power3.inOut' }, .55)
      // the flap swings open towards us and over the top; once it is past upright it lies behind the card
      .to(flap, { rotationX: 180, duration: 1.25, ease: 'power2.inOut' }, .3)
      .set(flap, { zIndex: 1 }, .92)
      // the camera pulls back to the whole flat-lay
      .to(world, { y: px(-50), scale: 1, duration: 1.7, ease: 'power3.inOut' }, .55)
      // the card rises out of the envelope
      .to(card, { y: 0, duration: 1.2, ease: 'power3.out' }, 1.5)
      .to('.ms-card__inner > *', { opacity: 1, y: 0, duration: .7, stagger: .12, ease: 'power2.out' }, 2.05)
      // the cameo and the bouquet come in from the sides
      .to(cameo, { x: 0, rotation: -5, opacity: 1, duration: 1, ease: 'power3.out' }, 2.15)
      .to(bouquet, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.15, ease: 'power3.out' }, 2.3)
      // the heart seal with the date is pressed on, the card gives a little
      .to(heart, { scale: 1, opacity: 1, rotation: -6, duration: .45, ease: 'back.out(2.4)' }, 2.95)
      .fromTo(card, { rotation: 0 }, { rotation: -.6, duration: .12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 3.15)
      // a soft band of light passes over the paper
      .fromTo(light, { opacity: 0, xPercent: -60 }, { opacity: 1, xPercent: 60, duration: 1.4, ease: 'power2.inOut' }, 3.1)
      .to(light, { opacity: 0, duration: .4 }, 4.2)
      .add(finish, 3.6);
  }
  function ambient() {
    if (!window.gsap || window.Marhamat?.reducedMotion) return;
    gsap.to(bouquet, { rotation: 1.4, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to(cameo, { y: px(-3), duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  function start() {
    fit(); fill();
    if (window.gsap) { closedPose(); hiddenPieces(); }
    if (document.body.classList.contains('is-open')) endState();
    // an optional painted cameo frame replaces the CSS one when it exists
    const frame = new Image(); frame.onload = () => { const f = $('.ms-cameo__frame', stage); f.style.setProperty('--frame', 'url(art/cameo-frame.webp)'); f.classList.add('is-art'); }; frame.src = 'art/cameo-frame.webp';
  }
  button?.addEventListener('click', e => { e.stopPropagation(); open(); });
  stage.addEventListener('click', e => { if (!opened && !e.target.closest('a,button')) open(); else if (tl && tl.isActive() && !e.target.closest('a')) tl.progress(1); });
  addEventListener('resize', () => { const was = u; fit(); if (opened && was !== u) gsap?.set(world, { transformOrigin: `${px(195)}px ${px(602)}px` }); }, { passive: true });
  if (window.Marhamat?.on) window.Marhamat.on('ready', start); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
