/* Nahor: before dawn the guest lifts the lid of the qozon; steam bursts up, the title condenses out of
   the vapour while the sky turns from indigo to gold, and the camera dives into the steaming osh. */
(() => {
  'use strict';
  const app = window.Marhamat;
  if (!app) return;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const rand = (a, b) => a + Math.random() * (b - a);

  /* Where things sit inside the courtyard frames (fractions of the 840×1260 paintings; measured on
     art/src/gen/*.png, see art/ART_BRIEF.md). All six frames share one composition. */
  const ART = {
    focusX: .5, focusY: .6,                  // object-position of the frames
    lid: { x: .497, y: .622, hw: .27 },      // centre of the closed lid and half the rim width
    dome: { x: .497, y: .595 },              // top of the osh dome once the lid is off
    fire: { x: .505, y: .8, hw: .08 },       // the fire under the qozon
    sky: { top: .02, bottom: .36 }           // band where stars live
  };
  const FRAME_W = 840, FRAME_H = 1260;

  app.on('ready', () => {
    const gsap = window.gsap, ST = window.ScrollTrigger;
    const data = app.data;
    const reduced = !!app.reducedMotion;
    let lite = app.tier === 'lite' || reduced;
    const intro = $('#intro'), stage = $('#stage'), lid = $('#lid'), skip = $('#skip');
    const frames = $$('.frame', stage);
    const vapour = $('.vapour'), vapourText = $('.vapour__text');
    const noise = $('#vapour-noise'), map = $('#vapour-map'), blur = $('#vapour-blur');

    /* ── Data-driven details ── */
    const name = data.extras?.celebrant || [data.groom, data.bride].filter(Boolean).join(' & ');
    document.title = [name, data.eventType].filter(Boolean).join(' — ') || document.title;
    const meta = $('meta[name="description"]');
    if (meta) meta.content = [data.eventType, name, data.date?.long, data.venue?.name].filter(Boolean).join(' · ');
    if (data.rsvp?.enabled === false) $('#rsvp').hidden = true;
    if (data.toyona?.enabled === false) $('#toyona').hidden = true;
    const hideEmpty = (section, list) => { if (!(Array.isArray(data[list]) && data[list].length)) $(section).hidden = true; };
    hideEmpty('#program', 'program'); hideEmpty('#gallery', 'gallery'); hideEmpty('#contacts', 'contacts');
    if (!data.message && !data.hosts) $('#invitation-text').hidden = true;

    /* Fit the SVG title lines into the steam column whatever the name length. */
    function fitTitle() {
      [[$('.vapour__name'), 78, 372], [$('.vapour__event'), 22, 380]].forEach(([el, base, max]) => {
        if (!el) return;
        el.style.fontSize = `${base}px`;
        let len = 0;
        try { len = el.getComputedTextLength(); } catch (_) {}
        if (len > max) el.style.fontSize = `${Math.max(base * .42, base * max / len)}px`;
      });
    }
    fitTitle();
    document.fonts?.ready?.then(fitTitle);

    /* ── Geometry: map painting fractions to screen pixels (object-fit: cover) ── */
    let box = intro.getBoundingClientRect();
    function cover() {
      const scale = Math.max(box.width / FRAME_W, box.height / FRAME_H);
      const w = FRAME_W * scale, h = FRAME_H * scale;
      return { w, h, ox: (box.width - w) * ART.focusX, oy: (box.height - h) * ART.focusY };
    }
    const pt = (fx, fy) => { const c = cover(); return { x: c.ox + fx * c.w, y: c.oy + fy * c.h, w: c.w, h: c.h }; };
    function layout() {
      box = intro.getBoundingClientRect();
      const p = pt(ART.lid.x, ART.lid.y);
      lid.style.left = `${p.x}px`;
      lid.style.top = `${p.y}px`;
      lid.style.width = `${Math.min(box.width * .86, ART.lid.hw * 2 * p.w)}px`;
      lid.style.transform = 'translate(-50%, -50%)';
      const d = pt(ART.dome.x, ART.dome.y);
      stage.style.transformOrigin = `${d.x}px ${d.y}px`;
      fx.resize();
    }

    /* ── Frames: dawn-0 is painted first; the edits load right after ── */
    frames.forEach(f => { if (f.dataset.src) f.src = f.dataset.src; });
    const decoded = frames.map(f => (f.decode ? f.decode() : Promise.resolve()).catch(() => {}));
    let pos = 0;
    function setPos(t) {
      pos = t;
      const k = Math.floor(t), fr = t - k;
      frames.forEach((f, i) => { f.style.opacity = i <= k ? 1 : i === k + 1 ? fr : 0; });
      fx.day = clamp((t - 3) / 2);
    }

    /* ── Canvas: stars, embers from the fire, and the steam ── */
    const fx = (() => {
      const canvas = $('.intro__fx'), ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = 128;
      const s = sprite.getContext('2d'), g = s.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(.45, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      s.fillStyle = g; s.fillRect(0, 0, 128, 128);
      const MAX = lite ? 16 : 60;
      const stars = Array.from({ length: lite ? 14 : 34 }, () => ({ x: Math.random(), y: rand(ART.sky.top, ART.sky.bottom), r: rand(.5, 1.4), p: rand(0, 6.28) }));
      const embers = [], steam = [];
      let rate = 1.2, acc = 0, last = 0, raf = 0, running = false;
      const api = {
        day: 0, lift: 0, open: false,
        resize() {
          canvas.width = Math.round(box.width * dpr); canvas.height = Math.round(box.height * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        },
        setRate(r) { rate = r; },
        burst(n = lite ? 8 : 26) { for (let i = 0; i < n; i++) spawnSteam(true); },
        start() { if (running || reduced) return; running = true; last = performance.now(); raf = requestAnimationFrame(tick); },
        stop() { running = false; cancelAnimationFrame(raf); }
      };
      function spawnSteam(big) {
        if (steam.length >= MAX) return;
        const o = api.open ? pt(ART.dome.x, ART.dome.y) : pt(ART.lid.x, ART.lid.y + .02);
        const spread = (api.open ? .2 : .26) * o.w;
        const edge = api.open ? rand(-1, 1) : (Math.random() < .5 ? -1 : 1) * rand(.75, 1);
        steam.push({
          x: o.x + edge * spread, y: o.y + (big ? rand(-o.h * .05, 6) : rand(-4, 6)),
          vx: rand(-8, 8), vy: -rand(big ? 70 : 34, big ? 150 : 70) * (box.height / 800),
          r: rand(big ? 22 : 12, big ? 46 : 26), grow: rand(18, 34), a: 0, max: rand(.12, big ? .26 : .22),
          life: 0, ttl: rand(2.4, 4.2), sway: rand(0, 6.28)
        });
      }
      function tick(now) {
        const dt = Math.min(.05, (now - last) / 1000); last = now;
        ctx.clearRect(0, 0, box.width, box.height);
        const night = 1 - api.day;
        // stars fade as day breaks
        if (night > .02) {
          const c = cover();
          stars.forEach(st => {
            const tw = .55 + .45 * Math.sin(now / 700 + st.p);
            ctx.globalAlpha = night * tw * .9;
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(c.ox + st.x * c.w, c.oy + st.y * c.h, st.r, 0, 6.283); ctx.fill();
          });
        }
        // embers rise from the fire
        if (!lite || embers.length < 6) {
          if (Math.random() < dt * (lite ? 3 : 8)) {
            const f = pt(ART.fire.x, ART.fire.y);
            embers.push({ x: f.x + rand(-1, 1) * ART.fire.hw * f.w, y: f.y, vx: rand(-14, 14), vy: -rand(40, 110), life: 0, ttl: rand(.9, 1.9), r: rand(.8, 2) });
          }
        }
        ctx.globalCompositeOperation = 'lighter';
        for (let i = embers.length - 1; i >= 0; i--) {
          const e = embers[i]; e.life += dt;
          if (e.life > e.ttl) { embers.splice(i, 1); continue; }
          e.x += (e.vx + Math.sin(now / 300 + i) * 12) * dt; e.y += e.vy * dt;
          ctx.globalAlpha = (1 - e.life / e.ttl) * .9;
          ctx.fillStyle = '#ffb35c';
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.283); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        // steam
        acc += dt * (rate + api.lift * 18);
        while (acc > 1) { spawnSteam(api.lift > .4); acc -= 1; }
        for (let i = steam.length - 1; i >= 0; i--) {
          const p = steam[i]; p.life += dt;
          const k = p.life / p.ttl;
          if (k >= 1) { steam.splice(i, 1); continue; }
          p.x += (p.vx + Math.sin(now / 900 + p.sway) * 16) * dt;
          p.y += p.vy * dt; p.vy *= .995; p.r += p.grow * dt;
          p.a = (k < .2 ? k / .2 : 1 - (k - .2) / .8) * p.max;
          const warm = clamp((p.y - box.height * .35) / (box.height * .3));
          ctx.globalAlpha = p.a;
          ctx.filter = 'none';
          ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
          if (warm > 0 && night > .3) { ctx.globalAlpha = p.a * warm * .35 * night; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(sprite, p.x - p.r * .8, p.y - p.r * .8, p.r * 1.6, p.r * 1.6); ctx.globalCompositeOperation = 'source-over'; }
        }
        ctx.globalAlpha = 1;
        if (running) raf = requestAnimationFrame(tick);
      }
      document.addEventListener('visibilitychange', () => { if (document.hidden) api.stop(); else if (!intro.classList.contains('is-done')) api.start(); });
      return api;
    })();

    layout();
    addEventListener('resize', () => { if (!opening) layout(); }, { passive: true });
    fx.start();

    /* ── Act 1: arrival ── */
    if (gsap && !reduced) {
      gsap.from(stage, { scale: 1.12, duration: 2.6, ease: 'power2.out' });
      gsap.from('.intro__shade', { opacity: 0, duration: 1.4 });
      gsap.from('.intro__top > *', { y: 16, opacity: 0, duration: 1.1, stagger: .18, delay: .5, ease: 'power3.out' });
      gsap.from(lid, { opacity: 0, scale: .9, duration: .9, delay: 1.3, ease: 'back.out(1.6)', clearProps: 'scale' });
    }

    /* ── Hero is prepared behind the intro ── */
    const heroImg = $('.hero__art img');
    if (gsap && !reduced) gsap.set(['.hero__copy > *'], { opacity: 0, y: 24 });

    /* ── Optional sound: a soft lid "clink" and a breath of steam, only when music is on ── */
    let audioCtx = null;
    function lidSound() {
      if (!data.music || reduced) return;
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const t = audioCtx.currentTime, out = audioCtx.createGain();
        out.gain.value = .12; out.connect(audioCtx.destination);
        [[1320, .9], [2210, .5], [3170, .25]].forEach(([f, v]) => {
          const o = audioCtx.createOscillator(), gn = audioCtx.createGain();
          o.frequency.value = f; gn.gain.setValueAtTime(v, t); gn.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
          o.connect(gn).connect(out); o.start(t); o.stop(t + 1.2);
        });
        const len = audioCtx.sampleRate * 1.6, buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
        const n = audioCtx.createBufferSource(), bp = audioCtx.createBiquadFilter(), ng = audioCtx.createGain();
        bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = .6; ng.gain.value = .5;
        n.buffer = buf; n.connect(bp).connect(ng).connect(out); n.start(t + .05);
      } catch (_) {}
    }

    /* ── The gesture: lift the lid (drag up), or just tap it ── */
    let drag = null, opening = false, tl = null;
    const lift = { pos: 0 };
    intro.addEventListener('pointerdown', e => {
      if (opening || e.target.closest('#skip')) return;
      drag = { y: e.clientY, t: performance.now(), p: 0 };
      try { intro.setPointerCapture(e.pointerId); } catch (_) {}
      intro.classList.add('is-lifting');
    });
    intro.addEventListener('pointermove', e => {
      if (!drag || opening) return;
      drag.p = clamp((drag.y - e.clientY) / (box.height * .2));
      fx.lift = drag.p;
      setPos(drag.p * 2);
    });
    const release = e => {
      if (!drag || opening) return;
      const tap = drag.p < .05 && performance.now() - drag.t < 600;
      const go = tap || drag.p > .26;
      drag = null; fx.lift = 0;
      if (go) commit(e);
      else {
        intro.classList.remove('is-lifting');
        if (gsap) gsap.to(lift, { pos: 0, duration: .5, ease: 'power2.out', onUpdate: () => setPos(lift.pos) }); else setPos(0);
      }
    };
    intro.addEventListener('pointerup', release);
    intro.addEventListener('pointercancel', () => { drag = null; fx.lift = 0; if (!opening) setPos(0); });
    lid.addEventListener('click', e => { if (e.detail === 0 && !opening) commit(e); }); // keyboard
    lid.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !opening) { e.preventDefault(); commit(e); } });

    let committedAt = 0;
    function commit() {
      if (opening) return;
      opening = true;
      committedAt = performance.now();
      app.open();                       // inside the user gesture: core starts the music
      lidSound();
      intro.classList.add('is-lifting');
      lift.pos = pos;
      const wait = Promise.race([Promise.all(decoded.slice(1, 4)), new Promise(r => setTimeout(r, 2500))]);
      wait.then(reveal);
    }

    /* ── Act 2 + 3: the reveal ── */
    function reveal() {
      window.scrollTo(0, 0);
      skip.hidden = false;
      const vap = { scale: 90, blur: 6, freq: .018 };
      const applyVap = () => {
        map.setAttribute('scale', vap.scale.toFixed(1));
        blur.setAttribute('stdDeviation', vap.blur.toFixed(2));
        noise.setAttribute('baseFrequency', `${vap.freq.toFixed(4)} ${(vap.freq * 2.5).toFixed(4)}`);
      };
      if (!gsap || lite) {
        // Lite / reduced motion: a calm crossfade to sunrise with the title, ≤ 2.5 s in total.
        if (vapourText) vapourText.removeAttribute('filter');
        fx.open = true; fx.setRate(lite && !reduced ? 3 : 0);
        if (!gsap) { setPos(5); vapour.style.opacity = 1; setTimeout(finish, 900); return; }
        tl = gsap.timeline({ onComplete: finish })
          .to(lift, { pos: 5, duration: 1.1, ease: 'power1.inOut', onUpdate: () => setPos(lift.pos) }, 0)
          .to('.intro__top, .lid', { opacity: 0, duration: .4 }, 0)
          .to(vapour, { opacity: 1, duration: .6 }, .4)
          .to(intro, { opacity: 0, duration: .6 }, 1.7);
        return;
      }
      applyVap();
      tl = gsap.timeline({ onComplete: finish });
      tl.to(lift, { pos: 2, duration: .55, ease: 'power2.out', onUpdate: () => setPos(lift.pos) }, 0)
        .to('.lid', { opacity: 0, duration: .3 }, 0)
        .to('.intro__top', { opacity: 0, y: -18, duration: .6, ease: 'power2.in' }, .1)
        .call(() => { fx.open = true; fx.burst(); fx.setRate(16); }, null, .35)
        .to(lift, { pos: 3, duration: .75, ease: 'power1.inOut', onUpdate: () => setPos(lift.pos) }, .55)
        .call(() => fx.setRate(9), null, 1.6)
        // the title condenses out of the steam
        .to(vapour, { opacity: 1, duration: .7, ease: 'power1.out' }, .85)
        .to(vap, { scale: 0, blur: 0, freq: .012, duration: 2.1, ease: 'power3.out', onUpdate: applyVap }, .85)
        .from('.vapour__date', { opacity: 0, y: 10, duration: .8 }, 2.3)
        // dawn breaks
        .to(lift, { pos: 4, duration: 1.3, ease: 'sine.inOut', onUpdate: () => setPos(lift.pos) }, 1.5)
        .to(lift, { pos: 5, duration: 1.5, ease: 'sine.inOut', onUpdate: () => setPos(lift.pos) }, 2.8)
        .to('.intro__shade', { opacity: .55, duration: 1.5 }, 2.8)
        // Act 3: the camera dives into the qozon, and the hero (the osh up close) takes over
        .to(vapour, { y: -50, opacity: 0, duration: .8, ease: 'power2.in' }, 4.7)
        .to(stage, { scale: 2.4, duration: 1.25, ease: 'power3.in' }, 4.65)
        .to(intro, { opacity: 0, duration: .55, ease: 'power1.in' }, 5.3)
        .fromTo(heroImg, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'power3.out', clearProps: 'transform' }, 5.25)
        .to('.hero__copy > *', { opacity: 1, y: 0, duration: .9, stagger: .12, ease: 'power3.out' }, 5.55);
    }
    function speedUp() { if (tl && tl.isActive()) tl.timeScale(5); }
    skip.addEventListener('click', e => { e.stopPropagation(); speedUp(); });
    intro.addEventListener('click', e => { if (opening && tl && e.target !== skip && performance.now() - committedAt > 700) speedUp(); });

    function finish() {
      intro.classList.add('is-done');
      fx.stop();
      skip.hidden = true;
      if (gsap) gsap.set('.hero__copy > *', { opacity: 1, y: 0 });
      startPage();
    }

    /* ── Page choreography ── */
    let pageStarted = false;
    function startPage() {
      if (pageStarted) return;
      pageStarted = true;
      heroSteam();
      if (!gsap || !ST || reduced) { staticState(); return; }
      gsap.registerPlugin(ST);
      const sc = (trigger, vars) => ST.create({ trigger, ...vars });

      // 1. hero art drifts and the steam keeps rising
      gsap.to(heroImg, { yPercent: -9, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__copy', { yPercent: -30, opacity: .2, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

      // 2. the dasturxon unfolds and the letter is laid on it
      const letter = gsap.timeline({ scrollTrigger: { trigger: '#invitation-text', start: 'top 78%' } });
      letter.from('.letter__cloth img', { rotateX: -70, transformPerspective: 900, opacity: .3, duration: 1.2, ease: 'power3.out' })
        .from('.letter__card', { y: 70, rotateX: 12, transformPerspective: 900, opacity: 0, duration: 1, ease: 'power3.out' }, .35)
        .from('.letter__card > *', { y: 14, opacity: 0, duration: .6, stagger: .08 }, .7);

      // 3. scrubbed sunrise: the section sky turns from night to day, the sun climbs the dial
      const dawn = $('#date'), sun = $('.sundial__sun');
      const setSun = s => {
        const a = Math.PI * (1 - s * .5);  // from the left horizon (0) to the zenith (.5)
        sun.setAttribute('transform', `translate(${160 + 140 * Math.cos(a)} ${160 - 140 * Math.sin(a)})`);
        dawn.style.setProperty('--sun', (s * .5).toFixed(3));
        dawn.style.setProperty('--day', clamp(s * 1.1 - .1).toFixed(3));
      };
      setSun(0);
      sc(dawn, { start: 'top 85%', end: 'bottom 40%', scrub: .6, onUpdate: self => setSun(self.progress) });
      gsap.from('.sundial__time', { scale: .7, opacity: 0, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.sundial', start: 'top 80%' } });
      gsap.from('.countdown > div', { rotateX: -90, transformPerspective: 600, opacity: 0, duration: .7, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.countdown', start: 'top 88%' } });

      // 4. the lagan turns and the program line fills
      gsap.fromTo('.program__lagan', { rotate: -40 }, { rotate: 140, ease: 'none', scrollTrigger: { trigger: '#program', start: 'top bottom', end: 'bottom top', scrub: true } });
      const line = $('.program__line');
      gsap.fromTo(line, { '--fill': 0 }, { '--fill': 1, ease: 'none', scrollTrigger: { trigger: '.program', start: 'top 75%', end: 'bottom 55%', scrub: true } });
      gsap.from('.program__item', { x: -30, opacity: 0, duration: .7, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.program', start: 'top 80%' } });

      // 5. the gate opens as you scroll to it
      const gate = { trigger: '.venue__gate', start: 'top 75%', end: 'center 45%', scrub: .5 };
      gsap.to('.venue__leaf--l', { rotateY: -104, transformPerspective: 1000, ease: 'power1.in', scrollTrigger: gate });
      gsap.to('.venue__leaf--r', { rotateY: 104, transformPerspective: 1000, ease: 'power1.in', scrollTrigger: gate });
      gsap.fromTo('.venue__gate img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: gate });

      // 6. gallery, wishes, to‘yona and the footer, each with its own entrance
      gsap.from('.gallery__item', { x: 80, opacity: 0, rotate: 3, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.gallery', start: 'top 85%' } });
      gsap.from('.rsvp__choices button', { y: 24, opacity: 0, duration: .6, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.rsvp__choices', start: 'top 88%' } });
      gsap.from('.wishes__item', { y: 30, rotate: (i) => (i % 2 ? 2 : -2), opacity: 0, duration: .7, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.wishes', start: 'top 85%' } });
      gsap.from('.gift__bundle svg', { y: -40, rotate: -12, opacity: 0, duration: 1, ease: 'bounce.out', scrollTrigger: { trigger: '.gift', start: 'top 88%' } });
      gsap.fromTo('.footer__art img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
      gsap.from('.footer__copy > *', { y: 20, opacity: 0, duration: .8, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '#footer', start: 'top 70%' } });

      // section titles: letters rise one by one (works for Latin and Cyrillic)
      $$('.page .section__title').forEach(h => {
        const text = h.textContent;
        if (!text || h.dataset.split) return;
        h.dataset.split = '1';
        h.setAttribute('aria-label', text);
        h.innerHTML = '';
        // letters live inside unbreakable word boxes so lines only wrap between words
        text.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { h.appendChild(document.createTextNode(' ')); return; }
          const word = document.createElement('span');
          word.setAttribute('aria-hidden', 'true'); word.style.display = 'inline-block'; word.style.whiteSpace = 'nowrap';
          [...part].forEach(ch => { const c = document.createElement('span'); c.className = 'ch'; c.textContent = ch; c.style.display = 'inline-block'; word.appendChild(c); });
          h.appendChild(word);
        });
        gsap.from(h.querySelectorAll('.ch'), { y: 26, opacity: 0, duration: .7, stagger: .03, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
      });
      ST.refresh();
    }
    function staticState() {
      const dawn = $('#date');
      dawn.style.setProperty('--day', '.6'); dawn.style.setProperty('--sun', '.5');
      $('.sundial__sun').setAttribute('transform', 'translate(160 20)');
      $$('.venue__leaf').forEach(l => { l.style.display = 'none'; });
    }

    /* Steam keeps rising over the osh in the hero while it is on screen. */
    function heroSteam() {
      if (reduced) return;
      const canvas = $('.hero__steam'), ctx = canvas.getContext('2d'), hero = $('#hero');
      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 1.75);
      const sprite = document.createElement('canvas'); sprite.width = sprite.height = 96;
      const s = sprite.getContext('2d'), g = s.createRadialGradient(48, 48, 0, 48, 48, 48);
      g.addColorStop(0, 'rgba(255,248,236,.85)'); g.addColorStop(.5, 'rgba(255,240,220,.3)'); g.addColorStop(1, 'rgba(255,240,220,0)');
      s.fillStyle = g; s.fillRect(0, 0, 96, 96);
      const ps = [], MAX = lite ? 10 : 30;
      let w = 0, h = 0, visible = true, raf = 0, last = performance.now();
      const size = () => { w = hero.clientWidth; h = hero.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
      size(); addEventListener('resize', size, { passive: true });
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); raf = requestAnimationFrame(tick); } }).observe(hero);
      function tick(now) {
        const dt = Math.min(.05, (now - last) / 1000); last = now;
        ctx.clearRect(0, 0, w, h);
        if (ps.length < MAX && Math.random() < dt * (lite ? 4 : 12)) ps.push({ x: rand(.2, .8) * w, y: h * rand(.55, .75), r: rand(20, 46), vy: -rand(18, 40), life: 0, ttl: rand(4, 7), sway: rand(0, 6.28) });
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i]; p.life += dt; const k = p.life / p.ttl;
          if (k >= 1) { ps.splice(i, 1); continue; }
          p.y += p.vy * dt; p.x += Math.sin(now / 1400 + p.sway) * 10 * dt; p.r += 7 * dt;
          ctx.globalAlpha = (k < .25 ? k / .25 : 1 - (k - .25) / .75) * .3;
          ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        }
        if (visible && !document.hidden) raf = requestAnimationFrame(tick);
      }
    }

    /* ── RSVP "Kelaman": rice grains, carrot strips and raisins burst from the button ── */
    app.on('rsvp', answer => {
      if (!answer || answer.status !== 'yes' || reduced) return;
      const section = $('#rsvp'), canvas = $('.rsvp__burst'), ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2), W = section.clientWidth, H = section.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const done = $('.rsvp__done'), rect = (done && !done.hidden ? done : section).getBoundingClientRect(), base = section.getBoundingClientRect();
      const ox = rect.left - base.left + rect.width / 2, oy = rect.top - base.top + 40;
      const kinds = [['#fff3d6', 2.2, 5], ['#f2c66b', 2.2, 5], ['#e06c2b', 2, 12], ['#f4a259', 2, 11], ['#4a2a22', 2.6, 3.4]];
      const bits = Array.from({ length: lite ? 26 : 80 }, () => {
        const [c, wd, ln] = kinds[(Math.random() * kinds.length) | 0], a = rand(-Math.PI * .92, -Math.PI * .08), v = rand(220, 520);
        return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c, wd, ln, rot: rand(0, 6.28), vr: rand(-9, 9), life: 0 };
      });
      let last = performance.now();
      (function tick(now) {
        const dt = Math.min(.04, (now - last) / 1000); last = now;
        ctx.clearRect(0, 0, W, H);
        let alive = 0;
        bits.forEach(b => {
          b.life += dt; if (b.life > 1.9) return; alive++;
          b.vy += 760 * dt; b.vx *= .99; b.x += b.vx * dt; b.y += b.vy * dt; b.rot += b.vr * dt;
          ctx.save(); ctx.globalAlpha = clamp(1.9 - b.life); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
          ctx.fillStyle = b.c; ctx.beginPath(); ctx.ellipse(0, 0, b.wd, b.ln, 0, 0, 6.283); ctx.fill(); ctx.restore();
        });
        if (alive) requestAnimationFrame(tick); else ctx.clearRect(0, 0, W, H);
      })(last);
    });

    app.on('tier', t => { lite = t === 'lite' || reduced; });
  });
})();
