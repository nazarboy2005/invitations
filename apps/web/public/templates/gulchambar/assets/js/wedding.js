const cv = document.getElementById("particles"),
  cx = cv.getContext("2d");
function rsz() {
  cv.width = innerWidth;
  cv.height = innerHeight;
}
rsz();
addEventListener("resize", rsz);
class P {
  constructor() {
    this.r();
  }
  r() {
    this.x = Math.random() * cv.width;
    this.y = Math.random() * cv.height;
    this.s = Math.random() * 1.4 + 0.3;
    this.o = Math.random() * 0.5 + 0.1;
    this.vx = (Math.random() - 0.5) * 0.18;
    this.vy = -Math.random() * 0.28 - 0.08;
    this.l = 0;
    this.ml = Math.random() * 220 + 80;
  }
  u() {
    this.x += this.vx;
    this.y += this.vy;
    this.l++;
    if (this.l > this.ml || this.y < 0) this.r();
  }
  d() {
    cx.save();
    cx.globalAlpha = this.o * Math.sin((Math.PI * this.l) / this.ml);
    cx.fillStyle = "#c9a84c";
    cx.beginPath();
    cx.arc(this.x, this.y, this.s, 0, 6.28);
    cx.fill();
    cx.restore();
  }
}
const pts = Array.from({ length: 90 }, () => {
  const p = new P();
  p.l = Math.random() * p.ml;
  return p;
});
let reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
try { reducedMotion ||= Boolean(JSON.parse(window.name || "{}").reducedMotion); } catch {}
(function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  pts.forEach((p) => {
    p.u();
    p.d();
  });
  if (!reducedMotion) requestAnimationFrame(loop);
})();
const hv = document.getElementById("hero-video");
hv.addEventListener("loadeddata", () => hv.classList.add("loaded"));
hv.addEventListener("error", () => (hv.style.display = "none"));
let TARGET = 0;
window.setWeddingTarget = (value) => {
  const instant = value ? new Date(value).getTime() : NaN;
  if (Number.isFinite(instant)) TARGET = instant;
  tick();
};
function tick() {
  const now = Date.now(),
    d = TARGET - now;
  if (d <= 0) {
    document.getElementById("cd-days").textContent = "🎉";
    ["hours", "minutes", "seconds"].forEach(
      (k) => (document.getElementById("cd-" + k).textContent = "00"),
    );
    return;
  }
  const pad = (n) => String(Math.floor(n)).padStart(2, "0");
  const set = (id, v) => {
    const el = document.getElementById("cd-" + id);
    const nv = pad(v);
    if (el.textContent !== nv) {
      el.style.transform = "translateY(-6px)";
      el.style.opacity = "0.4";
      setTimeout(() => {
        el.textContent = nv;
        el.style.transform = "translateY(0)";
        el.style.opacity = "1";
      }, 140);
    }
  };
  set("days", d / 864e5);
  set("hours", (d % 864e5) / 36e5);
  set("minutes", (d % 36e5) / 6e4);
  set("seconds", (d % 6e4) / 1e3);
}
tick();
setInterval(tick, 1000);
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting)
        setTimeout(() => e.target.classList.add("vis"), i * 70);
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(
    ".cd-item,.invite-card,.prog-item,.swatch,.dc-note,.venue-card,.artist-card,.rsvp-wrap",
  )
  .forEach((el) => obs.observe(el));
function openLb(item) {
  document.getElementById("lb-img").src = item.querySelector("img").src;
  document.getElementById("lightbox").classList.add("active");
}
function closeLb() {
  document.getElementById("lightbox").classList.remove("active");
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLb();
});
let playing = false,
  pulse = false;
const aud = document.getElementById("bgAudio"),
  ico = document.getElementById("audioIcon");
function toggleAudio() {
  if (playing) {
    aud.pause();
    ico.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
    playing = false;
    document.getElementById("audioBtn").style.boxShadow = "none";
  } else {
    aud
      .play()
      .then(() => {
        ico.innerHTML =
          '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
        playing = true;
      })
      .catch(() => {});
  }
}
setInterval(() => {
  if (playing) {
    const btn = document.getElementById("audioBtn");
    pulse = !pulse;
    btn.style.boxShadow = pulse
      ? "0 0 18px rgba(201,168,76,0.5)"
      : "0 0 6px rgba(201,168,76,0.2)";
  }
}, 700);
