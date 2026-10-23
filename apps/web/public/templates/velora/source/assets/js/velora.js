document.addEventListener("DOMContentLoaded", function () {
  // ---------- AOS animations ----------
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 1000,
    });
  }
  // ---------- Музыка (play/pause) ----------
  // ---------- Музыка (play/pause) ----------
  var audio = document.getElementById("backgroundAudio");
  var playButton = document.getElementById("playButton");
  var rotatingText = document.getElementById("rotatingText");

  if (playButton && audio) {
    playButton.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().catch(function () {});
        playButton.src = playButton.getAttribute("data-off-icon");
        if (rotatingText) rotatingText.classList.remove("is-paused");
      } else {
        audio.pause();
        playButton.src = playButton.getAttribute("data-on-icon");
        if (rotatingText) rotatingText.classList.add("is-paused");
      }
    });
  }

  // ---------- Avtomatik ishga tushirish (sahifa ochilishi bilan) ----------
  var musicStarted = false;

  function markMusicStarted() {
    musicStarted = true;
    if (playButton) playButton.src = playButton.getAttribute("data-off-icon");
    if (rotatingText) rotatingText.classList.remove("is-paused");
  }

  function startMusicOnce() {
    if (musicStarted || !audio) return;
    audio
      .play()
      .then(function () {
        markMusicStarted();
        document.removeEventListener("click", startMusicOnce);
        document.removeEventListener("touchstart", startMusicOnce);
        document.removeEventListener("scroll", startMusicOnce);
      })
      .catch(function () {
        // Brauzer hali ham bloklagan bo'lsa, keyingi interaksiyada urinib ko'ramiz
      });
  }

  // Darhol urinib ko'ramiz (ba'zi brauzerlarda ishlashi mumkin)
  startMusicOnce();

  // Agar bloklangan bo'lsa — birinchi interaksiyada ishga tushadi
  document.addEventListener("click", startMusicOnce);
  document.addEventListener("touchstart", startMusicOnce);
  document.addEventListener("scroll", startMusicOnce, { passive: true });
  // ---------- Слайдер дресс-кода (drag на компьютере) ----------
  document.querySelectorAll(".dresscode-foto").forEach(function (slider) {
    var isDown = false,
      startX,
      scrollLeft;
    slider.addEventListener("mousedown", function (e) {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", function () {
      isDown = false;
    });
    slider.addEventListener("mouseup", function () {
      isDown = false;
    });
    slider.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - slider.offsetLeft;
      var walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  });
  // ---------- Обратный отсчёт до свадьбы ----------
  var dayEl = document.getElementById("wedding_day");
  var timeEl = document.getElementById("wedding_time");
  var tzEl = document.getElementById("timezone_offset");

  function startCountdown() {
    if (!dayEl || !timeEl) return;
    var dateStr = dayEl.textContent.trim(); // "2028-09-03"
    var timeStr = timeEl.textContent.trim(); // "14:00"
    var tzOffsetMinutes = tzEl ? parseInt(tzEl.textContent.trim(), 10) : 0; // minutes east of UTC
    var parts = dateStr.split("-").map(Number);
    var timeParts = timeStr.split(":").map(Number);
    // Строим UTC-время момента свадьбы с учётом смещения таймзоны
    var targetUTC =
      Date.UTC(
        parts[0],
        parts[1] - 1,
        parts[2],
        timeParts[0],
        timeParts[1],
        0,
      ) -
      tzOffsetMinutes * 60 * 1000;
    var daysSpan = document.querySelector(".days");
    var hoursSpan = document.querySelector(".hours");
    var minutesSpan = document.querySelector(".minutes");
    var secondsSpan = document.querySelector(".seconds");

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      var now = Date.now();
      var diff = targetUTC - now;
      if (diff <= 0) {
        if (daysSpan) daysSpan.textContent = "00";
        if (hoursSpan) hoursSpan.textContent = "00";
        if (minutesSpan) minutesSpan.textContent = "00";
        if (secondsSpan) secondsSpan.textContent = "00";
        clearInterval(timer);
        return;
      }
      var totalSeconds = Math.floor(diff / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;
      if (daysSpan) daysSpan.textContent = days;
      if (hoursSpan) hoursSpan.textContent = pad(hours);
      if (minutesSpan) minutesSpan.textContent = pad(minutes);
      if (secondsSpan) secondsSpan.textContent = pad(seconds);
    }
    tick();
    var timer = setInterval(tick, 1000);
  }
  startCountdown();
  // ---------- Анкета для гостей ----------
  var questionForm = document.getElementById("question");
  var questionSubmit = document.getElementById("question-submit");
  var answGood = document.getElementById("answ_good");
  var answNull = document.getElementById("answ_null");
  questionSubmit.addEventListener("click", function () {
    var who = document.getElementById("who").value.trim();
    var comingChosen = questionForm.querySelector(
      'input[name="coming"]:checked',
    );
    var alcohol = document.getElementById("alcohol").value.trim();

    if (!who || !comingChosen) {
      if (answNull) answNull.style.display = "block";
      if (answGood) answGood.style.display = "none";
      return;
    }
    if (answNull) answNull.style.display = "none";
    if (answGood) answGood.style.display = "block";

    // ---- Telegram kanalga yuborish ----
    fetch("./bexruz0510.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: who,
        coming: comingChosen.value === "Да",
        wishes: alcohol,
      }),
    }).catch(function (err) {
      console.error("Telegramga yuborishda xatolik:", err);
    });

    questionForm.reset();
    openRsvpPopup();
  });
});
// ---------- RSVP (доступность вне DOMContentLoaded, т.к. вызывается из onclick) ----------
function submityes() {
  handleRsvp(true);
}

function submitno() {
  handleRsvp(false);
}

function scrollSlider(sliderId, direction) {
  var slider = document.getElementById(sliderId);
  if (!slider) return;
  var scrollAmount = slider.clientWidth * 0.75;
  slider.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

function handleRsvp(isComing) {
  var name = document.getElementById("rsvp-name");
  var quantity = document.getElementById("quantity");
  var errors = document.getElementById("rsvp_errors");
  var nullError = document.getElementById("rsvp_null");
  var container = document.getElementById("rsvp_container");
  var answYes = document.getElementById("rsvp-answ-yes");
  var answNo = document.getElementById("rsvp-answ-no");
  errors.style.display = "none";
  nullError.style.display = "none";
  var nameVal = name.value.trim();
  var qtyVal = quantity.value.trim();
  if (!nameVal || qtyVal === "") {
    nullError.style.display = "block";
    return;
  }
  var qtyNum = Number(qtyVal);
  if (!Number.isInteger(qtyNum) || qtyNum < 0 || qtyNum > 10) {
    errors.style.display = "block";
    return;
  }

  // ---- Telegram kanalga yuborish ----
  fetch("./bexruz0510.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameVal,
      quantity: qtyNum,
      coming: isComing,
    }),
  }).catch(function (err) {
    console.error("Telegramga yuborishda xatolik:", err);
  });

  container.style.display = "none";
  if (isComing) {
    answYes.style.display = "block";
    answNo.style.display = "none";
  } else {
    answNo.style.display = "block";
    answYes.style.display = "none";
  }

  openRsvpPopup();
}

function openRsvpPopup() {
  var overlay = document.getElementById("rsvp-popup-overlay");
  if (overlay) overlay.classList.add("is-open");
}

function closeRsvpPopup() {
  var overlay = document.getElementById("rsvp-popup-overlay");
  if (overlay) overlay.classList.remove("is-open");
}
