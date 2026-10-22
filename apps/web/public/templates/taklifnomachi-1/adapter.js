(() => {
  "use strict";
  const templateId = "taklifnomachi-1";
  const locales = { uz: "uz-Latn", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" };
  const labels = {
    "uz-Latn": { guest: "Ism, familiya", attend: "Kelishingizni tasdiqlaysizmi?", yes: "Ha, albatta", no: "Afsuski, bora olmayman", party: "Mehmonlar soni", wish: "Tilagingiz", send: "Yuborish", copied: "Nusxa olindi", copy: "Karta raqamini nusxalash", gift: "To‘yona", map: "Xaritada ko‘rish", empty: "Hozircha tilaklar yo‘q", deadline: "Javob berish muddati" },
    "uz-Cyrl": { guest: "Исм, фамилия", attend: "Келишингизни тасдиқлайсизми?", yes: "Ҳа, албатта", no: "Афсуски, бора олмайман", party: "Меҳмонлар сони", wish: "Тилагингиз", send: "Юбориш", copied: "Нусха олинди", copy: "Карта рақамини нусхалаш", gift: "Тўёна", map: "Харитада кўриш", empty: "Ҳозирча тилаклар йўқ", deadline: "Жавоб бериш муддати" },
    en: { guest: "Name", attend: "Will you attend?", yes: "Yes, I will", no: "Sorry, I can’t attend", party: "Guests", wish: "Your wish", send: "Send", copied: "Copied", copy: "Copy card number", gift: "Wedding gift", map: "Open map", empty: "No wishes yet", deadline: "Please reply by" },
    ru: { guest: "Имя и фамилия", attend: "Вы придёте?", yes: "Да, буду", no: "К сожалению, не смогу", party: "Количество гостей", wish: "Ваше пожелание", send: "Отправить", copied: "Скопировано", copy: "Скопировать номер карты", gift: "Подарок молодожёнам", map: "Открыть карту", empty: "Пока нет пожеланий", deadline: "Ответьте до" },
  };
  const englishStatic = { "assalomu alaykum": "Welcome", "nikoh marosimi": "Wedding ceremony", "marosim": "Program", "to'y dasturi": "Program", "manzil": "Location", "kiyim kodi": "Dress code", "tafsilotlar": "Details", "mehmonlar tilaklari": "Guest wishes", "to'yimizgacha": "Until the celebration", "kun": "Days", "soat": "Hours", "daqiqa": "Minutes", "soniya": "Seconds", "tilak bildirish": "Send a wish", "to'yimizga": "RSVP", "birinchi tilak siznikiga aylansin": "Be the first to leave a wish" };
  function toCyrillic(value) {
    return value.replace(/o['‘ʻ`]/gi, (x) => x[0] === x[0].toUpperCase() ? "Ў" : "ў")
      .replace(/g['‘ʻ`]/gi, (x) => x[0] === x[0].toUpperCase() ? "Ғ" : "ғ")
      .replace(/sh/gi, (x) => x === "SH" ? "Ш" : x[0] === "S" ? "Ш" : "ш")
      .replace(/ch/gi, (x) => x === "CH" ? "Ч" : x[0] === "C" ? "Ч" : "ч")
      .replace(/ya/gi, (x) => x === "YA" ? "Я" : x[0] === "Y" ? "Я" : "я")
      .replace(/yu/gi, (x) => x === "YU" ? "Ю" : x[0] === "Y" ? "Ю" : "ю")
      .replace(/yo/gi, (x) => x === "YO" ? "Ё" : x[0] === "Y" ? "Ё" : "ё")
      .replace(/a/gi, (x) => x === "A" ? "А" : "а").replace(/b/gi, (x) => x === "B" ? "Б" : "б")
      .replace(/d/gi, (x) => x === "D" ? "Д" : "д").replace(/e/gi, (x) => x === "E" ? "Э" : "е")
      .replace(/f/gi, (x) => x === "F" ? "Ф" : "ф").replace(/g/gi, (x) => x === "G" ? "Г" : "г")
      .replace(/h/gi, (x) => x === "H" ? "Ҳ" : "ҳ").replace(/i/gi, (x) => x === "I" ? "И" : "и")
      .replace(/j/gi, (x) => x === "J" ? "Ж" : "ж").replace(/k/gi, (x) => x === "K" ? "К" : "к")
      .replace(/l/gi, (x) => x === "L" ? "Л" : "л").replace(/m/gi, (x) => x === "M" ? "М" : "м")
      .replace(/n/gi, (x) => x === "N" ? "Н" : "н").replace(/o/gi, (x) => x === "O" ? "О" : "о")
      .replace(/p/gi, (x) => x === "P" ? "П" : "п").replace(/q/gi, (x) => x === "Q" ? "Қ" : "қ")
      .replace(/r/gi, (x) => x === "R" ? "Р" : "р").replace(/s/gi, (x) => x === "S" ? "С" : "с")
      .replace(/t/gi, (x) => x === "T" ? "Т" : "т").replace(/u/gi, (x) => x === "U" ? "У" : "у")
      .replace(/v/gi, (x) => x === "V" ? "В" : "в").replace(/x/gi, (x) => x === "X" ? "Х" : "х")
      .replace(/y/gi, (x) => x === "Y" ? "Й" : "й").replace(/z/gi, (x) => x === "Z" ? "З" : "з");
  }
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  function read() {
    try {
      const raw = window.name || "";
      const value = JSON.parse(raw);
      return value && typeof value === "object" ? value : {};
    } catch { return {}; }
  }
  let current = read();
  window.__taklifnomaPayload = current;
  if (new URLSearchParams(location.search).get("qaReducedMotion") === "1") document.documentElement.dataset.reducedMotion = "true";
  const atom = (record, field) => document.querySelector(`#${record} [field="${field}"]`);
  const setText = (record, field, value, html = false) => {
    const node = atom(record, field);
    if (!node) return;
    if (html) node.innerHTML = value;
    else node.textContent = value || "";
  };
  function fmtDate(value, locale) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) return "";
    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  }
  function renderCalendar(payload, locale) {
    const section = document.getElementById("si-cal-section");
    const title = section?.querySelector(".si-cal-title");
    const grid = section?.querySelector(".si-cal-grid");
    if (!section || !title || !grid) return;
    const timezone = payload.timezone || "Asia/Tashkent";
    const eventAt = payload.dateTime ? new Date(payload.dateTime) : null;
    if (!eventAt || Number.isNaN(eventAt.valueOf())) { section.hidden = true; return; }
    section.hidden = false;
    title.textContent = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: timezone }).format(eventAt);
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(eventAt);
    const get = (key) => Number(parts.find((item) => item.type === key)?.value || 0);
    const year = get("year"), month = get("month"), day = get("day");
    const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    const children = Array.from({ length: 7 }, (_, index) => {
      const node = document.createElement("div"); node.className = "si-cal-dow";
      node.textContent = weekdayFormatter.format(new Date(Date.UTC(2024, 0, 1 + index))); return node;
    });
    for (let index = 0; index < offset + count; index++) {
      const cell = document.createElement("div"); cell.className = "si-cal-day";
      const number = index - offset + 1;
      if (number > 0) { const value = document.createElement("span"); value.textContent = String(number); cell.append(value); if (number === day) cell.classList.add("today"); }
      children.push(cell);
    }
    grid.replaceChildren(...children);
  }
  function sectionVisible(id, visible) {
    const node = document.getElementById(id);
    if (node) node.hidden = !visible;
  }
  function renderGift(data, locale) {
    const gift = data.toyona || {};
    let section = document.querySelector("[data-taklifnomachi-gift]");
    const visible = !data.catalogPreview && gift.enabled && Boolean(gift.cardNumber && gift.cardHolder);
    if (!visible) { section?.remove(); return; }
    if (!section) {
      section = document.createElement("section");
      section.dataset.taklifnomachiGift = "";
      section.className = "tm-gift";
      const anchor = document.getElementById("rec2003555721") || document.getElementById("si-wishes-section");
      if (anchor?.parentNode) anchor.after(section); else document.body.append(section);
    }
    const copyLabel = labels[locale].copy;
    section.innerHTML = `<p class="tm-gift-kicker">${escape(labels[locale].gift)}</p><div class="tm-gift-rule" aria-hidden="true">✦</div><p class="tm-gift-number" dir="ltr">${escape(gift.cardNumber)}</p><p class="tm-gift-holder">${escape(gift.cardHolder)}</p><button type="button" class="tm-gift-copy">${escape(copyLabel)}</button>`;
    section.querySelector("button").addEventListener("click", async (event) => {
      const button = event.currentTarget;
      try { await navigator.clipboard.writeText(gift.cardNumber); }
      catch {
        const input = document.createElement("textarea"); input.value = gift.cardNumber; input.style.position = "fixed"; input.style.opacity = "0"; document.body.append(input); input.select(); document.execCommand("copy"); input.remove();
      }
      button.textContent = labels[locale].copied;
      window.setTimeout(() => { if (button.isConnected) button.textContent = copyLabel; }, 1800);
    });
  }
  function renderLanguage(payload, locale) {
    const switcher = document.getElementById("si-lang-switcher");
    if (switcher) {
      const languages = (payload.languages || [payload.defaultLang || "uz"]).filter((code) => locales[code]);
      switcher.replaceChildren(...languages.map((code) => {
        const button = document.createElement("button");
        button.type = "button"; button.dataset.setLang = code;
        button.textContent = code === "uz" ? "UZ" : code === "uz-Cyrl" ? "ЎЗ" : code === "ru" ? "RU" : "EN";
        button.classList.toggle("active", code === payload.defaultLang);
        button.addEventListener("click", () => parent.postMessage({ type: "marxaba:language", locale: code }, location.origin));
        return button;
      }));
      switcher.hidden = languages.length < 2;
    }
    const useRussian = locale === "ru";
    document.querySelectorAll(".lang-uz").forEach((node) => { node.hidden = useRussian; });
    document.querySelectorAll(".lang-ru").forEach((node) => { node.hidden = !useRussian; });
    if (locale === "en" || locale === "uz-Cyrl") {
      document.querySelectorAll(".lang-uz").forEach((node) => {
        const original = node.textContent.trim();
        const english = englishStatic[original.toLocaleLowerCase()];
        if (locale === "en" && english) node.textContent = english;
        else if (locale === "uz-Cyrl") node.textContent = toCyrillic(original);
      });
    }
  }
  let countdownTimer;
  function renderCountdown(payload, locale) {
    const section = document.getElementById("countdownContainer");
    if (!section) return;
    if (countdownTimer) window.clearInterval(countdownTimer);
    const target = payload.dateTime ? new Date(payload.dateTime).getTime() : NaN;
    if (!Number.isFinite(target)) { section.hidden = true; return; }
    section.hidden = false;
    const labelsByLocale = {
      "uz-Latn": ["Kun", "Soat", "Daqiqa", "Soniya"],
      "uz-Cyrl": ["???", "????", "??????", "?????"],
      en: ["Days", "Hours", "Minutes", "Seconds"],
      ru: ["???", "????", "??????", "???????"],
    };
    const update = () => {
      const remaining = Math.max(0, target - Date.now());
      const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
      ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
        const node = document.getElementById(id);
        if (node) node.textContent = String(values[index]).padStart(2, "0");
        const block = node?.closest(".time-block");
        const label = block?.querySelector(".label");
        if (label) label.textContent = labelsByLocale[locale][index];
      });
    };
    update();
    countdownTimer = window.setInterval(update, 1000);
  }
  function render(payload) {
    const locale = locales[payload.defaultLang] || "uz-Latn";
    const labelsForLocale = labels[locale];
    const people = [payload.groom, payload.bride].filter(Boolean);
    const names = people.map(escape).join("<br><br>");
    const dateText = payload.date?.short || fmtDate(payload.dateTime, locale);
    document.documentElement.lang = payload.defaultLang || "uz";
    document.body.dataset.lang = locale === "ru" ? "ru" : "uz";
    renderLanguage(payload, locale);
    document.title = payload.title || people.join(" & ") || "Taklifnoma";
    setText("rec2049114373", "tn_text_1763402147625", names, true);
    setText("rec2049114373", "tn_text_176340398328864790", payload.eventType || "");
    setText("rec2049114373", "tn_text_176340401720454780", dateText);
    setText("rec2049114373", "tn_text_1772813849329000001", people.join(" & "));
    setText("rec2003869491", "tn_text_1772813849329000001", payload.hosts || people.join(" & "));
    setText("rec2002273681", "tn_text_1763405219328", payload.greeting || "");
    setText("rec2002273681", "tn_text_1763405268776", payload.message || "");
    setText("rec2002506421", "tn_text_1763405219328", payload.programHeading || "");
    const programFields = [
      ["tn_text_1763405268776", "tn_text_1772803062504"],
      ["tn_text_1772803288793000002", "tn_text_1772803288793000003"],
      ["tn_text_1772803465944000005", "tn_text_1772803465944000006"],
      ["tn_text_1772803619332000008", "tn_text_1772803619332000009"],
    ];
    const rows = payload.program || [];
    programFields.forEach(([titleField, timeField], index) => {
      const item = rows[index];
      setText("rec2002506421", titleField, item?.title || "");
      setText("rec2002506421", timeField, item?.time || "");
      const row = atom("rec2002506421", titleField)?.closest(".t396__elem");
      if (row) row.hidden = !item;
      const timeRow = atom("rec2002506421", timeField)?.closest(".t396__elem");
      if (timeRow) timeRow.hidden = !item;
    });
    setText("rec2002802231", "tn_text_1772804808869", payload.venue?.name || "");
    setText("rec2002802231", "tn_text_1772813480591000001", [payload.venue?.address, payload.venue?.landmark].filter(Boolean).join(" · "));
    setText("rec2003555721", "tn_text_1772804808869", payload.contacts?.map((item) => item.value).join(" · ") || "");
    setText("rec2003555721", "tn_text_1772822506940000003", "");
    const dress = payload.dressCode || {};
    sectionVisible("rec2003451831", Boolean(dress.enabled || (payload.gallery || []).length));
    if (dress.enabled) {
      setText("rec2003451831", "tn_text_1772813849329000001", [dress.style, dress.text].filter(Boolean).join(" · "));
      setText("rec2003451831", "tn_text_1772814614231000014", dress.note || "");
      setText("rec2003451831", "tn_text_1772814650506000015", "");
    }
    const photos = document.querySelectorAll("#rec2003451831 img.tn-atom__img");
    photos.forEach((image, index) => {
      const item = (payload.gallery || [])[index];
      const parent = image.closest(".t396__elem");
      if (!item) { if (parent) parent.hidden = true; return; }
      image.src = item.src; image.alt = item.alt || item.caption || "";
      if (parent) parent.hidden = false;
    });
    sectionVisible("countdownContainer", Boolean(payload.dateTime));
    renderCalendar(payload, locale);
    renderCountdown(payload, locale);
    const audio = document.getElementById("invitation-audio");
    if (audio) {
      const url = payload.music || "";
      if (url && audio.src !== new URL(url, location.href).href) { audio.src = url; audio.load(); }
      if (!url) { audio.pause(); audio.removeAttribute("src"); }
      const control = document.getElementById("audio-control");
      if (control) control.hidden = !url;
    }
    const wishesEnabled = Boolean(payload.wishesEnabled);
    sectionVisible("si-wishes-section", wishesEnabled || Boolean(payload.rsvp));
    const wishInput = document.querySelector('#si-rsvp-form textarea[name="wish"]');
    if (wishInput) { wishInput.closest("label").hidden = !wishesEnabled; wishInput.placeholder = labelsForLocale.wish; wishInput.maxLength = 2000; }
    const rsvpFields = document.querySelectorAll('#si-rsvp-form [name="attending"],#si-rsvp-form [name="partySize"]');
    rsvpFields.forEach((field) => { const group = field.closest("label") || field.closest("fieldset"); if (group) group.hidden = !payload.rsvp; });
    const nameInput = document.querySelector('#si-rsvp-form input[name="guestName"]');
    if (nameInput) { nameInput.placeholder = labelsForLocale.guest; nameInput.maxLength = 100; if (payload.name) nameInput.value = payload.name; }
    const partySize = document.querySelector('#si-rsvp-form input[name="partySize"]');
    if (partySize && payload.rsvpDetails) partySize.max = String(payload.rsvpDetails.maxPartySize);
    const rsvpForm = document.getElementById("si-rsvp-form");
    let deadline = rsvpForm?.querySelector("[data-taklifnomachi-deadline]");
    if (rsvpForm && payload.rsvpDetails?.deadline) {
      if (!deadline) { deadline = document.createElement("p"); deadline.dataset.taklifnomachiDeadline = ""; rsvpForm.prepend(deadline); }
      deadline.textContent = `${labelsForLocale.deadline}: ${new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: payload.timezone || "Asia/Tashkent" }).format(new Date(`${payload.rsvpDetails.deadline}T12:00:00Z`))}`;
    } else deadline?.remove();
    const submit = document.getElementById("si-rsvp-submit");
    if (submit) submit.textContent = labelsForLocale.send;
    const wishOpen = document.getElementById("si-rsvp-open");
    if (wishOpen) wishOpen.textContent = wishesEnabled ? labelsForLocale.wish : labelsForLocale.send;
    const radioLabels = document.querySelectorAll(".si-rsvp-radio");
    if (radioLabels[0]) radioLabels[0].querySelector("span")?.replaceChildren(labelsForLocale.yes);
    if (radioLabels[1]) radioLabels[1].querySelector("span")?.replaceChildren(labelsForLocale.no);
    const wishLabel = document.querySelector('#si-rsvp-form textarea[name="wish"]')?.closest("label");
    if (wishLabel?.firstChild) wishLabel.firstChild.textContent = labelsForLocale.wish;
    const attendanceLabel = document.querySelector(".si-rsvp-radios legend");
    if (attendanceLabel) attendanceLabel.textContent = labelsForLocale.attend;
    const partyLabel = document.querySelector('#si-rsvp-form input[name="partySize"]')?.closest("label");
    if (partyLabel?.firstChild) partyLabel.firstChild.textContent = labelsForLocale.party;
    const venue = atom("rec2002802231", "tn_text_1772813480591000001");
    if (venue && payload.venue?.mapUrl) {
      let link = document.querySelector("[data-taklifnomachi-map]");
      if (!link) { link = document.createElement("a"); link.dataset.taklifnomachiMap = ""; link.className = "tm-map-link"; document.getElementById("rec2002802231")?.after(link); }
      link.href = payload.venue.mapUrl; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = labelsForLocale.map;
    } else document.querySelector("[data-taklifnomachi-map]")?.remove();
    const details = document.getElementById("rec2003555721");
    let contacts = details?.querySelector("[data-taklifnomachi-contacts]");
    const contactData = payload.contacts || [];
    if (details && contactData.length) {
      if (!contacts) { contacts = document.createElement("div"); contacts.dataset.taklifnomachiContacts = ""; contacts.className = "tm-contacts"; details.append(contacts); }
      contacts.replaceChildren(...contactData.map((item) => { const anchor = document.createElement("a"); anchor.href = item.href; anchor.textContent = item.value; if (item.type !== "phone") { anchor.target = "_blank"; anchor.rel = "noopener noreferrer"; } return anchor; }));
    } else contacts?.remove();
    const programSection = document.getElementById("rec2002506421");
    let extraProgram = programSection?.querySelector("[data-taklifnomachi-program-extra]");
    if (programSection) {
      if (!extraProgram) { extraProgram = document.createElement("div"); extraProgram.dataset.taklifnomachiProgramExtra = ""; programSection.append(extraProgram); }
      extraProgram.className = "tm-program-extra-list";
      extraProgram.replaceChildren(...rows.slice(programFields.length).map((item) => { const row = document.createElement("div"); row.className = "tm-program-extra"; const time = document.createElement("span"); time.textContent = item.time; const title = document.createElement("span"); title.textContent = item.title; row.append(time, title); return row; }));
    }
    const extraPhotos = document.querySelector("[data-taklifnomachi-gallery-extra]");
    extraPhotos?.remove();
    if ((payload.gallery || []).length > photos.length) {
      const gallery = document.createElement("div"); gallery.dataset.taklifnomachiGalleryExtra = ""; gallery.className = "tm-gallery-extra";
      for (const item of payload.gallery.slice(photos.length)) { const figure = document.createElement("figure"); const image = document.createElement("img"); image.src = item.src; image.alt = item.alt || item.caption || ""; figure.append(image); gallery.append(figure); }
      document.getElementById("rec2003451831")?.append(gallery);
    }
    renderGift(payload, locale);
    document.body.dataset.invitationReady = "true";
    if (typeof window.__taklifnomaLoadWishes === "function") window.__taklifnomaLoadWishes();
  }
  function onMessage(event) {
    if (event.origin !== location.origin || event.source !== parent || !event.data) return;
    if (event.data.type !== "marxaba:update" || !event.data.payload) return;
    current = event.data.payload;
    window.__taklifnomaPayload = current;
    render(current);
  }
  window.addEventListener("message", onMessage);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => render(current), { once: true });
  else render(current);
})();
