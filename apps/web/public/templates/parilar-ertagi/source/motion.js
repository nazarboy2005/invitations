const splash = document.getElementById('splash');
document.getElementById('splash-open').addEventListener('click', () => {
  splash.classList.add('dismissed');
  setTimeout(() => { splash.style.display = 'none'; }, 1400);
});

/* ============================================================
   REVEAL on scroll
   ============================================================ */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* ============================================================
   PARALLAX — hero tunnel layers + scroll floaters
   ============================================================ */
const hero = document.getElementById('hero');
const heroParallax = Array.from(document.querySelectorAll('[data-parallax]'));

let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(applyParallax);
    ticking = true;
  }
}
function applyParallax() {
  const y = window.scrollY;
  const heroH = hero.offsetHeight;

  // Hero tunnel — layers move at different speeds, deeper ones move less
  if (y < heroH * 1.2) {
    heroParallax.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const baseScale = parseFloat(el.dataset.scale) || 1;
      const baseY = parseFloat(el.dataset.y) || 0; // percent
      const offset = y * speed * 0.35;
      // Foreground layers also slightly scale outward as you scroll
      const scrollScale = speed > 0.7 ? 1 + (y / heroH) * 0.08 : 1;
      const scale = baseScale * scrollScale;
      el.style.transform = `translate3d(0, calc(${baseY}% + ${-offset}px), 0) scale(${scale})`;
    });
  }

  ticking = false;
}
window.addEventListener('scroll', onScroll, { passive: true });
applyParallax();

/* ============================================================
   PETAL particles
   ============================================================ */
const petalColors = ['#d4a59a', '#e8c995', '#b8a4c9', '#f8ecd9'];
function spawnPetal() {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.left = Math.random() * 100 + 'vw';
  p.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
  const size = 5 + Math.random() * 7;
  p.style.width = size + 'px';
  p.style.height = size + 'px';
  p.style.animationDuration = (10 + Math.random() * 10) + 's';
  p.style.animationDelay = (Math.random() * 2) + 's';
  p.style.opacity = .35 + Math.random() * .35;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 22000);
}
let petalsOn = true;
function petalLoop() {
  if (petalsOn) spawnPetal();
  setTimeout(petalLoop, 1400);
}
// Wait until splash is gone
setTimeout(petalLoop, 4000);

