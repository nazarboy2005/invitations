(() => {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s), $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = $('#dust'), ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = 1, raf = 0, active = true, beamX = -1, scrollVelocity = 0, lastScroll = scrollY, dustAlpha = 0, confetti = [];
  const particles = [];
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, document.documentElement.dataset.tier === 'lite' ? 1.5 : 2);
    width = innerWidth; height = innerHeight; canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function newParticle(burst = false) {
    const angle = Math.random() * Math.PI * 2, speed = burst ? 1.5 + Math.random() * 5 : .12 + Math.random() * .35;
    return { x: burst ? width / 2 : Math.random() * width, y: burst ? height * .47 : height * Math.random(), r: .5 + Math.random() * 2, a: .18 + Math.random() * .56, phase: Math.random() * Math.PI * 2, vy: burst ? Math.sin(angle) * speed : -.12 - Math.random() * .42, vx: burst ? Math.cos(angle) * speed : (Math.random() - .5) * .14, life: burst ? 1 : 10000, burst };
  }
  function loop() {
    raf = 0; if (!active || document.hidden) return;
    ctx.clearRect(0, 0, width, height); ctx.globalCompositeOperation = 'lighter';
    const beam = beamX < 0 ? 0 : beamX;
    for (const p of particles) {
      p.phase += .035; p.x += p.vx + scrollVelocity * .00015; p.y += p.vy;
      const close = beam && Math.abs(p.x - beam) < Math.max(26, width * .085) ? 1 : .16;
      const pulse = .55 + Math.sin(p.phase) * .35;
      ctx.globalAlpha = (p.a * pulse * (1 + dustAlpha * .45) * close) * (p.burst ? Math.max(0, p.life) : 1);
      ctx.fillStyle = '#f4d47b'; ctx.shadowColor = '#e8bd57'; ctx.shadowBlur = p.r * 5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      if (p.burst) p.life -= .012;
      if (p.y < -6 || p.x < -20 || p.x > width + 20 || (p.burst && p.life <= 0)) Object.assign(p, p.burst ? newParticle() : newParticle());
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    confetti = confetti.filter(c => c.life > 0);
    for (const c of confetti) { c.x += c.vx; c.y += c.vy; c.vy += .035; c.rot += c.spin; c.life -= .014; ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot); ctx.globalAlpha = Math.max(0, c.life); ctx.fillStyle = c.color; ctx.fillRect(-c.w/2,-c.h/2,c.w,c.h); ctx.restore(); }
    scrollVelocity *= .92;
    if (particles.length || confetti.length) raf = requestAnimationFrame(loop);
  }
  function ensureLoop() { if (!reduced && !raf && active && !document.hidden) raf = requestAnimationFrame(loop); }
  function initParticles() { resize(); const max = reduced ? 0 : (Marhamat?.tier === 'lite' ? 15 : 52); particles.length = 0; for (let i = 0; i < max; i++) particles.push(newParticle()); ensureLoop(); }
  function burst() { for (const p of particles) { const a = Math.random() * Math.PI * 2, v = 1.4 + Math.random() * 4.4; p.burst = true; p.life = 1; p.vx = Math.cos(a) * v; p.vy = Math.sin(a) * v; } ensureLoop(); }
  addEventListener('resize', resize, { passive: true });
  addEventListener('scroll', () => { scrollVelocity = Math.abs(scrollY - lastScroll); lastScroll = scrollY; ensureLoop(); }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) ensureLoop(); });
  const intersection = new IntersectionObserver(entries => { active = entries.some(entry => entry.isIntersecting); if (active) ensureLoop(); else { cancelAnimationFrame(raf); raf = 0; } }); intersection.observe(document.body);
  function gsapReady() { return !!(window.gsap && window.ScrollTrigger && !reduced); }
  function buildIntro() {
    const intro = $('#intro'), open = $('#open-invitation'), greeting = $('.intro__greeting'), word = $('.intro__word'), seal = $('.seal'), label = $('.intro__label'), corners = $$('.corner');
    if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (window.gsap && !reduced) {
      gsap.set(corners, { strokeDasharray: i => corners[i].getTotalLength(), strokeDashoffset: i => corners[i].getTotalLength() });
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('.dust', { opacity: .88, duration: .55 }, 0)
        .to(corners, { strokeDashoffset: 0, duration: .95, stagger: .08, ease: 'power2.inOut' }, .08)
        .fromTo(greeting, { opacity: 0, letterSpacing: '.6em' }, { opacity: 1, letterSpacing: '.35em', duration: .8 }, .38)
        .to(word, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: .82, ease: 'power2.inOut' }, .72)
        .fromTo(seal, { opacity: 0, scale: .76 }, { opacity: 1, scale: 1, duration: .55, ease: 'back.out(1.4)' }, 1.25)
        .to(label, { opacity: 1, duration: .35 }, 1.55)
        .to('.intro__name-lockup', { opacity: 1, duration: .4 }, .95);
      gsap.to('.hero__wash', { x: '220%', duration: 2.7, repeat: -1, repeatDelay: 3.4, ease: 'sine.inOut' });
      gsap.to('.hero__frame', { opacity: .72, duration: 2.8, repeat: -1, yoyo: true, repeatDelay: 2.8, ease: 'sine.inOut' });
    } else { [greeting, word, seal, label].forEach(el => { el.style.opacity = 1; el.style.clipPath = 'none'; }); corners.forEach(el => el.style.strokeDashoffset = 0); }
    let opening = false, finished = false, timeline, forge, halves = [];
    const hero = $('#hero'), names = $$('.hero__names > span[data-slot], .hero__names > small'), heroBits = $$('.hero__content .eyebrow, .hero__date, .rule-diamond, .scroll-cue');
    const frameLines = $$('.hero__frame rect, .hero__frame path');
    if (document.fonts?.load) document.fonts.load('80px "Great Vibes"').catch(() => {});
    function finish() {
      if (finished) return; finished = true;
      timeline?.kill(); forge?.stop(); halves.forEach(h => h.remove());
      intro.classList.add('is-gone'); intro.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('is-locked'); document.body.classList.add('is-open');
      if (window.Marhamat?.open) Marhamat.open();
      if (window.gsap) { gsap.set([...names, ...heroBits], { opacity: 1, y: 0, filter: 'none' }); gsap.set(frameLines, { strokeDashoffset: 0 }); gsap.set('.hero__frame', { scale: 1, opacity: 1 }); }
      if (reduced || !window.gsap) $('#hero').scrollIntoView({ block: 'start' });
    }
    // The seal splits along a jagged crack into two real halves that fall away.
    const CRACK = '52,0 46,22 56,40 44,58 55,76 48,100';
    function breakSeal() {
      const r = seal.getBoundingClientRect(), pts = CRACK.split(' ').map(p => p.split(',').map(Number));
      const left = ['0% 0%', ...pts.map(([x, y]) => `${x}% ${y}%`), '0% 100%'], right = ['100% 0%', ...pts.map(([x, y]) => `${x}% ${y}%`), '100% 100%'];
      halves = [left, right].map(poly => {
        const half = seal.cloneNode(true); half.removeAttribute('id'); half.className = 'seal seal-half'; half.disabled = true; half.setAttribute('aria-hidden', 'true');
        Object.assign(half.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, transform: 'none', clipPath: `polygon(${poly.join(',')})` });
        document.body.append(half); return half;
      });
      gsap.set(seal, { opacity: 0 });
      gsap.to(halves[0], { x: -r.width * 1.3, y: r.height * 2.6, rotation: -38, opacity: 0, duration: 1.25, ease: 'power2.in' });
      gsap.to(halves[1], { x: r.width * 1.3, y: r.height * 2.3, rotation: 34, opacity: 0, duration: 1.25, ease: 'power2.in' });
    }
    function startOpen() {
      if (opening) { finish(); return; } opening = true;
      open.disabled = true; open.setAttribute('aria-label', 'Taklifnoma ochilmoqda');
      if (window.Marhamat?.open) Marhamat.open(); else document.documentElement.classList.remove('is-locked');
      document.documentElement.classList.add('is-locked'); scrollTo(0, 0);
      if (!window.gsap || reduced) { finish(); return; }
      try { navigator.vibrate && navigator.vibrate([10, 60, 18]); } catch (_) {}
      const r = seal.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      intro.style.setProperty('--sx', `${cx}px`); intro.style.setProperty('--sy', `${cy}px`);
      // the hero waits in the dark underneath, title hidden, frame undrawn
      gsap.set(names, { opacity: 0 }); gsap.set(heroBits, { opacity: 0, y: 14 });
      gsap.set(frameLines, { strokeDasharray: i => frameLines[i].getTotalLength(), strokeDashoffset: i => frameLines[i].getTotalLength() });
      gsap.set('.hero__frame', { scale: 1.05, opacity: 1 });
      const crack = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); crack.setAttribute('class', 'seal__crack'); crack.setAttribute('viewBox', '0 0 100 100'); crack.setAttribute('aria-hidden', 'true');
      crack.innerHTML = `<path d="M${CRACK.split(' ').join(' L')}"/>`; seal.append(crack);
      const crackPath = crack.firstChild, crackLen = crackPath.getTotalLength();
      const lite = Marhamat?.tier === 'lite';
      timeline = gsap.timeline({ onComplete: finish });
      timeline
        // 1. press: the seal gives under the finger, the room goes quiet
        .to(seal, { scale: .88, duration: .16, ease: 'power2.in' }, 0)
        .to(seal, { scale: 1.06, duration: .38, ease: 'back.out(3)' }, .16)
        .to([greeting, word, label], { opacity: 0, y: -8, duration: .45, ease: 'power2.in' }, 0)
        .to('.intro__corners', { opacity: 0, duration: .5 }, .05)
        .to('.intro__spot', { opacity: .4, duration: .5 }, 0)
        // 2. a crack of light runs through the wax, the seal strains and glows
        .fromTo(crackPath, { strokeDasharray: crackLen, strokeDashoffset: crackLen }, { strokeDashoffset: 0, duration: .42, ease: 'power2.in' }, .3)
        .fromTo(seal, { filter: 'brightness(1) drop-shadow(0 0 0px #f3d68a)' }, { filter: 'brightness(1.35) drop-shadow(0 0 18px #f3d68a)', duration: .42, ease: 'power1.in' }, .3)
        .to(seal, { x: '+=2', duration: .04, repeat: 7, yoyo: true, ease: 'none' }, .44)
        // 3. it breaks: halves fall, a flash of gold light and a slow turn of rays
        .add(breakSeal, .78)
        .fromTo('.intro__flare', { scale: .3, opacity: 0 }, { scale: 2.6, opacity: .95, duration: .14, ease: 'power2.out' }, .78)
        .to('.intro__flare', { scale: 5.5, opacity: 0, duration: 1.1, ease: 'power2.out' }, .92)
        .fromTo('.intro__rays', { scale: .3, rotation: -8, opacity: 0 }, { scale: 1, rotation: 22, opacity: lite ? .5 : .8, duration: 1.6, ease: 'power2.out' }, .8)
        .to('.intro__rays', { opacity: 0, duration: .8, ease: 'power1.in' }, 1.7)
        // 4. the dust takes over: it bursts from the seal and writes the names
        .add(() => { forge = window.OltinNurForge?.play({ x: cx, y: cy, targets: names, lite }); }, .8)
        // 5. the black lifts to velvet, and the gold frame draws itself around the title
        .to('.intro__curtain', { opacity: 0, duration: 1.8, ease: 'power2.inOut' }, 1.0)
        .to('.intro__spot', { opacity: 0, duration: 1.2 }, 1.0)
        .to(frameLines, { strokeDashoffset: 0, duration: 2.2, stagger: .12, ease: 'power2.inOut' }, 1.3)
        .to('.hero__frame', { scale: 1, duration: 2.6, ease: 'power3.out' }, 1.3);
      // 6. when the last mote lands, the real foil title takes its place
      const landed = .8 + (window.OltinNurForge ? 2.57 : 0);
      timeline
        .to(names, { opacity: 1, duration: 1, stagger: .12, ease: 'power1.inOut' }, landed - .15)
        .add(() => forge?.release(), landed + .25)
        .to(heroBits, { opacity: 1, y: 0, duration: .9, stagger: .14, ease: 'power3.out' }, landed + .35)
        .set({}, {}, landed + 1.6);
    }
    open.addEventListener('click', startOpen);
    intro.addEventListener('click', e => { if (opening && !open.contains(e.target)) finish(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && opening) finish(); });
  }
  function setupScroll() {
    const sections = $$('.section, .gallery-section, .footer');
    if (!gsapReady()) { sections.forEach(el => el.classList.add('is-revealed')); return; }
    gsap.registerPlugin(ScrollTrigger);
    sections.forEach(section => gsap.fromTo(section.children, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .07, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 82%', once: true } }));
    $$('.divider path, .footer__ornament path').forEach(path => { const len = path.getTotalLength(); gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: path.closest('section,footer'), start: 'top 75%', end: 'bottom 55%', scrub: 1 } }); });
    const rsvpCard = $('.rsvp-card'); if (rsvpCard) ScrollTrigger.create({ trigger: rsvpCard, start: 'top 78%', once: true, onEnter: () => rsvpCard.classList.add('is-lit') });
    const program = $('.program'), line = $('.program__track i'), items = $$('.program__item');
    if (program && line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: { trigger: program, start: 'top 70%', end: 'bottom 55%', scrub: 1, onUpdate: self => items.forEach((item, i) => item.classList.toggle('is-lit', self.progress >= (i + .18) / items.length)) } });
    const gallery = $('.gallery-section'), track = $('.gallery', gallery);
    if (gallery && track && Marhamat?.tier === 'full' && innerWidth >= 360) {
      const cards = $$('.gallery__item', track);
      if (cards.length > 1) {
        track.style.overflow = 'visible'; track.style.width = 'max-content'; track.style.paddingLeft = `${Math.max(18, (innerWidth - Math.min(innerWidth, 300)) / 2)}px`;
        const distance = () => Math.max(0, track.scrollWidth - gallery.clientWidth + 36);
        gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: gallery, pin: true, scrub: 1, start: 'top top', end: () => `+=${distance()}`, invalidateOnRefresh: true } });
        cards.forEach((card, i) => gsap.fromTo(card, { scale: .88, opacity: .62 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: gallery, start: () => `top+=${i * 220} top`, end: () => `top+=${i * 220 + 260} top`, scrub: 1 } }));
      }
    }
    gsap.to('.dust', { y: -28, ease: 'none', scrollTrigger: { trigger: '#page', start: 'top top', end: 'bottom bottom', scrub: 1 } });
  }
  function setupCountdownFlip() {
    $$('[data-unit]').forEach(el => { let previous = el.textContent; const observer = new MutationObserver(() => { if (el.textContent !== previous) { previous = el.textContent; if (window.gsap && !reduced) gsap.fromTo(el, { rotationX: -88, opacity: .25 }, { rotationX: 0, opacity: 1, duration: .38, ease: 'power2.out', transformOrigin: '50% 50%' }); } }); observer.observe(el, { childList: true, characterData: true, subtree: true }); });
  }
  function setupGift() {
    const box = $('.gift-box'), modal = $('#gift-modal'), card = $('.gift-modal__card', modal);
    const close = () => { if (window.gsap && !reduced) gsap.to(card, { y: 20, opacity: 0, duration: .2, onComplete: () => { modal.hidden = true; } }); else modal.hidden = true; };
    box.addEventListener('click', () => { modal.hidden = false; if (window.gsap && !reduced) { gsap.to('.gift-box__raster', { opacity: 0, duration: .22 }); gsap.to('.gift-box__lid-vector, .gift-box__bow', { opacity: 0, duration: .25 }); gsap.fromTo('.gift-box__lid', { y: 0, rotation: 0, opacity: 0 }, { y: -40, rotation: -7, opacity: 1, duration: .48, ease: 'power2.in' }); gsap.fromTo('.gift-box__ribbon', { scaleY: 1 }, { scaleY: .25, opacity: 0, duration: .3, transformOrigin: '50% 0%' }); gsap.fromTo(card, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .5, delay: .22, ease: 'expo.out' }); } });
    $('.gift-modal__close', modal).addEventListener('click', close); $('.gift-modal__shade', modal).addEventListener('click', close); addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  }
  function setupRsvp() {
    Marhamat?.on('rsvp', answer => { if (answer.status !== 'yes' || reduced) return; const area = $('#rsvp'), rect = area.getBoundingClientRect(); confetti = Array.from({ length: 100 }, () => ({ x: width / 2 + (Math.random() - .5) * 50, y: Math.max(0, rect.top + scrollY + 120 - scrollY), vx: (Math.random() - .5) * 5, vy: -2 - Math.random() * 4, w: 2 + Math.random() * 4, h: 4 + Math.random() * 7, rot: Math.random() * 6, spin: (Math.random() - .5) * .18, life: 1, color: ['#f3dfa2','#c9a55c','#805d24'][Math.floor(Math.random() * 3)] })); ensureLoop(); const text = $('.success-write'); if (window.gsap) gsap.fromTo(text, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power1.inOut' }); });
    Marhamat?.on('tier', tier => { if (tier === 'lite') { particles.splice(15); } else if (particles.length < 52) { while (particles.length < 52) particles.push(newParticle()); } ensureLoop(); });
    Marhamat?.on('wish', () => { const newest = $('.wishes__item:last-child'); if (newest && window.gsap && !reduced) gsap.fromTo(newest, { x: -20, opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: .72, ease: 'power2.out' }); });
  }
  function init() { initParticles(); buildIntro(); setupCountdownFlip(); setupGift(); setupRsvp(); Marhamat?.on('ready', setupScroll); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
