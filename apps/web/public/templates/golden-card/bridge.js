(() => {
  "use strict";

  const templateId = "golden-card";
  const copy = {
    "uz-Latn": {
      greeting: "Assalomu alaykum, aziz mehmon",
      invocation: "Mehribon va rahmli Alloh nomi bilan.",
      defaultMessage: "Sizni hayotimizdagi eng baxtli kun — to'yimizga taklif qilamiz",
      open: "Ochish uchun bosing",
      map: "Xaritada ko\u02bbrish",
      musicOn: "Musiqani o\u02bbchirish",
      musicOff: "Musiqani yoqish",
      lang: "Tilni tanlash",
    },
    "uz-Cyrl": {
      greeting: "\u0410\u0441\u0441\u0430\u043b\u043e\u043c\u0443 \u0430\u043b\u0430\u0439\u043a\u0443\u043c, \u0430\u0437\u0438\u0437 \u043c\u0435\u04b3\u043c\u043e\u043d",
      invocation: "\u041c\u0435\u04b3\u0440\u0438\u0431\u043e\u043d \u0432\u0430 \u0440\u0430\u04b3\u043c\u043b\u0438 \u0410\u043b\u043b\u043e\u04b3 \u043d\u043e\u043c\u0438 \u0431\u0438\u043b\u0430\u043d.",
      defaultMessage: "\u0421\u0438\u0437\u043d\u0438 \u04b3\u0430\u0451\u0442\u0438\u043c\u0438\u0437\u0434\u0430\u0433\u0438 \u044d\u043d\u0433 \u0431\u0430\u0445\u0442\u043b\u0438 \u043a\u0443\u043d \u2014 \u0442\u045e\u0439\u0438\u043c\u0438\u0437\u0433\u0430 \u0442\u0430\u043a\u043b\u0438\u0444 \u049b\u0438\u043b\u0430\u043c\u0438\u0437",
      open: "\u041e\u0447\u0438\u0448 \u0443\u0447\u0443\u043d \u0431\u043e\u0441\u0438\u043d\u0433",
      map: "\u04b2\u0430\u0440\u0438\u0442\u0430\u0434\u0430 \u043a\u045e\u0440\u0438\u0448",
      musicOn: "\u041c\u0443\u0441\u0438\u049b\u0430\u043d\u0438 \u045e\u0447\u0438\u0440\u0438\u0448",
      musicOff: "\u041c\u0443\u0441\u0438\u049b\u0430\u043d\u0438 \u0451\u049b\u0438\u0448",
      lang: "\u0422\u0438\u043b\u043d\u0438 \u0442\u0430\u043d\u043b\u0430\u0448",
    },
    en: {
      greeting: "Welcome, dear guest",
      invocation: "In the Name of Allah, the most Gracious, the most Merciful.",
      defaultMessage: "We would be delighted with your attendance at the wedding of",
      open: "Tap to open",
      map: "View on map",
      musicOn: "Turn music off",
      musicOff: "Turn music on",
      lang: "Choose language",
    },
    ru: {
      greeting: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0434\u043e\u0440\u043e\u0433\u043e\u0439 \u0433\u043e\u0441\u0442\u044c",
      invocation: "\u0418\u043c\u0435\u043d\u0435\u043c \u0410\u043b\u043b\u0430\u0445\u0430, \u041c\u0438\u043b\u043e\u0441\u0442\u0438\u0432\u043e\u0433\u043e \u0438 \u041c\u0438\u043b\u043e\u0441\u0435\u0440\u0434\u043d\u043e\u0433\u043e.",
      defaultMessage: "\u0411\u0443\u0434\u0435\u043c \u0440\u0430\u0434\u044b \u0432\u0430\u0448\u0435\u043c\u0443 \u043f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044e \u043d\u0430 \u043d\u0430\u0448\u0435\u0439 \u0441\u0432\u0430\u0434\u044c\u0431\u0435",
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
  let starsReducedMotion = null;

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
    text('[data-golden="invocation"]', words.invocation);
    text('[data-golden="message"]', data.message || words.defaultMessage);

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
    if (message) message.closest("p").hidden = false;

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
    const wasReduced = root.classList.contains("golden-reduced-motion");
    if (payload?.reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("golden-reduced-motion");
      if (!wasReduced) settleReducedMotion();
    } else {
      root.classList.remove("golden-reduced-motion");
    }
    syncMusicLabel();
    animateStars();
  }

  function syncMusicLabel() {
    if (!musicButton) return;
    const words = copy[currentLocale] ?? copy["uz-Latn"];
    musicButton.setAttribute("aria-label", musicEnabled ? words.musicOn : words.musicOff);
    musicButton.setAttribute("aria-pressed", String(musicEnabled));
  }

  function animateStars() {
    const reduce = root.classList.contains("golden-reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (starsReducedMotion === reduce) return;
    starsReducedMotion = reduce;
    root.querySelectorAll(".golden-sparkle-star").forEach((star, index) => {
      star.getAnimations().forEach(animation => animation.cancel());
      if (reduce) { star.style.opacity = ".38"; star.style.transform = "scale(.72) rotate(35deg)"; return; }
      star.style.opacity = ""; star.style.transform = "";
      const drift = 7 + (index % 4) * 4;
      const frame = (opacity, scale, rotation, y, offset) => ({ opacity, transform: `translateY(${y}px) scale(${scale}) rotate(${rotation}deg)`, offset });
      star.animate([
        frame(0,.35,-25,0,0), frame(.95,1.25,10,-drift/2,.25), frame(.38,.72,35,-drift,.5),
        frame(1,1,0,-drift/2,.75), frame(0,.35,-25,0,1),
      ], { duration: 3400 + (index % 7) * 500, delay: (index % 12) * 420, iterations: Infinity, easing: "ease-in-out" });
    });
  }

  function animateCoverEntrance() {
    if (root.classList.contains("golden-reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    card.animate([
      {opacity:0, transform:"translateY(42px) scale(.9)", filter:"blur(12px)"},
      {opacity:1, transform:"translateY(0) scale(1)", filter:"blur(0px)"},
    ], {duration:1050, easing:"cubic-bezier(.16,1,.3,1)", fill:"both"});
    root.querySelector(".golden-cover-greeting")?.animate(
      [{opacity:0,transform:"translateY(-18px)"},{opacity:1,transform:"translateY(0)"}],
      {delay:450,duration:700,easing:"ease-out",fill:"both"});
    root.querySelector(".golden-cover-heading")?.animate(
      [{opacity:0,transform:"translateY(12px) scale(.86)"},{opacity:1,transform:"translateY(0) scale(1)"}],
      {delay:650,duration:850,easing:"cubic-bezier(.16,1,.3,1)",fill:"both"});
    root.querySelector(".golden-open-button")?.animate(
      [{opacity:0,transform:"translateY(18px)"},{opacity:1,transform:"translateY(0)"}],
      {delay:950,duration:650,easing:"ease-out",fill:"both"});
  }

  function revealInvitation() {
    const reduced = root.classList.contains("golden-reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const invite = root.querySelector(".golden-invite");
    if (!invite || reduced) return;
    invite.animate([{opacity:0},{opacity:1}], {delay:700,duration:300,easing:"ease-out",fill:"both"});
    invite.querySelectorAll("[data-reveal]").forEach((node,index) => node.animate(
      [{opacity:0,filter:"blur(6px)",transform:"translateY(14px)"},{opacity:1,filter:"blur(0px)",transform:"translateY(0)"}],
      {delay:700+index*120,duration:550,easing:"cubic-bezier(.16,1,.3,1)",fill:"both"}));
  }

  function concealInvitation() {
    const invite = root.querySelector(".golden-invite");
    if (!invite) return;
    const revealItems = [...invite.querySelectorAll("[data-reveal]")];
    for (const node of [invite, ...revealItems]) node.getAnimations().forEach(animation => animation.cancel());
    if (root.classList.contains("golden-reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      invite.style.opacity = "0";
      for (const node of revealItems) { node.style.opacity = "0"; node.style.transform = "translateY(14px)"; node.style.filter = "blur(6px)"; }
      return;
    }
    invite.animate([{opacity:1},{opacity:0}], {duration:300,easing:"ease-out",fill:"forwards"});
    for (const node of revealItems) node.animate(
      [{opacity:1,filter:"blur(0px)",transform:"translateY(0)"},{opacity:0,filter:"blur(6px)",transform:"translateY(14px)"}],
      {duration:300,easing:"ease-out",fill:"forwards"});
  }

  function settleReducedMotion() {
    root.getAnimations({subtree:true}).forEach(animation => animation.cancel());
    card.style.opacity="1"; card.style.transform="none"; card.style.filter="none";
    for (const selector of [".golden-cover-greeting", ".golden-cover-heading", ".golden-open-button"]) {
      const node=root.querySelector(selector); if(node){node.style.opacity="1";node.style.transform="none";node.style.filter="none";}
    }
    if(card.classList.contains("is-open")){
      const invite=root.querySelector(".golden-invite"); if(invite){invite.style.opacity="1";invite.querySelectorAll("[data-reveal]").forEach(node=>{node.style.opacity="1";node.style.transform="none";node.style.filter="none";});}
    }
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
    if (event.target.closest(".golden-container")) {
      if (event.target.closest("a")) return;
      card.classList.remove("is-open");
      root.querySelector(".golden-container")?.setAttribute("aria-hidden", "true");
      concealInvitation();
      return;
    }
    if (event.target.closest(".golden-cover")) {
      card.classList.add("is-open");
      root.querySelector(".golden-container")?.setAttribute("aria-hidden", "false");
      if (root.classList.contains("golden-reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) settleReducedMotion();
      else revealInvitation();
      void tryPlay();
    }
  });

  root.classList.toggle("golden-reduced-motion", new URLSearchParams(window.location.search).get("qaReducedMotion") === "1");

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== `${templateId}:update`) return;
    update(event.data.payload);
  });

  try {
    const initial = JSON.parse(window.name);
    if (initial?.type === `${templateId}:update`) update(initial.payload);
  } catch { /* The host sends the invitation after the frame loads. */ }
  animateStars();
  if (!root.classList.contains("golden-reduced-motion") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) animateCoverEntrance();
})();

