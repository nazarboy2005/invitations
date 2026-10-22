/*
 * Small compatibility layer between Marxaba's original Anor template scripts
 * and Taklifnoma's typed invitation contract. The visual renderer and its
 * motion remain in the copied template files beside this bridge.
 */
(() => {
  "use strict";

  const listeners = new Map();
  const app = {
    data: {},
    lang: "uz",
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    tier: "full",
    opened: false,
    on(type, callback) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(callback);
      if (type === "ready" && this.ready) queueMicrotask(() => callback(this));
      return () => listeners.get(type)?.delete(callback);
    },
    emit(type, value) {
      for (const callback of listeners.get(type) ?? []) callback(value);
    },
    open() {
      if (this.opened) return;
      this.opened = true;
      document.documentElement.classList.remove("is-locked");
      this.emit("open", this);
      startMusic();
    },
    t(key) {
      return key;
    },
  };
  window.Marhamat = app;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));
  const normalize = (value) => value.replace(/\s+/g, " ").trim();
  const localized = {
    "uz-Latn": {
      hosts: "Hurmat bilan",
      footer: "Raqamli taklifnoma",
      rsvpDeadline: (date) => `Iltimos, ${date}gacha javob bering`,
      preview: "Ko‘rish rejimida javob yuborilmaydi.",
      rsvpThanks: "Rahmat! Javobingiz saqlandi.",
      wishThanks: "Tilagingiz yuborildi.",
      error: "Yuborishda xatolik. Qayta urinib ko‘ring.",
      musicOn: "Musiqani yoqish",
      musicOff: "Musiqani o‘chirish",
      attend: "Albatta kelaman",
      maybe: "Hali bilmayman",
      decline: "Afsuski, kela olmayman",
      coming: (n) => `Kelaman · ${n} kishi`,
    },
    "uz-Cyrl": {
      hosts: "Ҳурмат билан",
      footer: "Рақамли таклифнома",
      rsvpDeadline: (date) => `Илтимос, ${date}гача жавоб беринг`,
      preview: "Кўриш режимида жавоб юборилмайди.",
      rsvpThanks: "Раҳмат! Жавобингиз сақланди.",
      wishThanks:
        "Тилагингиз юборилди. Таклифнома эгаси тасдиқлагандан кейин кўринади.",
      error: "Юборишда хатолик. Қайта уриниб кўринг.",
      musicOn: "Мусиқани ёқиш",
      musicOff: "Мусиқани ўчириш",
      attend: "Албатта келаман",
      maybe: "Ҳали билмайман",
      decline: "Афсуски, кела олмайман",
      coming: (n) => `Келаман · ${n} киши`,
    },
    en: {
      hosts: "With love from",
      footer: "A digital invitation",
      rsvpDeadline: (date) => `Please reply by ${date}`,
      preview: "Responses are disabled in preview mode.",
      rsvpThanks: "Thank you! Your response was saved.",
      wishThanks: "Your wish was sent for the hosts to review.",
      error: "Could not send that. Please try again.",
      musicOn: "Play music",
      musicOff: "Pause music",
      attend: "I will be there",
      maybe: "Not sure yet",
      decline: "Sadly, I can’t come",
      coming: (n) => `Coming · ${n} ${n === 1 ? "guest" : "guests"}`,
    },
    ru: {
      hosts: "С уважением",
      footer: "Цифровое приглашение",
      rsvpDeadline: (date) => `Пожалуйста, ответьте до ${date}`,
      preview: "В режиме предпросмотра ответы не отправляются.",
      rsvpThanks: "Спасибо! Ваш ответ сохранён.",
      wishThanks: "Ваше пожелание отправлено хозяевам на проверку.",
      error: "Не удалось отправить. Попробуйте ещё раз.",
      musicOn: "Включить музыку",
      musicOff: "Приостановить музыку",
      attend: "Обязательно приду",
      maybe: "Пока не знаю",
      decline: "К сожалению, не смогу",
      coming: (n) => `Приду · ${n} чел.`,
    },
  };
  const months = {
    "uz-Latn": [
      "yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul",
      "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
    ],
    "uz-Cyrl": [
      "январ", "феврал", "март", "апрел", "май", "июн", "июл",
      "август", "сентябр", "октябр", "ноябр", "декабр",
    ],
  };
  let config = null;
  let selectedStatus = "";
  let partySize = 1;
  let countdownTimer = null;
  let musicStarted = false;
  let musicManuallyPaused = false;

  function safeText(value) {
    return value == null ? "" : String(value);
  }

  function pathValue(object, path) {
    return path.split(".").reduce((value, key) => value?.[key], object);
  }

  function languageName(locale) {
    return ({
      "uz-Latn": "Uz",
      "uz-Cyrl": "Уз",
      en: "En",
      ru: "Ru",
    })[locale] || "Uz";
  }

  function translateStaticText(locale) {
    const dictionary = window.MARHAMAT_I18N || {};
    const index = locale === "ru" ? 0 : 1;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.parentElement?.closest("[data-slot],[data-field],script,style"))
        continue;
      const original = normalize(node.nodeValue || "");
      if (!original) continue;
      if (locale === "uz-Cyrl") node.nodeValue = transliterateUzbek(original);
      else if (locale !== "uz-Latn" && dictionary[original]?.[index])
        node.nodeValue = node.nodeValue.replace(original, dictionary[original][index]);
    }
    for (const element of $$('[placeholder],[aria-label],[title]')) {
      if (element.matches("[data-slot],[data-field]")) continue;
      for (const attribute of ["placeholder", "aria-label", "title"]) {
        const original = element.getAttribute(attribute);
        if (!original) continue;
        if (locale === "uz-Cyrl") element.setAttribute(attribute, transliterateUzbek(original));
        else if (locale !== "uz-Latn" && dictionary[normalize(original)]?.[index])
          element.setAttribute(attribute, dictionary[normalize(original)][index]);
      }
    }
  }

  function transliterateUzbek(value) {
    return value
      .replace(/o['‘’ʻ`]/gi, (letter) => letter[0] === letter[0].toUpperCase() ? "Ў" : "ў")
      .replace(/g['‘’ʻ`]/gi, (letter) => letter[0] === letter[0].toUpperCase() ? "Ғ" : "ғ")
      .replace(/sh/gi, (letters) => letters === letters.toUpperCase() ? "Ш" : letters[0] === letters[0].toUpperCase() ? "Ш" : "ш")
      .replace(/ch/gi, (letters) => letters === letters.toUpperCase() ? "Ч" : letters[0] === letters[0].toUpperCase() ? "Ч" : "ч")
      .replace(/yo/gi, (letters) => letters === letters.toUpperCase() ? "Ё" : letters[0] === letters[0].toUpperCase() ? "Ё" : "ё")
      .replace(/yu/gi, (letters) => letters === letters.toUpperCase() ? "Ю" : letters[0] === letters[0].toUpperCase() ? "Ю" : "ю")
      .replace(/ya/gi, (letters) => letters === letters.toUpperCase() ? "Я" : letters[0] === letters[0].toUpperCase() ? "Я" : "я")
      .replace(/[a-z]/gi, (letter) => {
        const map = { a: "а", b: "б", c: "с", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ", r: "р", s: "с", t: "т", u: "у", v: "в", w: "в", x: "х", y: "й", z: "з" };
        const result = map[letter.toLowerCase()] || letter;
        return letter === letter.toUpperCase() ? result.toUpperCase() : result;
      });
  }

  function fillSlots(data) {
    for (const element of $$('[data-slot]')) {
      const value = pathValue(data, element.dataset.slot);
      element.textContent = safeText(value);
      if (!safeText(value)) element.hidden = true;
      else element.hidden = false;
    }
    $$(".hero__amp").forEach((element) => { element.hidden = !data.bride; });
  }

  function hrefFor(contact) {
    if (contact.href) return contact.href;
    if (contact.type === "phone") return `tel:${safeText(contact.value).replace(/[\s()-]/g, "")}`;
    if (contact.type === "telegram") return `https://t.me/${safeText(contact.value).replace(/^@/, "")}`;
    return "";
  }

  function renderList(name, items) {
    const hosts = $$(`[data-list="${name}"]`);
    for (const host of hosts) {
      const model = $("template", host);
      if (!model) continue;
      $$('[data-generated="true"]', host).forEach((node) => node.remove());
      for (const item of Array.isArray(items) ? items : []) {
        const fragment = model.content.cloneNode(true);
        for (const element of fragment.querySelectorAll("[data-field]"))
          element.textContent = safeText(pathValue(item, element.dataset.field));
        for (const element of fragment.querySelectorAll("[data-field-attr]")) {
          for (const mapping of element.dataset.fieldAttr.split(",")) {
            const [attribute, field] = mapping.split(":").map((part) => part.trim());
            const value = field === "href" && name === "contacts" ? hrefFor(item) : pathValue(item, field);
            if (attribute && value != null && value !== "") element.setAttribute(attribute, safeText(value));
          }
        }
        if (name === "gallery") {
          const image = fragment.querySelector("img");
          const picture = safeText(item.src);
          if (image && picture) image.src = picture;
          if (image && !picture) {
            image.alt = "";
            image.setAttribute("aria-hidden", "true");
            const placeholder = document.createElement("span");
            placeholder.className = "gallery__placeholder-icon";
            placeholder.setAttribute("aria-hidden", "true");
            placeholder.textContent = "✦";
            fragment.querySelector(".gallery__slide")?.append(placeholder);
          }
          if (image && item.caption) image.dataset.caption = item.caption;
        }
        for (const child of Array.from(fragment.children)) child.dataset.generated = "true";
        host.append(fragment);
      }
    }
  }

  function renderCalendar(data) {
    const host = $(`[data-calendar]`);
    if (!host || !data.date?.year || !data.date?.monthNumber) return;
    const locale = config.locale;
    const weekdayNames = locale === "uz-Cyrl"
      ? ["Ду", "Се", "Чо", "Па", "Жу", "Ша", "Як"]
      : locale === "uz-Latn"
        ? ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"]
        : Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 5 + index))));
    const year = Number(data.date.year);
    const month = Number(data.date.monthNumber) - 1;
    const day = Number(data.date.day);
    const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const title = locale.startsWith("uz") ? months[locale][month] : new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, month, 15)));
    host.replaceChildren();
    const top = document.createElement("div");
    top.className = "calendar-top";
    const monthEl = document.createElement("span");
    monthEl.className = "calendar-month";
    monthEl.textContent = title;
    const yearEl = document.createElement("span");
    yearEl.className = "calendar-year";
    yearEl.textContent = String(year);
    top.append(monthEl, yearEl);
    const weekdays = document.createElement("div");
    weekdays.className = "calendar-weekdays";
    weekdayNames.forEach((label) => { const item = document.createElement("span"); item.textContent = label; weekdays.append(item); });
    const days = document.createElement("div");
    days.className = "calendar-days";
    for (let i = 0; i < offset; i++) { const blank = document.createElement("span"); blank.className = "calendar-day is-empty"; blank.setAttribute("aria-hidden", "true"); days.append(blank); }
    for (let n = 1; n <= total; n++) { const item = document.createElement("span"); item.className = `calendar-day${n === day ? " is-event" : ""}`; item.textContent = String(n); if (n === day) item.setAttribute("aria-current", "date"); days.append(item); }
    host.append(top, weekdays, days);
  }

  function setupCountdown(data) {
    if (countdownTimer) clearInterval(countdownTimer);
    const clocks = $$("[data-countdown]");
    if (!clocks.length) return;
    const target = data.dateTime ? new Date(data.dateTime).getTime() : NaN;
    const update = () => {
      const delta = Number.isFinite(target) ? target - Date.now() : 0;
      const values = { days: Math.max(0, Math.floor(delta / 86400000)), hours: Math.max(0, Math.floor(delta / 3600000) % 24), minutes: Math.max(0, Math.floor(delta / 60000) % 60), seconds: Math.max(0, Math.floor(delta / 1000) % 60) };
      clocks.forEach((clock) => {
        const past = !Number.isFinite(target) || delta <= 0;
        clock.classList.toggle("is-past", past);
        clock.querySelectorAll("[data-unit]").forEach((unit) => { if (unit.dataset.unit in values) unit.textContent = String(values[unit.dataset.unit]).padStart(2, "0"); });
        clock.querySelectorAll("[data-countdown-past]").forEach((message) => { message.hidden = !past; });
      });
    };
    update();
    if (Number.isFinite(target) && target > Date.now()) countdownTimer = setInterval(update, 1000);
  }

  function updateRsvpDeadline(data) {
    const element = $("[data-rsvp-deadline]");
    if (!element) return;
    if (config.preview) {
      element.textContent = localized[config.locale].preview;
      return;
    }
    if (!data.rsvp?.deadline) return;
    const pieces = data.rsvp.deadline.split("-");
    const monthIndex = Number(pieces[1]) - 1;
    const date = config.locale.startsWith("uz")
      ? `${Number(pieces[2])} ${months[config.locale][monthIndex]}`
      : new Intl.DateTimeFormat(config.locale === "ru" ? "ru-RU" : "en-GB", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(Number(pieces[0]), monthIndex, Number(pieces[2]))));
    element.textContent = localized[config.locale].rsvpDeadline(date);
  }

  function hideEmptySections(data) {
    const has = {
      program: data.program?.length,
      gallery: config.preview || data.gallery?.length,
      contacts: data.contacts?.length,
      wishes: data.wishesEnabled,
      rsvp: data.rsvp?.enabled,
      toyona: data.toyona?.enabled && data.toyona.cardNumber,
      venue: data.venue?.name || data.venue?.address || data.venue?.lat != null || data.venue?.lng != null,
    };
    for (const [name, visible] of Object.entries(has)) {
      const section = $(`[data-section="${name}"]`);
      if (section) section.hidden = !visible;
    }
    const hasPoint = data.venue?.lat != null && data.venue?.lng != null;
    const frame = $(".venue__frame");
    if (frame) frame.hidden = !hasPoint; // No venue-photo field exists yet; coordinates enable the original map panel.
    const toggle = $("[data-map-toggle]");
    if (toggle) toggle.hidden = !hasPoint;
  }

  function createLanguageSelector() {
    $(".mh-lang")?.remove();
    const locales = config.enabledLocales || [];
    if (locales.length < 2) return;
    const nav = document.createElement("nav");
    nav.className = "mh-lang";
    nav.setAttribute("aria-label", config.locale === "ru" ? "Язык приглашения" : config.locale === "en" ? "Invitation language" : config.locale === "uz-Cyrl" ? "Таклифнома тили" : "Taklifnoma tili");
    locales.forEach((locale) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = languageName(locale);
      button.classList.toggle("is-active", locale === config.locale);
      button.setAttribute("aria-pressed", String(locale === config.locale));
      button.addEventListener("click", () => window.parent.postMessage({ type: "anor:language", locale }, location.origin));
      nav.append(button);
    });
    document.body.append(nav);
  }

  function setMapLinks(data) {
    const venue = data.venue || {};
    const hasPoint = venue.lat != null && venue.lng != null && Number.isFinite(Number(venue.lat)) && Number.isFinite(Number(venue.lng));
    $$('[data-map]').forEach((link) => {
      if (!hasPoint && !venue.mapUrl) { link.hidden = true; return; }
      const fallback = hasPoint
        ? (link.dataset.map === "yandex" ? `https://yandex.com/maps/?pt=${venue.lng},${venue.lat}&z=16&l=map` : `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`)
        : venue.mapUrl;
      link.href = hasPoint ? fallback : venue.mapUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function showToast(message) {
    const toast = $("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  async function postJson(path, payload) {
    const response = await fetch(path, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error?.message || body.message || localized[config.locale].error);
    return body;
  }

  function setupForms(data) {
    const rsvp = $("[data-rsvp]");
    if (rsvp) {
      const nameInput = rsvp.querySelector('[name="name"]');
      if (config.guestName && nameInput) nameInput.value = config.guestName;
      const choices = $$('[data-rsvp-choice]', rsvp);
      choices.forEach((choice) => choice.addEventListener("click", () => {
        selectedStatus = choice.dataset.rsvpChoice || "";
        choices.forEach((item) => item.setAttribute("aria-pressed", String(item === choice)));
      }));
      const output = $(`[data-party-count]`, rsvp);
      $$('[data-party-step]', rsvp).forEach((button) => button.addEventListener("click", () => {
        partySize = Math.max(1, Math.min(data.rsvp?.maxPartySize || 10, partySize + Number(button.dataset.partyStep)));
        if (output) output.textContent = String(partySize);
      }));
      const form = rsvp;
      const submit = $(`[data-rsvp-submit]`, rsvp);
      if (config.preview) {
        form.addEventListener("submit", (event) => event.preventDefault());
        if (submit) submit.disabled = true;
        rsvp.querySelectorAll("input,button[data-rsvp-choice],button[data-party-step]").forEach((control) => { control.disabled = true; });
      } else form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!selectedStatus || !nameInput?.value.trim()) { showToast(localized[config.locale].error); return; }
        if (submit) submit.disabled = true;
        try {
          const answer = await postJson(`/api/public/invitations/${encodeURIComponent(config.invitationId)}/rsvp`, {
            name: nameInput.value.trim(), status: selectedStatus,
            partySize: selectedStatus === "yes" ? partySize : 0,
            ...(config.guestToken ? { guestToken: config.guestToken } : {}),
          });
          const summary = $(`[data-rsvp-summary]`, rsvp);
          if (summary) summary.textContent = selectedStatus === "yes" ? localized[config.locale].coming(partySize) : selectedStatus === "no" ? localized[config.locale].decline : localized[config.locale].maybe;
          $(`[data-rsvp-form]`, rsvp).hidden = true;
          $(`[data-rsvp-done]`, rsvp).hidden = false;
          app.emit("rsvp", { status: selectedStatus, partySize, response: answer });
        } catch (error) {
          showToast(error instanceof Error ? error.message : localized[config.locale].error);
        } finally { if (submit) submit.disabled = false; }
      });
      const change = $(`[data-rsvp-change]`, rsvp);
      change?.addEventListener("click", () => {
        $(`[data-rsvp-form]`, rsvp).hidden = false;
        $(`[data-rsvp-done]`, rsvp).hidden = true;
      });
    }
    const wishForm = $("[data-wishes-form]");
    if (wishForm) {
      const nameInput = wishForm.querySelector('[name="name"]');
      if (config.guestName && nameInput) nameInput.value = config.guestName;
      const feedback = $(`[data-wishes-feedback]`, wishForm);
      const submit = wishForm.querySelector('[type="submit"]');
      if (config.preview) {
        if (feedback) feedback.textContent = localized[config.locale].preview;
        if (submit) submit.disabled = true;
        wishForm.querySelectorAll("input,textarea").forEach((control) => { control.disabled = true; });
      } else wishForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = new FormData(wishForm);
        if (submit) submit.disabled = true;
        if (feedback) feedback.textContent = "";
        try {
          await postJson(`/api/public/invitations/${encodeURIComponent(config.invitationId)}/wishes`, {
            name: String(form.get("name") || "").trim(),
            message: String(form.get("text") || "").trim(),
            ...(config.guestToken ? { guestToken: config.guestToken } : {}),
          });
          if (feedback) feedback.textContent = localized[config.locale].wishThanks;
          wishForm.reset();
          app.emit("wish");
        } catch (error) { if (feedback) feedback.textContent = error instanceof Error ? error.message : localized[config.locale].error; }
        finally { if (submit) submit.disabled = false; }
      });
    }
    if (!config.preview && data.wishesEnabled && config.invitationId) {
      fetch(`/api/public/invitations/${encodeURIComponent(config.invitationId)}/wishes`, { credentials: "same-origin" })
        .then((response) => response.ok ? response.json() : null)
        .then((result) => { if (result?.wishes) { data.wishes = result.wishes.map((wish) => ({ name: wish.name, text: wish.message })); renderList("wishes", data.wishes); } })
        .catch(() => {});
    }
  }

  function setupMusic(data) {
    const audio = $("[data-music]");
    const button = $("[data-music-toggle]");
    const url = data.music && typeof data.music === "object" ? data.music.url : data.music;
    const enabled = (data.music && typeof data.music === "object" ? data.music.enabled : Boolean(url)) && Boolean(url);
    if (!audio || !button) return;
    const update = () => {
      const words = localized[config.locale];
      button.setAttribute("aria-label", audio.paused ? words.musicOn : words.musicOff);
      button.setAttribute("aria-pressed", String(!audio.paused));
      button.classList.toggle("is-playing", !audio.paused);
    };
    if (!button.dataset.bound) {
      audio.addEventListener("play", update);
      audio.addEventListener("pause", update);
      button.addEventListener("click", async () => {
        if (audio.paused) {
          musicManuallyPaused = false;
          try { sessionStorage.removeItem(`anor:music-paused:${config.invitationId}`); } catch (_) {}
          try { await audio.play(); } catch { showToast(localized[config.locale].musicOn); }
        } else {
          musicManuallyPaused = true;
          try { sessionStorage.setItem(`anor:music-paused:${config.invitationId}`, "true"); } catch (_) {}
          audio.pause();
        }
      });
      button.dataset.bound = "true";
    }
    if (!enabled) {
      audio.pause();
      audio.removeAttribute("src");
      audio.hidden = true;
      button.hidden = true;
      update();
      return;
    }
    if (audio.getAttribute("src") !== url) audio.src = url;
    audio.hidden = false;
    button.hidden = false;
    update();
  }

  function startMusic() {
    const audio = $("[data-music]");
    if (!audio?.src || musicStarted || musicManuallyPaused || (config?.preview && !config?.catalogMusic)) return;
    musicStarted = true;
    audio.play().catch(() => showToast(localized[config.locale].musicOn));
  }

  function setupCopy(data) {
    $$('[data-copy="toyona.cardNumber"]').forEach((button) => button.addEventListener("click", async () => {
      const value = safeText(data.toyona?.cardNumber);
      if (!value) return;
      try { await navigator.clipboard.writeText(value); showToast(config.locale === "ru" ? "Скопировано" : config.locale === "en" ? "Copied" : config.locale === "uz-Cyrl" ? "Нусхаланди" : "Nusxalandi"); }
      catch { showToast(config.locale === "ru" ? "Не удалось скопировать" : config.locale === "en" ? "Could not copy" : "Nusxa olinmadi"); }
    }));
  }

  function setupGallery() {
    if (!$("#gallery-preview-placeholder-style")) {
      const style = document.createElement("style");
      style.id = "gallery-preview-placeholder-style";
      style.textContent = ".gallery__slide .gallery__placeholder-icon{position:absolute;inset:0;display:grid;place-items:center;color:var(--gold,#c6a66b);font-size:clamp(2.5rem,12vw,5rem);line-height:1;pointer-events:none}.gallery__slide img[aria-hidden=\"true\"]{visibility:hidden}";
      document.head.append(style);
    }
    const track = $(".gallery__track");
    const dots = $("[data-gallery-dots]");
    const updateDots = () => {
      if (!track || !dots) return;
      const slides = $$(".gallery__slide", track);
      dots.replaceChildren();
      slides.forEach((slide, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `gallery-dot${index === 0 ? " is-active" : ""}`;
        dot.setAttribute("aria-label", `${config.locale === "ru" ? "Фото" : config.locale === "en" ? "Photo" : config.locale === "uz-Cyrl" ? "Сурат" : "Surat"} ${index + 1}`);
        dot.setAttribute("aria-current", String(index === 0));
        dot.addEventListener("click", () => slide.scrollIntoView({ behavior: app.reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" }));
        dots.append(dot);
      });
    };
    const openImage = (initialIndex, trigger) => {
      const slides = $$(".gallery__slide", track);
      if (!slides.length) return;
      let index = initialIndex;
      const lightbox = document.createElement("div");
      lightbox.className = "marhamat-lightbox";
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-label", config.locale === "ru" ? "Фотография" : config.locale === "en" ? "Photograph" : config.locale === "uz-Cyrl" ? "Сурат" : "Surat");
      const close = document.createElement("button");
      close.className = "lightbox-close";
      close.type = "button";
      close.setAttribute("aria-label", config.locale === "ru" ? "Закрыть" : config.locale === "en" ? "Close" : config.locale === "uz-Cyrl" ? "Ёпиш" : "Yopish");
      close.textContent = "×";
      const previous = document.createElement("button");
      previous.className = "lightbox-prev";
      previous.type = "button";
      previous.setAttribute("aria-label", config.locale === "ru" ? "Предыдущее фото" : config.locale === "en" ? "Previous photo" : config.locale === "uz-Cyrl" ? "Олдинги сурат" : "Oldingi surat");
      previous.textContent = "‹";
      const stage = document.createElement("div");
      stage.className = "lightbox-stage";
      const copy = document.createElement("img");
      stage.append(copy);
      const next = document.createElement("button");
      next.className = "lightbox-next";
      next.type = "button";
      next.setAttribute("aria-label", config.locale === "ru" ? "Следующее фото" : config.locale === "en" ? "Next photo" : config.locale === "uz-Cyrl" ? "Кейинги сурат" : "Keyingi surat");
      next.textContent = "›";
      const caption = document.createElement("p");
      caption.className = "lightbox-caption";
      const show = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        const image = $("img", slides[index]);
        if (!image) return;
        copy.src = image.currentSrc || image.src;
        copy.alt = image.alt;
        caption.textContent = image.dataset.caption || "";
        caption.hidden = !caption.textContent;
      };
      show(index);
      previous.hidden = slides.length < 2;
      next.hidden = slides.length < 2;
      previous.addEventListener("click", () => show(index - 1));
      next.addEventListener("click", () => show(index + 1));
      lightbox.append(close, previous, stage, next, caption);
      document.body.append(lightbox);
      const previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      let key;
      const dismiss = () => {
        lightbox.remove();
        document.documentElement.style.overflow = previousOverflow;
        removeEventListener("keydown", key);
        trigger?.focus();
      };
      close.addEventListener("click", dismiss);
      lightbox.addEventListener("click", (event) => { if (event.target === lightbox) dismiss(); });
      key = (event) => {
        if (event.key === "Escape") dismiss();
        else if (event.key === "ArrowLeft") show(index - 1);
        else if (event.key === "ArrowRight") show(index + 1);
      };
      addEventListener("keydown", key);
      close.focus();
    };
    if (track && !track.dataset.lightboxBound) track.addEventListener("click", (event) => {
      const button = event.target.closest(".gallery__slide");
      const image = button?.querySelector("img");
      if (image?.src) openImage($$(".gallery__slide", track).indexOf(button), button);
    });
    if (track) track.dataset.lightboxBound = "true";
    $$('[data-gallery-prev],[data-gallery-next]').forEach((button) => { if (button.dataset.bound) return; button.dataset.bound = "true"; button.addEventListener("click", () => {
      if (!track) return;
      const slides = $$(".gallery__slide", track);
      if (!slides.length) return;
      const direction = button.hasAttribute("data-gallery-prev") ? -1 : 1;
      const center = track.scrollLeft + track.clientWidth / 2;
      const current = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center) < Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - center) ? index : best, 0);
      const target = slides[(current + direction + slides.length) % slides.length];
      target.scrollIntoView({ behavior: app.reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
    }); });
    updateDots();
    if (track && !track.dataset.dotsBound) {
      track.addEventListener("scroll", () => {
        const slides = $$(".gallery__slide", track);
        if (!slides.length || !dots) return;
        const center = track.scrollLeft + track.clientWidth / 2;
        const nearest = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center) < Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - center) ? index : best, 0);
        $$(".gallery-dot", dots).forEach((dot, index) => { dot.classList.toggle("is-active", index === nearest); dot.setAttribute("aria-current", String(index === nearest)); });
      }, { passive: true });
      track.dataset.dotsBound = "true";
    }
  }

  function setupCalendarDownload(data) {
    const button = $("[data-ics]");
    if (!button) return;
    button.hidden = !data.dateTime;
    if (button.dataset.bound) return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      const start = new Date(app.data.dateTime);
      if (!Number.isFinite(start.getTime())) return;
      const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
      const escape = (value) => safeText(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
      const utc = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Taklifnoma//Invitation//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:${encodeURIComponent(config.invitationId || "preview")}@taklifnoma`, `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(start)}`, `DTEND:${utc(end)}`, `SUMMARY:${escape(`${data.groom} & ${data.bride} — ${data.eventType}`)}`, `LOCATION:${escape([data.venue?.name, data.venue?.address].filter(Boolean).join(", "))}`, "END:VEVENT", "END:VCALENDAR"];
      const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "taklifnoma.ics";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    });
  }

  function render(nextData) {
    if (!app.ready && config.invitationId) {
      try { musicManuallyPaused = sessionStorage.getItem(`anor:music-paused:${config.invitationId}`) === "true"; } catch (_) {}
    }
    const data = app.data;
    for (const key of Object.keys(data)) if (!(key in nextData)) delete data[key];
    Object.assign(data, nextData);
    if (!app.ready) translateStaticText(config.locale);
    document.documentElement.lang = config.locale === "uz-Latn" ? "uz" : config.locale;
    app.lang = config.locale.startsWith("uz") ? "uz" : config.locale;
    app.reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    fillSlots(data);
    renderList("program", data.program);
    renderList("gallery", data.gallery);
    renderList("contacts", data.contacts);
    renderList("wishes", data.wishes || []);
    hideEmptySections(data);
    renderCalendar(data);
    setupCountdown(data);
    updateRsvpDeadline(data);
    setMapLinks(data);
    setupCalendarDownload(data);
    if (!app.ready) {
      createLanguageSelector();
      setupForms(data);
      setupCopy(data);
    }
    setupMusic(data);
    setupGallery();
  }

  addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.source !== parent) return;
    if (event.data?.type !== "taklifnoma:initialize" || !event.data.payload) return;
    config = event.data.payload;
    if (!config.data || !config.locale) return;
    render(config.data);
    if (!app.ready) {
      app.ready = true;
      app.emit("ready", app);
    }
  });
})();
