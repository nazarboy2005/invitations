(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const intro = $('#intro'), hero = $('#hero'), canvas = $('.scene-canvas');
  let renderer = null, scene = null, camera = null, star = null, opening = false, opened = false, raf = 0, scrollProgress = 0, introVisible = true, inViewport = true;
  const reduced = () => !!(window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches);

  function finishOpen() {
    if (opened) return;
    opened = true; opening = false;
    document.documentElement.classList.remove('is-locked'); document.body.classList.remove('is-opening'); document.body.classList.add('is-open');
    intro?.classList.add('is-open'); intro?.setAttribute('aria-hidden', 'true');
    if (canvas && hero) { hero.append(canvas); canvas.classList.add('in-hero'); }
    introVisible = false;
    window.setTimeout(() => { if (intro) intro.hidden = true; }, reduced() ? 0 : 700);
    hero?.scrollIntoView({ block: 'start', behavior: 'auto' });
    if (window.gsap && !reduced()) gsap.fromTo('.hero__content > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .75, stagger: .08, ease: 'power3.out', delay: .12 });
  }
  function beginOpen() {
    if (opened) return;
    if (opening) { finishOpen(); return; }
    opening = true; window.Marhamat?.open?.(); document.body.classList.add('is-opening');
    if (!window.gsap || reduced()) { finishOpen(); return; }
    const duration = window.Marhamat?.tier === 'lite' ? .8 : 1.5;
    intro?.classList.add('act-two');
    const openingStarScale = { value: star?.scale?.x ?? .02 };
    const tl = gsap.timeline({ onComplete: finishOpen });
    tl.to('.intro__fallback', { scale: 1.55, rotation: 16, opacity: 0, duration: duration, ease: 'power3.inOut' }, 0)
      .to(openingStarScale, { value: .84, duration: duration, ease: 'power3.inOut', onUpdate: () => star?.scale?.setScalar(openingStarScale.value) }, 0)
      .to('.intro__veil', { opacity: .12, duration: duration, ease: 'power2.inOut' }, 0)
      .to('.intro__copy', { y: -15, opacity: 0, duration: .48, ease: 'power2.in' }, .15)
      .to(canvas, { opacity: .62, duration: .5, ease: 'power2.out' }, .3)
      .fromTo('.intro__moon', { yPercent: 70, opacity: .25 }, { yPercent: 0, opacity: 1, duration: duration * .8, ease: 'power3.out' }, .12)
      .to('.intro__stars i', { opacity: 1, scale: 1, stagger: .09, duration: .32, ease: 'power2.out' }, .24)
      .to('.intro__moon', { scale: 1.09, duration: .42, yoyo: true, repeat: 1, ease: 'sine.inOut' }, duration * .45)
      .fromTo('.skyline--intro', { y: 18, opacity: .3 }, { y: 0, opacity: .74, duration: duration, ease: 'power2.out' }, 0);
    intro?.addEventListener('click', () => { if (opening) { tl.progress(1); } }, { once: true });
  }
  $('#open-invitation')?.addEventListener('click', e => { e.stopPropagation(); beginOpen(); });

  function createStar(THREE) {
    const points = [], inner = 1.04, outer = 1.82;
    for (let i = 0; i < 16; i++) { const angle = -Math.PI / 2 + i * Math.PI / 8, r = i % 2 === 0 ? outer : inner; points.push(new THREE.Vector2(Math.cos(angle) * r, Math.sin(angle) * r)); }
    const shape = new THREE.Shape(); shape.moveTo(points[0].x, points[0].y); points.slice(1).forEach(p => shape.lineTo(p.x, p.y)); shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: .24, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .055, bevelThickness: .045, curveSegments: 1 });
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({ color: 0xc9a64b, metalness: .82, roughness: .28, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material); mesh.rotation.x = -.12; mesh.position.set(0, .25, 0); mesh.scale.setScalar(.02); scene.add(mesh);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.03, .012, 4, 96), new THREE.MeshBasicMaterial({ color: 0xf2dd9a, transparent: true, opacity: .6 })); ring.position.set(0, .25, -.04); scene.add(ring);
    return mesh;
  }
  function resize() {
    if (!renderer || !canvas || !hero) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix();
  }
  function loop(t) {
    raf = 0; if (!renderer || document.hidden || !inViewport) return;
    if (star) {
      const time = t * .001;
      star.rotation.z = Math.sin(time * .22) * .12 + scrollProgress * .85;
      star.rotation.y = Math.sin(time * .34) * .18 + scrollProgress * .5;
      star.rotation.x = -.12 + Math.cos(time * .2) * .08 + scrollProgress * .25;
      star.position.y = .15 + Math.sin(time * .6) * .07 - scrollProgress * .3;
      camera.position.y = scrollProgress * .35; camera.position.z = 8 - scrollProgress * .65;
      renderer.render(scene, camera);
    }
    if (introVisible || opened) raf = requestAnimationFrame(loop);
  }
  function startLoop() { if (!raf && renderer && !document.hidden && inViewport) raf = requestAnimationFrame(loop); }
  function stopThree() { if (raf) cancelAnimationFrame(raf); raf = 0; if (renderer) renderer.dispose(); renderer = scene = camera = star = null; document.documentElement.classList.add('is-fallback'); canvas?.classList.remove('is-ready'); }
  async function loadThree() {
    if (!canvas || window.Marhamat?.tier !== 'full' || reduced() || !('WebGLRenderingContext' in window)) return;
    try {
      await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 160)));
      const script = document.createElement('script'); script.src = '../shared/nikoh/vendor/three/three.bundle.min.js';
      await new Promise((resolve, reject) => { script.onload = resolve; script.onerror = reject; document.head.append(script); });
      const THREE = window.THREE; if (!THREE) throw new Error('Three.js unavailable');
      const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' }) || canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
      if (!gl) throw new Error('WebGL unavailable');
      renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); renderer.setClearColor(0, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
      scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(40, 1, .1, 30); camera.position.set(0, 0, 8);
      scene.add(new THREE.AmbientLight(0xfbe7b5, 1.6));
      const key = new THREE.DirectionalLight(0xffe8a3, 3.1); key.position.set(-3, 4, 6); scene.add(key);
      const rim = new THREE.PointLight(0x77b4a3, 2.5, 15); rim.position.set(4, -2, 3); scene.add(rim);
      star = createStar(THREE); resize(); canvas.classList.add('is-ready');
      if (window.gsap && !reduced()) { const starScale = { value: star.scale.x }; gsap.to(starScale, { value: .68, duration: 1.9, delay: .12, ease: 'expo.out', onUpdate: () => star?.scale?.setScalar(starScale.value) }); }
      intro?.classList.add('has-webgl');
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => { inViewport = entries.some(entry => entry.isIntersecting); if (inViewport) startLoop(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } }, { threshold: .01 });
        observer.observe(canvas);
      }
      canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); stopThree(); }, { once: true });
      window.addEventListener('resize', resize, { passive: true }); startLoop();
    } catch (_) { stopThree(); }
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; } else startLoop(); });
  if (window.Marhamat?.on) {
    window.Marhamat.on('ready', () => {
      if (window.gsap && !reduced()) gsap.fromTo('.intro__copy > *', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .68, stagger: .15, ease: 'power3.out' });
      if (window.Marhamat.tier === 'full') { if ('requestIdleCallback' in window) requestIdleCallback(loadThree, { timeout: 1200 }); else setTimeout(loadThree, 220); }
    });
    window.Marhamat.on('tier', event => { if (event?.tier === 'lite' || window.Marhamat.tier === 'lite') stopThree(); });
    window.Marhamat.on('rsvp', answer => { if (answer?.status !== 'yes' || reduced()) return; const lamp = $('.rsvp__lantern'); if (lamp) gsap?.fromTo(lamp, { scale: .5, opacity: .4 }, { scale: 1.3, opacity: 1, duration: .6, yoyo: true, repeat: 1, ease: 'power2.out' }); });
  } else if (document.readyState === 'complete') loadThree();

  function setupScroll() {
    if (!window.gsap || !window.ScrollTrigger || reduced()) return;
    gsap.registerPlugin(ScrollTrigger);
    const scrub = (trigger, target, vars) => { if ($(target)) gsap.to(target, { ...vars, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: .8 } }); };
    scrub('#hero', '.hero__moon', { y: 85, scale: .82, rotation: 14 });
    scrub('#date', '.countdown__label', { y: -10, opacity: .82 });
    ScrollTrigger.create({ trigger: '#hero', start: 'top bottom', end: 'bottom top', scrub: .8, onUpdate: self => { scrollProgress = self.progress; if (star) startLoop(); } });
    scrub('#venue', '.venue__still', { y: -18, scale: 1.04 });
    scrub('#dresscode', '.dresscode__icon', { rotation: 7, y: -4 });
    scrub('#gallery', '.gallery__frame', { y: -14 });
    $$('[data-section]').forEach(section => ScrollTrigger.create({ trigger: section, start: 'top 78%', once: true, onEnter: () => section.classList.add('is-seen') }));
    ScrollTrigger.create({ trigger: '.section--program', start: 'top 76%', once: true, onEnter: () => $('.program__ornament')?.classList.add('is-drawn') });
    const program = $('.program'); if (program) gsap.fromTo('.program__item', { x: -14, opacity: 0 }, { x: 0, opacity: 1, stagger: .08, duration: .6, ease: 'power3.out', immediateRender: false, scrollTrigger: { trigger: program, start: 'top 78%', once: true } });
  }
  function updateSunToIftar() {
    const dateSection = $('#date'), eventDate = new Date(window.Marhamat?.data?.dateTime || '');
    if (!dateSection || Number.isNaN(+eventDate)) return;
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: window.Marhamat?.data?.timezone || 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(eventDate);
    const getPart = type => parts.find(item => item.type === type)?.value;
    const sunrise = new Date(`${getPart('year')}-${getPart('month')}-${getPart('day')}T06:00:00+05:00`);
    let now = new Date();
    const clockOverride = new URLSearchParams(location.search).get('now');
    if (clockOverride && /^\d{4}-\d{2}-\d{2}$/.test(clockOverride)) now = new Date(`${clockOverride}T00:00:00+05:00`);
    const span = +eventDate - +sunrise;
    const progress = span > 0 ? Math.max(0, Math.min(1, (+now - +sunrise) / span)) : (+now >= +eventDate ? 1 : 0);
    dateSection.style.setProperty('--sun-y', `${progress * 42}px`);
  }
  updateSunToIftar(); window.setInterval(updateSunToIftar, 60000);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupScroll, { once: true }); else setupScroll();
})();
