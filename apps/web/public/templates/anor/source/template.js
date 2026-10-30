/* Anor: the guest cuts a pomegranate on a Rishton plate, its seeds burst and rise into the
   couple's initials, and the light opens into a sunrise orchard. */
(() => {
  'use strict';
  const app = window.Marhamat;
  const FX = window.AnorFX;
  if (!app || !FX) return;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const { rand, clamp } = FX;

  /* Where things sit inside the artwork, as fractions of each image. Update these when an
     image is replaced (art/ART_BRIEF.md lists the measured values). */
  const ART = {
    stage: { focusX: .52, focusY: .6, plate: { x: .515, y: .625, rx: .43, ry: .115 } },
    fruit: { width: .5, base: .985 },          // width as a share of the plate diameter; the fruit's base as a share of its image height
    hero: { sunY: '43%' }
  };

  app.on('ready', () => {
    const root = document.documentElement;
    const intro = $('#intro');
    const fruit = $('#fruit');
    const stage = $('.intro__stage');
    const skip = $('#skip-intro');
    const seam = $$('.fruit__seam path');
    const whole = $('.fruit__whole');
    const halves = [$('.fruit__half--l'), $('.fruit__half--r')];
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const reduced = app.reducedMotion;
    let lite = app.tier === 'lite';
    const data = app.data;

    const names = [data.groom, data.bride].filter(Boolean).join(' & ');
    if (names) document.title = `${names} — ${data.eventType || 'Taklifnoma'}`;
    const meta = $('meta[name="description"]');
    if (meta) meta.content = [names, data.eventType, data.date?.long, data.venue?.name].filter(Boolean).join(' · ');
    const hero = $('.hero');
    hero.style.setProperty('--sun-y', ART.hero.sunY);
    if (data.rsvp?.enabled === false) $('#rsvp').hidden = true;
    if (data.toyona?.enabled === false) $('#toyona').hidden = true;

    /* ── Place the fruit on the plate for any screen shape ── */
    let geo = null, seeds = null, opened = false;
    function layout() {
      const box = intro.getBoundingClientRect();
      const W = stage.naturalWidth || 900, H = stage.naturalHeight || 1350;
      const scale = Math.max(box.width / W, box.height / H);
      const ox = (box.width - W * scale) * ART.stage.focusX, oy = (box.height - H * scale) * ART.stage.focusY;
      const p = ART.stage.plate;
      const plate = { x: ox + p.x * W * scale, y: oy + p.y * H * scale, rx: p.rx * W * scale, ry: p.ry * H * scale };
      const size = Math.min(plate.rx * 2 * ART.fruit.width, box.width * .62, box.height * .34);
      // The fruit images are contained (centred) in a square box; place the measured base on the plate.
      const ratio = whole.naturalWidth && whole.naturalHeight ? Math.min(1, whole.naturalHeight / whole.naturalWidth) : 1;
      const bottom = .5 - ratio / 2 + ART.fruit.base * ratio;
      fruit.style.left = `${plate.x}px`;
      fruit.style.top = `${plate.y}px`;
      fruit.style.width = `${size}px`;
      fruit.style.transform = `translate(-50%,-${bottom * 100}%)`;
      intro.style.setProperty('--fx', `${plate.x}px`);
      intro.style.setProperty('--fy', `${plate.y - size * .45}px`);
      geo = { box, plate, size, cx: plate.x, top: plate.y - size * bottom };
    }
    layout();
    [stage, whole].forEach(img => { if (!img.complete) img.addEventListener('load', layout, { once: true }); });
    addEventListener('resize', () => { if (!opened && !opening) layout(); }, { passive: true });

    const seedsCanvas = $('.intro__seeds');
    const dust = !reduced ? new FX.Motes($('.intro__dust'), { count: lite ? 10 : 22, area: { x: 0, y: .05, w: .75, h: .6 }, rise: 4, glow: .7 }) : null;
    dust?.start();

    /* ── Act 1: arrival ── */
    let idle = null;
    if (gsap && !reduced) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(stage, { scale: 1.12, opacity: 0, duration: 2.2, ease: 'power2.out' }, 0)
        .from('.intro__beam', { opacity: 0, duration: 2 }, .3)
        .from(whole, { y: -60, opacity: 0, duration: .9, ease: 'bounce.out' }, .55)
        .from('.fruit__shadow', { scale: .3, opacity: 0, duration: .9, ease: 'bounce.out' }, .55)
        .from('.intro__kicker', { y: 12, opacity: 0, duration: .8 }, .7)
        .from('.intro__greeting', { y: 18, opacity: 0, duration: 1 }, .85)
        .from('.intro__hint', { y: 16, opacity: 0, duration: .8 }, 1.3)
        .from('.fruit__ring', { opacity: 0, duration: .6 }, 1.4);
      // A gentle idle: the fruit breathes so it reads as touchable.
      idle = gsap.to(whole, { scale: 1.025, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
    }

    /* ── Act 2: cut ── */
    let opening = false, finished = false, master = null, drag = null;
    const setSeam = progress => seam.forEach(path => { path.style.strokeDashoffset = String(1 - progress); });

    intro.addEventListener('pointerdown', event => {
      if (opening || event.target.closest('.intro__skip')) return;
      drag = { x: event.clientX, y: event.clientY, progress: 0, cutting: false, id: event.pointerId };
      try { intro.setPointerCapture(event.pointerId); } catch (_) {}
    });
    intro.addEventListener('pointermove', event => {
      if (!drag || opening || event.pointerId !== drag.id) return;
      const dy = Math.abs(event.clientY - drag.y), dx = Math.abs(event.clientX - drag.x);
      if (!drag.cutting && dy > 14 && dy > dx * .8) {
        drag.cutting = true;
        intro.classList.add('is-cutting');
        idle?.pause();
        FX.sound.unlock();
      }
      if (drag.cutting) {
        drag.progress = clamp(dy / (geo.size * .75), 0, 1);
        setSeam(drag.progress);
        if (gsap) gsap.set(whole, { x: rand(-1, 1) * drag.progress * 2 });
      }
    });
    const release = event => {
      if (!drag || opening) return;
      const { cutting, progress } = drag;
      drag = null;
      if (event.type === 'pointercancel') { setSeam(0); intro.classList.remove('is-cutting'); idle?.resume(); return; }
      if (!cutting || progress > .42) open(progress);
      else { // a short, hesitant cut heals over
        intro.classList.remove('is-cutting');
        idle?.resume();
        if (gsap) gsap.to({ p: progress }, { p: 0, duration: .35, onUpdate() { setSeam(this.targets()[0].p); } }); else setSeam(0);
      }
    };
    intro.addEventListener('pointerup', release);
    intro.addEventListener('pointercancel', release);
    // Keyboard activation (pointer taps are handled on pointerup).
    $('#open-invitation').addEventListener('click', event => { if (event.detail === 0) open(0); });
    skip.addEventListener('click', () => { if (!opening) app.open(); finish(true); });

    function open(from = 0) {
      if (finished) return;
      if (opening) { finish(true); return; }
      opening = true;
      app.open();
      FX.sound.unlock();
      window.scrollTo(0, 0);
      intro.classList.add('is-cutting');
      skip.hidden = false;
      if (reduced || !gsap) { finish(true); return; }
      idle?.kill();
      gsap.set(whole, { scale: 1 });
      layout();
      seeds = new FX.SeedField(seedsCanvas, {
        size: clamp(geo.size / 30, 4.2, 8),
        gravity: geo.box.height * 1.5, // low gravity: the burst plays in gentle slow motion
        floor: { x: geo.plate.x, y: geo.plate.y - geo.size * .02, rx: geo.plate.rx * .9, ry: geo.plate.ry * .85, table: geo.plate.y + geo.plate.ry * 1.9 }
      });
      const tl = master = gsap.timeline();
      const body = $('.fruit__body');
      const frames = $$('.fruit__frame');
      const S = geo.size;
      // 1. The cut: the seam draws down while the fruit trembles harder.
      const at = (1 - from) * 1.1;
      tl.to({ p: from }, { p: 1, duration: at, ease: 'power1.inOut', onUpdate() { setSeam(this.targets()[0].p); } }, 0)
        .to(body, { x: '+=1.2', duration: .05, repeat: Math.max(1, Math.round(at / .05)), yoyo: true, ease: 'none' }, 0)
        .call(crack, null, at)
        .to(seam, { opacity: 0, duration: .6 }, at + .1)
        // 2. The real break, photo by photo: a tear at the crown, the tear runs down and widens,
        //    the halves lean apart, then they separate. Each frame comes up over the previous one.
        .to(frames[0], { opacity: 1, duration: .5, ease: 'power1.inOut' }, at)
        .call(() => spill(lite ? 2 : 5, .25, .4), null, at + .7)
        .to(frames[1], { opacity: 1, duration: .55, ease: 'power1.inOut' }, at + 1)
        .call(() => spill(lite ? 4 : 10, .3, .5), null, at + 1.4)
        .to(frames[2], { opacity: 1, duration: .55, ease: 'power1.inOut' }, at + 2)
        .fromTo('.fruit__glow', { opacity: 0, scale: .6 }, { opacity: .7, scale: 1.05, duration: 1.2, ease: 'power2.out' }, at + 1.6)
        .call(() => spill(lite ? 8 : 18, .45, .5), null, at + 2.3)
        .to(halves, { opacity: 1, duration: .5, ease: 'power1.inOut' }, at + 3)
        .set([whole, ...frames], { opacity: 0 }, at + 3.55)
        // 3. The torn halves keep easing apart while the seeds pour out.
        .to(halves[0], { x: -S * .1, rotation: -9, y: S * .015, duration: 2.2, ease: 'power2.inOut' }, at + 3.55)
        .to(halves[1], { x: S * .1, rotation: 9, y: S * .015, duration: 2.2, ease: 'power2.inOut' }, at + 3.55)
        .call(() => spill(lite ? 24 : 50, .8, .35), null, at + 3.6)
        .call(() => spill(lite ? 16 : 40, .7, .35), null, at + 4)
        .call(() => spill(lite ? 8 : 30, .55, .4), null, at + 4.4)
        .to('.fruit__glow', { opacity: .45, scale: 1.3, duration: 2.4, ease: 'power2.out' }, at + 3.4)
        .fromTo('.intro__bloom', { opacity: 0 }, { opacity: .16, duration: .4 }, at + 3.6)
        .to('.intro__bloom', { opacity: 0, duration: 1.6, ease: 'power2.out' }, at + 4)
        .to('.intro__rays', { opacity: .9, duration: 2.8, ease: 'power2.out' }, at + 2.4)
        .call(() => intro.classList.add('is-open'), null, at + .3)
        .to(['.intro__copy', '.intro__hint'], { opacity: 0, y: -10, duration: .9, ease: 'power2.out' }, at + .2)
        .to(stage, { scale: 1.05, duration: 11, ease: 'power1.out' }, at);
      // ≈ 11 s from the tap: cut, the break photo by photo, seeds settle, initials rise and hold, light.
      // Lite keeps all of it (core can switch to lite on a busy first second); it only spills fewer seeds.
      tl.call(formInitials, null, at + 5.6)
        .fromTo(stage, { filter: 'brightness(1)' }, { filter: 'brightness(.6)', duration: 1.8, ease: 'power2.inOut', immediateRender: false }, at + 5.6)
        .to(fruit, { opacity: .55, duration: 1.8 }, at + 5.6)
        .to('.intro__bloom', { opacity: 1, duration: 1.2, ease: 'power2.in' }, at + 9)
        .call(() => finish(false), null, at + 10.2);
    }

    function crack() {
      FX.sound.crack();
      try { navigator.vibrate?.([14, 30, 22]); } catch (_) {}
    }

    // Seeds leave through the gap: power scales the throw, spread staggers their release.
    function spill(n, power, spread) {
      const top = geo.top + geo.size * .24, len = geo.size * .62;
      for (let i = 0; i < n; i++) {
        const k = Math.random(), side = Math.random() < .5 ? -1 : 1, p = power * rand(.6, 1.15);
        seeds.add({
          x: geo.cx + side * rand(0, geo.size * .05), y: top + k * len,
          vx: side * rand(.2, 1.3) * geo.size * p * (1.1 - k * .5) * .76,
          vy: -rand(.5, 2.4) * geo.size * p * (1.2 - k * .7) * .76,
          vr: rand(-6, 6), delay: Math.random() * spread
        });
      }
      seeds.start();
    }

    function initialsTargets() {
      const box = geo.box, spacing = seeds.size * 1.32;
      const font = s => `600 ${s}px "Cormorant Garamond", Georgia, serif`;
      const letters = [data.groom, data.bride].filter(Boolean).map(v => String(v).trim().charAt(0).toUpperCase());
      const size = Math.min(box.width * .34, 170);
      const parts = letters.map(l => FX.textPoints(l, font(size), spacing, 0, { stroke: spacing * 1.1 }));
      const heart = Object.assign(FX.heartPoints(size * .42, spacing * .95), { base: size * .3 });
      const groups = parts.length === 2 ? [parts[0], heart, parts[1]] : parts.length === 1 ? [parts[0], heart] : [heart];
      const gap = size * .08;
      const total = groups.reduce((s, g) => s + g.w, 0) + gap * (groups.length - 1);
      const fit = Math.min(1, box.width * .86 / total);
      let x = box.width / 2 - total * fit / 2;
      const y = Math.min(geo.top - size * .2, box.height * .46); // shared baseline
      const pts = [];
      groups.forEach(g => {
        const cx = x + g.w * fit / 2;
        g.pts.forEach(p => pts.push({ x: cx + p.x * fit, y: y + (p.y - g.base) * fit }));
        x += g.w * fit + gap * fit;
      });
      return pts;
    }

    function formInitials() {
      const targets = initialsTargets().sort((a, b) => a.x - b.x);
      const pool = seeds.particles.slice().sort((a, b) => a.x - b.x);
      while (pool.length < targets.length) pool.push(seeds.add({ x: geo.cx + rand(-10, 10), y: geo.top + geo.size * .5, resting: true }));
      // Spread the chosen seeds evenly through the pool so the plate keeps some.
      const step = pool.length / targets.length;
      FX.sound.shimmer();
      targets.forEach((t, i) => {
        const p = pool[Math.floor(i * step)];
        p.twinkle = true;
        seeds.seek(p, t.x, t.y, rand(1.9, 2.5), Math.abs(t.x - geo.box.width / 2) / geo.box.width * .8 + rand(0, .3), geo.size * .5);
        gsap?.to(p, { grow: 1.18, duration: 1.6, delay: .9 });
      });
      seeds.start();
    }

    function finish(instant) {
      if (finished) return;
      finished = true; opened = true;
      master?.kill();
      idle?.kill();
      dust?.stop();
      document.body.classList.add('opened');
      intro.classList.add('is-open', 'is-gone');
      intro.setAttribute('aria-hidden', 'true');
      skip.hidden = true;
      setTimeout(() => { seeds?.stop(); seeds?.clear(); }, 1000);
      petals?.setEnabled(true);
      heroEntrance(instant);
      requestAnimationFrame(() => ScrollTrigger?.refresh());
      $('.hero__names')?.focus({ preventScroll: true });
    }

    /* ── Act 3: the orchard ── */
    function heroEntrance(instant) {
      if (!gsap || reduced) return;
      const tl = gsap.timeline({ delay: instant ? 0 : .1, defaults: { ease: 'expo.out' } });
      tl.from('.hero__sky', { scale: 1.18, duration: 3.4 }, 0)
        .from('.hero__branches', { scale: 1.3, opacity: 0, duration: 3.2 }, 0)
        .from('.hero__table', { yPercent: 18, opacity: 0, duration: 2.6 }, .25)
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
      if (petals) { petals.count = 14; petals.items.length = Math.min(petals.items.length, 14); }
    });

    /* ── Scroll scenes ── */
    const sections = $$('.section');
    if (!reduced && 'IntersectionObserver' in window) {
      root.classList.add('motion');
      sections.forEach(section => Array.from(section.children).forEach((child, i) => {
        if (child.matches('.islimi,canvas,[hidden]')) return;
        child.classList.add('rise');
        child.style.setProperty('--d', `${Math.min(i, 8) * .09}s`);
      }));
      const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        entry.target.dispatchEvent(new CustomEvent('anor:in'));
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
      gsap.to('.hero__table', { yPercent: -10, ease: 'none', scrollTrigger: heroScrub });
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

    /* Day number written in golden seeds */
    const dateSection = $('#date');
    dateSection.addEventListener('anor:in', () => {
      if (reduced || lite || !data.date?.day) return;
      const field = new FX.SeedField($('.date__seeds'), { kind: 'gold', size: 3.6 });
      const w = field.w, h = field.h;
      const glyphs = FX.textPoints(String(data.date.day), `600 ${Math.round(h * .62)}px "Cormorant Garamond", Georgia, serif`, field.size * 1.25, w * .9);
      dateSection.classList.add('seeding');
      glyphs.pts.forEach((pt, i) => {
        const a = rand(0, Math.PI * 2), r = Math.max(w, h) * rand(.55, .9);
        const p = field.add({ x: w / 2 + Math.cos(a) * r, y: h / 2 + Math.sin(a) * r, gold: true, s: rand(.9, 1.15), twinkle: true });
        field.seek(p, w / 2 + pt.x, h / 2 + pt.y, rand(.9, 1.3), i / glyphs.pts.length * .5, 20);
      });
      field.start();
      setTimeout(() => {
        dateSection.classList.remove('seeding');
        field.particles.forEach(p => { p.mode = 'fade'; p.fade = 1.1; p.vx = 0; p.vy = 0; p.twinkle = false; });
        field.start();
      }, 2300);
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

    /* RSVP: a handful of seeds and gold for “Kelaman” */
    let burst = null;
    app.on('rsvp', answer => {
      if (answer?.status !== 'yes' || reduced) return;
      const canvas = $('.rsvp__burst');
      burst = burst || new FX.SeedField(canvas, { size: 5.5, gravity: 1400 });
      burst.resize();
      const card = $('.rsvp__card').getBoundingClientRect(), box = canvas.getBoundingClientRect();
      const x = card.left - box.left + card.width / 2, y = card.top - box.top + card.height * .35;
      for (let i = 0; i < (lite ? 24 : 56); i++) {
        const a = rand(-Math.PI * .95, -Math.PI * .05), v = rand(380, 820);
        burst.add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, mode: 'fade', fade: rand(1.2, 1.9), gold: i % 4 === 0 });
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
