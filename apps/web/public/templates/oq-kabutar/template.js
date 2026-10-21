(function () {
  "use strict";
  var intro, button, leftDove, rightDove, ribbon, banner, ribbonText, ribbonPath, copy, main, canvas, ctx, featherImage;
  var opening = false, finished = false, introTl, raf = 0, particles = [], lastTime = 0, scrollTriggers = [];
  var reduced = false, tier = "lite";

  function qs(selector, scope) { return (scope || document).querySelector(selector); }
  function qsa(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }
  function bezier(p0, p1, p2, p3, t) {
    var u = 1 - t, tt = t * t, uu = u * u;
    return { x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
      y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y };
  }
  /* Flight engine. Sprite frames: 0 wings up, 1 mid-up, 2 level, 3 down.
     A wingbeat is a quick downstroke (0→3) and a slower upstroke (3→0); the body lifts on
     each downstroke, tilts along its path, and glides with wings held in a V (frame 1). */
  var flock = [], wingRaf = 0, wingLast = 0;
  function Bird(el, mirror, bob) {
    this.el = el; this.mirror = !!mirror; this.bob = bob == null ? 5 : bob;
    this.x = 0; this.y = 0; this.s = 1; this.o = 1; this.tilt = 0; this.extraRot = 0;
    this.rate = 0; this.phase = Math.random(); this.gliding = true; this.pitch = 0; this.px = null; this.py = null; this.t = Math.random() * 10;
    this.active = true; flock.push(this); wake();
  }
  Bird.prototype.flap = function (rate) { this.rate = rate; this.gliding = false; };
  Bird.prototype.glide = function () { this.gliding = true; };
  Bird.prototype.stop = function () { this.active = false; };
  function wingFrame(u) { return u < .42 ? Math.min(3, Math.floor(u / .42 * 4)) : Math.max(0, 3 - Math.floor((u - .42) / .58 * 4)); }
  function renderBirds(time) {
    wingRaf = 0;
    var dt = Math.min(.05, ((time - (wingLast || time)) / 1000)); wingLast = time;
    flock = flock.filter(function (b) { return b.active && b.el.isConnected; });
    flock.forEach(function (b) {
      b.t += dt;
      var frame, lift;
      if (b.gliding) { frame = 1; lift = Math.sin(b.t * 1.6) * b.bob * .25; }
      else { b.phase = (b.phase + b.rate * dt) % 1; frame = wingFrame(b.phase); lift = -Math.sin(b.phase * Math.PI * 2) * b.bob; }
      if (b.px !== null) {
        var dx = b.x - b.px, dy = b.y - b.py;
        if (Math.abs(dx) + Math.abs(dy) > .3) { var target = Math.max(-20, Math.min(20, Math.atan2(dy, Math.abs(dx) + .001) * 57.3 * .55)); b.pitch += (target - b.pitch) * .12; }
        else b.pitch *= .92;
      }
      b.px = b.x; b.py = b.y;
      var dir = b.mirror ? -1 : 1;
      b.el.style.backgroundPosition = (frame * 33.333) + "% 50%";
      b.el.style.opacity = b.o;
      b.el.style.transform = "translate3d(" + b.x.toFixed(1) + "px," + (b.y + lift).toFixed(1) + "px,0) rotate(" + (dir * b.pitch + b.extraRot).toFixed(2) + "deg) scale(" + (dir * b.s).toFixed(3) + "," + b.s.toFixed(3) + ")";
    });
    if (flock.length && !document.hidden) wingRaf = requestAnimationFrame(renderBirds);
  }
  function wake() { if (!wingRaf) { wingLast = 0; wingRaf = requestAnimationFrame(renderBirds); } }
  document.addEventListener("visibilitychange", function () { if (!document.hidden && flock.length) wake(); });
  // Moves a bird along a cubic bezier, changing wing behaviour at chosen points of the path.
  function flyPath(bird, from, c1, c2, to, duration, delay, phases, ease, extra) {
    var prog = { p: 0 }, tl = gsap.timeline({ delay: delay || 0 });
    tl.to(prog, { p: 1, duration: duration, ease: ease || "sine.inOut", onUpdate: function () { var pt = bezier(from, c1, c2, to, prog.p); bird.x = pt.x; bird.y = pt.y; if (extra) extra(prog.p); } }, 0);
    (phases || []).forEach(function (ph) { tl.call(function () { if (ph.rate) bird.flap(ph.rate); else bird.glide(); }, null, ph.at * duration); });
    return tl;
  }
  // Hovering while holding the ribbon: a few gentle beats, then a short glide, out of phase.
  function hover(bird, baseX, baseY, offset) {
    var state = { k: 0 };
    bird.hoverTl = gsap.timeline({ repeat: -1, delay: offset });
    bird.hoverTl.call(function () { bird.flap(3.4); }).to(state, { k: 1, duration: 1.25, ease: "sine.inOut", onUpdate: function () { bird.y = baseY - state.k * 4; } })
      .call(function () { bird.glide(); }).to(state, { k: 0, duration: .85, ease: "sine.inOut", onUpdate: function () { bird.y = baseY - state.k * 4; } });
    bird.x = baseX;
  }
  var arrivalBirds = [];
  function startArrival() {
    if (!intro || !window.gsap) { if (button) button.style.opacity = "1"; return; }
    reduced = !!(window.Marhamat && window.Marhamat.reducedMotion);
    tier = window.Marhamat && window.Marhamat.tier || "lite";
    var short = reduced || tier === "lite", duration = short ? 2.1 : 2.6;
    var w = window.innerWidth, h = window.innerHeight, center = w / 2, doveW = 90, doveH = 128;
    var ribbonWidth = Math.min(w * .86, 430), endOffset = ribbonWidth * .47;
    var ribbonTop = ribbon ? ribbon.getBoundingClientRect().top : h * .34, dockY = ribbonTop + ribbonWidth * .13 - doveH / 2;
    var left = { x: -145, y: h * .26 }, leftEnd = { x: center - endOffset - doveW / 2, y: dockY };
    var right = { x: w + 145, y: h * .27 }, rightEnd = { x: center + endOffset - doveW / 2, y: dockY };
    gsap.set([leftDove, rightDove], { opacity: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });
    gsap.set(copy, { opacity: 0, y: 18, xPercent: -50 });
    gsap.set(button, { opacity: 0, y: 10, scale: .97 });
    if (reduced) {
      gsap.set(leftDove, { opacity: .8, x: center - 60, y: h * .3, scaleX: 1, scaleY: 1 }); gsap.set(rightDove, { opacity: .8, x: center + 60, y: h * .3, scaleX: -1, scaleY: 1 });
      gsap.set(copy, { opacity: 1, y: 0 }); gsap.set(button, { opacity: 1, y: 0, scale: 1 });
      gsap.set(ribbonPath, { strokeDashoffset: 0 }); gsap.set(banner, { opacity: 1, scaleX: 1 }); gsap.set(ribbonText, { opacity: 1 });
      return;
    }
    // Takeoff flapping → V-glide → flare with fast beats before landing → hover with the ribbon.
    var flightPhases = [{ at: 0, rate: 5.2 }, { at: .46 }, { at: .72, rate: 7 }];
    var lb = new Bird(leftDove, false, 5), rb = new Bird(rightDove, true, 5);
    lb.o = rb.o = 0; lb.s = rb.s = .78; arrivalBirds = [lb, rb];
    var fd = duration * .78;
    flyPath(lb, left, { x: w * .12, y: h * .06 }, { x: w * .36, y: h * .46 }, leftEnd, fd, .15, flightPhases, "power1.inOut", function (p) { lb.o = Math.min(1, p * 6); lb.s = .78 + .22 * p; })
      .call(function () { hover(lb, leftEnd.x, leftEnd.y, 0); });
    flyPath(rb, right, { x: w * .88, y: h * .08 }, { x: w * .64, y: h * .47 }, rightEnd, fd, .27, flightPhases, "power1.inOut", function (p) { rb.o = Math.min(1, p * 6); rb.s = .78 + .22 * p; })
      .call(function () { hover(rb, rightEnd.x, rightEnd.y, .55); });
    var greeting = qs(".intro__greeting", intro), names = qs(".intro__names", intro), date = qs(".intro__date", intro);
    introTl = gsap.timeline({ delay: 0.02 });
    introTl.to(greeting, { opacity: 1, y: 0, duration: .45, ease: "power2.out" }, .03)
      .to(ribbonPath, { strokeDashoffset: 0, duration: .9, ease: "power2.inOut" }, .83)
      .to(banner, { opacity: 1, scaleX: 1, duration: .55, ease: "power3.out" }, 1.34)
      .to(ribbonText, { opacity: 1, duration: .32 }, 1.58)
      .to(copy, { opacity: 1, y: 0, duration: .55, ease: "power3.out" }, 1.48)
      .fromTo([names, date], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5, stagger: .12, ease: "power2.out" }, 1.72)
      .to(button, { opacity: 1, y: 0, scale: 1, duration: .48, ease: "back.out(1.25)" }, duration - .4);
  }
  function revealHero() {
    if (finished || !window.gsap) return;
    var mark = qs(".hero .ring-mark"), names = qs(".hero .hero__names"), labels = qsa(".hero .eyebrow, .hero .hero__date, .hero .hero__divider, .hero .scroll-cue");
    if (reduced) {
      gsap.fromTo([mark, names, labels], { opacity: 0 }, { opacity: 1, duration: .32, stagger: .08, ease: "power1.out" });
      return;
    }
    gsap.fromTo(mark, { opacity: 0, scale: .55, rotateY: -28 }, { opacity: 1, scale: 1, rotateY: 0, duration: .8, ease: "back.out(1.15)" });
    gsap.fromTo(names, { clipPath: "inset(0 100% 0 0)", opacity: .25 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1, delay: .22, ease: "power2.out" });
    gsap.fromTo(labels, { opacity: 0, y: 9 }, { opacity: 1, y: 0, duration: .45, stagger: .1, delay: .48, ease: "power2.out" });
  }
  function finishIntro() {
    if (finished) return;
    finished = true; opening = false;
    if (introTl) introTl.progress(1);
    arrivalBirds.forEach(function (b) { if (b.hoverTl) b.hoverTl.kill(); b.stop(); });
    document.documentElement.classList.remove("is-locked");
    document.body.classList.add("is-open");
    if (canvas) canvas.classList.remove("is-intro");
    if (intro) { intro.hidden = true; intro.setAttribute("aria-hidden", "true"); }
    if (main) { var hero = qs("#hero"); if (hero) hero.scrollIntoView({ block: "start", behavior: "auto" }); }
    if (!reduced) startParticles();
  }
  function beginRelease(event) {
    if (event) event.stopPropagation();
    if (opening) { finishIntro(); return; }
    if (finished) return;
    opening = true;
    if (window.Marhamat && typeof window.Marhamat.open === "function") window.Marhamat.open();
    document.body.classList.add("is-opening");
    if (reduced || !window.gsap) { finishIntro(); return; }
    var doves = [leftDove, rightDove], h = window.innerHeight, w = window.innerWidth, ribbonWidth = Math.min(w * .86, 430), endOffset = ribbonWidth * .47, doveW = 90;
    var dockY = (ribbon ? ribbon.getBoundingClientRect().top : h * .34) + ribbonWidth * .13 - 64, leftDock = w / 2 - endOffset - doveW / 2, rightDock = w / 2 + endOffset - doveW / 2;
    // Release: a hard first beat, the doves cross and climb away, shrinking with distance.
    var rd = tier === "lite" ? 1.4 : 1.75, releasePhases = [{ at: 0, rate: 8 }, { at: .55, rate: 6 }, { at: .82 }];
    arrivalBirds.forEach(function (b, i) {
      if (b.hoverTl) b.hoverTl.kill();
      var sx = b.x, sy = b.y, toLeft = i === 1;
      flyPath(b, { x: sx, y: sy }, { x: sx + (toLeft ? -1 : 1) * w * .04, y: sy - h * .1 }, { x: w * (toLeft ? .38 : .62), y: sy - h * .28 }, { x: toLeft ? -w * .05 : w * 1.05, y: -h * .08 }, rd, i * .06, releasePhases, "power2.in", function (p) { b.s = 1 - p * .6; b.o = p > .85 ? 1 - (p - .85) / .15 : 1; });
    });
    gsap.to([ribbonPath, banner, ribbonText], { opacity: 0, duration: .4, stagger: .04, ease: "power1.in" });
    gsap.to(qs(".release-rings", intro), { opacity: 1, scale: 1, rotateY: 360, duration: .9, delay: .42, ease: "back.out(1.15)" });
    gsap.to(qsa(".cloud", intro), { x: function (i) { return (i % 2 ? 1 : -1) * window.innerWidth * .62; }, opacity: 0, duration: 1.1, delay: .24, stagger: .04, ease: "power2.inOut" });
    if (canvas) canvas.classList.add("is-intro");
    spawnFeathers(20);
    window.setTimeout(function () { gsap.to(qs(".release-rings", intro), { y: -window.innerHeight * .3, scale: .62, duration: .72, ease: "power3.inOut" }); }, tier === "lite" ? 1000 : 1320);
    var revealDelay = tier === "lite" ? 1.35 : 2.05;
    window.setTimeout(revealHero, revealDelay * 1000);
    var timeout = tier === "lite" ? 2500 : 3300;
    var timer = window.setTimeout(finishIntro, timeout);
    intro.addEventListener("click", function skip() { if (opening) { clearTimeout(timer); finishIntro(); } }, { once: true });
  }
  function initScroll() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (!reduced) {
      gsap.to(".sky-cloud--far", { y: 95, xPercent: 5, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 } });
      gsap.to(".sky-cloud--mid", { y: 180, xPercent: -9, opacity: .14, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.3 } });
      gsap.to(".sky-cloud--near", { y: 270, xPercent: 12, opacity: .04, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.6 } });
      gsap.to(".feather--invitation", { rotation: -18, y: 34, ease: "none", scrollTrigger: { trigger: ".invitation", start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(".program", { "--line-progress": 1, ease: "none", scrollTrigger: { trigger: ".program", start: "top 75%", end: "bottom 55%", scrub: 1 } });
      gsap.to(".countdown-ring__progress", { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".countdown-ring", start: "top 88%", end: "top 35%", scrub: 1 } });
    } else {
      gsap.set(".countdown-ring__progress", { strokeDashoffset: 0 }); gsap.set(".program", { "--line-progress": 1 });
    }
    qsa(".section").forEach(function (section, i) {
      var children = qsa(":scope > .eyebrow, :scope > .section__title, :scope > p, :scope > .calendar, :scope > .countdown-ring, :scope > .program, :scope > .venue__arch, :scope > .gallery__frame, :scope > form, :scope > ul, :scope > details", section);
      if (reduced) { gsap.set(children, { opacity: 1 }); return; }
      gsap.fromTo(children, { opacity: 0, y: i % 2 ? 16 : 10 }, { opacity: 1, y: 0, duration: .8, stagger: .07, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 80%", once: true } });
    });
    if (tier === "full" && !reduced) {
      var birdTimer = 0, bird = qs(".hero-bird");
      // A distant dove crossing the sky: three beats to climb, then a long sinking glide, repeated.
      function glidePast() {
        if (document.hidden || !bird) return;
        if (bird._bird) bird._bird.stop();
        var b = bird._bird = new Bird(bird, false, 3), w = window.innerWidth;
        b.o = .62; b.s = .8; b.x = -140; b.y = 0;
        var trip = gsap.timeline({ onComplete: function () { b.o = 0; setTimeout(function () { b.stop(); }, 50); } });
        trip.to(b, { x: w + 180, duration: 8.5, ease: "none" }, 0);
        for (var k = 0; k < 4; k++) {
          trip.call(function () { b.flap(4.2); }, null, k * 2.2)
            .to(b, { y: "-=16", duration: .75, ease: "sine.out" }, k * 2.2)
            .call(function () { b.glide(); }, null, k * 2.2 + .75)
            .to(b, { y: "+=11", duration: 1.45, ease: "sine.inOut" }, k * 2.2 + .75);
        }
      }
      ScrollTrigger.create({ trigger: "#hero", start: "top top", end: "bottom top", onEnter: function () { glidePast(); birdTimer = window.setInterval(glidePast, 12000); }, onEnterBack: function () { glidePast(); birdTimer = window.setInterval(glidePast, 12000); }, onLeave: function () { clearInterval(birdTimer); }, onLeaveBack: function () { clearInterval(birdTimer); } });
    }
  }
  function drawRingOnDate() {
    var rsvp = qs("[data-rsvp]");
    if (!window.Marhamat) return;
    window.Marhamat.on("rsvp", function (answer) {
      if (!answer || answer.status !== "yes" || reduced) return;
      var rect = rsvp.getBoundingClientRect();
      for (var i = 0; i < 2; i++) {
        var bird = document.createElement("span"); bird.className = "rsvp-flight rsvp-flight--" + i; bird.innerHTML = "<i></i>" + (i ? "<b>♡</b>" : ""); rsvp.appendChild(bird);
        var wings = new Bird(bird.querySelector("i"), i === 0, 2); wings.flap(9);
        (function (bird, wings) {
          gsap.fromTo(bird, { x: i ? rect.width * .61 : rect.width * .36, y: rect.height * .72, opacity: 0, scale: .5 }, { x: i ? rect.width * .8 : rect.width * .2, y: -30, opacity: 1, scale: 1, duration: 1.3, ease: "power2.out", onComplete: function () { wings.stop(); bird.remove(); } });
        })(bird, wings);
      }
      spawnFeathers(5);
    });
  }
  function prepareCanvas() {
    canvas = qs(".feather-canvas"); if (!canvas) return;
    ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    featherImage = new Image(); featherImage.src = "art/feathers.webp";
    resizeCanvas(); window.addEventListener("resize", resizeCanvas, { passive: true });
  }
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, tier === "lite" ? 1.5 : 2);
    canvas.width = Math.round(window.innerWidth * dpr); canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px"; canvas.style.height = window.innerHeight + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function newParticle(x, y) {
    return { x: x == null ? Math.random() * window.innerWidth : x, y: y == null ? -18 : y, frame: Math.floor(Math.random() * 4), scale: .07 + Math.random() * .08,
      speed: .3 + Math.random() * .7, sway: 12 + Math.random() * 20, phase: Math.random() * 6.28, spin: (Math.random() - .5) * .02, angle: Math.random() * 6.28, opacity: .25 + Math.random() * .3 };
  }
  function spawnFeathers(count) { if (reduced) return; var max = tier === "full" ? 25 : 15; for (var i = 0; i < count && particles.length < max; i++) particles.push(newParticle()); if (canvas) canvas.style.opacity = "1"; if (!raf) raf = requestAnimationFrame(drawParticles); }
  function startParticles() { if (!reduced) spawnFeathers(tier === "full" ? 14 : 7); }
  function drawParticles(time) {
    raf = 0;
    if (document.hidden || !document.body.classList.contains("is-open")) return;
    if (!opening && !document.body.classList.contains("is-open")) return;
    if (!canvas || !ctx || !featherImage || !featherImage.complete) { raf = requestAnimationFrame(drawParticles); return; }
    var dt = Math.min(2, (time - (lastTime || time)) / 16.67); lastTime = time;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var cellW = featherImage.naturalWidth / 4, cellH = featherImage.naturalHeight;
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i]; p.y += p.speed * dt; p.phase += .025 * dt; p.x += Math.sin(p.phase) * .22 * dt; p.angle += p.spin * dt;
      if (p.y > window.innerHeight + 40) { particles.splice(i, 1); continue; }
      var width = cellW * p.scale, height = cellH * p.scale;
      ctx.save(); ctx.globalAlpha = p.opacity; ctx.translate(p.x + Math.sin(p.phase) * p.sway, p.y); ctx.rotate(p.angle);
      ctx.drawImage(featherImage, p.frame * cellW, 0, cellW, cellH, -width / 2, -height / 2, width, height); ctx.restore();
    }
    if (particles.length < (tier === "full" ? 6 : 3) && Math.random() < .012) particles.push(newParticle());
    if (particles.length) raf = requestAnimationFrame(drawParticles); else canvas.style.opacity = "0";
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden && particles.length && document.body.classList.contains("is-open") && !raf) raf = requestAnimationFrame(drawParticles); });
  function init() {
    intro = qs("#intro"); button = qs("#open-invitation"); leftDove = qs(".arrival-dove--left"); rightDove = qs(".arrival-dove--right"); ribbon = qs(".ribbon"); banner = qs(".ribbon__banner"); ribbonText = qs(".ribbon__text"); ribbonPath = qs(".ribbon__path"); copy = qs(".intro__copy"); main = qs("#page");
    reduced = !!(window.Marhamat && window.Marhamat.reducedMotion); tier = window.Marhamat && window.Marhamat.tier || "lite";
    prepareCanvas(); if (button) button.addEventListener("click", beginRelease); if (intro) intro.addEventListener("click", function () { if (opening) finishIntro(); });
    if (window.Marhamat && window.Marhamat.on) window.Marhamat.on("ready", function () {
      startArrival(); initScroll(); drawRingOnDate();
      window.Marhamat.on("section", function (detail) { if (detail && detail.name === "footer") detail.element.classList.add("is-doves-awake"); });
    }); else { startArrival(); initScroll(); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
