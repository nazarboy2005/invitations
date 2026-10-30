let invitationData = {};
const timeParts = { days: document.getElementById("days"), hours: document.getElementById("hours"), minutes: document.getElementById("minutes"), seconds: document.getElementById("seconds") };
const weddingAudio = document.getElementById("wedding-audio");

const musicControl = document.createElement("button");
musicControl.type = "button";
musicControl.className = "butterfly-music-control";
musicControl.hidden = true;
musicControl.textContent = "♪";
musicControl.setAttribute("aria-label", "Play or pause music");
document.body.append(musicControl);
const words = {
  "uz-Latn": { invite: "TAKLIFNOMA", gallery: "Xotiralar", galleryTitle: "Bizning lahzalar", invitation: "Taklif", dear: "Qadrli yaqinlarimiz", date: "Sana", time: "Vaqt", venue: "Joy", address: "Manzil", locationTitle: "Sizni tantanada kutamiz", locationText: "Quyidagi xarita orqali to\u0027g\u0027ridan-to\u0027g\u0027ri manzilni ko\u0027rishingiz mumkin.", map: "Xaritada ochish", close: "Yopish", days: "kun", hours: "soat", minutes: "daq", seconds: "son" },
  "uz-Cyrl": { invite: "ТАКЛИФНОМА", gallery: "Хотиралар", galleryTitle: "Бизнинг лаҳзалар", invitation: "Таклиф", dear: "Қадрли яқинларимиз", date: "Сана", time: "Вақт", venue: "Жой", address: "Манзил", locationTitle: "Сизни тантанада кутамиз", locationText: "Қуйидаги харита орқали тўғридан-тўғри манзилни кўришингиз мумкин.", map: "Харитада очиш", close: "Ёпиш", days: "кун", hours: "соат", minutes: "дақ", seconds: "сония" },
  en: { invite: "WEDDING INVITATION", gallery: "Memories", galleryTitle: "Our moments", invitation: "Invitation", dear: "Dear friends and family", date: "Date", time: "Time", venue: "Venue", address: "Address", locationTitle: "We look forward to celebrating with you", locationText: "Open the map below to find the venue.", map: "Open map", close: "Close", days: "days", hours: "hours", minutes: "min", seconds: "sec" },
  ru: { invite: "ПРИГЛАШЕНИЕ", gallery: "Воспоминания", galleryTitle: "Наши мгновения", invitation: "Приглашение", dear: "Дорогие родные и близкие", date: "Дата", time: "Время", venue: "Место", address: "Адрес", locationTitle: "Будем рады видеть вас на торжестве", locationText: "Откройте карту ниже, чтобы найти место проведения.", map: "Открыть карту", close: "Закрыть", days: "дней", hours: "часов", minutes: "мин", seconds: "сек" },
};
const labels = () => words[invitationData.locale] || words["uz-Latn"];
const sourceLanguage = (code) => ({ "uz-Latn": "uz", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" })[code] || code;
function bindInvitation(data) {
  invitationData = data || {};
  const t = labels(); const put = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value || ""; };
  document.documentElement.lang = invitationData.locale || "uz-Latn";
  document.title = [invitationData.groom, invitationData.bride].filter(Boolean).join(" & ") || "Invitation";
  put(".scene-tag", t.invite); put(".loading-gate-label", t.invite);
  const oldControl = document.getElementById("butterflyLanguages"); oldControl?.remove();
  const enabled = (invitationData.languages || []).filter((item) => sourceLanguage(item));
  if (enabled.length > 1 && !invitationData.catalogPreview) {
    const nav = document.createElement("nav"); nav.id = "butterflyLanguages"; nav.className = "butterfly-languages";
    const names = { uz: "Uz", "uz-Cyrl": "Уз", en: "En", ru: "Ru" };
    enabled.forEach((code) => { const source = sourceLanguage(code); const button = document.createElement("button"); button.type = "button"; button.textContent = names[source]; button.setAttribute("aria-current", source === invitationData.locale ? "true" : "false"); button.addEventListener("click", () => parent.postMessage({ type: "butterfly:language", locale: source }, location.origin)); nav.append(button); });
    document.body.append(nav);
  }
  put(".loading-gate-subtitle", [invitationData.groom, invitationData.bride].filter(Boolean).join(" & ") + (invitationData.date?.long ? " | " + invitationData.date.long : ""));
  put(".monogram span", (invitationData.groom || "").trim().charAt(0)); put(".monogram b", (invitationData.bride || "").trim().charAt(0));
  const names = document.querySelector(".invitation-core h1"); if (names) { names.replaceChildren(); names.append(document.createTextNode((invitationData.groom || "") + " ")); const join = document.createElement("span"); join.textContent = "&"; names.append(join, document.createTextNode(" " + (invitationData.bride || ""))); }
  put(".hero-date", [invitationData.date?.short, invitationData.date?.time].filter(Boolean).join(" | "));
  put(".invitation-core .hero-text", invitationData.message || "");
  put(".gallery-header .section-tag", t.gallery); put(".gallery-header h2", t.galleryTitle);
  const gallery = document.querySelector(".gallery-grid"); if (gallery) { gallery.replaceChildren(); (invitationData.gallery || []).filter(item => item.src).forEach(item => { const card=document.createElement("div"); card.className="gallery-card"; const image=document.createElement("img"); image.src=item.src; image.alt=item.alt || item.caption || ""; card.append(image); gallery.append(card); }); gallery.closest(".gallery-section").hidden = gallery.childElementCount === 0; }
  const statement = document.querySelector(".statement-panel"); if (statement) { put(".statement-panel .section-tag", t.invitation); put(".statement-panel h2", invitationData.greeting || t.dear); put(".statement-panel > p:last-child", [invitationData.message, invitationData.hosts].filter(Boolean).join(" ")); statement.hidden = !(invitationData.greeting || invitationData.message || invitationData.hosts); }
  const heroCopy = document.querySelector(".invitation-core .hero-text"); if (heroCopy) heroCopy.hidden = !invitationData.message;
  const details = document.querySelector(".details-panel"); if (details) { const fields=[[t.date, invitationData.date?.short],[t.time, invitationData.date?.time],[t.venue, invitationData.venue?.name],[t.address, invitationData.venue?.address]]; details.replaceChildren(...fields.filter(([,v])=>v).map(([label,value])=>{const row=document.createElement("div");row.className="detail-item";const title=document.createElement("span");title.className="detail-title";title.textContent=label;const strong=document.createElement("strong");strong.textContent=value;row.append(title,strong);return row;})); details.hidden = !details.childElementCount; }
  const location = document.querySelector(".location-section"); const map = document.querySelector(".map-embed"); const link = document.querySelector(".map-link"); const mapUrl=invitationData.venue?.mapUrl || (invitationData.venue?.lat != null ? `https://yandex.uz/maps/?text=${invitationData.venue.lat},${invitationData.venue.lng}` : ""); if (location) location.hidden=!(invitationData.venue?.name || invitationData.venue?.address || mapUrl); if(map){map.src=mapUrl || "about:blank";map.hidden=!mapUrl;} if(link){link.href=mapUrl || "#";link.hidden=!mapUrl;link.textContent=t.map;} put(".location-copy h2", t.locationTitle); put(".location-copy > p:last-child", t.locationText); put(".location-copy .section-tag", t.address);
  put(".footer p", invitationData.hosts || [invitationData.groom, invitationData.bride].filter(Boolean).join(" & "));
  const audio=document.getElementById("wedding-audio"); if(audio){const url=invitationData.silentPlayback ? "" : (typeof invitationData.music === "string" ? invitationData.music : invitationData.music?.url) || ""; if(url){audio.src=url;audio.load();}else{audio.removeAttribute("src");audio.load();} musicControl.hidden=!url; musicControl.textContent=audio.paused?"♪":"Ⅱ";}
  if (timeParts.days) {
    put(".countdown-item:nth-child(1) span", t.days);
    put(".countdown-item:nth-child(2) span", t.hours);
    put(".countdown-item:nth-child(3) span", t.minutes);
    put(".countdown-item:nth-child(4) span", t.seconds);
    const countdown = document.getElementById("countdown"); countdown.hidden = !invitationData.dateTime; if (countdown.hidden) ["days","hours","minutes","seconds"].forEach((key) => { if (timeParts[key]) timeParts[key].textContent = ""; });
  }
}
window.addEventListener("message", event => { if(event.origin===location.origin && event.source===parent && event.data?.type==="butterfly:update") bindInvitation(event.data.payload); });
const loadingGate = document.getElementById("loadingGate");
const loadingDoorRight = document.querySelector(".loading-door-right");
const butterflyLayer = document.getElementById("butterflyLayer");

const audioStartTimeInSeconds = 0;
const gateOpenDelayMs = 1500;
const gateFadeMs = 760;

let gateFinished = false;

musicControl.addEventListener("click", async () => {
  if (weddingAudio.paused) {
    invitationData.userStartedMusic = true;
    await tryPlayAudio();
    if (!weddingAudio.paused) musicControl.textContent = "Ⅱ";
  } else {
    weddingAudio.pause();
    if (fadeTimer) clearInterval(fadeTimer);
  }
});

function initGalleryLightbox() {
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  if (lightboxClose) lightboxClose.setAttribute("aria-label", labels().close);
  const gallery = document.querySelector(".gallery-grid");

  if (!lightbox || !lightboxImage || !lightboxClose || !gallery) {
    return;
  }

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  };

  gallery.addEventListener("click", (event) => {
    const image = event.target instanceof Element ? event.target.closest(".gallery-card img") : null;
    if (image) {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt || "Taklifnoma rasmi";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    }
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

function initScrollReveal() {
  const revealItems = document.querySelectorAll(".scroll-reveal");

  if (!revealItems.length) {
    return;
  }

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
    return;
  }

  const revealVisibleItems = (observer) => {
    revealItems.forEach((item) => {
      if (item.classList.contains("is-visible")) {
        return;
      }

      const itemBounds = item.getBoundingClientRect();
      const revealOffset = window.innerHeight * 0.92;

      if (itemBounds.top <= revealOffset) {
        item.classList.add("is-visible");

        if (observer) {
          observer.unobserve(item);
        }
      }
    });
  };

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });

      revealVisibleItems(observer);
    },
    {
      threshold: 0.06,
      rootMargin: "0px 0px -2% 0px",
    },
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });

  revealVisibleItems(revealObserver);

  window.addEventListener(
    "resize",
    () => {
      revealVisibleItems(revealObserver);
    },
    { passive: true },
  );
}

