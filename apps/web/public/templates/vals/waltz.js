/* The waltzing couple: 12 silhouette frames of one full waltz turn (art/waltz.webp, cut by
   art/src/cut_waltz.py). Shared by the zoetrope, the ballroom and the scroll promenade. */
window.ValsWaltz = (() => {
  'use strict';
  const FRAMES = 12, FW = 270, FH = 300;
  let image = null, loading = null;
  const tints = new Map();

  function load(src = 'art/waltz.webp') {
    loading ||= new Promise(resolve => {
      const img = new Image(); img.decoding = 'async';
      img.onload = () => { image = img; resolve(img); };
      img.onerror = () => resolve(null);
      img.src = src;
    });
    return loading;
  }

  /* The sheet recoloured once per style: `fill` is a colour or (ctx, w, h) => fillStyle. */
  function sheet(key, fill) {
    if (!image) return null;
    if (tints.has(key)) return tints.get(key);
    const c = document.createElement('canvas'); c.width = image.width; c.height = image.height;
    const g = c.getContext('2d'); g.drawImage(image, 0, 0);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = typeof fill === 'function' ? fill(g, c.width, c.height) : fill;
    g.fillRect(0, 0, c.width, c.height);
    tints.set(key, c); return c;
  }

  const index = frame => ((Math.floor(frame) % FRAMES) + FRAMES) % FRAMES;

  /* Draws one frame with its feet on `baseline`, centred on x. */
  function draw(ctx, art, frame, x, baseline, height, flip = false) {
    if (!art) return;
    const f = index(frame), w = FW * height / FH;
    if (flip) { ctx.save(); ctx.translate(x, 0); ctx.scale(-1, 1); ctx.drawImage(art, f * FW, 0, FW, FH, -w / 2, baseline - height, w, height); ctx.restore(); }
    else ctx.drawImage(art, f * FW, 0, FW, FH, x - w / 2, baseline - height, w, height);
  }

  return { FRAMES, FW, FH, load, sheet, draw, index, get image() { return image; } };
})();
