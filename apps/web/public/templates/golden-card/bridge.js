(() => {
  "use strict";

  const templateId = "golden-card";
  const copy = {
    "uz-Latn": {
      greeting: "Assalomu alaykum, aziz mehmon",
      open: "Ochish uchun bosing",
      map: "Xaritada ko\u02bbrish",
      musicOn: "Musiqani o\u02bbchirish",
      musicOff: "Musiqani yoqish",
      lang: "Tilni tanlash",
    },
    "uz-Cyrl": {
      greeting: "\u0410\u0441\u0441\u0430\u043b\u043e\u043c\u0443 \u0430\u043b\u0430\u0439\u043a\u0443\u043c, \u0430\u0437\u0438\u0437 \u043c\u0435\u04b3\u043c\u043e\u043d",
      open: "\u041e\u0447\u0438\u0448 \u0443\u0447\u0443\u043d \u0431\u043e\u0441\u0438\u043d\u0433",
      map: "\u04b2\u0430\u0440\u0438\u0442\u0430\u0434\u0430 \u043a\u045e\u0440\u0438\u0448",
      musicOn: "\u041c\u0443\u0441\u0438\u049b\u0430\u043d\u0438 \u045e\u0447\u0438\u0440\u0438\u0448",
      musicOff: "\u041c\u0443\u0441\u0438\u049b\u0430\u043d\u0438 \u0451\u049b\u0438\u0448",
      lang: "\u0422\u0438\u043b\u043d\u0438 \u0442\u0430\u043d\u043b\u0430\u0448",
    },
    en: {
      greeting: "Welcome, dear guest",
      open: "Tap to open",
      map: "View on map",
      musicOn: "Turn music off",
      musicOff: "Turn music on",
      lang: "Choose language",
    },
    ru: {
      greeting: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0434\u043e\u0440\u043e\u0433\u043e\u0439 \u0433\u043e\u0441\u0442\u044c",
      open: "\u041d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c",
      map: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u043d\u0430 \u043a\u0430\u0440\u0442\u0435",
      musicOn: "\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043c\u0443\u0437\u044b\u043a\u0443",
      musicOff: "\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043c\u0443\u0437\u044b\u043a\u0443",
      lang: "\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u044f\u0437\u044b\u043a",
    },
  };
  const localeNames = {
    "uz-Latn": "Uz",
    "uz-Cyrl": "\u040e\u0437",
    en: "En",
    ru: "Ru",
  };
  const root = document.querySelector(".golden-card-template");
  if (!root) return;
  const card = root.querySelector(".golden-card");
  const audio = root.querySelector("[data-golden-audio]");
  const musicButton = root.querySelector('[aria-label="Toggle music"]');
  let currentLocale = "uz-Latn";
  let musicEnabled = false;

  const text = (selector, value) => {
    const node = root.querySelector(selector);
    if (node) node.textContent = value ?? "";
    return node;
  };

  function update(payload) {
    const data = payload?.data ?? {};
    currentLocale = payload?.locale ?? currentLocale;
    const words = copy[currentLocale] ?? copy["uz-Latn"];
    root.lang = currentLocale;
    document.documentElement.lang = currentLocale;
    root.querySelectorAll("[data-locale]").forEach((button) => {
      const active = button.dataset.locale === currentLocale;
      button.setAttribute("aria-pressed", String(active));
      button.textContent = localeNames[button.dataset.locale] ?? button.textContent;
    });
    root.querySelector(".golden-locale")?.setAttribute("aria-label", words.lang);
    root.querySelector(".golden-cover")?.setAttribute("aria-label", words.open);
    const content = root.querySelector(".golden-container");
    content?.setAttribute("aria-hidden", String(!card.classList.contains("is-open")));
    card.setAttribute("aria-label", data.title || words.open);

    text('[data-golden="openingGreeting"]', data.greeting || words.greeting);
    text('[data-golden="title"]', data.title || "");
    text('[data-golden="open"]', words.open);
    text('[data-golden="groom"]', data.groom || "");
    text('[data-golden="bride"]', data.bride || "");
    text('[data-golden="message"]', data.message || "");

    const dateText = data.date?.long
      ? `${data.date.long}${data.date.time ? `, ${data.date.time}` : ""}`
      : "";
    const date = text('[data-golden="dateTime"]', dateText);
    if (date) date.closest("p").hidden = !dateText;

    const venueName = data.venue?.name ?? "";
    const venue = text('[data-golden="venue"]', venueName);
    if (venue) venue.hidden = !venueName;
    const addressText = data.venue?.address ?? "";
    const address = text('[data-golden="address"]', addressText);
    if (address) address.hidden = !addressText;

    const message = root.querySelector('[data-golden="message"]');
    if (message) message.closest("p").hidden = !data.message;

    const map = root.querySelector("[data-golden-map]");
    const mapUrl = data.venue?.mapUrl ?? "";
    if (map) {
      map.href = mapUrl || "#";
      map.hidden = !mapUrl;
      map.textContent = words.map;
      map.rel = "noopener noreferrer";
      map.target = "_blank";
    }

    const music = data.music ?? {};
    audio.src = music.url || "";
    musicEnabled = Boolean(music.enabled && music.url);
    audio.loop = true;
    if (!musicEnabled) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (payload?.reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("golden-reduced-motion");
    } else {
      root.classList.remove("golden-reduced-motion");
    }
    syncMusicLabel();
  }

  function syncMusicLabel() {
    if (!musicButton) return;
    const words = copy[currentLocale] ?? copy["uz-Latn"];
    musicButton.setAttribute("aria-label", musicEnabled ? words.musicOn : words.musicOff);
    musicButton.setAttribute("aria-pressed", String(musicEnabled));
  }

  function animateStars() {
    if (root.classList.contains("golden-reduced-motion")) return;
    root.querySelectorAll(".golden-sparkle-star").forEach((star, index) => {
      star.animate(
        [
          { opacity: 0, transform: "scale(.3) rotate(-25deg)" },
          { opacity: 0.8, transform: "scale(1) rotate(0deg)", offset: 0.3 },
          { opacity: 0.25, transform: "scale(.72) rotate(18deg)" },
        ],
        { duration: 2200 + (index % 5) * 240, delay: index * 55, iterations: Infinity, direction: "alternate", easing: "ease-in-out" },
      );
    });
  }

  async function tryPlay() {
    if (!musicEnabled || !audio.src) return;
    try { await audio.play(); } catch { /* The visitor may keep music paused. */ }
  }

  root.addEventListener("click", (event) => {
    const languageButton = event.target.closest("[data-locale]");
    if (languageButton) {
      event.preventDefault();
      window.parent.postMessage({ type: `${templateId}:language`, locale: languageButton.dataset.locale }, window.location.origin);
      return;
    }
    if (event.target.closest("[data-golden-map]")) return;
    if (event.target.closest("[aria-label]") === musicButton) {
      event.preventDefault();
      musicEnabled = !musicEnabled;
      if (musicEnabled) void tryPlay(); else { audio.pause(); audio.currentTime = 0; }
      syncMusicLabel();
      return;
    }
    if (event.target.closest(".golden-cover")) {
      card.classList.add("is-open");
      root.querySelector(".golden-container")?.setAttribute("aria-hidden", "false");
      animateStars();
      void tryPlay();
    }
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== `${templateId}:update`) return;
    update(event.data.payload);
  });

  try {
    const initial = JSON.parse(window.name);
    if (initial?.type === `${templateId}:update`) update(initial.payload);
  } catch { /* The host sends the invitation after the frame loads. */ }
})();

