/* ============================================================
   Dilshod & Anoraxon — interactions & animations
============================================================ */
(function () {
  "use strict";
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var DESIGN_W = 389, MAX_W = 430;
  var stage = $("#stage"), design = $("#design");
  var introDesign = $("#introDesign");
  var scale = 1;

  function fit() {
    var cw = document.documentElement.clientWidth;
    var ch = document.documentElement.clientHeight;
    scale = Math.min(cw, MAX_W) / DESIGN_W;
    design.style.transform = "scale(" + scale + ")";
    stage.style.height = (design.offsetHeight * scale) + "px";
    // intro main screen: fill the viewport WIDTH, then shrink a touch so it
    // sits slightly smaller than the screen with a small margin around it.
    var introScale = (Math.min(cw, MAX_W) / DESIGN_W) * 0.92;
    introDesign.style.transform = "translate(-50%,-50%) scale(" + introScale + ")";
    introDesign._scale = introScale;
  }
  fit();
  window.addEventListener("resize", fit, { passive: true });
  window.addEventListener("load", fit);
  document.body.classList.add("locked");

  /* ---------- main-screen background video ---------- */
  var bgVideo = $("#bgVideo");
  if (bgVideo) {
    bgVideo.muted = true;
    var pv = bgVideo.play();
    if (pv && pv.catch) pv.catch(function () {});
  }

  /* ---------- background music ---------- */
  var audio = $("#bg-audio"), musicBtn = $("#musicBtn");
  function startMusic() {
    if (!audio || !musicBtn) return;
    musicBtn.classList.add("show");
    try {
      audio.volume = 0.6;
      var p = audio.play();
      if (p && p.then) p.then(function () { musicBtn.classList.add("playing"); }).catch(function () {});
      else musicBtn.classList.add("playing");
    } catch (e) {}
  }
  if (musicBtn) {
    musicBtn.addEventListener("click", function () {
      if (!audio) return;
      if (audio.paused) { audio.play(); musicBtn.classList.add("playing"); }
      else { audio.pause(); musicBtn.classList.remove("playing"); }
    });
  }

  /* ---------- swipe to open ---------- */
  var intro = $("#intro"), swapBtn = $("#swapBtn");
  var MAX_X = 193, dragging = false, startX = 0, startLeft = 0, moved = 0, opened = false;
  swapBtn.classList.add("hint");   // idle swipe hint animation

  function setBtn(x) { swapBtn.style.left = x + "px"; }
  function down(e) {
    dragging = true; moved = 0;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    startLeft = parseFloat(swapBtn.style.left || "0");
    swapBtn.classList.remove("snapback");
    swapBtn.classList.remove("hint");
    e.preventDefault();
  }
  function move(e) {
    if (!dragging) return;
    var cx = (e.touches ? e.touches[0].clientX : e.clientX);
    var d = (cx - startX) / (introDesign._scale || 1);
    moved = Math.abs(d);
    var x = Math.max(0, Math.min(MAX_X, startLeft + d));
    setBtn(x);
  }
  function up() {
    if (!dragging) return;
    dragging = false;
    var x = parseFloat(swapBtn.style.left || "0");
    if (x / MAX_X >= 0.55 || moved < 6) {       // dragged far enough OR a tap
      swapBtn.classList.add("snapback"); setBtn(MAX_X);
      openTaklif();
    } else {
      swapBtn.classList.add("snapback"); setBtn(0);
      setTimeout(function () { if (!opened) swapBtn.classList.add("hint"); }, 380);
    }
  }
  swapBtn.addEventListener("mousedown", down);
  swapBtn.addEventListener("touchstart", down, { passive: false });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);

  function openTaklif() {
    if (opened) return; opened = true;
    intro.classList.add("hide");
    startMusic();
    setTimeout(function () {
      document.body.classList.remove("locked");
      window.scrollTo(0, 0);
      fit();
      startReveals();
    }, 650);
  }

  /* ---------- scroll reveal ---------- */
  function applyReveal(el) {
    if (el.classList.contains("is-visible")) return;
    el.style.transitionDelay = (parseFloat(el.getAttribute("data-delay") || "0")) + "s";
    el.classList.add("is-visible");
  }
  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || 0) * 0.92 && r.bottom > 0;
  }
  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { applyReveal(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" })
    : null;
  function revealInView() {
    $$(".reveal").forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      if (inViewport(el)) applyReveal(el); else if (io) io.observe(el);
    });
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!opened || ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      $$(".reveal:not(.is-visible)").forEach(function (el) { if (inViewport(el)) applyReveal(el); });
    });
  }, { passive: true });
  function startReveals() {
    revealInView();
    setTimeout(function () { $$(".reveal:not(.is-visible)").forEach(applyReveal); }, 6000);
  }

  /* ---------- countdown ---------- */
  var cd = $("#cd"), target = new Date(cd.getAttribute("data-target")).getTime();
  var nums = {
    days: $('[data-cd="days"]'), hours: $('[data-cd="hours"]'),
    minutes: $('[data-cd="minutes"]'), seconds: $('[data-cd="seconds"]')
  };
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var diff = Math.max(0, target - Date.now()), s = Math.floor(diff / 1000);
    nums.days.textContent = pad(Math.floor(s / 86400));
    nums.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    nums.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    nums.seconds.textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- RSVP ---------- */
  var form = $("#wishForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var attend = (form.attend.value || "");
    var wish = form.wish.value.trim();
    if (window.SI_SLUG) {
      fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: window.SI_SLUG,
          guestName: name,
          attending: /borolmayman|kela olmayman/i.test(attend) ? "no" : "yes",
          partySize: 1,
          wish: wish
        })
      }).catch(function () {});
    } else {
      var data = [];
      try { data = JSON.parse(localStorage.getItem("da_wishes") || "[]"); } catch (err) {}
      data.unshift({ name: name, attend: attend, wish: wish });
      localStorage.setItem("da_wishes", JSON.stringify(data));
    }
    form.classList.add("done");
  });

  /* ---------- hide decorative images that fail to load ---------- */
  $$(".design img, .intro-design img").forEach(function (img) {
    img.addEventListener("error", function () { img.style.visibility = "hidden"; });
  });

  /* ---------- direct open (skip intro for preview/sharing) ---------- */
  if (location.hash === "#open") { openTaklif(); }
})();
