/* O‘rik Guli: a window fogged at the end of winter. The couple's initials are traced in the fog;
   the guest wipes the glass, the fog melts, the apricot branch outside blossoms in a slow
   time-lapse of real photographs, and the camera passes through the window into the orchard. */
(() => {
  'use strict';
  const app = window.Marhamat;
  const FX = window.OrikFX;
  const Fog = window.OrikFog;
  if (!app || !FX || !Fog) return;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const { rand, clamp } = FX;

  /* Where things sit inside the artwork, as fractions of the screen-filling window painting.
     Update these when window.webp is replaced (art/ART_BRIEF.md). */
  const ART = {
    panes: { x: .176, y: .151, w: .651, h: .64 }, // the glass of window.webp (measured from its alpha)
    fitWidth: 1.1,                                // window width as a share of the screen width (crops the painting's pale outer edge)
    fitFocusY: .42,                               // where the window sits vertically on a tall screen
    initials: { left: .235, right: .765, y: .25, size: .34, maxWidth: .36 } // one initial per upper pane (shares of the panes)
  };

  app.on('ready', () => {
    const root = document.documentElement;
    const intro = $('#intro');
    const views = $$('.view');
    const fogCanvas = $('.intro__fog');
    const windowImg = $('.intro__window');
    const glassButton = $('#open-invitation');
    const skip = $('#skip-intro');
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const reduced = app.reducedMotion;
    let lite = app.tier === 'lite';
    const data = app.data;

    const names = [data.groom, data.bride].filter(Boolean).join(' & ');
    if (names) document.title = `${names} — ${data.eventType || 'Taklifnoma'}`;
    const meta = $('meta[name="description"]');
    if (meta) meta.content = [names, data.eventType, data.date?.long, data.venue?.name].filter(Boolean).join(' · ');
    if (data.rsvp?.enabled === false) $('#rsvp').hidden = true;
    if (data.toyona?.enabled === false) $('#toyona').hidden = true;
    /* Fit the window to the width (or cover a wide screen) and find the glass on screen. */
    let paneRect = null;
    function layoutWindow() {
      const box = intro.getBoundingClientRect();
      let w = box.width * ART.fitWidth, h = w * 1.5;
      if (h < box.height * .62) { h = box.height * .62; w = h / 1.5; }
      if (h > box.height) { h = box.height * 1.02; w = h / 1.5; if (w < box.width) { w = box.width; h = w * 1.5; } }
      const l = (box.width - w) / 2, top = Math.max(0, (box.height - h) * ART.fitFocusY);
      intro.style.setProperty('--win-l', `${l}px`); intro.style.setProperty('--win-t', `${top}px`);
      intro.style.setProperty('--win-w', `${w}px`); intro.style.setProperty('--win-h', `${h}px`);
      paneRect = { x: l + w * ART.panes.x, y: top + h * ART.panes.y, w: w * ART.panes.w, h: h * ART.panes.h };
      windowImg.style.transformOrigin = `${paneRect.x + paneRect.w / 2 - l}px ${paneRect.y + paneRect.h * .45 - top}px`;
    }
    layoutWindow();

    /* ── The fog, and the initials traced in it ── */
    document.fonts?.load('80px "Great Vibes"');
    const fog = new Fog(fogCanvas, { dprCap: lite ? 1.5 : 2, view: views[0] });
    fog.paint();
    // The fog is a blurred copy of the view: repaint it once the photograph has arrived.
    if (!views[0].complete) views[0].addEventListener('load', () => { fog.paint(); if (traced) drawTrace(traced); }, { once: true });
    // One initial in each upper pane, the way someone writes on a window; a heart if there is only one name.
    const letters = [data.groom, data.bride].filter(Boolean).map(v => String(v).trim().charAt(0).toUpperCase());
    const glass = () => paneRect;
    const traceSize = () => Math.min(paneRect.w * ART.initials.size, paneRect.h * .34, 130);
    let traced = 0, letterBox = null;
    const drawTrace = p => {
      traced = p; fog.restore();
      const size = traceSize(), y = paneRect.y + paneRect.h * ART.initials.y, max = paneRect.w * ART.initials.maxWidth;
      const xl = paneRect.x + paneRect.w * ART.initials.left, xr = paneRect.x + paneRect.w * ART.initials.right;
      const first = clamp(p * 2, 0, 1), second = clamp(p * 2 - 1, 0, 1);
      const a = letters[0] ? fog.traceText(letters[0], xl, y, size, first, max) : fog.traceHeart(xl, y, size * .8, first);
      const b = letters[1] ? fog.traceText(letters[1], xr, y, size, second, max) : fog.traceHeart(xr, y, size * .8, second);
      letterBox = { left: a.left, right: b.right, bottom: Math.max(a.bottom, b.bottom), boxes: [a, b] };
    };
    let dripping = false;
    const dripLoop = () => {
      let last = 0;
      const tick = now => { const dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now; if (fog.step(dt)) requestAnimationFrame(tick); else dripping = false; };
      if (!dripping) { dripping = true; requestAnimationFrame(tick); }
    };
    const letterDrips = () => {
      if (!letterBox) return;
      letterBox.boxes.forEach(box => { for (let i = 0; i < 2; i++) fog.addDrip(box.left + (box.right - box.left) * (.3 + i * .4) + rand(-6, 6), box.bottom - 6, rand(.5, .9)); });
      dripLoop();
    };

    /* ── Act 1: arrival ── */
    let idle = null, arrival = null;
    if (gsap && !reduced) {
      gsap.set(fogCanvas, { opacity: 0 });
      const tl = arrival = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(views[0], { scale: 1.08, opacity: 0, duration: 2.4, ease: 'power2.out' }, 0)
        .from(windowImg, { scale: 1.06, opacity: 0, duration: 1.8, ease: 'power2.out' }, .2)
        .to(fogCanvas, { opacity: 1, duration: 1.6, ease: 'power1.inOut' }, .6)
        .to({ p: 0 }, { p: 1, duration: 1.8, ease: 'power1.inOut', onUpdate() { drawTrace(this.targets()[0].p); } }, 1.5)
        .call(letterDrips, null, 3.3)
        .from('.intro__copy', { y: -14, opacity: 0, duration: 1 }, .9)
        .from('.intro__hint', { y: 16, opacity: 0, duration: .8 }, 2.6);
      idle = gsap.to('.intro__hint', { scale: 1.04, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3.4 });
    } else {
      drawTrace(1);
    }

    /* ── Act 2: wiping the glass ── */
    let opening = false, finished = false, master = null, wiping = null, moved = 0, checks = 0;
    const pos = e => { const r = fogCanvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const brush = () => clamp(fog.w * .075, 22, 34);
    glassButton.addEventListener('pointerdown', e => {
      if (finished || opening) return;      // rubbing never skips the spring; the skip button does
      e.preventDefault();
      if (arrival && arrival.progress() < 1) arrival.progress(1);   // touching early finishes the arrival
      FX.sound.unlock();
      wiping = { id: e.pointerId, travel: 0 };
      try { glassButton.setPointerCapture(e.pointerId); } catch (_) {}
      const p = pos(e); fog.lift(); fog.wipeTo(p.x, p.y, brush());
    });
    glassButton.addEventListener('pointermove', e => {
      if (!wiping || opening || e.pointerId !== wiping.id) return;
      const p = pos(e), d = fog.wipeTo(p.x, p.y, brush());
      wiping.travel += d; moved += d;
      if (moved > 90) { moved = 0; try { navigator.vibrate?.(6); } catch (_) {} FX.sound.swish?.(); }
      dripLoop();
      if (++checks % 8 === 0 && fog.cleared(glass()) > .42) open(false);
    });
    const release = e => {
      if (!wiping || opening) return;
      const travel = wiping.travel; wiping = null; fog.lift();
      if (e.type !== 'pointercancel' && travel < 12) open(true);       // a tap wipes the glass for the guest
      else if (fog.cleared(glass()) > .42) open(false);
    };
    glassButton.addEventListener('pointerup', release);
    glassButton.addEventListener('pointercancel', release);
    glassButton.addEventListener('click', e => { if (e.detail === 0) open(true); });   // keyboard
    skip.addEventListener('click', () => { if (!opening) app.open(); finish(true); });

    /* A hand wiping the glass in slow, overlapping sweeps (used after a tap). */
    function autoWipe(duration) {
      return new Promise(resolve => {
        const g = glass(), rows = 5, r = brush() * 1.15;
        const path = [];
        for (let i = 0; i <= rows; i++) {
          const y = g.y + g.h * (i / rows), xs = i % 2 ? [g.x + g.w, g.x] : [g.x, g.x + g.w];
          for (let k = 0; k <= 12; k++) path.push({ x: xs[0] + (xs[1] - xs[0]) * k / 12, y: y + Math.sin(k / 12 * Math.PI) * g.h * .04 });
        }
        let start = 0, index = 0; fog.lift();
        const tick = now => {
          if (finished) return resolve();
          if (!start) start = now;
          const target = Math.min(path.length - 1, Math.floor((now - start) / (duration * 1000) * path.length));
          while (index <= target) { fog.wipeTo(path[index].x, path[index].y, r); index++; }
          dripLoop();
          if (index < path.length) requestAnimationFrame(tick); else { fog.lift(); resolve(); }
        };
        requestAnimationFrame(tick);
      });
    }

    async function open(auto) {
      if (finished || opening) return;
      opening = true;
      app.open();
      FX.sound.unlock();
      window.scrollTo(0, 0);
      skip.hidden = false;
      idle?.kill();
      if (reduced || !gsap) { finish(true); return; }
      gsap.to(['.intro__hint'], { opacity: 0, y: 12, duration: .5 });
      if (auto) await autoWipe(1.8);
      if (finished) return;
      playSpring();
    }

    /* ── Act 3: the fog melts, spring arrives outside, the camera passes through the window ── */
    let introPetals = null;
    function playSpring() {
      FX.sound.thaw?.();
      for (let i = 0; i < (lite ? 6 : 12); i++) fog.addDrip(fog.w * rand(.12, .88), fog.h * rand(.15, .55), rand(.8, 1.4));
      dripLoop();
      const tl = master = gsap.timeline();
      tl.to(fogCanvas, { opacity: 0, duration: 1.6, ease: 'power1.inOut' }, .2)
        .to('.intro__copy', { opacity: 0, y: -12, duration: .9 }, .2)
        // The time-lapse: each photograph of the same branch comes up over the previous one.
        .to(views[1], { opacity: 1, duration: 1.3, ease: 'power1.inOut' }, 1.2)
        .to('.intro__sun', { opacity: .55, duration: 2.4, ease: 'power1.inOut' }, 1.4)
        .to(views[2], { opacity: 1, duration: 1.3, ease: 'power1.inOut' }, 2.8)
        .call(() => { FX.sound.shimmer(); startIntroPetals(); }, null, 3.6)
        .to(views[3], { opacity: 1, duration: 1.4, ease: 'power1.inOut' }, 4.4)
        .to('.intro__sun', { opacity: 1, duration: 1.6 }, 4.4)
        .to(views, { scale: 1.04, duration: 6, ease: 'power1.out' }, 1)
        // Hold on the blossom, then pass through the window.
        .to(windowImg, { scale: 2.8, opacity: 0, duration: 2, ease: 'power2.in' }, 7)
        .to('.intro__band', { opacity: 0, duration: 1.2, ease: 'power1.in' }, 7)
        .to(views, { scale: 1.3, duration: 2.2, ease: 'power2.in' }, 7)
        .to('.intro__flash', { opacity: .95, duration: .9, ease: 'power2.in' }, 8.2)
        .call(() => finish(false), null, 9.1);
    }
    function startIntroPetals() {
      if (reduced) return;
      introPetals = new FX.Petals($('.intro__petals'), { count: lite ? 8 : 16, sheet: 'art/petals.webp' });
      introPetals.setEnabled(true);
    }

    function finish(instant) {
      if (finished) return;
      finished = true;
      master?.kill(); idle?.kill();
      document.body.classList.add('opened');
      intro.classList.add('is-gone');
      intro.setAttribute('aria-hidden', 'true');
      skip.hidden = true;
      setTimeout(() => { if (introPetals) introPetals.enabled = false; }, 1200);
      petals?.setEnabled(true);
      heroEntrance(instant);
      requestAnimationFrame(() => ScrollTrigger?.refresh());
      $('.hero__names')?.focus({ preventScroll: true });
    }

    function heroEntrance(instant) {
      if (!gsap || reduced) return;
      const tl = gsap.timeline({ delay: instant ? 0 : .1, defaults: { ease: 'expo.out' } });
      tl.from('.hero__sky', { scale: 1.2, duration: 3.4 }, 0)
        .from('.hero__branches', { scale: 1.3, opacity: 0, duration: 3.2 }, 0)
        .from('.hero__kicker', { y: 16, opacity: 0, duration: 1.4 }, .8)
        .from('.hero__name', { y: 36, opacity: 0, duration: 2, stagger: .45 }, 1)
        .from('.hero__amp', { scale: .3, opacity: 0, duration: 1.4, ease: 'back.out(2)' }, 1.5)
        .from('.hero__date', { y: 18, opacity: 0, scale: .92, duration: 1.3 }, 2.1)
        .from('.hero__cue', { opacity: 0, duration: 1.2 }, 2.8);
    }

    /* ── Ambient petals over the whole page ── */
    const petals = reduced ? null : new FX.Petals($('.petals'), { count: lite ? 12 : 22, sheet: 'art/petals.webp' });
    app.on('tier', next => {
      if (next !== 'lite' || lite) return;
      lite = true;
      if (petals) { petals.count = 12; petals.items.length = Math.min(petals.items.length, 12); }
    });
    addEventListener('resize', () => { if (!opening && !finished) { layoutWindow(); fog.resize(); fog.paint(); drawTrace(traced); } }, { passive: true });

    /* ── Scroll scenes ── */
    const sections = $$('.section');
    if (!reduced && 'IntersectionObserver' in window) {
      root.classList.add('motion');
      sections.forEach(section => Array.from(section.children).forEach((child, i) => {
        if (child.matches('.divider,canvas,[hidden]')) return;
        child.classList.add('rise');
        child.style.setProperty('--d', `${Math.min(i, 8) * .09}s`);
      }));
      const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        entry.target.dispatchEvent(new CustomEvent('orik:in'));
        io.unobserve(entry.target);
      }), { threshold: .18, rootMargin: '0px 0px -8% 0px' });
      sections.forEach(s => io.observe(s));
    } else {
      root.classList.add('no-motion');
      sections.forEach(s => s.classList.add('in'));
    }

    if (gsap && ScrollTrigger && !reduced) {
      gsap.registerPlugin(ScrollTrigger);
      const heroScrub = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 };
      gsap.to('.hero__sky', { yPercent: 14, ease: 'none', scrollTrigger: heroScrub });
      gsap.to('.hero__branches', { scale: 1.16, ease: 'none', scrollTrigger: heroScrub });
      gsap.to('.hero__copy', { yPercent: 30, opacity: 0, ease: 'none', scrollTrigger: { ...heroScrub, end: '60% top' } });
      gsap.fromTo('.finale__art', { scale: 1.14 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.finale', start: 'top bottom', end: 'bottom bottom', scrub: .6 } });
      gsap.from('.finale__title', { y: 40, opacity: 0, scale: .9, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.finale', start: 'top 55%' } });
      gsap.from('.finale__names', { y: 20, opacity: 0, duration: 1.2, delay: .3, ease: 'expo.out', scrollTrigger: { trigger: '.finale', start: 'top 55%' } });
      gsap.fromTo('.letter__sprig', { rotate: -14, scale: .85 }, { rotate: 6, scale: 1, ease: 'none', scrollTrigger: { trigger: '.letter', start: 'top bottom', end: 'center center', scrub: .8 } });
      // The vine grows with the scroll and each moment blossoms as it is reached.
      const vine = $('.vine');
      ScrollTrigger.create({
        trigger: vine, start: 'top 72%', end: 'bottom 62%', scrub: .5,
        onUpdate(self) {
          vine.style.setProperty('--grow', self.progress.toFixed(3));
          const h = vine.offsetHeight;
          $$('.vine__item', vine).forEach(li => li.classList.toggle('lit', (li.offsetTop + li.offsetHeight * .5) / h <= self.progress + .04));
        }
      });
    } else {
      $$('.vine__item').forEach(li => li.classList.add('lit'));
    }

    /* Day number gathered from falling apricot petals */
    let petalSheet = null;
    FX.loadImage('art/petals.webp').then(img => { petalSheet = img; });
    const dateSection = $('#date');
    dateSection.addEventListener('orik:in', () => {
      if (reduced || !data.date?.day) return;
      // The petals lift off the wreath and fly into the middle, where they form the day.
      const field = new FX.SeedField($('.date__petals'), { size: 6, sheet: petalSheet, cells: 6 });
      const w = field.w, h = field.h;
      const glyphs = FX.textPoints(String(data.date.day), `600 ${Math.round(h * .42)}px "Cormorant Garamond", Georgia, serif`, field.size * 1.35, w * .56);
      dateSection.classList.add('gathering');
      glyphs.pts.forEach((pt, i) => {
        const a = rand(0, Math.PI * 2), r = w * rand(.36, .45);
        const p = field.add({ x: w / 2 + Math.cos(a) * r, y: h / 2 + Math.sin(a) * r, s: rand(.85, 1.15), vr: rand(-2, 2) });
        field.seek(p, w / 2 + pt.x, h / 2 + pt.y + h * .02, rand(1.5, 2.1), i / glyphs.pts.length * 1.1, 14);
      });
      field.start();
      setTimeout(() => {
        dateSection.classList.remove('gathering');
        field.particles.forEach(p => { p.mode = 'fade'; p.fade = 1.2; p.vx = rand(-20, 20); p.vy = rand(10, 40); });
        field.start();
      }, 3600);
    }, { once: true });

    /* Countdown digits drop in when they change */
    if (!reduced) $$('.countdown strong[data-unit]').forEach(el => {
      let last = el.textContent;
      new MutationObserver(() => {
        if (el.textContent === last) return;
        last = el.textContent;
        el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });

    /* Gallery: the centred arch comes forward */
    const track = $('.gallery__track');
    if (track && !reduced) {
      const shape = () => {
        const mid = track.scrollLeft + track.clientWidth / 2;
        $$('.gallery__slide', track).forEach(slide => {
          const d = clamp(Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - mid) / track.clientWidth, 0, 1);
          slide.style.setProperty('--s', (1 - d * .22).toFixed(3));
          slide.style.setProperty('--o', (1 - d * .55).toFixed(3));
        });
      };
      track.addEventListener('scroll', () => requestAnimationFrame(shape), { passive: true });
      new MutationObserver(shape).observe(track, { childList: true });
      addEventListener('resize', shape, { passive: true });
      shape();
    }

    /* Venue: the map loads only when asked */
    const mapToggle = $('[data-map-toggle]'), mapBox = $('.venue__map');
    const lat = parseFloat(data.venue?.lat), lng = parseFloat(data.venue?.lng);
    const mapLabels = { uz: ['Xaritani shu yerda ko‘rish', 'Suratni ko‘rish'], ru: ['Показать карту здесь', 'Показать фото'], en: ['Show the map here', 'Show the photo'],
      'map-uz': ['Interaktiv xaritani ochish', 'Xaritani yopish'], 'map-ru': ['Открыть интерактивную карту', 'Закрыть карту'], 'map-en': ['Open the interactive map', 'Close the map'] };
    if (mapToggle && Number.isFinite(lat) && Number.isFinite(lng)) {
      const labels = mapLabels[app.lang] || mapLabels.uz;
      mapToggle.hidden = false;
      if (mapBox.closest('.has-venue-map')) mapToggle.textContent = (mapLabels['map-' + app.lang] || mapLabels['map-uz'])[0];
      mapToggle.addEventListener('click', () => {
        if (!mapBox.firstChild) {
          const frame = document.createElement('iframe');
          frame.title = data.venue?.name || 'Xarita';
          frame.loading = 'lazy';
          frame.referrerPolicy = 'no-referrer';
          frame.src = `/maps/venue?latitude=${lat}&longitude=${lng}`;
          mapBox.append(frame);
        }
        mapBox.hidden = !mapBox.hidden;
        // Without a venue photo the frame already shows the street map (core.js), so the toggle
        // switches between that and the interactive one.
        const shown = mapBox.closest('.has-venue-map') ? (mapLabels['map-' + app.lang] || mapLabels['map-uz']) : labels;
        mapToggle.textContent = shown[mapBox.hidden ? 0 : 1];
      });
    }

    /* To‘yona card turns over */
    const gift = $('.gift__card');
    gift?.addEventListener('click', () => gift.setAttribute('aria-expanded', String(gift.getAttribute('aria-expanded') !== 'true')));

    /* RSVP: a handful of petals and gold for “Kelaman” */
    let burst = null;
    app.on('rsvp', answer => {
      if (answer?.status !== 'yes' || reduced) return;
      const canvas = $('.rsvp__burst');
      burst = burst || new FX.SeedField(canvas, { size: 6, gravity: 900, sheet: petalSheet, cells: 6 });
      burst.resize();
      const card = $('.rsvp__card').getBoundingClientRect(), box = canvas.getBoundingClientRect();
      const x = card.left - box.left + card.width / 2, y = card.top - box.top + card.height * .35;
      for (let i = 0; i < (lite ? 24 : 50); i++) {
        const a = rand(-Math.PI * .95, -Math.PI * .05), v = rand(320, 700);
        burst.add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, mode: 'fade', fade: rand(1.4, 2.2), gold: i % 5 === 0, vr: rand(-4, 4) });
      }
      burst.start();
    });
    app.on('wish', () => { if (!reduced) $$('.wishes__list .wish').at(-1)?.classList.add('new-wish'); });

    /* Finale: cover-fit the painting by hand so the lantern glows stay on the lanterns */
    const finaleWorld = $('.finale__world'), finaleArt = $('.finale__art');
    const fitFinale = () => {
      const w = finaleWorld.clientWidth, h = finaleWorld.clientHeight;
      let aw = h * 2 / 3, ah = h;
      if (aw < w) { aw = w; ah = w * 1.5; }
      finaleArt.style.setProperty('--art-w', `${aw}px`);
      finaleArt.style.setProperty('--art-h', `${ah}px`);
      finaleArt.style.setProperty('--art-l', `${(w - aw) * .3}px`);
      finaleArt.style.setProperty('--art-t', `${(h - ah) * .5}px`);
    };
    fitFinale();
    addEventListener('resize', fitFinale, { passive: true });

    /* Finale fireflies */
    if (!reduced) new FX.Motes($('.finale__flies'), { count: lite ? 8 : 18, color: '255,220,140', area: { x: 0, y: .35, w: 1, h: .55 }, rise: 10, glow: 1 });
  });
})();
