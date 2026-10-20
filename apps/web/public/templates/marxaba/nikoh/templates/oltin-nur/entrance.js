/* Oltin Nur entrance: gold dust that writes the couple's names.

   When the seal breaks, a few thousand gold motes burst from it, hang in the light for a
   moment, then fly to points sampled from the real hero title (same font, size and place)
   and settle there, line by line and left to right, as if the names were being written.
   template.js then fades the real gold-foil title in over them and the motes melt away.

   window.OltinNurForge.play({ x, y, targets, lite }) → { assembledAt, release(), stop() }
     x, y      burst origin in viewport px (the seal centre)
     targets   elements whose text the dust should write (hero name spans)
     assembledAt  seconds after play() when every mote has landed
*/
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const GOLD = ['#7a5a22', '#b08a3e', '#c9a55c', '#e3c27a', '#f3dfa2', '#fff4cf'];

  // Lay out each word of the targets exactly where the browser placed it, then sample its ink.
  function sample(targets, w, h, gap) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true }); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    const words = [];
    targets.forEach((el, line) => {
      const cs = getComputedStyle(el), walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      while (walker.nextNode()) {
        const node = walker.currentNode, re = /\S+/g; let m;
        while ((m = re.exec(node.nodeValue))) {
          const r = document.createRange(); r.setStart(node, m.index); r.setEnd(node, m.index + m[0].length);
          const box = r.getBoundingClientRect(); if (!box.width) continue;
          const mt = g.measureText(m[0]), asc = mt.actualBoundingBoxAscent || box.height * .6, desc = mt.actualBoundingBoxDescent || box.height * .2;
          g.fillText(m[0], box.left + box.width / 2, box.top + box.height / 2 + (asc - desc) / 2);
          words.push({ line, left: box.left, right: box.right });
        }
      }
    });
    const data = g.getImageData(0, 0, w, h).data, pts = [];
    for (let y = 0; y < h; y += gap) for (let x = (y / gap) % 2 ? gap / 2 : 0; x < w; x += gap) {
      if (data[(Math.round(y) * w + Math.round(x)) * 4 + 3] > 120) {
        const word = words.find(wd => x >= wd.left - 4 && x <= wd.right + 4) || words[0];
        pts.push({ x, y, line: word ? word.line : 0 });
      }
    }
    return pts;
  }

  function emberSprite() {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const g = c.getContext('2d'), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, 'rgba(255,244,207,1)'); gr.addColorStop(.25, 'rgba(243,214,138,.55)'); gr.addColorStop(1, 'rgba(201,165,92,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return c;
  }
  let ember;
  function play(opts) {
    ember = ember || emberSprite();
    const lite = !!opts.lite, dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 2);
    const w = innerWidth, h = innerHeight;
    const canvas = document.createElement('canvas'); canvas.className = 'forge'; canvas.setAttribute('aria-hidden', 'true');
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    document.body.append(canvas);
    const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const budget = lite ? 900 : 2600, unit = Math.min(w, 480) / 390;
    let pts = sample(opts.targets, w, h, lite ? 3.2 : 2.2);
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
    if (pts.length > budget) pts = pts.slice(0, budget);
    const lines = Math.max(1, ...pts.map(p => p.line + 1));
    let minX = Infinity, maxX = -Infinity; pts.forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); });
    const span = Math.max(1, maxX - minX);

    // Writing order: groom's line, then the ampersand, then the bride's, each left to right.
    const WRITE = 1.15, START = .55;
    const motes = pts.map(p => {
      const a = Math.random() * TAU, sp = (160 + Math.random() * 620) * unit;
      const order = (p.line + (p.x - minX) / span) / lines;
      return { x: opts.x, y: opts.y, px: opts.x, py: opts.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * .82,
        tx: p.x, ty: p.y, delay: START + order * WRITE + Math.random() * .12, size: (lite ? 1.5 : 1.15) + Math.random() * .7,
        tint: 2 + (Math.random() * 3 | 0), tw: Math.random() * TAU, free: false };
    });
    // a halo of loose dust that never lands: it keeps the burst generous
    const loose = Array.from({ length: lite ? 120 : 420 }, () => {
      const a = Math.random() * TAU, sp = (220 + Math.random() * 900) * unit;
      return { x: opts.x, y: opts.y, px: opts.x, py: opts.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1.4 + Math.random() * 1.6, size: .8 + Math.random() * 1.1, tint: 3 + (Math.random() * 3 | 0) };
    });
    const assembledAt = START + WRITE + .12 + .75;

    let t = 0, last = 0, raf = 0, fade = 1, releasing = false, stopped = false;
    function frame(now) {
      raf = 0; if (stopped) return;
      const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60; last = now; t += dt;
      if (releasing) fade -= dt / 1.1;
      if (fade <= 0) { stop(); return; }

      for (const m of motes) {
        m.px = m.x; m.py = m.y;
        if (m.free) { m.vy -= 14 * dt; m.vx *= Math.exp(-.6 * dt); }
        else if (t < m.delay) {
          // drift in the light: drag, a breath of gravity, a slow swirl round the seal
          const d = Math.exp(-2.4 * dt), dx = m.x - opts.x, dy = m.y - opts.y;
          m.vx = m.vx * d - dy * .35 * dt; m.vy = m.vy * d + dx * .35 * dt + 22 * unit * dt;
        } else {
          // a slightly under-damped spring: the mote overshoots a hair and settles
          const k = 70, c = 11.5;
          m.vx += ((m.tx - m.x) * k - m.vx * c) * dt; m.vy += ((m.ty - m.y) * k - m.vy * c) * dt;
        }
        m.x += m.vx * dt; m.y += m.vy * dt;
      }
      for (const l of loose) { l.px = l.x; l.py = l.y; const d = Math.exp(-1.9 * dt); l.vx *= d; l.vy = l.vy * d + 26 * unit * dt; l.x += l.vx * dt; l.y += l.vy * dt; l.life -= dt; }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      const tail = 4.5 * unit;
      // embers: a soft glow round every few motes while they are still flying
      if (!lite) for (let i = 0; i < motes.length; i += 7) {
        const m = motes[i], speed = Math.abs(m.vx) + Math.abs(m.vy); if (speed < 60) continue;
        ctx.globalAlpha = fade * Math.min(.5, speed / 900); ctx.drawImage(ember, m.x - 7, m.y - 7, 14, 14);
      }
      // batch by tint so a few thousand streaks cost a handful of strokes
      for (let tint = 0; tint < GOLD.length; tint++) {
        ctx.beginPath(); let any = false;
        for (const m of motes) {
          const speed = Math.abs(m.vx) + Math.abs(m.vy), hot = speed > 260 ? 5 : speed > 120 ? 4 : m.tint;
          if (hot !== tint) continue;
          const dx = m.x - m.px, dy = m.y - m.py, len = Math.hypot(dx, dy), k = len > tail ? tail / len : 1;
          ctx.moveTo(m.x - dx * k, m.y - dy * k); ctx.lineTo(m.x + .01, m.y); any = true;
        }
        for (const l of loose) {
          if (l.life <= 0 || l.tint !== tint) continue;
          const dx = l.x - l.px, dy = l.y - l.py, len = Math.hypot(dx, dy), k = len > tail ? tail / len : 1;
          ctx.moveTo(l.x - dx * k, l.y - dy * k); ctx.lineTo(l.x + .01, l.y); any = true;
        }
        if (!any) continue;
        ctx.strokeStyle = GOLD[tint]; ctx.lineWidth = lite ? 1.8 : 1.6;
        ctx.globalAlpha = fade * (tint >= 4 ? .95 : .8);
        ctx.stroke();
      }
      // landed motes twinkle like foil catching light
      if (t > START + .4) {
        ctx.fillStyle = '#fff6d6';
        for (let i = 0; i < motes.length; i += lite ? 9 : 5) {
          const m = motes[i]; m.tw += dt * 5;
          const s = Math.sin(m.tw); if (s < .92 || t < m.delay + .5) continue;
          ctx.globalAlpha = fade * (s - .92) * 9; ctx.fillRect(m.x - 1.2, m.y - 1.2, 2.4, 2.4);
        }
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    }
    function release() {
      if (releasing) return; releasing = true;
      // about one mote in five lifts off and drifts up like dust; the rest dissolve in place
      motes.forEach(m => { if (Math.random() < .2) { m.free = true; m.vx = (Math.random() - .5) * 30 * unit; m.vy = -(15 + Math.random() * 45) * unit; } });
    }
    function stop() { stopped = true; if (raf) cancelAnimationFrame(raf); canvas.remove(); }
    raf = requestAnimationFrame(frame);
    return { assembledAt, release, stop };
  }

  window.OltinNurForge = { play };
})();
