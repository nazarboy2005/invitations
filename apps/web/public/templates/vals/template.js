/* Vals: a Victorian zoetrope stands on a walnut table in a candle-lit salon. The guest spins the drum
   with a finger; once it turns fast enough the slits blur and the silhouette couple on the inner strip
   starts to waltz (real frame-by-frame animation, drawn live on canvas). Keep it spinning and the lamp
   inside flares, the camera dives through the drum and lands in a moonlit Viennese ballroom where the
   same couple keeps dancing across the parquet. */
(() => {
  'use strict';
  const app = window.Marhamat;
  if (!app) return;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const frac = v => v - Math.floor(v);
  const TAU = Math.PI * 2;

  /* Where the drum stands in the 1024×1536 salon painting (art/room.webp), and where the couple dances
     in the ballroom painting (art/ballroom.webp). */
  const ROOM = { w: 1024, h: 1536, posY: .72, x: .5, y: .705 };
  const HALL = { w: 1024, h: 1536, posY: .5, floorX: .5, floorY: .79 };
  const SLOTS = 12, SLIT = .2, DANCE_SECONDS = 3.2;

  app.on('ready', () => {
    const gsap = window.gsap, ST = window.ScrollTrigger, Waltz = window.ValsWaltz;
    const data = app.data, root = document.documentElement;
    const reduced = !!app.reducedMotion, lite = app.tier === 'lite' || reduced;
    const intro = $('#intro'), stage = $('#stage'), spinButton = $('#spin'), skip = $('#skip');
    const whisper = $('#whisper'), meter = $('#meter'), flash = $('.flash');
    if (gsap && ST) gsap.registerPlugin(ST);

    /* ── Data-driven details ── */
    const couple = [data.groom, data.bride].filter(Boolean).join(' & ');
    document.title = [couple, data.eventType].filter(Boolean).join(' — ') || document.title;
    const meta = $('meta[name="description"]');
    if (meta) meta.content = [data.eventType, couple, data.date?.long, data.venue?.name].filter(Boolean).join(' · ');
    if (data.rsvp?.enabled === false) $('#rsvp').hidden = true;
    if (data.toyona?.enabled === false) $('#toyona').hidden = true;
    const hideEmpty = (section, list) => { if (!(Array.isArray(data[list]) && data[list].length)) $(section).hidden = true; };
    hideEmpty('#program', 'program'); hideEmpty('#gallery', 'gallery'); hideEmpty('#contacts', 'contacts');
    if (!data.message && !data.hosts) $('#invitation-text').hidden = true;
    $$('[data-initial]').forEach(el => { el.textContent = String(data[el.dataset.initial] || '').trim().charAt(0).toLocaleUpperCase(); });
    if (!data.bride) $$('.intro__names b, .hero__names b').forEach(el => { el.hidden = true; });

    const t = text => { const row = app.lang !== 'uz' && window.MARHAMAT_I18N?.[text]; return row ? row[app.lang === 'ru' ? 0 : 1] || text : text; };
    root.classList.add('vals-hold');
    const waltzReady = Waltz.load();
    let opened = false;
    const openOnce = () => { if (!opened) { opened = true; app.open(); root.classList.add('vals-hold'); } };

    /* ════════════════════════ The zoetrope ════════════════════════ */
    const zoetrope = (() => {
      const canvas = $('#zoetrope'), ctx = canvas.getContext('2d');
      const st = { phi: 0, omega: .55, drag: false, touched: false, glow: 0, anim: 0, blur: 0, danced: 0, motor: 0 };
      let W = 0, H = 0, dpr = 1, geo = null, strip = null, shell = null, running = false, last = 0, raf = 0;

      function layout() {
        const sc = Math.max(W / ROOM.w, H / ROOM.h), ox = (W - ROOM.w * sc) / 2, oy = (H - ROOM.h * sc) * ROOM.posY;
        const cx = ox + ROOM.w * sc * ROOM.x, footY = oy + ROOM.h * sc * ROOM.y;
        const R = Math.min(W * .38, H * .2, 230), k = .24, hd = R * .96, foot = R * .1, stem = R * .3;
        const yB = footY - foot - stem, yT = yB - hd;
        return { cx, footY, R, k, ry: R * k, hd, foot, stem, yB, yT };
      }

      /* Inner paper strip: twelve cells, one waltz frame each, printed in ink on cream paper. */
      function buildStrip(art) {
        const { R, hd } = geo, cell = Math.round(TAU * R / SLOTS * dpr), h = Math.round(hd * dpr);
        const c = document.createElement('canvas'); c.width = cell * SLOTS; c.height = h; const g = c.getContext('2d');
        const paper = g.createLinearGradient(0, 0, 0, h); paper.addColorStop(0, '#e9dcbd'); paper.addColorStop(.5, '#f6ecd4'); paper.addColorStop(1, '#dccaa2');
        g.fillStyle = paper; g.fillRect(0, 0, c.width, h);
        g.fillStyle = 'rgba(122,88,40,.08)'; for (let i = 0; i < c.width; i += 3) g.fillRect(i, 0, 1, h);
        g.fillStyle = '#a07a38'; g.fillRect(0, h * .06, c.width, Math.max(1, h * .012)); g.fillRect(0, h * .93, c.width, Math.max(1, h * .012));
        for (let i = 0; i < SLOTS; i++) {
          if (art) Waltz.draw(g, art, i, cell * (i + .5), h * .9, h * .8);
          g.fillStyle = '#a07a38'; g.beginPath(); const x = cell * i, y = h * .5, r = h * .025; g.moveTo(x, y - r); g.lineTo(x + r * .6, y); g.lineTo(x, y + r); g.lineTo(x - r * .6, y); g.fill();
        }
        return { canvas: c, cell };
      }

      /* Outer shell: midnight lacquer with gold pinstripes and a gold star between the slits. */
      function buildShell() {
        const { R, hd } = geo, cell = Math.round(TAU * R / SLOTS * dpr), h = Math.round(hd * dpr);
        const c = document.createElement('canvas'); c.width = cell * SLOTS; c.height = h; const g = c.getContext('2d');
        const lacquer = g.createLinearGradient(0, 0, 0, h); lacquer.addColorStop(0, '#1d2a5c'); lacquer.addColorStop(.55, '#141d44'); lacquer.addColorStop(1, '#0b1029');
        g.fillStyle = lacquer; g.fillRect(0, 0, c.width, h);
        const gold = g.createLinearGradient(0, 0, 0, h); gold.addColorStop(0, '#f3dc9c'); gold.addColorStop(.5, '#c99a4c'); gold.addColorStop(1, '#8e6526');
        g.fillStyle = gold;
        for (const y of [.08, .115, .885, .92]) g.fillRect(0, h * y, c.width, Math.max(1, h * .01));
        for (let i = 0; i < SLOTS; i++) {
          const x = cell * i, y = h * .5, r = h * .07;
          g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x + r * .2, y - r * .2, x + r * .7, y); g.quadraticCurveTo(x + r * .2, y + r * .2, x, y + r); g.quadraticCurveTo(x - r * .2, y + r * .2, x - r * .7, y); g.quadraticCurveTo(x - r * .2, y - r * .2, x, y - r); g.fill();
          g.fillRect(x - Math.max(.5, h * .004), h * .16, Math.max(1, h * .008), h * .2); g.fillRect(x - Math.max(.5, h * .004), h * .64, Math.max(1, h * .008), h * .2);
        }
        return { canvas: c, cell };
      }

      function resize() {
        W = innerWidth; H = innerHeight; dpr = Math.min(devicePixelRatio || 1, lite ? 1.5 : 2);
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
        geo = layout(); strip = buildStrip(Waltz.image ? Waltz.sheet('ink', '#16122a') : null); shell = buildShell();
        intro.style.setProperty('--drum-x', `${geo.cx}px`); intro.style.setProperty('--drum-y', `${geo.footY}px`); intro.style.setProperty('--drum-r', `${geo.R}px`);
        draw();
      }

      function columns(tex, x0, x1, step, top, map, alphaOf) {
        const { cx, R, hd } = geo, texW = tex.canvas.width, texH = tex.canvas.height;
        for (let x = x0; x < x1; x += step) {
          const s = clamp((x + step / 2 - cx) / R, -1, 1), c = Math.sqrt(1 - s * s), as = Math.asin(s);
          const alpha = alphaOf ? alphaOf(as) : 1; if (alpha < .01) continue;
          const srcW = clamp(texW / (TAU * R * Math.max(c, .06)) * step, 1, tex.cell);
          let sx = map(as) * texW; sx = clamp(sx, 0, texW - srcW);
          ctx.globalAlpha = alpha; ctx.drawImage(tex.canvas, sx, 0, srcW, texH, x, top(c), step + .35, hd);
        }
        ctx.globalAlpha = 1;
      }

      function wallPath(yTop, yBottom, front) {
        const { cx, R, ry } = geo;
        ctx.beginPath();
        if (front) { ctx.ellipse(cx, yTop, R, ry, 0, Math.PI, 0, true); ctx.ellipse(cx, yBottom, R, ry, 0, 0, Math.PI, false); }
        else { ctx.ellipse(cx, yTop, R, ry, 0, Math.PI, TAU, false); ctx.ellipse(cx, yBottom, R, ry, 0, TAU, Math.PI, true); }
        ctx.closePath();
      }

      function draw() {
        if (!geo || !strip) return;
        const { cx, footY, R, ry, hd, foot, yB, yT } = geo, b = st.blur, step = lite ? 2 : 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);

        // Contact shadow and candle glow on the table.
        let g = ctx.createRadialGradient(cx, footY + 4, 0, cx, footY + 4, R * 1.15);
        g.addColorStop(0, 'rgba(8,5,3,.62)'); g.addColorStop(1, 'rgba(8,5,3,0)');
        ctx.save(); ctx.translate(cx, footY + 4); ctx.scale(1, .26); ctx.translate(-cx, -(footY + 4)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, footY + 4, R * 1.15, 0, TAU); ctx.fill(); ctx.restore();
        if (st.glow > 0) {
          g = ctx.createRadialGradient(cx, footY, 0, cx, footY, R * 2.2); g.addColorStop(0, `rgba(255,214,140,${.45 * st.glow})`); g.addColorStop(1, 'rgba(255,214,140,0)');
          ctx.save(); ctx.translate(cx, footY); ctx.scale(1, .35); ctx.translate(-cx, -footY); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(cx - R * 2.2, footY - R * 2.2, R * 4.4, R * 4.4); ctx.restore();
        }

        // Turned walnut foot and brass spindle.
        const fr = R * .46, fry = fr * geo.k;
        g = ctx.createLinearGradient(cx - fr, 0, cx + fr, 0); g.addColorStop(0, '#24110a'); g.addColorStop(.32, '#7a4422'); g.addColorStop(.55, '#4b2512'); g.addColorStop(1, '#1a0b05');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, footY, fr, fry, 0, 0, Math.PI); ctx.lineTo(cx - fr, footY - foot); ctx.ellipse(cx, footY - foot, fr, fry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
        g = ctx.createLinearGradient(cx - fr, footY - foot - fry, cx + fr, footY - foot + fry); g.addColorStop(0, '#8d5530'); g.addColorStop(1, '#3b1c0d');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, footY - foot, fr, fry, 0, 0, TAU); ctx.fill();
        const sw = R * .075; g = ctx.createLinearGradient(cx - sw, 0, cx + sw, 0); g.addColorStop(0, '#6d4a1b'); g.addColorStop(.35, '#f2d48a'); g.addColorStop(.6, '#b98a3c'); g.addColorStop(1, '#4d3310');
        ctx.fillStyle = g; ctx.fillRect(cx - sw, yB, sw * 2, footY - foot - yB);
        for (const y of [yB + (footY - foot - yB) * .55, footY - foot - 2]) { ctx.beginPath(); ctx.ellipse(cx, y, sw * 1.9, sw * 1.9 * geo.k + 1.5, 0, 0, TAU); ctx.fill(); }

        // Inside: floor, then the far wall with the paper strip.
        ctx.fillStyle = '#0a0b16'; ctx.beginPath(); ctx.ellipse(cx, yB, R, ry, 0, 0, TAU); ctx.fill();
        const animStep = Math.floor(st.anim);
        columns(strip, Math.ceil(cx - R), Math.floor(cx + R), step, c => yT - c * ry, as => {
          const u = frac(-((Math.PI - as) - st.phi) / TAU);
          if (b < .55) return u;
          const cellPos = u * SLOTS, cell = Math.floor(cellPos);
          return ((cell + animStep) % SLOTS + (cellPos - cell)) / SLOTS;
        });
        wallPath(yT, yB, false);
        g = ctx.createLinearGradient(cx - R, 0, cx + R, 0); g.addColorStop(0, 'rgba(6,6,14,.82)'); g.addColorStop(.3, 'rgba(6,6,14,.28)'); g.addColorStop(.62, 'rgba(6,6,14,.12)'); g.addColorStop(1, 'rgba(6,6,14,.78)');
        ctx.fillStyle = g; ctx.fill();
        if (st.glow > 0) {
          ctx.save(); wallPath(yT, yB, false); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
          g = ctx.createRadialGradient(cx, yT + hd * .2, 0, cx, yT + hd * .2, R * 1.1); g.addColorStop(0, `rgba(255,226,170,${.9 * st.glow})`); g.addColorStop(1, 'rgba(255,190,110,0)');
          ctx.fillStyle = g; ctx.fillRect(cx - R, yT - ry, R * 2, hd + ry * 2); ctx.restore();
        }

        // The outer wall with its slits. Fast spinning blurs the slats into a translucent veil.
        columns(shell, Math.ceil(cx - R), Math.floor(cx + R), step, c => yT + c * ry, as => frac((as - st.phi) / TAU), as => {
          const slit = Math.abs(frac((as - st.phi) * SLOTS / TAU) - .5) < SLIT / 2;
          return slit ? b * .34 : 1 - b * .62;
        });
        wallPath(yT, yB, true);
        g = ctx.createLinearGradient(cx - R, 0, cx + R, 0); g.addColorStop(0, 'rgba(4,4,12,.7)'); g.addColorStop(.2, 'rgba(255,214,150,.1)'); g.addColorStop(.32, 'rgba(255,236,200,.16)'); g.addColorStop(.5, 'rgba(4,4,12,.08)'); g.addColorStop(1, 'rgba(4,4,12,.78)');
        ctx.fillStyle = g; ctx.fill();
        if (b > .05) {
          ctx.save(); wallPath(yT, yB, true); ctx.clip(); ctx.globalAlpha = b * .22; ctx.fillStyle = '#f0d9a0';
          for (let i = 0; i < 9; i++) { const x = cx - R + frac(i / 9 + st.phi * .7) * R * 2; ctx.fillRect(x, yT, 1, hd + ry * 2); }
          ctx.restore();
        }

        // Brass rims.
        g = ctx.createLinearGradient(cx - R, 0, cx + R, 0); g.addColorStop(0, '#5f4214'); g.addColorStop(.3, '#f6dc96'); g.addColorStop(.55, '#c5964a'); g.addColorStop(1, '#4f360f');
        ctx.strokeStyle = g; ctx.lineWidth = Math.max(2, R * .045);
        ctx.beginPath(); ctx.ellipse(cx, yT, R, ry, 0, 0, TAU); ctx.stroke();
        ctx.lineWidth = Math.max(2, R * .06); ctx.beginPath(); ctx.ellipse(cx, yB, R, ry, 0, 0, Math.PI); ctx.stroke();
      }

      function tick(now) {
        raf = 0; if (!running) return;
        const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
        if (!st.drag) {
          if (st.motor) st.omega = lerp(st.omega, 13, Math.min(1, dt * 2.5));
          else { st.omega *= Math.exp(-(Math.abs(st.omega) > 4 ? (st.assist ? .08 : .26) : .9) * dt); if (!st.touched) st.omega = Math.max(st.omega, .55); }
          st.phi += st.omega * dt;
        }
        const speed = Math.abs(st.omega); st.blur = clamp((speed - 4) / 4);
        if (st.blur > .55) { st.anim += dt * clamp(speed * 1.05, 9, 14); st.danced += dt; }
        meter.style.transform = `scaleX(${clamp(st.danced / DANCE_SECONDS)})`;
        intro.classList.toggle('is-dancing', st.blur > .55);
        if (st.danced >= DANCE_SECONDS && !st.motor) reveal();
        if (st.touched && st.danced > .4 && st.blur < .3 && !st.motor && !st.drag) whisper.textContent = t('Yana tezroq aylantiring!');
        draw(); raf = requestAnimationFrame(tick);
      }

      function start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(tick); }
      function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

      // Spinning by hand: the drum follows the finger while held, then keeps its momentum.
      let px = 0, pt = 0, sx = 0, sy = 0;
      intro.addEventListener('pointerdown', event => {
        if (event.target.closest('button') || st.motor) return;
        st.drag = true; st.touched = true; st.assist = false; px = sx = event.clientX; sy = event.clientY; pt = performance.now();
        intro.classList.add('is-touched'); intro.setPointerCapture?.(event.pointerId); openOnce();
      });
      intro.addEventListener('pointermove', event => {
        if (!st.drag) return;
        const now = performance.now(), dt = Math.max(.008, (now - pt) / 1000), dx = event.clientX - px;
        px = event.clientX; pt = now;
        const turn = dx / geo.R; st.phi += turn; st.omega = lerp(st.omega, turn / dt, .4);
      });
      /* A mostly vertical swipe (the habit of "swipe up to open") gives the drum a full push instead. */
      const release = event => {
        if (!st.drag) return; st.drag = false; st.omega = clamp(st.omega, -20, 20); if (performance.now() - pt > 160) st.omega *= .5;
        const dx = (event?.clientX ?? sx) - sx, dy = (event?.clientY ?? sy) - sy;
        if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.5) { st.omega = 15; st.assist = true; }
      };
      intro.addEventListener('pointerup', release); intro.addEventListener('pointercancel', release);
      spinButton.addEventListener('click', () => {
        openOnce(); intro.classList.add('is-touched'); st.touched = true;
        if (reduced) { finishIntro(); return; }
        st.omega = Math.sign(st.omega || 1) * 15; st.assist = true;
      });

      addEventListener('resize', () => { if (running) resize(); });
      document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (!intro.hidden && !revealing) start(); });
      waltzReady.then(() => { if (geo) strip = buildStrip(Waltz.sheet('ink', '#16122a')); draw(); });
      return { st, resize, start, stop, get geo() { return geo; } };
    })();

    /* ════════════════════════ Opening: dive through the drum ════════════════════════ */
    let revealing = false;
    function reveal() {
      if (revealing) return; revealing = true;
      const z = zoetrope, geo = z.geo; z.st.motor = 1; skip.hidden = true;
      if (!gsap || lite) { gsap?.to(z.st, { glow: 1, duration: .5 }); setTimeout(finishIntro, 700); return; }
      stage.style.transformOrigin = `${geo.cx}px ${geo.yT + geo.hd * .45}px`;
      gsap.timeline()
        .to('.intro__head, .intro__cue, .intro__meter', { autoAlpha: 0, y: -12, duration: .6, ease: 'power2.out' }, 0)
        .to(z.st, { glow: 1, duration: 1.5, ease: 'power1.in' }, 0)
        .to('.intro__candle', { opacity: 1, scale: 1.4, duration: 1.2 }, 0)
        .to(stage, { scale: 7, duration: 2.1, ease: 'power3.in' }, .7)
        .to(flash, { opacity: 1, duration: .6, ease: 'power2.in' }, 2.15)
        .add(finishIntro, 2.8);
    }

    let finished = false;
    function finishIntro() {
      if (finished) return; finished = true; openOnce();
      zoetrope.stop(); intro.hidden = true; root.classList.remove('vals-hold', 'is-locked'); scrollTo(0, 0);
      $$('.music-toggle').forEach(b => { b.hidden = false; });
      hall.start(); dust.start();
      if (gsap && !reduced) {
        gsap.set(flash, { opacity: Math.max(.85, +getComputedStyle(flash).opacity || 0) });
        gsap.timeline()
          .fromTo('.hero__media', { scale: 1.22 }, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
          .to(flash, { opacity: 0, duration: 1.4, ease: 'power2.out' }, 0)
          .fromTo('.hero__copy .eyebrow', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' }, .5)
          .fromTo('.hero__names > *', { autoAlpha: 0, y: 30, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.5, stagger: .22, ease: 'expo.out' }, .7)
          .fromTo('.hero__date, .hero__venue, .hero__cue', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out' }, 1.3);
      } else flash.style.opacity = 0;
      ST?.refresh();
    }
    skip.addEventListener('click', () => { openOnce(); finishIntro(); });

    /* ════════════════════════ The ballroom couple ════════════════════════ */
    function dancerLayer(canvas, place) {
      const ctx = canvas.getContext('2d'); let w = 0, h = 0, dpr = 1, on = false, raf = 0, last = 0, time = 0, visible = true;
      const size = () => { const r = canvas.getBoundingClientRect(); w = r.width; h = r.height; dpr = Math.min(devicePixelRatio || 1, lite ? 1.5 : 2); canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); };
      const paint = () => {
        const art = Waltz.sheet('ink', '#140f22'); if (!art || !w) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
        place(ctx, art, time, w, h);
      };
      const loop = now => { raf = 0; if (!on) return; time += Math.min(.05, (now - (last || now)) / 1000); last = now; paint(); raf = requestAnimationFrame(loop); };
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && on && !raf) { last = 0; raf = requestAnimationFrame(loop); } }).observe(canvas);
      addEventListener('resize', () => { size(); paint(); });
      return {
        start() { size(); on = true; waltzReady.then(() => { if (reduced) { paint(); return; } if (!raf && visible) { last = 0; raf = requestAnimationFrame(loop); } }); },
        set(value) { time = value; paint(); }, size, paint
      };
    }

    /* The couple travels round the floor anticlockwise, smaller at the back, with a parquet reflection. */
    function ballroomPlace(scaleBase) {
      return (ctx, art, time, w, h) => {
        const sc = Math.max(w / HALL.w, h / HALL.h), ox = (w - HALL.w * sc) / 2, oy = (h - HALL.h * sc) * HALL.posY;
        const fx = ox + HALL.w * sc * HALL.floorX, fy = oy + HALL.h * sc * HALL.floorY;
        const a = time * .32 + Math.PI * .5, depth = (Math.sin(a) + 1) / 2;
        const x = fx + Math.cos(a) * Math.min(w * .22, 150), y = fy + Math.sin(a) * h * .028, size = Math.min(h * scaleBase, w * .62) * lerp(.82, 1.08, depth);
        const frame = time * 9;
        const pool = ctx.createRadialGradient(x, y, 0, x, y, size * .55); pool.addColorStop(0, 'rgba(255,220,150,.32)'); pool.addColorStop(1, 'rgba(255,220,150,0)');
        ctx.save(); ctx.translate(x, y); ctx.scale(1, .2); ctx.fillStyle = pool; ctx.beginPath(); ctx.arc(0, 0, size * .55, 0, TAU); ctx.fill(); ctx.restore();
        ctx.save(); ctx.globalAlpha = .2; ctx.translate(0, y * 2); ctx.scale(1, -1); Waltz.draw(ctx, art, frame, x, y, size); ctx.restore();
        Waltz.draw(ctx, art, frame, x, y, size);
      };
    }
    const hall = dancerLayer($('#dancers'), ballroomPlace(.23));
    const finaleCouple = dancerLayer($('.finale__couple'), ballroomPlace(.24));

    /* ════════════════════════ Gold dust ════════════════════════ */
    const dust = (() => {
      const canvas = $('.dust'), ctx = canvas.getContext('2d'), count = reduced ? 0 : lite ? 14 : 42, motes = [];
      let w = 0, h = 0, dpr = 1, raf = 0, on = false, last = 0;
      const size = () => { w = innerWidth; h = innerHeight; dpr = Math.min(devicePixelRatio || 1, 1.5); canvas.width = w * dpr; canvas.height = h * dpr; };
      const seed = m => Object.assign(m, { x: Math.random() * w, y: h + Math.random() * h * .2, r: .6 + Math.random() * 1.8, v: 6 + Math.random() * 16, p: Math.random() * TAU });
      const loop = now => {
        raf = 0; if (!on) return; const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
        for (const m of motes) {
          m.y -= m.v * dt; m.p += dt * 1.6; m.x += Math.sin(m.p) * 6 * dt; if (m.y < -10) seed(m);
          ctx.globalAlpha = .35 + .35 * Math.sin(m.p * 1.7); ctx.fillStyle = '#f5d98f'; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, TAU); ctx.fill();
        }
        raf = requestAnimationFrame(loop);
      };
      addEventListener('resize', size);
      document.addEventListener('visibilitychange', () => { if (document.hidden) { on = false; } else if (count && finished) { on = true; if (!raf) raf = requestAnimationFrame(loop); } });
      return { start() { if (!count) return; size(); for (let i = 0; i < count; i++) motes.push(seed({})), motes[i].y = Math.random() * h; on = true; raf = requestAnimationFrame(loop); } };
    })();

    /* ════════════════════════ Scroll choreography ════════════════════════ */
    const promenade = (() => {
      const canvas = $('.promenade__couple'), ctx = canvas.getContext('2d'); let w = 0, h = 0, dpr = 1, progress = 0;
      const size = () => { const r = canvas.getBoundingClientRect(); w = r.width; h = r.height; dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); paint(); };
      const paint = () => {
        const art = Waltz.sheet('gold', (g, cw, ch) => { const gr = g.createLinearGradient(0, 0, 0, ch); gr.addColorStop(0, '#f8e6b0'); gr.addColorStop(.6, '#d1a75a'); gr.addColorStop(1, '#9c7432'); return gr; });
        if (!art || !w) return; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
        const x = lerp(-w * .12, w * 1.12, progress), base = h * .86, size = h * .78;
        ctx.globalAlpha = .08; ctx.save(); ctx.translate(0, base * 2); ctx.scale(1, -1); Waltz.draw(ctx, art, progress * 36, x, base, size); ctx.restore();
        ctx.globalAlpha = 1; Waltz.draw(ctx, art, progress * 36, x, base, size);
      };
      addEventListener('resize', size);
      return { size, set(p) { progress = p; paint(); } };
    })();

    if (gsap && ST && !reduced) {
      gsap.to('.hero__hall', { yPercent: 9, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__chandelier', { yPercent: -40, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__copy', { yPercent: -30, autoAlpha: .2, ease: 'none', scrollTrigger: { trigger: '#hero', start: '20% top', end: 'bottom top', scrub: true } });
      ST.create({ trigger: '.promenade', start: 'top bottom', end: 'bottom top', scrub: .4, onUpdate: self => promenade.set(self.progress) });
      gsap.fromTo('.programme__fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.programme__rail', start: 'top 75%', end: 'bottom 55%', scrub: true } });
      gsap.fromTo('.finale__couple', { scale: .85 }, { scale: 1.05, ease: 'none', scrollTrigger: { trigger: '#finale', start: 'top bottom', end: 'bottom bottom', scrub: true } });

      const enter = (selector, from, vars = {}) => $$(selector).forEach(el => gsap.from(el, { ...from, duration: 1.2, ease: 'expo.out', ...vars, scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));
      enter('.card--letter', { rotateX: -18, y: 50, autoAlpha: 0, transformPerspective: 900, transformOrigin: '50% 0%' });
      enter('.date__dial', { rotate: -25, scale: .7, autoAlpha: 0 }, { ease: 'back.out(1.4)' });
      enter('.programme li', { x: -24, autoAlpha: 0 }, { stagger: .08 });
      enter('.venue__frame', { scale: .86, autoAlpha: 0, clipPath: 'inset(12% 12% 12% 12%)' });
      enter('.card--dance', { y: 40, autoAlpha: 0, rotate: -1.5 });
      enter('.wishes li', { y: 26, autoAlpha: 0 }, { stagger: .07 });
      enter('.gallery__frame', { y: 40, autoAlpha: 0 }, { stagger: .08 });
      enter('.chapter .title, .chapter .script-title', { y: 20, autoAlpha: 0, letterSpacing: '.18em' });
    }

    /* "Kelaman" makes the couple twirl inside the reply card. */
    const twirl = $('.rsvp__twirl'), done = $('[data-rsvp-done]');
    if (twirl && done) new MutationObserver(() => {
      if (done.hidden || $('[data-rsvp-choice="yes"]')?.getAttribute('aria-pressed') !== 'true' || reduced) return;
      const ctx = twirl.getContext('2d'), r = twirl.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      twirl.width = r.width * dpr; twirl.height = r.height * dpr; const art = Waltz.sheet('gold', '#c9a050'); if (!art) return;
      const sparks = Array.from({ length: 26 }, () => ({ a: Math.random() * TAU, v: 40 + Math.random() * 90, r: 1 + Math.random() * 2 })); let t0 = 0;
      const step = now => {
        t0 ||= now; const e = (now - t0) / 1000; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, r.width, r.height);
        Waltz.draw(ctx, art, e * 16, r.width / 2, r.height * .92, r.height * .82);
        ctx.fillStyle = '#e9c97a'; for (const s of sparks) { const d = s.v * e; ctx.globalAlpha = clamp(1 - e / 1.6); ctx.beginPath(); ctx.arc(r.width / 2 + Math.cos(s.a) * d, r.height * .5 + Math.sin(s.a) * d * .6, s.r, 0, TAU); ctx.fill(); }
        ctx.globalAlpha = 1; if (e < 1.8) requestAnimationFrame(step); else { ctx.clearRect(0, 0, r.width, r.height); Waltz.draw(ctx, art, 0, r.width / 2, r.height * .92, r.height * .82); }
      };
      requestAnimationFrame(step);
    }).observe(done, { attributes: true, attributeFilter: ['hidden'] });

    /* ── Start ── */
    waltzReady.then(() => { promenade.size(); finaleCouple.start(); });
    if (reduced) { spinButton.querySelector('span').textContent = t('Taklifnomani ochish'); whisper.hidden = true; }
    zoetrope.resize(); zoetrope.start();
    if (gsap && !reduced) {
      gsap.timeline()
        .from('.intro__room', { scale: 1.08, autoAlpha: 0, duration: 1.8, ease: 'power2.out' }, 0)
        .from('#zoetrope', { autoAlpha: 0, y: 18, duration: 1.4, ease: 'expo.out' }, .4)
        .from('.intro__head > *', { autoAlpha: 0, y: 16, duration: 1.1, stagger: .14, ease: 'expo.out' }, .7)
        .from('.intro__cue > *', { autoAlpha: 0, y: 12, duration: .9, stagger: .12, ease: 'power3.out' }, 1.4);
    }
    setTimeout(() => { skip.classList.add('is-on'); }, 2400);
  });
})();
