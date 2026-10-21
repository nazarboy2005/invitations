(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var M = window.Marhamat || {}, data = M.data || window.INVITATION || {};
  var gs = window.gsap;
  var reduced = !!M.reducedMotion || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var lite = function () { return M.tier === "lite" || root.dataset.tier === "lite"; };
  var intro = $("#intro"), hero = $("#hero"), bookBtn = $("#open-invitation"), camera = $(".camera"), book = $(".book");
  var state = { a: 0 }, opened = false, opening = false, film = null, finished = false;

  /* ------------------------------------------------------------ geometry */
  function layout() {
    var col = Math.min(innerWidth, 480), h = (hero && hero.clientHeight) || innerHeight;
    // the closed cover fills ~80% of the column and never more than 62% of the height
    var u = Math.min(col * .8 / 1000, h * .62 / 1400);
    root.style.setProperty("--u", u.toFixed(4));
    root.style.setProperty("--persp", Math.round(2600 * u) + "px");
    $$(".pop").forEach(function (p, i) {
      p.style.setProperty("--d", p.dataset.d); p.style.setProperty("--h", p.dataset.h); p.style.setProperty("--i", i + 1);
    });
    layout.u = u;
    if (opened) { placeCamera(1, true); fitCopy(); }
  }
  // camera poses: 0 = looking straight at the closed book; 1 = inside the open pop-up
  function pose(k) {
    var u = layout.u, h = (hero && hero.clientHeight) || innerHeight;
    var open = { x: 0, y: 60 * u, z: 330 * u, rotationX: 6, rotationY: 0 };
    var closed = { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0 };
    var o = {};
    Object.keys(open).forEach(function (key) { o[key] = closed[key] + (open[key] - closed[key]) * k; });
    return o;
  }
  function placeCamera(k, instant) { if (gs) gs.set(camera, pose(k)); }
  // the names sit on the table above the book: size them to the room left above the sky page
  function fitCopy() {
    var copy = $(".hero__copy"); if (!copy || !hero) return;
    // project the top edge of the sky page through the final camera pose (rotate, then translate, then perspective)
    var u = layout.u, p = pose(1), P = 2600 * u, r = p.rotationX * Math.PI / 180, hh = hero.clientHeight || innerHeight;
    var y = -700 * u, z = -3, y1 = y * Math.cos(r) - z * Math.sin(r) + p.y, z1 = y * Math.sin(r) + z * Math.cos(r) + p.z;
    var top = hh / 2 + y1 * P / (P - z1);
    var room = Math.max(90, top - 14 - hh * .025);
    root.style.setProperty("--copy-bottom", Math.max(0, hh - top + 10).toFixed(1) + "px");
    root.style.setProperty("--names-size", Math.max(30, Math.min(66, (room - 26) / 2.45)).toFixed(1) + "px");
  }
  function setOpen(a) { state.a = a; book.style.setProperty("--a", a.toFixed(2)); }

  /* ------------------------------------------------------- the cover foil */
  // The couple's names, stamped in gold foil into the linen: a height field lit like real foil.
  function foil() {
    var canvas = $(".foil"); if (!canvas) return;
    var rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, lite() ? 1.5 : 2);
    var w = Math.max(200, Math.round(rect.width * dpr)), h = Math.max(120, Math.round(rect.height * dpr));
    canvas.width = w; canvas.height = h;
    var m = d.createElement("canvas"); m.width = w; m.height = h;
    var g = m.getContext("2d"), groom = String(data.groom || "").trim(), bride = String(data.bride || "").trim();
    g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    var size = h * .3;
    g.font = size + 'px "Great Vibes", cursive';
    var widest = Math.max(g.measureText(groom).width, g.measureText(bride).width, 1);
    if (widest > w * .9) { size *= w * .9 / widest; g.font = size + 'px "Great Vibes", cursive'; }
    if (groom && bride) {
      g.fillText(groom, w / 2, h * .38);
      g.font = "italic " + size * .42 + "px Lora, serif"; g.fillText("&", w / 2, h * .56);
      g.font = size + 'px "Great Vibes", cursive'; g.fillText(bride, w / 2, h * .86);
    } else g.fillText(groom || bride, w / 2, h * .6);
    var b = d.createElement("canvas"); b.width = w; b.height = h;
    var bg = b.getContext("2d"); bg.filter = "blur(" + Math.max(1, w * .003) + "px)"; bg.drawImage(m, 0, 0);
    var A = g.getImageData(0, 0, w, h).data, B = bg.getImageData(0, 0, w, h).data;
    var out = canvas.getContext("2d"), im = out.createImageData(w, h), D = im.data;
    var lx = -.45, ly = -.6, lz = .66, ln = Math.hypot(lx, ly, lz); lx /= ln; ly /= ln; lz /= ln;
    for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
      var i = y * w + x, a = A[i * 4 + 3]; if (!a) continue;
      var nx = -(B[(i + 1) * 4 + 3] - B[(i - 1) * 4 + 3]) / 255 * 3, ny = -(B[(i + w) * 4 + 3] - B[(i - w) * 4 + 3]) / 255 * 3, n = Math.hypot(nx, ny, 1);
      nx /= n; ny /= n; var nz = 1 / n;
      var diff = Math.max(0, nx * lx + ny * ly + nz * lz), spec = Math.pow(Math.max(0, nx * -.3 + ny * -.35 + nz * .89), 26);
      var env = .7 + .3 * (y / h);
      D[i * 4] = Math.min(255, (150 + 95 * diff) * env + 140 * spec); D[i * 4 + 1] = Math.min(255, (105 + 80 * diff) * env + 120 * spec);
      D[i * 4 + 2] = Math.min(255, (45 + 45 * diff) * env + 80 * spec); D[i * 4 + 3] = a;
    }
    out.putImageData(im, 0, 0);
  }

  /* --------------------------------------------------------------- sound */
  var ac = null;
  function sound(kind, at) {
    if (reduced) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = ac || new AC(); if (ac.state === "suspended") ac.resume();
      var t = ac.currentTime + (at || 0), out = ac.createGain(); out.connect(ac.destination);
      if (kind === "page") {     // a stiff board and paper sliding: filtered noise swell
        var n = Math.round(ac.sampleRate * 1.2), buf = ac.createBuffer(1, n, ac.sampleRate), ch = buf.getChannelData(0);
        for (var i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (.5 + .5 * Math.sin(i / 1400));
        var src = ac.createBufferSource(), f = ac.createBiquadFilter(); src.buffer = buf; f.type = "bandpass"; f.frequency.value = 1700; f.Q.value = .6;
        out.gain.setValueAtTime(.0001, t); out.gain.exponentialRampToValueAtTime(.05, t + .3); out.gain.exponentialRampToValueAtTime(.0001, t + 1.15);
        src.connect(f); f.connect(out); src.start(t); src.stop(t + 1.2);
      } else if (kind === "pop") {   // each layer clicking upright
        var o = ac.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(180, t + .06);
        out.gain.setValueAtTime(.0001, t); out.gain.exponentialRampToValueAtTime(.035, t + .005); out.gain.exponentialRampToValueAtTime(.0001, t + .08);
        o.connect(out); o.start(t); o.stop(t + .1);
      } else if (kind === "chime") {
        [659.25, 987.77, 1318.5].forEach(function (fq, k) {
          var o2 = ac.createOscillator(), g2 = ac.createGain(); o2.frequency.value = fq;
          g2.gain.setValueAtTime(.0001, t + k * .1); g2.gain.exponentialRampToValueAtTime(.025 / (k + 1), t + k * .1 + .04); g2.gain.exponentialRampToValueAtTime(.0001, t + k * .1 + 2.2);
          o2.connect(g2); g2.connect(out); o2.start(t + k * .1); o2.stop(t + k * .1 + 2.3);
        });
      }
    } catch (_) {}
  }

  /* ---------------------------------------------------------- the opening */
  function finish() {
    if (finished) return; finished = true; opened = true;
    intro.hidden = true; intro.setAttribute("aria-hidden", "true");
    root.classList.remove("is-locked"); d.body.classList.add("is-open");
    hero.classList.add("is-alive");
    sway();
    story();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  function reveal(tl, at) {
    var names = $$(".hero__name"), amp = $(".hero__names .amp");
    root.classList.remove("is-waiting");
    if (!tl) { names.forEach(function (n) { n.style.setProperty("--wipe", "0%"); }); fitCopy(); return; }
    tl.fromTo(".hero__kicker", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .8, ease: "expo.out" }, at)
      .fromTo(names[0], { "--wipe": "100%" }, { "--wipe": "0%", duration: 1.15, ease: "power1.inOut" }, at + .25)
      .fromTo(amp, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .55, ease: "back.out(2)" }, at + 1.25)
      .fromTo(names[1], { "--wipe": "100%" }, { "--wipe": "0%", duration: 1.15, ease: "power1.inOut" }, at + 1.5)
      .fromTo(".wall__date", { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power1.out" }, at + 2.4)
      .fromTo(".hero__cue", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .7 }, at + 3);
  }
  function open(fromAngle) {
    if (finished || opening) { if (film) film.timeScale(6); return; }
    opening = true;
    try { if (M.open) M.open(); } catch (_) {}
    try { if (navigator.vibrate) navigator.vibrate(10); } catch (_) {}
    bookBtn.style.pointerEvents = "none";
    if (!gs || reduced) {
      setOpen(90); placeCamera(1); reveal(null);
      intro.style.transition = "opacity .5s"; intro.style.opacity = 0; setTimeout(finish, 520); return;
    }
    sound("page");
    var start = fromAngle || state.a, rest = (90 - start) / 90;
    film = gs.timeline({ onComplete: finish });
    film.to([".intro__greeting", ".intro__hint"], { opacity: 0, y: -8, duration: .5, ease: "power2.in" }, 0)
      // the board lifts off the page, then falls open toward us; the paper scene stands up with it
      .to(state, { a: Math.max(start, 7), duration: .35, ease: "power1.out", onUpdate: function () { setOpen(state.a); } }, 0)
      .to(state, { a: 93, duration: 2.1 * rest + .4, ease: "power2.inOut", onUpdate: function () { setOpen(state.a); } }, .35)
      .to(state, { a: 90, duration: .5, ease: "sine.inOut", onUpdate: function () { setOpen(state.a); } }, 2.45 * rest + .75)
      // the camera leans over the book and moves into the scene
      .to(camera, Object.assign({ duration: 3.1, ease: "power2.inOut" }, pose(1)), .5)
      .add(function () { [0, .14, .3, .44, .6].forEach(function (t) { sound("pop", t); }); }, 1.15)
      .add(function () { sound("chime"); $$(".thread").forEach(function (t) { t.style.animationPlayState = "running"; }); }, 2.2);
    reveal(film, 2.7);
    if (lite()) film.timeScale(1.25);
  }

  /* ----------------------------------------------------- the pull gesture */
  // Drag the cover down: it follows the finger; let go past a third and it falls open.
  var drag = null;
  function down(e) { if (finished || opening) return; drag = { y: e.clientY, id: e.pointerId, moved: false }; try { bookBtn.setPointerCapture(e.pointerId); } catch (_) {} }
  function move(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dy = e.clientY - drag.y; if (Math.abs(dy) > 6) drag.moved = true;
    var a = Math.max(0, Math.min(70, dy / (layout.u * 1400) * 110)); setOpen(a);
  }
  function up(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var moved = drag.moved; drag = null;
    if (!moved) { open(); return; }
    if (state.a > 22) open(state.a);
    else if (gs) gs.to(state, { a: 0, duration: .5, ease: "back.out(2)", onUpdate: function () { setOpen(state.a); } }); else setOpen(0);
  }

  /* ----------------------------------------------------- life after opening */
  var swayTween = null;
  function sway() {
    if (!gs || reduced) return;
    // the book breathes: a slow sway, as if held in the hands
    var p = pose(1);
    swayTween = gs.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } })
      .to(camera, { rotationY: lite() ? 1.2 : 2.2, rotationX: p.rotationX + .8, duration: 5.5 })
      .to(camera, { rotationY: lite() ? -1.2 : -2.2, rotationX: p.rotationX - .5, duration: 6 });
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { if (swayTween) es[0].isIntersecting ? swayTween.resume() : swayTween.pause(); }, { threshold: .02 }).observe(hero);
  }
  function story() {
    if (!gs || !window.ScrollTrigger || reduced) return;
    gs.registerPlugin(window.ScrollTrigger);
    // 1. scrolling gently closes the book a little and lifts the camera away: the pop-up folds back
    gs.to(state, { a: 64, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .7 }, onUpdate: function () { setOpen(state.a); } });
    gs.to(".hero__copy", { y: -60, opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "55% top", scrub: .6 } });
    // 2. the letter page unfolds
    gs.fromTo(".leaf", { rotationX: -70, opacity: .2, transformPerspective: 900 }, { rotationX: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".section--letter", start: "top 95%", end: "top 55%", scrub: .7 } });
    // 3. the programme thread
    var items = $$(".program__item");
    gs.to(".timeline__fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 72%", end: "bottom 55%", scrub: .6, onUpdate: function (st) { items.forEach(function (it, i) { it.classList.toggle("is-lit", st.progress >= (i + .3) / items.length); }); } } });
    var pop = function (targets, from, trigger) { if (!d.querySelector(targets)) return; gs.from(targets, Object.assign({ duration: .9, ease: "back.out(1.6)", scrollTrigger: { trigger: trigger, start: "top 82%", once: true } }, from)); };
    $$(".section").forEach(function (s) { pop("#" + s.id + " .eyebrow, #" + s.id + " .section__title", { y: 18, opacity: 0, stagger: .08 }, s); });
    pop(".paper-arch", { rotationX: -80, transformOrigin: "50% 100%", transformPerspective: 800, opacity: 0 }, ".paper-arch");
    pop(".countdown > div", { y: 26, rotationX: -60, transformPerspective: 600, opacity: 0, stagger: .08 }, ".countdown");
    pop(".venue__photo", { rotationX: -70, transformOrigin: "50% 100%", transformPerspective: 800, opacity: 0 }, ".venue__photo");
    pop(".gallery__item", { y: 40, rotation: 6, opacity: 0, stagger: .1 }, ".gallery");
    pop(".rsvp-card", { y: 60, opacity: 0 }, ".section--rsvp");
    pop(".wishes__item", { y: 30, rotation: 4, opacity: 0, stagger: .12 }, ".wishes");
    pop(".gift__pocket", { y: 30, opacity: 0 }, ".gift");
    pop(".contacts li", { x: -24, opacity: 0, stagger: .1 }, ".contacts");
  }
  function gift() {
    var wrap = $(".gift"), btn = $(".gift__pocket"); if (!wrap || !btn) return;
    btn.addEventListener("click", function () { var on = !wrap.classList.contains("is-open"); wrap.classList.toggle("is-open", on); btn.setAttribute("aria-expanded", String(on)); });
  }
  function celebrate(ans) {
    if (!ans || ans.status !== "yes" || reduced) return;
    var dove = $(".rsvp__dove"); if (dove && dove.animate) dove.animate([{ transform: "translate(-60px,30px) rotate(-12deg)", opacity: 0 }, { transform: "translate(0,0) rotate(0)", opacity: 1 }], { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)" });
  }

  /* ------------------------------------------------------------------ go */
  function arrive() {
    intro.classList.add("is-arrived"); hero.classList.add("is-arrived");
    var greet = $(".intro__greeting"); if (greet && greet.textContent.length > 26) greet.classList.add("is-long");
    if (!gs || reduced) { $$(".intro__greeting, .intro__hint").forEach(function (e) { e.style.opacity = 1; }); return; }
    gs.timeline()
      .fromTo(camera, { z: -260 * layout.u, rotationX: 14, y: 60 * layout.u }, { z: 0, rotationX: 0, y: 0, duration: 1.8, ease: "expo.out" }, 0)
      .fromTo(".intro__greeting", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out" }, .5)
      .fromTo(".intro__hint", { opacity: 0 }, { opacity: 1, duration: .8 }, 1.3)
      // a small invitation to pull: the cover lifts and settles
      .to(state, { a: 9, duration: .45, ease: "power2.out", yoyo: true, repeat: 1, onUpdate: function () { setOpen(state.a); } }, 2.2);
  }
  function init() {
    if (!intro || !hero || !book) return;
    root.classList.add("is-waiting");
    $$(".thread").forEach(function (t) { t.style.animationPlayState = "paused"; });
    layout(); setOpen(0); placeCamera(0); fitCopy();
    addEventListener("resize", function () { layout(); fitCopy(); foil(); }, { passive: true });
    bookBtn.addEventListener("pointerdown", down);
    bookBtn.addEventListener("pointermove", move);
    bookBtn.addEventListener("pointerup", up);
    bookBtn.addEventListener("pointercancel", up);
    bookBtn.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    // a second tap anywhere skips ahead (the tap that started the opening bubbles here too, so ignore the book itself)
    intro.addEventListener("click", function (e) { if (opening && film && e.target !== bookBtn && film.time() > .3) film.timeScale(6); });
    gift();
    if (M.on) M.on("rsvp", celebrate);
    var fonts = d.fonts && d.fonts.load ? Promise.race([Promise.all([d.fonts.load('80px "Great Vibes"', String(data.groom || "") + String(data.bride || "")), d.fonts.load("20px Lora")]), new Promise(function (r) { setTimeout(r, 1500); })]) : Promise.resolve();
    fonts.then(function () { foil(); arrive(); });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
