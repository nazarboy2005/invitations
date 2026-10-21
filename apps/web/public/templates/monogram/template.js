(function () {
  "use strict";
  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.from((root || document).querySelectorAll(selector)); };
  var reduced = function () { return !!(window.Marhamat && window.Marhamat.reducedMotion); };
  var grapheme = function (value) {
    value = String(value || "").trim();
    if (!value) return "M";
    if (window.Intl && Intl.Segmenter) return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value))[0].segment;
    return Array.from(value)[0] || "M";
  };

  function initials() {
    var data = window.Marhamat && window.Marhamat.data || {};
    var one = grapheme(data.groom);
    var two = grapheme(data.bride);
    var cyrillic = /\p{Script=Cyrillic}/u.test(one + two);
    var intro = $("#intro"), hero = $("#hero");
    if (intro) intro.classList.toggle("is-cyrillic", cyrillic);
    if (hero) hero.classList.toggle("is-cyrillic", cyrillic);
    document.body.classList.toggle("has-cyrillic", cyrillic);
    var a = $(".seal-initial--one"), b = $(".seal-initial--two");
    if (a) { a.textContent = one; a.setAttribute("x", cyrillic ? "112" : "150"); a.setAttribute("y", cyrillic ? "176" : "174"); }
    if (b) { b.textContent = two; b.setAttribute("x", cyrillic ? "190" : "150"); b.setAttribute("y", cyrillic ? "176" : "218"); }
    $$(".hero__initial--one").forEach(function (el) { el.textContent = one; });
    $$(".hero__initial--two").forEach(function (el) { el.textContent = two; });
    $$(`[data-monogram-part="one"]`).forEach(function (el) { el.textContent = one; });
    $$(`[data-monogram-part="two"]`).forEach(function (el) { el.textContent = two; });
  }


  function splitHeroNames() {
    var names = $$(".hero__names [data-slot]");
    if (!names.length) return;
    var index = 0;
    names.forEach(function (line) {
      var value = line.textContent || "";
      if (!value) return;
      var letters = window.Intl && Intl.Segmenter
        ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value), function (part) { return part.segment; })
        : Array.from(value);
      line.textContent = "";
      line.classList.add("hero__name-line");
      letters.forEach(function (letter) {
        var span = document.createElement("span");
        span.className = "hero__char";
        span.textContent = letter === " " ? "\u00a0" : letter;
        span.style.setProperty("--letter-delay", Math.min(index, 28) * 34 + "ms");
        line.appendChild(span);
        index += 1;
      });
    });
    $("#hero").classList.add("has-split");
  }

  function animateSeal() {
    var ring = $(".seal-ring:not(.seal-ring--inner)");
    var inner = $(".seal-ring--inner");
    var letters = $$(".seal-initial");
    if (!ring) return;
    var lengths = [ring, inner].concat(letters).map(function (el) {
      try { return el.getTotalLength ? el.getTotalLength() : 862; } catch (_) { return 862; }
    });
    [ring, inner].concat(letters).forEach(function (el, i) {
      if (!el) return;
      el.style.strokeDasharray = lengths[i];
      el.style.strokeDashoffset = lengths[i];
    });
    if (reduced()) {
      ring.style.strokeDashoffset = "0";
      letters.forEach(function (el) { el.style.strokeDashoffset = "0"; el.style.fill = "#C9B183"; });
      if (inner) inner.style.opacity = "1";
      return;
    }
    if (window.gsap) {
      var tl = gsap.timeline({ delay: .12 });
      tl.to(ring, { strokeDashoffset: 0, duration: 1.18, ease: "power2.inOut" })
        .to(letters[0], { strokeDashoffset: 0, duration: .96, ease: "none" }, .5)
        .to(letters[1], { strokeDashoffset: 0, duration: .84, ease: "none" }, 1.03)
        .to(inner, { opacity: 1, duration: .35 }, 1.65)
        .to(".seal-shimmer", { x: "120%", opacity: .8, duration: .7, ease: "power1.inOut" }, 1.78)
        .to(letters, { fill: "#C9B183", duration: .35 }, 2.05);
    } else {
      [ring].concat(letters).forEach(function (el, i) {
        el.style.transition = "stroke-dashoffset " + (i ? 1 : 1.6) + "s ease";
        requestAnimationFrame(function () { el.style.strokeDashoffset = "0"; });
      });
    }
  }

  function intro() {
    var screen = $("#intro"), button = $("#open-invitation");
    if (!screen || !button) return;
    var opening = false, timer = 0;
    function finish() {
      clearTimeout(timer);
      document.documentElement.classList.remove("is-locked");
      document.body.classList.remove("is-opening");
      document.body.classList.add("is-open");
      screen.hidden = true;
      screen.setAttribute("aria-hidden", "true");
      var hero = $("#hero");
      if (hero) hero.scrollIntoView({ block: "start", behavior: "auto" });
    }
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      if (opening) return finish();
      opening = true;
      if (window.Marhamat && typeof window.Marhamat.open === "function") window.Marhamat.open();
      else document.documentElement.classList.remove("is-locked");
      document.body.classList.add("is-opening");
      timer = setTimeout(finish, reduced() ? 0 : 1550);
    });
    screen.addEventListener("click", function () { if (opening) finish(); });
  }

  function scrollMotion() {
    if (!window.gsap || !window.ScrollTrigger || reduced() || (window.Marhamat && Marhamat.tier === "lite")) return;
    gsap.registerPlugin(ScrollTrigger);
    $$(".kinetic-title").forEach(function (title, index) {
      var direction = index % 2 ? 1 : -1;
      gsap.fromTo(title, { x: direction * 74 }, { x: direction * -74, ease: "none", scrollTrigger: { trigger: title.closest(".section"), start: "top bottom", end: "bottom top", scrub: .7 } });
    });
    gsap.fromTo(".date-cover > strong", { y: 20 }, { y: -20, ease: "none", scrollTrigger: { trigger: ".date-section", start: "top bottom", end: "bottom top", scrub: .7 } });
    gsap.fromTo(".program__item", { x: function (i) { return i % 2 ? 28 : -28; }, opacity: .62 }, { x: 0, opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: ".program", start: "top 85%", end: "bottom 35%", scrub: .6 } });
    gsap.fromTo(".venue__photo img", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".venue__photo", start: "top bottom", end: "bottom top", scrub: .8 } });
    gsap.fromTo(".dresscode__seal", { rotate: -16, y: 18 }, { rotate: 0, y: 0, ease: "none", scrollTrigger: { trigger: ".dresscode-section", start: "top 90%", end: "center center", scrub: .5 } });
  }

  function foilDust() {
    if (reduced()) return;
    var hero = $("#hero");
    if (!hero) return;
    var canvas = document.createElement("canvas");
    canvas.className = "foil-dust";
    canvas.setAttribute("aria-hidden", "true");
    hero.appendChild(canvas);
    var ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    var points = [], frame = 0, active = false, dpr = 1;
    var maxPoints = window.Marhamat && Marhamat.tier === "lite" ? 6 : 18;
    function resize() {
      var rect = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, window.Marhamat && Marhamat.tier === "lite" ? 1.5 : 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = rect.width + "px"; canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = Array.from({ length: maxPoints }, function () { return { x: Math.random() * rect.width, y: Math.random() * rect.height, r: .5 + Math.random() * 1.1, a: .1 + Math.random() * .32, p: Math.random() * 6.28 }; });
    }
    function draw() {
      if (!active || document.hidden) { frame = 0; return; }
      var width = canvas.clientWidth, height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      points.forEach(function (point, i) {
        point.p += .008 + (i % 3) * .002;
        point.y -= .05;
        if (point.y < 0) point.y = height;
        ctx.globalAlpha = point.a * (.55 + Math.sin(point.p) * .45);
        ctx.fillStyle = "#C9B183";
        ctx.beginPath(); ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }
    function wake() { active = true; if (!frame && !document.hidden) frame = requestAnimationFrame(draw); }
    function pause() { active = false; if (frame) cancelAnimationFrame(frame); frame = 0; }
    resize();
    if ("IntersectionObserver" in window) new IntersectionObserver(function (entries) { entries[0].isIntersecting ? wake() : pause(); }, { threshold: .05 }).observe(hero);
    else wake();
    document.addEventListener("visibilitychange", function () { document.hidden ? pause() : wake(); });
    window.addEventListener("resize", resize, { passive: true });
  }

  function celebrate() {
    var done = $("[data-rsvp-done]");
    if (!done || reduced()) return;
    done.classList.remove("is-celebrating");
    void done.offsetWidth;
    done.classList.add("is-celebrating");
    var check = $(".foil-check", done);
    if (check && check.animate) check.animate([{ transform: "scale(.5) rotate(-18deg)", opacity: .3 }, { transform: "scale(1.14) rotate(8deg)", opacity: 1 }, { transform: "scale(1) rotate(0)" }], { duration: 680, easing: "cubic-bezier(.2,.8,.2,1)" });
  }

  function init() {
    initials();
    splitHeroNames();
    animateSeal();
    intro();
    foilDust();
    if (window.Marhamat && typeof Marhamat.on === "function") {
      Marhamat.on("ready", function () { initials(); splitHeroNames(); });
      Marhamat.on("rsvp", function (answer) { if (answer && answer.status === "yes") celebrate(); });
      Marhamat.on("tier", function () { if (Marhamat.tier === "lite") { var canvas = $(".foil-dust"); if (canvas) canvas.remove(); } });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scrollMotion);
    else scrollMotion();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
