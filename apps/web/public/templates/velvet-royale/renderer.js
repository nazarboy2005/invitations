/* The captured reference markup and stylesheet are kept separate from this data bridge. */
import confetti from "./source/reference/C94ZD2ww.js";
(() => {
  const root = document.getElementById("invitation");
  const asset = (name) => `/templates/velvet-royale/source/reference/${name}`;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).has("qaReducedMotion");
  const language = { uz: "uz-Latn", "uz-Cyrl": "uz-Cyrl", en: "en", ru: "ru" };
  const words = {
    "uz-Latn": { invitation: "Taklifnoma", guest: "Hurmatli mehmon", date: "Sanani eslab qoling", venue: "To‘yxona manzili", map: "Xaritada ochish", gift: "To‘yona", contact: "Ma’lumot uchun", reply: "Ishtirokingizni tasdiqlang", name: "Ismingiz", attend: "To‘yimizda ishtirok etasizmi?", yes: "Qatnashaman", no: "Qatnasha olmayman", phone: "Telefon", wish: "Tilak", submit: "Javobni yuborish", family: "Hurmat bilan", closing: "Tashrifingizni kutib qolamiz", copy: "Raqamni nusxalash", copied: "Nusxalandi", preview: "Ko‘rish rejimida javob yuborilmaydi.", thanks: "Rahmat!", error: "Yuborilmadi. Qayta urinib ko‘ring.", days: ["Kun", "Soat", "Daqiqa", "Soniya"], weekdays: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"] },
    "uz-Cyrl": { invitation: "Таклифнома", guest: "Ҳурматли меҳмон", date: "Санани эслаб қолинг", venue: "Тўйхона манзили", map: "Харитада очиш", gift: "Тўёна", contact: "Маълумот учун", reply: "Иштирокингизни тасдиқланг", name: "Исмингиз", attend: "Тўйимизда иштирок этасизми?", yes: "Қатнашаман", no: "Қатнаша олмайман", phone: "Телефон", wish: "Тилак", submit: "Жавобни юбориш", family: "Ҳурмат билан", closing: "Ташрифингизни кутиб қоламиз", copy: "Рақамни нусхалаш", copied: "Нусхаланди", preview: "Кўриш режимида жавоб юборилмайди.", thanks: "Раҳмат!", error: "Юборилмади. Қайта уриниб кўринг.", days: ["Кун", "Соат", "Дақиқа", "Сония"], weekdays: ["Ду", "Се", "Чо", "Па", "Жу", "Ша", "Як"] },
    en: { invitation: "Invitation", guest: "Dear guest", date: "Save the date", venue: "Venue", map: "Open in Google Maps", gift: "Gift", contact: "Contact", reply: "Confirm your attendance", name: "Your name", attend: "Will you attend?", yes: "I will attend", no: "I cannot attend", phone: "Phone", wish: "Your wish", submit: "Send response", family: "With respect", closing: "We look forward to seeing you", copy: "Copy card number", copied: "Copied", preview: "Preview only.", thanks: "Thank you!", error: "Could not send. Please try again.", days: ["Days", "Hours", "Minutes", "Seconds"], weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] },
    ru: { invitation: "Приглашение", guest: "Дорогой гость", date: "Сохраните дату", venue: "Место проведения", map: "Открыть в Google Картах", gift: "Подарок", contact: "Контакты", reply: "Подтвердите участие", name: "Ваше имя", attend: "Вы придёте?", yes: "Приду", no: "Не смогу", phone: "Телефон", wish: "Пожелание", submit: "Отправить ответ", family: "С уважением", closing: "Будем рады видеть вас", copy: "Скопировать номер карты", copied: "Скопировано", preview: "Только предварительный просмотр.", thanks: "Спасибо!", error: "Не удалось отправить. Попробуйте снова.", days: ["Дней", "Часов", "Минут", "Секунд"], weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] }
  };
  let current = {}, opened = false, timer, observer, galleryIndex = 0;
  let audio = null, audioSource = "", audioStarted = false, audioPaused = false;
  let cleanups = [];
  const later = (callback, delay) => { const id = setTimeout(callback, delay); cleanups.push(() => clearTimeout(id)); return id; };
  const q = (selector) => root.querySelector(selector);
  const qa = (selector) => [...root.querySelectorAll(selector)];
  const put = (id, value) => { const el = q(`[data-editable-id="${id}"]`); if (el) el.textContent = value || ""; };
  const show = (selector, yes) => { const el = q(selector); if (el) el.hidden = !yes; };
  const element = (tag, className, text) => { const el = document.createElement(tag); el.className = className; el.textContent = text; return el; };
  const localAsset = (name) => asset(`couple-gallery-v20261021-0${name}.webp`);
  const source = Promise.all([
    fetch("/templates/velvet-royale/template.html").then(response => { if (!response.ok) throw new Error("Velvet Royale source unavailable"); return response.text(); }),
    fetch("/templates/velvet-royale/source/labels.json").then(response => { if (!response.ok) throw new Error("Velvet Royale labels unavailable"); return response.json(); })
  ]);

  // CalendarCard's 750 ms lead-in, 70 ms steps and three confetti bursts are
  // ported from Cn3YHNzc.js. The captured particle engine runs unchanged.
  function calendarMotion() {
    const calendar = q(".calendar"), active = q(".calendar__day--active");
    if (!calendar || !active) return;
    if (reduced) { active.classList.add("calendar__day--revealed"); return; }
    let done = false, fire;
    const burst = () => {
      const canvas = document.createElement("canvas"); canvas.setAttribute("aria-hidden", "true");
      canvas.style.cssText = "position:fixed;inset:0 0 auto;width:min(100%,450px);height:100dvh;margin-inline:auto;pointer-events:none;z-index:100";
      root.append(canvas); fire = confetti.create(canvas, { resize: true });
      cleanups.push(() => { fire.reset(); canvas.remove(); });
      const bounds = active.getBoundingClientRect(), rect = canvas.getBoundingClientRect();
      const origin = { x: (bounds.left + bounds.width / 2 - rect.left) / rect.width, y: (bounds.top + bounds.height / 2 - rect.top) / rect.height };
      const roses = ["#c9968b", "#e5c4ba", "#a26d61", "#fbf5e4"], gold = ["#b08e5e", "#d4b98a", "#7f6340"], leaves = ["#9db088", "#c4cfb5"];
      fire({ particleCount: 105, spread: 88, startVelocity: 36, origin, colors: [...roses, ...gold, ...leaves], scalar: .9, ticks: 220 });
      later(() => fire({ particleCount: 50, spread: 120, startVelocity: 24, origin, colors: [...gold, ...roses], scalar: 1.05, shapes: ["star"], ticks: 250 }), 170);
      later(() => { fire({ particleCount: 28, angle: 60, spread: 50, startVelocity: 40, origin: { x: Math.max(0, origin.x - .13), y: origin.y }, colors: roses }); fire({ particleCount: 28, angle: 120, spread: 50, startVelocity: 40, origin: { x: Math.min(1, origin.x + .13), y: origin.y }, colors: leaves }); }, 300);
    };
    const watcher = new IntersectionObserver(entries => {
      if (done || !opened || !entries.some(entry => entry.isIntersecting)) return;
      done = true; watcher.disconnect();
      const cells = qa(".calendar__day:not(.calendar__day--empty)");
      for (let index = 0; index < cells.length; index++) {
        const cell = cells[index]; later(() => { cell.classList.add("calendar__day--lit"); if (cell === active) { active.classList.add("calendar__day--revealed"); burst(); } }, 750 + index * 70);
        if (cell === active) break;
      }
    }, { threshold: .35 });
    watcher.observe(calendar); cleanups.push(() => watcher.disconnect());
  }

  function animate() {
    observer?.disconnect();
    if (reduced) { qa(".bloom-reveal,.fade-reveal,.slide-reveal,.ink-drop").forEach(el => el.classList.add("visible")); return; }
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      setTimeout(() => node.classList.add("visible"), Number(node.dataset.delay || 0));
      observer.unobserve(node);
    }), { threshold: .08, rootMargin: "0px 0px -30px 0px" });
    qa(".bloom-reveal,.fade-reveal,.slide-reveal,.ink-drop").forEach(el => observer.observe(el));
  }

  function renderCalendar(data, label) {
    const date = data.date || {}, month = Number(date.monthNumber), year = Number(date.year), day = Number(date.day);
    put("calendar-main-month", date.month); put("calendar-main-year", date.year);
    put("calendar-main-active-day", date.day); put("calendar-main-dayname", date.weekday); put("calendar-main-time", date.time);
    const time = q(".calendar__time"); if (time) time.dateTime = date.time || "";
    const weekdays = q(".calendar__weekdays");
    if (weekdays) qa(".calendar__weekdays span").forEach((el, i) => { el.textContent = label.weekdays[i]; });
    const grid = q(".calendar__grid"); if (!grid) return;
    grid.replaceChildren();
    if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year)) return;
    const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
    for (let i = 0; i < offset; i++) grid.append(element("span", "calendar__day calendar__day--empty", ""));
    const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
    for (let i = 1; i <= length; i++) {
      const cell = element("span", `calendar__day${i === day ? " calendar__day--active" : ""}`, String(i));
      cell.setAttribute("data-v-492ea706", ""); grid.append(cell);
    }
    while (grid.children.length % 7) { const cell = element("span", "calendar__day calendar__day--empty", ""); cell.setAttribute("data-v-492ea706", ""); grid.append(cell); }
    const start = Date.parse(data.dateTime || "");
    if (Number.isFinite(start)) {
      const format = value => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
      const link = element("a", "velvet-calendar-action", data.locale === "en" ? "Add to calendar" : data.locale === "ru" ? "Добавить в календарь" : "Taqvimga qo‘shish");
      link.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${data.groom || ""} & ${data.bride || ""}`)}&dates=${format(start)}/${format(start + 7200000)}&location=${encodeURIComponent([data.venue?.name, data.venue?.address].filter(Boolean).join(", "))}`;
      link.target = "_blank"; link.rel = "noopener noreferrer"; q(".section-datetime")?.append(link);
    }
    if (data.program?.length) {
      const list = element("ol", "velvet-program", "");
      data.program.forEach(item => { const li = element("li", "", ""); li.append(element("time", "", item.time || ""), element("span", "", item.title || "")); list.append(li); });
      q(".section-datetime")?.append(list);
    }
  }

  function renderGallery(data, label) {
    const authored = (data.gallery || []).filter(photo => photo.src);
    const photos = authored.length ? authored : data.catalogPreview ? Array.from({ length: 6 }, (_, i) => ({ src: localAsset(i + 1), alt: "" })) : [];
    show(".section-photo-story", photos.length > 0);
    if (!photos.length) return;
    put("gallery-eyebrow", label.source.gallery.eyebrow);
    const opening = q(".section-photo-story__opening img"); opening.src = photos[0].src; opening.alt = photos[0].alt || photos[0].caption || "";
    if (photos[0].caption) q(".section-photo-story__opening").after(element("p", "velvet-gallery-opening-caption", photos[0].caption));
    q(".section-photo-story__signature").textContent = `${data.groom || ""} & ${data.bride || ""}`;
    const reel = q(".section-photo-story__reel"), sample = reel.querySelector(".section-photo-story__chapter"); reel.replaceChildren();
    q(".section-photo-story__album").hidden = photos.length < 2;
    const swipe = q(".section-photo-story__swipe"); swipe.firstChild.textContent = label.source.gallery.swipe + " ";
    galleryIndex = 0;
    const index = q(".section-photo-story__index"); index.replaceChildren();
    photos.slice(1).forEach((photo, i) => {
      const chapter = sample.cloneNode(true); const number = String(i + 2).padStart(2, "0");
      chapter.querySelector("img").src = photo.src; chapter.querySelector("img").alt = photo.alt || photo.caption || "";
      chapter.querySelector(".section-photo-story__number").textContent = number;
      chapter.dataset.itemId = photo.id || String(i + 1);
      chapter.setAttribute("aria-label", `${i + 2} / ${photos.length}`);
      if (photo.caption) chapter.querySelector("figcaption").append(element("span", "velvet-gallery-caption", photo.caption));
      reel.append(chapter);
      const button = element("button", "", number); button.type = "button"; button.setAttribute("data-v-8bc6912a", ""); button.setAttribute("aria-label", `${i + 2} / ${photos.length}`);
      button.onclick = () => { pause(); move(i); }; index.append(button);
    });
    const arrows = qa(".section-photo-story__arrow"); arrows[0].setAttribute("aria-label", label.source.gallery.previous); arrows[1].setAttribute("aria-label", label.source.gallery.next);
    reel.setAttribute("aria-label", label.source.gallery.photos); q(".section-photo-story").setAttribute("aria-label", label.source.gallery.photos);
    arrows[0].onclick = () => { pause(); move(galleryIndex - 1); }; arrows[1].onclick = () => { pause(); move(galleryIndex + 1); };
    const offset = i => reel.children[i] ? reel.children[i].offsetLeft - reel.children[0].offsetLeft : 0;
    function move(next) { galleryIndex = Math.max(0, Math.min(reel.children.length - 1, next)); reel.scrollTo({ left: offset(galleryIndex), behavior: reduced ? "instant" : "smooth" }); sync(); }
    function sync() { [...index.children].forEach((button, i) => { button.classList.toggle("is-active", i === galleryIndex); button.setAttribute("aria-current", String(i === galleryIndex)); }); arrows[0].disabled = galleryIndex === 0; arrows[1].disabled = galleryIndex >= reel.children.length - 1; q(".section-photo-story__status").textContent = `${label.source.gallery.photo} ${galleryIndex + 2} ${label.source.gallery.of} ${photos.length}`; }
    reel.addEventListener("scroll", () => { let distance = Infinity; [...reel.children].forEach((_, i) => { const next = Math.abs(reel.scrollLeft - offset(i)); if (next < distance) { galleryIndex = i; distance = next; } }); sync(); }, { passive: true });
    let inView = false, focused = false, pausedUntil = 0, auto;
    const canAdvance = () => !reduced && opened && inView && !document.hidden && !focused && reel.children.length > 1;
    function schedule(wait = 3800) {
      clearTimeout(auto);
      if (canAdvance()) auto = setTimeout(() => { if (!canAdvance()) return; move(galleryIndex >= reel.children.length - 1 ? 0 : galleryIndex + 1); schedule(); }, Math.max(wait, pausedUntil - Date.now()));
    }
    function pause() { pausedUntil = Date.now() + 6000; schedule(6000); }
    reel.addEventListener("pointerdown", pause, { passive: true });
    reel.addEventListener("wheel", event => { if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) pause(); }, { passive: true });
    const album = q(".section-photo-story__album");
    album.addEventListener("focusin", () => { focused = true; clearTimeout(auto); }); album.addEventListener("focusout", event => { focused = event.relatedTarget instanceof Node && album.contains(event.relatedTarget); pause(); });
    reel.addEventListener("keydown", event => { const next = { ArrowRight: galleryIndex + 1, ArrowLeft: galleryIndex - 1, Home: 0, End: reel.children.length - 1 }[event.key]; if (next != null) { event.preventDefault(); pause(); move(next); } });
    const watcher = new IntersectionObserver(entries => { inView = !!entries[0]?.isIntersecting && entries[0].intersectionRatio >= .5; schedule(); }, { threshold: [0, .5, 1] }); watcher.observe(reel);
    const visibility = () => schedule(); document.addEventListener("visibilitychange", visibility);
    cleanups.push(() => { watcher.disconnect(); clearTimeout(auto); document.removeEventListener("visibilitychange", visibility); });
    sync();
  }

  function renderVenue(data, label) {
    const venue = data.venue || {}, present = !!(venue.name || venue.address || venue.mapUrl || (venue.lat != null && venue.lng != null));
    show(".section-venue", present); if (!present) return;
    put("venue-eyebrow", label.source.sections.ceremony); put("venue-title", label.source.sections.venueAddress); put("venue-name", venue.name); put("venue-address", venue.address);
    let query = venue.lat != null && venue.lng != null ? `${venue.lat},${venue.lng}` : "", navigation = "";
    try {
      const url = new URL(venue.mapUrl || "");
      if (/^(www\.)?google\.[a-z.]+$/.test(url.hostname) || url.hostname === "maps.google.com" || url.hostname === "maps.app.goo.gl" || url.hostname === "goo.gl") {
        navigation = url.href;
        const encodedPoint = url.pathname.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
        query = url.searchParams.has("query_place_id") && query ? query : url.searchParams.get("query") || url.searchParams.get("q") || url.searchParams.get("destination") || (encodedPoint ? `${encodedPoint[1]},${encodedPoint[2]}` : query);
        // A newly pasted short link can supersede an older stored pin. Its
        // destination is unknown here, so never display that older pin beside it.
        if (url.hostname === "maps.app.goo.gl" || url.hostname === "goo.gl") query = "";
      }
    } catch { /* A blank manual URL is valid while editing. */ }
    if (!query && !navigation) query = [venue.name, venue.address].filter(Boolean).join(", ");
    const map = q(".section-venue iframe"), action = q(".section-venue__action");
    if (query) {
      map.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      action.href = navigation || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      action.querySelector("span").textContent = label.map; map.title = label.venue;
      show(".section-venue__map", true); action.hidden = false;
    } else { map.removeAttribute("src"); show(".section-venue__map", false); action.hidden = !navigation; if (navigation) { action.href = navigation; action.querySelector("span").textContent = label.map; } }
  }

  function renderGift(data, label) {
    const gift = data.toyona || {}, visible = gift.enabled && !!gift.cardNumber;
    show(".section-card", visible); if (!visible) return;
    put("gift-eyebrow", label.source.sections.gift); put("gift-title", label.source.gift.title); put("gift-desc", gift.note || label.source.gift.desc);
    const digits = String(gift.cardNumber).replace(/\D/g, "");
    put("gift-bank", digits.startsWith("8600") ? "UZCARD" : digits.startsWith("9860") ? "HUMO" : digits.startsWith("4") ? "Visa" : /^5[1-5]/.test(digits) ? "Mastercard" : "");
    put("gift-card-number", digits.match(/.{1,4}/g)?.join(" ") || gift.cardNumber); put("gift-card-holder-label", label.source.gift.cardHolder); put("gift-card-holder", gift.cardHolder);
    const copy = q(".section-card__copy"); copy.lastChild.textContent = ` ${label.copy}`;
    copy.onclick = async () => { try { await navigator.clipboard.writeText(gift.cardNumber); q(".section-card__copy").lastChild.textContent = ` ${label.copied}`; } catch { q(".section-card__copy").lastChild.textContent = ` ${gift.cardNumber}`; } };
  }

  function renderContacts(data, label) {
    const contacts = data.contacts || []; show(".section-contact", contacts.length > 0);
    if (!contacts.length) return;
    put("contact-eyebrow", label.source.sections.contact); put("contact-title", label.source.contact.label);
    const list = q(".section-contact__cards"), sample = list.querySelector("a"); list.replaceChildren();
    contacts.forEach((contact, index) => {
      const card = sample.cloneNode(true); card.href = contact.href || `tel:${String(contact.value || "").replace(/\s/g, "")}`;
      const type = contact.type || (card.href.includes("t.me/") ? "telegram" : card.href.includes("instagram.com/") ? "instagram" : "phone");
      const icon = q(`template[data-velvet-contact="${type}"]`)?.content.firstElementChild;
      if (icon) card.querySelector(".section-contact__icon").replaceWith(icon.cloneNode(true));
      if (type !== "phone") { card.target = "_blank"; card.rel = "noopener noreferrer"; }
      card.dataset.delay = String(200 + index * 120);
      card.querySelector(".section-contact__type").textContent = contact.label || label.phone; card.querySelector(".section-contact__value").textContent = contact.value || ""; list.append(card);
    });
  }

  function renderRsvp(data, label) {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: data.timezone || "Asia/Tashkent", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    const attendanceEnabled = !!data.rsvp?.enabled && !(data.rsvp.deadline && data.rsvp.deadline < today);
    const enabled = !!(attendanceEnabled || data.wishesEnabled); show(".section-rsvp", enabled); if (!enabled) return;
    const labels = { rsvpEyebrow: `— ${label.source.copy.rsvpEyebrow} —`, rsvpTitle: label.reply, rsvpDescription: label.source.copy.rsvpDescription, rsvpName: label.name, rsvpAttendance: label.source.copy.rsvpAttendance, rsvpYes: label.yes, rsvpNo: label.no, rsvpPhone: label.phone, rsvpWish: label.wish };
    Object.entries(labels).forEach(([key, value]) => put(key, value));
    q(".section-rsvp__submit span").textContent = label.submit;
    q(".section-rsvp__notice").textContent = "";
    const form = q(".section-rsvp__form"), radios = qa('.section-rsvp input[type="radio"]');
    radios[0].value = "yes"; radios[1].value = "no";
    q(".section-rsvp__attendance").hidden = !attendanceEnabled;
    q('input[name="phone"]').closest("label").hidden = !attendanceEnabled;
    q('#manor-rsvp-v-0-1-wish').closest("label").hidden = !data.wishesEnabled;
    q('#manor-rsvp-v-0-1-wish').maxLength = 500;
    const maxPartySize = Math.max(1, Number(data.rsvp?.maxPartySize) || 1);
    if (attendanceEnabled && maxPartySize > 1) {
      const field = element("label", "section-rsvp__field", ""); field.setAttribute("data-v-525c4769", "");
      const title = element("span", "", data.locale === "en" ? "Number of guests" : data.locale === "ru" ? "Количество гостей" : data.locale === "uz-Cyrl" ? "Меҳмонлар сони" : "Mehmonlar soni");
      const input = document.createElement("input"); input.type = "number"; input.name = "partySize"; input.min = "1"; input.max = String(maxPartySize); input.value = "1"; input.setAttribute("data-v-525c4769", "");
      field.append(title, input); q(".section-rsvp__attendance").after(field);
    }
    q('#manor-rsvp-v-0-1-name').value = data.guestName || "";
    q(".section-rsvp__submit").disabled = false;
    form.onsubmit = async event => {
      event.preventDefault(); const notice = q(".section-rsvp__notice");
      if (data.preview) { notice.textContent = label.preview; return; }
      const values = new FormData(form), name = String(values.get("name") || "").trim();
      const status = radios.find(radio => radio.checked)?.value || "";
      const wish = String(values.get("wish") || "").trim(), partySize = Number(values.get("partySize") || 1), phone = String(values.get("phone") || "").trim();
      if (!name || (attendanceEnabled && (!status || (status === "yes" && (!Number.isInteger(partySize) || partySize < 1 || partySize > maxPartySize)))) || (!attendanceEnabled && !wish)) { notice.textContent = label.error; return; }
      const submit = q(".section-rsvp__submit"); submit.disabled = true; form.setAttribute("aria-busy", "true");
      try {
        if (attendanceEnabled) { const response = await fetch(`${data.apiBase}/rsvp`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, status, partySize: status === "yes" ? partySize : 0, note: phone ? `${label.phone}: ${phone}` : "", guestToken: data.guestToken || undefined }) }); if (!response.ok) throw new Error("rsvp"); }
        if (wish && data.wishesEnabled) { const response = await fetch(`${data.apiBase}/wishes`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, message: wish, guestToken: data.guestToken || undefined }) }); if (!response.ok) throw new Error("wish"); }
        notice.textContent = wish && data.wishesEnabled ? data.locale === "en" ? "Thank you! Your wish will appear after approval." : data.locale === "ru" ? "Спасибо! Пожелание появится после одобрения." : data.locale === "uz-Cyrl" ? "Раҳмат! Тилагингиз тасдиқлангач кўринади." : "Rahmat! Tilagingiz tasdiqlangach ko‘rinadi." : label.thanks; form.reset();
      } catch { notice.textContent = label.error; } finally { submit.disabled = false; form.setAttribute("aria-busy", "false"); }
    };
  }

  function render(data, html, sourceLabels) {
    cleanups.forEach(dispose => dispose()); cleanups = [];
    current = data; const locale = language[data.locale] || "uz-Latn", label = { ...(words[locale] || words["uz-Latn"]), source: sourceLabels[locale] };
    root.innerHTML = html; const shell = q(".velvet-royale"); shell.lang = locale;
    shell.classList.toggle("velvet-reduced-motion", reduced);
    shell.style.setProperty("--manor-font-display", "'Cormorant Garamond', Georgia, serif");
    shell.style.setProperty("--manor-font-body", "'Outfit', Arial, sans-serif");
    shell.style.setProperty("--manor-font-script", locale === "ru" || locale === "uz-Cyrl" || /\p{Script=Cyrillic}/u.test(`${data.groom || ""}${data.bride || ""}`) ? "'Marck Script', 'Cormorant Garamond', serif" : "'Great Vibes', cursive");
    shell.style.setProperty("--invitation-canvas-width", "450px");
    shell.style.setProperty("--edition-vw", `${Math.min(innerWidth, 450) / 100}px`);
    document.documentElement.lang = locale;
    put("hero-eyebrow", data.title || label.invitation); put("hero-groom", data.groom); put("hero-bride", data.bride);
    q(".section-hero").setAttribute("aria-label", `${data.groom || ""} & ${data.bride || ""}`);
    put("couple-first-name", data.groom); put("couple-connector", "&"); put("couple-second-name", data.bride);
    put("couple-invitation", [data.greeting || (data.guestName ? `${label.guest} ${data.guestName}` : label.guest), data.message].filter(Boolean).join(", "));
    const story = data.story || [];
    function bindQuote(block, chapter) {
      block.querySelector(".quote-block__text").textContent = chapter?.text || ""; block.hidden = !(chapter?.text || chapter?.title); block.dataset.itemId = chapter?.id || "";
      let attribution = block.querySelector(".quote-block__source");
      if (!attribution) { attribution = element("p", "quote-block__source fade-reveal", ""); attribution.setAttribute("data-v-f99a556b", ""); block.querySelector(".quote-block__text").after(attribution); }
      attribution.textContent = chapter?.title || chapter?.source || ""; attribution.hidden = !attribution.textContent;
    }
    [3, 1, 2].forEach((number, index) => bindQuote(q(`[data-editable-id="quote-${number}-text"]`).closest(".quote-block"), story.length ? story[index] : label.source.quotes[number - 1]));
    let previous = q('[data-editable-id="quote-2-text"]').closest(".quote-block");
    story.slice(3).forEach(chapter => { const block = previous.cloneNode(true); block.querySelectorAll("[data-editable-id]").forEach(el => el.removeAttribute("data-editable-id")); bindQuote(block, chapter); previous.after(block); previous = block; });
    put("datetime-eyebrow", `— ${label.source.sections.details} —`); put("datetime-title", label.source.sections.remember);
    put("countdown-label", label.source.sections.countdown);
    ["days", "hours", "minutes", "seconds"].forEach((key, i) => put(`countdown-${key}`, label.days[i]));
    put("table-eyebrow", label.source.sections.table); put("table-title", label.source.sections.tableTitle); put("table-subtitle", label.source.sections.tableSubtitle);
    show(".section-table", !!data.tableNumber); if (data.tableNumber) q(".place-card__digits").textContent = String(data.tableNumber);
    put("family-respect", `— ${label.source.sections.withRespect} —`); put("family-name", data.hosts); show(".section-family", !!data.hosts);
    put("closing-eyebrow", label.source.sections.closing); put("closing-text", `${label.source.sections.closingText}${data.guestName ? `, ${data.guestName}` : ""}`);
    renderCalendar(data, label); renderGallery(data, label); renderVenue(data, label); renderGift(data, label); renderContacts(data, label); renderRsvp(data, label);
    const intro = q(".section-intro"), main = q(".invitation__main"), introVideo = q(".section-intro__video");
    cleanups.push(() => introVideo.pause());
    intro.setAttribute("aria-label", label.source.intro.dialog); q(".section-intro__seal").setAttribute("aria-label", label.source.intro.seal);
    const startHeroMotion = () => {
      const hero = q(".section-hero"); hero.classList.add("section-hero--ready"); hero.style.setProperty("--hero-motion-state", reduced ? "paused" : "running");
      if (reduced || hero.querySelector("video")) return;
      const video = document.createElement("video"); video.className = "section-hero__video section-hero__video--visible";
      video.setAttribute("data-v-7de7226e", ""); video.setAttribute("aria-hidden", "true"); video.setAttribute("playsinline", "");
      video.muted = true; video.loop = true; video.preload = "none"; video.poster = asset("hero-upscale-v1-20260927-poster-361e716aba.webp");
      video.src = asset("hero-upscale-v1-20260927-c4fec8e94c.mp4"); hero.querySelector(".section-hero__art").after(video);
      cleanups.push(() => video.pause());
      video.play().catch(() => {});
    };
    intro.hidden = opened; main.inert = !opened;
    document.documentElement.classList.toggle("velvet-opening", !opened);
    q("audio")?.remove();
    const music = audio || (audio = document.createElement("audio"));
    if (audioSource !== (data.music || "")) { music.pause(); audioSource = data.music || ""; audioStarted = false; audioPaused = false; if (audioSource) music.src = audioSource; else music.removeAttribute("src"); }
    music.loop = true; music.preload = "none"; music.id = "velvet-music"; music.hidden = true; document.body.append(music);
    const musicButton = element("button", "velvet-music-toggle", "♫"); musicButton.type = "button"; musicButton.hidden = !data.music; musicButton.setAttribute("aria-label", data.locale === "en" ? "Music" : data.locale === "ru" ? "Музыка" : data.locale === "uz-Cyrl" ? "Мусиқа" : "Musiqa");
    musicButton.onclick = () => { if (music.paused) { audioPaused = false; music.play().catch(() => {}); } else { audioPaused = true; music.pause(); } }; root.append(musicButton);
    music.onplay = () => { audioStarted = true; musicButton.setAttribute("aria-pressed", "true"); musicButton.setAttribute("aria-label", label.source.music.pause); }; music.onpause = () => { musicButton.setAttribute("aria-pressed", "false"); musicButton.setAttribute("aria-label", label.source.music.play); };
    musicButton.setAttribute("aria-pressed", String(!music.paused));
    musicButton.setAttribute("aria-label", music.paused ? label.source.music.play : label.source.music.pause);
    const playMusic = () => { if (data.music && !data.silentPlayback && !audioStarted && !audioPaused) music.play().catch(() => {}); };
    const retryMusic = event => { if (!event.target.closest(".velvet-music-toggle") && (!data.preview || opened || event.target.closest(".section-intro__seal"))) playMusic(); };
    root.addEventListener("click", retryMusic); cleanups.push(() => root.removeEventListener("click", retryMusic));
    const seal = q(".section-intro__seal"), idleMotion = q(".section-envelope-motion");
    seal.classList.remove("section-envelope-seal--paused"); idleMotion.classList.remove("section-envelope-motion--paused");
    const initials = element("span", "section-envelope-seal__text", ""); initials.setAttribute("data-v-f3fce820", "");
    initials.append(document.createTextNode((data.groom || "").slice(0, 1)), element("span", "section-envelope-seal__amp", "&"), document.createTextNode((data.bride || "").slice(0, 1)));
    initials.querySelector("span").setAttribute("data-v-f3fce820", ""); q(".section-envelope-seal__initials").replaceChildren(initials);
    q(".section-intro__seal").onclick = async () => {
      if (opened) return; const button = q(".section-intro__seal"); button.disabled = true;
      let finished = false;
      const finish = () => { if (finished) return; finished = true; opened = true; intro.hidden = true; introVideo.pause(); main.inert = false; document.documentElement.classList.remove("velvet-opening"); startHeroMotion(); q(".section-hero").focus({ preventScroll: true }); playMusic(); };
      if (reduced) { finish(); return; }
      intro.classList.add("section-intro--opening"); seal.classList.remove("section-envelope-seal--active"); seal.classList.add("section-envelope-seal--released"); introVideo.currentTime = 0; introVideo.muted = true;
      let revealing = false;
      const reveal = () => { if (revealing || finished) return; revealing = true; introVideo.pause(); intro.classList.add("section-intro--revealing"); later(finish, 1400); };
      intro.addEventListener("animationend", event => { if (event.target === intro && revealing) finish(); });
      introVideo.onended = reveal; introVideo.onerror = reveal; later(reveal, 15000);
      introVideo.onwaiting = () => { const status = element("p", "section-intro__status", label.source.intro.opening); status.setAttribute("data-v-2762c0f7", ""); q(".section-intro__controls").replaceChildren(status); };
      introVideo.onplaying = () => q(".section-intro__controls").replaceChildren();
      playMusic(); try { await introVideo.play(); } catch { reveal(); }
    };
    q(".section-hero__scroll").onclick = () => q(".section-couple").scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    const start = Date.parse(data.dateTime || ""); clearInterval(timer);
    const past = element("p", "section-countdown__after bloom-reveal visible", label.source.countdown.past); past.setAttribute("data-v-eed09024", ""); past.hidden = true; q(".section-countdown").append(past);
    const tick = () => {
      const ended = Number.isFinite(start) && start <= Date.now(); past.hidden = !ended; show(".section-countdown__label", !ended); show(".section-countdown__timer", !ended);
      let remaining = Number.isFinite(start) ? Math.max(0, start - Date.now()) : 0;
      const values = [Math.floor(remaining / 864e5), Math.floor(remaining / 36e5) % 24, Math.floor(remaining / 6e4) % 60, Math.floor(remaining / 1e3) % 60];
      qa(".section-item__number").forEach((node, i) => node.textContent = String(values[i]).padStart(i ? 2 : 1, "0"));
    };
    tick(); timer = setInterval(tick, 1000);
    if ((data.languages || []).length > 1) { const nav = element("nav", "royal-language", ""); nav.setAttribute("aria-label", "Invitation language"); data.languages.forEach(code => { const button = element("button", "", code === "uz" ? "Uz" : code === "uz-Cyrl" ? "Ўз" : code.toUpperCase()); button.type = "button"; button.setAttribute("aria-pressed", String(code === data.locale)); button.onclick = () => parent.postMessage({ type: "royal-burgundy-edition:language", locale: code }, location.origin); nav.append(button); }); root.append(nav); }
    animate(); calendarMotion(); if (opened) { startHeroMotion(); playMusic(); }
    const progress = () => qa(".section-couple,.section-datetime,.section-countdown,.section-table,.section-card,.section-family,.section-closing").forEach(section => {
      const bounds = section.getBoundingClientRect();
      section.style.setProperty("--p", reduced ? ".5" : Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height))).toFixed(4));
    });
    removeEventListener("scroll", window.__velvetProgress);
    window.__velvetProgress = progress; addEventListener("scroll", progress, { passive: true }); progress();
    const syncMotion = () => {
      const hero = q(".section-hero"), bounds = hero.getBoundingClientRect(), visible = !document.hidden && bounds.bottom > 0 && bounds.top < innerHeight;
      hero.style.setProperty("--hero-motion-state", !reduced && opened && visible ? "running" : "paused");
      const video = hero.querySelector("video"); if (video) { if (!reduced && opened && visible) video.play().catch(() => {}); else video.pause(); }
      idleMotion.classList.toggle("section-envelope-motion--paused", document.hidden || opened);
      seal.classList.toggle("section-envelope-seal--paused", document.hidden);
    };
    const resize = () => { shell.style.setProperty("--edition-vw", `${Math.min(innerWidth, 450) / 100}px`); progress(); syncMotion(); };
    addEventListener("scroll", syncMotion, { passive: true }); addEventListener("resize", resize, { passive: true }); document.addEventListener("visibilitychange", syncMotion);
    cleanups.push(() => { removeEventListener("scroll", syncMotion); removeEventListener("resize", resize); document.removeEventListener("visibilitychange", syncMotion); });
  }

  let newest = null;
  const update = data => { newest = data; source.then(([html, labels]) => { if (newest === data) render(data, html, labels); }).catch(error => { root.textContent = error.message; }); };
  addEventListener("message", event => { if (event.origin === location.origin && event.data?.type === "royal-burgundy-edition:update") update(event.data.payload || {}); });
  try { const initial = JSON.parse(window.name || "{}"); if (Object.keys(initial).length) update(initial); } catch { /* Parent posts current invitation on load. */ }
})();
