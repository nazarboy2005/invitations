const preloader = document.getElementById("preloader");
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let musicStarted = false;

function syncMusicToggle() {
  const playing = !music.paused;
  musicToggle.classList.toggle("playing", playing);
  musicToggle.setAttribute("aria-pressed", String(playing));
}

["play", "pause", "ended", "error"].forEach(event => music.addEventListener(event, syncMusicToggle));

function tryPlayMusic() {
  music
    .play()
    .then(() => {
      musicStarted = true;
      musicToggle.classList.add("playing");
    })
    .catch(() => {
      document.addEventListener(
        "click",
        function onFirstClick() {
          music
            .play()
            .then(() => {
              musicStarted = true;
              musicToggle.classList.add("playing");
            })
            .catch(() => {});
          document.removeEventListener("click", onFirstClick);
        },
        { once: true },
      );
    });
}

window.addEventListener("load", () => {
  if (window.__FAIRY_PLATFORM_PREVIEW || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    preloader.classList.add("hide");
    document.querySelectorAll(".hero .reveal, .hero .reveal-scale").forEach((el) => el.classList.add("is-visible"));
    return;
  }
  setTimeout(() => {
    preloader.classList.add("hide");
    documen
      .querySelectorAll(".hero .reveal, .hero .reveal-scale")
      .forEach((el) => {
        el.classList.add("is-visible");
      });
  }, 1000);
});

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    tryPlayMusic();
  } else {
    music.pause();
    syncMusicToggle();
  }
});

/* ---------- Scroll reveal animations (hero handled separately, above) ---------- */
const revealEls = Array.from(
  document.querySelectorAll(".reveal, .reveal-scale"),
).filter((el) => !el.closest(".hero"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
revealEls.forEach((el) => revealObserver.observe(el));
