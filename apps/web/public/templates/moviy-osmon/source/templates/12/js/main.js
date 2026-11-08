/* ============================================================
   Sarvarbek & Maftuna — interactions & animations
============================================================ */
(function () {
  "use strict";
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var DESIGN_W = 490, MAX_W = 540, FILL = 1.15;

  /* ---------- scale the fixed 490px design to the viewport ---------- */
  var stage  = $("#stage");
  var design = $("#design");
  function fit() {
    var vw = document.documentElement.clientWidth;
    var s = Math.min(vw, MAX_W) / DESIGN_W * FILL;
    var offsetX = (vw - DESIGN_W * s) / 2;   // negative ok → stays centered when zoomed past edges
    design.style.transform = "translateX(" + offsetX + "px) scale(" + s + ")";
    stage.style.height = (design.offsetHeight * s) + "px";
  }
  fit();
  window.addEventListener("resize", fit, { passive: true });
  window.addEventListener("load", fit);
  window.addEventListener("orientationchange", function () { setTimeout(fit, 120); });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", fit, { passive: true });

  /* ---------- INTRO: click seal to open + music + video ---------- */
  var intro      = $("#intro");
  var introEnv   = $("#introEnvelope");
  var audio      = $("#bg-audio");
  var musicBtn   = $("#musicBtn");
  var heroVideo  = $(".hero__video");

  document.body.classList.add("locked");

  function openSite() {
    if (intro.classList.contains("opening") || intro.classList.contains("hide")) return;
    intro.classList.add("opening");          // seal expands + inner fades
    setTimeout(function () {
      intro.classList.add("hide");
      document.body.classList.remove("locked");
      musicBtn.classList.add("show");
      startMusic();
      playVideo();
      fit();
      revealInView();
    }, 700);
  }
  introEnv.addEventListener("click", openSite);

  function playVideo() {
    if (!heroVideo) return;
    try { heroVideo.muted = true; var v = heroVideo.play(); if (v && v.catch) v.catch(function () {}); } catch (e) {}
  }
  function startMusic() {
    audio.volume = 0.6;
    var p = audio.play();
    if (p && p.then) p.then(function () { musicBtn.classList.add("playing"); }).catch(function () {});
    else musicBtn.classList.add("playing");
  }
  musicBtn.addEventListener("click", function () {
    if (audio.paused) { audio.play(); musicBtn.classList.add("playing"); }
    else { audio.pause(); musicBtn.classList.remove("playing"); }
  });

  /* ---------- SCROLL REVEAL ---------- */
  var greeting = $(".greet");
  function applyReveal(el) {
    if (el.classList.contains("is-visible")) return;
    el.style.transitionDelay = (parseFloat(el.getAttribute("data-delay") || "0")) + "s";
    el.classList.add("is-visible");
    if (el === greeting) el.classList.add("is-open");
  }
  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || 0) * 0.94 && r.bottom > 0;
  }
  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { applyReveal(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" })
    : null;
  function revealInView() {
    $$(".reveal").forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      if (inViewport(el)) applyReveal(el);
      else if (io) io.observe(el);
    });
  }
  /* ---------- CLOUD PARALLAX: clouds split apart as you scroll ---------- */
  var cloudL = $(".cloud--l"), cloudR = $(".cloud--r"), venueEl = $(".venue");
  var CLOUD_SPREAD = 210;
  function parallaxClouds() {
    if (!cloudL || !cloudR || !venueEl) return;
    var r = venueEl.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var p = (vh - r.top) / (vh + r.height);   // 0 entering bottom -> 1 leaving top
    p = Math.max(0, Math.min(1, p));
    var dx = p * CLOUD_SPREAD;
    cloudL.style.transform = "translateX(" + (-dx) + "px)";
    cloudR.style.transform = "translateX(" + (dx) + "px)";
  }

  var sp = false;
  function onScroll() {
    if (sp) return; sp = true;
    requestAnimationFrame(function () {
      sp = false;
      $$(".reveal:not(.is-visible)").forEach(function (el) { if (inViewport(el)) applyReveal(el); });
      parallaxClouds();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { parallaxClouds(); });
  revealInView();
  parallaxClouds();
  setTimeout(function () { $$(".reveal:not(.is-visible)").forEach(applyReveal); }, 4500);

  /* ---------- SCRATCH-TO-REVEAL ---------- */
  $$(".scard").forEach(function (card) {
    var canvas = $(".scard__cv", card);
    var ctx = canvas.getContext("2d");
    var revealed = false, drawing = false;
    (function paint() {
      var w = canvas.width, h = canvas.height;
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#bcd6e7"); g.addColorStop(1, "#9cc0d8");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,.85)";
      ctx.font = "italic 16px 'Rufina', serif"; ctx.textAlign = "center";
      ctx.fillText("Suring ✦", w / 2, h / 2);
    })();
    function pos(e) {
      var r = canvas.getBoundingClientRect(), t = e.touches ? e.touches[0] : e;
      return { x: (t.clientX - r.left) * (canvas.width / r.width), y: (t.clientY - r.top) * (canvas.height / r.height) };
    }
    function scratch(e) {
      if (!drawing || revealed) return;
      var p = pos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); ctx.arc(p.x, p.y, 18, 0, Math.PI * 2); ctx.fill();
      var d = ctx.getImageData(0, 0, canvas.width, canvas.height).data, clr = 0;
      for (var i = 3; i < d.length; i += 80) if (d[i] === 0) clr++;
      if (clr / (d.length / 80) > 0.5) { revealed = true; card.classList.add("revealed"); }
    }
    canvas.addEventListener("mousedown", function (e) { drawing = true; scratch(e); });
    canvas.addEventListener("mousemove", scratch);
    window.addEventListener("mouseup", function () { drawing = false; });
    canvas.addEventListener("touchstart", function (e) { e.preventDefault(); drawing = true; scratch(e); }, { passive: false });
    canvas.addEventListener("touchmove", function (e) { e.preventDefault(); scratch(e); }, { passive: false });
    canvas.addEventListener("touchend", function () { drawing = false; });
    canvas.addEventListener("click", function () { if (!revealed) { revealed = true; card.classList.add("revealed"); } });
  });

  /* ---------- COUNTDOWN ---------- */
  var cd = $("#sec-cd");
  var target = new Date(cd.getAttribute("data-target")).getTime();
  var nums = { days: $('[data-cd="days"]'), hours: $('[data-cd="hours"]'), minutes: $('[data-cd="minutes"]'), seconds: $('[data-cd="seconds"]') };
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var diff = Math.max(0, target - Date.now()), s = Math.floor(diff / 1000);
    nums.days.textContent    = pad(Math.floor(s / 86400));
    nums.hours.textContent   = pad(Math.floor((s % 86400) / 3600));
    nums.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    nums.seconds.textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- WISH MODAL ---------- */
  var modal = $("#wishModal");
  $("#openWish").addEventListener("click", function () { modal.classList.add("open"); modal.classList.remove("done"); });
  $$("[data-close]", modal).forEach(function (el) { el.addEventListener("click", function () { modal.classList.remove("open"); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") modal.classList.remove("open"); });
  $("#wishForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var name = f.name.value.trim(), attend = f.attend.value, wish = f.wish.value.trim();
    if (window.SI_SLUG) {
      // Real invitation — send to backend
      fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: window.SI_SLUG,
          guestName: name,
          attending: /kela olmayman/i.test(attend) ? "no" : "yes",
          partySize: 1,
          wish: wish
        })
      }).catch(function () {});
    } else {
      // Preview mode — keep local
      var data = [];
      try { data = JSON.parse(localStorage.getItem("sm_wishes") || "[]"); } catch (err) {}
      data.unshift({ name: name, attend: attend, wish: wish });
      localStorage.setItem("sm_wishes", JSON.stringify(data));
    }
    f.reset(); modal.classList.add("done");
    setTimeout(function () { modal.classList.remove("open"); }, 1800);
  });

  /* ---------- direct-open: "...#open" shared link skips the intro ---------- */
  if (location.hash === "#open") { openSite(); }
})();
