(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const intro = $('#intro'), hero = $('#hero'), openButton = $('#open-invitation');
  const sceneCanvas = $('.scene-canvas'), fallbackCanvases = $$('.lantern-fallback, .hero__lanterns');
  const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opening = false, finished = false, openTl = null, renderer = null, scene = null, camera = null;
  let raf = 0, particles = [], visible = { intro: true, hero: false }, celebrateUntil = 0, sceneScroll = 0, sceneCameraRise = 0;

  function resizeFallbacks() {
    const dpr = Math.min(devicePixelRatio || 1, window.Marhamat?.tier === 'lite' ? 1.5 : 2);
    fallbackCanvases.forEach(canvas => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext('2d'); if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    if (renderer && sceneCanvas?.parentElement) {
      const rect = sceneCanvas.parentElement.getBoundingClientRect();
      if (rect.width && rect.height) { renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); }
    }
  }

  function seedLanterns() {
    particles = [];
    const count = reduced() ? 0 : (window.Marhamat?.tier === 'lite' ? 9 : 24);
    for (let i = 0; i < count; i++) particles.push({ x: Math.random(), y: Math.random(), z: Math.random(), r: 2.2 + Math.random() * 4.4, speed: .000035 + Math.random() * .0001, sway: Math.random() * 6.28, phase: Math.random() * 6.28, alpha: .34 + Math.random() * .5 });
  }

  function drawFallbacks(now) {
    fallbackCanvases.forEach(canvas => {
      const isIntro = canvas.classList.contains('lantern-fallback');
      if ((isIntro && !visible.intro) || (!isIntro && !visible.hero) || canvas.hidden) return;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      const bounds = canvas.getBoundingClientRect(), w = bounds.width, h = bounds.height;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        if (now > celebrateUntil && !isIntro && i < 0) return;
        p.y -= p.speed * (window.Marhamat?.tier === 'lite' ? 1.2 : 1);
        if (p.y < -.08) { p.y = 1.04; p.x = Math.random(); }
        p.phase += .009;
        const x = p.x * w + Math.sin(p.phase + now * .0003) * 7;
        const y = p.y * h + Math.sin(p.phase * .7) * 5;
        const size = p.r * (isIntro ? .78 : 1);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 3.4);
        glow.addColorStop(0, `rgba(255,221,151,${p.alpha})`); glow.addColorStop(.16, `rgba(255,174,76,${p.alpha * .54})`); glow.addColorStop(1, 'rgba(255,174,76,0)');
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, size * 3.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,225,167,${p.alpha})`; ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x + size * .66, y - size * .37); ctx.lineTo(x + size * .56, y + size * .6); ctx.lineTo(x - size * .56, y + size * .6); ctx.lineTo(x - size * .66, y - size * .37); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = `rgba(255,221,155,${p.alpha * .7})`; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x, y - size * 1.75); ctx.stroke();
      });
    });
  }

  function loop(now) {
    raf = 0; if (document.hidden) return;
    drawFallbacks(now);
    if (renderer && sceneCanvas?.isConnected && !document.hidden && (opening || finished) && (visible.intro || visible.hero)) {
      const t = now * .001;
      if (!renderer.userData.startAt) renderer.userData.startAt = now;
      camera.position.y += (sceneCameraRise + sceneScroll * 1.8 - camera.position.y) * .035;
      const field = scene.userData.field;
      if (field) {
        for (let i = 0; i < field.items.length; i++) {
          const item = field.items[i], x = item.x + Math.sin(t * .55 + item.phase) * item.sway;
          const y = item.y + Math.sin(t * .9 + item.phase) * .055;
          field.node.position.set(x, y, item.z); field.node.rotation.set(0, 0, Math.sin(t * .8 + item.phase) * .045); field.node.scale.setScalar(item.size); field.node.updateMatrix();
          field.shell.setMatrixAt(i, field.node.matrix);
          field.node.position.y += item.size * .29; field.node.updateMatrix(); field.cap.setMatrixAt(i, field.node.matrix);
          field.node.position.y = y - item.size * .1; field.node.scale.setScalar(item.size * .58); field.node.updateMatrix(); field.flame.setMatrixAt(i, field.node.matrix);
          field.glows[i * 3] = x; field.glows[i * 3 + 1] = y; field.glows[i * 3 + 2] = item.z + .015;
        }
        field.shell.instanceMatrix.needsUpdate = true; field.cap.instanceMatrix.needsUpdate = true; field.flame.instanceMatrix.needsUpdate = true;
        field.glowGeometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
      if (renderer.userData.startAt && now - renderer.userData.startAt > 2200) {
        const fps = renderer.userData.frames * 1000 / (now - renderer.userData.startAt);
        if (fps < 45) { dropThree(); return; }
      }
      renderer.userData.frames++;
    }
    if ((visible.intro || visible.hero) && (particles.length || renderer)) raf = requestAnimationFrame(loop);
  }

  function startLoop() { if (!raf && !document.hidden && (particles.length || renderer)) raf = requestAnimationFrame(loop); }
  function pauseLoop() { cancelAnimationFrame(raf); raf = 0; }

  function dropThree() {
    if (renderer) { renderer.dispose(); renderer = null; scene = null; camera = null; }
    sceneCanvas?.classList.remove('is-ready'); hero?.classList.remove('has-webgl'); document.documentElement.classList.add('is-fallback');
    if (sceneCanvas?.parentElement !== intro) intro?.append(sceneCanvas);
    resizeFallbacks(); startLoop();
  }

  function makeLanternField(THREE, random, count) {
    const shellGeometry = new THREE.CylinderGeometry(.28, .22, .46, 5, 1, true);
    const capGeometry = new THREE.ConeGeometry(.29, .18, 5);
    const flameGeometry = new THREE.SphereGeometry(.1, 6, 5);
    const shell = new THREE.InstancedMesh(shellGeometry, new THREE.MeshBasicMaterial({ color: 0xffbd62, transparent: true, opacity: .72, side: THREE.DoubleSide }), count);
    const cap = new THREE.InstancedMesh(capGeometry, new THREE.MeshBasicMaterial({ color: 0xc7863e, transparent: true, opacity: .88 }), count);
    const flame = new THREE.InstancedMesh(flameGeometry, new THREE.MeshBasicMaterial({ color: 0xfff1b6 }), count);
    const items = [], glows = new Float32Array(count * 3), node = new THREE.Object3D();
    for (let i = 0; i < count; i++) items.push({ x: (random() - .5) * 7.2, y: .2 + random() * 4.1, z: -random() * 5.3, size: .11 + random() * .23, phase: random() * Math.PI * 2, sway: .025 + random() * .09 });
    const glowGeometry = new THREE.BufferGeometry(); glowGeometry.setAttribute('position', new THREE.BufferAttribute(glows, 3));
    const glowMaterial = new THREE.PointsMaterial({ color: 0xffcb73, size: .19, transparent: true, opacity: .33, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    const glow = new THREE.Points(glowGeometry, glowMaterial);
    return { shell, cap, flame, items, glows, glowGeometry, glow, node };
  }

  async function buildThree() {
    if (window.Marhamat?.tier !== 'full' || reduced() || !sceneCanvas || !('WebGLRenderingContext' in window)) return;
    try {
      await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 180)));
      const script = document.createElement('script'); script.src = '../shared/nikoh/vendor/three/three.bundle.min.js';
      await new Promise((resolve, reject) => { script.onload = resolve; script.onerror = reject; document.head.append(script); });
      const THREE = window.THREE; if (!THREE) throw new Error('Three.js unavailable');
      const gl = sceneCanvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' }) || sceneCanvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
      if (!gl) throw new Error('WebGL unavailable');
      renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas, context: gl, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); renderer.setClearColor(0x000000, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
      scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(42, 1, .1, 30); camera.position.set(0, 0, 8);
      const seed = 3127; let rand = seed; const random = () => { rand = (rand * 16807) % 2147483647; return (rand - 1) / 2147483646; };
      const field = makeLanternField(THREE, random, window.Marhamat?.tier === 'lite' ? 24 : 260);
      scene.add(field.shell, field.cap, field.flame, field.glow); scene.userData.field = field;
      const starsGeometry = new THREE.BufferGeometry(), positions = [];
      for (let i = 0; i < 170; i++) positions.push((random() - .5) * 8, (random() - .5) * 8, -random() * 5);
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xffe7b2, size: .025, transparent: true, opacity: .62 })));
      renderer.userData = { startAt: 0, frames: 0 };
      resizeFallbacks(); sceneCanvas.classList.add('is-ready'); hero?.classList.add('has-webgl'); document.documentElement.classList.add('has-webgl');
      sceneCanvas.addEventListener('webglcontextlost', event => { event.preventDefault(); dropThree(); }, { once: true });
      startLoop();
    } catch (_) { dropThree(); }
  }

  function moveSceneToHero() {
    if (sceneCanvas && hero && sceneCanvas.parentElement !== hero) hero.append(sceneCanvas);
    resizeFallbacks();
  }

  function finishOpen() {
    if (finished) return;
    finished = true; visible.intro = false; visible.hero = true; openTl?.progress(1); document.documentElement.classList.remove('is-locked');
    document.body.classList.add('is-open'); intro?.setAttribute('aria-hidden', 'true');
    moveSceneToHero(); hero?.scrollIntoView({ block: 'start', behavior: 'auto' });
    if (window.gsap && !reduced()) gsap.timeline({ delay: .12 }).fromTo('.hero__content > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .72, stagger: .1, ease: 'power3.out' });
  }

  function beginOpen() {
    if (finished) return;
    if (opening) { finishOpen(); return; }
    opening = true; window.Marhamat?.open?.(); document.body.classList.add('is-opening');
    startLoop();
    const lite = window.Marhamat?.tier === 'lite' || reduced();
    if (!window.gsap || reduced()) { window.setTimeout(finishOpen, 260); return; }
    const rise = lite ? 1.25 : 2.2;
    openTl = gsap.timeline({ onComplete: finishOpen });
    openTl.to('.intro__shade', { opacity: .18, duration: rise * .64, ease: 'power2.inOut' }, 0)
      .to('.intro__poster', { scale: 1.16, duration: rise, ease: 'power2.inOut' }, 0)
      .to({ rise: 0 }, { rise: 1.05, duration: rise, onUpdate() { sceneCameraRise = this.targets()[0].rise; }, ease: 'power2.inOut' }, 0)
      .to('.intro__copy', { yPercent: -12, opacity: 0, duration: .65, ease: 'power2.in' }, .15)
      .to('.intro .scene-canvas', { opacity: 1, duration: .55 }, .25)
      .to({}, { duration: lite ? .25 : .48, onStart: moveSceneToHero }, rise - .24);
  }
  openButton?.addEventListener('click', event => { event.stopPropagation(); beginOpen(); });
  intro?.addEventListener('click', () => { if (opening) finishOpen(); });

  function setupChoreography() {
    const sections = $$('[data-section]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-seen'); if (entry.target.id === 'hero') visible.hero = true; }
        else if (entry.target.id === 'hero') visible.hero = false;
      }), { threshold: .16 }); sections.forEach(section => observer.observe(section));
    }
    // The caravan lantern sits on the drawn route; scrolling moves it along the curve (it rests at the end without motion).
    const track = document.querySelector('.route-track'), lantern = document.querySelector('.route-lantern'), trackLength = track ? track.getTotalLength() : 0;
    const placeLantern = p => { if (!lantern || !trackLength) return; const pt = track.getPointAtLength(trackLength * p); lantern.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`); };
    placeLantern(1);
    if (!window.gsap || !window.ScrollTrigger || reduced()) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero__poster', { yPercent: 15, scale: 1.1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to({ value: 0 }, { value: 1.2, ease: 'none', onUpdate() { sceneScroll = this.targets()[0].value; }, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 } });
    gsap.to('.brass-tray', { rotateY: 5, rotateX: -2, y: -13, ease: 'none', scrollTrigger: { trigger: '#date', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.to('.route-track', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#program', start: 'top 75%', end: 'bottom 45%', scrub: .7 } });
    if (lantern) { placeLantern(0); ScrollTrigger.create({ trigger: '#program', start: 'top 78%', end: 'bottom 50%', onUpdate: self => placeLantern(self.progress) }); }
    gsap.to('.venue__frame', { rotateY: 3, y: -10, ease: 'none', scrollTrigger: { trigger: '#venue', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.to('.dresscode__palette li', { rotateY: 7, y: -7, stagger: .08, ease: 'none', scrollTrigger: { trigger: '#dresscode', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.to('.gallery__item', { rotateY: 0, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#gallery', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.to('.gift__box', { rotateY: 14, rotateX: -8, ease: 'none', scrollTrigger: { trigger: '#toyona', start: 'top bottom', end: 'center center', scrub: true } });
  }

  function setupEvents() {
    window.Marhamat?.on?.('rsvp', answer => {
      if (answer?.status !== 'yes' || reduced()) return;
      celebrateUntil = performance.now() + 1800;
      const burst = window.Marhamat?.tier === 'lite' ? 3 : 12;
      for (let i = 0; i < burst; i++) particles.push({ x: .18 + Math.random() * .64, y: .85 + Math.random() * .12, z: 0, r: 2 + Math.random() * 3, speed: .00023 + Math.random() * .00018, sway: Math.random() * 6.28, phase: Math.random() * 6.28, alpha: .9 });
      const mark = $('.rsvp__lantern');
      mark?.animate?.([{ transform: 'translateY(0) scale(.7)', opacity: .3 }, { transform: 'translateY(-27px) scale(1.2)', opacity: 1 }, { transform: 'translateY(-55px) scale(.8)', opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.18,.72,.25,1)' });
      startLoop();
    });
    window.Marhamat?.on?.('tier', () => { if (window.Marhamat.tier === 'lite') dropThree(); seedLanterns(); startLoop(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) pauseLoop(); else startLoop(); });
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.target === intro) visible.intro = e.isIntersecting;
      if (e.target === hero) visible.hero = e.isIntersecting;
      if (e.isIntersecting) startLoop();
    })); if (intro) io.observe(intro); if (hero) io.observe(hero);
  }

  function init() {
    seedLanterns(); resizeFallbacks(); setupChoreography(); setupEvents();
    if (window.gsap && !reduced()) {
      const pace = window.Marhamat?.tier === 'lite' ? .72 : 1;
      gsap.set('.intro__greeting,.intro__kicker,.intro__names,.intro__date,.open-button', { autoAlpha: 0, y: 13 });
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.intro__greeting', { autoAlpha: 1, y: 0, duration: .58 * pace }, .12)
        .to('.intro__kicker', { autoAlpha: 1, y: 0, duration: .48 * pace }, .44 * pace)
        .to('.intro__names', { autoAlpha: 1, y: 0, duration: .72 * pace }, .67 * pace)
        .to('.intro__date', { autoAlpha: 1, y: 0, duration: .5 * pace }, 1.04 * pace)
        .to('.open-button', { autoAlpha: 1, y: 0, duration: .62 * pace }, 1.35 * pace);
    }
    addEventListener('resize', resizeFallbacks, { passive: true });
    if (!reduced()) startLoop();
    if (window.Marhamat?.tier === 'full' && !reduced()) {
      const later = window.requestIdleCallback || (fn => setTimeout(fn, 340)); later(buildThree, { timeout: 1300 });
    }
    if (reduced()) document.documentElement.classList.add('is-fallback');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
