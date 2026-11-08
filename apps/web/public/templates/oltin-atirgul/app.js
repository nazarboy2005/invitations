/* Captured invitation interactions and animations */
(function () {
  "use strict";
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var DESIGN_W = 490, MAX_W = 540, FILL = 0.80;
  var stage = $("#stage"), design = $("#design");
  function fit() {
    var vw = document.documentElement.clientWidth;
    var s = Math.min(vw, MAX_W) / DESIGN_W * FILL;
    var offsetX = (vw - DESIGN_W * s) / 2;   // centered; positive → side margins reveal edge decor
    design.style.transform = "translateX(" + offsetX + "px) scale(" + s + ")";
    stage.style.height = (design.offsetHeight * s) + "px";
  }
  fit();
  window.addEventListener("resize", fit, { passive: true });
  window.addEventListener("load", fit);
  window.addEventListener("orientationchange", function () { setTimeout(fit, 120); });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", fit, { passive: true });

  /* ---------- INTRO + music ---------- */
  var intro = $("#intro"), introEnv = $("#introEnvelope"), audio = $("#bg-audio"), musicBtn = $("#musicBtn");
  var pageBgVideo = $("#pageBgVideo");
  if (pageBgVideo) { pageBgVideo.muted = true; var pv = pageBgVideo.play(); if (pv && pv.catch) pv.catch(function () {}); }
  document.body.classList.add("locked");
  function openSite() {
    if (intro.classList.contains("opening") || intro.classList.contains("hide")) return;
    intro.classList.add("opening");
    setTimeout(function () {
      intro.classList.add("hide");
      document.body.classList.remove("locked");
      musicBtn.classList.add("show");
      startMusic(); fit(); startReveals();
    }, 700);
  }
  introEnv.addEventListener("click", openSite);
  function startMusic() {
    if (!audio.src) return;
    audio.volume = 0.6;
    var p = audio.play();
    if (p && p.then) p.then(function () { musicBtn.classList.add("playing"); }).catch(function () {});
    else musicBtn.classList.add("playing");
  }
  musicBtn.addEventListener("click", function () {
    if (audio.paused) { audio.play(); musicBtn.classList.add("playing"); }
    else { audio.pause(); musicBtn.classList.remove("playing"); }
  });

  /* ---------- scroll reveal ---------- */
  function applyReveal(el) {
    if (el.classList.contains("is-visible")) return;
    el.style.transitionDelay = (parseFloat(el.getAttribute("data-delay") || "0")) + "s";
    el.classList.add("is-visible");
  }
  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || 0) * 0.94 && r.bottom > 0;
  }
  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { applyReveal(e.target); io.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" })
    : null;
  function revealInView() {
    $$(".reveal").forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      if (inViewport(el)) applyReveal(el); else if (io) io.observe(el);
    });
  }
  var sp = false, opened = false;
  window.addEventListener("scroll", function () {
    if (!opened || sp) return; sp = true;
    requestAnimationFrame(function () { sp = false; $$(".reveal:not(.is-visible)").forEach(function (el) { if (inViewport(el)) applyReveal(el); }); });
  }, { passive: true });
  // reveal only AFTER the intro opens, so the hero texts animate in (not pre-revealed behind the intro)
  function startReveals() {
    opened = true;
    revealInView();
    setTimeout(function () { $$(".reveal:not(.is-visible)").forEach(applyReveal); }, 5000);
  }

  /* ---------- countdown ---------- */
  var cd = $("#p2-cd"), target = new Date(cd.getAttribute("data-target")).getTime();
  var nums = { days: $('[data-cd="days"]'), hours: $('[data-cd="hours"]'), minutes: $('[data-cd="minutes"]'), seconds: $('[data-cd="seconds"]') };
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var diff = Math.max(0, target - Date.now()), s = Math.floor(diff / 1000);
    nums.days.textContent = pad(Math.floor(s / 86400));
    nums.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    nums.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    nums.seconds.textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* RSVP and wishes are submitted by the app adapter. */

  /* ---------- hide any decorative image that fails to load ---------- */
  $$(".design img").forEach(function (img) {
    img.addEventListener("error", function () { img.style.display = "none"; });
    if (img.complete && img.naturalWidth === 0) img.style.display = "none";
  });

  /* ---------- direct-open ---------- */
  if (location.hash === "#open") { openSite(); }
})();
