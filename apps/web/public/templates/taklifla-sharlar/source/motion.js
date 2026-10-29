
/* ─────────  SPLASH STARS  ───────── */
(function(){
  const s = document.querySelector('#splash .stars');
  if(!s) return;
  const n = 36;
  for(let i=0;i<n;i++){
    const b = document.createElement('b');
    b.style.left = (Math.random()*100)+'%';
    b.style.top  = (Math.random()*100)+'%';
    b.style.animationDelay = (Math.random()*3)+'s';
    b.style.transform = `scale(${0.6 + Math.random()*1.4})`;
    s.appendChild(b);
  }
})();

/* ─────────  PAINTED BACKGROUND LAYERS  ───────── */
/* Each .bg-layer carries a data-bg URL. Load the image; on success,
   apply it and fade the layer in. If it fails, the layer stays hidden
   and the gradient fallback on the section shows through. */
document.querySelectorAll('.bg-layer').forEach(layer => {
  const url = layer.dataset.bg;
  if(!url) return;
  const img = new Image();
  img.onload = () => {
    layer.style.backgroundImage = `url("${url}")`;
    layer.classList.add('ready');
  };
  img.onerror = () => { /* keep gradient fallback */ };
  img.src = url;
});

/* ─────────  SCROLL PARALLAX  ───────── */
/* Any element with [data-speed] gets a --paraY custom property updated
   on scroll, where speed is how much it leads (positive) or lags
   (negative) its parent section as we scroll past. */
const paraEls = Array.from(document.querySelectorAll('[data-speed]')).map(el => ({
  el,
  section: el.closest('section') || el.parentElement,
  speed: parseFloat(el.dataset.speed) || 0,
}));
let paraTick = null;
function applyParallax(){
  paraTick = null;
  if(window.sharlarReduced?.())return;
  const vh = window.innerHeight;
  for(const p of paraEls){
    const r = p.section.getBoundingClientRect();
    if(r.bottom < -200 || r.top > vh + 200){ continue; }
    const t = (r.top + r.height/2 - vh/2) / vh; // -1..+1 ish
    const y = t * p.speed * vh;
    p.el.style.setProperty('--paraY', y.toFixed(1) + 'px');
  }
}
function scheduleParallax(){
  if(paraTick) return;
  paraTick = requestAnimationFrame(applyParallax);
}
window.addEventListener('scroll', scheduleParallax, {passive:true});
window.addEventListener('resize', scheduleParallax);
applyParallax();

/* ─────────  MOUSE PARALLAX (hero arches)  ───────── */
const hero = document.getElementById('hero');
const archesEl = hero && hero.querySelector('.arches');
if(archesEl && matchMedia('(hover:hover)').matches){
  let mxTick = null, lastEv = null;
  hero.addEventListener('mousemove', (e) => {
    if(window.sharlarReduced?.())return;
    lastEv = e;
    if(mxTick) return;
    mxTick = requestAnimationFrame(() => {
      mxTick = null;
      const r = hero.getBoundingClientRect();
      const dx = (lastEv.clientX - (r.left + r.width/2)) / r.width;   // -.5..+.5
      const dy = (lastEv.clientY - (r.top  + r.height/2)) / r.height; // -.5..+.5
      // negate → arches lean opposite to cursor (looking past them)
      archesEl.style.setProperty('--mx', (dx * -14).toFixed(1) + 'px');
      archesEl.style.setProperty('--my', (dy * -12).toFixed(1) + 'px');
    });
  });
  hero.addEventListener('mouseleave', () => {
    archesEl.style.setProperty('--mx', '0px');
    archesEl.style.setProperty('--my', '0px');
  });
}

/* ─────────  SCROLL REVEAL  ───────── */
const io = new IntersectionObserver((entries) => {
  for(const e of entries){
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }
}, { rootMargin:'0px 0px -10% 0px', threshold:.12 });
window.sharlarObserve=()=>document.querySelectorAll('.reveal').forEach(el=>window.sharlarReduced?.()?el.classList.add('in'):io.observe(el));
window.sharlarObserve();

/* ─────────  CONFETTI (subtle, sectionwise)  ───────── */
function fillConfetti(container, count){
  const types = ['', 'sq', 'rd', 'cr'];
  for(let i=0;i<count;i++){
    const b = document.createElement('b');
    const t = types[Math.floor(Math.random()*types.length)];
    if(t) b.classList.add(t);
    b.style.left = (Math.random()*100)+'%';
    b.style.bottom = '-10px';
    const dur = 18 + Math.random()*22;
    const delay = -Math.random()*dur;
    b.style.animationDuration = dur+'s';
    b.style.animationDelay = delay+'s';
    b.style.width = (3 + Math.random()*5)+'px';
    b.style.height = b.style.width;
    container.appendChild(b);
  }
}
document.querySelectorAll('.confetti').forEach(c => {
  fillConfetti(c, parseInt(c.dataset.confetti || 8, 10));
});
