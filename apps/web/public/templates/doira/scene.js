/* Candle flicker and distant dust are anchored to the photograph's own camera. */
(() => {
  'use strict';
  const hero = document.querySelector('#hero'), canvas = document.querySelector('.scene__lights');
  if (!hero || !canvas) return;
  const g = canvas.getContext('2d');
  let width = 0, height = 0, dpr = 1, live = false, enabled = false, visible = true, raf = 0;
  const lamps = [[109,1113,22],[192,1006,9],[344,1001,8],[520,791,7],[842,1044,12],[925,1117,22],[1006,733,8],[240,680,7],[799,681,7],[124,490,3],[261,538,3],[367,556,3],[469,568,3],[570,566,3],[674,551,3],[784,526,3],[903,490,3]];
  const motes = Array.from({length: 22}, () => ({ x: Math.random(), y: .32 + Math.random() * .65, phase: Math.random() * 6.28, depth: .35 + Math.random() * .65 }));
  function resize() {
    const r = canvas.getBoundingClientRect(); width = r.width; height = r.height; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  }
  function draw(now) {
    raf = 0; if (!live || document.hidden) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, width, height);
    const scale = Math.max(width / 1024, height / 1536), ox = (width - 1024 * scale) / 2, oy = (height - 1536 * scale) / 2;
    g.globalCompositeOperation = 'screen';
    lamps.forEach(([x,y,r], i) => {
      const px = ox + x * scale, py = oy + y * scale, size = r * scale;
      const glow = g.createRadialGradient(px, py, 0, px, py, size * 2.5);
      glow.addColorStop(0, '#ffdfa8'); glow.addColorStop(.15, '#efb75c55'); glow.addColorStop(1, '#d4943300');
      g.globalAlpha = .15 + .08 * Math.sin(now / (850 + i * 47) + i * 3.7); g.fillStyle = glow;
      g.fillRect(px - size * 2.5, py - size * 2.5, size * 5, size * 5);
    });
    motes.forEach(p => {
      const y = ((p.y - now * .000003 * p.depth) % 1 + 1) % 1;
      g.globalAlpha = (.12 + .12 * Math.sin(now / 1800 + p.phase)) * p.depth;
      g.fillStyle = '#ffe3b3'; g.beginPath(); g.arc(p.x * width + Math.sin(now / 6000 + p.phase) * 8, y * height, p.depth, 0, 6.29); g.fill();
    });
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; raf = requestAnimationFrame(draw);
  }
  function sync() {
    live = enabled && visible && !document.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (live && !raf) raf = requestAnimationFrame(draw);
    if (!live) { cancelAnimationFrame(raf); raf = 0; }
  }
  new IntersectionObserver(es => { visible = es[0].isIntersecting; sync(); }, {threshold:.01}).observe(hero);
  new ResizeObserver(resize).observe(hero);
  document.addEventListener('visibilitychange', sync); resize();
  window.DoiraScene = { start() {enabled = true; sync();}, stop() {enabled = false; sync();}, resize };
})();
