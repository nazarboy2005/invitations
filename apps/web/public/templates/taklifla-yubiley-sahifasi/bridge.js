/* Platform data/API adapter. The source CSS, SVG and reveal engine stay isolated. */
(() => {
  "use strict";
  const TYPE = "taklifla-yubiley-sahifasi";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const labels = {
    "uz-Latn": {
      scroll: "Pastga torting", founder: "Asoschidan", history: "Bosib o‘tilgan yo‘l", story: "Tariximiz sahifalari", numbers: "Raqamlarda", agenda: "Kun tartibi", stages: "Marosim bosqichlari", venue: "Marosim joyi", confirmation: "Tasdiqlash", rsvp: "Ishtirokingizni bildiring", description: "Bayramda sizni ko‘rishdan mamnun bo‘lamiz. Ishtirokingiz haqida ma’lumot bering.", deadline: "Javob berish muddati: ", date: "Sana", time: "Vaqt", yes: "Ishtirok etaman", no: "Kela olmayman", name: "Ism va familiya", org: "Tashkilot yoki lavozim", note: "Qo‘shimcha ma’lumot (ixtiyoriy)", send: "Yuborish", sending: "Yuborilmoqda…", required: "Ism va familiyangizni kiriting.", preview: "Bu namuna. Javob yuborilmaydi.", error: "Javob yuborilmadi. Qayta urinib ko‘ring.", success: "Rahmat! Javobingiz saqlandi.", closed: "Javob yuborish muddati tugagan.", music: "Musiqa", pause: "Pauza", audioError: "Musiqa yuklanmadi", language: "Til", footer: "Visol bilan yaratildi",
    },
    "uz-Cyrl": {
      scroll: "Пастга тортинг", founder: "Асосчидан", history: "Босиб ўтилган йўл", story: "Тарихимиз саҳифалари", numbers: "Рақамларда", agenda: "Кун тартиби", stages: "Маросим босқичлари", venue: "Маросим жойи", confirmation: "Тасдиқлаш", rsvp: "Иштирокингизни билдиринг", description: "Байрамда сизни кўришдан мамнун бўламиз. Иштирокингиз ҳақида маълумот беринг.", deadline: "Жавоб бериш муддати: ", date: "Сана", time: "Вақт", yes: "Иштирок этаман", no: "Кела олмайман", name: "Исм ва фамилия", org: "Ташкилот ёки лавозим", note: "Қўшимча маълумот (ихтиёрий)", send: "Юбориш", sending: "Юборилмоқда…", required: "Исм ва фамилиянгизни киритинг.", preview: "Бу намуна. Жавоб юборилмайди.", error: "Жавоб юборилмади. Қайта уриниб кўринг.", success: "Раҳмат! Жавобингиз сақланди.", closed: "Жавоб юбориш муддати тугаган.", music: "Мусиқа", pause: "Пауза", audioError: "Мусиқа юкланмади", language: "Тил", footer: "Visol билан яратилди",
    },
    en: {
      scroll: "Scroll down", founder: "From the founder", history: "The path travelled", story: "Pages of our history", numbers: "In numbers", agenda: "Programme", stages: "Stages of the ceremony", venue: "Venue", confirmation: "Confirmation", rsvp: "Let us know you are coming", description: "We will be glad to see you at the celebration. Please let us know whether you can attend.", deadline: "Reply by: ", date: "Date", time: "Time", yes: "Attending", no: "Cannot attend", name: "Name and surname", org: "Organisation or position", note: "Additional note (optional)", send: "Send", sending: "Sending…", required: "Enter your name and surname.", preview: "This is a preview. No response is sent.", error: "Your response was not sent. Please try again.", success: "Thank you! Your response was saved.", closed: "The response deadline has passed.", music: "Music", pause: "Pause", audioError: "Music could not load", language: "Language", footer: "Made with Visol",
    },
    ru: {
      scroll: "Прокрутите вниз", founder: "От основателя", history: "Пройденный путь", story: "Страницы нашей истории", numbers: "В цифрах", agenda: "Программа дня", stages: "Этапы торжества", venue: "Место проведения", confirmation: "Подтверждение", rsvp: "Сообщите о своём участии", description: "Будем рады видеть вас на празднике. Пожалуйста, сообщите о своём участии.", deadline: "Ответьте до: ", date: "Дата", time: "Время", yes: "Буду", no: "Не смогу", name: "Имя и фамилия", org: "Организация или должность", note: "Дополнительно (необязательно)", send: "Отправить", sending: "Отправка…", required: "Введите имя и фамилию.", preview: "Это образец. Ответ не отправляется.", error: "Ответ не отправлен. Повторите попытку.", success: "Спасибо! Ваш ответ сохранён.", closed: "Срок отправки ответа истёк.", music: "Музыка", pause: "Пауза", audioError: "Не удалось загрузить музыку", language: "Язык", footer: "Создано с Visol",
    },
  };
  let current = null;
  let busy = false;
  let requestEpoch = 0;
  let submitted = false;
  let feedbackKey = "";
  let audioStarted = false;
  let userPaused = false;
  const audio = $("#bgMusic");
  const musicButton = $("#taklifla-music-btn");
  const menu = $(".taklifla-lang-switch");
  const attend = $("#rsvp-attend");
  const text = (selector, value) => { const el = $(selector); if (el) el.textContent = value || ""; };
  const visible = (selector, value) => { $(selector).hidden = !value; };
  const dictionary = () => labels[current?.locale] || labels["uz-Latn"];
  const message = (key) => {
    feedbackKey = key;
    text("#rsvp-thanks", dictionary()[key]);
    visible("#rsvp-thanks", true);
    $("#rsvp-thanks").setAttribute("role", key === "error" || key === "required" ? "alert" : "status");
  };
  function row(className, values, id) {
    const el = document.createElement("div");
    el.className = className;
    el.dataset.itemId = id;
    for (const [tag, name, value] of values) {
      const child = document.createElement(tag);
      child.className = name;
      child.textContent = value || "";
      child.hidden = !value;
      el.append(child);
    }
    return el;
  }
  function musicState() {
    const playing = !audio.paused;
    const word = audio.error ? dictionary().audioError : playing ? dictionary().pause : dictionary().music;
    text(".taklifla-music-label", word);
    musicButton.setAttribute("aria-label", word);
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.classList.toggle("playing", playing);
  }
  function tryPlay() {
    if (!current?.music?.enabled || current.silentPlayback || userPaused || audioStarted) return;
    audio.play().catch(() => { musicState(); });
  }
  function render(data) {
    const previous = current;
    current = data;
    const t = dictionary();
    document.documentElement.lang = data.locale;
    document.documentElement.toggleAttribute("data-reduced-motion", Boolean(data.reducedMotion));
    document.title = data.company || "Yubiley sahifasi";
    text(".hero-eyebrow", data.greeting);
    text(".hero-25", data.years); visible(".hero-25", data.years !== null);
    text(".hero-25-sub", data.eventLabel);
    text(".hero-company", data.company);
    text(".hero-tagline", data.title);
    text(".scroll-hint", t.scroll);
    text(".founder-eyebrow", t.founder);
    text(".founder-quote", data.message);
    text(".founder-sig", data.hosts);
    text(".founder-name", data.founderRole);
    text(".founder-role", data.company);
    visible(".founder", data.message || data.hosts);
    text(".timeline-head .eyebrow", t.history);
    text(".timeline-head h2", t.story);
    const chapters = data.story.filter((chapter) => chapter.title || chapter.text);
    $(".timeline-rail").replaceChildren(...chapters.map((chapter) => row("ms", [
      ["span", "ms-year", chapter.year], ["div", "ms-title", chapter.title], ["div", "ms-desc", chapter.text],
    ], chapter.id)));
    visible(".timeline", chapters.length);
    text(".numbers-eyebrow", t.numbers);
    $(".numbers-grid").replaceChildren(...data.statistics.map(item=>row("stat",[["div","stat-val",item.value],["div","stat-label",item.label]],item.id)));
    $$(".stat-val").forEach(node=>{if(node.textContent.endsWith("+")){const value=node.textContent;node.textContent=value.slice(0,-1);const plus=document.createElement("span");plus.className="plus";plus.textContent="+";node.append(plus);}});
    visible(".numbers", data.statistics.length);
    const map = $(".venue-map"); map.href=data.mapUrl || "#"; map.hidden=!data.mapUrl;
    map.setAttribute("aria-label", "Google Maps");

    text(".agenda-head .eyebrow", t.agenda);
    text(".agenda-head h2", data.programHeading || t.stages);
    $(".agenda-list").replaceChildren(...data.program.map((item, index) => {
      const el = document.createElement("div"); el.className = "ag"; el.dataset.itemId = item.id;
      const number = document.createElement("div"); number.className = "ag-num"; number.textContent = String(index + 1).padStart(2, "0");
      const content = row("ag-content", [["div", "ag-time", item.time], ["div", "ag-title", item.title], ["div", "ag-desc", item.description]], item.id);
      el.append(number, content); return el;
    }));
    visible(".agenda", data.program.length);
    text(".venue-eyebrow", t.venue);
    text(".venue-name", data.venueName);
    text(".venue-addr", data.address);
    visible(".venue", data.venueName || data.address || data.mapUrl);
    visible(".hero-meta", data.date || data.time);
    visible(".venue-meta", data.date || data.time);
    $$(".hero-meta-val").forEach((el, index) => el.textContent = index ? data.time : data.date);
    $$(".venue-meta-val").forEach((el, index) => el.textContent = index ? data.time : data.date);
    $$(".hero-meta .label, .venue-meta-label").forEach((el, index) => el.textContent = index % 2 ? t.time : t.date);
    text(".rsvp-head .eyebrow", t.confirmation);
    text(".rsvp-head h2", t.rsvp);
    text(".rsvp-head .body", t.description + (data.rsvp.deadline ? " " + t.deadline + data.rsvp.deadline : ""));
    $$(".rsvp-attend label span").forEach((el, index) => el.textContent = index ? t.no : t.yes);
    for (const [id, key] of [["rsvp-name", "name"], ["rsvp-org", "org"], ["rsvp-note", "note"]]) {
      const el = $("#" + id); el.placeholder = t[key]; el.setAttribute("aria-label", t[key]);
    }
    // Organisation is a source field. Persist it inside the API's approved note field.
    $("#rsvp-org").hidden = false; $("#rsvp-org").disabled = false;
    text("#rsvp-submit span", busy ? t.sending : t.send);
    const changedInvitation = previous && previous.invitationId !== data.invitationId;
    if (changedInvitation) {
      requestEpoch++; busy = false; submitted = false; feedbackKey = "";
      for (const id of ["rsvp-name", "rsvp-org", "rsvp-note"]) $("#" + id).value = "";
      attend.querySelector('[value="yes"]').checked = true;
      $$(".rsvp-attend label").forEach((el) => el.classList.toggle("on", el.dataset.val === "yes"));
    }
    if ((!previous || changedInvitation) && data.guestName) $("#rsvp-name").value = data.guestName;
    let today = "";
    try { today = new Intl.DateTimeFormat("en-CA", { timeZone: data.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); } catch { /* API validates deadlines too. */ }
    const closed = data.rsvp.deadline && data.rsvp.deadline < today;
    visible(".rsvp", data.rsvp.enabled);
    visible("#rsvp-form", !submitted && !closed);
    visible("#rsvp-thanks", submitted || closed || feedbackKey);
    if (closed) message("closed"); else if (feedbackKey) message(feedbackKey);
    $("#rsvp-submit").disabled = busy || Boolean(closed);
    text(".closing-25", data.years); visible(".closing-25", data.years !== null);
    text(".closing-25-sub", data.eventLabel);
    text(".closing-company", data.company);
    text(".closing-meta", [data.date, data.time, data.venueName].filter(Boolean).join(" · "));
    text(".footer-text", t.footer);
    menu.setAttribute("aria-label", t.language);
    $(".taklifla-lang-toggle").setAttribute("aria-label", t.language);
    $$("[data-locale]").forEach((el) => {
      el.hidden = !data.enabledLocales.includes(el.dataset.locale);
      el.classList.toggle("active", el.dataset.locale === data.locale);
      el.setAttribute("aria-checked", String(el.dataset.locale === data.locale));
    });
    text(".taklifla-lang-current", { "uz-Latn": "Uz", "uz-Cyrl": "Уз", en: "En", ru: "Ru" }[data.locale]);
    menu.hidden = data.enabledLocales.length < 2;
    const musicUrl = data.music.enabled ? data.music.url : "";
    if (audio.getAttribute("src") !== musicUrl) {
      audio.pause(); audioStarted = false; userPaused = false;
      if (musicUrl) audio.src = musicUrl; else audio.removeAttribute("src");
    }
    musicButton.hidden = !musicUrl || data.silentPlayback;
    if (data.silentPlayback || !musicUrl) audio.pause();
    musicState();
    document.body.dataset.ready = "true";
    if (!data.preview) tryPlay();
  }
  window.addEventListener("message", (event) => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== TYPE + ":update") return;
    const data = event.data.payload;
    if (!data || !labels[data.locale] || !Array.isArray(data.enabledLocales) || !data.enabledLocales.includes(data.locale)) return;
    render(data);
  });
  function openMenu(open) {
    menu.classList.toggle("open", open);
    $(".taklifla-lang-toggle").setAttribute("aria-expanded", String(open));
  }
  $(".taklifla-lang-toggle").addEventListener("click", () => openMenu(!menu.classList.contains("open")));
  menu.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-locale]");
    if (!choice || !current?.enabledLocales.includes(choice.dataset.locale)) return;
    parent.postMessage({ type: TYPE + ":locale", locale: choice.dataset.locale }, location.origin);
    openMenu(false); $(".taklifla-lang-toggle").focus();
  });
  document.addEventListener("click", (event) => { if (!menu.contains(event.target)) openMenu(false); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) { openMenu(false); $(".taklifla-lang-toggle").focus(); }
  });
  attend.addEventListener("change", () => {
    $$(".rsvp-attend label").forEach((label) => label.classList.toggle("on", label.querySelector("input").checked));
  });
  $("#rsvp-submit").addEventListener("click", async () => {
    if (!current || busy || submitted) return;
    const name = $("#rsvp-name").value.trim();
    if (!name) { message("required"); $("#rsvp-name").focus(); return; }
    if (current.preview || !current.invitationId) { message("preview"); return; }
    const epoch = ++requestEpoch;
    const status = attend.querySelector("input:checked").value;
    const organisation = $("#rsvp-org").value.trim();
    const note = [organisation ? dictionary().org + ": " + organisation : "", $("#rsvp-note").value.trim()].filter(Boolean).join("\n");
    busy = true; $("#rsvp-submit").disabled = true; text("#rsvp-submit span", dictionary().sending);
    try {
      const response = await fetch("/api/public/invitations/" + encodeURIComponent(current.invitationId) + "/rsvp", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status, partySize: status === "yes" ? 1 : 0, note, guestToken: current.guestToken || undefined }),
      });
      const result = await response.json();
      if (epoch !== requestEpoch) return;
      if (!response.ok || result.ok !== true) throw new Error("RSVP rejected");
      submitted = true; visible("#rsvp-form", false); message("success");
    } catch { if (epoch === requestEpoch) message("error"); }
    finally {
      if (epoch === requestEpoch) { busy = false; $("#rsvp-submit").disabled = false; text("#rsvp-submit span", dictionary().send); }
    }
  });
  musicButton.addEventListener("click", () => {
    if (!audio.paused) { userPaused = true; audio.pause(); }
    else { userPaused = false; audio.play().catch(() => musicState()); }
  });
  audio.addEventListener("playing", () => { audioStarted = true; musicState(); });
  for (const event of ["pause", "error", "ended"]) audio.addEventListener(event, musicState);
  document.addEventListener("pointerdown", event=>{if(!event.target.closest("#taklifla-music-btn"))tryPlay();});
  document.addEventListener("keydown", tryPlay);
})();
