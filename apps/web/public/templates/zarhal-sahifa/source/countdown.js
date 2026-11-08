    // ─── COUNTDOWN ──────────────────────────────────────────────
    (function() {
      // Customizer (top of body) sets __INV_TARGET__ when the iframe URL
      // includes a real date/time; otherwise fall back to the mock.
      const $d = document.getElementById('cd-d');
      const $h = document.getElementById('cd-h');
      const $m = document.getElementById('cd-m');
      const $s = document.getElementById('cd-s');
      function pad(n, w=2) { return String(Math.max(0, n)).padStart(w, '0'); }
      function tick() {
        const target = window.zarhalTarget || 0;
        const diff = Math.max(0, target - Date.now());
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        $d.textContent = pad(d, 3);
        $h.textContent = pad(h);
        $m.textContent = pad(m);
        $s.textContent = pad(s);
      }
      window.zarhalTick = tick;
      tick();
      setInterval(tick, 1000);
    })();

