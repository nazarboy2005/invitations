(() => {
  let countdownTimer;
  const startCountdown = (dateTime, timezone) => {
    if (countdownTimer) clearInterval(countdownTimer);
    const daysSpan = document.querySelector(".days"), hoursSpan = document.querySelector(".hours");
    const minutesSpan = document.querySelector(".minutes"), secondsSpan = document.querySelector(".seconds");
    const target = dateTime ? new Date(dateTime).getTime() : NaN;
    if (![daysSpan, hoursSpan, minutesSpan, secondsSpan].every(Boolean) || !Number.isFinite(target)) return;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const seconds = Math.floor(diff / 1000);
      daysSpan.textContent = String(Math.floor(seconds / 86400));
      hoursSpan.textContent = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
      minutesSpan.textContent = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
      secondsSpan.textContent = String(seconds % 60).padStart(2, "0");
      if (!diff && countdownTimer) { clearInterval(countdownTimer); countdownTimer = undefined; }
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
  };

  window.scrollSlider = (sliderId, direction) => {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    slider.scrollBy({ left: direction * slider.clientWidth * 0.75, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  window.openRsvpPopup = () => document.getElementById("rsvp-popup-overlay")?.classList.add("is-open");
  window.closeRsvpPopup = () => document.getElementById("rsvp-popup-overlay")?.classList.remove("is-open");

  document.addEventListener("DOMContentLoaded", () => {
    if (window.AOS) window.AOS.init({ once: true, duration: 1000, disable: () => matchMedia("(prefers-reduced-motion: reduce)").matches });
    const audio = document.getElementById("backgroundAudio"), button = document.getElementById("playButton"), rotatingText = document.getElementById("rotatingText");
    const syncMusicIcon = () => {
      if (!button || !audio) return;
      button.src = audio.paused ? button.dataset.offIcon : button.dataset.onIcon;
      button.alt = audio.paused ? "Включить музыку" : "Выключить музыку";
    };
    audio?.addEventListener("play", syncMusicIcon);
    audio?.addEventListener("pause", syncMusicIcon);
    audio?.addEventListener("ended", syncMusicIcon);
    syncMusicIcon();
    if (button && audio) button.addEventListener("click", async () => {
      if (audio.paused) {
        try { await audio.play(); rotatingText?.classList.remove("is-paused"); }
        catch { audio.pause(); }
      } else { audio.pause(); rotatingText?.classList.add("is-paused"); }
    });
    document.querySelectorAll(".dresscode-foto").forEach((slider) => {
      let down = false, startX = 0, scrollLeft = 0;
      slider.addEventListener("pointerdown", (event) => { if (event.pointerType !== "mouse") return; down = true; startX = event.pageX; scrollLeft = slider.scrollLeft; slider.setPointerCapture(event.pointerId); });
      slider.addEventListener("pointerup", () => { down = false; });
      slider.addEventListener("pointercancel", () => { down = false; });
      slider.addEventListener("pointermove", (event) => { if (down) slider.scrollLeft = scrollLeft - (event.pageX - startX) * 2; });
    });
  });
  window.addEventListener("velora:applied", (event) => startCountdown(event.detail?.dateTime, event.detail?.timezone));
})();