function createButterflies() {
  if (!butterflyLayer) {
    return;
  }

  const butterfliesCount = 10;

  for (let index = 0; index < butterfliesCount; index += 1) {
    const butterfly = document.createElement("span");
    butterfly.className = "butterfly";

    const size = 12 + Math.random() * 16;
    const duration = 10 + Math.random() * 10;
    const delay = -(Math.random() * duration);
    const startX = `${Math.random() * 100}vw`;
    const endX = `${Math.random() * 100}vw`;
    const driftX = `${(Math.random() * 16 - 8).toFixed(2)}vw`;
    const opacity = (0.45 + Math.random() * 0.45).toFixed(2);
    const scale = (0.8 + Math.random() * 0.7).toFixed(2);

    butterfly.style.setProperty("--size", `${size}px`);
    butterfly.style.setProperty("--duration", `${duration.toFixed(2)}s`);
    butterfly.style.setProperty("--delay", `${delay.toFixed(2)}s`);
    butterfly.style.setProperty("--start-x", startX);
    butterfly.style.setProperty("--end-x", endX);
    butterfly.style.setProperty("--drift-x", driftX);
    butterfly.style.setProperty("--opacity", opacity);
    butterfly.style.setProperty("--scale", scale);

    const body = document.createElement("i");
    butterfly.appendChild(body);
    butterflyLayer.appendChild(butterfly);
  }
}

