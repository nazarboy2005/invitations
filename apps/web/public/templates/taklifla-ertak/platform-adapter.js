/* Shared-contract bridge; no provider app runtime, sample records or storage. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const text = (selector, value) => all(selector).forEach((el) => { el.textContent = value || ""; });
  const show = (selector, visible) => all(selector).forEach((el) => { el.hidden = !visible; });
  const UI = {
    "uz-Latn": { chapters: ["Birinchi bob", "Ikkinchi bob", "Uchinchi bob", "To‘rtinchi bob", "Beshinchi bob"], units: ["kun", "soat", "daqiqa", "soniya"], name: "Ismingiz", message: "Tilak, duo yoki xotira yozing…", wish: "Yaqinlaringizga ezgu tilaklaringizni qoldiring.", preview: "Ko‘rib chiqish rejimida tilak yuborilmaydi.", sending: "Yuborilmoqda…", success: "Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.", error: "Tilakni yuborib bo‘lmadi. Qayta urinib ko‘ring.", required: "Ismingiz va tilagingizni yozing.", play: "Musiqa", pause: "Pauza", language: "Til", map: "Xaritada ochish ↗", north: "Sh" },
    "uz-Cyrl": { chapters: ["Биринчи боб", "Иккинчи боб", "Учинчи боб", "Тўртинчи боб", "Бешинчи боб"], units: ["кун", "соат", "дақиқа", "сония"], name: "Исмингиз", message: "Тилак, дуо ёки хотира ёзинг…", wish: "Яқинларингизга эзгу тилакларингизни қолдиринг.", preview: "Кўриб чиқиш режимида тилак юборилмайди.", sending: "Юборилмоқда…", success: "Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.", error: "Тилакни юбориб бўлмади. Қайта уриниб кўринг.", required: "Исмингиз ва тилагингизни ёзинг.", play: "Мусиқа", pause: "Пауза", language: "Тил", map: "Харитада очиш ↗", north: "Ш" },
    en: { chapters: ["Chapter One", "Chapter Two", "Chapter Three", "Chapter Four", "Chapter Five"], units: ["days", "hours", "minutes", "seconds"], name: "Your name", message: "Write a wish, a blessing, a memory…", wish: "Leave your warm wishes for your loved ones.", preview: "Wishes cannot be sent from this preview.", sending: "Sending…", success: "Your wish was sent. It will appear after the invitation owner approves it.", error: "Your wish could not be sent. Please try again.", required: "Enter your name and wish.", play: "Music", pause: "Pause", language: "Language", map: "Open in Maps ↗", north: "N" },
    ru: { chapters: ["Глава первая", "Глава вторая", "Глава третья", "Глава четвёртая", "Глава пятая"], units: ["дней", "часов", "минут", "секунд"], name: "Ваше имя", message: "Напишите пожелание, благословение, воспоминание…", wish: "Оставьте тёплые пожелания вашим близким.", preview: "В режиме просмотра пожелания не отправляются.", sending: "Отправка…", success: "Ваше пожелание отправлено. Оно появится после одобрения владельцем приглашения.", error: "Не удалось отправить пожелание. Попробуйте ещё раз.", required: "Введите ваше имя и пожелание.", play: "Музыка", pause: "Пауза", language: "Язык", map: "Открыть на карте ↗", north: "С" },
  };
  UI["uz-Latn"].loadError="Tilaklarni yuklab bo‘lmadi. Qayta urinib ko‘ring.";
  UI["uz-Cyrl"].loadError="Тилакларни юклаб бўлмади. Қайта уриниб кўринг.";
  UI.en.loadError="Wishes could not be loaded. Please try again.";
  UI.ru.loadError="Не удалось загрузить пожелания. Попробуйте ещё раз.";
  let data = null, timer = null, requestEpoch = 0, loadController = null;
  let musicKey = "", hasPlayed = false, guestPaused = false, playPending = false;
  const audio = $("#bgMusic"), musicButton = $("#taklifla-music-btn");
  const form = $(".wish-form"), status = $(".wish-form-status");
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const ui = () => UI[data?.locale] || UI["uz-Latn"];
  const endpoint = () => "/api/public/invitations/" + encodeURIComponent(data.invitationId) + "/wishes";
  const validUrl = (value) => /^(https?:\/\/|\/(?!\/))/.test(value || "");

  function motion() {
    const reduce = !!data?.reducedMotion || motionPreference.matches;
    document.documentElement.dataset.reducedMotion = String(reduce);
    all(".venue-map animate").forEach((el) => {
      if (reduce) el.endElement?.(); else el.beginElement?.();
    });
    if (reduce) {
      all(".layer, .float, .splash-title, .ambient img").forEach((el) => {
        el.style.removeProperty("transform"); el.style.removeProperty("opacity");
      });
    }
  }
  motionPreference.addEventListener("change", motion);

  function renderWishes(items) {
    const list = $("#wishes-list"); list.replaceChildren();
    for (const item of items) {
      const article = document.createElement("article"); article.className = "wish";
      article.dataset.wishId = item.id;
      const header = document.createElement("header"), name = document.createElement("span");
      name.className = "wish-name"; name.textContent = item.name;
      header.append(name);
      const paragraph = document.createElement("p"); paragraph.textContent = "“" + item.message + "”";
      article.append(header, paragraph); list.append(article);
    }
  }
  async function loadWishes() {
    loadController?.abort();
    renderWishes(data?.preview ? data.sampleWishes || [] : []);
    if (!data || data.preview || !data.invitationId || !data.wishesEnabled) return;
    const epoch = requestEpoch;
    const controller = new AbortController(); loadController = controller;
    try {
      const response = await fetch(endpoint(), { credentials: "same-origin", cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("wishes");
      const result = await response.json();
      if (epoch === requestEpoch) renderWishes(Array.isArray(result.wishes) ? result.wishes : []);
    } catch (error) {
      if (epoch === requestEpoch && error.name !== "AbortError") status.textContent = ui().loadError;
    }
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!data) return;
    if (data.preview || !data.invitationId) { status.textContent = ui().preview; return; }
    if (!data.wishesEnabled) return;
    const name = form.elements.namedItem("name").value.trim();
    const message = form.elements.namedItem("message").value.trim();
    if (!name || !message) { status.textContent = ui().required; return; }
    const epoch = requestEpoch, url = endpoint(), guestToken = data.guestToken;
    const button = form.querySelector("button"); button.disabled = true;
    status.textContent = ui().sending;
    try {
      const response = await fetch(url, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message, ...(guestToken ? { guestToken } : {}) }) });
      if (!response.ok) throw new Error("submit");
      const result = await response.json();
      if (result.ok !== true) throw new Error("submit");
      if (epoch !== requestEpoch) return;
      form.reset(); status.textContent = ui().success;
      // New messages are pending. Never append them to the approved public list.
    } catch { if (epoch === requestEpoch) status.textContent = ui().error; }
    finally { if (epoch === requestEpoch) button.disabled = false; }
  });

  function musicState() {
    musicButton.classList.toggle("playing", !audio.paused);
    musicButton.setAttribute("aria-pressed", String(!audio.paused));
    text(".taklifla-music-label", audio.paused ? ui().play : ui().pause);
    musicButton.setAttribute("aria-label", audio.paused ? ui().play : ui().pause);
  }
  async function play() {
    if (!data || guestPaused || playPending || !audio.getAttribute("src")) return;
    playPending = true;
    try { await audio.play(); hasPlayed = true; } catch { /* Keep the source button available. */ }
    finally { playPending = false; musicState(); }
  }
  musicButton.addEventListener("click", () => {
    if (!audio.paused) { guestPaused = true; audio.pause(); }
    else { guestPaused = false; void play(); }
  });
  audio.addEventListener("play", musicState); audio.addEventListener("pause", musicState);
  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest("#taklifla-music-btn") || data?.silentPlayback) return;
    if (!hasPlayed && !guestPaused && data?.music.enabled) void play();
  });
  function configureMusic() {
    const url = data.music.enabled && validUrl(data.music.url) ? data.music.url : "";
    const key = data.invitationId + "|" + data.preview + "|" + url;
    if (key !== musicKey) {
      musicKey = key; audio.pause(); audio.removeAttribute("src");
      hasPlayed = false; guestPaused = false;
      if (url) audio.src = url;
    }
    musicButton.hidden = !url;
    audio.muted = !!data.silentPlayback;
    musicState();
    if (url && !data.preview && !data.silentPlayback && !hasPlayed && !guestPaused) void play();
  }

  function countdown() {
    const target = Date.parse(data?.instant || "");
    show(".countdown-section", Number.isFinite(target));
    if (!Number.isFinite(target)) return;
    let seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
    all(".cd-num").forEach((el, i) => { el.textContent = String(values[i]).padStart(i === 0 ? 3 : 2, "0"); });
  }

  function fitNames() {
    all(".splash-names .name-a, .splash-names .name-b, .invite-name").forEach(el=>{el.style.fontSize="";let size=parseFloat(getComputedStyle(el).fontSize);const line=()=>parseFloat(getComputedStyle(el).lineHeight)||size;while(size>16 && (el.scrollWidth>el.clientWidth+1 || el.clientHeight>line()*2+2)){el.style.fontSize=(--size)+"px";}});
  }
  window.addEventListener("resize",fitNames);
  function apply(payload) {
    if (!payload || !UI[payload.locale] || !Array.isArray(payload.people) || !Array.isArray(payload.program)) return;
    data = payload; requestEpoch++;
    form.querySelector("button").disabled = false; status.textContent = "";
    document.documentElement.lang = data.locale;
    const languageIndex = { "uz-Latn": 1, "uz-Cyrl": 4, en: 2, ru: 3 }[data.locale];
    window.ERTAK_LABELS.forEach((row) => text(row[0], row[languageIndex]));
    all(".section-eyebrow").forEach((el, i) => { el.textContent = ui().chapters[i]; });
    all(".cd-lbl").forEach((el, i) => { el.textContent = ui().units[i]; });
    text(".splash-eyebrow", data.greeting || window.ERTAK_LABELS[0][languageIndex]);
    text(".name-a", data.people[0]); text(".name-b", data.people[1]);
    const names = all(".invite-name"); names.forEach((el, i) => { el.textContent = data.people[i] || ""; });
    show(".splash-names .amp, .invite-script, .footer-monogram .amp", !!data.people[0] && !!data.people[1]);
    if (data.eventLabel) text(".splash-script", data.eventLabel);
    if (data.hosts) text(".invite-mono", data.hosts);
    text(".splash-place, .invite-place-sub, .venue-sub", data.venue.address);
    text(".invite-place, .venue-card h3, .venue-map [data-venue-label]", data.venue.name);
    text(".venue-card p", data.venue.landmark); show(".venue-card p", !!data.venue.landmark);
    text(".venue-map [data-map-city]", data.venue.address);
    text(".venue-map [data-map-hint]", ui().map); text(".venue-map [data-north]", ui().north);
    all(".venue-card a.btn-ghost, .venue-map").forEach((link) => {
      const url = /^https?:\/\//i.test(data.venue.mapUrl) ? data.venue.mapUrl : "";
      link.hidden = !url; if (url) link.href = url; else link.removeAttribute("href");
      link.setAttribute("aria-label", ui().map + " · " + data.venue.name);
    });
    show(".venue-section", !!(data.venue.name || data.venue.address || data.venue.mapUrl));
    text(".footer-monogram span:first-child", [...(data.people[0] || "")][0]);
    text(".footer-monogram span:last-child", [...(data.people[1] || "")][0]);
    const date = data.date;
    const splashDate = $(".splash-date"); splashDate.replaceChildren();
    const longDate = $(".invite-date-big"); longDate.replaceChildren();
    if (date) {
      [date.day, "·", date.month, "·", date.year].forEach((value, i) => {
        const span = document.createElement("span"); if (i % 2) span.className = "dot";
        span.textContent = value; splashDate.append(span);
      });
      longDate.append(document.createTextNode(date.weekday), document.createElement("br"));
      const em = document.createElement("em"); em.textContent = date.long;
      longDate.append(em, document.createElement("br"), document.createTextNode([date.year, date.time].filter(Boolean).join(" · ")));
    }
    text(".footer-date", date ? [date.day, date.month, date.year, data.venue.address].filter(Boolean).join(" · ") : data.venue.address);
    show(".splash-date, .invite-date-big", !!date);
    const timeline = $(".timeline"); timeline.replaceChildren();
    data.program.forEach((item, index) => {
      const article = document.createElement("article"); article.className = "event-card" + (index === 1 ? " event-card-keystone" : ""); article.dataset.programId = item.id;
      const number = document.createElement("div"); number.className = "event-num"; number.textContent = ["i.", "ii.", "iii.", "iv.", "v.", "vi."][index] || String(index + 1) + ".";
      const time = document.createElement("div"); time.className = "event-time"; time.textContent = item.time;
      const title = document.createElement("h3"); title.className = "event-name"; title.textContent = item.title;
      const description = document.createElement("p"); description.className = "event-desc"; description.textContent = item.description; description.hidden = !item.description;
      article.append(number, time, title, description); timeline.append(article);
    });
    if (data.programHeading) text(".events-section .section-title", data.programHeading);
    show(".events-section", data.program.length > 0 || !!data.message);
    text(".events-section .section-lede", data.message); show(".events-section .section-lede", !!data.message);
    show(".wishes-section, .invite-rsvp", data.wishesEnabled);
    text(".wishes-section .section-lede", ui().wish);
    const nameInput = form.elements.namedItem("name"), messageInput = form.elements.namedItem("message");
    nameInput.placeholder = ui().name; nameInput.setAttribute("aria-label", ui().name);
    messageInput.placeholder = ui().message; messageInput.setAttribute("aria-label", ui().message);
    const language = $(".taklifla-lang-switch"); language.setAttribute("aria-label", ui().language);
    language.querySelector(".taklifla-lang-toggle").setAttribute("aria-label", ui().language);
    text(".taklifla-lang-current", { "uz-Latn": "UZ", "uz-Cyrl": "ЎЗ", en: "EN", ru: "RU" }[data.locale]);
    all("button[data-lang]").forEach((button) => {
      button.hidden = !data.enabledLocales.includes(button.dataset.lang);
      button.classList.toggle("active", button.dataset.lang === data.locale);
      button.setAttribute("aria-checked", String(button.dataset.lang === data.locale));
    });
    language.hidden = data.enabledLocales.length < 2;
    document.title = data.title || data.people.join(" & ") || "Ertak";
    document.documentElement.dataset.ready = "true";
    motion(); configureMusic(); countdown();fitNames();document.fonts.ready.then(fitNames);
    clearInterval(timer); timer = setInterval(countdown, 1000);
    void loadWishes();
  }

  const language = $(".taklifla-lang-switch"), toggle = $(".taklifla-lang-toggle");
  const closeMenu = () => { language.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const open = !language.classList.contains("open"); language.classList.toggle("open", open); toggle.setAttribute("aria-expanded", String(open));
    if (open) language.querySelector("button[data-lang]:not([hidden])")?.focus();
  });
  language.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-lang]");
    if (!button || !data?.enabledLocales.includes(button.dataset.lang)) return;
    parent.postMessage({ type: "taklifla-ertak:locale", locale: button.dataset.lang }, location.origin);
    closeMenu(); toggle.focus();
  });
  document.addEventListener("click", (event) => { if (!language.contains(event.target)) closeMenu(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMenu(); toggle.focus(); } });
  window.addEventListener("message", (event) => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== "taklifla-ertak:update") return;
    apply(event.data.payload);
  });
  parent.postMessage({ type: "taklifla-ertak:ready" }, location.origin);
})();
