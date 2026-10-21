(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const intro = $('.intro');
  const canvas = $('.sky-canvas');
  const context = canvas && canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(location.search);
  let opened = false, introVisible = true, frame = 0, width = 0, height = 0, dpr = 1;
  let particles = [], bubbles = [], breeze = 0;
  const rand = (min, max) => min + Math.random() * (max - min);
  const fullTier = () => window.Marhamat ? window.Marhamat.tier === 'full' : params.get('tier') !== 'lite';

  function resizeCanvas() {
    if (!canvas || !context) return;
    const bounds = canvas.getBoundingClientRect(); width = bounds.width; height = bounds.height;
    dpr = Math.min(window.devicePixelRatio || 1, fullTier() ? 2 : 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = reduced ? 0 : (fullTier() ? 42 : 12);
    particles = Array.from({ length: count }, () => ({ x: rand(0, width), y: rand(0, height), r: rand(0.7, 2.2), phase: rand(0, 6.28), speed: rand(.35, 1.2) }));
  }
  function draw() {
    frame = 0;
    if (!context || !introVisible || document.hidden) return;
    context.clearRect(0, 0, width, height);
    const now = performance.now() / 1000;
    for (const p of particles) {
      const alpha = .28 + (Math.sin(now * p.speed + p.phase) + 1) * .27;
      context.globalAlpha = alpha;
      context.fillStyle = '#fff1c5'; context.beginPath(); context.arc(p.x, p.y, p.r, 0, Math.PI * 2); context.fill();
    }
    context.globalAlpha = 1;
    const live = [];
    for (const b of bubbles) {
      b.y -= b.speed; b.x += Math.sin(now * 2 + b.phase) * .25; b.life -= .012;
      if (b.life <= 0) continue;
      context.globalAlpha = Math.min(1, b.life * 2) * .6;
      context.strokeStyle = b.gold ? '#ffe3a1' : '#fff8f2'; context.lineWidth = 1.3;
      context.beginPath(); context.arc(b.x, b.y, b.r * (1.1 - b.life * .1), 0, Math.PI * 2); context.stroke();
      if (b.star && b.life < .32) { context.fillStyle = '#ffe7ae'; context.font = '12px sans-serif'; context.fillText('✦', b.x - 5, b.y + 4); }
      live.push(b);
    }
    bubbles = live;
    if (opened && now < breeze) { /* one quiet breath after the transition */ }
    frame = requestAnimationFrame(draw);
  }
  function ensureFrame() { if (!frame && introVisible && !document.hidden) frame = requestAnimationFrame(draw); }
  function burst(count = 16) {
    if (reduced) return;
    const n = fullTier() ? count : Math.min(6, count);
    for (let i = 0; i < n; i++) bubbles.push({ x: rand(width * .22, width * .78), y: height * rand(.46, .8), r: rand(3, 9), speed: rand(.5, 1.5), phase: rand(0, 6.28), life: rand(.5, 1), gold: Math.random() > .55, star: i % 4 === 0 });
    breeze = performance.now() / 1000 + 2; ensureFrame();
  }
  if (canvas && context) {
    resizeCanvas(); ensureFrame();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else ensureFrame(); });
    new IntersectionObserver(entries => { introVisible = entries[0].isIntersecting; if (!introVisible) { cancelAnimationFrame(frame); frame = 0; } else ensureFrame(); }).observe(intro);
  }

  let arrivalTimeline;
  const liteAtStart = !fullTier();
  if (window.gsap && !reduced && !liteAtStart) {
    const gsap = window.gsap;
    arrivalTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    arrivalTimeline.to('.intro-star--one', { opacity: .95, scale: 1.2, duration: .3 }, .12)
      .to('.intro-star--two', { opacity: .9, scale: 1.1, duration: .28 }, .46)
      .to('.intro-star--three', { opacity: .85, scale: 1.2, duration: .25 }, .72)
      .to('.intro__moon', { opacity: 1, scale: 1, duration: .55, ease: 'back.out(1.15)' }, .37)
      .to('.intro__cradle', { opacity: 1, y: 0, duration: .72, ease: 'power3.out' }, .43)
      .to('.intro__caption', { opacity: .86, y: 0, duration: .35 }, .9)
      .to('.open-button', { opacity: 1, y: 0, duration: .48, ease: 'back.out(1.1)' }, 1.42);
    if (fullTier()) gsap.to('.intro__cradle', { rotation: 1.3, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 82%' });
    if (fullTier()) gsap.to('.intro__cradle', { y: -5, duration: 2.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  } else {
    $$('.intro-star,.intro__moon,.intro__cradle,.intro__caption,.open-button').forEach(el => { el.style.opacity = '1'; });
  }
  if (reduced || params.get('tier') === 'lite') $('.open-button')?.classList.add('is-steady');

  function letterReveal(name) {
    const host = $('.act-three [data-slot="groom"]');
    if (!host) return;
    const value = name || host.textContent.trim();
    host.textContent = '';
    for (const letter of value) {
      const span = document.createElement('span'); span.className = 'letter'; span.textContent = letter === ' ' ? '\u00a0' : letter; host.append(span);
    }
  }
  function openFilm() {
    if (opened) { if (window.gsap && window.gsap.globalTimeline) window.gsap.globalTimeline.timeScale(2.4); return; }
    opened = true;
    if (window.Marhamat) window.Marhamat.open();
    intro.classList.add('is-morning');
    const text = $('.hero__name')?.textContent.trim() || '';
    letterReveal(text);
    if (reduced || !window.gsap) {
      $('.mobile-drop').style.opacity = '1'; $('.mobile-drop').style.transform = 'translate(-50%,0)'; $('.act-three').style.opacity = '1';
      setTimeout(() => { intro.classList.add('is-opening', 'is-done'); document.body.classList.add('is-open'); }, 700);
      return;
    }
    const gsap = window.gsap;
    const quick = liteAtStart ? .48 : 1;
    const at = value => value * quick;
    const tl = gsap.timeline({ onComplete: () => { intro.classList.add('is-opening', 'is-done'); document.body.classList.add('is-open'); introVisible = false; cancelAnimationFrame(frame); frame = 0; } });
    if (arrivalTimeline) arrivalTimeline.pause();
    tl.to('.open-button', { scale: .92, opacity: 0, duration: at(.22) }, 0)
      .to('.mobile-drop', { y: 0, opacity: 1, duration: at(liteAtStart ? .48 : 1.1), ease: 'power3.out' }, at(.05))
      .to('.mobile-drop', { rotation: 7, duration: at(liteAtStart ? .38 : 1.18), yoyo: true, repeat: 1, ease: 'sine.inOut' }, at(.64))
      .to('.intro__moon', { x: -10, y: -10, opacity: .28, duration: at(1.5) }, at(.35))
      .to('.intro__scene', { y: 28, scale: 1.08, opacity: .45, duration: at(1.45), ease: 'power2.inOut' }, at(.44))
      .to('.act-three', { opacity: 1, duration: at(.25) }, at(liteAtStart ? .52 : 1.36))
      .from('.act-three .letter', { y: 20, scale: .65, opacity: 0, stagger: at(liteAtStart ? .012 : .045), duration: at(liteAtStart ? .24 : .46), ease: 'back.out(1.5)' }, at(liteAtStart ? .56 : 1.4))
      .from('.act-three small', { y: 8, opacity: 0, stagger: at(liteAtStart ? .04 : .14), duration: at(liteAtStart ? .2 : .35) }, at(liteAtStart ? .74 : 1.76))
      .to('.intro', { opacity: 0, duration: at(.45), ease: 'power1.in' }, at(liteAtStart ? 1.02 : 2.25));
    burst(fullTier() ? 24 : 8);
  }
  $('#open-invitation')?.addEventListener('click', openFilm);
  intro?.addEventListener('click', event => { if (opened && !event.target.closest('button')) { if (window.gsap && window.gsap.globalTimeline) window.gsap.globalTimeline.timeScale(2.4); } });

  const celebration = () => burst(14);
  function celebrateRSVP() {
    if (reduced) return;
    const section = $('.section--rsvp'); if (!section) return;
    const count = fullTier() ? 14 : 6;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = i % 3 === 0 ? 'party-bubble party-star' : 'party-bubble';
      if (particle.classList.contains('party-star')) particle.textContent = '✦';
      particle.style.setProperty('--x', `${12 + Math.random() * 76}%`);
      particle.style.setProperty('--delay', `${Math.random() * 180}ms`);
      section.append(particle); setTimeout(() => particle.remove(), 1550);
    }
  }
  if (window.Marhamat) {
    window.Marhamat.on('ready', ({ data }) => {
      letterReveal(data.groom);
      $$('.hero__name,.footer__name').forEach(el => { if (!el.textContent.trim()) el.textContent = data.groom || ''; });
      if (window.gsap && window.ScrollTrigger) {
        const gsap = window.gsap, ST = window.ScrollTrigger;
        gsap.registerPlugin(ST);
        const tierFull = window.Marhamat.tier === 'full' && !window.Marhamat.reducedMotion;
        const revealMap = [
          ['.section--letter', { x: -22, rotation: -1.2 }], ['.section--date', { y: 28, scale: .98 }],
          ['.section--program', { x: 25, rotation: 1 }], ['.section--venue', { y: 25, rotation: -.6 }],
          ['.section--dresscode', { scale: .97, y: 22 }], ['.section--gallery', { y: 30, rotation: 1 }],
          ['.section--rsvp', { y: 25, scale: .98 }], ['.section--wishes', { x: -18 }],
          ['.section--toyona', { y: 24, rotation: 1 }], ['.section--contacts', { x: 18 }], ['.footer', { y: 25 }]
        ];
        if (tierFull) revealMap.forEach(([selector, from]) => { const el = $(selector); if (el) gsap.from(el, { ...from, opacity: 0, duration: .8, ease: 'power2.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); });
        if (tierFull) {
          gsap.to('.hero__cradle', { y: 64, rotation: 3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .75 } });
          const path = $('.program-path path'); if (path) { const length = path.getTotalLength(); gsap.set(path, { strokeDasharray: length, strokeDashoffset: length }); gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.section--program', start: 'top 75%', end: 'bottom 45%', scrub: .6 } }); }
          gsap.to('.gallery-string', { rotation: -7, scaleX: 1.07, ease: 'none', scrollTrigger: { trigger: '.section--gallery', start: 'top bottom', end: 'bottom top', scrub: .8 } });
        }
      }
    });
    window.Marhamat.on('rsvp', answer => { if (answer.status === 'yes') celebrateRSVP(); });
    window.Marhamat.on('tier', () => resizeCanvas());
  }
  // Section-title hanging ornaments respond to scroll velocity with a damped spring.
  if (!reduced) {
    const hangers = $$('.section__title').map(el => ({ el, angle: 0, velocity: 0, target: 0 }));
    let previousY = window.scrollY, lastTime = performance.now(), springFrame = 0;
    const step = now => {
      springFrame = 0;
      const dt = Math.min((now - lastTime) / 1000, .04); lastTime = now;
      for (const hanger of hangers) {
        const force = (hanger.target - hanger.angle) * 34;
        hanger.velocity += force * dt; hanger.velocity *= Math.exp(-7.4 * dt); hanger.angle += hanger.velocity * dt;
        hanger.el.style.transform = `rotate(${hanger.angle.toFixed(2)}deg)`;
      }
      if (hangers.some(h => Math.abs(h.target - h.angle) > .02 || Math.abs(h.velocity) > .05)) springFrame = requestAnimationFrame(step);
      else hangers.forEach(h => { h.el.style.transform = ''; h.angle = h.velocity = h.target = 0; });
    };
    window.addEventListener('scroll', () => {
      const now = performance.now(), y = window.scrollY, speed = (y - previousY) / Math.max((now - lastTime) / 1000, .016);
      previousY = y; lastTime = now;
      const movement = Math.max(-1, Math.min(1, speed / 1300));
      hangers.forEach(h => { h.target = 0; h.velocity += -movement * 8.5; });
      if (!springFrame) springFrame = requestAnimationFrame(step);
    }, { passive: true });
  }


})();
