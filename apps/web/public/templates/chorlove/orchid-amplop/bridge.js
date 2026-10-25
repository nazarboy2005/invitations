(() => {
  "use strict";

  const ID = "orchid-amplop";
  const BASE = "/templates/chorlove/orchid-amplop/assets/";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const templateScroller = $(".orchid-template");
  const scrollTemplateToTop = (event) => {
    event?.currentTarget?.blur();
    if (document.documentElement.classList.contains("orchid-reduced-motion")) templateScroller.scrollTop = 0;
    else templateScroller.scrollTo({ top: 0, behavior: "smooth" });
  };
  const copy = {
    "uz-Latn": { guestGreeting: "Assalomu alaykum, aziz mehmon", inviteIntro: "Sizni to'yimizga taklif qilamiz", openInvitation: "Taklifnomani ochish", prayer: "Ey mehribon Alloh", blessing: "Marhamating bilan bizni muqaddas nikoh rishtalarida birlashtirding", weddingOf: "NIKOH TO'YI", coupleTitle: "Baxtli juftlik bilan tanishing", coupleText: "Juft qilib yaratgan Allohga hamd bo‘lsin. Allohim, bizni birga baxtli qilsin.", ourStory: "Bizning hikoyamiz", gettingMarried: "Nikoh to‘yimiz", blessingArabic: "Assalomu alaykum va rahmatullohi va barokatuh", days: "Kun", hours: "Soat", minutes: "Daqiqa", seconds: "Soniya", addCalendar: "Kalendarimga qo‘shish", weddingParty: "To‘y bazmi", openMap: "Xaritada ko‘rish", mapUnavailable: "Manzil xaritasi mavjud emas", mapBlessing: "To‘yimizga tashrif buyurib, kelin-kuyovga duo qilsangiz, biz uchun katta sharaf bo‘ladi.", gallery: "Galereya", verse: "Uning oyatlaridan biri — sizlar taskin topishingiz uchun o‘zlaringizdan juftlar yaratganidir.", giveGift: "Sovg‘a berish", sendGift: "Sovg‘a yuborish", digitalWallet: "Bank kartasi", wishesTitle: "Tilak bildiring", name: "Ismingiz", message: "Tilagingiz", send: "Yuborish", rsvpTitle: "Kelasizmi?", rsvpIntro: "Iltimos, javobingizni bildiring.", answer: "Javobingiz", choose: "Tanlang", attending: "Kelaman", declining: "Kela olmayman", withLove: "Mehr bilan", madeWithLove: "Muhabbat bilan yaratilgan", backTop: "Yuqoriga", previewOnly: "Ko‘rish rejimida yuborib bo‘lmaydi.", sent: "Javobingiz yuborildi. Rahmat!", failed: "Yuborilmadi. Qayta urinib ko‘ring.", musicOn: "Musiqani yoqish", musicOff: "Musiqani o‘chirish", close: "Yopish", copied: "Nusxalandi" },
    "uz-Cyrl": { guestGreeting: "Ассалому алайкум, азиз меҳмон", inviteIntro: "Сизни тўйимизга таклиф қиламиз", openInvitation: "Таклифномани очиш", prayer: "Ё Аллоҳ, меҳрибон Зот", blessing: "Сизнинг марҳаматингиз билан бизни муқаддас никоҳ ришталари бирлаштирди", weddingOf: "НИКОҲ ТЎЙИ", coupleTitle: "Бахтли жуфтлик билан танишинг", coupleText: "Жуфт қилиб яратган Аллоҳга ҳамд бўлсин. Аллоҳим, бизни бирга бахтли қилсин.", ourStory: "Бизнинг ҳикоямиз", gettingMarried: "Никоҳ тўйимиз", blessingArabic: "Ассалому алайкум ва раҳматуллоҳи ва барокатуҳ", days: "Кун", hours: "Соат", minutes: "Дақиқа", seconds: "Сония", addCalendar: "Тақвимга қўшиш", weddingParty: "Тўй базми", openMap: "Харитада кўриш", mapUnavailable: "Манзил харитаси мавжуд эмас", mapBlessing: "Тўйимизга ташриф буюриб, келин-куёвга дуо қилсангиз, биз учун катта шараф бўлади.", gallery: "Галерея", verse: "Унинг оятларидан бири — сизлар таскин топишингиз учун ўзларингиздан жуфтлар яратганидир.", giveGift: "Совға бериш", sendGift: "Совға юбориш", digitalWallet: "Банк картаси", wishesTitle: "Тилак билдиринг", name: "Исмингиз", message: "Тилагингиз", send: "Юбориш", rsvpTitle: "Келасизми?", rsvpIntro: "Илтимос, жавобингизни билдиринг.", answer: "Жавобингиз", choose: "Танланг", attending: "Келаман", declining: "Кела олмайман", withLove: "Меҳр билан", madeWithLove: "Муҳаббат билан яратилган", backTop: "Юқорига", previewOnly: "Кўриш режимида юбориб бўлмайди.", sent: "Жавобингиз юборилди. Раҳмат!", failed: "Юборилмади. Қайта уриниб кўринг.", musicOn: "Мусиқани ёқиш", musicOff: "Мусиқани ўчириш", close: "Ёпиш", copied: "Нусхаланди" },
    en: { guestGreeting: "Hello, dear guest", inviteIntro: "You are warmly invited to our wedding", openInvitation: "Open invitation", prayer: "Ya Allah, the Most Loving", blessing: "With Your blessing, You brought us together in a holy marriage bond", weddingOf: "THE WEDDING OF", coupleTitle: "Meet the happy couple", coupleText: "Glory be to Allah, who created us in pairs. May Allah bless our life together.", ourStory: "Our story", gettingMarried: "We’re getting married", blessingArabic: "Assalamu alaikum wa rahmatullahi wa barakatuh", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds", addCalendar: "Add to calendar", weddingParty: "Wedding party", openMap: "Open map", mapUnavailable: "The map is unavailable", mapBlessing: "It would be an honor and joy if you join us and bless the bride and groom.", gallery: "Gallery", verse: "And among His signs is that He created for you spouses from among yourselves, so that you may find tranquility in them.", giveGift: "Give a gift", sendGift: "Send a gift", digitalWallet: "Bank card", wishesTitle: "Send a wish", name: "Your name", message: "Your message", send: "Send", rsvpTitle: "Will you attend?", rsvpIntro: "Please let us know your answer.", answer: "Your answer", choose: "Choose one", attending: "I will attend", declining: "I can’t attend", withLove: "With love", madeWithLove: "Made with love", backTop: "Back to top", previewOnly: "Sending is disabled in preview.", sent: "Your response was sent. Thank you!", failed: "Could not send. Please try again.", musicOn: "Play music", musicOff: "Pause music", close: "Close", copied: "Copied" },
    ru: { guestGreeting: "Здравствуйте, дорогой гость", inviteIntro: "Приглашаем вас на нашу свадьбу", openInvitation: "Открыть приглашение", prayer: "О Аллах, Милостивый", blessing: "С Вашего благословения нас соединил священный брачный союз", weddingOf: "СВАДЬБА", coupleTitle: "Познакомьтесь с влюблённой парой", coupleText: "Хвала Аллаху, создавшему пары. Пусть Аллах благословит нашу совместную жизнь.", ourStory: "Наша история", gettingMarried: "Мы женимся", blessingArabic: "Ассаляму алейкум ва рахматуллахи ва баракатуху", days: "Дней", hours: "Часов", minutes: "Минут", seconds: "Секунд", addCalendar: "Добавить в календарь", weddingParty: "Свадебный вечер", openMap: "Открыть карту", mapUnavailable: "Карта недоступна", mapBlessing: "Для нас будет большой честью, если вы придёте и благословите молодожёнов.", gallery: "Галерея", verse: "Среди Его знамений — то, что Он создал для вас супруг из вас самих, чтобы вы находили в них покой.", giveGift: "Подарок", sendGift: "Отправить подарок", digitalWallet: "Банковская карта", wishesTitle: "Пожелания", name: "Ваше имя", message: "Ваше пожелание", send: "Отправить", rsvpTitle: "Вы придёте?", rsvpIntro: "Пожалуйста, сообщите ваш ответ.", answer: "Ваш ответ", choose: "Выберите", attending: "Приду", declining: "Не смогу прийти", withLove: "С любовью", madeWithLove: "Создано с любовью", backTop: "Наверх", previewOnly: "Отправка в режиме просмотра отключена.", sent: "Ответ отправлен. Спасибо!", failed: "Не удалось отправить. Попробуйте ещё раз.", musicOn: "Включить музыку", musicOff: "Выключить музыку", close: "Закрыть", copied: "Скопировано" },
  };

  let current;
  let countdownTimer;
  let opened = false;
  let wishesFor = "";
  let remoteWishes = [];
  let lightboxSequence = 0;
  let galleryTrigger = null;
  const text = (key) => (copy[current?.locale] || copy["uz-Latn"])[key] || key;
  const put = (selector, value, scope = document) => {
    const node = $(selector, scope);
    if (node) node.textContent = value == null ? "" : String(value);
    return node;
  };
  const show = (selector, visible, scope = document) => {
    const node = $(selector, scope);
    if (node) node.hidden = !visible;
    return node;
  };
  const safeUrl = (value) => {
    if (!value) return "";
    try {
      const url = new URL(value, location.origin);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  };
  const couple = (data) => [data.groom, data.bride].filter(Boolean).join(" & ");
  function setImages(data, preview) {
    const banner = safeUrl(data.bannerImage) || BASE + "hero-forest.webp";
    $$('[data-orchid-hero]').forEach((node) => { node.src = banner; });
    const groomImage = safeUrl(data.groomImage) || (preview ? BASE + "groom.png" : "");
    const brideImage = safeUrl(data.brideImage) || (preview ? BASE + "bride.png" : "");
    const groom = $('[data-orchid-groom-image]');
    const bride = $('[data-orchid-bride-image]');
    if (groomImage) groom.src = groomImage;
    if (brideImage) bride.src = brideImage;
  }
  function renderCountdown(data) {
    clearInterval(countdownTimer);
    const host = $("[data-orchid-countdown]");
    host.replaceChildren();
    const target = Date.parse(data.dateTime || "");
    if (!Number.isFinite(target)) { show("[data-orchid-countdown]", false); return; }
    show("[data-orchid-countdown]", true);
    const keys = ["days", "hours", "minutes", "seconds"];
    const draw = () => {
      let left = Math.max(0, target - Date.now());
      const values = [Math.floor(left / 864e5), Math.floor(left / 36e5) % 24, Math.floor(left / 6e4) % 60, Math.floor(left / 1e3) % 60];
      host.replaceChildren(...values.map((value, index) => {
        const card = document.createElement("div"); card.className = "countdown-card";
        const number = document.createElement("p"); number.textContent = String(value).padStart(2, "0");
        const label = document.createElement("span"); label.textContent = text(keys[index]);
        card.append(number, label); return card;
      }));
    };
    draw(); countdownTimer = setInterval(draw, 1000);
  }
  function renderProgram(data) {
    const host = $("[data-orchid-program]");
    host.replaceChildren();
    const items = (data.program || []).filter((item) => item && (item.title || item.time));
    const entries = items.length ? items : [{ id: "event", title: text("weddingParty"), time: data.date?.time, place: data.venue?.name, address: data.venue?.address, mapUrl: data.venue?.mapUrl }];
    entries.forEach((entry, index) => {
      const card = document.createElement("article"); card.className = "event-card";
      const image = document.createElement("img"); image.src = BASE + `gallery-${index % 6 + 1}.webp`; image.alt = "";
      const overlay = document.createElement("div"); overlay.className = "event-card-overlay";
      const content = document.createElement("div"); content.className = "event-card-content";
      const icon = document.createElement("span"); icon.className = "event-card-icon"; icon.setAttribute("aria-hidden", "true"); icon.textContent = "♡";
      const title = document.createElement("h3"); title.textContent = entry.title || text("weddingParty");
      content.append(icon, title);
      for (const [className, value] of [["event-time", entry.time], ["event-place", entry.place || data.venue?.name], ["event-address", entry.address || data.venue?.address]]) {
        if (!value) continue; const line = document.createElement("p"); line.className = className; line.textContent = value; content.append(line);
      }
      const map = safeUrl(entry.mapUrl || data.venue?.mapUrl);
      if (map) { const link = document.createElement("a"); link.href = map; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = text("openMap"); content.append(link); }
      card.append(image, overlay, content); host.append(card);
    });
  }
  function galleryImages(data) {
    const uploaded = (data.gallery || []).filter((item) => safeUrl(item.src)).map((item) => ({ src: safeUrl(item.src), alt: item.alt || item.caption || "" }));
    if (uploaded.length) return uploaded;
    if (current?.preview && current?.sampleGallery) return ["gallery-2.webp", "gallery-1.webp", "gallery-3.webp", "gallery-6.webp", "gallery-4.webp", "gallery-5.webp"].map((file) => ({ src: BASE + file, alt: "" }));
    return [];
  }
  // Framer Motion's implicit transition for these source motion values is its
  // default physical spring: stiffness 100, damping 10, mass 1, zero velocity.
  // Generate the same under-damped oscillator curve for WAAPI, ending when
  // both displacement and velocity reach Framer Motion's default rest range.
  function sourceSpring(from, to) {
    const stiffness = 100, damping = 10, mass = 1;
    const omega0 = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const delta = from - to;
    const step = 1 / 60;
    const frames = [];
    let t = 0;
    do {
      const decay = Math.exp(-zeta * omega0 * t);
      const cosine = Math.cos(omegaD * t);
      const sine = Math.sin(omegaD * t);
      const displacement = delta * decay * (cosine + (zeta * omega0 / omegaD) * sine);
      const velocity = -delta * decay * (omega0 * omega0 / omegaD) * sine;
      frames.push({ value: to + displacement, offset: frames.length ? undefined : 0 });
      if (t > 0 && Math.abs(displacement) < 0.01 && Math.abs(velocity) < 0.01) break;
      t += step;
    } while (t < 5);
    frames[frames.length - 1].offset = 1;
    return { frames, duration: Math.round(t * 1000) };
  }
  function animateSourceSpring(element, from, to, property, makeValue) {
    const spring = sourceSpring(from, to);
    const keyframes = spring.frames.map(({ value, offset }) => ({ [property]: makeValue(value), ...(offset === undefined ? {} : { offset }) }));
    return element.animate(keyframes, { duration: spring.duration, easing: "linear", fill: "both" });
  }
  function openLightbox(item, trigger) {
    const box = $("[data-orchid-lightbox]");
    const image = $("[data-orchid-lightbox-image]");
    const close = $("[data-orchid-lightbox-close]");
    lightboxSequence += 1;
    box.getAnimations().forEach((animation) => animation.cancel());
    image.getAnimations().forEach((animation) => animation.cancel());
    galleryTrigger = trigger;
    image.src = item.src;
    image.alt = item.alt;
    box.hidden = false;
    box.setAttribute("aria-hidden", "false");
    if (!document.documentElement.classList.contains("orchid-reduced-motion")) {
      animateSourceSpring(box, 0, 1, "opacity", (value) => value);
      animateSourceSpring(image, 0.96, 1, "transform", (value) => `scale(${value})`);
      animateSourceSpring(image, 0, 1, "opacity", (value) => value);
    }
    close.focus();
  }
  function closeLightbox() {
    const box = $("[data-orchid-lightbox]");
    const image = $("[data-orchid-lightbox-image]");
    if (box.hidden) return;
    const sequence = ++lightboxSequence;
    if (document.documentElement.classList.contains("orchid-reduced-motion")) {
      box.hidden = true;
      box.setAttribute("aria-hidden", "true");
      galleryTrigger?.focus();
      return;
    }
    const backdrop = animateSourceSpring(box, 1, 0, "opacity", (value) => value);
    const portraitScale = animateSourceSpring(image, 1, 0.96, "transform", (value) => `scale(${value})`);
    const portraitOpacity = animateSourceSpring(image, 1, 0, "opacity", (value) => value);
    Promise.all([backdrop.finished, portraitScale.finished, portraitOpacity.finished].map((finished) => finished.catch(() => {}))).then(() => {
      if (sequence !== lightboxSequence) return;
      box.hidden = true;
      box.setAttribute("aria-hidden", "true");
      galleryTrigger?.focus();
    });
  }
  function renderGallery(data) {
    const images = galleryImages(data);
    show('[data-section="gallery"]', images.length > 0);
    for (const selector of ["[data-orchid-gallery-mobile]", "[data-orchid-gallery-desktop]"]) {
      const host = $(selector); host.replaceChildren();
      images.slice(0, 6).forEach((item, index) => {
        const cell = document.createElement("div"); cell.className = `orchid-reveal gallery-cell gallery-${selector.includes("mobile") ? "mobile" : "desktop"}-${index}`;
        cell.style.setProperty("--orchid-reveal-delay", `${index * 40}ms`);
        const button = document.createElement("button"); button.type = "button"; button.setAttribute("aria-label", text("gallery"));
        const image = document.createElement("img"); image.src = item.src; image.alt = item.alt;
        button.append(image); button.addEventListener("click", () => openLightbox(item, button));
        cell.append(button); host.append(cell); revealer.observe(cell);
      });
    }
  }
  function renderPersonSocials(data) {
    const socialLinks = (data.contacts || []).filter((contact) => ["instagram", "telegram"].includes(contact?.type) && safeUrl(contact?.href));
    const icons = {
      instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" stroke-width="1.8"></rect><circle cx="12" cy="12" r="3.7" stroke="currentColor" stroke-width="1.8"></circle><circle cx="17" cy="7" r="1.2" fill="currentColor"></circle></svg>',
      telegram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.6 4.6 3.9 11.1c-1.1.4-1.1 1.1-.2 1.4l4.2 1.3 1.6 5c.2.7.5.9 1 .9.5 0 .8-.2 1.2-.6l2.3-2.2 4.8 3.5c.9.5 1.5.3 1.7-.8l3-14.1c.3-1.2-.4-1.7-1.5-1.3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"></path><path d="m8 13.8 10-6.2-7.7 8.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    };
    for (const [person, name] of [["groom", data.groom], ["bride", data.bride]]) {
      const host = $(`[data-orchid-socials="${person}"]`);
      host.replaceChildren();
      socialLinks.forEach((contact) => {
        const link = document.createElement("a");
        link.href = safeUrl(contact.href);
        link.target = "_blank";
        link.rel = "noreferrer";
        link.setAttribute("aria-label", `${name || text(person)} ${contact.type === "instagram" ? "Instagram" : "Telegram"}`);
        link.innerHTML = icons[contact.type];
        host.append(link);
      });
      host.hidden = !(name && socialLinks.length > 0);
    }
  }
  function renderStory(data, preview) {
    const chapters = (data.story || []).filter((item) => item.title || item.text);
    const section = show('[data-section="story"]', chapters.length > 0);
    const host = $(`[data-orchid-story]`); host.replaceChildren();
    chapters.forEach((chapter, index) => {
      const authoredPhoto = safeUrl(index % 2 ? data.brideImage : data.groomImage) || (preview ? BASE + (index % 2 ? "story-bride.jpg" : "story-groom.jpg") : "");
      const card = document.createElement("article"); card.className = `orchid-reveal story-text-card story-${index ? "second" : "first"}-text`;
      card.style.setProperty("--orchid-reveal-delay", index ? ".08s" : ".06s");
      if (chapter.text) { const paragraph = document.createElement("p"); paragraph.textContent = chapter.text; card.append(paragraph); }
      if (authoredPhoto) {
        const image = document.createElement("div"); image.className = `orchid-reveal story-image-wrap story-${index % 2 ? "bride" : "groom"}`;
        image.style.setProperty("--orchid-reveal-delay", index % 2 ? ".1s" : "0s");
        const img = document.createElement("img"); img.className = index % 2 ? "story-side-image" : "story-main-image"; img.src = authoredPhoto; img.alt = index % 2 ? data.bride || "" : data.groom || ""; image.append(img);
        host.append(image); revealer.observe(image);
      }
      host.append(card); revealer.observe(card);
    });
    return section;
  }
  function renderWishes(data) {
    const active = data.wishesEnabled;
    show('[data-section="wishes"]', !!active);
    const host = $("[data-orchid-wishes]"); host.replaceChildren();
    const wishes = [...(data.wishes || []), ...remoteWishes].filter((item) => item && (item.text || item.message));
    wishes.forEach((wish) => { const item = document.createElement("article"); item.className = "wish-item"; const name = document.createElement("p"); name.className = "wish-name"; name.textContent = wish.name || ""; const message = document.createElement("p"); message.className = "wish-message"; message.textContent = wish.text || wish.message || ""; item.append(name, message); host.append(item); });
    put("[data-orchid-wishes-count]", `(${String(wishes.length).padStart(2, "0")})`);
  }
  function render(data, envelope) {
    current = envelope;
    const fullName = couple(data);
    $$('[data-orchid-couple]').forEach((node) => { node.textContent = fullName; });
    $$('[data-orchid-groom]').forEach((node) => { node.textContent = data.groom || ""; });
    $$('[data-orchid-bride]').forEach((node) => { node.textContent = data.bride || ""; });
    put("[data-orchid-hosts]", data.hosts || "");
    put("[data-orchid-message]", data.message || "");
    put("[data-orchid-date]", data.date?.short || data.date?.long || "");
    put("[data-orchid-long-date]", data.date?.long || "");
    put("[data-orchid-time]", data.date?.time || "");
    put("[data-orchid-venue]", data.venue?.name || "");
    put("[data-orchid-address]", data.venue?.address || "");
    const mapUrl = safeUrl(data.venue?.mapUrl);
    const mapFrame = $("[data-orchid-map-frame]"); mapFrame.hidden = true;
    const mapLink = $("[data-orchid-map]");
    mapLink.href = mapUrl || "#";
    show("[data-orchid-map]", !!mapUrl);
    show(".map-empty-text", !mapUrl && !data.venue?.name && !data.venue?.address);
    put(".map-empty-text", text("mapUnavailable"));
    $$('[data-copy]').forEach((node) => { const key = node.dataset.copy; if (copy[envelope.locale]?.[key]) node.textContent = text(key); });
    const personalGreeting = current.guestName
      ? (data.personalGreeting || "").replaceAll("{name}", current.guestName)
      : "";
    put("[data-copy='guestGreeting']", personalGreeting || data.greeting || text("guestGreeting"));
    $("[data-orchid-open]").setAttribute("aria-label", text("openInvitation"));
    $("[data-orchid-top]").setAttribute("aria-label", text("backTop"));
    $("[data-orchid-lightbox-close]").setAttribute("aria-label", text("close"));
    const coupleSection = show('[data-section="couple"]', !!(data.groom || data.bride));
    if (coupleSection) {
        const images = [safeUrl(data.groomImage) || (envelope.preview ? BASE + "groom.png" : ""), safeUrl(data.brideImage) || (envelope.preview ? BASE + "bride.png" : "")];
      $$(".person-profile").forEach((card, i) => {
        card.hidden = !(i ? data.bride : data.groom);
        show(".person-photo-frame", !!images[i], card);
        if (images[i]) $(".person-photo-frame img", card).src = images[i];
      });
    }
    renderPersonSocials(data);
    setImages(data, envelope.preview); renderCountdown(data); renderProgram(data); renderGallery(data); renderStory(data, envelope.preview); renderWishes(data);
    if (!envelope.preview && data.wishesEnabled && envelope.invitationId && wishesFor !== envelope.invitationId) {
      wishesFor = envelope.invitationId;
      fetch(`/api/public/invitations/${encodeURIComponent(envelope.invitationId)}/wishes`, { credentials: "same-origin" })
        .then((response) => response.ok ? response.json() : null)
        .then((result) => { if (result && Array.isArray(result.wishes)) { remoteWishes = result.wishes; renderWishes(data); } })
        .catch(() => {});
    }
    const contacts = $("[data-orchid-contacts]"); contacts.replaceChildren();
    (data.contacts || []).filter((contact) => contact?.href && contact?.value).forEach((contact) => {
      const link = document.createElement("a"); link.href = contact.href; link.textContent = [contact.label, contact.value].filter(Boolean).join(": ");
      if (/^https:/i.test(contact.href)) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
      contacts.append(link);
    });
    show("[data-orchid-contacts]", contacts.childElementCount > 0);
    show('[data-section="gift"]', !!data.toyona?.enabled && !!data.toyona?.cardNumber);
    put("[data-orchid-card]", data.toyona?.cardNumber || "");
    put("[data-orchid-holder]", data.toyona?.cardHolder || couple(data));
    const giftNote = (data.toyona?.note || "").trim();
    put("[data-orchid-gift-note]", giftNote);
    show("[data-orchid-gift-note]", !!giftNote);
    show('[data-section="rsvp"]', !!data.rsvp?.enabled);
    put("[data-orchid-calendar]", text("addCalendar"));
    const rsvpForm = $("[data-orchid-rsvp]");
    const rsvpName = $("[name=name]", rsvpForm);
    if (rsvpName) { rsvpName.placeholder = `${text("name")}*`; rsvpName.setAttribute("aria-label", text("name")); }
    $(".rsvp-options", rsvpForm).setAttribute("aria-label", text("answer"));
    if (rsvpName && envelope.guestName) { rsvpName.value = envelope.guestName; rsvpName.readOnly = true; }
    if (envelope.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches) document.documentElement.classList.add("orchid-reduced-motion"); else document.documentElement.classList.remove("orchid-reduced-motion");
    document.documentElement.classList.add("orchid-ready");
    const audio = $("[data-orchid-audio]"); audio.src = safeUrl(data.music?.url) || ""; show("[data-orchid-music]", !!audio.src);
    const sampleOnly = !!envelope.preview;
    $$('[data-orchid-rsvp] input,[data-orchid-rsvp] select,[data-orchid-rsvp] button[type="submit"],[data-orchid-rsvp-choice],[data-orchid-wishes-form] input,[data-orchid-wishes-form] textarea,[data-orchid-wishes-form] button[type="submit"]').forEach((el) => { el.disabled = sampleOnly; });
    show("[data-orchid-main]", opened);
  }
  const revealer = new IntersectionObserver((entries) => entries.forEach((entry) => { entry.target.classList.toggle("orchid-visible", entry.isIntersecting); }), { threshold: 0.34, rootMargin: "0px 0px -10% 0px" });
  $$(".orchid-reveal").forEach((node) => revealer.observe(node));
  $("[data-orchid-open]").addEventListener("click", async () => {
    const gate = $("[data-orchid-gate]"); document.documentElement.classList.remove("orchid-ready"); gate.classList.add("orchid-gate-opening");
    if (current?.data?.music?.url && !current?.silentPlayback) { const audio = $("[data-orchid-audio]"); try { await audio.play(); } catch { /* Music remains opt-in after a rejected play request. */ } }
    // The source AnimatePresence waits for its longest child exit: envelope 0.9s + 0.22s delay.
    window.setTimeout(() => { opened = true; gate.hidden = true; show("[data-orchid-main]", true); scrollTemplateToTop(); }, document.documentElement.classList.contains("orchid-reduced-motion") ? 0 : 1120);
  });
  $("[data-orchid-music]").addEventListener("click", async (event) => { const audio = $("[data-orchid-audio]"); if (audio.paused) { try { await audio.play(); audioStarted = true; } catch {} } else audio.pause(); const button = event.currentTarget; button.setAttribute("aria-pressed", String(!audio.paused)); button.setAttribute("aria-label", text(audio.paused ? "musicOn" : "musicOff")); });
  $("[data-orchid-calendar]").addEventListener("click", () => {
    const data = current?.data || {}; const start = new Date(data.dateTime || ""); if (!Number.isFinite(start.getTime())) return;
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({ action: "TEMPLATE", text: couple(data), dates: `${stamp(start)}/${stamp(end)}`, details: data.message || "", location: [data.venue?.name, data.venue?.address].filter(Boolean).join(", ") });
    window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank", "noopener,noreferrer");
  });
  $("[data-orchid-calendar]").textContent = text("addCalendar");
  $("[data-orchid-top]").addEventListener("click", scrollTemplateToTop);
  $("[data-orchid-gift-toggle]").addEventListener("click", () => {
    const trigger = $("[data-orchid-gift-toggle]");
    const panel = $("[data-orchid-gift]");
    const opening = trigger.getAttribute("aria-expanded") !== "true";
    panel.getAnimations().forEach((animation) => animation.cancel());
    trigger.setAttribute("aria-expanded", String(opening));
    if (opening) {
      panel.hidden = false;
      if (!document.documentElement.classList.contains("orchid-reduced-motion")) {
        panel.animate(
          [{ opacity: 0, transform: "translateY(22px) scale(.96)", filter: "blur(6px)" }, { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" }],
          { duration: 500, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" },
        );
      }
      return;
    }
    if (document.documentElement.classList.contains("orchid-reduced-motion")) { panel.hidden = true; return; }
    const exit = panel.animate(
      [{ opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" }, { opacity: 0, transform: "translateY(14px) scale(.96)", filter: "blur(6px)" }],
      { duration: 500, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" },
    );
    exit.finished.catch(() => {}).then(() => { if (!trigger.getAttribute("aria-expanded") || trigger.getAttribute("aria-expanded") === "false") panel.hidden = true; });
  });
  $("[data-orchid-copy]").addEventListener("click", async () => { const value = $("[data-orchid-card]").textContent; try { await navigator.clipboard.writeText(value); } catch { const field = document.createElement("textarea"); field.value = value; document.body.append(field); field.select(); document.execCommand("copy"); field.remove(); } put("[data-orchid-copy]", text("copied")); window.setTimeout(() => put("[data-orchid-copy]", "⧉"), 1200); });
  $("[data-orchid-lightbox-close]").addEventListener("click", closeLightbox);
  $("[data-orchid-lightbox]").addEventListener("click", (event) => { if (event.target === event.currentTarget) closeLightbox(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeLightbox(); });
  $$("[data-orchid-rsvp-choice]").forEach((choice) => choice.addEventListener("click", () => {
    const form = choice.closest("[data-orchid-rsvp]");
    $("[data-orchid-rsvp-status]", form).value = choice.dataset.orchidRsvpChoice;
    $$("[data-orchid-rsvp-choice]", form).forEach((option) => option.setAttribute("aria-checked", String(option === choice)));
  }));
  $("[data-orchid-rsvp]").addEventListener("submit", async (event) => {
    event.preventDefault(); const form = event.currentTarget; const feedback = $("[data-orchid-rsvp-feedback]");
    if (current?.preview) { feedback.textContent = text("previewOnly"); return; }
    const body = new FormData(form); const status = body.get("status");
    if (!status) { feedback.textContent = text("choose"); $("[data-orchid-rsvp-choice]", form).focus(); return; }
    const submit = $("[type=submit]", form); submit.disabled = true;
    try { const response = await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/rsvp`, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: body.get("name"), status: body.get("status"), partySize: body.get("status") === "yes" ? 1 : 0, ...(current.guestToken ? { guestToken: current.guestToken } : {}) }) }); if (!response.ok) throw new Error(); feedback.textContent = text("sent"); }
    catch { feedback.textContent = text("failed"); } finally { submit.disabled = false; }
  });
  $("[data-orchid-wishes-form]").addEventListener("submit", async (event) => {
    event.preventDefault(); const form = event.currentTarget; const feedback = $("[data-orchid-wishes-feedback]");
    if (current?.preview) { feedback.textContent = text("previewOnly"); return; }
    const body = new FormData(form); const submit = $("[type=submit]", form); submit.disabled = true;
    try { const response = await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/wishes`, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: body.get("name"), message: body.get("text"), ...(current.guestToken ? { guestToken: current.guestToken } : {}) }) }); if (!response.ok) throw new Error(); feedback.textContent = text("sent"); form.reset(); const refreshed = await fetch(`/api/public/invitations/${encodeURIComponent(current.invitationId)}/wishes`, { credentials: "same-origin" }); const result = refreshed.ok ? await refreshed.json() : null; if (result && Array.isArray(result.wishes)) { remoteWishes = result.wishes; renderWishes(current.data); } }
    catch { feedback.textContent = text("failed"); } finally { submit.disabled = false; }
  });
  function accept(message) {
    if (message?.type !== `${ID}:update` || !message.payload?.data) return;
    render(message.payload.data, message.payload);
  }
  addEventListener("message", (event) => { if (event.source === parent && event.origin === location.origin) accept(event.data); });
  try { const initial = JSON.parse(window.name); if (initial?.type === `${ID}:update`) accept(initial); } catch { /* Ignore empty iframe name. */ }
})();