function finishLoadingGate() {
  if (!loadingGate || gateFinished) {
    return;
  }

  gateFinished = true;
  loadingGate.classList.add("hidden");
  document.body.classList.add("gate-done");

  setTimeout(() => {
    loadingGate.style.display = "none";
  }, gateFadeMs + 120);
}

function formatTime(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  if (!invitationData.dateTime) {
    for (const item of Object.values(timeParts)) if (item) item.textContent = "";
    return;
  }
  const difference = invitationData.dateTime ? new Date(invitationData.dateTime).getTime() - Date.now() : 0;

  if (difference <= 0) {
    timeParts.days.textContent = "00";
    timeParts.hours.textContent = "00";
    timeParts.minutes.textContent = "00";
    timeParts.seconds.textContent = "00";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  timeParts.days.textContent = formatTime(days);
  timeParts.hours.textContent = formatTime(hours);
  timeParts.minutes.textContent = formatTime(minutes);
  timeParts.seconds.textContent = formatTime(seconds);
}

function setAudioStartTime() {
  if (
    Number.isFinite(weddingAudio.duration) &&
    weddingAudio.duration > audioStartTimeInSeconds
  ) {
    weddingAudio.currentTime = audioStartTimeInSeconds;
  }
}

let fadeTimer = null;
let audioStarted = false;

function fadeInAudio() {
  if (fadeTimer) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
  weddingAudio.volume = 0;
  weddingAudio.muted = false;

  const fadeStep = 0.08;
  fadeTimer = setInterval(() => {
    const nextVolume = Math.min(1, weddingAudio.volume + fadeStep);
    weddingAudio.volume = nextVolume;

    if (nextVolume >= 1) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }
  }, 160);
}

