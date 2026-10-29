(function(){var $=s=>document.querySelector(s);
  /* ── long names must never clip: shrink the cover-plate/hero/footer name
     type until the widest line fits (Muhammadyusuf-class names overflow at
     390px viewports). Re-run once webfonts land — metrics change. ── */
  (function () {
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
      fit($("#qg-cover-names"), 31, 16);
      fit($("#qg-hero-names"), 57, 30);
      fit($("#qg-foot-names"), 42, 22);
    }
    window.qogozFit=run;
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    window.addEventListener("resize", run);
  })();

})();
