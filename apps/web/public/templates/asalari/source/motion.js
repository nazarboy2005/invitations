/* ----------------------- SPLASH unlock ----------------------- */
const openBtn = document.getElementById('openBtn');
openBtn.addEventListener('click', () => {
  document.body.classList.remove('locked');
  // smooth scroll to hero
  const hero = document.querySelector('.hero');
  if (hero){
    setTimeout(()=>hero.scrollIntoView({behavior:document.body.classList.contains('reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'}), 60);
  }
});

/* ----------------------- Scroll reveal ---------------------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{ threshold: .15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ----------------------- Particles (sparkles) --------------- */
const PARTICLES = 18;
const p = document.getElementById('particles');
for (let i=0;i<PARTICLES;i++){
  const el = document.createElement('span');
  el.className = 'particle';
  const size = 4 + Math.random()*8;
  el.style.width = size+'px';
  el.style.height = size+'px';
  el.style.left = (Math.random()*100)+'%';
  el.style.animationDuration = (14 + Math.random()*18)+'s';
  el.style.animationDelay = (-Math.random()*20)+'s';
  // alternate colors
  if (i%3===0){
    el.style.background = 'radial-gradient(circle at 35% 35%, #fff, #bfe6f7 60%, #4ba8d6)';
  } else if (i%3===1){
    el.style.background = 'radial-gradient(circle at 35% 35%, #fff, #ffd6cb 60%, #ff998a)';
  }
  p.appendChild(el);
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function applyReducedMotion() {
  document.body.classList.toggle('reduce-motion', reducedMotion.matches);
  if (reducedMotion.matches) {
    io.disconnect();
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
    p.replaceChildren();
  } else document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));
}
reducedMotion.addEventListener?.('change', applyReducedMotion);
applyReducedMotion();
