(function () {
  const form = document.getElementById("rsvp-form");
  const container = document.getElementById("rsvp-container");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    container.innerHTML =
      '<p style="text-align:center; font-size:20px; color:#4B4B4B;">Ваши ответы отправлены</p>';

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    });

    data["telegram_id"] = "818996511";

    fetch("https://n8n.tim-0fficial.ru/webhook/taplinkzayavka", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Webhook error:", error));
  });
})();

// Countdown Timer
function pad(num) {
  return num.toString().padStart(2, "0");
}
function updateCountdown() {
  const now = new Date();
  const target = new Date("2026-10-20T18:00:00+05:00");
  let diff = target - now;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  if (document.getElementById("days"))
    document.getElementById("days").textContent = pad(days);
  if (document.getElementById("hours"))
    document.getElementById("hours").textContent = pad(hours);
  if (document.getElementById("minutes"))
    document.getElementById("minutes").textContent = pad(minutes);
  if (document.getElementById("seconds"))
    document.getElementById("seconds").textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

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
    }, 1200);
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
    if (audioStarted) return;
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
    muteIcon.src = audio.muted
      ? "https://img.icons8.com/?size=100&id=7913&format=png&color=FFFFFF"
      : "https://img.icons8.com/?size=100&id=vI9d0s6ZRxxX&format=png&color=FFFFFF";
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
  document.querySelector(".calendar-title").textContent =
    `${monthNames[month]} ${year}`;
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
renderCalendar(9, 2026);

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
// По умолчанию ставим на 24
placeHeart(28);

// Обработчик нажатия Enter: спрашиваем число и перемещаем сердце
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const newDay = prompt("Введите число месяца, куда поставить сердце:");
    if (newDay) placeHeart(parseInt(newDay));
  }
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
