const targetDate = new Date("2026-10-05T18:00:00");

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  let diff = targetDate - now;

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

updateCountdown();
setInterval(updateCountdown, 1000);

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

function playMusic() {
  music
    .play()
    .then(() => {
      musicStarted = true;
      musicToggle.classList.add("playing");
    })
    .catch(() => {
      /* Autoplay blocked by the browser until the visitor interacts once */
    });
}

// Try to start the moment the invitation opens
window.addEventListener("load", playMusic);

// Browsers require a user gesture before audio can play with sound —
// this starts it on the very first tap/click anywhere if autoplay was blocked
document.addEventListener(
  "click",
  function firstInteraction() {
    if (!musicStarted) playMusic();
    document.removeEventListener("click", firstInteraction);
  },
  { once: true },
);

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
  }
});

/* ---------- RSVP form -> Telegram (via submit.php) ---------- */
const rsvpForm = document.querySelector(".rsvp-form");
rsvpForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const attending = rsvpForm.querySelector('input[name="attending"]:checked');
  const wishlist = document.getElementById("wishlist").value.trim();

  if (!fullname || !attending) {
    alert("Please fill in your name and let us know if you can make it.");
    return;
  }

  const submitBtn = rsvpForm.querySelector(".rsvp-submit");
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  fetch("./golden-hour.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullname: fullname,
      attending:
        attending.value === "yes" ? "Joyfully accepts" : "Regretfully declines",
      wishlist: wishlist || "—",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        document.getElementById("rsvpPopup").classList.add("is-open");
        rsvpForm.reset();
        submitBtn.textContent = "Send RSVP";
        submitBtn.disabled = false;
      } else {
        submitBtn.textContent = "Something went wrong";
        submitBtn.disabled = false;
      }
    })
    .catch(() => {
      submitBtn.textContent = "Something went wrong";
      submitBtn.disabled = false;
    });
});

document.getElementById("rsvpPopupClose")?.addEventListener("click", () => {
  document.getElementById("rsvpPopup").classList.remove("is-open");
});
