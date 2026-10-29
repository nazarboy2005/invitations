/* Extracted from the captured Sakura visual engine. See provenance.json. */
(function(){
var $ = function(s){return document.querySelector(s);};
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var setTxt = function (el, v) { if (el) { el.textContent = v; el.setAttribute("data-user-set", "1"); } };
  var hide = function (el) { if (el) el.style.display = "none"; };

window.sakuraTimeline=function(rows){var section=$("#sk-events-section");section.style.removeProperty("display");section.hidden=!rows.some(r=>r.title||r.description||r.time||r.place);
    var live = rows.filter(function (r) { return r && (r.title || r.description || r.time || r.place); });
    if (!live.length) { $("#sk-events").replaceChildren(); return; }
    var host = $("#sk-events");
    host.innerHTML = "";
    live.forEach(function (r, idx) {
      var last = idx === live.length - 1;
      var timeTxt = r.time ? esc(r.time) : "";
      var desc = [r.place, r.description].filter(Boolean).join(" · ");
      var row = document.createElement("div");
      row.className = "sk-ev-row";
      row.setAttribute("data-reveal", "");
      row.style.display = "flex";
      row.style.gap = "18px";
      row.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center;width:32px;flex-shrink:0;">' +
          '<div style="width:32px;height:32px;border-radius:50%;background:#fff;border:1px solid #f0c7d4;display:grid;place-items:center;box-shadow:0 4px 10px rgba(180,100,130,.15);"><img src="sakura-img/blossom.webp" alt="" style="width:18px;"></div>' +
          (last ? '' : '<div style="flex:1;width:1px;min-height:30px;background:linear-gradient(rgba(215,109,146,.45),rgba(94,170,180,.4));"></div>') +
        '</div>' +
        '<div style="padding-bottom:' + (last ? '0' : '24px') + ';">' +
          (timeTxt ? '<div style="font-family:\'Shippori Mincho\',serif;font-size:15px;letter-spacing:.12em;color:#2e93a6;">' + timeTxt + '</div>' : '') +
          (r.title ? '<div style="font-family:\'Shippori Mincho\',serif;font-size:19px;color:#3f3340;margin-top:3px;">' + esc(r.title) + '</div>' : '') +
          (desc ? '<div style="font-size:13px;color:#6d5a66;margin-top:4px;line-height:1.55;">' + esc(desc) + '</div>' : '') +
        '</div>';
      host.appendChild(row);
    });
    // freshly-built rows have no prior transition state — reveal immediately
    Array.prototype.forEach.call(host.querySelectorAll("[data-reveal]"), function (n) { n.style.opacity = "1"; n.style.transform = "none"; });

};
window.sakuraFitNames=function(){
  /* ── long names must never clip: shrink the hero/splash name type until
     the widest line fits (Muhammadyusuf-class names overflow 52px Shippori
     at 390px viewports). Re-run once webfonts land — metrics change. ── */
  (function () {
    var heroH1 = $("#sk-hero-n1") && $("#sk-hero-n1").parentNode;
    function fit(el, base, min) {
      if (!el) return;
      var size = base;
      el.style.fontSize = size + "px";
      var guard = 24;
      while (guard-- > 0 && size > min && el.scrollWidth > el.clientWidth + 1) {
        size -= 2;
        el.style.fontSize = size + "px";
      }
    }
    function run() {
      fit(heroH1, 52, 28);
      fit($("#sk-splash-names"), 24, 15);
      fit($("#sk-foot-names"), 24, 15);
    }
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    window.addEventListener("resize", run);
  })();


};
window.sakuraStartMotion=function(reducedMotion){
  /* ── reveal on scroll (IO + riseIn keyframe, ported from the design's own
     IntersectionObserver wiring — threshold 0.15; no-IO / reduced-motion
     fallback settles elements immediately) ── */
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    var reduced = reducedMotion;
    try { reduced = reduced || window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    function settle(el) { el.style.opacity = "1"; el.style.transform = "none"; }
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) settle(els[i]);
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.animation = "riseIn 0.9s cubic-bezier(.22,.7,.3,1) both";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  })();

  /* ── falling-petal layers, ported verbatim from the design's mk()
     generator (Math.random, intentionally non-seeded per the design) ── */
  function mk(n, s0, s1, d0, d1) {
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    var arr = [];
    for (var i = 0; i < n; i++) {
      arr.push({
        left: +rnd(2, 94).toFixed(1),
        size: Math.round(rnd(s0, s1)),
        dur: +rnd(d0, d1).toFixed(1),
        delay: +(-rnd(0, d1)).toFixed(1),
        dx: Math.round(rnd(-52, 52)),
        blur: Math.random() < 0.3 ? +rnd(1, 2.2).toFixed(1) : 0,
        op: +rnd(0.55, 0.95).toFixed(2)
      });
    }
    return arr;
  }
  function buildPetals(hostSel, list) {
    var host = $(hostSel);
    if (!host) return;
    var frag = document.createDocumentFragment();
    list.forEach(function (pt) {
      var img = document.createElement("img");
      img.src = "sakura-img/petal.webp"; img.alt = "";
      img.style.cssText = "position:absolute;top:-7vh;left:" + pt.left + "%;width:" + pt.size + "px;opacity:" + pt.op +
        ";filter:blur(" + pt.blur + "px);--dx:" + pt.dx + "px;animation:petalFall " + pt.dur + "s linear " + pt.delay + "s infinite;";
      frag.appendChild(img);
    });
    host.appendChild(frag);
  }
  buildPetals("#sk-hero-petals", mk(14, 12, 30, 9, 17));
  buildPetals("#sk-inv-petals", mk(5, 10, 20, 12, 20));
  buildPetals("#sk-wish-petals", mk(4, 10, 18, 13, 21));
  buildPetals("#sk-cd-petals", mk(6, 10, 22, 11, 19));
  buildPetals("#sk-foot-petals", mk(8, 11, 24, 10, 18));

  /* ── scroll-driven body background-color interpolation through the
     design's 5 stops, plus the data-para parallax loop — both rAF-throttled
     and ported ~1:1 from the design's own Component._apply() ── */
  (function () {
    var stops = [[0, [249, 227, 234]], [0.30, [227, 241, 222]], [0.60, [221, 241, 242]], [0.85, [249, 230, 200]], [1, [242, 217, 196]]];
    var raf = 0;
    function apply() {
      raf = 0;
      if(document.documentElement.hasAttribute("data-reduced")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.querySelectorAll("[data-para]").forEach(n=>n.style.transform="");return;}
      var y = window.scrollY || 0;
      var dh = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var t = Math.min(1, Math.max(0, y / dh));
      var c = stops[stops.length - 1][1];
      for (var i = 0; i < stops.length - 1; i++) {
        var a = stops[i], b = stops[i + 1];
        if (t >= a[0] && t <= b[0]) { var k = (t - a[0]) / (b[0] - a[0]); c = a[1].map(function (v, j) { return Math.round(v + (b[1][j] - v) * k); }); break; }
      }
      document.body.style.backgroundColor = "rgb(" + c.join(",") + ")";
      var els = document.querySelectorAll("[data-para]");
      for (var p = 0; p < els.length; p++) {
        var el = els[p];
        var sp = (document.documentElement.hasAttribute("data-reduced")||matchMedia("(prefers-reduced-motion: reduce)").matches) ? 0 : parseFloat(el.getAttribute("data-para")) || 0;
        el.style.transform = "translate3d(0," + (y * sp).toFixed(1) + "px,0)";
      }
    }
    function onScroll() { if (raf) return; raf = requestAnimationFrame(apply); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    apply();
  })();


};
})();