async function tryPlayAudio() {
  if (!invitationData.userStartedMusic && !invitationData.preview) return;
  if (invitationData.preview && !invitationData.catalogMusic) return;
  if (!invitationData.music?.url) return;
  if (audioStarted && !weddingAudio.paused) {
    return; // allaqachon ishlayapti — qayta mute/fade qilmaymiz
  }

  try {
    if (
      weddingAudio.readyState >= 1 &&
      weddingAudio.currentTime < audioStartTimeInSeconds
    ) {
      weddingAudio.currentTime = audioStartTimeInSeconds;
    }

    weddingAudio.muted = true;
    await weddingAudio.play();
    audioStarted = true;
    fadeInAudio();
  } catch {
    // qayta urinish davom etadi
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

weddingAudio.addEventListener("loadedmetadata", () => { setAudioStartTime(); });

weddingAudio.addEventListener("ended", () => { setAudioStartTime(); if (invitationData.userStartedMusic) void tryPlayAudio(); });

weddingAudio.addEventListener("pause", () => { musicControl.textContent = "♪"; });

document.addEventListener("DOMContentLoaded", () => {
  createButterflies();
  initScrollReveal();
  initGalleryLightbox();

  if (loadingGate) {
    setTimeout(() => {
      loadingGate.classList.add("open");
      void tryPlayAudio();
    }, gateOpenDelayMs);

    if (loadingDoorRight) {
      loadingDoorRight.addEventListener(
        "transitionend",
        (event) => {
          if (event.propertyName === "transform") {
            finishLoadingGate();
          }
        },
        { once: true },
      );
    }

    // Fallback in case transitionend is not fired in some browsers.
    setTimeout(() => {
      finishLoadingGate();
    }, gateOpenDelayMs + 500);
  } else {
    document.body.classList.add("gate-done");
  }

  if (weddingAudio.readyState >= 1) {
    setAudioStartTime();
  }
});

try { bindInvitation(JSON.parse(window.name || "{}")); } catch { bindInvitation({}); }
