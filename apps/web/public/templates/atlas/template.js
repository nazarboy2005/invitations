(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  let intro, opener, canvas, ctx, fabricImage, strips = [], opening = false, finished = false, raf = 0, gust = 0, marqueeTween, openingTimeline;
  function setupFabric() {
    canvas = $('.intro__wind'); ctx = canvas && canvas.getContext('2d', { alpha: false });
    fabricImage = new Image(); fabricImage.src = 'art/silk-hero.webp';
    if (!ctx || !fabricImage || window.Marhamat?.tier === 'lite' || window.Marhamat?.reducedMotion) { intro.classList.add('is-lite'); return; }
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, window.Marhamat?.tier === 'lite' ? 1.5 : 2);
      canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
      canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); addEventListener('resize', resize, { passive: true });
    const draw = time => {
      raf = requestAnimationFrame(draw);
      if (document.hidden || finished || !fabricImage.complete || !fabricImage.naturalWidth) return;
      const w = innerWidth, h = innerHeight, cols = window.Marhamat?.tier === 'lite' || window.Marhamat?.reducedMotion ? 1 : 40;
      const iw = fabricImage.naturalWidth, ih = fabricImage.naturalHeight;
      const scale = Math.max(w / iw, h / ih), sourceWidth = w / scale, sourceLeft = Math.max(0, (iw - sourceWidth) / 2), sw = w / cols;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < cols; i++) {
        const x = i * sw, phase = time * .00135 - i * .19;
        const amp = (window.Marhamat?.tier === 'lite' || window.Marhamat?.reducedMotion ? 2 : 13) + gust;
        const y = Math.sin(phase) * amp + Math.sin(phase * .43) * amp * .32;
        const sx = sourceLeft + x / scale, sWidth = Math.min(sw / scale + 1, iw - sx);
        ctx.drawImage(fabricImage, sx, 0, sWidth, ih, x, y, sw + 1, h);
        const shade = Math.cos(phase) * .09;
        if (shade > 0) ctx.fillStyle = `rgba(255,246,233,${shade})`; else ctx.fillStyle = `rgba(12,16,57,${-shade})`;
        ctx.fillRect(x, y, sw + 1, h);
      }
    };
    raf = requestAnimationFrame(draw);
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(draw); });
  }
  function stitchIn() {
    const rect = $('.label-stitches rect');
    if (!rect) return;
    if (window.gsap && !window.Marhamat?.reducedMotion) gsap.to(rect, { strokeDashoffset: 0, duration: 1.45, delay: .18, ease: 'power2.out' });
    else rect.style.strokeDashoffset = '0';
  }
  function makeStrips() {
    const host = $('.intro__strip-field'); if (!host || window.Marhamat?.tier === 'lite' || window.Marhamat?.reducedMotion) return;
    host.replaceChildren(); const count = 40;
    for (let i = 0; i < count; i++) { const strip = document.createElement('i'); strip.style.left = `${i * 2.5}%`; strip.style.width = '2.6%'; strip.style.backgroundPosition = `${i * 100 / (count - 1)}% center`; strip.style.transformOrigin = '50% 0'; host.append(strip); strips.push(strip); }
  }
  function finish() {
    if (finished) return; finished = true; opening = false; cancelAnimationFrame(raf);
    intro.classList.add('is-open'); document.body.classList.add('is-open'); document.body.classList.remove('is-opening');
    if (window.gsap) {
      const words = $$('.hero__names > *');
      gsap.fromTo('.hero__copy > *', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .65, stagger: .1, ease: 'power3.out', delay: .05 });
      gsap.fromTo(words, { opacity: 0, x: i => i === 1 ? 0 : (i === 0 ? -42 : 42), clipPath: i => i === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)', scale: i => i === 1 ? .65 : 1 }, { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', scale: 1, duration: .82, stagger: .14, delay: .34, ease: 'power3.out' });
      gsap.fromTo('.hero__threads path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .9, stagger: .08, delay: .8, ease: 'power2.out' });
    }
    $('.hero')?.scrollIntoView({ block: 'start', behavior: window.Marhamat?.reducedMotion ? 'auto' : 'smooth' });
  }
  function openFilm() {
    if (opening) { if (openingTimeline) openingTimeline.progress(1); else finish(); return; }
    if (finished) return; opening = true;
    window.Marhamat?.open(); intro.classList.add('is-opening'); document.body.classList.add('is-opening'); gust = 30;
    const duration = window.Marhamat?.tier === 'lite' || window.Marhamat?.reducedMotion ? .65 : 1.25;
    if (window.gsap && strips.length) {
      const mid = (strips.length - 1) / 2;
      openingTimeline = gsap.timeline({ onComplete: finish }).to('.label-patch', { yPercent: -150, rotation: 12, opacity: 0, duration: .55, ease: 'power3.in' }, 0)
        .to(strips, { yPercent: -120, x: i => (i - mid) * .55, skewX: i => (i < mid ? -9 : 9), duration, stagger: { each: .014, from: 'center' }, ease: 'power3.in' }, .1)
        .to('.intro__frame,.intro__side-note', { opacity: 0, duration: .2 }, 0);
    } else setTimeout(finish, duration * 1000);
  }
  function prepareHero() {
    const targets = $$('.hero__copy > *');
    if (window.gsap && !window.Marhamat?.reducedMotion) gsap.set(targets, { y: 18, opacity: 0 });
    else { targets.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; }); $$('.hero__names > *').forEach(el => { el.style.opacity = '1'; el.style.clipPath = 'none'; }); }
    const path = $('.ribbon-thread'), halo = $('.ribbon-halo');
    if (path && path.getTotalLength) { const length = path.getTotalLength(); path.style.strokeDasharray = `${length}`; path.style.strokeDashoffset = `${length}`; halo.style.strokeDasharray = `${length}`; }
  }
  function setupScroll() {
    const sections = $$('[data-section]');
    if (window.gsap && window.ScrollTrigger && !window.Marhamat?.reducedMotion) {
      gsap.registerPlugin(ScrollTrigger);
      sections.forEach((section, i) => { if (i === 0) return; const children = section.querySelectorAll('.eyebrow,.section__title,.date-poster,.program__item,.venue__photo,.gallery__item,.wishes__item'); if (!children.length) return; gsap.from(children, { y: 24, opacity: 0, duration: .75, stagger: .075, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 78%', once: true } }); });
      const path = $('.ribbon-thread'); if (path) gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.page', start: 'top top', end: 'bottom bottom', scrub: 1 } });
      const silk = $('.hero__silk img'); if (silk) gsap.to(silk, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      const gallery = $('[data-gallery]'); if (gallery && matchMedia('(min-width: 700px)').matches && window.Marhamat?.tier === 'full') gsap.to(gallery, { x: () => -Math.max(0, gallery.scrollWidth - gallery.clientWidth), ease: 'none', scrollTrigger: { trigger: '.gallery-section', start: 'top top', end: '+=650', pin: true, scrub: 1, invalidateOnRefresh: true } });
      let previous = scrollY, last = performance.now(), velocity = 0;
      addEventListener('scroll', () => { const now = performance.now(), dt = Math.max(1, now - last); const v = (scrollY - previous) / dt; velocity += (v - velocity) * .22; document.documentElement.style.setProperty('--scroll-velocity', `${clamp(Math.abs(velocity) * 180, 0, 1.8)}`); if (marqueeTween) marqueeTween.timeScale(1 + clamp(Math.abs(velocity) * 3, 0, 1.4)); previous = scrollY; last = now; }, { passive: true });
      const marquee = $('.marquee__track'); if (marquee) marqueeTween = gsap.to(marquee, { xPercent: -50, duration: 28, repeat: -1, ease: 'none', modifiers: { xPercent: x => `${parseFloat(x) % -50}` } });
    }
  }
  function confetti() {
    const host = $('.celebration'), parent = $('.rsvp__done'); if (!host || !parent || window.Marhamat?.reducedMotion || window.Marhamat?.tier === 'lite') return;
    const c = host.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), w = parent.clientWidth, h = parent.clientHeight; host.width = w * dpr; host.height = h * dpr; c.setTransform(dpr,0,0,dpr,0,0);
    const colors = ['#C2185B','#F2A33A','#127A5B','#F7C6D3'], bits = Array.from({length:38},(_,i)=>({x:w*.5,y:h*.14,vx:(Math.random()-.5)*4,vy:-Math.random()*5-1,life:70+Math.random()*28,size:3+Math.random()*4,color:colors[i%colors.length]}));
    let frame=0; const tick=()=>{if(document.hidden||frame++>105)return;c.clearRect(0,0,w,h);bits.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life--;c.globalAlpha=Math.max(0,p.life/90);c.fillStyle=p.color;c.fillRect(p.x,p.y,p.size,p.size*1.6)});requestAnimationFrame(tick)}; requestAnimationFrame(tick);
  }
  function init() {
    intro = $('#intro'); opener = $('#open-invitation');
    if (!intro || !opener) return;
    const lang = window.Marhamat?.lang || document.documentElement.lang || 'uz';
    const metadata = {
      uz: { title: 'Atlas taklifnomasi', description: 'Zamonaviy atlas va adras ranglaridagi nikoh taklifnomasi.' },
      'uz-Cyrl': { title: 'Атлас таклифномаси', description: 'Замонавий атлас ва адрас рангларидаги никоҳ таклифномаси.' },
      ru: { title: 'Приглашение Atlas', description: 'Свадебное приглашение в ярких цветах узбекского атласа и адраса.' },
      en: { title: 'Atlas invitation', description: 'A wedding invitation inspired by the vivid colours of Uzbek atlas and adras silk.' },
    }[lang] || { title: 'Atlas taklifnomasi', description: 'Zamonaviy atlas va adras ranglaridagi nikoh taklifnomasi.' };
    const names = [window.Marhamat?.data?.groom, window.Marhamat?.data?.bride].filter(Boolean);
    const couple = names.length ? `${names.join(' & ')} — ` : '';
    document.title = `${couple}${metadata.title}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${couple}${metadata.title}`);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.description);
    if (window.Marhamat?.tier === 'lite' || window.Marhamat?.reducedMotion) intro.classList.add('is-lite');
    setupFabric(); makeStrips(); stitchIn(); prepareHero(); setupScroll();
    if (window.gsap && !window.Marhamat?.reducedMotion) { gsap.timeline({ delay: .08 }).from('.intro__greeting', { opacity: 0, y: 8, duration: .35, ease: 'power2.out' }).from('.intro__caption', { opacity: 0, y: 7, duration: .28 }, '-=.08').from('.intro__names > *', { opacity: 0, y: 12, stagger: .12, duration: .42, ease: 'power3.out' }, '-=.04').from('.intro__date', { opacity: 0, duration: .28 }, '-=.12').from('.intro__button', { opacity: 0, y: 10, duration: .4, ease: 'back.out(1.3)' }, '-=.04'); }
    opener.addEventListener('click', event => { event.stopPropagation(); openFilm(); });
    intro.addEventListener('click', () => { if (opening) finish(); });
    window.Marhamat?.on('rsvp', answer => { if (answer?.status === 'yes') confetti(); });
    window.Marhamat?.on('open', () => document.body.classList.add('is-open'));
    window.Marhamat?.on('section', () => {});
    document.fonts?.ready.then(() => window.ScrollTrigger?.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true }); else init();
})();
