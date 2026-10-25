// RSVP is bound to the platform adapter before this source script is enabled.
// The captured webhook and source-specific sample payload are not copied.

document.addEventListener("DOMContentLoaded", function () {
  // Set --vh for mobile
  const setVh = function () {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`,
    );
  };
  window.addEventListener("resize", setVh);
  setVh();
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const shouldReduceMotion = () =>
    motionPreference.matches || !!window.velvetReducedMotion;
  const syncVideoMotion = () => {
    document.querySelectorAll("video[autoplay]").forEach((video) => {
      if (shouldReduceMotion()) video.pause();
      else video.play().catch(() => {});
    });
  };
  syncVideoMotion();
  motionPreference.addEventListener?.("change", syncVideoMotion);
  document.addEventListener("velvet:motion", syncVideoMotion);

  // Slider unlock logic
  const sliderHandle = document.querySelector(".slider-handle");
  const sliderContainer = document.querySelector(".slider-container");
  const loadingScreen = document.getElementById("loading-screen");
  const sliderContent = document.querySelector(".slider-content");

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let maxOffset =
    (sliderContainer.offsetWidth - sliderHandle.offsetWidth) * 0.99;

  function startDrag(event) {
    if (event.cancelable) event.preventDefault();
    isDragging = true;
    const clientX =
      event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
    startX = clientX - sliderHandle.offsetLeft;
    sliderHandle.style.transition = "none";
  }
  function drag(event) {
    if (!isDragging) return;
    if (event.cancelable) event.preventDefault();
    const clientX =
      event.type === "touchmove" ? event.touches[0].clientX : event.clientX;
    currentX = clientX - startX;
    currentX = Math.max(0, Math.min(currentX, maxOffset));
    sliderHandle.style.left = currentX + "px";
  }
  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    if (currentX >= maxOffset) {
      unlockPage();
    } else {
      sliderHandle.style.transition = "left 0.4s ease-out";
      sliderHandle.style.left = "0px";
    }
  }
  function unlockPage() {
    loadingScreen.classList.add("unlocked");
    sliderContent.classList.add("unlocked");
    startAudioPlayback();
    setTimeout(function () {
      loadingScreen.remove();
    }, shouldReduceMotion() ? 0 : 1200);
  }
  sliderHandle.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);
  sliderHandle.addEventListener("touchstart", startDrag, {
    passive: false,
  });
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("touchend", endDrag);
  window.addEventListener("resize", function () {
    maxOffset = (sliderContainer.offsetWidth - sliderHandle.offsetWidth) * 0.99;
  });

  // Audio & mute button
  const audio = document.getElementById("background-music");
  const muteBtn = document.querySelector(".mute-button");
  const muteIcon = document.querySelector(".mute-icon");
  let audioStarted = false;
  async function startAudioPlayback() {
    if (audioStarted || !audio?.getAttribute("src")) return;
    try {
      await audio.play();
      audioStarted = true;
      muteBtn.style.display = "flex";
    } catch (error) {
      // Autoplay failed: wait for user interaction
      let fallbackListener = function () {
        audio.play();
        muteBtn.style.display = "flex";
        document.body.removeEventListener("click", fallbackListener);
        document.body.removeEventListener("touchstart", fallbackListener);
      };
      document.body.addEventListener("click", fallbackListener);
      document.body.addEventListener("touchstart", fallbackListener);
    }
  }
  muteBtn.addEventListener("click", function () {
    audio.muted = !audio.muted;
    muteIcon.textContent = audio.muted ? "♪̸" : "♪";
  });
});

const calendar = document.querySelector(".calendar");
const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
function renderCalendar(month, year) {
  const locale = window.velvetLocale || "ru";
  document.querySelector(".calendar-title").textContent =
    new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
      new Date(year, month, 1),
    );
  calendar.querySelectorAll(".calendar-date").forEach((e) => e.remove());
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < startOffset; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-date";
    calendar.appendChild(emptyCell);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.className = "calendar-date";
    cell.textContent = d;
    // Добавим специальную ячейку для сердца, если нужно (например, для 24)
    // if (d === 24) cell.classList.add('heart-day');
    calendar.appendChild(cell);
  }
}
window.renderVelvetCalendar = (month, year, day) => {
  renderCalendar(month, year);
  if (day) placeHeart(day);
};
const initialCalendar = window.velvetDate || { month: 9, year: 2026, day: 0 };
renderCalendar(initialCalendar.month, initialCalendar.year);

// --- Сердце в календаре ---
let heartEl = document.createElement("div");
heartEl.className = "heart";
heartEl.textContent = "❤";

function placeHeart(day) {
  // Удаляем сердце, если оно уже где-то есть
  const dates = calendar.querySelectorAll(".calendar-date");
  dates.forEach((d) => {
    if (d.contains(heartEl)) d.removeChild(heartEl);
    d.classList.remove("heart-day");
  });
  // Ищем ячейку с нужным числом и вставляем туда сердце
  dates.forEach((d) => {
    // Сравниваем только число, игнорируя пробелы и другие символы
    if (d.textContent.trim() == day) {
      d.appendChild(heartEl);
      d.classList.add("heart-day");
    }
  });
}
// The event date, when present, is the source calendar highlight.
if (initialCalendar.day) placeHeart(initialCalendar.day);
document.addEventListener("velvet:date", () => {
  window.velvetDate &&
    window.renderVelvetCalendar(
      window.velvetDate.month,
      window.velvetDate.year,
      window.velvetDate.day,
    );
});
document.addEventListener("keydown", (event) => {
  if (
    event.key !== "Enter" ||
    event.target.closest("input, textarea, select, button, a")
  )
    return;
  const promptText = window.velvetUi?.calendarPrompt ||
    "Choose a day of the month for the heart:";
  const day = Number(window.prompt(promptText));
  const month = window.velvetDate?.month;
  const year = window.velvetDate?.year;
  if (
    Number.isInteger(day) &&
    day >= 1 &&
    day <= new Date(year, month + 1, 0).getDate()
  )
    placeHeart(day);
});

document.addEventListener("DOMContentLoaded", function () {
  const programSection = document.querySelector(".program-section");
  const items = programSection.querySelectorAll(".program-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          items[0].classList.add(
            "animate__animated",
            "animate__fadeInLeft",
            "animate__slow",
          );
          items[1].classList.add(
            "animate__animated",
            "animate__fadeInRight",
            "animate__slow",
          );
          items[2].classList.add(
            "animate__animated",
            "animate__fadeInLeft",
            "animate__slow",
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(programSection);
});
