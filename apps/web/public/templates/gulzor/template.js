(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const ART = {
    aisle: { width: 900, height: 1350, arch: { x: .51, y: .39 }, runner: { x: .5, y: .78 }, sign: { x: .8, y: .3 } },
    suite: { width: 900, height: 1350, card: { x: .51, y: .52, w: .55, h: .54 }, rings: { x: .18, y: .14 } },
    finale: { width: 900, height: 1350, bulbs: [[.328,.202],[.441,.216],[.554,.226],[.666,.233],[.776,.237],[.882,.237],[.987,.234]], candles: [[.187,.55],[.248,.54],[.333,.55],[.358,.54],[.562,.55],[.621,.56],[.904,.577]] }
  };
  const app = window.Marhamat;
  if (!app) return;

  app.on('ready', () => {
    const intro = $('#intro'), page = $('#page'), hero = $('#hero'), skip = $('#skip-intro');
    const button = $('#open-invitation'), poster = $('.intro__poster'), webglCanvas = $('.walk-scene');
    const reduced = !!app.reducedMotion;
    let lite = app.tier === 'lite' || reduced;
    let walkStarted = 0;
    let opened = false, opening = false, pointerId = null, renderer = null, threeState = null, master = null, signIdle = null;
    const gsap = window.gsap;
    const data = app.data || {};
    const names = [data.groom, data.bride].filter(Boolean).join(' & ');
    if (names) document.title = `${names} · Toscana`;
    const meta = $('meta[name="description"]');
    if (meta) meta.content = [names, data.eventType, data.date?.long, data.venue?.name].filter(Boolean).join(' · ');
    if (data.rsvp?.enabled === false) $('#rsvp').hidden = true;
    if (data.toyona?.enabled === false) $('#toyona').hidden = true;
    const monogram = $('[data-monogram]');
    if (monogram) monogram.textContent = `${String(data.groom || 'J').slice(0, 1)} · ${String(data.bride || 'M').slice(0, 1)}`;
    const initials = [data.groom, data.bride].map(name => String(name || '').trim().charAt(0)).join('') || 'M';
    $$('[data-seal]').forEach(node => { node.textContent = initials; });

    /* An olive-sprig fleuron: two stems grow out of a bud, leaves open along them. */
    const LEAVES = [[68,11.2,-152],[60,10.4,150],[51,9.4,-158],[43,9,156],[34,9.2,-163],[25,10.1,162],[16,11.2,-168]];
    const leafPath = 'M0 0Q4.6-2.6 9.4 0Q4.6 2.6 0 0Z';
    const half = `<path class="stem" d="M80 12C66 12 52 7.5 36 9S13 14 3 12"/>${LEAVES.map(([x,y,a])=>`<g transform="translate(${x} ${y}) rotate(${a})"><path class="leaf" d="${leafPath}"/></g>`).join('')}`;
    const FLEURON = `<svg class="fleuron" viewBox="0 0 160 24" aria-hidden="true" focusable="false"><g class="fleuron__l">${half}</g><g class="fleuron__r" transform="matrix(-1 0 0 1 160 0)">${half}</g><circle class="bud" cx="80" cy="12" r="2.1"/><circle class="bud-ring" cx="80" cy="12" r="4.4"/></svg>`;
    function fleuron(after) { after.insertAdjacentHTML('afterend', FLEURON); return after.nextElementSibling; }
    function drawFleuron(svg) {
      const stems = $$('.stem', svg), bud = $$('.bud,.bud-ring', svg);
      const left = $$('.fleuron__l .leaf', svg), right = $$('.fleuron__r .leaf', svg);
      const leaves = left.flatMap((leaf, i) => [leaf, right[i]]);
      stems.forEach(path => { const length = path.getTotalLength(); path.style.strokeDasharray = length; path.style.strokeDashoffset = length; });
      return gsap.timeline()
        .fromTo(bud, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: '50% 50%', duration: .6, stagger: .12, ease: 'back.out(2.2)' }, 0)
        .to(stems, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, .15)
        .fromTo(leaves, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: '0% 50%', duration: .55, stagger: .07, ease: 'back.out(1.8)' }, .35);
    }
    const heroFleuron = fleuron($('.hero__names'));

    function fit() {
      const nameNodes = $$('.hero__names, .welcome-sign__names');
      nameNodes.forEach(node => {
        node.style.fontSize = ''; node.classList.remove('is-stacked');
        const heroNames = node.classList.contains('hero__names');
        const spans = [...node.children].filter(child => child.tagName === 'SPAN');
        const range = document.createRange();
        const textWidth = span => { range.selectNodeContents(span); return range.getBoundingClientRect().width; };
        const overflows = () => node.scrollWidth > node.clientWidth + 1 || spans.some(span => textWidth(span) > span.clientWidth - 2);
        const shrink = (size, floor) => { node.style.fontSize = `${size}px`; while (overflows() && size > floor) { size -= 1; node.style.fontSize = `${size}px`; } };
        spans.forEach(span => { span.style.whiteSpace = 'nowrap'; });
        // Only ever shrink from the designed size; very long names stack on two lines instead of breaking.
        shrink(Math.floor(parseFloat(getComputedStyle(node).fontSize)), heroNames ? 34 : 14);
        if (heroNames && overflows()) { node.classList.add('is-stacked'); shrink(Math.min(54, Math.floor(innerWidth * .135)), 24); }
        spans.forEach(span => { span.style.whiteSpace = ''; });
      });
      const guest = $('.welcome-sign__guest');
      if (guest) { let size = 12; guest.style.fontSize = ''; while (guest.scrollWidth > guest.clientWidth && size > 8) { size -= .5; guest.style.fontSize = `${size}px`; } }
    }
    function coverPoint(image, box, anchor, positionY=.5) {
      const scale=Math.max(box.clientWidth/image.width,box.clientHeight/image.height);
      return {x:anchor[0]*image.width*scale+(box.clientWidth-image.width*scale)*.5,y:anchor[1]*image.height*scale+(box.clientHeight-image.height*scale)*positionY};
    }
    const finale=$('.finale');
    ART.finale.candles.forEach((anchor,i)=>{const flame=document.createElement('i');flame.className='finale__flame';flame.style.setProperty('--phase',`${i*.21}s`);flame.setAttribute('aria-hidden','true');finale.append(flame);});
    function layoutAnchors(){
      const place=(selector,points)=>$$(selector).forEach((node,i)=>{const point=coverPoint(ART.finale,finale,points[i],.57);node.style.left=`${point.x}px`;node.style.top=`${point.y}px`;});
      place('.finale__bulbs i',ART.finale.bulbs);place('.finale__flame',ART.finale.candles);
    }
    layoutAnchors(); new ResizeObserver(layoutAnchors).observe(finale);
    const archCopy=$('.hero__copy').cloneNode(true);archCopy.classList.add('intro__arch-copy');intro.append(archCopy);
    const bloom=document.createElement('div');bloom.className='intro__bloom';bloom.setAttribute('aria-hidden','true');$('.intro__arch').after(bloom);
    $$('.hero__names>span',archCopy).forEach(name=>{const letters=Array.from(name.textContent);name.textContent='';letters.forEach(letter=>{const span=document.createElement('i');span.className='ink-letter';span.textContent=letter;name.append(span);});});
    fit(); addEventListener('resize', fit, { passive: true }); document.fonts?.ready.then(fit);
    let arrive = null;
    if (!reduced && gsap) {
      arrive = gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(poster, { scale: 1.16 }, { scale: 1.055, duration: 2.8 }, 0)
        .from('.intro__sun', { opacity: 0, duration: 2.4, ease: 'sine.out' }, .15)
        .from('.welcome-sign', { y: -54, rotation: 10, opacity: 0, duration: 1.6, ease: 'back.out(1.2)' }, .4)
        .from('.welcome-sign > :not(.welcome-sign__easel)', { opacity: 0, y: 9, duration: .9, stagger: .1, ease: 'power2.out' }, .95)
        .from('.intro__kicker', { opacity: 0, y: 12, letterSpacing: '.5em', duration: 1.4 }, 1.25)
        .from('.seal', { scale: .3, rotation: -40, opacity: 0, duration: 1.2, ease: 'back.out(1.7)' }, 1.45)
        .from('.enter-cue__label, .intro__swipe', { opacity: 0, y: 10, duration: .9, stagger: .12 }, 1.7);
      signIdle = gsap.to('.welcome-sign', { y: -3, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.1 });
    }

    /* Poster paints immediately; Three.js is requested only after that first frame, on full tier. */
    function supportsWebGL() {
      try { const probe=document.createElement('canvas'); return !!(probe.getContext('webgl2')||probe.getContext('webgl')); }
      catch (_) { return false; }
    }
    function loadThree() {
      if (lite || reduced || window.THREE || document.querySelector('[data-toscana-three]')) return;
      if (!supportsWebGL()) { lite=true; intro.classList.add('is-css-walk'); return; }
      const script = document.createElement('script'); script.src = '../shared/nikoh/vendor/three/three.bundle.min.js'; script.defer = true; script.dataset.toscanaThree = '';
      script.onload = () => { if (opened || !window.THREE) return; initThree(); };
      script.onerror = () => intro.classList.add('is-css-walk'); document.head.append(script);
    }
    function initThree() {
      const THREE = window.THREE;
      if (!supportsWebGL()) { lite=true; intro.classList.add('is-css-walk'); return; }
      try {
        renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); renderer.setSize(intro.clientWidth, intro.clientHeight, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, intro.clientWidth / intro.clientHeight, .1, 100);
        camera.position.set(0, 0, 0); camera.lookAt(0, 0, -12);
        const aisle = window.ToscanaAisle({THREE,renderer,scene,camera,width:intro.clientWidth,height:intro.clientHeight});
        aisle.ready.then(()=>{if(!opened)intro.classList.add('has-depth');}).catch(()=>intro.classList.add('is-css-walk'));

        const petals = [];
        const geometry = new THREE.PlaneGeometry(.075,.12);
        const atlas = new THREE.TextureLoader().load('art/petals.webp',()=>petalTextures.forEach(t=>{t.image=atlas.image;t.needsUpdate=true;})); atlas.colorSpace = THREE.SRGBColorSpace;
        const petalTextures = Array.from({length:8},(_,i)=>{const t=atlas.clone();t.repeat.set(.25,.5);t.offset.set((i%4)*.25,i<4?.5:0);return t;});
        // A shared image supplies eight genuinely different photographed petals.
        const materials = petalTextures.map(map=>new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide,transparent:true,opacity:.95,depthWrite:false}));
        for (let i = 0; i < 40; i++) {
          const mesh = new THREE.Mesh(geometry, materials[i % materials.length]);
          const side=i%2?1:-1;
          mesh.position.set(side*(2+Math.random()),-.2+Math.random()*2,-5.5-Math.random()*5);
          mesh.scale.setScalar(.65+Math.random()*.9); mesh.rotation.set(Math.random()*2,Math.random()*2,Math.random()*6);
          mesh.renderOrder=30; scene.add(mesh); petals.push({mesh,x:mesh.position.x,y:mesh.position.y,z:mesh.position.z,phase:Math.random()*9,speed:.4+Math.random()*.8,side,delay:Math.random()*1.6});
        }
        const onResize = () => { if (!renderer) return; renderer.setSize(intro.clientWidth, intro.clientHeight, false); camera.aspect = intro.clientWidth / intro.clientHeight; camera.updateProjectionMatrix(); };
        addEventListener('resize', onResize, { passive: true });
        let raf = 0, start = performance.now(), active = true;
        const draw = now => {
          if (!renderer || !active || document.hidden) { raf = 0; return; }
          const t = opening ? (now - walkStarted) / 1000 : 0;
          const progress = Math.min(1, Math.max(0,(t-.3)/3.8));
          const eased = progress*progress*(3-2*progress);
          camera.position.z = -2.6*eased;
          petals.forEach(p => {
            const age=Math.max(0,t-p.delay);p.mesh.visible=opening && t>p.delay;
            p.mesh.position.x=p.x-p.side*(1-Math.exp(-age*.65))*2.8+Math.sin(age*2+p.phase)*.16;
            p.mesh.position.y=p.y+age*.65-age*age*.22;
            p.mesh.rotation.set(age*.8+p.phase,age*1.7+p.phase,age*.5);
            p.mesh.material.opacity=Math.max(0,Math.min(.95,(5.5-t)*.7));
          });
          renderer.render(scene, camera); raf = requestAnimationFrame(draw);
        };
        const visibility = () => { active = !document.hidden; if (active && !raf) raf = requestAnimationFrame(draw); };
        document.addEventListener('visibilitychange', visibility);
        renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); lite = true; intro.classList.add('is-css-walk'); webglCanvas.style.opacity = 0; renderer?.dispose(); renderer = null; });
        raf = requestAnimationFrame(draw);
        threeState = { scene, camera, petals, materials, geometry, raf, dispose: () => { active = false; cancelAnimationFrame(raf); aisle.dispose(); atlas.dispose(); petalTextures.forEach(t=>t.dispose()); renderer?.dispose(); geometry.dispose(); materials.forEach(m => m.dispose()); renderer = null; } };
        intro.classList.add('has-webgl');
      } catch (_) { intro.classList.add('is-css-walk'); renderer?.dispose(); renderer = null; }
    }
    const defer = window.requestIdleCallback || (fn => setTimeout(fn, 450));
    defer(loadThree);

    /* A restrained screen-wide petal field: one canvas loop, stopped away from the intro/hero. */
    const canvas = $('.petal-field'), ctx = canvas?.getContext('2d');
    const petalAtlas = new Image(); petalAtlas.src='art/petals.webp';
    let motes = [], frame = 0, last = 0, running = false, dpr = 1, canvasVisible = true, forceCanvasUntil = 0, introVisible = true, heroVisible = false;
    function resizeCanvas() {
      if (!ctx) return;
      dpr = Math.min(devicePixelRatio || 1, lite ? 1 : 1.5);
      canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function addPetal(x, y, burst = false) {
      motes.push({ x, y, vx: burst ? (Math.random() - .5) * 4.5 : (Math.random() - .5) * .45, vy: burst ? -1.5 - Math.random() * 2 : .4 + Math.random() * .65, size: 5 + Math.random() * 8, angle: Math.random() * 6, spin: (Math.random() - .5) * .06, phase: Math.random() * 6, age: 0, sprite: Math.floor(Math.random()*8), burst });
    }
    function drawPetals(now) {
      frame = 0; if (!ctx || (!running && !motes.length) || document.hidden) return;
      if (!canvasVisible) { ctx.clearRect(0, 0, innerWidth, innerHeight); return; }
      const w = innerWidth, h = innerHeight, dt = Math.min(2, (now - (last || now)) / 16.7); last = now;
      ctx.clearRect(0, 0, w, h);
      for (let i = motes.length - 1; i >= 0; i--) {
        const p = motes[i]; p.age += dt; p.phase += .055 * dt; p.angle += p.spin * dt; p.x += (p.vx + Math.sin(p.phase) * .5) * dt; p.y += p.vy * dt; if (p.burst) { p.vy += .035 * dt; p.vx *= Math.pow(.992, dt); }
        if (p.y > h + 30 || p.x < -30 || p.x > w + 30 || (p.burst && p.age > 150)) { motes.splice(i, 1); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.scale(Math.cos(p.phase) * .45 + .55, 1); ctx.globalAlpha = p.burst ? Math.max(0, 1 - p.age / 150) : .68;
        if(petalAtlas.complete && petalAtlas.naturalWidth){const sw=petalAtlas.naturalWidth/4,sh=petalAtlas.naturalHeight/2;ctx.drawImage(petalAtlas,(p.sprite%4)*sw,Math.floor(p.sprite/4)*sh,sw,sh,-p.size,-p.size*1.5,p.size*2,p.size*3);}
        ctx.restore();
      }
      if (running && !opening && heroVisible && motes.filter(p => !p.burst).length < (lite ? 4 : 10) && Math.random() < .035) addPetal(Math.random()*w, -10);
      if (running || motes.length) frame = requestAnimationFrame(drawPetals);
    }
    function startPetals(burst = false) {
      if (!ctx || reduced) return;
      if (burst) { forceCanvasUntil = performance.now() + 2900; canvasVisible = true; setTimeout(() => { if (performance.now() >= forceCanvasUntil && intro.hidden && !heroVisible) { canvasVisible = false; motes = []; ctx.clearRect(0, 0, innerWidth, innerHeight); } }, 3000); }
      resizeCanvas(); if (!burst) running = true; last = 0;
      if (burst) for (let i=0;i<(lite?14:40);i++) addPetal(innerWidth*(.2+Math.random()*.6), innerHeight*.55, true);
      else for (let i=0;i<(lite?4:9);i++) addPetal(Math.random()*innerWidth, Math.random()*innerHeight);
      if (!frame) frame = requestAnimationFrame(drawPetals);
    }
    function stopPetals() { running = false; if (frame && !motes.length) cancelAnimationFrame(frame); }
    resizeCanvas(); addEventListener('resize', resizeCanvas, { passive: true });
    const introObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.target === intro) introVisible = entry.isIntersecting && !intro.hidden; else heroVisible = entry.isIntersecting; });
      canvasVisible = introVisible || heroVisible || performance.now() < forceCanvasUntil;
      if (!canvasVisible && ctx) { ctx.clearRect(0, 0, innerWidth, innerHeight); motes = motes.filter(p => p.burst); }
      if (canvasVisible && (running || motes.length) && !frame) frame=requestAnimationFrame(drawPetals);
    }, { threshold:.02 });
    introObserver.observe(intro); introObserver.observe(hero);

    let down = null;
    intro.addEventListener('pointerdown', event => { if (event.target.closest('.intro__skip')) return; event.preventDefault(); try { intro.setPointerCapture(event.pointerId); } catch (_) {} down={y:event.clientY,x:event.clientX,id:event.pointerId}; pointerId=event.pointerId; });
    intro.addEventListener('pointerup', event => { if (!down || pointerId!==event.pointerId) return; const dy=down.y-event.clientY; const tap=Math.hypot(down.y-event.clientY,down.x-event.clientX)<14; down=null; pointerId=null; if (tap || dy>40) open(); });
    intro.addEventListener('pointercancel', () => { down=null; pointerId=null; });
    let touchStart = null;
    intro.addEventListener('touchstart', event => { const touch=event.changedTouches[0]; if (touch) touchStart={x:touch.clientX,y:touch.clientY}; }, { passive:true });
    intro.addEventListener('touchend', event => { const touch=event.changedTouches[0]; if (!touch || !touchStart) return; const dy=touchStart.y-touch.clientY; touchStart=null; if (dy>40) open(); }, { passive:true });
    button?.addEventListener('click', event => { if (event.detail===0) open(); });
    skip?.addEventListener('click', () => { app.open(); finish(true); });

    function open() {
      if (opened) return;
      if (opening) { finish(true); return; }
      opening = true; walkStarted = performance.now(); signIdle?.kill(); arrive?.progress(1).kill(); app.open(); skip.hidden=false; intro.classList.add('is-opening');
      if (gsap && !reduced) gsap.timeline().to('.seal', { scale: .84, duration: .12, ease: 'power2.in' }).to('.seal', { scale: 1.5, opacity: 0, rotation: 12, duration: .6, ease: 'power2.out' });
      try { navigator.vibrate?.(8); } catch (_) {}
      if (!lite && window.THREE && !renderer) initThree(); else loadThree();
      if (lite) startPetals(true);
      if (reduced) { intro.classList.add('is-reduced-opening'); intro.style.transition='opacity .35s ease'; requestAnimationFrame(()=>intro.style.opacity='0'); setTimeout(()=>finish(true), 350); return; }
      if (lite || !gsap) {
        intro.classList.add('is-walking','is-css-walk');
        gsap?.to(poster,{scale:1.2,duration:1.45,ease:'power2.inOut'});
        setTimeout(()=>intro.classList.add('is-arch'),850); setTimeout(()=>finish(),2100); return;
      }
      intro.classList.add('is-walking');
      master = gsap.timeline({ defaults:{ease:'power2.inOut'}, onComplete:()=>finish() });
      // Act 2: dolly down the flower-lined aisle, with 3D petals crossing the foreground.
      master.to(poster,{scale:1.31,yPercent:-1,duration:3.35,ease:'power3.inOut'},0)
        .to('.welcome-sign',{xPercent:25,opacity:0,duration:.9,ease:'power2.in'},.1)
        .to('.intro__copy',{opacity:0,duration:.45},0)
        .to('.intro__wash',{opacity:.3,duration:2.9},.35)
        .add(()=>intro.classList.add('is-arch'),3.3)
        .fromTo('.ink-letter',{clipPath:'inset(0 100% 0 0)',opacity:0},{clipPath:'inset(0 0% 0 0)',opacity:1,duration:.65,stagger:.065,ease:'power2.out'},3.65)
        // Act 3: chiffon settles aside; names write in, then the arch blooms open.
        .fromTo('.welcome-sign__names',{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0% 0 0)',duration:.9,ease:'power2.out'},3.45)
        .fromTo('.hero__names',{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0% 0 0)',duration:.95,ease:'power2.out'},3.55)
        .to('.welcome-sign',{xPercent:0,opacity:0,duration:.01},3.45)
        .to(poster,{scale:1.46,duration:1.35,ease:'expo.out'},3.25)
        // Light blooms as the camera passes under the arch, hiding the cut to the chiffon.
        .to('.intro__sun',{opacity:.25,duration:2.2,ease:'sine.inOut'},.4)
        .fromTo(bloom,{opacity:0,scale:.7},{opacity:.92,scale:1.15,duration:.6,ease:'power2.in'},2.8)
        .to(bloom,{opacity:0,scale:1.5,duration:1.2,ease:'power2.out'},3.42)
        .add(drawFleuron($('.fleuron',archCopy)),3.9)
        .to(intro,{opacity:0,duration:.8,ease:'sine.inOut'},5.3);
    }
    function finish(skipped = false) {
      if (opened) return;
      opening = false; opened = true; master?.kill(); stopPetals(); introVisible = false;
      if (!reduced) setTimeout(() => startPetals(false), 500);
      intro.classList.add('is-done'); intro.hidden=true; document.documentElement.classList.remove('is-locked'); document.body.classList.add('is-open');
      if (threeState) { threeState.dispose(); threeState=null; }
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      buildScrollFilm(); fit();
    }

    function buildScrollFilm() {
      const ST=window.ScrollTrigger;
      if (!gsap || !ST || reduced) { $('.gallery-section')?.classList.add('is-open'); $$('.programme__rail li').forEach(item => item.classList.add('is-lit')); return; }
      gsap.registerPlugin(ST);
      // 1. Crane through the floral arch into the villa garden.
      gsap.to('.hero__image',{scale:1.2,yPercent:-9,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
      gsap.to('.hero__copy',{yPercent:-18,opacity:.35,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
      // 2. Raking light skims the letterpress card; 3. rotate/push through the flat lay.
      const invite=$('.invitation__card');
      gsap.fromTo(invite,{rotateY:-8,scale:.92},{rotateY:0,scale:1,ease:'none',scrollTrigger:{trigger:'.invitation',start:'top bottom',end:'center center',scrub:1}});
      gsap.to('.invitation__raking',{xPercent:240,ease:'none',scrollTrigger:{trigger:'.invitation',start:'top 75%',end:'bottom 35%',scrub:1}});
      // 4. Postmark, 5. calendar circle and 6. countdown flip settle from depth.
      gsap.fromTo('.date__postmark',{scale:1.16,rotate:4},{scale:1,rotate:-7,ease:'none',scrollTrigger:{trigger:'.date-chapter',start:'top 78%',end:'center 55%',scrub:1}});
      gsap.fromTo('.date__flower',{yPercent:15,rotate:-14},{yPercent:0,rotate:-7,ease:'none',scrollTrigger:{trigger:'.date-chapter',start:'top bottom',end:'bottom top',scrub:1}});
      // 7. The silk route unrolls; each vignette develops at its own stop.
      gsap.to('.programme__rail>i',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.programme',start:'top 75%',end:'bottom 55%',scrub:1}});
      gsap.utils.toArray('.programme__rail li').forEach(item=>{
        gsap.fromTo(item,{y:24,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 88%'}});
        ST.create({trigger:item,start:'top 64%',onEnter:()=>item.classList.add('is-lit'),onLeaveBack:()=>item.classList.remove('is-lit')});
      });
      gsap.utils.toArray('.programme__vignette').forEach(photo=>gsap.fromTo(photo,{opacity:.15,scale:.94},{opacity:1,scale:1,ease:'none',scrollTrigger:{trigger:photo,start:'top 85%',end:'top 55%',scrub:.5}}));
      // 8. Venue print is carried into its wooden easel.
      gsap.fromTo('.venue__easel',{x:-70,y:25,rotate:-5,opacity:.4},{x:0,y:0,rotate:-1,opacity:1,ease:'none',scrollTrigger:{trigger:'.venue',start:'top 80%',end:'center 65%',scrub:1}});
      // 9. Atelier swatches pin themselves; 10. album cover turns to reveal the photos.
      gsap.fromTo('.dress__board',{rotate:3,y:30},{rotate:1,y:0,duration:.8,scrollTrigger:{trigger:'.dress',start:'top 75%',toggleActions:'play none none reverse'}});
      gsap.to('.gallery-section .chapter__photo',{scale:1.14,yPercent:-5,ease:'none',scrollTrigger:{trigger:'.gallery-section',start:'top bottom',end:'bottom top',scrub:1}});
      gsap.to('.album__cover',{rotateY:-115,opacity:0,ease:'none',scrollTrigger:{trigger:'.gallery-section',start:'top 85%',end:'top 25%',scrub:1,onUpdate:self=>{$('.album__cover').style.pointerEvents=self.progress>.8?'none':'auto';}}});
      // 11. Reply card enters; 12. guestbook page writes; 13. box opens; 14. evening turns blue.
      gsap.fromTo('.reply-card',{y:30,rotate:2,opacity:.6},{y:0,rotate:-1,opacity:1,duration:.8,scrollTrigger:{trigger:'.rsvp-section',start:'top 75%',toggleActions:'play none none reverse'}});
      gsap.fromTo('.guestbook',{rotateY:10,scale:.96},{rotateY:0,scale:1,duration:.9,scrollTrigger:{trigger:'.wishes-section',start:'top 72%',toggleActions:'play none none reverse'}});
      gsap.fromTo('.gifts__copy',{y:40,opacity:.45},{y:0,opacity:1,duration:.9,scrollTrigger:{trigger:'.gifts',start:'top 75%',toggleActions:'play none none reverse'}});
      gsap.to('.finale__dusk',{opacity:.75,ease:'none',scrollTrigger:{trigger:'.finale',start:'top bottom',end:'center center',scrub:1}});
      gsap.fromTo('.finale__copy',{y:18,opacity:.6},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.finale',start:'top 85%',end:'center 60%',scrub:1}});
      gsap.to('.finale__flame',{opacity:1,ease:'none',scrollTrigger:{trigger:'.finale',start:'top 65%',end:'center center',scrub:1}});
      gsap.to('.finale__bulbs i',{opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:'.finale',start:'top 65%',end:'center center',scrub:1}});
      editorialFilm(ST);
    }

    /* Editorial chapters: a roman folio, titles rising word by word, paper settling onto the table. */
    $$('.chapter:not([hidden])').forEach((chapter, i) => {
      const eyebrow = $('.eyebrow', chapter); if (!eyebrow) return;
      eyebrow.insertAdjacentHTML('beforebegin', `<p class="folio" aria-hidden="true" data-no-i18n><i></i><span>${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][i] || ''}</span><i></i></p>`);
    });
    const hairline = $('.invitation__card .hairline'); if (hairline) { fleuron(hairline); hairline.remove(); }
    fleuron($('.finale__names'));
    const titles = $$('.chapter .title, .chapter .script-title, .finale .script-title');
    titles.forEach(title => {
      const words = title.textContent.trim().split(/\s+/); if (!words[0]) return;
      title.setAttribute('aria-label', title.textContent.trim());
      title.innerHTML = words.map(word => `<span class="word" aria-hidden="true"><span class="word__in">${word.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</span></span>`).join(' ');
    });
    function editorialFilm(ST) {
      titles.forEach(title => {
        // The platform bridge can refresh contract-backed titles after the
        // first render. Rebuild the captured word wrappers before animating.
        if (!$('.word__in', title)) {
          const words = title.textContent.trim().split(/\s+/);
          if (words[0]) {
            title.setAttribute('aria-label', title.textContent.trim());
            title.innerHTML = words.map(word => `<span class="word" aria-hidden="true"><span class="word__in">${word.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</span></span>`).join(' ');
          }
        }
        const targets = $$('.word__in', title);
        if (targets.length) gsap.fromTo(targets, { yPercent: 115, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 1.25, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: title, start: 'top 90%' } });
      });
      $$('.folio').forEach(folio => gsap.timeline({ scrollTrigger: { trigger: folio, start: 'top 90%' } })
        .from($$('i', folio), { scaleX: 0, duration: 1.1, ease: 'expo.out' }, 0)
        .from($('span', folio), { opacity: 0, y: 6, duration: .8, ease: 'power2.out' }, .15));
      [['.date__card','.date-chapter'],['.programme__panel','.programme'],['.album','.gallery-section'],['.contacts__card','.contacts']].forEach(([card, trigger]) =>
        gsap.from(card, { y: 90, rotationX: 18, opacity: 0, transformPerspective: 1100, transformOrigin: '50% 0%', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger, start: 'top 76%' } }));
      $$('.invitation__card, .date__card, .programme__panel, .dress__board, .reply-card, .guestbook, .contacts__card').forEach(card =>
        gsap.from([...card.children].filter(child => !child.matches('.folio, .title, .script-title, .blind-mark')), { opacity: 0, y: 16, duration: .9, stagger: .07, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 74%' } }));
      $$('.chapter__photo').forEach(photo => { if (photo.closest('.gallery-section')) return;
        gsap.fromTo(photo, { yPercent: -5, scale: 1.14 }, { yPercent: 5, scale: 1.14, ease: 'none', scrollTrigger: { trigger: photo.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }); });
      $$('.invitation__card .fleuron, .finale .fleuron').forEach(svg => { const draw = drawFleuron(svg).pause(); ST.create({ trigger: svg, start: 'top 85%', once: true, onEnter: () => draw.play() }); });
    }

    /* Countdown digits turn like the split-flap boards of an Italian railway station. */
    function makeFlap() {
      const el = document.createElement('span'); el.className = 'flap__d';
      el.innerHTML = '<span class="flap__h flap__h--top"><span></span></span><span class="flap__h flap__h--bottom"><span></span></span>';
      const [topHalf, bottomHalf] = el.children, top = topHalf.firstChild, bottom = bottomHalf.firstChild;
      let value = null;
      return { el, set(next) {
        if (next === value) return;
        const previous = value; value = next;
        if (previous === null || reduced || lite || !el.animate || document.hidden) { top.textContent = bottom.textContent = next; return; }
        top.textContent = next;
        const fall = topHalf.cloneNode(true), rise = bottomHalf.cloneNode(true);
        fall.classList.add('flap__leaf'); rise.classList.add('flap__leaf'); fall.firstChild.textContent = previous; rise.firstChild.textContent = next;
        rise.style.transform = 'rotateX(90deg)'; el.append(fall, rise);
        fall.animate([{ transform: 'rotateX(0)', filter: 'brightness(1)' }, { transform: 'rotateX(-90deg)', filter: 'brightness(.82)' }], { duration: 240, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' }).onfinish = () => {
          fall.remove();
          rise.animate([{ transform: 'rotateX(90deg)', filter: 'brightness(1.12)' }, { transform: 'rotateX(0)', filter: 'brightness(1)' }], { duration: 340, easing: 'cubic-bezier(.2,1.5,.45,1)', fill: 'forwards' }).onfinish = () => { bottom.textContent = value; rise.remove(); };
        };
      } };
    }
    const clock = $('.countdown__grid');
    if (clock) {
      clock.classList.add('has-flaps');
      $$('[data-unit]', clock).forEach(source => {
        const board = document.createElement('span'); board.className = 'flap'; board.setAttribute('aria-hidden', 'true'); source.after(board);
        const digits = [];
        const render = () => {
          const text = source.textContent.trim();
          while (digits.length < text.length) { const digit = makeFlap(); board.append(digit.el); digits.push(digit); }
          while (digits.length > text.length) digits.pop().el.remove();
          Array.from(text).forEach((char, i) => digits[i].set(char));
        };
        render(); new MutationObserver(render).observe(source, { childList: true, characterData: true, subtree: true });
      });
    }

    /* Demo albums show the villa photographs until the couple uploads their own. */
    const DEMO_ART = ['arch', 'aisle', 'atelier', 'finale', 'cardbox', 'savedate'];
    $$('.gallery__print img').forEach((img, i) => {
      const swap = () => { if (/sample-photos\//.test(img.getAttribute('src') || '')) img.src = `art/${DEMO_ART[i % DEMO_ART.length]}.webp`; };
      if (img.classList.contains('is-missing')) swap(); else img.addEventListener('error', swap, { once: true });
    });
    // Prints swing on a soft coverflow as the album is swiped.
    const track = $('.gallery');
    if (track && !reduced) {
      let queued = false;
      const flow = () => {
        queued = false; const centre = track.scrollLeft + track.clientWidth / 2;
        $$('.gallery__print', track).forEach(print => {
          const d = Math.max(-1, Math.min(1, (print.offsetLeft + print.offsetWidth / 2 - centre) / (track.clientWidth * .8)));
          print.style.setProperty('--ry', `${(-d * 24).toFixed(2)}deg`); print.style.setProperty('--s', (1 - Math.abs(d) * .1).toFixed(3)); print.style.setProperty('--fade', (1 - Math.abs(d) * .4).toFixed(3));
        });
      };
      track.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(flow); } }, { passive: true });
      addEventListener('resize', flow, { passive: true }); flow();
    }

    /* A wax seal is pressed onto the reply card once the answer is sent. */
    const replyCard = $('.reply-card'), replySeal = document.createElement('span');
    replySeal.className = 'reply-seal'; replySeal.setAttribute('aria-hidden', 'true');
    replySeal.innerHTML = `<span class="seal__wax"><b class="seal__mark"></b></span>`; $('b', replySeal).textContent = initials;
    replyCard?.append(replySeal);
    const pressSeal = () => {
      if (reduced || !gsap) { replySeal.style.opacity = 1; return; }
      gsap.fromTo(replySeal, { opacity: 0, scale: 2.6, rotation: -32, y: -40 }, { opacity: 1, scale: 1, rotation: -9, y: 0, duration: .5, delay: .75, ease: 'power4.in',
        onComplete: () => gsap.fromTo(replySeal, { scale: 1.08 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.45)' }) });
    };
    if (!$('[data-rsvp-done]')?.hidden) replySeal.style.opacity = 1;
    app.on('rsvp', pressSeal);
    $('[data-rsvp-change]')?.addEventListener('click', () => { if (gsap) gsap.to(replySeal, { opacity: 0, scale: .8, duration: .3 }); else replySeal.style.opacity = 0; });

    /* Fireflies rise over the dusk table; one small loop that sleeps off-screen. */
    const flyCanvas = $('.fireflies'), flyCtx = flyCanvas?.getContext('2d');
    if (flyCtx && !reduced) {
      const sprite = document.createElement('canvas'); sprite.width = sprite.height = 32;
      const sg = sprite.getContext('2d'), glow = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
      glow.addColorStop(0, 'rgba(255,246,220,1)'); glow.addColorStop(.22, 'rgba(255,228,168,.6)'); glow.addColorStop(1, 'rgba(255,208,128,0)');
      sg.fillStyle = glow; sg.fillRect(0, 0, 32, 32);
      let flies = [], fw = 0, fh = 0, flyFrame = 0, flyVisible = false;
      const sizeFlies = () => {
        const ratio = Math.min(devicePixelRatio || 1, lite ? 1.5 : 2); fw = finale.clientWidth; fh = finale.clientHeight;
        flyCanvas.width = Math.round(fw * ratio); flyCanvas.height = Math.round(fh * ratio); flyCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
        flies = Array.from({ length: lite ? 10 : 22 }, () => ({ x: Math.random() * fw, y: fh * (.38 + Math.random() * .58), r: 5 + Math.random() * 8, a: Math.random() * 6.28, s: .12 + Math.random() * .3, p: Math.random() * 6.28, f: .5 + Math.random() * 1.1 }));
      };
      const flyTick = now => {
        flyFrame = 0; if (!flyVisible || document.hidden) return;
        flyCtx.clearRect(0, 0, fw, fh); flyCtx.globalCompositeOperation = 'lighter';
        for (const f of flies) {
          f.a += (Math.random() - .5) * .09; f.x += Math.cos(f.a) * f.s; f.y += Math.sin(f.a) * f.s * .7 - .04;
          if (f.x < -12) f.x = fw + 12; else if (f.x > fw + 12) f.x = -12;
          if (f.y < fh * .3) f.a = Math.PI / 2; else if (f.y > fh) f.a = -Math.PI / 2;
          const pulse = .3 + .7 * Math.max(0, Math.sin(now / 1000 * f.f + f.p)), size = f.r * 2 * (.75 + pulse * .45);
          flyCtx.globalAlpha = pulse; flyCtx.drawImage(sprite, f.x - size / 2, f.y - size / 2, size, size);
        }
        flyCtx.globalAlpha = 1; flyFrame = requestAnimationFrame(flyTick);
      };
      sizeFlies(); new ResizeObserver(sizeFlies).observe(finale);
      new IntersectionObserver(([entry]) => { flyVisible = entry.isIntersecting; if (flyVisible && !flyFrame) flyFrame = requestAnimationFrame(flyTick); }).observe(finale);
      document.addEventListener('visibilitychange', () => { if (!document.hidden && flyVisible && !flyFrame) flyFrame = requestAnimationFrame(flyTick); });
    }

    // Select a photographic moment from the customer's programme, in all supported languages.
    $$('.programme__rail li').forEach(item => {
      const title = item.textContent.toLocaleLowerCase();
      const photo = /cake|tort|торт/.test(title) ? 'program-cake' : /ceremon|nikoh|церемон|marosim/.test(title) ? 'aisle' : /dinner|dasturxon|ужин|raqs|dance|танец|send|xayr|провод/.test(title) ? 'finale' : 'suite';
      $('.programme__vignette', item).src = `art/${photo}.webp`;
    });
    $$('.dresscode__palette li').forEach(item => {
      item.tabIndex = 0; item.setAttribute('role','button');
      item.setAttribute('aria-label',item.textContent.trim());
      const lift = () => { if (reduced) return; item.classList.remove('is-lifted'); void item.offsetWidth; item.classList.add('is-lifted'); };
      item.addEventListener('click',lift);
      item.addEventListener('keydown',event => { if(event.key==='Enter'||event.key===' '){event.preventDefault();lift();} });
    });
    app.on('wish', () => {
      const lastWish = $('.wishes li:last-child');
      if (lastWish) { lastWish.scrollIntoView({block:'nearest',behavior:reduced?'instant':'smooth'}); if(!reduced && gsap) gsap.fromTo(lastWish,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1.1,ease:'power2.out'}); }
    });
    app.on('rsvp', () => {
      if (reduced || !gsap) return;
      gsap.timeline().to('.reply-card',{y:35,scale:.94,rotate:0,duration:.65,ease:'power2.inOut'}).to('.reply-card',{y:0,scale:1,rotate:-1,duration:.8,ease:'power2.out'},'+=.15');
    });

    // Open the guestbook album by a real tap or when the chapter reaches its turn.
    $('.album__cover')?.addEventListener('click',()=>$('.gallery-section').classList.add('is-open'));
    $('.gift')?.addEventListener('toggle',event=>{ if(event.target.open) event.target.classList.add('is-revealed'); });
    app.on('rsvp', answer => { if(answer?.status==='yes') startPetals(true); });
    app.on('section', ({name}) => { if(name==='finale') $('.finale')?.classList.add('is-lit'); });
    app.on('tier', tier => { lite = tier==='lite' || reduced; });

    // Light ambient petals remain idle off-screen and when the tab is hidden.
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;}
      else if(canvasVisible&&(running||motes.length)&&!frame)frame=requestAnimationFrame(drawPetals);
    });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('reduced-motion');
    window.ToscanaART = ART;
  });
})();
