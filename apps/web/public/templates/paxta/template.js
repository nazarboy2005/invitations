(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const api = window.Marhamat;
  const intro = $('#intro');
  const page = $('#page');
  let opening = false;
  let opened = false;
  let raf = 0;
  let running = true;
  const reduced = !!(api && api.reducedMotion) || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite = !!(api && api.tier === 'lite');

  function setupGalleryParallax() {
    if (!window.gsap || reduced) return;
    const item = $('.gallery__item:first-child');
    if (!item || item.dataset.paxtaParallax === 'true') return;
    item.dataset.paxtaParallax = 'true';
    gsap.to(item, { y: -18, ease: 'none', scrollTrigger: { trigger: '.gallery-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  }

  function watchGalleryParallax() {
    const gallery = $('.gallery[data-list="gallery"]');
    if (!gallery || !window.gsap || reduced || !('MutationObserver' in window)) return;
    new MutationObserver(setupGalleryParallax).observe(gallery, { childList: true });
    setupGalleryParallax();
  }

  function makeParticle(w, h, burst = false) {
    return {
      x: burst ? w * (.42 + Math.random() * .16) : Math.random() * w,
      y: burst ? h * (.43 + Math.random() * .12) : Math.random() * h,
      vx: (Math.random() - .5) * (burst ? 1.1 : .12),
      vy: burst ? -(.7 + Math.random() * 1.8) : -(.04 + Math.random() * .11),
      size: burst ? 2 + Math.random() * 8 : 1 + Math.random() * 2.2,
      phase: Math.random() * 6.28,
      alpha: burst ? .1 + Math.random() * .42 : .12 + Math.random() * .24,
      life: burst ? 100 + Math.random() * 80 : 0
    };
  }
  function setupAtmosphere() {
    if (reduced) return;
    const dust = $('.intro__dust');
    const ctx = dust?.getContext('2d', { alpha: true });
    if (!ctx) return;
    const ambient = document.createElement('canvas');
    ambient.className = 'ambient-fibres';
    ambient.setAttribute('aria-hidden', 'true');
    document.body.append(ambient);
    const ambientCtx = ambient.getContext('2d', { alpha: true });
    const count = lite ? 11 : 26;
    const particles = Array.from({ length: count }, () => makeParticle(innerWidth, innerHeight));
    let burst = [];
    let last = 0;
    let dpr = 1;
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, lite ? 1.5 : 2);
      [dust, ambient].forEach(canvas => {
        canvas.width = Math.round(innerWidth * dpr);
        canvas.height = Math.round(innerHeight * dpr);
        canvas.style.width = `${innerWidth}px`;
        canvas.style.height = `${innerHeight}px`;
      });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ambientCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const visibleSurfaces = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visibleSurfaces.add(entry.target) : visibleSurfaces.delete(entry.target));
      running = visibleSurfaces.size > 0;
    });
    observer.observe(intro);
    observer.observe(page);
    addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => { running = !document.hidden && (!opened || !intro.classList.contains('is-done')); });
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!running || document.hidden || now - last < 16) return;
      last = now;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.fillStyle = '#f6f3ed';
      for (const p of particles) {
        p.phase += .014;
        p.x += p.vx + Math.sin(p.phase) * .035;
        p.y += p.vy;
        if (p.y < -8) { p.y = innerHeight + 8; p.x = Math.random() * innerWidth; }
        if (p.x < -8) p.x = innerWidth + 8;
        if (p.x > innerWidth + 8) p.x = -8;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * .62, p.size * 1.6, Math.sin(p.phase) * .24, 0, Math.PI * 2);
        ctx.fill();
      }
      burst = burst.filter(p => p.life > 0);
      for (const p of burst) {
        p.life -= .6;
        p.phase += .012;
        p.x += p.vx + Math.sin(p.phase) * .15;
        p.y += p.vy;
        ctx.globalAlpha = Math.max(0, p.alpha * Math.min(1, p.life / 34));
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * .42, p.size * 1.3, Math.sin(p.phase), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ambientCtx.clearRect(0, 0, innerWidth, innerHeight);
      ambientCtx.drawImage(dust, 0, 0, innerWidth, innerHeight);
    }
    function resizeNow() { resize(); }
    resizeNow();
    raf = requestAnimationFrame(frame);
    // Burst is intentionally exposed through the closure below.
    function release() { burst = Array.from({ length: lite ? 16 : 38 }, () => makeParticle(innerWidth, innerHeight, true)); running = true; }
    return release;
  }
  let releaseFibres = null;

  function reveal() {
    if (opened) return;
    opened = true;
    document.body.classList.add('is-open');
    intro?.classList.add('is-done');
    setTimeout(() => { if (intro) intro.hidden = true; }, 850);
    if (window.gsap && !reduced) gsap.fromTo('.hero__art', { y: 24, scale: .95, opacity: .6 }, { y: 0, scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' });
  }
  function beginOpening() {
    if (opening) { reveal(); return; }
    opening = true;
    api?.open();
    document.body.classList.add('is-opening');
    intro?.classList.add('is-opening');
    releaseFibres?.();
    const wait = reduced || lite ? 900 : 2050;
    setTimeout(reveal, wait);
  }

  function setupIntro() {
    if (!intro) return;
    const open = $('#open-invitation');
    setTimeout(() => intro.classList.add('is-arrived'), reduced ? 0 : 1800);
    open?.addEventListener('click', event => { event.stopPropagation(); beginOpening(); });
    intro.addEventListener('click', event => { if (opening && event.target !== open) reveal(); });
    // The invitation can still be opened after a script or media issue.
    api?.on('open', () => { if (!opening) { opening = true; setTimeout(reveal, lite ? 450 : 950); } });
  }

  function setupScroll() {
    const path = $('.hero__drawn-stem path');
    if (path?.getTotalLength) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    }
    if (window.gsap && window.ScrollTrigger && !reduced) {
      gsap.registerPlugin(ScrollTrigger);
      const stem = $('.hero__drawn-stem path');
      if (stem) gsap.to(stem, { strokeDashoffset: 0, duration: .9, ease: 'power2.out', scrollTrigger: { trigger: '.hero__names', start: 'top 83%', once: true } });
      gsap.to('.hero__art img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.program', { '--line-progress': 1, ease: 'none', scrollTrigger: { trigger: '.program-section', start: 'top 80%', end: 'bottom 55%', scrub: 1 } });
      setupGalleryParallax();
      gsap.to('.date-section__headline strong', { y: -10, ease: 'none', scrollTrigger: { trigger: '.date-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      $$('.section').forEach(section => ScrollTrigger.create({ trigger: section, start: 'top 82%', once: true, onEnter: () => section.classList.add('is-section-in') }));
      $$('.program__item').forEach((item, index) => ScrollTrigger.create({ trigger: item, start: 'top 88%', once: true, onEnter: () => { item.classList.add('is-in'); item.style.transitionDelay = `${index * 70}ms`; } }));
      ScrollTrigger.refresh();
    } else if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-section-in', 'is-in');
        if (entry.target.id === 'dresscode') entry.target.classList.add('dc-in');
        observer.unobserve(entry.target);
      }), { threshold: .12 });
      $$('.section,.program__item').forEach(el => observer.observe(el));
    } else $$('.program__item,.dresscode__palette li').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    const thread = $('.thread');
    if (thread && 'IntersectionObserver' in window) new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) thread.classList.add('is-drawn');
    }), { threshold: .55 }).observe(thread);
    api?.on('section', ({ name, element }) => {
      if (name === 'dresscode') element.classList.add('dc-in');
      element.classList.add('is-section-in');
    });
  }

  function setupInteractions() {
    api?.on('rsvp', answer => {
      if (answer?.status !== 'yes' || reduced || lite) return;
      const card = $('.rsvp__done');
      if (!card) return;
      card.animate([{ transform: 'scale(.985)', opacity: .75 }, { transform: 'scale(1)', opacity: 1 }], { duration: 540, easing: 'cubic-bezier(.2,.8,.2,1)' });
      for (let i = 0; i < 15; i++) {
        const fibre = document.createElement('i');
        fibre.className = 'rsvp-fibre';
        fibre.style.setProperty('--dx', `${(Math.random() - .5) * 150}px`);
        fibre.style.setProperty('--dy', `${-24 - Math.random() * 100}px`);
        fibre.style.setProperty('--turn', `${(Math.random() - .5) * 150}deg`);
        card.append(fibre);
        fibre.addEventListener('animationend', () => fibre.remove(), { once: true });
      }
    });
    $$('[data-rsvp-choice],.button,.gift summary,.music-toggle').forEach(el => el.addEventListener('pointerdown', () => el.classList.add('is-pressed')));
    $$('[data-rsvp-choice],.button,.gift summary,.music-toggle').forEach(el => ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => el.addEventListener(type, () => el.classList.remove('is-pressed'))));
  }

  function init() {
    releaseFibres = setupAtmosphere();
    setupIntro();
    setupScroll();
    watchGalleryParallax();
    setupInteractions();
    api?.on('tier', next => { if (next === 'lite') document.documentElement.dataset.tier = 'lite'; });
    document.fonts?.ready.then(() => window.ScrollTrigger?.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
