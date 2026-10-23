document.addEventListener("DOMContentLoaded", function () {
  /* ─── 1. SCROLL REVEAL ─── */
  const animatedElements = document.querySelectorAll(
    ".animate-up, .animate-fade, .animate-zoom",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  animatedElements.forEach((el) => observer.observe(el));

  /* ─── 2. ФОНОВАЯ МУЗЫКА ───
     Браузеры блокируют автозапуск звука без действия пользователя.
     Пытаемся включить сразу; если браузер не разрешит — запускаем
     музыку при первом клике/касании на странице. */
  const music = document.getElementById("bgMusic");
  const soundToggle = document.getElementById("soundToggle");
  const iconOn = document.getElementById("soundIconOn");
  const iconOff = document.getElementById("soundIconOff");
  let musicStarted = false;

  function updateSoundIcon(playing) {
    iconOn.style.display = playing ? "block" : "none";
    iconOff.style.display = playing ? "none" : "block";
  }

  function tryStartMusic() {
    if (!music || musicStarted) return;
    music
      .play()
      .then(() => {
        musicStarted = true;
        updateSoundIcon(true);
      })
      .catch(() => {
        updateSoundIcon(false);
      });
  }

  tryStartMusic();

  function startOnFirstInteraction() {
    if (!musicStarted) {
      tryStartMusic();
    }
    document.removeEventListener("click", startOnFirstInteraction);
    document.removeEventListener("touchstart", startOnFirstInteraction);
  }
  document.addEventListener("click", startOnFirstInteraction);
  document.addEventListener("touchstart", startOnFirstInteraction);

  if (soundToggle && music) {
    soundToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (music.paused) {
        music.play().then(() => {
          musicStarted = true;
          updateSoundIcon(true);
        });
      } else {
        music.pause();
        updateSoundIcon(false);
      }
    });
  }

  /* ─── 3. RSVP МОДАЛЬНОЕ ОКНО ─── */
  const openBtn = document.getElementById("openRsvpBtn");
  const closeBtn = document.getElementById("closeRsvpBtn");
  const overlay = document.getElementById("rsvpOverlay");
  const form = document.getElementById("rsvpForm");
  const errorEl = document.getElementById("rsvpError");
  const submitBtn = document.getElementById("rsvpSubmitBtn");
  const formView = document.getElementById("rsvpFormView");
  const successView = document.getElementById("rsvpSuccessView");

  function openModal() {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    // Сбрасываем форму к исходному виду через небольшую задержку,
    // чтобы не было заметно во время анимации закрытия
    setTimeout(() => {
      form.reset();
      errorEl.textContent = "";
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить";
      formView.classList.remove("hide");
      successView.classList.remove("show");
    }, 300);
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errorEl.textContent = "";

      const name = document.getElementById("rsvpName").value.trim();
      const attendInput = form.querySelector('input[name="attend"]:checked');
      const wishes = document.getElementById("rsvpWishes").value.trim();

      if (!name) {
        errorEl.textContent = "Пожалуйста, укажите ваше имя.";
        return;
      }
      if (!attendInput) {
        errorEl.textContent = "Пожалуйста, отметьте, придёте ли вы.";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Отправка...";

      const payload = new FormData();
      payload.append("name", name);
      payload.append("attend", attendInput.value);
      payload.append("wishes", wishes);

      fetch("./safir.php", {
        method: "POST",
        body: payload,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            formView.classList.add("hide");
            successView.classList.add("show");
            setTimeout(closeModal, 2200);
          } else {
            errorEl.textContent =
              (data && data.error) ||
              "Не удалось отправить. Попробуйте ещё раз.";
            submitBtn.disabled = false;
            submitBtn.textContent = "Отправить";
          }
        })
        .catch(() => {
          errorEl.textContent =
            "Ошибка соединения. Проверьте интернет и попробуйте снова.";
          submitBtn.disabled = false;
          submitBtn.textContent = "Отправить";
        });
    });
  }
});
