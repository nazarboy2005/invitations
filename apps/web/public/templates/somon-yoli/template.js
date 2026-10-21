(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = () => window.Marhamat?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = () => innerWidth < 700;
  const rand = (a, b) => a + Math.random() * (b - a);
  const state = { open: false, warping: false, forceFallback: false, scene: null, stopIntroStars: null };

  // Poster companion: a quiet, single-rAF star layer remains available without WebGL.
  function introStars() {
    const canvas = $('#intro-stars'); if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let w = 0, h = 0, raf = 0, last = 0;
    const stars = Array.from({ length: reduced() ? 0 : (window.Marhamat?.tier === 'lite' ? 15 : 60) }, () => ({ x: Math.random(), y: Math.random(), r: rand(.35, 1.5), a: rand(.2, .9), p: rand(0, 6.28), v: rand(.3, 1.4) }));
    const resize = () => { const d = Math.min(devicePixelRatio || 1, 1.5); w = innerWidth; h = innerHeight; canvas.width = w * d; canvas.height = h * d; canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; ctx.setTransform(d, 0, 0, d, 0, 0); };
    function draw(t) { raf = requestAnimationFrame(draw); if (document.hidden || t - last < 32) return; last = t; ctx.clearRect(0, 0, w, h); for (const s of stars) { const a = s.a * (.6 + .4 * Math.sin(t * .001 * s.v + s.p)); ctx.fillStyle = `rgba(243,215,154,${a})`; ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2); ctx.fill(); } }
    resize(); raf = requestAnimationFrame(draw); addEventListener('resize', resize, { passive: true });
    return () => cancelAnimationFrame(raf);
  }

  function installIntro() {
    const intro = $('#intro'), button = $('#open-invitation'); if (!intro || !button) return;
    state.stopIntroStars = introStars();
    const greet = $('.intro__greeting');
    const animateArrival = () => {
      if (reduced() || !window.gsap) { intro.classList.add('is-ready'); return; }
      const chars = [];
      $$('.intro__content .eyebrow,.intro__greeting,.intro__names span,.intro__names em,.intro__date,.intro__motto').forEach(el => {
        if (el.matches('.intro__names span') && el.children.length) return;
        if (el.dataset.split) return;
        el.dataset.split = '1';
        const original = el.textContent; el.textContent = '';
        for (const char of original) { const span = document.createElement('span'); span.textContent = char === ' ' ? '\u00a0' : char; span.style.display = 'inline-block'; el.append(span); chars.push(span); }
      });
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.intro__seal', { scale: .4, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .8 }, .1)
        .fromTo('.intro .eyebrow', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, .25)
        .fromTo(greet, { opacity: 0, y: 9 }, { opacity: 1, y: 0, duration: .65 }, .4)
        .fromTo('.intro__names span,.intro__names em', { y: 30, opacity: 0, rotation: 8 }, { y: 0, opacity: 1, rotation: 0, duration: .8, stagger: .025, ease: 'back.out(1.35)' }, .58)
        .fromTo('.intro__date,.intro__motto', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .65, stagger: .16 }, 1.0)
        .fromTo(button, { scale: .7, opacity: 0 }, { scale: 1, opacity: 1, duration: .75, ease: 'back.out(1.5)' }, 1.42)
        .fromTo('.intro__hint', { opacity: 0 }, { opacity: .75, duration: .6 }, 1.78);
      tl.eventCallback('onComplete', () => intro.classList.add('is-ready'));
    };
    requestAnimationFrame(() => setTimeout(animateArrival, 120));
    function finish() {
      clearTimeout(state.warpTimer); state.warping = false; state.open = true; state.stopIntroStars?.(); state.scene?.reveal?.();
      intro.hidden = true; document.documentElement.classList.remove('is-locked'); document.body.classList.remove('is-opening'); document.body.classList.add('is-open');
      $('#page')?.scrollIntoView({ block: 'start', behavior: 'auto' }); window.ScrollTrigger?.refresh();
      state.scene?.release?.();
    }
    button.addEventListener('click', e => {
      e.stopPropagation();
      if (state.warping) { finish(); return; }
      if (state.open) return;
      state.warping = true; window.Marhamat?.open?.(); document.body.classList.add('is-opening');
      if (state.scene) state.scene.warp.value = 1;
      const duration = reduced() || window.Marhamat?.tier === 'lite' ? 1200 : 2750;
      intro.classList.add('is-warping');
      setTimeout(() => intro.classList.add('is-flash'), Math.max(350, duration * .58));
      state.warpTimer = setTimeout(finish, duration);
    });
    intro.addEventListener('click', () => { if (state.warping) finish(); });
  }

  function drawFallbackConstellation() {
    const host = $('.hero__constellation'), label = $('.hero__names'); if (!host || !label || host.childElementCount) return;
    const text = label.textContent.replace(/\s+/g, ' ').trim(), canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 260;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const style = getComputedStyle(label); let size = 74; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
    do { ctx.font = `400 ${size}px ${style.fontFamily}`; if (ctx.measureText(text).width <= 940) break; size -= 3; } while (size > 32);
    ctx.fillText(text, 500, 130); const pixels = ctx.getImageData(0, 0, 1000, 260).data, samples = [];
    for (let y = 24; y < 236; y += 3) for (let x = 30; x < 970; x += 3) if (pixels[(y * 1000 + x) * 4 + 3] > 160) samples.push([x, y]);
    if (!samples.length) return; const every = Math.max(1, Math.ceil(samples.length / 68)), pts = samples.filter((_, i) => i % every === 0);
    host.replaceChildren(); const NS = 'http://www.w3.org/2000/svg';
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], d = Math.hypot(a[0]-b[0],a[1]-b[1]); if (d > 1 && d < 24) { const line = document.createElementNS(NS, 'line'); line.setAttribute('x1',a[0]);line.setAttribute('y1',a[1]);line.setAttribute('x2',b[0]);line.setAttribute('y2',b[1]);line.setAttribute('pathLength','1');line.setAttribute('stroke-dasharray','1');line.setAttribute('stroke-dashoffset','1');host.append(line); } }
    pts.forEach(([x,y], i) => { const dot = document.createElementNS(NS, 'circle'); dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r',i%6===0?3.2:1.8);host.append(dot); });
    if (!reduced() && window.gsap && window.DrawSVGPlugin) { gsap.registerPlugin(DrawSVGPlugin); gsap.fromTo(host.querySelectorAll('line'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, stagger: .018, ease: 'power2.inOut' }); }
  }

  function drawFallback() {
    const canvas = $('#space-canvas'), ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; $('.space-backdrop')?.classList.add('is-fallback'); drawFallbackConstellation();
    const stars = Array.from({ length: reduced() ? 0 : (window.Marhamat?.tier === 'lite' ? 15 : 55) }, () => ({ x: Math.random(), y: Math.random(), r: rand(.4, 1.8), a: rand(.25, .8), speed: rand(.4, 2), layer: rand(.3, 1) }));
    let w = 0, h = 0, raf = 0, last = 0, active = true, scroll = 0;
    const resize = () => { const d = Math.min(devicePixelRatio || 1, window.Marhamat?.tier === 'lite' ? 1 : 1.5); w = innerWidth; h = innerHeight; canvas.width = w * d; canvas.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const observer = new IntersectionObserver(es => active = es[0].isIntersecting); observer.observe(canvas);
    function draw(t) { raf = requestAnimationFrame(draw); if (!active || document.hidden || t - last < 40) return; last = t; ctx.clearRect(0, 0, w, h); for (const s of stars) { const x = (s.x * w + Math.sin(t * .00008 * s.speed) * 25 * s.layer + w) % w; const y = (s.y * h + scroll * s.layer * .12 + h) % h; ctx.globalAlpha = s.a * (.72 + .28 * Math.sin(t * .002 * s.speed)); ctx.fillStyle = s.layer > .75 ? '#f3d79a' : '#9fd8ff'; ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
    resize(); raf = requestAnimationFrame(draw); addEventListener('resize', resize, { passive: true }); addEventListener('scroll', () => scroll = scrollY, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(draw); });
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }

  function loadThree() {
    if (state.forceFallback || reduced() || window.Marhamat?.tier !== 'full' || !window.WebGLRenderingContext) { drawFallback(); return; }
    const script = document.createElement('script'); script.src = '../shared/nikoh/vendor/three/three.bundle.min.js'; script.async = true;
    script.onload = () => { try { if (!window.THREE) throw Error('Three unavailable'); initThree(window.THREE); } catch (e) { console.warn('Somon Yo‘li using 2D fallback', e); drawFallback(); } };
    script.onerror = () => drawFallback();
    const add = () => document.head.append(script);
    if ('requestIdleCallback' in window) requestIdleCallback(add, { timeout: 1800 }); else setTimeout(add, 700);
  }

  function initThree(THREE) {
    const canvas = $('#space-canvas'), host = $('.space-backdrop');
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' }); }
    catch (_) { drawFallback(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace || renderer.outputColorSpace;
    if (THREE.ACESFilmicToneMapping) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.04; }
    const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x080916, .0025);
    const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, .1, 1200); camera.position.set(0, 0, 115);
    const root = new THREE.Group(); scene.add(root);
    const count = innerWidth < 400 || (navigator.deviceMemory || 4) <= 4 ? 25000 : 60000;
    const pos = new Float32Array(count * 3), colors = new Float32Array(count * 3), radius = new Float32Array(count), phase = new Float32Array(count);
    const cCore = new THREE.Color('#F3D79A'), cRose = new THREE.Color('#C76B98'), cEdge = new THREE.Color('#9FD8FF');
    for (let i = 0; i < count; i++) {
      const arm = i % 4, r = Math.pow(Math.random(), .63) * 104, spin = r * .076, angle = arm * Math.PI / 2 + spin + rand(-.31, .31) * (1 + r / 25);
      const scatter = Math.pow(Math.random(), 2) * (4 + r * .055);
      pos[i * 3] = Math.cos(angle) * r + rand(-scatter, scatter); pos[i * 3 + 1] = Math.sin(angle) * r * .67 + rand(-scatter, scatter); pos[i * 3 + 2] = rand(-18, 18) * (1 - r / 130);
      radius[i] = r / 104; phase[i] = Math.random() * Math.PI * 2;
      const col = r < 25 ? cCore.clone().lerp(cRose, r / 35) : cRose.clone().lerp(cEdge, (r - 25) / 80); colors.set([col.r, col.g, col.b], i * 3);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(colors, 3)); geo.setAttribute('aRadius', new THREE.BufferAttribute(radius, 1)); geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    const starMat = new THREE.ShaderMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uTime: { value: 0 }, uWarp: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() } }, vertexShader: `attribute float aRadius; attribute float aPhase; varying vec3 vColor; varying float vAlpha; uniform float uTime; uniform float uWarp; uniform float uPixelRatio; void main(){ vec3 p=position; float rot=uTime*(.23+(1.0-aRadius)*.62); float cs=cos(rot), sn=sin(rot); p.xy=mat2(cs,-sn,sn,cs)*p.xy; vec4 mv=modelViewMatrix*vec4(p,1.0); float tw=.66+.34*sin(uTime*2.0+aPhase); gl_PointSize=clamp((1.1+2.0*(1.0-aRadius))*tw*uPixelRatio*(1.0+uWarp*3.0)/(0.15+(-mv.z)*.008),.7,8.0); gl_Position=projectionMatrix*mv; vColor=color; vAlpha=tw; }`, fragmentShader: `varying vec3 vColor; varying float vAlpha; uniform float uWarp; void main(){ vec2 q=gl_PointCoord-.5; float d=length(q); float glow=exp(-d*d*19.0); float core=1.0-smoothstep(.08,.5,d); float streak=1.0-smoothstep(.02,.49,length(vec2(q.x,q.y*(1.0+uWarp*22.0)))); gl_FragColor=vec4(vColor*(.65+glow*1.8), (core*.7+glow*.42)*vAlpha*mix(1.0,streak,uWarp)); }` });
    const points = new THREE.Points(geo, starMat); root.add(points);

    // The three evolving gas sheets use a compact procedural value-noise shader.
    const nebulaMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uTime: { value: 0 }, uTint: { value: new THREE.Color('#682e83') } }, vertexShader: 'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}', fragmentShader: `varying vec2 vUv; uniform float uTime; uniform vec3 uTint; float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);} float fbm(vec2 p){float v=0.0,a=.5; for(int i=0;i<4;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;} void main(){vec2 p=(vUv-.5)*2.0; float f=fbm(p*3.0+vec2(uTime*.025,-uTime*.016)); float cloud=smoothstep(.37,.82,f)*1.0-smoothstep(.04,1.0,length(p)); gl_FragColor=vec4(uTint,cloud*.19);}` });
    const nebulaGroup = new THREE.Group(); root.add(nebulaGroup);
    for (let i = 0; i < 3; i++) { const m = nebulaMat.clone(); m.uniforms.uTint.value = new THREE.Color(['#713e91', '#9a456f', '#274e87'][i]); const plane = new THREE.Mesh(new THREE.PlaneGeometry(145 + i * 22, 98 + i * 13), m); plane.position.set(rand(-30, 30), rand(-18, 18), -35 - i * 16); plane.rotation.z = rand(-.5, .5); nebulaGroup.add(plane); }

    const rings = new THREE.Group(); rings.position.set(0, 0, 1); rings.scale.setScalar(.015); scene.add(rings);
    const gold = new THREE.MeshBasicMaterial({ color: 0xd4ad63, transparent: true, opacity: .54, blending: THREE.AdditiveBlending, depthWrite: false });
    const ringMeshes = [];
    for (let i = 0; i < 3; i++) { const radius = 13 + i * 5; const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .055, 4, 220), gold.clone()); ring.rotation.set(.25 + i * .72, .2 + i * .38, i * .3); rings.add(ring); ringMeshes.push(ring); const tickPos=[]; for(let k=0;k<120;k++){const a=k*Math.PI*2/120,len=k%10===0?1.05:.38, r0=radius+.12,r1=radius-len;tickPos.push(Math.cos(a)*r0,Math.sin(a)*r0,0,Math.cos(a)*r1,Math.sin(a)*r1,0);} const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.Float32BufferAttribute(tickPos,3));const tm=new THREE.LineSegments(tg,gold.clone());tm.rotation.copy(ring.rotation);rings.add(tm); }

    // Sample the actual translated Cyrillic/Latin names and connect their bright points.
    const named = new THREE.Group(); named.position.z = 2; scene.add(named);
    const lines = [];
    const data = window.Marhamat?.data || window.INVITATION || {};
    const names = [data.i18n?.[window.Marhamat?.lang]?.groom || data.groom || '', data.i18n?.[window.Marhamat?.lang]?.bride || data.bride || ''];
    function letterCloud(str, cx, cy) {
      const c = document.createElement('canvas'), ctx = c.getContext('2d'); c.width = 720; c.height = 150; ctx.fillStyle = '#fff'; ctx.font = '56px Georgia,serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(str, 360, 75);
      const pixels = ctx.getImageData(0, 0, c.width, c.height).data, candidates = [];
      for (let y = 8; y < 142; y += 3) for (let x = 15; x < 705; x += 3) if (pixels[(y * c.width + x) * 4 + 3] > 100) candidates.push([x, y]);
      const points = [];
      if (candidates.length) { const step = Math.max(1, Math.floor(candidates.length / 68)); for (let i = 0; i < candidates.length; i += step) points.push(candidates[i]); }
      points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const scale = Math.min(34 / Math.max(ctx.measureText(str).width / c.width, .35), 1.5);
      return points.map(([x, y]) => new THREE.Vector3(cx + (x - 360) / 56 * scale, cy - (y - 75) / 56 * scale, rand(-.2, .2)));
    }
    const cloud1 = letterCloud(names[0], -18, 4), cloud2 = letterCloud(names[1], 18, 4);
    const ampPair = [new THREE.Vector3(-.6, -2.8, 0), new THREE.Vector3(.6, -2.8, 0)];
    [cloud1, cloud2].forEach((arr, idx) => {
      const pg = new THREE.BufferGeometry().setFromPoints(arr); const pm = new THREE.PointsMaterial({ color: idx ? 0xffe8b1 : 0xb5deff, size: .55, transparent: true, opacity: .92, sizeAttenuation: true, blending: THREE.AdditiveBlending }); const ps = new THREE.Points(pg, pm); named.add(ps);
      const lv = []; for (let i = 0; i < arr.length - 1; i++) { lv.push(arr[i], arr[i + 1]); }
      const lg = new THREE.BufferGeometry().setFromPoints(lv), revealAttr = new Float32Array(lv.length); for(let j=0;j<lv.length;j++) revealAttr[j]=Math.floor(j/2)/Math.max(1,lv.length/2); lg.setAttribute('aReveal',new THREE.BufferAttribute(revealAttr,1)); const lm = new THREE.ShaderMaterial({ transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uReveal:{value:0}},vertexShader:'attribute float aReveal; varying float vReveal; void main(){vReveal=aReveal; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform float uReveal; varying float vReveal; void main(){float a=1.0-smoothstep(uReveal-.035,uReveal,vReveal); gl_FragColor=vec4(.95,.82,.56,a*.48);}' });
      const line = new THREE.LineSegments(lg, lm); line.geometry.setDrawRange(0, lv.length); named.add(line); lines.push({ line, material:lm, total: lv.length });
      const glow = new THREE.Points(pg.clone(), new THREE.PointsMaterial({ color: idx ? 0xc0e8ff : 0xffe7b1, size: 1.7, transparent: true, opacity: .25, blending: THREE.AdditiveBlending })); named.add(glow);
    });
    const binaryGeom = new THREE.BufferGeometry().setFromPoints(ampPair); const binary = new THREE.Points(binaryGeom, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, blending: THREE.AdditiveBlending })); named.add(binary);

    let composer = null;
    try { if (THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass && THREE.Vector2) { composer = new THREE.EffectComposer(renderer); composer.addPass(new THREE.RenderPass(scene, camera)); composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), .45, .65, .82)); if (THREE.OutputPass) composer.addPass(new THREE.OutputPass()); } } catch (_) { composer = null; }
    const route = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 70), new THREE.Vector3(-8, 3, 48), new THREE.Vector3(10, -4, 30), new THREE.Vector3(0, 0, 18), new THREE.Vector3(-4, 3, 88)]);
    let progress = 0, targetProgress = 0, openingReveal = 0, active = false, raf = 0, last = 0, frameN = 0, fpsAt = performance.now(), lowFps = 0;
    const warp = starMat.uniforms.uWarp;
    const io = new IntersectionObserver(e => { active = e[0].isIntersecting; if (active && !document.hidden) raf = requestAnimationFrame(draw); }); io.observe(host);
    function resize() { const d = Math.min(devicePixelRatio || 1, 1.5); renderer.setPixelRatio(d); renderer.setSize(innerWidth, innerHeight, false); if (composer) composer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
    function draw(t) {
      if (!active || document.hidden || state.forceFallback) return;
      raf = requestAnimationFrame(draw); if (t - last < 15) return; const dt = Math.min((t - last) / 1000, .05); last = t;
      starMat.uniforms.uTime.value = t * .001; nebulaGroup.children.forEach(m => m.material.uniforms.uTime.value = t * .001); progress += (targetProgress - progress) * .06;
      const p = route.getPointAt(Math.min(.999, Math.max(.001, progress * .95 + .025))); p.lerp(new THREE.Vector3(0,0,18),warp.value); const look = route.getPointAt(Math.min(.999, progress * .95 + .04)); camera.position.lerp(p, .06); camera.lookAt(look);
      root.rotation.z = Math.sin(t * .00011) * .06 + progress * .25; ringMeshes.forEach((r, i) => { r.rotation.z += dt * (i % 2 ? -.05 : .08); r.rotation.x += dt * .025; }); binary.rotation.z += dt * 1.2;
      lines.forEach(l => { l.material.uniforms.uReveal.value = Math.min(1,Math.max(openingReveal,(progress-.08)*3.2)); });
      if (composer) composer.render(); else renderer.render(scene, camera);
      frameN++; if (t - fpsAt > 1600) { const fps = frameN * 1000 / (t - fpsAt); frameN = 0; fpsAt = t; if (fps < 45) lowFps++; else lowFps = 0; if (lowFps >= 2) switchFallback(); }
    }
    function switchFallback() { if (state.forceFallback) return; state.forceFallback = true; cancelAnimationFrame(raf); io.disconnect(); renderer.dispose(); host.classList.remove('is-live'); state.scene = null; drawFallback(); }
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); switchFallback(); }, { passive: false });
    addEventListener('resize', resize, { passive: true }); document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (active) raf = requestAnimationFrame(draw); });
    addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - innerHeight; targetProgress = max > 0 ? scrollY / max : 0; }, { passive: true });
    window.Marhamat?.on?.('tier', e => { if (e?.tier === 'lite' || window.Marhamat.tier === 'lite') switchFallback(); });
    host.classList.add('is-live'); host.classList.remove('is-fallback'); state.scene = { warp, switchFallback, reveal: () => { if (window.gsap) { gsap.to(rings.scale, { x: 1, y: 1, z: 1, duration: 1.1, ease: 'back.out(1.2)' }); gsap.to({ value: openingReveal }, { value: 1, duration: 1.2, ease: 'power2.inOut', onUpdate() { openingReveal = this.targets()[0].value; } }); } else { rings.scale.setScalar(1); openingReveal = 1; } }, release: () => { if(window.gsap) gsap.to(warp,{value:0,duration:.8,ease:'power2.out'}); else warp.value=0; }, addGuestStar: () => { const p = new THREE.Vector3(rand(-23,23),rand(-7,11),2); const g = new THREE.BufferGeometry().setFromPoints([p]); const star = new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:3.2,transparent:true,blending:THREE.AdditiveBlending})); named.add(star); } };
    // A restrained meteor passes periodically on full tier only.
    const meteor = document.createElement('i'); meteor.className = 'shooting-star'; meteor.setAttribute('aria-hidden', 'true'); document.body.append(meteor);
    const shoot = () => { if (!active || document.hidden || state.forceFallback || window.Marhamat?.tier !== 'full') return; meteor.animate([{ transform: 'translate3d(110vw,-5vh,0) rotate(-28deg)', opacity: 0 }, { opacity: .9, offset: .12 }, { transform: 'translate3d(-40vw,45vh,0) rotate(-28deg)', opacity: 0 }], { duration: 1050, easing: 'ease-out' }); setTimeout(shoot, 7600 + Math.random() * 2200); }; setTimeout(shoot, 4200);
    resize(); active = true; raf = requestAnimationFrame(draw); if (state.open) state.scene.reveal();
  }

  function choreography() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = reduced();
    if (reduce) return;
    const split = el => {
      if (!el || el.dataset.motionSplit) return [];
      el.dataset.motionSplit = '1'; const text = el.textContent; el.textContent = '';
      return [...text].map(ch => { const s = document.createElement('span'); s.textContent = ch === ' ' ? '\u00a0' : ch; s.style.display = 'inline-block'; el.append(s); return s; });
    };
    $$('.section__title').forEach((h, i) => {
      const chars = split(h), modes = [ { y: 24, rotation: 8 }, { x: -26, opacity: 0 }, { scale: .65, rotation: -12 }, { y: -20, opacity: 0 }, { rotationX: 80, opacity: 0 }, { x: 24, opacity: 0 } ];
      gsap.fromTo(chars, modes[i % modes.length], { x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, opacity: 1, stagger: .018, duration: .72, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
    });
    // Six independently scrubbed celestial instruments; three drive the camera / field.
    gsap.to({}, { scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => { if (state.scene) window.Marhamat?.emit?.('sceneprogress', { value: s.progress * .24 }); } } });
    gsap.fromTo('.hero__orbit', { rotation: -18, scale: .82 }, { rotation: 24, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.date-astrolabe', { rotation: 125, ease: 'none', scrollTrigger: { trigger: '#date', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('.orbit-map', { rotation: 260, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '#program', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.venue__portal', { clipPath: 'circle(14% at 50% 50%)', scale: .92 }, { clipPath: 'circle(72% at 50% 50%)', scale: 1, ease: 'none', scrollTrigger: { trigger: '#venue', start: 'top 75%', end: 'top 30%', scrub: true } });
    gsap.to('.dresscode__palette li', { rotationY: 360, y: -5, stagger: .08, ease: 'none', scrollTrigger: { trigger: '#dresscode', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.to('.gallery__item', { y: (i) => i % 2 ? -18 : 14, rotation: i => i % 2 ? 2 : -2, stagger: .08, ease: 'none', scrollTrigger: { trigger: '#gallery', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('.footer__galaxy img', { yPercent: -13, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '#footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    $$('.section').forEach(sec => {
      const children = [...sec.children].filter(el => el.matches('.message,.countdown,.program,.venue__portal,.dresscode,.gallery__frame,.wishes,.gift,.contacts,.signature,.rsvp__fields'));
      if (children.length) gsap.fromTo(children, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .68, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 76%', once: true } });
    });
    $('#venue')?.addEventListener('focusin', () => $('.venue__portal')?.classList.add('is-open'));
    ScrollTrigger.create({ trigger: '#venue', start: 'top 75%', once: true, onEnter: () => $('.venue__portal')?.classList.add('is-open') });
    const comet = document.createElement('i'); comet.className = 'comet'; comet.setAttribute('aria-hidden', 'true'); $('.program-section')?.append(comet);
    gsap.fromTo(comet, { xPercent: -200, y: 4, opacity: 0 }, { xPercent: 250, y: -4, opacity: 1, ease: 'none', scrollTrigger: { trigger: '#program', start: 'top 75%', end: 'bottom 25%', scrub: true } });
    $$('.program__item').forEach((el, i) => gsap.fromTo(el, { x: i % 2 ? 24 : -24, opacity: 0 }, { x: 0, opacity: 1, duration: .62, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
    $$('.wishes__item').forEach((el, i) => gsap.fromTo(el, { scale: .9, x: i % 2 ? 20 : -20, opacity: 0 }, { scale: 1, x: 0, opacity: 1, duration: .7, ease: 'back.out(1.2)', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    window.Marhamat?.on?.('rsvp', a => { if (a?.status === 'yes') { const star = $('.rsvp__done .ornament'); star?.animate([{ transform: 'scale(.4) rotate(-40deg)', opacity: .3 }, { transform: 'scale(1.45) rotate(20deg)', opacity: 1 }, { transform: 'scale(1) rotate(0)' }], { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)' }); const button = $('[data-rsvp-choice="yes"]'), hero = $('#hero'), meteor = document.createElement('i'); if (button && hero) { const a=button.getBoundingClientRect(),b=hero.getBoundingClientRect(); meteor.className='rsvp-meteor';document.body.append(meteor);meteor.style.left=(a.left+a.width/2)+'px';meteor.style.top=(a.top+a.height/2)+'px';const dx=b.left+b.width/2-a.left-a.width/2,dy=b.top+b.height/2-a.top-a.height/2;meteor.animate([{transform:'translate(0,0) rotate(-28deg)',opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(-28deg)`,opacity:0}],{duration:1100,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>{meteor.remove();const svg=$('.hero__constellation');if(svg){const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('cx',String(rand(150,850)));dot.setAttribute('cy',String(rand(55,205)));dot.setAttribute('r','5');svg.append(dot);}state.scene?.addGuestStar?.();}; } } });
    $$('.countdown [data-unit]').forEach(el => { let prev=el.textContent; new MutationObserver(() => { if(el.textContent===prev)return; prev=el.textContent; gsap.fromTo(el,{yPercent:45,opacity:.35},{yPercent:0,opacity:1,duration:.32,ease:'power2.out'}); }).observe(el,{childList:true,characterData:true,subtree:true}); });
    window.Marhamat?.on?.('wish', () => { const last = $('.wishes__item:last-child'); if (last) gsap.fromTo(last, { scale: .8, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, ease: 'back.out(1.5)' }); });
    addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  function init() {
    installIntro(); choreography();
    if (window.Marhamat?.tier !== 'full') drawFallback();
    window.Marhamat?.on?.('open', () => { if (window.Marhamat.tier === 'full' && !state.scene) loadThree(); });
    const music = $('[data-music-toggle]'); music?.addEventListener('click', () => music.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 240 }));
    document.addEventListener('pointermove', e => { if (reduced() || !mobile()) return; const x = (e.clientX / innerWidth - .5) * 2, y = (e.clientY / innerHeight - .5) * 2; document.documentElement.style.setProperty('--pointer-x', (x*8).toFixed(1)+'px'); document.documentElement.style.setProperty('--pointer-y', (y*7).toFixed(1)+'px'); }, { passive: true });
    window.Marhamat?.on?.('ready', () => { if ($('.hero__names')) $('.hero__names').setAttribute('aria-label', `${window.Marhamat.data.groom} & ${window.Marhamat.data.bride}`); });
  }
  if (window.Marhamat?.on) window.Marhamat.on('ready', init); else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
