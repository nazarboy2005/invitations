/* ============================================================
   Salohiddin & Mubinaxon — interactions & animations
============================================================ */
(function () {
  "use strict";
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var DESIGN_W = 389, MAX_W = 430;
  var stage = $("#stage"), design = $("#design"), introDesign = $("#introDesign");
  var scale = 1;

  function fit() {
    var cw = document.documentElement.clientWidth;
    var ch = document.documentElement.clientHeight;
    scale = Math.min(cw, MAX_W) / DESIGN_W;
    design.style.transform = "scale(" + scale + ")";
    stage.style.height = (design.offsetHeight * scale) + "px";
    // main screen uses the SAME width-based scale so the column width matches the Taklifnoma (no size jump)
    introDesign.style.transform = "translate(-50%,-50%) scale(" + scale + ")";
  }
  fit();
  window.addEventListener("resize", fit, { passive: true });
  window.addEventListener("load", fit);
  document.body.classList.add("locked");

  /* ---------- envelope -> open ---------- */
  var intro = $("#intro"), envelope = $("#envelope"), opened = false;
  function openTaklif() {
    if (opened) return; opened = true;
    intro.classList.add("opening");
    setTimeout(function () {
      intro.classList.add("hide");
      document.body.classList.remove("locked");
      window.scrollTo(0, 0);
      fit();
      startReveals();
    }, 600);
  }
  envelope.addEventListener("click", openTaklif);

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
    setTimeout(function () { $$(".reveal:not(.is-visible)").forEach(applyReveal); }, 7000);
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
      try { data = JSON.parse(localStorage.getItem("sm_wishes") || "[]"); } catch (err) {}
      data.unshift({ name: name, attend: attend, wish: wish });
      localStorage.setItem("sm_wishes", JSON.stringify(data));
    }
    form.classList.add("done");
  });

  /* ---------- hide images that fail to load ---------- */
  $$(".design img, .intro-design img").forEach(function (img) {
    img.addEventListener("error", function () { img.style.visibility = "hidden"; });
  });

  /* ---------- direct open ---------- */
  if (location.hash === "#open") { openTaklif(); }
})();
