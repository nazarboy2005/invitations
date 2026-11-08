/* Original template parallax/ambient block. Service/countdown adapters are separate. */
(() => {
  /* ─── TUNNEL BOOK PARALLAX ───────────────────────────────────────── */
  // - mouse-move tilts the layers (depth-based shift)
  // - scroll DOLLY is gentle: a small scale + opacity fade so the splash
  //   exits cleanly and the next section is visible. We do NOT translate
  //   layers downward — that previously masked the next section.

  const tunnel  = document.getElementById('tunnel');
  const splash  = document.querySelector('.splash');
  const layers  = [...document.querySelectorAll('.layer, .float, .splash-title')];

  let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
  let scrollY = 0;
  let rafScheduled = false;
  let inViewport = true;

  function onMove(e) {
    const t = e.touches ? e.touches[0] : e;
    const r = splash.getBoundingClientRect();
    tmx = Math.max(0, Math.min(1, (t.clientX - r.left) / r.width));
    tmy = Math.max(0, Math.min(1, (t.clientY - r.top)  / r.height));
  }
  splash.addEventListener('mousemove', onMove);
  splash.addEventListener('touchmove', onMove, { passive: true });

  function onScroll() {
    scrollY = window.scrollY;
    const splashH = splash.offsetHeight;
    inViewport = scrollY < splashH + 100;   // skip work once past splash
    placeAmbient();
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(loop);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function loop() {
    if (document.documentElement.dataset.reducedMotion === "true" || matchMedia("(prefers-reduced-motion: reduce)").matches) { rafScheduled = false; return; }
    rafScheduled = false;
    // ease toward target
    mx += (tmx - mx) * 0.08;
    my += (tmy - my) * 0.08;

    const splashH = splash.offsetHeight;
    const sp = Math.min(1, Math.max(0, scrollY / splashH));

    const ox = (mx - 0.5) * 2;  // -1..1
    const oy = (my - 0.5) * 2;

    for (const el of layers) {
      const depth = parseFloat(el.dataset.depth || '0');

      // mouse parallax (small, depth-weighted)
      const px = -ox * depth * 50;
      const py = -oy * depth * 32;

      // GENTLE dolly: just a small scale push. NO translateY.
      const sScale = 1 + sp * depth * 0.45;

      let baseX = '0px', baseY = '0px';
      if (el.classList.contains('float-butterflies') ||
          el.classList.contains('splash-title') ||
          el.classList.contains('layer-castle')) {
        baseX = '-50%';
      }
      if (el.classList.contains('splash-title')) baseY = '-50%';

      el.style.transform =
        `translate3d(calc(${baseX} + ${px}px), calc(${baseY} + ${py}px), 0) ` +
        `scale(${sScale})`;

      if (el.classList.contains('splash-title')) {
        el.style.opacity = Math.max(0, 1 - sp * 1.3);
      }
    }

    // keep RAF going while we're near splash AND mouse is still settling
    if (inViewport && (Math.abs(tmx - mx) > 0.001 || Math.abs(tmy - my) > 0.001)) {
      rafScheduled = true;
      requestAnimationFrame(loop);
    }
  }

  // animate on mouse-move even without scroll
  splash.addEventListener('mousemove', () => {
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(loop);
    }
  });
  splash.addEventListener('touchmove', () => {
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(loop);
    }
  }, { passive: true });

  // kick once
  requestAnimationFrame(loop);

  /* ─── AMBIENT FLOATERS (after splash) ────────────────────────────── */
  const ambFly  = document.querySelector('.ambient-fly');
  const ambMoon = document.querySelector('.ambient-moon');

  function placeAmbient() {
    if (!ambFly || !ambMoon) return;
    if(document.documentElement.dataset.reducedMotion === "true" || matchMedia("(prefers-reduced-motion: reduce)").matches){ambFly.style.opacity=ambMoon.style.opacity="0";ambFly.style.transform=ambMoon.style.transform="none";return;}
    const splashEnd = splash.offsetHeight;
    const docH = document.body.scrollHeight - window.innerHeight;
    const past = scrollY > splashEnd * 0.85 && scrollY < docH - 200;
    ambFly.style.opacity  = past ? '0.45' : '0';
    ambMoon.style.opacity = past ? '0.30' : '0';
    const drift = (scrollY - splashEnd) * 0.04;
    ambFly.style.transform  = `translateY(${-drift}px) rotate(${Math.sin(scrollY/300)*8}deg)`;
    ambMoon.style.transform = `translateY(${drift * 0.6}px)`;
  }
  placeAmbient();
  window.addEventListener('load', placeAmbient);
})();

