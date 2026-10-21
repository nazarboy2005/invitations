(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var $ = function (s, scope) { return (scope || d).querySelector(s); };
  var $$ = function (s, scope) { return Array.prototype.slice.call((scope || d).querySelectorAll(s)); };
  var M = window.Marhamat || {}, data = M.data || window.INVITATION || {};
  var gs = window.gsap, intro = $("#intro"), button = $("#open-invitation"), hero = $("#hero");
  var reduced = !!M.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
  var opening = false, finished = false, keyboardOpen = false, arrival, openingFilm, soundContext;
  var dustCanvas = $(".dust"), dustContext = dustCanvas.getContext("2d"), motes = [], dustRaf = 0;
  var heroVisible = true, dustW = 0, dustH = 0, lastFrame = 0, storyStarted = false;
  function lite() { return M.tier === "lite" || root.dataset.tier === "lite"; }
  // the courtyard after the doors: rippling reflections and a breeze in the leaves (scene-motion.js)
  var liveScene = null, life = null, liveStart = 0, lastLive = 0;
  function makeLive() {
    var canvas = $(".world__live"), lifeCanvas = $(".world__life");
    if (window.GanchScene && canvas) try { liveScene = new window.GanchScene({ canvas: canvas, image: $(".world__back"), reduced: reduced, lite: lite }); } catch (_) { liveScene = null; }
    if (window.GanchLife && lifeCanvas && !reduced) { life = new window.GanchLife(lifeCanvas, lite); life.resize(); }
  }
  function liveFrame(now) {
    if (!liveStart) liveStart = now;
    var t = (now - liveStart) / 1000, dt = lastLive ? Math.min(.05, (now - lastLive) / 1000) : 1 / 60; lastLive = now;
    var wind = Math.sin(t * .49) * .58 + Math.sin(t * .87 + 1.4) * .27 + Math.sin(t * 1.73) * .15;   // same gust as the shader
    if (liveScene) liveScene.render(t);
    if (life) life.frame(dt, wind);
  }

  function initials() {
    $$("[data-initial]").forEach(function (el) {
      var name = String(data[el.dataset.initial] || "").trim();
      el.textContent = Array.from(name)[0] || "";
    });
  }
  function fitNames() {
    var box = $(".hero__copy"), title = $(".hero__names");
    var size = parseFloat(getComputedStyle(title).fontSize), limit = box.clientWidth - size * .5;
    $$(".hero__name").forEach(function (line) {
      var ink = $(".hero__ink", line);
      line.hidden = !ink.textContent.trim();
      line.style.fontSize = size + "px";
      var width = ink.scrollWidth;
      if (width > limit) line.style.fontSize = Math.max(24, size * limit / width) + "px";
    });
    var greeting = $(".intro__greeting");
    greeting.classList.toggle("is-long", greeting.textContent.length > 38);
  }
  function assetsReady() {
    var fonts = d.fonts ? d.fonts.ready : Promise.resolve();
    var picture = new Image();
    var art = new Promise(function (resolve) { picture.onload = picture.onerror = resolve; picture.src = "art/ganch-doors-v2.webp"; });
    return Promise.race([Promise.all([fonts, art]), new Promise(function (resolve) { setTimeout(resolve, 2000); })]);
  }
  function arrive() {
    if (opening) return;
    fitNames();
    if (!gs || reduced) { intro.classList.add("is-ready"); return; }
    arrival = gs.timeline({ onComplete: function () { intro.classList.add("is-ready"); } });
    arrival.fromTo(".intro__stage", { scale: 1.025 }, { scale: 1, duration: 1.6, ease: "power2.out" }, 0)
      .fromTo(".intro__invitation", { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, .3)
      .fromTo(button, { opacity: 0, scale: .91 }, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, .65)
      .fromTo(".intro__hint", { opacity: 0 }, { opacity: 1, duration: .7 }, 1.35)
      .fromTo(".intro__date", { opacity: 0 }, { opacity: 1, duration: .6 }, 1.6);
  }
  function quietRustle() {
    if (reduced) return;
    try {
      var Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      soundContext = soundContext || new Audio();
      if (soundContext.state === "suspended") soundContext.resume();
      var t = soundContext.currentTime, n = Math.floor(soundContext.sampleRate * .6);
      var buffer = soundContext.createBuffer(1, n, soundContext.sampleRate), samples = buffer.getChannelData(0);
      for (var i = 0; i < n; i++) samples[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n);
      var source = soundContext.createBufferSource(), filter = soundContext.createBiquadFilter(), gain = soundContext.createGain();
      source.buffer = buffer; filter.type = "lowpass"; filter.frequency.value = 520;
      gain.gain.setValueAtTime(.0001, t); gain.gain.exponentialRampToValueAtTime(.008, t + .16); gain.gain.exponentialRampToValueAtTime(.0001, t + .6);
      source.connect(filter); filter.connect(gain); gain.connect(soundContext.destination);
      source.onended = function () { source.disconnect(); filter.disconnect(); gain.disconnect(); };
      source.start(t); source.stop(t + .61);
    } catch (_) {}
  }
  function showAllText() {
    if (!gs) return;
    gs.set(".hero__name,.hero__names .amp,.hero__kicker,.hero__date,.hero__when,.hero__cue", { clearProps: "opacity,transform,clipPath,willChange" });
    gs.set(".hero__world", { clearProps: "transform,willChange" });
    gs.set(".door", { clearProps: "willChange" });
  }
  function finish() {
    if (finished) return;
    finished = true;
    if (openingFilm && openingFilm.progress() < 1) openingFilm.progress(1);
    showAllText();
    intro.hidden = true; intro.setAttribute("aria-hidden", "true");
    root.classList.remove("is-locked"); d.body.classList.add("is-open");
    if (keyboardOpen) $(".hero__names").focus({ preventScroll: true });
    updateAmbient(); story();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  function open(event) {
    if (finished) return;
    if (opening) { finish(); return; }
    opening = true; keyboardOpen = !!event && event.detail === 0;
    if (arrival) { arrival.progress(1); arrival.kill(); }
    intro.classList.add("is-opening");
    if (M.open) M.open();
    root.classList.add("is-locked");
    try { if (navigator.vibrate && !reduced) navigator.vibrate(8); } catch (_) {}
    quietRustle(); fitNames();
    if (!gs || reduced) {
      if (gs) gs.to(intro, { opacity: 0, duration: .6, onComplete: finish });
      else if (intro.animate) { intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: "forwards" }); setTimeout(finish, 610); }
      else finish();
      return;
    }
    var names = $$(".hero__name"), amp = $(".hero__names .amp");
    gs.set(names, { clipPath: "inset(-40% 120% -45% -25%)" });
    gs.set([amp, $(".hero__kicker"), $(".hero__date"), $(".hero__when"), $(".hero__cue")], { opacity: 0 });
    gs.set(".hero__world", { scale: 1.075, y: 8 });
    gs.set(".door", { willChange: "transform" });
    openingFilm = gs.timeline({ onComplete: finish });
    openingFilm.to(button, { scale: .94, duration: .16, ease: "power1.out" }, 0)
      .to(button, { scale: 1.015, duration: .4, ease: "power2.out" }, .16)
      .to(".intro__invitation,.intro__hint,.intro__date,.intro__touchlight", { opacity: 0, duration: .65, ease: "power1.inOut" }, .15)
      .to(".intro__seam", { opacity: .95, scaleY: 1, duration: 1.25, ease: "power2.inOut" }, .2)
      .to(".intro__light", { opacity: .7, duration: 1.4, ease: "sine.inOut" }, .6)
      // the doors first ease ajar, light slipping through the gap…
      .to(".door--left", { rotationY: 11, duration: 1.1, ease: "sine.inOut" }, 1.0)
      .to(".door--right", { rotationY: -11, duration: 1.1, ease: "sine.inOut" }, 1.12)
      // …then swing wide, slowly, with their weight
      .to(".door--left", { rotationY: 86, duration: 3.1, ease: "power2.inOut" }, 2.15)
      .to(".door--right", { rotationY: -86, duration: 3.15, ease: "power2.inOut" }, 2.3)
      .to(".door__shade", { opacity: .65, duration: 3, ease: "sine.inOut" }, 2.15)
      .to(".intro__seam", { opacity: 0, duration: .6 }, 2.3)
      .to(".intro__stage", { scale: 1.11, duration: 3.4, ease: "power2.inOut" }, 2.4)
      .to(".hero__world", { scale: 1, y: 0, duration: 4, ease: "power2.out" }, 2.2)
      .to(".intro__lock", { scale: 1.12, opacity: 0, duration: .75, ease: "power2.in" }, 1.95)
      .to(".intro__light", { opacity: 0, duration: 1, ease: "sine.inOut" }, 4.3)
      .to(intro, { opacity: 0, duration: .7 }, 4.9)
      .to(names[0], { clipPath: "inset(-40% -25% -45% -25%)", duration: 1.2, ease: "sine.inOut" }, 4.3)
      .to(amp, { opacity: 1, duration: .5 }, 5.2)
      .to(names[1], { clipPath: "inset(-40% -25% -45% -25%)", duration: 1.2, ease: "sine.inOut" }, 5.35)
      .to(".hero__kicker,.hero__date,.hero__when", { opacity: 1, duration: .6, stagger: .1, ease: "power1.out" }, 6.0)
      .to(".hero__cue", { opacity: 1, duration: .7, ease: "power1.out" }, 6.1);
    if (lite()) openingFilm.timeScale(1.25);   // weak phones keep the story; never a one-second flash
  }

  function sizeDust() {
    dustW = dustCanvas.clientWidth; dustH = innerHeight;
    var ratio = Math.min(devicePixelRatio || 1, lite() ? 1 : 1.5);
    dustCanvas.width = Math.round(dustW * ratio); dustCanvas.height = Math.round(dustH * ratio);
    dustContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function dustFrame(now) {
    dustRaf = 0;
    if (!finished || reduced || !heroVisible || d.hidden) return;
    var dt = lastFrame ? Math.min((now - lastFrame) / 16.67, 2) : 1; lastFrame = now;
    dustContext.clearRect(0, 0, dustW, dustH);
    var count = lite() ? 9 : 28;
    if (motes.length > count) motes.length = count;
    while (motes.length < count) motes.push({ x: Math.random() * dustW, y: Math.random() * dustH, r: .35 + Math.random() * .8, v: .08 + Math.random() * .2, a: .1 + Math.random() * .2 });
    motes.forEach(function (p) {
      p.y -= p.v * dt; p.x += Math.sin(p.y * .009) * .06 * dt;
      if (p.y < 0) { p.y = dustH; p.x = Math.random() * dustW; }
      dustContext.fillStyle = "rgba(255,247,217," + p.a + ")";
      dustContext.beginPath(); dustContext.arc(p.x, p.y, p.r, 0, Math.PI * 2); dustContext.fill();
    });
    liveFrame(now);
    dustRaf = requestAnimationFrame(dustFrame);
  }
  function updateAmbient() {
    var active = finished && heroVisible && !d.hidden && !reduced;
    hero.classList.toggle("is-ambient", active);
    if (active && !dustRaf) { lastFrame = 0; dustRaf = requestAnimationFrame(dustFrame); }
    else if (!active) { if (dustRaf) cancelAnimationFrame(dustRaf); dustRaf = 0; lastLive = 0; dustContext.clearRect(0, 0, dustW, dustH); }
  }
  function story() {
    if (storyStarted || !gs || !window.ScrollTrigger || reduced) return;
    storyStarted = true; gs.registerPlugin(window.ScrollTrigger);
    gs.fromTo(".hero__world", { scale: 1, y: 0 }, { scale: 1.07, y: -18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .8 } });
    gs.to(".timeline__fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 78%", end: "bottom 57%", scrub: .6 } });
    gs.to(".mini-rosette", { rotation: 55, y: 30, ease: "none", scrollTrigger: { trigger: "#date", start: "top bottom", end: "bottom top", scrub: .8 } });
    gs.fromTo(".section__ornament", { rotation: -35 }, { rotation: 15, ease: "none", scrollTrigger: { trigger: "#invitation-text", start: "top bottom", end: "bottom top", scrub: 1 } });
    gs.from(".letter__greeting,.letter__message,.hosts", { opacity: 0, y: 14, duration: 1, stagger: .17, ease: "power2.out", scrollTrigger: { trigger: "#invitation-text", start: "top 78%", once: true } });
    gs.from(".calendar", { opacity: 0, scale: .97, rotation: -.8, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: "#date", start: "top 78%", once: true } });
    gs.from(".program__item", { opacity: 0, x: -12, duration: .7, stagger: .13, ease: "power2.out", scrollTrigger: { trigger: ".timeline", start: "top 83%", once: true } });
    gs.from(".venue__photo", { opacity: 0, y: 24, duration: 1.1, ease: "power2.out", scrollTrigger: { trigger: ".venue__photo", start: "top 83%", once: true } });
    gs.from(".gallery__frame", { opacity: 0, x: 20, duration: 1, ease: "power2.out", scrollTrigger: { trigger: "#gallery", start: "top 78%", once: true } });
    gs.from(".rsvp__fields", { opacity: 0, y: 18, duration: 1, ease: "power2.out", scrollTrigger: { trigger: "#rsvp", start: "top 78%", once: true } });
    gs.from(".wishes__item", { opacity: 0, y: 15, duration: .9, stagger: .13, ease: "power2.out", scrollTrigger: { trigger: "#wishes", start: "top 78%", once: true } });
    gs.from(".gift", { opacity: 0, rotationX: -8, transformPerspective: 800, duration: 1, ease: "power2.out", scrollTrigger: { trigger: "#toyona", start: "top 78%", once: true } });
  }
  function celebrate(answer) {
    if (!answer || answer.status !== "yes" || reduced) return;
    var stamp = $(".rsvp__stamp");
    if (stamp && stamp.animate) stamp.animate([{ opacity: 0, transform: "rotate(-30deg) scale(.8)" }, { opacity: 1, transform: "rotate(0) scale(1)" }], { duration: 1000, easing: "cubic-bezier(.2,.7,.2,1)" });
  }
  function init() {
    if (!intro || !button) return;
    initials(); fitNames(); sizeDust(); makeLive();
    var music = $("[data-music]"); if (music) music.volume = .16;
    button.addEventListener("click", function (e) { e.stopPropagation(); open(e); });
    intro.addEventListener("click", function () { if (opening) finish(); });
    intro.addEventListener("keydown", function (e) { if (opening && (e.key === "Escape" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); finish(); } });
    intro.addEventListener("pointermove", function (e) {
      if (opening || reduced || lite() || e.pointerType === "touch" && !e.buttons) return;
      var rect = intro.getBoundingClientRect(), light = $(".intro__touchlight");
      light.style.opacity = ".55";
      light.style.transform = "translate3d(" + ((e.clientX - rect.left - rect.width / 2) * .6) + "px," + ((e.clientY - rect.top - rect.height / 2) * .65) + "px,0)";
    }, { passive: true });
    intro.addEventListener("pointerleave", function () { if (!opening) $(".intro__touchlight").style.opacity = "0"; });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) { heroVisible = entries[0].isIntersecting; updateAmbient(); }, { threshold: .02 }).observe(hero);
    }
    d.addEventListener("visibilitychange", function () { root.classList.toggle("is-page-hidden", d.hidden); updateAmbient(); });
    addEventListener("resize", function () { fitNames(); sizeDust(); if (liveScene && liveScene.ready) { liveScene.resize(); liveScene.render(0); } if (life) life.resize(); updateAmbient(); }, { passive: true });
    if (M.on) { M.on("rsvp", celebrate); M.on("tier", updateAmbient); }
    assetsReady().then(arrive);
    if (d.fonts) d.fonts.ready.then(fitNames);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
