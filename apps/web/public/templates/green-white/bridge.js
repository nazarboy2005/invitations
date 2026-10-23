(() => {
  "use strict";
  const id = "green-white";
  const root = document.querySelector('[data-chorlove-template="green-white"]');
  if (!root) return;
  const sections = [...root.querySelectorAll("section")];
  const copy = {
    "uz-Latn": { welcome: "Assalomu alaykum", title: "Taklifnoma", couple: "Kelin & Kuyov", invite: "Sizni hayotimizdagi eng baxtli kunimizga taklif qilamiz", date: "To'y sanasi", countdown: "Baxtli onlargacha...", countdownCaption: "Soniya sayin yaqinlashmoqdamiz", venue: "To'y manzili", map: "Xaritada ko'rish", gift: "Sovg'a o'rniga karta orqali tabriklashingiz mumkin", giftHeading: "To'yona", cardHolder: "Karta egasi", copy: "Nusxa olish", copied: "Karta raqami nusxalandi.", copyError: "Nusxa olib bo'lmadi.", gallery: "Galereya", dressCode: "Dress-kod", dressIntro: "Qanday kiyinish kerak", wishes: "Tilaklar", wishIntro: "To'y egalariga o'z ezgu tilaklaringizni qoldiring", wish: "Kelin-kuyovga tilagingiz...", rsvp: "Kelasizmi?", rsvpPrompt: "Iltimos, javobingizni bildiring.", yes: "Kelaman", no: "Kela olmayman", send: "Yuborish", guest: "Ismingiz", guestFull: "Ism va familiyangiz", saved: "Javobingiz saqlandi. Rahmat!", submitted: "Tilagingiz yuborildi.", error: "Yuborilmadi. Qayta urinib ko'ring.", preview: "Ko'rish rejimida yuborish o'chiq.", guestRequired: "Ismingizni kiriting.", wishRequired: "Tilagingizni yozing.", chooseResponse: "Javobingizni tanlang.", responseLabel: "Javobingiz", partySize: "Mehmonlar soni", days: "Kun", hours: "Soat", minutes: "Daq", seconds: "Son", photo: "Surat", close: "Yopish", next: "Keyingi", previous: "Oldingi", hosts: "Hurmat bilan", contact: "Bog'lanish uchun", language: "Til", playMusic: "Musiqani yoqish", pauseMusic: "Musiqani to'xtatish", musicUnavailable: "Musiqa mavjud emas", footer: "Taklifnoma" },
    "uz-Cyrl": { welcome: "Ассалому алайкум", title: "Таклифнома", couple: "Келин & Куёв", invite: "Сизни ҳаётимиздаги энг бахтли кунимизга таклиф қиламиз", date: "Тўй санаси", countdown: "Бахтли онларгача...", countdownCaption: "Сония сайин яқинлашмоқдамиз", venue: "Тўй манзили", map: "Харитада кўриш", gift: "Совға ўрнига карта орқали табриклашингиз мумкин", giftHeading: "Тўёна", cardHolder: "Карта эгаси", copy: "Нусха олиш", copied: "Карта рақами нусхаланди.", copyError: "Нусха олиб бўлмади.", gallery: "Галерея", dressCode: "Dress-kod", dressIntro: "Қандай кийиниш керак", wishes: "Тилаклар", wishIntro: "Тўй эгаларига эзгу тилакларингизни қолдиринг", wish: "Келин-куёвга тилагингиз...", rsvp: "Келасизми?", rsvpPrompt: "Илтимос, жавобингизни билдиринг.", yes: "Келаман", no: "Кела олмайман", send: "Юбориш", guest: "Исмигиз", guestFull: "Исм ва фамилиянгиз", saved: "Жавобингиз сақланди. Раҳмат!", submitted: "Тилагингиз юборилди.", error: "Юборилмади. Қайта уриниб кўринг.", preview: "Кўриш режимида юбориш ўчиқ.", guestRequired: "Исмигизни киритинг.", wishRequired: "Тилагингизни ёзинг.", chooseResponse: "Жавобингизни танланг.", responseLabel: "Жавобингиз", partySize: "Меҳмонлар сони", days: "Кун", hours: "Соат", minutes: "Дақ", seconds: "Сон", photo: "Сурат", close: "Ёпиш", next: "Кейинги", previous: "Олдинги", hosts: "Ҳурмат билан", contact: "Боғланиш учун", language: "Тил", playMusic: "Мусиқани ёқиш", pauseMusic: "Мусиқани тўхтатиш", musicUnavailable: "Мусиқа мавжуд эмас", footer: "Таклифнома" },
    en: { welcome: "Welcome", title: "Invitation", couple: "The couple", invite: "You are invited to the happiest day of our lives", date: "Wedding date", countdown: "Until our happy day...", countdownCaption: "Every second brings us closer", venue: "Venue", map: "Open map", gift: "You can send your congratulations by card", giftHeading: "Wedding gift", cardHolder: "Card holder", copy: "Copy card number", copied: "Card number copied.", copyError: "Could not copy the card number.", gallery: "Gallery", dressCode: "Dress code", dressIntro: "What to wear", wishes: "Wishes", wishIntro: "Leave your wishes for the couple", wish: "Your wish...", rsvp: "Will you join us?", rsvpPrompt: "Please let us know if you can attend.", yes: "I'll attend", no: "I can't attend", send: "Submit", guest: "Your name", guestFull: "Your full name", saved: "Your response was saved. Thank you!", submitted: "Your wish was sent.", error: "Could not submit. Please try again.", preview: "Submissions are disabled in preview.", guestRequired: "Enter your name.", wishRequired: "Write a wish.", chooseResponse: "Choose your RSVP response.", responseLabel: "Your response", partySize: "Number of guests", days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec", photo: "Photo", close: "Close", next: "Next", previous: "Previous", hosts: "With love from", contact: "Contact us", language: "Language", playMusic: "Play music", pauseMusic: "Pause music", musicUnavailable: "Music unavailable", footer: "Invitation" },
    ru: { welcome: "Добро пожаловать", title: "Приглашение", couple: "Жених и невеста", invite: "Приглашаем вас на самый счастливый день нашей жизни", date: "Дата свадьбы", countdown: "До нашего счастливого дня...", countdownCaption: "С каждой секундой мы ближе", venue: "Место проведения", map: "Открыть карту", gift: "Вы можете отправить поздравление на карту", giftHeading: "Подарок", cardHolder: "Держатель карты", copy: "Скопировать номер", copied: "Номер карты скопирован.", copyError: "Не удалось скопировать номер карты.", gallery: "Галерея", dressCode: "Дресс-код", dressIntro: "Как одеться", wishes: "Пожелания", wishIntro: "Оставьте пожелания молодожёнам", wish: "Ваше пожелание...", rsvp: "Вы придёте?", rsvpPrompt: "Пожалуйста, сообщите, сможете ли вы прийти.", yes: "Приду", no: "Не смогу прийти", send: "Отправить", guest: "Ваше имя", guestFull: "Ваши имя и фамилия", saved: "Ваш ответ сохранён. Спасибо!", submitted: "Ваше пожелание отправлено.", error: "Не удалось отправить. Попробуйте ещё раз.", preview: "Отправка в режиме просмотра отключена.", guestRequired: "Введите ваше имя.", wishRequired: "Напишите пожелание.", chooseResponse: "Выберите ваш ответ.", responseLabel: "Ваш ответ", partySize: "Количество гостей", days: "Дней", hours: "Часов", minutes: "Мин", seconds: "Сек", photo: "Фото", close: "Закрыть", next: "Далее", previous: "Назад", hosts: "С уважением", contact: "Связаться с нами", language: "Язык", playMusic: "Включить музыку", pauseMusic: "Выключить музыку", musicUnavailable: "Музыка недоступна", footer: "Приглашение" },
  };
  let payload;
  let timer;
  const $ = (selector, base = root) => base.querySelector(selector);
  const tx = (node, value) => { if (node) node.textContent = value == null ? "" : String(value); };
  const hide = (node, value) => { if (node) node.hidden = Boolean(value); };
  const setButtonText = (button, value) => {
    if (!button) return;
    const text = [...button.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (text) text.textContent = value;
    else if (button.querySelector("span")) tx(button.querySelector("span"), value);
    else button.append(document.createTextNode(value));
  };
  const section = (index) => sections[index];

  function prepareMotion() {
    const intro = root.querySelector(":scope > div.fixed.inset-0.z-50");
    intro?.remove();
    for (const node of root.querySelectorAll('[style*="opacity:0"]')) {
      const declarations = (node.getAttribute("style") || "").split(";").filter(Boolean);
      const keep = declarations.filter((item) => !/^\s*(opacity|filter|transform)\s*:/i.test(item));
      if (keep.length) node.setAttribute("style", keep.join(";")); else node.removeAttribute("style");
      node.dataset.gwReveal = "";
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      root.querySelectorAll("[data-gw-reveal]").forEach((node) => node.classList.add("gw-revealed"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("gw-revealed");
          observer.unobserve(entry.target);
        }
      }
    }, { root, threshold: 0.08 });
    root.querySelectorAll("[data-gw-reveal]").forEach((node) => observer.observe(node));
  }

  function render(p) {
    payload = p;
    const d = p.data || {};
    const c = copy[p.locale] || copy["uz-Latn"];
    document.documentElement.lang = p.locale === "uz-Latn" ? "uz" : p.locale;
    tx(section(0)?.querySelector("p.text-xs"), d.greeting || c.welcome);
    tx(section(0)?.querySelector("h1"), d.title || c.title);
    tx(section(0)?.querySelector("h2"), [d.groom, d.bride].filter(Boolean).join(" & "));
    tx(section(1)?.querySelector("p"), c.couple);
    const couple = section(1)?.querySelectorAll("h2") || [];
    tx(couple[0], d.groom); tx(couple[1], d.bride);
    tx(section(3)?.querySelector("p"), d.message || c.invite);
    renderDate(d, p, c);
    renderVenue(d.venue || {}, c);
    renderGift(d.toyona || {}, c);
    renderGallery(d.gallery || [], p, c);
    renderDressCode(d.dressCode || {}, c);
    renderWishes(d.wishes || [], p, c);
    renderContacts(d.contacts || [], c);
    renderFooter(d, c);
    tx(section(5)?.querySelector("p"), c.countdownCaption);
    tx(section(8)?.querySelector("h2"), c.gallery);
    tx(section(11)?.querySelector(".relative.z-20.text-center h2"), c.rsvp);
    tx(section(11)?.querySelector(".relative.z-20.text-center p"), c.rsvpPrompt);
    wireForm(section(10), "wishes", c);
    wireForm(section(11), "rsvp", c);
    installLocales(p, c);
    installMusic(d, p, c);
    root.classList.toggle("gw-reduced-motion", Boolean(p.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function renderDate(d, p, c) {
    const dateSection = section(4), countdown = section(5), date = d.date || {};
    const target = Date.parse(d.dateTime || "");
    const valid = Number.isFinite(target);
    hide(dateSection, !valid); hide(countdown, !valid);
    tx(dateSection?.querySelector("h3"), date.long || c.date);
    tx(dateSection?.querySelector(".flex.items-center.justify-center.gap-2 span"), date.time);
    tx(dateSection?.querySelector("span.text-base.font-serif"), [date.month, date.year].filter(Boolean).join(" "));
    const grids = [...(dateSection?.querySelectorAll("[class*=grid-cols-7]") || [])];
    const locale = p.locale === "uz-Latn" ? "uz-Latn" : p.locale;
    if (grids[0]) {
      const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + i))));
      grids[0].replaceChildren(...weekdays.map((value) => { const n = document.createElement("span"); n.textContent = value; return n; }));
    }
    const grid = grids[1];
    const month = Number(date.monthNumber), year = Number(date.year), day = Number(date.day);
    if (grid && month >= 1 && month <= 12 && year) {
      const offset = (new Date(Date.UTC(year, month - 1, 1).getUTCDay() + 6)) % 7;
      const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
      grid.replaceChildren(...Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, i) => {
        const cell = document.createElement("span");
        const value = i - offset + 1;
        if (value > 0 && value <= count) {
          cell.textContent = String(value);
          cell.className = value === day ? "grid h-8 w-8 place-items-center rounded-full bg-green-800 text-white" : "grid h-8 w-8 place-items-center text-slate-800";
          if (value === day) cell.setAttribute("aria-current", "date");
        }
        return cell;
      }));
    }
    if (valid) {
      tx(countdown?.querySelector("h3"), c.countdown);
      const tick = () => {
        const left = Math.max(0, target - Date.now());
        const nums = [Math.floor(left / 86400000), Math.floor(left % 86400000 / 3600000), Math.floor(left % 3600000 / 60000), Math.floor(left % 60000 / 1000)];
        const rows = [...(countdown?.querySelectorAll(".grid > div") || [])];
        [c.days, c.hours, c.minutes, c.seconds].forEach((label, i) => { tx(rows[i]?.querySelector("div:first-child"), String(nums[i]).padStart(2, "0")); tx(rows[i]?.querySelector("div:nth-child(2)"), label); });
      };
      clearInterval(timer); tick(); timer = setInterval(tick, 1000);
    } else { clearInterval(timer); timer = undefined; }
  }

  function renderVenue(venue, c) {
    const node = section(6), paragraphs = node?.querySelectorAll("p") || [];
    tx(paragraphs[0], venue.name); tx(paragraphs[1], venue.address);
    const link = node?.querySelector("a");
    const query = [venue.name, venue.address].filter(Boolean).join(" ");
    const url = venue.mapUrl || (venue.lat != null && venue.lng != null ? `https://maps.google.com/?q=${venue.lat},${venue.lng}` : query ? `https://maps.google.com/?q=${encodeURIComponent(query)}` : "");
    if (link) { link.href = url || "#"; tx(link, c.map); hide(link, !url); }
    const frame = node?.querySelector("iframe");
    if (frame && venue.lat != null && venue.lng != null) { frame.src = `https://maps.google.com/maps?q=${venue.lat},${venue.lng}&z=15&output=embed`; hide(frame, false); }
    else if (frame) { frame.removeAttribute("src"); hide(frame, true); }
    hide(node, !venue.name && !venue.address && !url);
  }

  function renderGift(gift, c) {
    const node = section(7), paragraphs = node?.querySelectorAll("p") || [];
    hide(node, !gift.enabled);
    tx(paragraphs[0], c.giftHeading); tx(paragraphs[1], c.gift);
    const number = node?.querySelector("p.whitespace-nowrap");
    const holder = node?.querySelector("p.truncate");
    tx(number, gift.cardNumber); tx(holder, gift.cardHolder);
    tx(paragraphs[3], c.cardHolder);
    const button = node?.querySelector("button");
    if (button) {
      hide(button, !gift.cardNumber);
      button.type = "button"; setButtonText(button, c.copy);
      button.setAttribute("aria-label", c.copy);
      let status = node.querySelector("[data-gw-copy-status]");
      if (!status) { status = document.createElement("p"); status.dataset.gwCopyStatus = ""; status.className = "gw-copy-status"; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite"); button.after(status); }
      button.onclick = async () => {
        try { await navigator.clipboard.writeText(String(gift.cardNumber || "")); tx(status, c.copied); }
        catch { tx(status, c.copyError); }
      };
    }
  }

  function renderGallery(gallery, p, c) {
    const node = section(8), buttons = [...(node?.querySelectorAll("button") || [])];
    buttons.forEach((button, i) => {
      const item = gallery[i];
      button.replaceChildren(); button.disabled = !item?.src; button.onclick = null;
      hide(button, !item?.src && !p.preview);
      if (!item?.src) return;
      const alt = item.alt || item.caption || `${c.photo} ${i + 1}`;
      const img = document.createElement("img"); img.src = item.src; img.alt = alt; img.className = "h-full w-full object-cover"; button.append(img);
      button.setAttribute("aria-label", alt); button.disabled = false;
      button.onclick = () => { const active = gallery.filter((photo) => photo.src); showLightbox(active, active.indexOf(item), c); };
    });
    hide(node, !gallery.some((item) => item.src));
  }

  function showLightbox(items, start, c) {
    const dialog = document.createElement("dialog"); dialog.className = "gw-lightbox"; dialog.setAttribute("aria-label", c.gallery);
    const image = document.createElement("img"), controls = document.createElement("div"); controls.className = "gw-lightbox-controls";
    const previous = document.createElement("button"), close = document.createElement("button"), next = document.createElement("button");
    previous.type = close.type = next.type = "button"; previous.textContent = c.previous; close.textContent = c.close; next.textContent = c.next;
    previous.setAttribute("aria-label", c.previous); close.setAttribute("aria-label", c.close); next.setAttribute("aria-label", c.next);
    let index = start;
    const show = () => { image.src = items[index].src; image.alt = items[index].alt || items[index].caption || `${c.photo} ${index + 1}`; };
    previous.onclick = () => { index = (index - 1 + items.length) % items.length; show(); };
    next.onclick = () => { index = (index + 1) % items.length; show(); };
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); previous.click(); }
      else if (event.key === "ArrowRight") { event.preventDefault(); next.click(); }
    });
    close.onclick = () => dialog.close(); controls.append(previous, close, next); dialog.append(image, controls);
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    root.append(dialog); show(); dialog.showModal(); dialog.addEventListener("close", () => dialog.remove(), { once: true });
  }

  function renderDressCode(dress, c) {
    const node = section(9), headings = node?.querySelector("h3"), paragraphs = node?.querySelectorAll("p") || [];
    hide(node, !dress.enabled);
    tx(headings, c.dressCode); tx(paragraphs[0], c.dressIntro);
    tx(paragraphs[1], [dress.style, dress.text, dress.note].filter(Boolean).join(" · "));
    const colors = dress.colors || [];
    const swatches = [...(node?.querySelectorAll("span.rounded-full.border-2") || [])];
    swatches.forEach((swatch, i) => { const color = colors[i]; hide(swatch, !color); if (color) { swatch.style.backgroundColor = color.hex; swatch.setAttribute("aria-label", color.name || color.hex); swatch.title = color.name || color.hex; } });
  }

  async function renderWishes(wishes, p, c) {
    const node = section(10), list = node?.querySelector("ul");
    tx(node?.querySelector("h2"), c.wishes); tx(node?.querySelector(":scope > div p"), c.wishIntro);
    if (!list) return;
    list.replaceChildren();
    const values = p.preview ? wishes : await fetch(`/api/public/invitations/${encodeURIComponent(p.invitationId || "")}/wishes`, { cache: "no-store" }).then((r) => r.ok ? r.json() : { wishes: [] }).then((r) => r.wishes || []).catch(() => []);
    values.forEach((wish, i) => {
      const item = document.createElement("li"); item.className = "max-w-[88%] rounded-3xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"; item.classList.add(i % 2 ? "ml-auto" : "rounded-bl-md", ...(i % 2 ? ["rounded-br-md"] : []));
      const name = document.createElement("p"), message = document.createElement("p"); name.className = "font-serif text-sm italic text-green-100 [overflow-wrap:anywhere]"; message.className = "mt-1 text-xs leading-relaxed text-white/85 [overflow-wrap:anywhere]"; name.textContent = wish.name || ""; message.textContent = wish.text || wish.message || ""; item.append(name, message); list.append(item);
    });
    hide(node, !p.preview && !p.data?.wishesEnabled);
  }

  function renderContacts(contacts, c) {
    const node = section(12), links = [...(node?.querySelectorAll("a") || [])];
    tx(node?.querySelector("h3"), c.contact);
    links.forEach((link, index) => {
      const spans = [...link.querySelectorAll("span")];
      const typeLabel = spans.find((span) => span.classList.contains("uppercase") && span.className.includes("tracking"));
      const valueLabel = link.querySelector("span.truncate");
      const item = index === 0 ? contacts.find((contact) => contact.type === "telegram") : index === 1 ? contacts.find((contact) => contact.type === "phone") : undefined;
      hide(link, !item);
      if (item) { link.href = item.href || "#"; tx(typeLabel, item.label); tx(valueLabel, item.value); }
    });
    hide(node, !contacts.length);
  }

  function renderFooter(d, c) {
    const node = section(13), paragraphs = node?.querySelectorAll("p") || [];
    tx(paragraphs[0], d.greeting || c.welcome);
    tx(paragraphs[1], [d.groom, d.bride].filter(Boolean).join(" & "));
    tx(paragraphs[2], d.date?.short || d.date?.long);
    tx(paragraphs[3], c.hosts); tx(paragraphs[4], d.hosts);
    const link = node?.querySelector("a"); if (link) { link.href = "/"; tx(link, c.footer); }
  }

  function installLocales(p, c) {
    let nav = $("[data-gw-languages]");
    if (!nav) { nav = document.createElement("nav"); nav.dataset.gwLanguages = ""; nav.className = "gw-language-picker"; root.append(nav); }
    nav.setAttribute("aria-label", c.language); nav.replaceChildren();
    for (const locale of p.enabledLocales || ["uz-Latn", "uz-Cyrl", "en", "ru"]) {
      const button = document.createElement("button"); button.type = "button"; button.textContent = ({ "uz-Latn": "Uz", "uz-Cyrl": "Ўз", en: "En", ru: "Ru" })[locale] || locale; button.setAttribute("aria-pressed", String(locale === p.locale));
      button.onclick = () => parent.postMessage({ type: `${id}:language`, locale }, location.origin); nav.append(button);
    }
  }

  function wireForm(node, kind, c) {
    const form = node?.querySelector("form"); if (!form) return;
    const input = form.querySelector("input"), area = form.querySelector("textarea"), submit = form.querySelector('button[type="submit"]');
    if (input) { input.disabled = false; input.required = !payload.preview; if (!input.dataset.gwInitialized) { input.value = payload.guestName || ""; input.dataset.gwInitialized = "true"; } input.placeholder = kind === "rsvp" ? c.guestFull : c.guest; input.setAttribute("aria-label", input.placeholder); input.setAttribute("aria-invalid", "false"); input.oninput = () => input.setAttribute("aria-invalid", "false"); }
    if (area) { area.disabled = false; area.required = !payload.preview; area.maxLength = 2000; area.placeholder = c.wish; area.setAttribute("aria-label", c.wish); area.setAttribute("aria-invalid", "false"); area.oninput = () => area.setAttribute("aria-invalid", "false"); }
    const choices = [...form.querySelectorAll("button")].filter((button) => button !== submit);
    choices.forEach((button, i) => { button.type = "button"; button.setAttribute("role", "radio"); button.setAttribute("aria-checked", "false"); button.setAttribute("aria-label", i ? c.no : c.yes); button.tabIndex = i ? -1 : 0; tx(button.querySelector("span"), i ? c.no : c.yes); button.onclick = () => select(i); button.onkeydown = (event) => { if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return; event.preventDefault(); const current = choices.findIndex((item) => item.getAttribute("aria-checked") === "true"); const next = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : (current + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + choices.length) % choices.length; select(next, true); }; });
    function select(index, focus = false) { choices.forEach((button, i) => { const checked = index === i; button.setAttribute("aria-checked", String(checked)); button.tabIndex = checked || (index < 0 && i === 0) ? 0 : -1; }); if (focus) choices[index]?.focus(); }
    let party = form.querySelector('[name="partySize"]');
    if (kind === "rsvp" && !party) { party = document.createElement("select"); party.name = "partySize"; party.className = "mt-3 w-full rounded-lg border px-4 py-3 text-sm"; submit?.parentElement?.insertBefore(party, submit); }
    if (party) { const max = Math.max(1, Math.min(Number(payload.data.rsvp?.maxPartySize) || 1, 100)); party.replaceChildren(...Array.from({ length: max }, (_, i) => { const option = document.createElement("option"); option.value = String(i + 1); option.textContent = String(i + 1); return option; })); party.setAttribute("aria-label", c.partySize); }
    if (submit) { submit.disabled = false; setButtonText(submit, c.send); }
    let status = form.querySelector("[data-gw-status]"); if (!status) { status = document.createElement("p"); status.dataset.gwStatus = ""; form.append(status); }
    status.id = status.id || `gw-${kind}-status`; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite"); input?.setAttribute("aria-describedby", status.id); area?.setAttribute("aria-describedby", status.id);
    const announce = (message, alert = false) => { status.setAttribute("role", alert ? "alert" : "status"); status.setAttribute("aria-live", alert ? "assertive" : "polite"); tx(status, message); };
    form.onsubmit = async (event) => {
      event.preventDefault(); if (payload.preview) { announce(c.preview); return; }
      const name = String(input?.value || payload.guestName || "").trim();
      if (!name) { input?.setAttribute("aria-invalid", "true"); announce(c.guestRequired, true); input?.focus(); return; }
      let body;
      if (kind === "wishes") { const message = String(area?.value || "").trim(); if (!message) { area?.setAttribute("aria-invalid", "true"); announce(c.wishRequired, true); area?.focus(); return; } body = { name, message, guestToken: payload.guestToken || undefined }; }
      else { const choice = choices.findIndex((button) => button.getAttribute("aria-checked") === "true"); if (choice < 0) { announce(c.chooseResponse, true); choices[0]?.focus(); return; } body = { name, status: choice ? "no" : "yes", partySize: choice ? 0 : Number(party?.value || 1), guestToken: payload.guestToken || undefined }; }
      if (submit) submit.disabled = true;
      try { const response = await fetch(`/api/public/invitations/${encodeURIComponent(payload.invitationId || "")}/${kind}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!response.ok) throw Error(); announce(kind === "wishes" ? c.submitted : c.saved); form.reset(); if (input) input.setAttribute("aria-invalid", "false"); if (area) area.setAttribute("aria-invalid", "false"); select(-1); }
      catch { announce(c.error, true); }
      finally { if (submit) submit.disabled = false; }
    };
  }

  function installMusic(d, p, c) {
    let audio = $("[data-gw-audio]");
    if (!audio) { audio = document.createElement("audio"); audio.dataset.gwAudio = ""; audio.loop = true; audio.preload = "none"; root.append(audio); }
    const button = root.querySelector('[aria-label="Toggle music"]') || $(".gw-music-toggle");
    const url = d.music?.url || ""; audio.src = url; audio.muted = Boolean(p.preview && p.silentPlayback); hide(button, !url || Boolean(p.preview && p.silentPlayback));
    const setIcon = (playing) => {
      if (!button) return;
      button.setAttribute("aria-label", playing ? c.pauseMusic : c.playMusic);
      button.innerHTML = playing
        ? '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>'
        : '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
    };
    if (button) { setIcon(!audio.paused); button.onclick = async () => { if (audio.paused) { try { await audio.play(); setIcon(true); } catch { button.setAttribute("aria-label", c.musicUnavailable); } } else { audio.pause(); setIcon(false); } }; }
  }

  addEventListener("message", (event) => { if (event.source === parent && event.origin === location.origin && event.data?.type === `${id}:update`) render(event.data.payload); });
  prepareMotion();
  try { const initial = JSON.parse(window.name); if (initial?.type === `${id}:update`) render(initial.payload); } catch {}
})();
