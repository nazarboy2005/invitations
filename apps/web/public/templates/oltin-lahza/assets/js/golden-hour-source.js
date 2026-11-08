/* Template behavior adapted from the captured assets/js/golden-hour.js.
 * Data binding and RSVP service calls remain in golden-hour-adapter.js.
 */
(() => {
  let targetDate = null;
  let countdownTimer = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();
    let diff = targetDate ? targetDate - now : 0;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById("cd-days").textContent = pad(days);
    document.getElementById("cd-hours").textContent = pad(hours);
    document.getElementById("cd-mins").textContent = pad(mins);
    document.getElementById("cd-secs").textContent = pad(secs);
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-scale");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Background music ---------- */
  const music = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  let musicStarted = false;
  function syncMusicToggle() {
    const playing = !music.paused;
    musicToggle.classList.toggle("playing", playing);
    musicToggle.setAttribute("aria-pressed", String(playing));
  }
  ["play", "pause", "ended", "error"].forEach(event => music.addEventListener(event, syncMusicToggle));

  function playMusic() {
    music
      .play()
      .then(() => {
        musicStarted = true;
        musicToggle.classList.add("playing");
      })
      .catch(() => {
        musicToggle.classList.remove("playing");
      });
  }

  // The reference's autoplay and first-click-anywhere handlers are omitted:
  // music is optional creator content and begins only on the music control.
  musicToggle.addEventListener("click", () => {
    if (!music.hasAttribute("src")) return;
    if (music.paused) {
      playMusic();
    } else {
      music.pause();
      syncMusicToggle();
      musicStarted = false;
    }
  });

  window.GoldenHourSource = {
    initialize(dateTime, musicUrl) {
      const parsedDate = dateTime ? new Date(dateTime) : null;
      targetDate = parsedDate && Number.isFinite(parsedDate.getTime()) ? parsedDate : null;
      const countdown = document.querySelector(".countdown-section");
      countdown.hidden = !targetDate || !Number.isFinite(targetDate.getTime());
      if (countdownTimer) window.clearInterval(countdownTimer);
      updateCountdown();
      countdownTimer = window.setInterval(updateCountdown, 1000);

      if (musicUrl) {
        music.src = musicUrl;
      } else {
        music.pause();
        music.removeAttribute("src");
        syncMusicToggle();
      }
      musicToggle.hidden = !musicUrl;
    },
  };
})();
