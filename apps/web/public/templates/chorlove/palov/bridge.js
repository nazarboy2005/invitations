(() => {
  "use strict";

  const templateId = "palov";
  const root = document.querySelector(".palov-page");
  const one = (selector, base = root) => base?.querySelector(selector) ?? null;
  const all = (selector, base = root) => [...(base?.querySelectorAll(selector) ?? [])];
  const setText = (selector, value, base = root) => {
    const node = one(selector, base);
    if (node) node.textContent = value == null ? "" : String(value);
    return node;
  };
  const hide = (node, value = true) => {
    if (node) node.hidden = Boolean(value);
  };

  const translations = {
    "uz-Latn": {
      title: "Nahorgi osh", subtitle: "marosimiga taklif etamiz", hosts: "Mezbonlar",
      invitation: "Taklifnoma", scroll: "Pastga suring", dear: "Aziz mehmon!",
      withRespect: "Hurmat bilan", until: "Tadbirgacha", days: "Kun", hours: "Soat",
      minutes: "Daqiqa", seconds: "Soniya", started: "Marosim boshlandi — sizni kutamiz!",
      time: "Vaqt", starts: "boshlanadi", address: "Manzil", map: "Xaritada ko‘rish",
      confirmation: "Tasdiqlash", willCome: "Kelasizmi?", rsvpLead: "Iltimos, javobingizni bildiring.",
      yourName: "Ismingiz", fullName: "Ism va familiyangiz", yourAnswer: "Javobingiz",
      yes: "Kelaman", no: "Kela olmayman", send: "Yuborish", sending: "Yuborilmoqda…",
      thankYou: "Rahmat", lookForward: "Sizni kutib qolamiz.", thankAnswer: "Javobingiz uchun rahmat.",
      change: "Javobni o‘zgartirish", ourTable: "Dasturxonimiz sizni kutmoqda",
      phone: "Telefon raqam", play: "Musiqani yoqish", pause: "Musiqani o‘chirish",
      preview: "Bu faqat ko‘rish rejimi.", required: "Ismingizni kiriting va javobingizni tanlang.",
      failed: "Javob yuborilmadi. Qayta urinib ko‘ring.", at: "soat",
    },
    "uz-Cyrl": {
      title: "Наҳорги ош", subtitle: "маросимига таклиф этамиз", hosts: "Мезбонлар",
      invitation: "Таклифнома", scroll: "Пастга суринг", dear: "Азиз меҳмон!",
      withRespect: "Ҳурмат билан", until: "Тадбиргача", days: "Кун", hours: "Соат",
      minutes: "Дақиқа", seconds: "Сония", started: "Маросим бошланди — сизни кутамиз!",
      time: "Вақт", starts: "бошланади", address: "Манзил", map: "Харитада кўриш",
      confirmation: "Тасдиқлаш", willCome: "Келасизми?", rsvpLead: "Илтимос, жавобингизни билдиринг.",
      yourName: "Исмингиз", fullName: "Исм ва фамилиянгиз", yourAnswer: "Жавобингиз",
      yes: "Келаман", no: "Кела олмайман", send: "Юбориш", sending: "Юборилмоқда…",
      thankYou: "Раҳмат", lookForward: "Сизни кутиб қоламиз.", thankAnswer: "Жавобингиз учун раҳмат.",
      change: "Жавобни ўзгартириш", ourTable: "Дастурхонимиз сизни кутмоқда",
      phone: "Телефон рақами", play: "Мусиқани ёқиш", pause: "Мусиқани ўчириш",
      preview: "Бу фақат кўриш режими.", required: "Исмингизни киритинг ва жавобингизни танланг.",
      failed: "Жавоб юборилмади. Қайта уриниб кўринг.", at: "соат",
    },
    en: {
      title: "Morning osh", subtitle: "celebration invitation", hosts: "Hosts",
      invitation: "Invitation", scroll: "Scroll down", dear: "Dear guest!",
      withRespect: "With respect", until: "Until the event", days: "Days", hours: "Hours",
      minutes: "Minutes", seconds: "Seconds", started: "The event has started — we are waiting for you!",
      time: "Time", starts: "starts", address: "Address", map: "View on map",
      confirmation: "Confirmation", willCome: "Will you come?", rsvpLead: "Please let us know your answer.",
      yourName: "Your name", fullName: "Your full name", yourAnswer: "Your answer",
      yes: "I will come", no: "I can’t come", send: "Send", sending: "Sending…",
      thankYou: "Thank you", lookForward: "We look forward to seeing you.", thankAnswer: "Thank you for your answer.",
      change: "Change answer", ourTable: "Our table awaits you",
      phone: "Phone number", play: "Play music", pause: "Pause music",
      preview: "Preview only.", required: "Enter your name and choose an answer.",
      failed: "Your response could not be sent. Please try again.", at: "at",
    },
    ru: {
      title: "Утренний плов", subtitle: "приглашаем на торжество", hosts: "Хозяева торжества",
      invitation: "Приглашение", scroll: "Прокрутите вниз", dear: "Дорогой гость!",
      withRespect: "С уважением", until: "До мероприятия", days: "Дней", hours: "Часов",
      minutes: "Минут", seconds: "Секунд", started: "Мероприятие началось — мы вас ждём!",
      time: "Время", starts: "начало", address: "Адрес", map: "Посмотреть на карте",
      confirmation: "Подтверждение", willCome: "Вы придёте?", rsvpLead: "Пожалуйста, сообщите ваш ответ.",
      yourName: "Ваше имя", fullName: "Имя и фамилия", yourAnswer: "Ваш ответ",
      yes: "Приду", no: "Не смогу прийти", send: "Отправить", sending: "Отправка…",
      thankYou: "Спасибо", lookForward: "Будем ждать вас.", thankAnswer: "Спасибо за ваш ответ.",
      change: "Изменить ответ", ourTable: "Наш стол ждёт вас",
      phone: "Телефон", play: "Включить музыку", pause: "Выключить музыку",
      preview: "Только предварительный просмотр.", required: "Введите имя и выберите ответ.",
      failed: "Ответ не отправлен. Попробуйте ещё раз.", at: "в",
    },
  };

  let state = null;
  let answer = "";
  let countdownTimer = 0;
  let sent = false;
  let sending = false;
  let revealObserver = null;
  let statusNode;
  let thanksNode;

  const text = (key) => (translations[state?.locale] ?? translations["uz-Latn"])[key] ?? key;
  const safeHttpUrl = (value) => {
    try {
      const url = new URL(value, location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  };

  function addResponseControls() {
    const form = one(".palov-form");
    if (!form) return;
    statusNode = document.createElement("p");
    statusNode.className = "palov-form-error";
    statusNode.setAttribute("role", "status");
    statusNode.setAttribute("aria-live", "polite");
    statusNode.hidden = true;
    form.append(statusNode);

    const thanks = document.createElement("div");
    thanks.className = "palov-thanks";
    thanks.hidden = true;
    thanks.setAttribute("aria-live", "polite");
    thanks.innerHTML = '<svg aria-hidden="true" viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="29" fill="none" stroke="#F1CF86" stroke-width="1.6"></circle><path d="M21 33l8 8l14 -16" fill="none" stroke="#FAF4E6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg><h3></h3><p></p><button type="button" class="palov-again"></button>';
    form.after(thanks);
    thanksNode = thanks;
    one(".palov-again", thanks).addEventListener("click", () => {
      sent = false;
      answer = "";
      all(".palov-radio").forEach((radio) => { radio.checked = false; });
      syncRsvpState();
    });

    all(".palov-radio", form).forEach((radio) => radio.addEventListener("change", () => {
      answer = radio.value;
      syncRsvpState();
    }));
    one(".palov-send-btn", form)?.addEventListener("click", submitRsvp);
    one("#palov-guest-name", form)?.addEventListener("input", () => {
      if (statusNode) statusNode.hidden = true;
    });
  }

  function syncRsvpState() {
    const form = one(".palov-form");
    const send = one(".palov-send-btn", form);
    const input = one("#palov-guest-name", form);
    hide(form, sent);
    hide(thanksNode, !sent);
    if (send) {
      send.disabled = sending;
      send.textContent = sending ? text("sending") : text("send");
    }
    if (sent && thanksNode) {
      const name = input?.value.trim() ?? "";
      setText("h3", `${text("thankYou")}${name ? `, ${name}` : ""}!`, thanksNode);
      setText("p", answer === "yes" ? text("lookForward") : text("thankAnswer"), thanksNode);
      setText(".palov-again", text("change"), thanksNode);
    }
  }

  async function submitRsvp() {
    if (!state || sending || sent) return;
    if (state.preview) {
      statusNode.textContent = text("preview");
      statusNode.hidden = false;
      return;
    }
    const input = one("#palov-guest-name");
    const name = input?.value.trim() ?? "";
    if (!name || !answer) {
      statusNode.textContent = text("required");
      statusNode.hidden = false;
      return;
    }
    statusNode.hidden = true;
    sending = true;
    syncRsvpState();
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(state.invitationId || "")}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          status: answer,
          partySize: answer === "yes" ? 1 : 0,
          guestToken: state.guestToken || undefined,
        }),
      });
      if (!response.ok) throw new Error("RSVP request failed");
      sent = true;
    } catch {
      statusNode.textContent = text("failed");
      statusNode.hidden = false;
    } finally {
      sending = false;
      syncRsvpState();
    }
  }

  function updateCountdown() {
    const target = Date.parse(state?.data?.dateTime ?? "");
    const section = one(".palov-countdown");
    if (!Number.isFinite(target)) { hide(section); return; }
    hide(section, false);
    const remaining = target - Date.now();
    if (remaining <= 0) {
      const grid = one(".palov-cd-grid", section);
      if (grid) grid.innerHTML = `<p class="palov-cd-done">${text("started")}</p>`;
      return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    const values = [
      Math.floor(totalSeconds / 86400),
      Math.floor((totalSeconds % 86400) / 3600),
      Math.floor((totalSeconds % 3600) / 60),
      totalSeconds % 60,
    ];
    all(".palov-cd-num", section).forEach((node, index) => { node.textContent = String(values[index] ?? 0).padStart(2, "0"); });
  }

  function setupReveal() {
    const nodes = all('[style*="opacity:0"][style*="translateY(28px)"]');
    const scroller = one(".palov-page");
    nodes.forEach((node) => node.classList.add("palov-reveal"));
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    if (revealObserver) return;
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver?.unobserve(entry.target);
      });
    }, { root: scroller, threshold: 0.2 });
    nodes.forEach((node) => {
      const bounds = node.getBoundingClientRect();
      const rootBounds = scroller?.getBoundingClientRect() ?? {
        top: 0, right: innerWidth, bottom: innerHeight, left: 0,
      };
      const visibleWidth = Math.max(0, Math.min(bounds.right, rootBounds.right, innerWidth) - Math.max(bounds.left, rootBounds.left, 0));
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, rootBounds.bottom, innerHeight) - Math.max(bounds.top, rootBounds.top, 0));
      const visibleRatio = (visibleWidth * visibleHeight) / Math.max(1, bounds.width * bounds.height);
      if (visibleRatio >= 0.2) node.classList.add("is-visible");
      else revealObserver?.observe(node);
    });
  }

  function setupMusic(data) {
    const audio = document.querySelector(".palov-audio");
    const button = document.querySelector("#palov-music-button");
    const url = data?.music?.enabled ? safeHttpUrl(data.music.url) : "";
    const control = document.querySelector(".palov-music-control");
    hide(control, !url);
    if (control && url) {
      control.style.position = "fixed";
      control.style.right = "2rem";
      control.style.bottom = "2rem";
      control.style.zIndex = "110";
    }
    if (!audio || !button) return;
    audio.pause();
    audio.removeAttribute("src");
    if (!url) return;
    audio.src = url;
    let playing = false;
    const updateIcon = () => {
      button.setAttribute("aria-label", playing ? text("pause") : text("play"));
      button.innerHTML = playing
        ? '<svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></svg>'
        : '<svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"></path></svg>';
    };
    updateIcon();
    button.onclick = async () => {
      if (playing) {
        audio.pause();
        playing = false;
      } else {
        try {
          await audio.play();
          playing = true;
        } catch {
          playing = false;
          button.title = text("play");
        }
      }
      updateIcon();
    };
  }

  function render(next) {
    state = next;
    const data = next.data ?? {};
    const locale = translations[next.locale] ? next.locale : "uz-Latn";
    const date = data.date ?? {};
    const venue = data.venue ?? {};
    const hosts = data.hosts?.trim() ?? "";
    const names = [data.groom, data.bride].filter(Boolean).join(" & ");

    document.documentElement.lang = locale;
    document.documentElement.dir = "ltr";
    setText(".palov-kicker", text("invitation"));
    setText(".palov-h1-big", data.title?.trim() || text("title"));
    setText(".palov-h1-sub", text("subtitle"));
    setText(".palov-hosts-label", text("hosts"));
    setText(".palov-hosts-name", hosts || names);
    hide(one(".palov-hosts"), !hosts && !names);
    setText(".palov-hero-date-day", [date.day, date.month].filter(Boolean).join(" "));
    setText(".palov-hero-date-time", date.time ? `${text("at")} ${date.time}` : "");
    hide(one(".palov-hero-date-day"), !date.day && !date.short);
    hide(one(".palov-hero-date-time"), !date.time);
    setText(".palov-scroll-hint span", text("scroll"));
    setText(".palov-intro-title", data.greeting?.trim() || text("dear"));
    setText(".palov-intro-text", data.message?.trim() || "");
    hide(one(".palov-intro-text"), !data.message?.trim());
    setText(".palov-intro-sign-pre", text("withRespect"));
    setText(".palov-intro-sign", hosts || names);
    hide(one(".palov-intro-sign-pre"), !hosts && !names);
    hide(one(".palov-intro-sign"), !hosts && !names);
    setText(".palov-label", text("until"));
    setText(".palov-time-big", date.time ?? "");
    setText(".palov-time-cap", text("starts"));
    setText(".palov-time-date", date.long ?? date.short ?? "");
    hide(one(".palov-when"), !date.time && !date.short && !date.long);
    const caps = all(".palov-cd-cap");
    ["days", "hours", "minutes", "seconds"].forEach((key, index) => { if (caps[index]) caps[index].textContent = text(key); });

    setText(".palov-where .palov-label", text("address"));
    setText(".palov-place-name", venue.name ?? "");
    setText(".palov-place-addr", venue.address ?? "");
    hide(one(".palov-place-name"), !venue.name);
    hide(one(".palov-place-addr"), !venue.address);
    const map = one(".palov-map-btn");
    const mapUrl = safeHttpUrl(venue.mapUrl ?? "");
    if (map) { map.href = mapUrl || "#"; map.rel = "noopener noreferrer"; map.target = "_blank"; }
    hide(map, !mapUrl);
    setText(".palov-map-btn span", text("map"));
    hide(one(".palov-where"), !venue.name && !venue.address && !mapUrl);

    const plateImage = one(".palov-plate-img img");
    const uploaded = data.gallery?.find((item) => item.src?.trim());
    if (plateImage) {
      plateImage.src = uploaded?.src || "/templates/chorlove/palov/assets/palov.png";
      plateImage.alt = uploaded?.alt || uploaded?.caption || "";
      plateImage.classList.toggle("palov-spin", !uploaded);
    }
    setText(".palov-rsvp .palov-label", text("confirmation"));
    setText(".palov-rsvp-head h2", text("willCome"));
    setText(".palov-rsvp-head p", data.rsvp?.enabled ? text("rsvpLead") : "");
    hide(one(".palov-rsvp-head p"), !data.rsvp?.enabled);
    hide(one(".palov-rsvp"), !data.rsvp?.enabled);
    const nameInput = one("#palov-guest-name");
    if (nameInput) {
      nameInput.value = next.guestName || "";
      nameInput.readOnly = Boolean(next.guestName);
      nameInput.placeholder = text("fullName");
      one('label[for="palov-guest-name"]')?.replaceChildren(document.createTextNode(text("yourName")));
    }
    const legend = one(".palov-form legend");
    if (legend) legend.textContent = text("yourAnswer");
    all(".palov-opt-b").forEach((node, index) => { node.textContent = text(index ? "no" : "yes"); });
    setText(".palov-footer-caption", text("ourTable"));
    setText(".palov-footer-label", text("withRespect"));
    setText(".palov-footer-name", hosts || names);
    hide(one(".palov-footer-label"), !hosts && !names);
    hide(one(".palov-footer-name"), !hosts && !names);
    setText(".palov-footer-date", date.short ?? "");
    hide(one(".palov-footer-date"), !date.short);

    const contacts = data.contacts ?? [];
    const telegram = contacts.find((contact) => contact.type === "telegram");
    const phone = contacts.find((contact) => contact.type === "phone");
    const socialLinks = all(".palov-soc");
    const setContact = (node, contact, label) => {
      if (!node) return;
      const href = contact?.href ?? "";
      node.href = href.startsWith("tel:") ? href : safeHttpUrl(href);
      node.setAttribute("aria-label", label);
      hide(node, !contact || !node.href);
    };
    setContact(socialLinks[0], telegram, "Telegram");
    const instagram = contacts.find((contact) => contact.type === "instagram");
    setContact(socialLinks[1], instagram, "Instagram");
    setContact(socialLinks[2], phone, text("phone"));
    hide(one(".palov-socials"), !telegram && !instagram && !phone);

    const reduced = Boolean(next.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.toggle("palov-reduced-motion", reduced);
    setupReveal();
    updateCountdown();
    clearInterval(countdownTimer);
    countdownTimer = window.setInterval(updateCountdown, 1000);
    setupMusic(data);
    syncRsvpState();
  }

  addResponseControls();
  addEventListener("message", (event) => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== `${templateId}:update`) return;
    render(event.data.payload ?? {});
  });
  try {
    const initial = JSON.parse(window.name);
    if (initial?.type === `${templateId}:update`) render(initial.payload ?? {});
  } catch { /* Empty invitation state until the host sends its payload. */ }
})();
