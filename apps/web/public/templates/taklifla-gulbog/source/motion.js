window.startGardenSource = function () {
// ── COUNTDOWN ──
const WEDDING_DATE = window.__gardenEventDate || new Date(NaN);
function updateCountdown() {
  const diff = (window.__gardenEventDate || WEDDING_DATE) - new Date();
  if (!Number.isFinite(diff) || diff <= 0) { ['cdDays','cdHours','cdMins','cdSecs'].forEach(id => document.getElementById(id).textContent = '00'); return; }
  const d = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5), m = Math.floor((diff % 36e5) / 6e4), s = Math.floor((diff % 6e4) / 1e3);
  document.getElementById('cdDays').textContent = String(d).padStart(2,'0');
  document.getElementById('cdHours').textContent = String(h).padStart(2,'0');
  document.getElementById('cdMins').textContent = String(m).padStart(2,'0');
  document.getElementById('cdSecs').textContent = String(s).padStart(2,'0');
}
updateCountdown(); window.__gardenCountdown = setInterval(updateCountdown, 1000);

// ── SCROLL REVEAL ──
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ── PETALS ──
(function createPetals() {
  if (window.__gardenReducedMotion) return;
  const c = document.getElementById('petals');
  const cols = ['rgba(212,160,160,.5)','rgba(232,200,200,.4)','rgba(184,155,94,.3)','rgba(107,143,94,.35)','rgba(255,240,240,.5)','rgba(200,220,190,.4)'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div'); p.className = 'petal';
    const sz = 4 + Math.random() * 8;
    p.style.cssText = `width:${sz}px;height:${sz*1.3}px;left:${Math.random()*100}%;background:${cols[Math.floor(Math.random()*cols.length)]};animation-delay:${Math.random()*15}s;animation-duration:${10+Math.random()*12}s;`;
    c.appendChild(p);
  }
})();

// ── SPLASH ──
// Idempotent. The splash <div> AND the <button> inside it both route
// click events that bubble up to onclick="openInvitation()"; a fast
// double-tap (especially on mobile) used to call this twice and issue
// two overlapping play() requests — the audible "double play".
var __invOpened = false;
function openInvitation() {
  if (__invOpened) return;
  __invOpened = true;
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('mainContent').classList.add('visible');
  document.getElementById('petals').classList.add('visible');
  document.getElementById('musicCluster').classList.add('visible');
  window.gardenMusicOpen?.();
  setTimeout(() => document.querySelectorAll('.reveal:not(.visible)').forEach(el => ro.observe(el)), 300);
}

// ── MUSIC ──
// Use the audio element's own `paused` flag as the source of truth.
// The previous `mp` boolean drifted out of sync whenever openInvitation
// kicked off playback (it didn't set mp=true), which made the first
// pause tap silently re-trigger play() — perceived as duplicate audio
// when combined with the iframe-remount edge case in the editor preview.
function toggleMusic() {
  const a = document.getElementById('bgMusic'), b = document.getElementById('musicBtn');
  if (!a) return;
  if (a.paused) { a.play().catch(()=>{}); b.classList.add('playing'); }
  else { a.pause(); b.classList.remove('playing'); }
}
// Recipient-facing "remove the music button" affordance — the small ×
// on the cluster pauses playback and hides the whole control so the
// invitation card sits clean. stopPropagation prevents the dismiss tap
// from also toggling play on the underlying music button.
function dismissMusic(ev) {
  if (ev && ev.stopPropagation) ev.stopPropagation();
  var a = document.getElementById('bgMusic');
  if (a) { try { a.pause(); } catch (e) {} }
  var c = document.getElementById('musicCluster');
  if (c) c.classList.add('dismissed');
}
// Editor preview swaps the iframe whenever URL params change. Without
// this, the outgoing iframe's audio keeps playing for a beat while the
// new one starts, producing audible overlap.
window.addEventListener('pagehide', function () {
  var a = document.getElementById('bgMusic');
  if (a && !a.paused) a.pause();
});
// bfcache restore: mobile Safari/Chrome can resume the previous audio
// playback when the user navigates back to the page, on top of which
// openInvitation issues a fresh play() — two overlapping streams. Force
// a hard reset so the page always starts silent until the splash tap.
window.addEventListener('pageshow', function (e) {
  if (!e.persisted) return;
  __invOpened = false;
  var a = document.getElementById('bgMusic');
  if (a) { try { a.pause(); a.currentTime = 0; } catch (err) {} }
  var b = document.getElementById('musicBtn');
  if (b) b.classList.remove('playing');
});


window.openInvitation = openInvitation;
window.toggleMusic = toggleMusic;
window.dismissMusic = dismissMusic;
window.gardenReveal = () => document.querySelectorAll(".reveal").forEach(el => window.__gardenReducedMotion ? el.classList.add("visible") : ro.observe(el));

};
