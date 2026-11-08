
    // ─── Reveal-on-scroll ─────────────────────────────────
    (function() {
      var els = document.querySelectorAll('.reveal');
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !('IntersectionObserver' in window)) {
        els.forEach(function(el){ el.classList.add('in'); });
        return;
      }
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
      els.forEach(function(el){ io.observe(el); });
    })();

