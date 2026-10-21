/* Konfetti — blow out the candle, the lights come on, the confetti cannons fire. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const M = () => window.Marhamat || {};
  const reduce = () => !!M().reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const forceFull = new URLSearchParams(location.search).get('tier') === 'full'; // QA: keep the shader on slow test machines
  const lite = () => !forceFull && M().tier === 'lite';
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const COLORS = ['#b8a4ff', '#ff6fb5', '#ffb089', '#9ef0d2', '#ffe27a', '#fff4e8', '#9fd7ff'];
  const BACKS = ['#7d68d6', '#c9417f', '#d9805a', '#5fc3a1', '#d9b64a', '#d8cbbd', '#6aa8d6'];

  const intro = $('#intro'), hero = $('#hero'), openButton = $('#open-invitation');
  document.documentElement.classList.add('is-js');

  /* ── Text splitting (after core has filled slots and translated) ── */
  function splitChars(el) {
    if (!el || el.dataset.split) return [];
    const text = el.textContent.trim();
    if (!text) return [];
    el.dataset.split = '1';
    el.setAttribute('aria-label', text);
    el.replaceChildren();
    const chars = [];
    text.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { el.append(' '); return; }
      const word = document.createElement('span');
      word.className = 'w'; word.setAttribute('aria-hidden', 'true');
      for (const c of part) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; word.append(s); chars.push(s); }
      el.append(word);
    });
    return chars;
  }
  function splitWords(el) {
    if (!el || el.dataset.split) return [];
    const words = el.textContent.trim().split(/\s+/);
    el.dataset.split = '1'; el.replaceChildren();
    return words.map((w, i) => { const s = document.createElement('span'); s.className = 'w'; s.textContent = w; el.append(s); if (i < words.length - 1) el.append(' '); return s; });
  }
  function buildAge() {
    const el = $('.hero__age');
    const age = (el?.textContent || '').trim();
    if (!el || !age) { hero?.classList.add('no-age'); return []; }
    el.setAttribute('aria-label', age); el.replaceChildren(); el.style.setProperty('--len', Math.max(2, [...age].length));
    return [...age].map(d => { const s = document.createElement('span'); s.className = 'digit'; s.dataset.d = d; s.textContent = d; s.setAttribute('aria-hidden', 'true'); el.append(s); return s; });
  }

  /* ── Confetti engine: one fixed canvas for every burst ── */
  const confetti = (() => {
    const canvas = $('.confetti'), ctx = canvas?.getContext('2d');
    let pieces = [], raf = 0, last = 0, w = 0, h = 0, dpr = 1;
    function size() {
      if (!canvas) return;
      dpr = Math.min(devicePixelRatio || 1, lite() ? 1.5 : 2);
      w = innerWidth; h = innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size(); addEventListener('resize', size, { passive: true });
    function make(x, y, angle, speed, kind) {
      const ci = Math.floor(Math.random() * COLORS.length);
      const shape = kind || (Math.random() < .2 ? 'ribbon' : Math.random() < .3 ? 'dot' : Math.random() < .12 ? 'star' : 'rect');
      return {
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        rot: rand(0, Math.PI * 2), vr: rand(-9, 9), tilt: rand(0, Math.PI * 2), vt: rand(6, 14),
        sway: rand(0, 6.28), w: shape === 'ribbon' ? rand(4, 5) : rand(7, 12), h: shape === 'ribbon' ? rand(26, 44) : rand(5, 8),
        color: COLORS[ci], back: BACKS[ci], shape, life: rand(3.2, 5.2), drag: shape === 'ribbon' ? .985 : rand(.972, .982)
      };
    }
    function cap() { return lite() ? 110 : 320; }
    function burst(x, y, { count = 40, angle = -Math.PI / 2, spread = Math.PI * 2, power = 900, kinds } = {}) {
      if (!ctx || reduce()) return;
      const n = Math.round(count * (lite() ? .45 : 1));
      for (let i = 0; i < n && pieces.length < cap(); i++) {
        const a = angle + rand(-spread / 2, spread / 2);
        pieces.push(make(x + rand(-6, 6), y + rand(-6, 6), a, power * rand(.45, 1.05), kinds ? kinds[i % kinds.length] : null));
      }
      start();
    }
    function cannons() {
      const p = Math.max(w, h);
      burst(-10, h + 10, { count: 70, angle: -Math.PI / 3.1, spread: .55, power: p * 1.65 });
      burst(w + 10, h + 10, { count: 70, angle: -Math.PI + Math.PI / 3.1, spread: .55, power: p * 1.65 });
    }
    function rain(count = 60) {
      if (!ctx || reduce()) return;
      const n = Math.round(count * (lite() ? .4 : 1));
      for (let i = 0; i < n && pieces.length < cap(); i++) { const p = make(rand(0, w), rand(-h * .6, -20), Math.PI / 2, rand(40, 160)); pieces.push(p); }
      start();
    }
    function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
    function tick(now) {
      raf = 0;
      const dt = Math.min(.033, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, w, h);
      const alive = [];
      for (const p of pieces) {
        p.vy += 980 * dt * (p.shape === 'ribbon' ? .55 : .7);
        p.vx *= Math.pow(p.drag, dt * 60); p.vy *= Math.pow(p.drag, dt * 60);
        const terminal = p.shape === 'ribbon' ? 150 : 210;
        if (p.vy > terminal) p.vy = terminal;
        p.sway += dt * 3; p.x += (p.vx + Math.sin(p.sway) * 26) * dt; p.y += p.vy * dt;
        p.rot += p.vr * dt; p.tilt += p.vt * dt; p.life -= dt;
        if (p.y > h + 60 || p.life <= 0) continue;
        alive.push(p);
        const flip = Math.cos(p.tilt);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = Math.min(1, p.life * 1.6);
        ctx.fillStyle = flip > 0 ? p.color : p.back;
        if (p.shape === 'rect') { ctx.scale(1, flip); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
        else if (p.shape === 'dot') { ctx.scale(1, Math.abs(flip) * .7 + .3); ctx.beginPath(); ctx.arc(0, 0, p.h * .6, 0, 6.283); ctx.fill(); }
        else if (p.shape === 'star') {
          ctx.scale(Math.abs(flip) * .6 + .4, 1); ctx.beginPath();
          for (let k = 0; k < 8; k++) { const r = k % 2 ? 2.4 : 7, a = k * Math.PI / 4; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
          ctx.closePath(); ctx.fill();
        } else {
          ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = p.w * (Math.abs(flip) * .6 + .4); ctx.lineCap = 'round';
          ctx.beginPath();
          for (let s = 0; s <= 8; s++) { const yy = -p.h / 2 + p.h * s / 8, xx = Math.sin(s * .9 + p.tilt) * 5; s ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
          ctx.stroke();
        }
        ctx.restore();
      }
      pieces = alive;
      if (pieces.length && !document.hidden) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    }
    return { burst, cannons, rain };
  })();

  /* ── Iridescent shader for the hero poster ── */
  const shader = (() => {
    const canvas = $('.hero__shader');
    let gl, prog, uRes, uTime, uMouse, uScroll, raf = 0, visible = true, started = false, t0 = performance.now();
    let mouse = [.5, .5], target = [.5, .5], scroll = 0, frames = 0, sampleStart = 0, dead = false;
    const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const FS = `precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;uniform float s;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv;p.x*=r.x/r.y;float T=t*.07;
p+=(m-.5)*vec2(.18,-.18);p.y+=s*.6;
vec2 q=vec2(fbm(p*1.5+vec2(0.,T)),fbm(p*1.5+vec2(5.2,1.3)-T));
vec2 w=vec2(fbm(p*1.25+q*1.9+vec2(1.7,9.2)+T*1.2),fbm(p*1.25+q*1.9+vec2(8.3,2.8)-T*.9));
float f=fbm(p*1.1+w*2.2);
vec3 lil=vec3(.77,.70,1.),pnk=vec3(1.,.66,.84),pch=vec3(1.,.82,.68),mnt=vec3(.74,.97,.88),sky=vec3(.70,.86,1.),crm=vec3(1.,.97,.93);
vec3 c=mix(lil,pnk,smoothstep(.42,.82,w.x));
c=mix(c,pch,smoothstep(.5,.9,w.y)*.85);
c=mix(c,mnt,smoothstep(.42,.78,q.x));
c=mix(c,sky,smoothstep(.5,.85,q.y)*.75);
float band=sin(f*14.+T*5.+uv.y*3.);c+=vec3(.06,.04,.08)*band;
float sheen=smoothstep(.55,1.,sin((uv.x+uv.y)*3.2-T*4.)*.5+.5);c=mix(c,crm,sheen*.22);
c=mix(c,crm,smoothstep(.45,1.,uv.y)*.12);
gl_FragColor=vec4(c,1.);}`;
    function compile(type, src) { const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; }
    function size() {
      if (!gl) return;
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(devicePixelRatio || 1, 2) * .5; // smooth gradients: half resolution is plenty
      canvas.width = Math.max(2, Math.round(rect.width * scale)); canvas.height = Math.max(2, Math.round(rect.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function init() {
      if (gl || dead || !canvas || lite() || reduce()) return false;
      try {
        gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
        if (!gl) { dead = true; return false; }
        prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(prog); gl.useProgram(prog);
        const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        uRes = gl.getUniformLocation(prog, 'r'); uTime = gl.getUniformLocation(prog, 't'); uMouse = gl.getUniformLocation(prog, 'm'); uScroll = gl.getUniformLocation(prog, 's');
        size(); addEventListener('resize', size, { passive: true });
        canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); kill(); }, { once: true });
        new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) loop(); }, { threshold: 0 }).observe(hero);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) loop(); });
        hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); target = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; }, { passive: true });
        return true;
      } catch (_) { kill(); return false; }
    }
    function kill() { dead = true; cancelAnimationFrame(raf); raf = 0; canvas?.classList.remove('is-ready'); gl = null; }
    function draw(now) {
      raf = 0;
      if (!gl || !visible || document.hidden) return;
      mouse[0] += (target[0] - mouse[0]) * .04; mouse[1] += (target[1] - mouse[1]) * .04;
      gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse[0], mouse[1]); gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!canvas.classList.contains('is-ready')) canvas.classList.add('is-ready');
      // A slow phone gets the CSS gradient instead of a stuttering shader.
      frames++; if (!sampleStart) sampleStart = now;
      if (!forceFull && now - sampleStart > 2500) { if (frames * 1000 / (now - sampleStart) < 38) { kill(); return; } sampleStart = now; frames = 0; }
      raf = requestAnimationFrame(draw);
    }
    function loop() { if (gl && !raf && visible && !document.hidden) raf = requestAnimationFrame(draw); }
    function start() { if (started) return; started = true; if (init()) loop(); }
    return { start, setScroll: v => { scroll = v; }, stop: kill };
  })();

  /* ── Candle + smoke (intro canvas) ── */
  const candle = (() => {
    const canvas = $('.intro__fx'), ctx = canvas?.getContext('2d');
    const wickEl = $('.candle__wick');
    let w = 0, h = 0, dpr = 1, wx = 0, wy = 0, raf = 0, last = 0, t = 0;
    let bokeh = [];
    let lit = 0, igniting = false, wind = 0, blowing = false, out = false, ember = 0, smoke = [], smokeUntil = 0, onOut = null, gust = 0;
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    { const g = sprite.getContext('2d'); const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, 'rgba(225,215,240,.9)'); rg.addColorStop(.45, 'rgba(200,190,225,.35)'); rg.addColorStop(1, 'rgba(200,190,225,0)'); g.fillStyle = rg; g.fillRect(0, 0, 64, 64); }
    function size() {
      if (!canvas || !intro || intro.hidden) return;
      dpr = Math.min(devicePixelRatio || 1, lite() ? 1.5 : 2);
      w = intro.clientWidth; h = intro.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = wickEl.getBoundingClientRect(), ir = intro.getBoundingClientRect();
      wx = r.left - ir.left + r.width / 2; wy = r.top - ir.top + 1;
      const tints = ['184,164,255', '255,111,181', '255,176,137', '158,240,210'];
      bokeh = Array.from({ length: reduce() ? 0 : lite() ? 6 : 14 }, (_, i) => ({ x: rand(0, w), y: rand(0, h), r: rand(8, 34), a: rand(.04, .12), vx: rand(-4, 4), vy: rand(-9, -3), c: tints[i % 4], ph: rand(0, 6.28) }));
      intro.style.setProperty('--fx', wx + 'px'); intro.style.setProperty('--fy', (wy - 26) + 'px');
    }
    function tear(x, y, W, H, lean) {
      ctx.beginPath();
      ctx.moveTo(x, y + W * .32);
      ctx.bezierCurveTo(x - W * 1.05, y + W * .1, x - W * .62 + lean * .25, y - H * .5, x + lean, y - H);
      ctx.bezierCurveTo(x + W * .62 + lean * .25, y - H * .5, x + W * 1.05, y + W * .1, x, y + W * .32);
      ctx.closePath();
    }
    function drawFlame() {
      const life = lit * (1 - clamp((wind - .62) / .38, 0, 1) * .75);
      if (life <= .01) return;
      const flick = 1 + Math.sin(t * 11.3) * .045 + Math.sin(t * 23.7) * .03 + Math.sin(t * 5.1) * .03;
      const H = 54 * life * flick * (1 - wind * .42), W = 13 * (.6 + .4 * life) * (1 - wind * .18);
      const lean = Math.sin(t * 3.3) * 1.6 + Math.sin(t * 8.1) * .8 + wind * (32 + gust * 14);
      const x = wx, y = wy - 3;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      // halo
      const halo = ctx.createRadialGradient(x + lean * .4, y - H * .45, 0, x + lean * .4, y - H * .45, 90);
      halo.addColorStop(0, `rgba(255,190,110,${.32 * life})`); halo.addColorStop(1, 'rgba(255,140,60,0)');
      ctx.fillStyle = halo; ctx.fillRect(x - 100, y - H - 100, 200, H + 180);
      // outer
      let g = ctx.createLinearGradient(0, y, 0, y - H);
      g.addColorStop(0, `rgba(255,120,50,${.75 * life})`); g.addColorStop(.55, `rgba(255,160,60,${.7 * life})`); g.addColorStop(1, 'rgba(255,110,40,0)');
      ctx.shadowColor = 'rgba(255,140,60,.9)'; ctx.shadowBlur = 18;
      tear(x, y, W, H, lean); ctx.fillStyle = g; ctx.fill();
      ctx.shadowBlur = 0;
      // middle
      g = ctx.createLinearGradient(0, y, 0, y - H * .8);
      g.addColorStop(0, `rgba(255,214,130,${.95 * life})`); g.addColorStop(1, 'rgba(255,200,110,0)');
      tear(x, y, W * .66, H * .78, lean * .82); ctx.fillStyle = g; ctx.fill();
      // core
      g = ctx.createLinearGradient(0, y, 0, y - H * .45);
      g.addColorStop(0, `rgba(255,252,240,${life})`); g.addColorStop(1, 'rgba(255,245,220,0)');
      tear(x, y + 1, W * .36, H * .44, lean * .6); ctx.fillStyle = g; ctx.fill();
      // blue root
      const b = ctx.createRadialGradient(x, y + 2, 0, x, y + 2, W * .9);
      b.addColorStop(0, `rgba(110,140,255,${.55 * life})`); b.addColorStop(1, 'rgba(110,140,255,0)');
      ctx.fillStyle = b; ctx.beginPath(); ctx.ellipse(x, y + 2, W * .9, W * .7, 0, 0, 6.283); ctx.fill();
      ctx.restore();
      intro.style.setProperty('--flame', (life * flick * .9 + .1).toFixed(3));
    }
    function drawSmoke(dt) {
      if (out && t < smokeUntil) {
        const rate = lite() ? 18 : 46;
        for (let i = 0; i < rate * dt * 1.0; i++) smoke.push({ x: wx + Math.sin(t * 6) * 1.5, y: wy - 4, vx: rand(-6, 6), vy: rand(-62, -40), r: rand(2.5, 4), a: rand(.35, .55), life: 1, ph: rand(0, 6.28), spin: rand(1.6, 2.6) });
      }
      const next = [];
      for (const p of smoke) {
        p.life -= dt * .42; if (p.life <= 0) continue;
        const age = 1 - p.life;
        p.x += (p.vx + Math.sin(t * p.spin + p.ph + age * 5) * (10 + age * 26)) * dt;
        p.y += p.vy * dt; p.vy *= .995; p.r += dt * (8 + age * 14);
        ctx.globalAlpha = p.a * p.life * (age < .08 ? age / .08 : 1);
        ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        next.push(p);
      }
      ctx.globalAlpha = 1; smoke = next;
    }
    function drawBokeh(dt) {
      for (const b of bokeh) {
        b.x += b.vx * dt; b.y += b.vy * dt; if (b.y < -40) { b.y = h + 40; b.x = rand(0, w); }
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const a = b.a * (.7 + .3 * Math.sin(t * .8 + b.ph));
        g.addColorStop(0, `rgba(${b.c},${a})`); g.addColorStop(.7, `rgba(${b.c},${a * .6})`); g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill();
      }
    }
    function drawEmber() {
      if (ember <= 0) return;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(wx, wy - 1, 0, wx, wy - 1, 7);
      g.addColorStop(0, `rgba(255,120,60,${ember})`); g.addColorStop(1, 'rgba(255,60,30,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(wx, wy - 1, 7, 0, 6.283); ctx.fill(); ctx.restore();
    }
    function frame(now) {
      raf = 0;
      const dt = Math.min(.04, (now - last) / 1000 || .016); last = now; t += dt;
      if (igniting) { lit = Math.min(1, lit + dt * 1.6); if (lit >= 1) igniting = false; }
      if (!out) {
        if (blowing) { gust = Math.max(0, Math.sin(t * 9) * .5 + .5); wind = Math.min(1.05, wind + dt * (1.05 + gust * .6)); }
        else wind = Math.max(0, wind - dt * 1.8);
        intro.style.setProperty('--wind', clamp(wind, 0, 1).toFixed(3));
        if (wind >= 1) extinguish();
      }
      ctx.clearRect(0, 0, w, h);
      drawBokeh(dt);
      if (!out) drawFlame(); else { ember = Math.max(0, ember - dt * .9); intro.style.setProperty('--flame', '0'); }
      drawEmber(); drawSmoke(dt);
      if (!intro.hidden && !document.hidden && (!out || smoke.length || ember > 0)) raf = requestAnimationFrame(frame);
    }
    function play() { if (!raf && canvas) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function extinguish() {
      if (out) return; out = true; ember = 1; smokeUntil = t + (lite() ? .8 : 1.5);
      try { navigator.vibrate?.(18); } catch (_) {}
      onOut?.();
    }
    function ignite() { if (reduce()) { lit = 1; drawStatic(); return; } igniting = true; play(); }
    function drawStatic() { size(); ctx.clearRect(0, 0, w, h); drawFlame(); }
    function blow() { blowing = true; if (reduce()) { extinguish(); return; } play(); }
    if (canvas) { size(); addEventListener('resize', () => { size(); if (reduce() && !out) drawStatic(); }, { passive: true }); }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !intro.hidden) play(); });
    return { ignite, blow, set onOut(fn) { onOut = fn; }, get wick() { const r = wickEl.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top }; }, size };
  })();

  /* ── Intro arrival ── */
  let opened = false, finished = false, ageDigits = [], nameChars = [];
  function arrival() {
    const kicker = $('.intro__kicker');
    const words = splitWords(kicker);
    if (window.gsap && !reduce()) {
      gsap.set(['.intro__greeting', '.intro__wish', '.blow', '.intro__hint'], { opacity: 0, y: 14 });
      gsap.set(words, { opacity: 0, y: 26, rotate: 4 });
      gsap.set('.candle', { opacity: 0, y: 30 });
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('.candle', { opacity: 1, y: 0, duration: .9 }, .1)
        .add(() => candle.ignite(), .65)
        .to('.intro__greeting', { opacity: 1, y: 0, duration: .5 }, .55)
        .to(words, { opacity: 1, y: 0, rotate: 0, duration: .7, stagger: .09, ease: 'back.out(1.6)' }, .7)
        .to('.intro__wish', { opacity: 1, y: 0, duration: .5 }, 1.2)
        .to('.blow', { opacity: 1, y: 0, duration: .6, ease: 'back.out(1.8)' }, 1.35)
        .to('.intro__hint', { opacity: 1, y: 0, duration: .5 }, 1.6);
    } else candle.ignite();
  }

  /* ── Blow → lights on ── */
  function begin() {
    if (opened) return;
    opened = true;
    intro.classList.add('is-blowing');
    M().open?.(); // inside the gesture so music may start
    candle.blow();
  }
  candle.onOut = () => {
    const wick = candle.wick;
    shader.start();
    prepareHero();
    if (!window.gsap || reduce()) { finish(); return; }
    const ir = intro.getBoundingClientRect();
    const maxR = Math.hypot(Math.max(wick.x, ir.width - wick.x), Math.max(wick.y, ir.height - wick.y)) + 40;
    intro.style.setProperty('--hx', (wick.x - ir.left) + 'px'); intro.style.setProperty('--hy', (wick.y - ir.top) + 'px');
    const quick = lite();
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(['.intro__copy--bottom', '.intro__copy--top'], { opacity: 0, y: -10, duration: .45, ease: 'power2.in' }, 0)
      .to('.intro__room', { opacity: .35, duration: .5 }, 0)
      .addLabel('lights', quick ? .45 : .95)
      .add(() => { intro.classList.add('is-revealing'); }, 'lights')
      .fromTo(intro, { '--hr': '0px' }, { '--hr': maxR + 'px', duration: quick ? .7 : 1.05, ease: 'expo.in' }, 'lights')
      .to('.candle', { scale: .6, opacity: 0, duration: .5, ease: 'power2.in' }, 'lights+=.35')
      .add(() => { confetti.cannons(); confetti.burst(wick.x, wick.y, { count: 46, power: 760 }); }, quick ? 'lights+=.5' : 'lights+=.82')
      .add(playHeroEntrance, quick ? 'lights+=.35' : 'lights+=.6');
  }
  openButton?.addEventListener('pointerdown', e => { e.preventDefault(); begin(); });
  openButton?.addEventListener('click', begin);
  intro?.addEventListener('pointerdown', e => { if (!e.target.closest('.mh-lang')) begin(); });
  let touchY = null;
  intro?.addEventListener('touchstart', e => { touchY = e.touches[0]?.clientY ?? null; }, { passive: true });
  intro?.addEventListener('touchmove', e => { if (touchY != null && touchY - e.touches[0].clientY > 30) begin(); }, { passive: true });
  intro?.addEventListener('wheel', e => { if (e.deltaY > 8) begin(); }, { passive: true });
  addEventListener('keydown', e => { if (!opened && (e.key === 'Enter' || e.key === ' ') && document.activeElement === document.body) { e.preventDefault(); begin(); } });

  /* ── Hero entrance (plays while the lights come on) ── */
  let heroReady = false;
  function prepareHero() {
    if (heroReady) return; heroReady = true;
    if (!window.gsap || reduce()) return;
    if (ageDigits.length) gsap.set(ageDigits, { yPercent: 40, scale: .3, rotate: i => i % 2 ? 16 : -16, opacity: 0 });
    if (nameChars.length) gsap.set(nameChars, { yPercent: 110, opacity: 0, rotate: 8 });
    gsap.set(['.hero__top', '.hero__date', '.hero__tap'], { opacity: 0, y: 16 });
    gsap.set('.badge', { scale: 0, rotate: -120 });
    gsap.set('.tape--ink', { xPercent: -60 }); gsap.set('.tape--pink', { xPercent: 60 });
  }
  function playHeroEntrance() {
    if (!window.gsap || reduce()) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (ageDigits.length) tl.to(ageDigits, { yPercent: 0, scale: 1, rotate: 0, opacity: 1, duration: 1.1, stagger: .1, ease: 'elastic.out(1, .55)' }, 0);
    tl.to('.badge', { scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)' }, .25);
    if (nameChars.length) tl.to(nameChars, { yPercent: 0, opacity: 1, rotate: 0, duration: .7, stagger: .028, ease: 'back.out(1.8)' }, .35);
    tl
      .to('.hero__top', { opacity: 1, y: 0, duration: .6 }, .45)
      .to(['.hero__date', '.hero__tap'], { opacity: 1, y: 0, duration: .6, stagger: .1 }, .7)
      .to(['.tape--ink', '.tape--pink'], { xPercent: 0, duration: 1.2, ease: 'expo.out' }, .3);
  }
  function finish() {
    if (finished) return; finished = true;
    if (!heroReady) prepareHero();
    intro.setAttribute('aria-hidden', 'true'); intro.hidden = true;
    document.documentElement.classList.remove('is-locked'); document.body.classList.add('is-open');
    scrollTo(0, 0);
    setTimeout(() => window.ScrollTrigger?.refresh?.(), 60);
  }

  /* ── Hero: tap for confetti ── */
  hero?.addEventListener('pointerdown', e => {
    if (!finished || e.target.closest('a,button')) return;
    hero.classList.add('was-tapped');
    confetti.burst(e.clientX, e.clientY, { count: 34, power: 620 });
    if (window.gsap && !reduce() && ageDigits.length && e.target.closest('.hero__age')) gsap.fromTo(ageDigits, { scale: 1.12 }, { scale: 1, duration: .8, ease: 'elastic.out(1,.4)', stagger: .05 });
  });

  /* ── Countdown digits roll when they change ── */
  function watchCountdown() {
    $$('[data-countdown] [data-unit]').forEach(el => {
      let prev = el.textContent;
      new MutationObserver(() => { if (el.textContent === prev) return; prev = el.textContent; if (reduce()) return; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }).observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  /* ── Scroll choreography ── */
  let scrollReady = false;
  function setupScroll() {
    if (scrollReady) return; scrollReady = true;
    const titles = $$('.section__title');
    titles.forEach(t => splitChars(t));
    if (!window.gsap || !window.ScrollTrigger || reduce()) return;
    gsap.registerPlugin(ScrollTrigger);

    // Section titles: letters pop up one by one
    titles.forEach(t => {
      gsap.from($$('.ch', t), { yPercent: 100, opacity: 0, rotate: 10, duration: .7, stagger: .022, ease: 'back.out(1.7)', scrollTrigger: { trigger: t, start: 'top 88%', once: true } });
    });
    $$('.sheet .eyebrow, .letter__greeting, .letter__sign, .calendar, .countdown, .countdown__label, [data-ics], .button-row, .dresscode, .gallery__nav, .rsvp__fields, .wish-form, .gift, .gift__note, .contacts li, #rsvp>.muted').forEach(el => {
      gsap.from(el, { y: 26, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    // Message: words light up as you read (scrubbed)
    const msg = $('.letter__message');
    const words = splitWords(msg);
    if (words.length) gsap.fromTo(words, { opacity: .14 }, { opacity: 1, stagger: .5, ease: 'none', scrollTrigger: { trigger: msg, start: 'top 82%', end: 'bottom 52%', scrub: .6 } });
    gsap.from('.sticker', { scale: 0, rotate: -90, duration: .9, ease: 'back.out(2)', scrollTrigger: { trigger: '#invitation-text', start: 'top 85%', once: true } });
    gsap.to('.sticker', { rotate: 40, ease: 'none', scrollTrigger: { trigger: '#invitation-text', start: 'top bottom', end: 'bottom top', scrub: .8 } });

    // Hero: the age grows and drifts as the poster scrolls away; shader follows
    gsap.to('.hero__age', { scale: 1.18, yPercent: -14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .7 } });
    gsap.to('.hero__name', { yPercent: -40, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .7 } });
    gsap.to('.badge', { rotate: 220, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .7 } });
    ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', onUpdate: self => shader.setScroll(self.progress) });
    // Tapes speed up with scroll velocity
    const tracks = $$('.tape__track').map(el => el.getAnimations?.()[0]).filter(Boolean);
    let boost = 0;
    ScrollTrigger.create({ onUpdate: self => { boost = Math.min(5, Math.abs(self.getVelocity()) / 400); } });
    gsap.ticker.add(() => { boost *= .92; tracks.forEach(a => { a.playbackRate = 1 + boost; }); });

    // Date: the day counts up
    const day = $('.date-poster__day');
    const target = parseInt(day?.textContent || '', 10);
    if (target > 1) { const o = { v: 1 }; gsap.to(o, { v: target, duration: 1.4, ease: 'power3.out', snap: { v: 1 }, onUpdate: () => { day.textContent = String(Math.round(o.v)); }, scrollTrigger: { trigger: day, start: 'top 85%', once: true } }); }
    // Program: the rules draw in
    $$('.program__item').forEach((li, i) => {
      gsap.fromTo(li, { '--line': 0 }, { '--line': 1, ease: 'none', scrollTrigger: { trigger: li, start: 'top 92%', end: 'top 60%', scrub: .5 } });
      gsap.from(li.children, { x: -24, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 88%', once: true } });
    });
    // Ticket: slides in tilted, settles; photo parallax
    gsap.fromTo('.ticket', { rotate: -7, y: 70, scale: .94 }, { rotate: 0, y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.ticket', start: 'top bottom', end: 'top 45%', scrub: .7 } });
    gsap.fromTo('.ticket__photo img', { '--py': '-15%' }, { '--py': '0%', ease: 'none', scrollTrigger: { trigger: '.ticket', start: 'top bottom', end: 'bottom top', scrub: .5 } });
    // Gallery cards fly in from the right
    const galleryItems = $$('.gallery__item');
    if (galleryItems.length) gsap.from(galleryItems, { x: 160, rotate: 10, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.gallery', start: 'top 80%', once: true } });
    // Wishes drop in like notes
    $$('.wishes__item').forEach(li => gsap.from(li, { y: 40, rotate: () => rand(-8, 8), opacity: 0, duration: .9, ease: 'back.out(1.5)', scrollTrigger: { trigger: li, start: 'top 90%', once: true } }));
    // Footer: confetti rain once
    ScrollTrigger.create({ trigger: '.footer', start: 'top 70%', once: true, onEnter: () => confetti.rain(70) });
    gsap.from('.footer__big', { scale: .6, opacity: 0, duration: 1, ease: 'elastic.out(1,.6)', scrollTrigger: { trigger: '.footer', start: 'top 80%', once: true } });
  }

  /* ── Celebrations ── */
  M().on?.('rsvp', answer => {
    if (answer?.status !== 'yes') return;
    confetti.cannons();
    const b = $('[data-rsvp-done]')?.getBoundingClientRect();
    if (b) setTimeout(() => confetti.burst(b.left + b.width / 2, b.top + 50, { count: 40, power: 700 }), 200);
  });
  M().on?.('wish', () => {
    const b = $('.wish-form .button')?.getBoundingClientRect();
    if (b) confetti.burst(b.left + b.width / 2, b.top, { count: 28, angle: -Math.PI / 2, spread: 1.6, power: 640 });
  });
  $('.gift')?.addEventListener('toggle', e => {
    if (!e.target.open) return;
    const b = $('.giftbox')?.getBoundingClientRect();
    if (b) confetti.burst(b.left + b.width / 2, b.top + 20, { count: 40, angle: -Math.PI / 2, spread: 1.4, power: 760 });
  });

  /* ── Long names: shrink until the longest word fits ── */
  function fit(el, min) {
    if (!el || !el.clientWidth) return;
    el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (size > min && el.scrollWidth > el.clientWidth + 1) { size -= 2; el.style.fontSize = size + 'px'; }
  }
  function fitAll() { fit($('.hero__name'), 26); fit($('.footer__big'), 20); }
  addEventListener('resize', fitAll, { passive: true });

  /* ── Boot ── */
  let booted = false;
  function boot() {
    if (booted) return; booted = true;
    ageDigits = buildAge();
    nameChars = splitChars($('.hero__name'));
    fitAll(); document.fonts?.ready?.then(fitAll);
    candle.size();
    arrival();
    watchCountdown();
    setupScroll();
    // Already opened (e.g. reload deep in the page) or no intro: show the poster directly.
    if (!intro || intro.hidden) { shader.start(); finished = true; }
  }
  if (M().on) M().on('ready', boot);
  addEventListener('load', boot, { once: true });
  M().on?.('tier', () => { if (lite()) shader.stop(); });
})();
