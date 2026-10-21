(function () {
  "use strict";
  function init() {
    var intro = document.getElementById("intro");
    var openButton = document.getElementById("open-invitation");
    if (!intro || !openButton) return;
    var reduced = !!(window.Marhamat && window.Marhamat.reducedMotion);
    var lite = !!(window.Marhamat && window.Marhamat.tier === "lite");
    var full = !reduced && !lite && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    var opening = false;
    var done = false;
    var timer = 0;
    var raf = 0;
    var introCanvas = intro.querySelector("canvas");
    var ctx = introCanvas && introCanvas.getContext("2d", { alpha: true });
    var particles = [];
    var dpr = 1;
    var width = 0;
    var height = 0;
    var startedAt = performance.now();
    var particleLimit = lite ? 14 : 42;

    function resizeIntro() {
      if (!ctx) return;
      var rect = intro.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
      width = rect.width;
      height = rect.height;
      introCanvas.width = Math.round(width * dpr);
      introCanvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seedParticles() {
      particles = [];
      for (var i = 0; i < particleLimit; i += 1) {
        particles.push({ x: width * (.34 + Math.random() * .32), y: height * (.74 + Math.random() * .24), age: Math.random(), life: .7 + Math.random() * 1.4, size: 1.2 + Math.random() * 3.8, speed: .13 + Math.random() * .38, drift: (Math.random() - .5) * .18, steam: i > particleLimit * .64 });
      }
    }
    function drawParticles(now) {
      if (!ctx || done || document.hidden) return;
      ctx.clearRect(0, 0, width, height);
      var dt = Math.min((now - (drawParticles.last || now)) / 1000, .05);
      drawParticles.last = now;
      particles.forEach(function (p, i) {
        p.age += dt / p.life;
        if (p.age >= 1) { p.age = 0; p.x = width * (.39 + Math.random() * .22); p.y = height * (.78 + Math.random() * .16); }
        var progress = p.age;
        p.y -= p.speed * dt * (p.steam ? 55 : 27);
        p.x += Math.sin(now * .0007 + i) * p.drift * dt * 20;
        var alpha = (1 - progress) * (p.steam ? .15 : .48);
        if (p.steam) {
          ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size * (.6 + progress), p.size * (1.4 + progress * 2), .2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,224,177," + alpha + ")"; ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 - progress * .55), 0, Math.PI * 2);
          ctx.fillStyle = i % 3 ? "rgba(242,162,89," + alpha + ")" : "rgba(255,211,125," + alpha + ")"; ctx.fill();
        }
      });
      raf = requestAnimationFrame(drawParticles);
    }
    if (ctx && full) {
      resizeIntro(); seedParticles(); raf = requestAnimationFrame(drawParticles);
      window.addEventListener("resize", function () { resizeIntro(); seedParticles(); }, { passive: true });
      document.addEventListener("visibilitychange", function () { if (document.hidden) cancelAnimationFrame(raf); else if (!done) raf = requestAnimationFrame(drawParticles); });
    }

    // Arrival: stars and the courtyard settle before the board invites the guest in.
    if (window.gsap && full) {
      window.gsap.fromTo(intro.querySelector(".intro__copy"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, ease: "power3.out", delay: .18 });
      window.gsap.fromTo(openButton, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .75, ease: "power3.out", delay: .85 });
    }
    function finish() {
      if (done) return;
      done = true; window.clearTimeout(timer); cancelAnimationFrame(raf);
      document.documentElement.classList.remove("is-locked");
      document.body.classList.remove("is-opening"); document.body.classList.add("is-open");
      intro.hidden = true; intro.setAttribute("aria-hidden", "true");
      var hero = document.getElementById("hero");
      if (hero) hero.scrollIntoView({ block: "start", behavior: "auto" });
      if (window.gsap && full) {
        var heroText = hero.querySelectorAll(".eyebrow,.hero__name,.hero__invite,.hero__hosts,.hero__date");
        if (heroText.length) window.gsap.fromTo(Array.prototype.slice.call(heroText), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .78, stagger: .12, ease: "power3.out", delay: .08 });
      }
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }
    function open(event) {
      if (event) event.stopPropagation();
      if (opening) { finish(); return; }
      opening = true;
      if (window.Marhamat && typeof window.Marhamat.open === "function") window.Marhamat.open();
      else document.documentElement.classList.remove("is-locked");
      intro.classList.add("is-rising");
      window.setTimeout(function () { intro.classList.add("is-opening"); document.body.classList.add("is-opening"); }, reduced ? 0 : lite ? 180 : 850);
      timer = window.setTimeout(finish, reduced ? 60 : lite ? 700 : 1850);
    }
    openButton.addEventListener("click", open);
    intro.addEventListener("click", function () { if (opening) finish(); });
    window.addEventListener("keydown", function (event) { if (event.key === "Escape" && opening) finish(); });

    // A small rice mound is painted only near the viewport; each plate grows as its section arrives.
    var plates = Array.prototype.slice.call(document.querySelectorAll(".lagan canvas"));
    function paintPlate(canvas, progress) {
      var rect = canvas.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
      var w = Math.max(1, rect.width); var h = Math.max(1, rect.height);
      canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
      var c = canvas.getContext("2d"); if (!c) return;
      c.setTransform(ratio, 0, 0, ratio, 0, 0); c.clearRect(0, 0, w, h);
      var count = Math.round((lite ? 10 : 24) * Math.max(0, Math.min(1, progress)));
      for (var j = 0; j < count; j += 1) {
        var seed = j * 47 + canvas.dataset.seed * 13;
        var x = 24 + ((seed * 17) % 113);
        var mound = Math.sin((x / 160) * Math.PI) * 16;
        var y = h - 13 - mound - ((seed * 19) % 12);
        c.save(); c.translate(x, y); c.rotate(((seed % 9) - 4) * .09);
        c.fillStyle = j % 4 === 0 ? "#e17837" : j % 5 === 0 ? "#d49a3d" : "#fff5dc";
        c.beginPath(); c.ellipse(0, 0, 2.8, 1.15, 0, 0, Math.PI * 2); c.fill(); c.restore();
      }
    }
    plates.forEach(function (canvas, index) { canvas.dataset.seed = String(index + 1); paintPlate(canvas, 0); });
    if (window.IntersectionObserver) {
      var grainObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var canvas = entry.target.querySelector("canvas");
          if (canvas) {
            var index = plates.indexOf(canvas);
            var progress = Math.min(1, .24 + index * .12);
            if (window.gsap && full) { var grow = { value: 0 }; window.gsap.to(grow, { value: progress, duration: .9, ease: "power2.out", onUpdate: function () { paintPlate(canvas, grow.value); } }); }
            else paintPlate(canvas, progress);
          }
        });
      }, { threshold: .12 });
      document.querySelectorAll(".section .lagan").forEach(function (element) { grainObserver.observe(element); });
    }

    // Section-specific entrances plus four scrubbed cues: sunrise, scene parallax, timeline ink, and rice.
    if (window.gsap && window.ScrollTrigger && full) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      function entrance(selector, from, to) {
        var nodes = Array.prototype.slice.call(selector);
        if (nodes.length) window.gsap.fromTo(nodes, from, to);
      }
      window.gsap.utils.toArray(".section").forEach(function (section, index) {
        entrance(section.querySelectorAll(".eyebrow,.section__title"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .72, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 78%", once: true } });
        if (index % 2 === 0) entrance(section.querySelectorAll(".message,.venue-card,.dresscode,.wishes__item"), { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: .8, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 75%", once: true } });
        else entrance(section.querySelectorAll(".countdown,.program__item,.gallery__item,.rsvp__choices button,.gift"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .65, stagger: .09, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 77%", once: true } });
      });
      window.gsap.to(".sun-clock__arc i", { rotation: 84, ease: "none", scrollTrigger: { trigger: ".section--date", start: "top bottom", end: "bottom top", scrub: 1 } });
      window.gsap.to(".program__rail path", { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".section--program", start: "top 75%", end: "bottom 30%", scrub: 1 } });
      window.gsap.to(".hero__art", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
      window.gsap.utils.toArray(".lagan").forEach(function (plate) { window.gsap.fromTo(plate, { y: 8, opacity: .72 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: plate.parentElement, start: "top bottom", end: "bottom 45%", scrub: 1 } }); });
    }
    if (window.Marhamat && typeof window.Marhamat.on === "function") {
      window.Marhamat.on("rsvp", function (answer) {
        if (!answer || answer.status !== "yes" || reduced) return;
        var steam = document.querySelector(".rsvp__steam");
        if (steam && steam.animate) steam.animate([{ transform: "translateY(7px) scale(.7)", opacity: .25 }, { transform: "translateY(-9px) scale(1.15)", opacity: 1 }, { transform: "translateY(-3px) scale(1)", opacity: 1 }], { duration: 780, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    }
    window.addEventListener("resize", function () { plates.forEach(function (canvas) { paintPlate(canvas, .6); }); }, { passive: true });
    if (window.gsap && window.ScrollTrigger) window.ScrollTrigger.refresh();
    void startedAt;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
