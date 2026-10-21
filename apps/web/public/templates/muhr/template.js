(function () {
  "use strict";

  var doc = document, root = doc.documentElement;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var M = window.Marhamat || {};
  var data = M.data || window.INVITATION || {};
  var reduce = !!M.reducedMotion || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var lite = function () { return M.tier === "lite" || root.dataset.tier === "lite" || reduce; };
  var gsap = window.gsap;

  var intro = $("#intro"), sealBtn = $("#open-invitation"), hero = $("#hero");
  var flaps = { top: $(".env__flap--top"), bottom: $(".env__flap--bottom"), left: $(".env__flap--left"), right: $(".env__flap--right") };

  /* ------------------------------------------------------------ the seal */
  function initials() {
    var first = function (s) { s = String(s || "").trim(); return s ? Array.from(s)[0].toLocaleUpperCase() : ""; };
    var a = first(data.groom), b = first(data.bride);
    return a && b ? [a, b] : [a || b];
  }
  var letters = initials();
  var SCRIPT = '"Marck Script"';

  function fontsReady() {
    if (!doc.fonts || !doc.fonts.load) return Promise.resolve();
    var load = doc.fonts.load("80px " + SCRIPT, letters.join("") + "&").catch(function () {});
    return Promise.race([load, new Promise(function (r) { setTimeout(r, 1500); })]);
  }

  function drawSeal() {
    var main = $(".seal__img");
    if (!main || !window.MuhrSeal) return;
    var px = Math.round(sealBtn.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, lite() ? 1.5 : 2));
    window.MuhrSeal.render(main, { px: px || 400, letters: letters, font: SCRIPT + ", Georgia, serif" });
    // the same seal lit from within: hot wax glowing red-gold, cross-faded in as the light rises
    var glow = $(".seal__glow"), S = main.width;
    if (!glow) return;
    glow.width = glow.height = S;
    var g = glow.getContext("2d");
    g.drawImage(main, 0, 0);
    g.globalCompositeOperation = "source-atop";
    var rg = g.createRadialGradient(S * .46, S * .44, S * .02, S / 2, S / 2, S * .44);
    rg.addColorStop(0, "rgba(255,226,170,.95)");
    rg.addColorStop(.45, "rgba(255,92,70,.75)");
    rg.addColorStop(1, "rgba(200,20,30,.35)");
    g.fillStyle = rg;
    g.fillRect(0, 0, S, S);
  }

  function drawMiniSeals() {
    if (!window.MuhrSeal) return;
    var c = doc.createElement("canvas");
    window.MuhrSeal.render(c, { px: 200, letters: letters, font: SCRIPT + ", Georgia, serif" });
    var url;
    try { url = c.toDataURL("image/png"); } catch (_) { return; }
    $$(".mini-seal").forEach(function (img) { img.src = url; });
    root.style.setProperty("--seal-url", 'url("' + url + '")');
  }

  /* ------------------------------------------------- envelope geometry */
  function layoutFlaps() {
    if (!intro) return;
    var w = intro.clientWidth, h = intro.clientHeight, cx = w / 2, cy = h / 2, e = cy - cx, f = cy + cx;
    var poly = function (pts) { return "polygon(" + pts.map(function (p) { return p[0].toFixed(1) + "px " + p[1].toFixed(1) + "px"; }).join(",") + ")"; };
    // each flap has an outer face and an inner face (pre-mirrored, then turned 180° in CSS)
    var shapes = {
      top: [[0, 0], [w, 0], [w, e], [cx, cy + .6], [0, e]],
      bottom: [[0, h], [w, h], [w, f], [cx, cy - .6], [0, f]],
      left: [[0, e - 1], [cx + 1, cy], [0, f + 1]],
      right: [[w, e - 1], [cx - 1, cy], [w, f + 1]]
    };
    Object.keys(shapes).forEach(function (k) {
      var out = $(".env__face--out", flaps[k]), inn = $(".env__face--in", flaps[k]);
      var vertical = k === "top" || k === "bottom";
      out.style.clipPath = poly(shapes[k]);
      inn.style.clipPath = poly(shapes[k].map(function (p) { return vertical ? [p[0], h - p[1]] : [w - p[0], p[1]]; }));
    });
  }

  /* ------------------------------------------------------- petal canvas */
  var canvas = $(".petals"), ctx = canvas && canvas.getContext("2d");
  var petals = [], raf = 0, last = 0, running = false, dpr = 1;
  var heroInView = true;
  function sizeCanvas() {
    if (!ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, lite() ? 1.5 : 2);
    var w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function addPetal(burst, x, y) {
    var w = canvas.clientWidth, h = canvas.clientHeight, a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 5;
    petals.push({
      x: burst ? x : Math.random() * w, y: burst ? y : -20 - Math.random() * h * .6,
      vx: burst ? Math.cos(a) * sp : -.25 + Math.random() * .5, vy: burst ? Math.sin(a) * sp - 2.2 : .35 + Math.random() * .55,
      s: burst ? 9 + Math.random() * 12 : 7 + Math.random() * 10, r: Math.random() * 6.28, spin: (Math.random() - .5) * .06,
      ph: Math.random() * 6.28, depth: .45 + Math.random() * .55, kind: Math.floor(Math.random() * 6), life: 0, burst: burst
    });
  }
  function syncAmbient() {
    if (doc.hidden || !heroInView) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (ctx) ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      return;
    }
    if ((running || petals.length) && !raf) { last = 0; raf = requestAnimationFrame(frame); }
  }
  function frame(now) {
    raf = 0;
    if (!ctx || doc.hidden || !heroInView) return;
    var dt = Math.min(2.4, (now - (last || now)) / 16.67); last = now;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    var max = lite() ? 10 : 24, ambient = 0;
    for (var i = petals.length - 1; i >= 0; i--) {
      var p = petals[i];
      p.life += dt; p.ph += .07 * dt; p.r += p.spin * dt;
      if (p.burst) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .985; p.vy = p.vy * .985 + .05 * dt; }
      else { ambient++; p.x += (p.vx + Math.sin(p.ph) * .45) * dt; p.y += p.vy * dt; }
      if (p.y > h + 30 || p.x < -40 || p.x > w + 40 || (p.burst && p.life > 160)) { petals.splice(i, 1); continue; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(Math.cos(p.ph), 1);
      ctx.globalAlpha = Math.min(.95, p.depth);
      ctx.fillStyle = ["rgba(222,164,157,.82)","rgba(239,204,181,.86)","rgba(198,143,137,.76)","rgba(244,222,197,.84)"][p.kind % 4];
      ctx.beginPath(); ctx.moveTo(-p.s * .48, 0);
      ctx.bezierCurveTo(-p.s * .22, -p.s * .38, p.s * .3, -p.s * .34, p.s * .48, 0);
      ctx.bezierCurveTo(p.s * .22, p.s * .28, -p.s * .2, p.s * .34, -p.s * .48, 0);
      ctx.fill();
      ctx.restore();
    }
    if (running && ambient < max && Math.random() < .06 * dt) addPetal(false);
    if ((running || petals.length) && heroInView && !doc.hidden) raf = requestAnimationFrame(frame);
  }
  function startPetals() {
    if (!ctx || reduce) return;
    running = true;
    for (var i = 0; i < (lite() ? 5 : 12); i++) addPetal(false);
    syncAmbient();
  }
  function burst(x, y, n) {
    if (!ctx || reduce) return;
    var rect = canvas.getBoundingClientRect();
    for (var i = 0; i < n; i++) addPetal(true, x - rect.left, y - rect.top);
    syncAmbient();
  }
  doc.addEventListener("visibilitychange", syncAmbient);
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      heroInView = !!(entries[0] && entries[0].isIntersecting);
      syncAmbient();
    }, { threshold: 0.01 }).observe(hero);
  }

  /* ---------------------------------------------------- sound + haptics */
  // Tiny synthesized cues (no audio files): a soft press, paper rustles, a warm chime.
  var audio = null;
  function sfx(kind, when) {
    if (reduce) return;
    try {
      if (!audio) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; audio = new AC(); }
      if (audio.state === "suspended") audio.resume();
      var t = audio.currentTime + (when || 0), out = audio.createGain();
      out.connect(audio.destination);
      if (kind === "press") {
        var o = audio.createOscillator(); o.type = "sine";
        o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(55, t + .16);
        out.gain.setValueAtTime(.0001, t); out.gain.exponentialRampToValueAtTime(.16, t + .012); out.gain.exponentialRampToValueAtTime(.0001, t + .22);
        o.connect(out); o.start(t); o.stop(t + .25);
      } else if (kind === "rustle") {
        var len = Math.round(audio.sampleRate * .9), buf = audio.createBuffer(1, len, audio.sampleRate), d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (.6 + .4 * Math.sin(i / 900));
        var src = audio.createBufferSource(), bp = audio.createBiquadFilter();
        src.buffer = buf; bp.type = "bandpass"; bp.frequency.value = 2400; bp.Q.value = .8;
        out.gain.setValueAtTime(.0001, t); out.gain.exponentialRampToValueAtTime(.05, t + .12); out.gain.exponentialRampToValueAtTime(.0001, t + .85);
        src.connect(bp); bp.connect(out); src.start(t); src.stop(t + .9);
      } else if (kind === "chime") {
        [523.25, 783.99, 1046.5].forEach(function (f, k) {
          var o2 = audio.createOscillator(), g2 = audio.createGain(); o2.type = "sine"; o2.frequency.value = f;
          g2.gain.setValueAtTime(.0001, t + k * .09); g2.gain.exponentialRampToValueAtTime(.03 / (k + 1), t + k * .09 + .05); g2.gain.exponentialRampToValueAtTime(.0001, t + k * .09 + 2.6);
          o2.connect(g2); g2.connect(out); o2.start(t + k * .09); o2.stop(t + k * .09 + 2.7);
        });
        out.gain.value = 1;
      }
    } catch (_) {}
  }

  /* --------------------------------------------------------- intro film */
  var opening = false, finished = false, openTl = null;
  var names = hero ? $$(".hero__name, .hero__names .amp", hero) : [];
  var heroFade = hero ? [$(".hero__kicker", hero), $(".hero__date", hero), $(".hero__when", hero), $(".hero__cue", hero)].filter(Boolean) : [];

  function arrive() {
    intro.classList.add("is-arrived");
    if (!gsap || reduce) {
      $$(".intro__greeting, .seal, .intro__hint", intro).forEach(function (el) { el.style.opacity = 1; });
      return;
    }
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(".env", { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6 }, 0)
      .set(".intro__greeting", { opacity: 1 }, .45)
      .fromTo(".intro__greeting", { "--wipe": "100%" }, { "--wipe": "0%", duration: 1.6, ease: "power1.inOut" }, .45)
      .fromTo(".seal", { opacity: 0, scale: 1.65, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: .5, ease: "power3.in" }, 1.1)
      .to(".env", { scale: .993, duration: .08, yoyo: true, repeat: 1, ease: "power1.out" }, 1.6)
      .fromTo(".intro__hint", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 1 }, 1.9);
  }

  function finish() {
    if (finished) return;
    finished = true;
    intro.hidden = true;
    intro.setAttribute("aria-hidden", "true");
    root.classList.remove("is-locked");
    doc.body.classList.add("is-open");
    if (gsap) gsap.killTweensOf(".env__rays");
    flyDoves();
    startPetals();
    scrollStory();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function heroReveal(tl, at) {
    // the names are written in sequence, as if by hand, then the date settles
    tl.fromTo(heroFade[0] || {}, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, at);
    names.forEach(function (el, i) {
      var amp = el.classList.contains("amp"), t = at + .25 + (i === 0 ? 0 : i === 1 ? 1.05 : 1.45);
      tl.set(el, { opacity: 1 }, t)
        .fromTo(el, { "--wipe": "100%", y: 6 }, { "--wipe": "0%", y: 0, duration: amp ? .5 : 1.15, ease: "power1.inOut" }, t);
    });
    tl.fromTo(heroFade.slice(1), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, stagger: .16, ease: "expo.out" }, at + 2.5);
  }

  function open() {
    if (finished) return;
    if (opening) { if (openTl) openTl.timeScale(6); return; }
    opening = true;
    try { if (M.open) M.open(); } catch (_) {}
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (_) {}
    sealBtn.setAttribute("aria-disabled", "true");
    intro.classList.remove("is-arrived");
    if (!gsap || reduce) {
      root.classList.add("is-quick");
      names.forEach(function (el) { el.style.opacity = "1"; el.style.maskImage = "none"; el.style.webkitMaskImage = "none"; });
      heroFade.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
      var kicker = $(".hero__kicker", hero);
      if (kicker) { kicker.style.opacity = "1"; kicker.style.transform = "none"; }
      intro.style.transition = "opacity .6s ease";
      intro.style.opacity = 0;
      setTimeout(finish, reduce ? 450 : 600);
      return;
    }
    sfx("press");
    gsap.set(".scene", { scale: 1.14 });
    gsap.set(".arch", { scale: 1.08 });
    gsap.set(heroFade, { opacity: 0 });
    gsap.set(names, { opacity: 0 });
    var seams = $$(".env__seams i"), blooms = $$(".env__seams b");
    // set the diagonal explicitly: a CSS scaleX(0) matrix hides its rotation from GSAP
    gsap.set([seams[0], blooms[0]], { rotation: 45, scaleX: 0 });
    gsap.set([seams[1], blooms[1]], { rotation: -45, scaleX: 0 });
    openTl = gsap.timeline();
    openTl
      // 1 — the press, and light starts to leak along the folds
      .to(".seal", { scale: .9, duration: .13, ease: "power2.in" }, 0)
      .to(".seal", { scale: 1.04, duration: .5, ease: "back.out(2.2)" }, .13)
      .to(".seal__halo", { opacity: 0, duration: .25 }, 0)
      .to([".intro__greeting", ".intro__hint"], { opacity: 0, y: -8, duration: .6, ease: "power2.in" }, 0)
      .fromTo(seams, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power2.out" }, .15)
      .fromTo(blooms, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: .78, duration: 1.8, ease: "power2.out" }, 1.15)
      // the camera eases back so the opened flaps stay in frame
      .to(".env", { scale: .82, duration: 4.3, ease: "power2.inOut" }, 1.0)
      .to(".env__face--out i", { opacity: .62, duration: 2.1, ease: "power1.out" }, 1.1)
      .add(function () { sfx("chime"); }, 2.0)
      // 2 — the wax warms and glows from within
      .to(".seal__glow", { opacity: 1, duration: 1.4, ease: "power1.inOut" }, 1.6)
      .to(".seal", { scale: 1.09, duration: 1.6, ease: "sine.inOut" }, 1.5)
      // 3 — the flaps peel back slowly, showing their gilded insides; rays pour out
      .add(function () { sfx("rustle"); }, 3.15)
      .to(flaps.top, { rotationX: 172, duration: 2.65, ease: "power1.inOut" }, 3.2)
      .add(function () { sfx("rustle", .02); }, 3.5)
      .to(flaps.bottom, { rotationX: -172, duration: 2.65, ease: "power1.inOut" }, 3.55)
      .add(function () { sfx("rustle", .04); }, 3.85)
      .to(flaps.left, { rotationY: -172, duration: 2.45, ease: "power1.inOut" }, 3.9)
      .to(flaps.right, { rotationY: 172, duration: 2.45, ease: "power1.inOut" }, 3.9)
      .to(".env__seams", { opacity: 0, duration: 1 }, 4.85)
      .fromTo(".env__rays", { opacity: 0, scale: .55 }, { opacity: .72, scale: 1, duration: 2.2, ease: "power2.out" }, 3.0)
      // 4 — the light blooms and the camera pushes through the seal into the garden
      .to(".intro__light", { opacity: 1, scale: 1.6, duration: 1.35, ease: "power2.in" }, 4.8)
      .to(".seal", { scale: 1.45, opacity: 0, duration: 1.05, ease: "power2.in" }, 5.25)
      .to(intro, { opacity: 0, duration: 1.2, ease: "power1.inOut" }, 5.25)
      .to(".scene", { scale: 1, duration: 1.9, ease: "expo.out" }, 4.55)
      .to(".arch", { scale: 1, duration: 1.9, ease: "expo.out" }, 4.55)
      .fromTo(".scene__rays", { opacity: 0 }, { opacity: 1, duration: 2.4, ease: "power1.out" }, 4.6)
      .add(finish, 6.35);
    gsap.to(".env__rays", { rotation: 360, duration: 60, ease: "none", repeat: -1 });
    heroReveal(openTl, 5.0);
    if (lite()) openTl.timeScale(1.25);
  }

  var doveTimer = 0;
  function flyDoves() {
    if (!hero || reduce || !heroInView || doc.hidden) return;
    hero.classList.remove("is-flying");
    void hero.offsetWidth;
    hero.classList.add("is-flying");
    clearTimeout(doveTimer);
    doveTimer = setTimeout(function () { if (heroInView && !doc.hidden) flyDoves(); }, 17000);
  }

  /* ------------------------------------------------------- scroll story */
  var storyBuilt = false;
  function scrollStory() {
    if (storyBuilt || !gsap || !window.ScrollTrigger) return;
    storyBuilt = true;
    gsap.registerPlugin(window.ScrollTrigger);
    if (reduce) return;
    var heroST = { trigger: hero, start: "top top", end: "bottom top", scrub: .6 };
    // 1. walking through the arch: the frame grows past the camera, layers part at different speeds
    gsap.to(".arch", { scale: 1.45, ease: "none", scrollTrigger: heroST });
    gsap.to(".scene__far", { yPercent: -3, ease: "none", scrollTrigger: heroST });
    gsap.to(".scene__mid", { yPercent: -7, ease: "none", scrollTrigger: heroST });
    gsap.to(".scene__front", { yPercent: -14, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero__copy", { y: -90, opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "60% top", scrub: .6 } });
    gsap.to(".hero__branch", { yPercent: -28, ease: "none", scrollTrigger: heroST });
    // 2. the letter unfolds out of the envelope
    gsap.fromTo(".letter", { rotationX: -62, scaleY: .82, opacity: .2, transformPerspective: 900 },
      { rotationX: 0, scaleY: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: ".section--letter", start: "top 95%", end: "top 58%", scrub: .7 } });
    // 3. the programme thread fills and lights each hour
    var items = $$(".program__item");
    gsap.to(".timeline__fill", { scaleY: 1, ease: "none", scrollTrigger: {
      trigger: ".timeline", start: "top 72%", end: "bottom 55%", scrub: .6,
      onUpdate: function (st) { items.forEach(function (it, i) { it.classList.toggle("is-lit", st.progress >= (i + .3) / items.length); }); }
    } });
    // 4. the tile friezes drift sideways
    gsap.fromTo(".section--rsvp", { "--band": "0px" }, { "--band": "-96px", ease: "none", scrollTrigger: { trigger: ".section--rsvp", start: "top bottom", end: "bottom top", scrub: .5 } });

    // themed entrances
    var reveal = function (targets, from, trigger, extra) {
      if (!targets || (targets.length === 0)) return;
      gsap.from(targets, Object.assign({ opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: trigger, start: "top 82%", once: true } }, from, extra || {}));
    };
    $$(".section").forEach(function (sec) {
      reveal($$(".eyebrow, .section__title", sec).filter(function (el) { return !el.closest(".rsvp-card"); }), { y: 22, stagger: .08 }, sec);
    });
    reveal(".date-arch", { y: 40, scale: .94 }, ".date-arch");
    reveal(".countdown > div", { y: 30, rotationX: -70, transformPerspective: 600, stagger: .09 }, ".countdown");
    reveal(".venue__photo", { y: 50, scale: .96, duration: 1.4 }, ".venue__photo");
    reveal(".gallery__item", { x: 80, stagger: .1 }, ".gallery");
    reveal(".rsvp-card", { y: 70, duration: 1.2 }, ".section--rsvp");
    reveal(".rsvp-card__seal", { scale: 2.4, opacity: 0, duration: .6, ease: "power3.in" }, ".section--rsvp", { scrollTrigger: { trigger: ".section--rsvp", start: "top 60%", once: true } });
    reveal(".wishes__item", { y: 30, rotation: function (i) { return i % 2 ? 1.5 : -1.5; }, stagger: .12 }, ".wishes");
    reveal(".gift__env", { y: 40, rotation: -4 }, ".gift");
    reveal(".contacts li", { x: -30, stagger: .1 }, ".contacts");
    reveal(".footer__doves", { y: 30, scale: .9, duration: 1.4 }, ".footer");
  }

  /* --------------------------------------------------------- small toys */
  function gift() {
    var wrap = $(".gift"), env = $(".gift__env");
    if (!wrap || !env) return;
    env.addEventListener("click", function () {
      var openNow = !wrap.classList.contains("is-open");
      wrap.classList.toggle("is-open", openNow);
      env.setAttribute("aria-expanded", String(openNow));
    });
  }

  function celebrate(answer) {
    if (!answer || answer.status !== "yes") return;
    var stamp = $(".rsvp__stamp");
    if (stamp && stamp.animate && !reduce) {
      stamp.animate([{ transform: "scale(2.6) rotate(-18deg)", opacity: 0 }, { transform: "scale(.92) rotate(2deg)", opacity: 1, offset: .7 }, { transform: "scale(1) rotate(0)" }], { duration: 700, easing: "cubic-bezier(.5,0,.3,1)" });
    }
    var card = $(".rsvp-card");
    if (card) { var r = card.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 80, lite() ? 14 : 34); }
  }

  /* ----------------------------------------------------------------- go */
  function init() {
    if (!intro || !sealBtn) return;
    layoutFlaps();
    sizeCanvas();
    var musicTrack = $("audio[data-music]");
    if (musicTrack) musicTrack.addEventListener("error", function () {
      setTimeout(function () { $$("[data-music-toggle]").forEach(function (button) { button.hidden = true; }); }, 0);
    });

    addEventListener("resize", function () { layoutFlaps(); sizeCanvas(); }, { passive: true });
    fontsReady().then(function () {
      var greet = $(".intro__greeting");
      if (greet && greet.textContent.length > 26) greet.classList.add("is-long");
      drawSeal();
      arrive();
      (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(drawMiniSeals);
    });
    sealBtn.addEventListener("click", function (e) { e.stopPropagation(); open(); });
    intro.addEventListener("click", function () { if (opening) open(); });
    gift();
    if (M.on) {
      M.on("rsvp", celebrate);
      M.on("tier", sizeCanvas);
    }
    doc.addEventListener("click", function (e) {
      var yes = e.target.closest && e.target.closest('[data-rsvp-choice="yes"]');
      if (yes) { var r = yes.getBoundingClientRect(); burst(r.left + 40, r.top + r.height / 2, lite() ? 8 : 18); }
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
