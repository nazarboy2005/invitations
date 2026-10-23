(() => {
  "use strict";
  const localeNames = { uz: "uz-Latn", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" };
  const translations = {
    "uz-Latn": { invite: "Nikoh to‘yiga taklif", dear: "Azizlar", countdown: "Baxtli kunimizgacha", countdownText: "Har bir kun baxtli kunimizni yanada yaqinlashtiradi.", days: "kun", hours: "soat", minutes: "daqiqa", seconds: "soniya", program: "Kun dasturi", location: "Manzil", map: "Xaritada ko‘rish", toyona: "To‘yona", holder: "Karta egasi", card: "Karta raqami", copy: "Nusxalash", copied: "Nusxalandi", copyFailed: "Nusxalab bo‘lmadi", dress: "Kiyim uslubi", rsvp: "Mehmon anketasi", deadline: "Iltimos, tashrifingizni tasdiqlang.", name: "Ism va familiya", attend: "Tashrif buyuraman", decline: "Afsuski, bora olmayman", wish: "Tilaklaringiz", send: "Javob yuborish", sent: "Rahmat!", error: "Ism va javobni kiriting.", failure: "Javob yuborilmadi. Qayta urinib ko‘ring." },
    "uz-Cyrl": { invite: "Никоҳ тўйига таклиф", dear: "Азизлар", countdown: "Бахтли кунимизгача", countdownText: "Ҳар бир кун бахтли кунимизни янада яқинлаштиради.", days: "кун", hours: "соат", minutes: "дақиқа", seconds: "сония", program: "Кун дастури", location: "Манзил", map: "Харитада кўриш", toyona: "Тўёна", holder: "Карта эгаси", card: "Карта рақами", copy: "Нусхалаш", copied: "Нусхаланди", copyFailed: "Нусхалаб бўлмади", dress: "Кийим услуби", rsvp: "Меҳмон анкетаси", deadline: "Илтимос, ташрифингизни тасдиқланг.", name: "Исм ва фамилия", attend: "Ташриф буюраман", decline: "Афсуски, бора олмайман", wish: "Тилакларингиз", send: "Жавоб юбориш", sent: "Раҳмат!", error: "Исм ва жавобни киритинг.", failure: "Жавоб юборилмади. Қайта уриниб кўринг." },
    en: { invite: "Wedding invitation", dear: "Dear guests", countdown: "Until our happy day", countdownText: "Each day brings our happy day a little closer.", days: "days", hours: "hours", minutes: "minutes", seconds: "seconds", program: "Order of the day", location: "Location", map: "View on map", toyona: "Gift", holder: "Cardholder", card: "Card number", copy: "Copy number", copied: "Copied", copyFailed: "Could not copy", dress: "Dress code", rsvp: "Guest response", deadline: "Please let us know if you can attend.", name: "Full name", attend: "Yes, I’ll attend", decline: "Sorry, I can’t attend", wish: "Your wishes", send: "Send response", sent: "Thank you!", error: "Enter your name and response.", failure: "Response was not sent. Please try again." },
    ru: { invite: "Приглашение на свадьбу", dear: "Дорогие гости", countdown: "До нашего счастливого дня", countdownText: "Каждый день приближает наш счастливый день.", days: "дней", hours: "часов", minutes: "минут", seconds: "секунд", program: "Программа дня", location: "Место проведения", map: "Посмотреть на карте", toyona: "Подарок", holder: "Владелец карты", card: "Номер карты", copy: "Скопировать номер", copied: "Скопировано", copyFailed: "Не удалось скопировать", dress: "Дресс-код", rsvp: "Анкета гостя", deadline: "Пожалуйста, подтвердите своё присутствие.", name: "Имя и фамилия", attend: "Да, обязательно приду", decline: "К сожалению, не смогу", wish: "Пожелания", send: "Отправить ответ", sent: "Спасибо!", error: "Укажите имя и ответ.", failure: "Не удалось отправить ответ. Попробуйте ещё раз." },
  };
  let data = {};
  try { data = JSON.parse(window.name || "{}"); } catch { /* platform initializes window.name */ }
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const text = (s, value) => { const el = $(s); if (el) el.textContent = value || ""; };
  function fitHeroNames() {
    const names = $(".hero-names");
    const content = $(".hero-content");
    if (!names || !content) return;
    const maxWidth = Math.max(160, content.clientWidth - 60);
    const style = getComputedStyle(names);
    const canvas = fitHeroNames.canvas || (fitHeroNames.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    if (!context) return;
    const fontFamily = style.fontFamily;
    context.font = `52px ${fontFamily}`;
    const longest = [$(".hero-groom")?.textContent, $(".hero-bride")?.textContent]
      .map((value) => context.measureText(value || "").width)
      .reduce((width, value) => Math.max(width, value), 0);
    const size = Math.max(32, Math.min(52, Math.floor(52 * maxWidth / Math.max(maxWidth, longest))));
    names.style.fontSize = `${size}px`;
  }
  const copy = () => translations[localeNames[data.locale] || data.locale] || translations.en;
  const words = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  function render(payload) {
    data = payload || {};
    window.__FAIRY_PLATFORM_PREVIEW = Boolean(data.platformPreview);
    const t = copy();
    document.documentElement.lang = localeNames[data.locale] || data.locale || "uz";
    $$(".fairy-languages button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.locale === data.locale)));
    document.title = data.title || t.invite;
    text(".hero-eyebrow", data.eventType || t.invite);
    text(".hero-groom", data.groom);
    text(".hero-bride", data.bride);
    fitHeroNames();
    text(".hero-date", data.date?.short || data.date?.long || "");
    text(".friends-title", data.greeting || t.dear);
    text(".friends-desc", data.message || "");
    text(".await-text", data.greeting || t.dear);
    text(".footer-rights", data.date?.year ? `© ${data.date.year}` : "");
    text(".calendar-title", data.date?.month || "");
    buildCalendar();
    text(".countdown-title", t.countdown);
    text(".countdown-desc", t.countdownText);
    $$(".countdown-label").forEach((el, i) => { el.textContent = [t.days, t.hours, t.minutes, t.seconds][i] || ""; });
    text(".program-title", data.programHeading || t.program);
    const list = $(".program-list");
    if (list) {
      list.replaceChildren();
      (data.program || []).forEach((item) => {
        if (!item.title && !item.time) return;
        const row = document.createElement("div"); row.className = "program-item reveal is-visible";
        const header = document.createElement("div"); header.className = "program-row";
        const title = document.createElement("div"); title.className = "program-name"; title.textContent = item.title || "";
        const time = document.createElement("div"); time.className = "program-time"; time.textContent = item.time || "";
        header.append(title, time); row.append(header); list.append(row);
      });
      list.closest(".program-section").hidden = !list.childElementCount;
    }
    text(".location-title", t.location);
    text(".location-address", [data.venue?.name, data.venue?.address].filter(Boolean).join(" · "));
    const map = $(".location-btn");
    if (map) { map.textContent = t.map; map.href = data.venue?.mapUrl || (data.venue?.lat != null && data.venue?.lng != null ? `https://maps.google.com/?q=${data.venue.lat},${data.venue.lng}` : "#"); map.hidden = !data.venue?.mapUrl && data.venue?.lat == null; }
    const gift = data.toyona || {};
    const giftSection = $(".toyona-section");
    giftSection.hidden = !gift.enabled || !String(gift.cardNumber || "").trim();
    text(".toyona-title", t.toyona);
    text(".toyona-holder-label", t.holder);
    text(".toyona-holder", gift.cardHolder || "");
    $(".toyona-holder").hidden = !gift.cardHolder;
    $(".toyona-holder-label").hidden = !gift.cardHolder;
    text(".toyona-number-label", t.card);
    text(".toyona-number", gift.cardNumber || "");
    const giftCopy = $(".toyona-copy");
    if (giftCopy) { giftCopy.textContent = t.copy; if (!giftCopy.dataset.bound) { giftCopy.dataset.bound = "true"; giftCopy.addEventListener("click", async () => { const status = $(".toyona-status"); try { await navigator.clipboard.writeText($(".toyona-number").textContent || ""); if (status) status.textContent = copy().copied; } catch { if (status) status.textContent = copy().copyFailed; } }); } }
    text(".toyona-status", "");
    const dress = data.dressCode || {};
    text(".dresscode-title", dress.style || t.dress); text(".dresscode-desc", [dress.text, dress.note].filter(Boolean).join("\n"));
    $(".dresscode-section").hidden = !dress.enabled;
    if (dress.colors?.length) { const blobs = $(".dresscode-blobs"); blobs.replaceChildren(); dress.colors.slice(0, 5).forEach((c) => { const swatch = document.createElement("span"); swatch.className = "blob"; swatch.style.background = c.hex; swatch.setAttribute("aria-label", c.name || ""); blobs.append(swatch); }); }
    $(".dresscode-photo").hidden = !dress.enabled;
    const formSection = $(".anketa-section"); formSection.hidden = !data.rsvp?.enabled;
    text(".anketa-title", t.rsvp); text(".anketa-desc", data.rsvp?.deadline || "");
    const name = $("#fullname"); const wish = $("#wishes");
    if (name) { name.placeholder = t.name; if (data.guestName && !name.value) name.value = data.guestName; }
    if (wish) { wish.placeholder = t.wish; wish.hidden = !data.wishesEnabled; }
    const labels = $$(".anketa-radio");
    if (labels[0]) labels[0].lastChild.textContent = ` ${t.attend}`;
    if (labels[1]) labels[1].lastChild.textContent = ` ${t.decline}`;
    const fieldLabels = $$(".anketa-field > label");
    if (fieldLabels[0]) fieldLabels[0].textContent = t.name;
    if (fieldLabels[1]) fieldLabels[1].textContent = ({ "uz-Latn": "Tashrifingizni tasdiqlang", "uz-Cyrl": "Ташрифингизни тасдиқланг", en: "Will you attend?", ru: "Вы придёте?" })[localeNames[data.locale] || data.locale] || t.rsvp;
    if (fieldLabels[2]) fieldLabels[2].textContent = t.wish;
    text(".anketa-desc", data.rsvp?.deadline || t.deadline);
    const contactLinks = $$(".footer-icons a");
    contactLinks.forEach((link) => { link.hidden = true; link.removeAttribute("href"); });
    (data.contacts || []).forEach((contact) => {
      if (!contact.href) return;
      const link = contact.type === "telegram" ? contactLinks[3] : contact.type === "phone" ? contactLinks[0] : null;
      if (!link) return;
      link.hidden = false; link.href = contact.href;
      link.setAttribute("aria-label", contact.label || contact.value || "Contact");
      link.target = contact.href.startsWith("tel:") ? "_self" : "_blank";
      link.rel = "noopener noreferrer";
      if (contact.type === "phone") {
        const svg = $("svg", link);
        if (svg) svg.innerHTML = '<path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.6 21 3 13.4 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.02z"/>';
      }
    });
    const submit = $("#anketaSubmit"); if (submit) submit.textContent = t.send;
    const audio = $("#bgMusic"); const button = $("#musicToggle");
    const musicUrl = data.silentPlayback ? "" : (typeof data.music === "string" ? data.music : data.music?.url) || "";
    if (audio) { if (musicUrl) { audio.src = musicUrl; audio.load(); } else { audio.removeAttribute("src"); audio.load(); } }
    if (button) button.hidden = !musicUrl;
    const date = data.dateTime ? new Date(data.dateTime).getTime() : NaN;
    $(".countdown-section").hidden = !Number.isFinite(date);
    clearInterval(window.__FAIRY_COUNTDOWN);
    if (Number.isFinite(date)) {
      const tickCountdown = () => {
      let ms = Math.max(0, date - Date.now());
      [["#cd-days", 86400000], ["#cd-hours", 3600000], ["#cd-mins", 60000], ["#cd-secs", 1000]].forEach(([sel, n], i) => { const el = $(sel); if (el) el.textContent = String(i ? Math.floor(ms / n) % (i === 1 ? 24 : 60) : Math.floor(ms / n)).padStart(2, "0"); ms %= n; });
      };
      tickCountdown();
      window.__FAIRY_COUNTDOWN = setInterval(tickCountdown, 1000);
    }
    bindRSVP();
  }
  function buildCalendar() {
    const widget = $(".calendar-widget"); if (!widget || !data.date?.year || !data.date?.monthNumber || !data.date?.day) return;
    const date = new Date(Date.UTC(data.date.year, data.date.monthNumber - 1, data.date.day));
    const first = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    const offset = (first.getUTCDay() + 6) % 7; const days = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    const labels = ({ "uz-Latn": ["Du","Se","Ch","Pa","Ju","Sh","Ya"], "uz-Cyrl": ["Ду","Се","Чо","Па","Жу","Ша","Як"], en: ["Mo","Tu","We","Th","Fr","Sa","Su"], ru: ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"] })[localeNames[data.locale] || data.locale] || ["Mo","Tu","We","Th","Fr","Sa","Su"];
    widget.replaceChildren(); const week = document.createElement("div"); week.className = "calendar-row"; labels.forEach((label) => { const el = document.createElement("div"); el.className = "calendar-label"; el.textContent = label; week.append(el); }); widget.append(week);
    const sourceHeart = $(".hero .hero-heart");
    for (let i = 0; i < Math.ceil((offset + days) / 7); i++) { const row = document.createElement("div"); row.className = "calendar-row"; for (let j = 0; j < 7; j++) { const n = i * 7 + j - offset + 1; const cell = document.createElement("div"); cell.className = `calendar-date${n === Number(data.date.day) ? " is-wedding" : ""}`; if (n > 0 && n <= days) { if (n === Number(data.date.day) && sourceHeart) { const day = document.createElement("span"); day.className = "date-num"; day.textContent = String(n); const heart = document.createElement("span"); heart.className = "wedding-heart"; const svg = sourceHeart.cloneNode(true); svg.classList.remove("hero-heart"); heart.append(svg); cell.append(day, heart); } else cell.textContent = String(n); } row.append(cell); } widget.append(row); }
  }
  function bindRSVP() {
    const button = $("#anketaSubmit"); if (!button || button.dataset.bound) return; button.dataset.bound = "true";
    button.addEventListener("click", async (event) => {
      event.preventDefault(); event.stopImmediatePropagation();
      const name = $("#fullname")?.value.trim(); const attending = $("input[name='attending']:checked")?.value;
      if (!name || !attending) { button.textContent = copy().error; return; }
      if (data.preview) { button.textContent = copy().failure; return; }
      button.disabled = true;
      try {
        const base = data.apiBase; if (!base) throw new Error("Missing endpoint");
        const rsvp = await fetch(`${base}/rsvp`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, status: attending === "yes" ? "yes" : "no", partySize: attending === "yes" ? 1 : 0, guestToken: data.guestToken || undefined }) });
        if (!rsvp.ok) throw new Error("RSVP failed");
        const message = $("#wishes")?.value.trim();
        if (message && data.wishesEnabled) { const response = await fetch(`${base}/wishes`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, message, guestToken: data.guestToken || undefined }) }); if (!response.ok) throw new Error("Wish failed"); }
        button.textContent = copy().sent; button.disabled = true;
      } catch { button.disabled = false; button.textContent = copy().failure; }
    }, true);
  }
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { document.documentElement.classList.add("fairy-reduced-motion"); }
  document.fonts?.ready.then(fitHeroNames);
  addEventListener("resize", fitHeroNames);
  const languages = data.languages || [];
  if (languages.length > 1) { const nav = document.createElement("nav"); nav.className = "fairy-languages"; const labels = { uz: "Uz", "uz-Cyrl": "Уз", en: "En", ru: "Ru" }; languages.forEach((code) => { const b = document.createElement("button"); b.type = "button"; b.dataset.locale = code; b.textContent = labels[code] || code; b.setAttribute("aria-pressed", String(code === data.locale)); b.addEventListener("click", () => parent.postMessage({ type: "fairy:language", locale: code }, location.origin)); nav.append(b); }); document.body.append(nav); }
  addEventListener("message", (event) => { if (event.origin === location.origin && event.source === parent && event.data?.type === "fairy:update") render(event.data.payload); });
  render(data);
})();
