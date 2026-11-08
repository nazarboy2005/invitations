/* Only platform data and service bindings. No captured app runtime or sample data. */
(() => {
  "use strict";
  const root = document.querySelector("[data-chorlove-template]");
  if (!root) return;
  const id = root.dataset.chorloveTemplate;
  const q = (s, b = root) => b?.querySelector(s),
    all = (s, b = root) => [...(b?.querySelectorAll(s) || [])];
  const set = (n, v) => {
    if (n) n.textContent = String(v ?? "");
  };
  const field = (key, value, b = root) =>
    all(`[data-field="${key}"]`, b).forEach((n) => set(n, value));
  const section = (key) => q(`[data-section="${key}"]`);
  let payload = null,
    version = 0,
    timer = 0,
    musicPaused = false,
    musicAttempted = false,
    musicSource = "";
  const copies = {
    "Qolgan vaqt": ["Қолган вақт", "Time remaining", "До торжества осталось"],
    Kun: ["Кун", "Days", "Дни"],
    Soat: ["Соат", "Hours", "Часы"],
    Daqiqa: ["Дақиқа", "Minutes", "Минуты"],
    Soniya: ["Сония", "Seconds", "Секунды"],
    "Biz uchun qadrli lahzalar": [
      "Биз учун қадрли лаҳзалар",
      "Our precious moments",
      "Дорогие нам мгновения",
    ],
    "Bog'lanish uchun": ["Боғланиш учун", "Contact", "Контакты"],
    "Bu kunni siz bilan baham ko'rishdan juda xursandmiz": [
      "Бу кунни сиз билан баҳам кўришдан жуда хурсандмиз",
      "We are so happy to share this day with you",
      "Мы счастливы разделить этот день с вами",
    ],
    "Bu lahzani intiqlik bilan kutyapmiz!": [
      "Бу лаҳзани интиқлик билан кутяпмиз!",
      "We are looking forward to this moment!",
      "С нетерпением ждём этого момента!",
    ],
    Dastur: ["Дастур", "Program", "Программа"],
    "Dress-kod": ["Кийиниш услуби", "Dress code", "Дресс-код"],
    Galereya: ["Галерея", "Gallery", "Галерея"],
    "Hurmat bilan": ["Ҳурмат билан", "With love from", "С уважением"],
    "Iltimos, javobingizni bildiring.": [
      "Илтимос, жавобингизни билдиринг.",
      "Please let us know your response.",
      "Пожалуйста, сообщите, сможете ли вы прийти.",
    ],
    "Ism va familiyangiz": [
      "Исм ва фамилиянгиз",
      "Your full name",
      "Ваше имя и фамилия",
    ],
    Javobingiz: ["Жавобингиз", "Your response", "Ваш ответ"],
    "Kalendariga qo'shish": [
      "Тақвимга қўшиш",
      "Add to calendar",
      "Добавить в календарь",
    ],
    "Karta raqami": ["Карта рақами", "Card number", "Номер карты"],
    "Kela olmayman": ["Кела олмайман", "I can't attend", "Не смогу прийти"],
    Kelaman: ["Келаман", "I'll attend", "Приду"],
    "Kelasizmi?": ["Келасизми?", "Will you attend?", "Вы придёте?"],
    "Ko'rish uchun\nsuring": [
      "Кўриш учун\nсуринг",
      "Scratch to\nreveal",
      "Потрите, чтобы\nувидеть",
    ],
    "Liboslaringiz bayramimiz ranglariga mos bo'lsa, xursand bo'lamiz.": [
      "Либосларингиз байрамимиз рангларига мос бўлса, хурсанд бўламиз.",
      "We would love your outfits to complement our celebration colours.",
      "Будем рады, если ваши наряды будут сочетаться с цветами праздника.",
    ],
    Manzil: ["Манзил", "Venue", "Место проведения"],
    "Marosim va bayram": [
      "Маросим ва байрам",
      "Ceremony and celebration",
      "Церемония и торжество",
    ],
    "Mehmonlar uchun": ["Меҳмонлар учун", "For our guests", "Для гостей"],
    Nusxa: ["Нусха", "Copy", "Копировать"],
    "Ochish uchun bosing": [
      "Очиш учун босинг",
      "Tap to open",
      "Нажмите, чтобы открыть",
    ],
    "Qayerda nishonlaymiz": [
      "Қаерда нишонлаймиз",
      "Where we celebrate",
      "Где мы празднуем",
    ],
    "Samimiy taklif": [
      "Самимий таклиф",
      "A heartfelt invitation",
      "Искреннее приглашение",
    ],
    "Savollaringiz bo'lsa, bemalol bog'laning.": [
      "Саволларингиз бўлса, бемалол боғланинг.",
      "Please contact us with any questions.",
      "Если у вас есть вопросы, свяжитесь с нами.",
    ],
    "Sizni intizorlik bilan kutamiz.": [
      "Сизни интизорлик билан кутамиз.",
      "We look forward to seeing you.",
      "С нетерпением ждём вас.",
    ],
    "Sizning ishtirokingiz biz uchun juda qadrli.": [
      "Сизнинг иштирокингиз биз учун жуда қадрли.",
      "Your presence means a lot to us.",
      "Ваше присутствие очень ценно для нас.",
    ],
    "Sizning ishtirokingiz — eng yaxshi sovg'a": [
      "Сизнинг иштирокингиз — энг яхши совға",
      "Your presence is the greatest gift",
      "Ваше присутствие — лучший подарок",
    ],
    "Sovg'a o'rniga karta orqali tabriklashingiz mumkin": [
      "Совға ўрнига карта орқали табриклашингиз мумкин",
      "You can send a gift by card",
      "Вы можете отправить подарок на карту",
    ],
    "Tavsiya etilgan ranglar": [
      "Тавсия этилган ранглар",
      "Suggested colours",
      "Рекомендуемые цвета",
    ],
    Telefon: ["Телефон", "Phone", "Телефон"],
    "Tilak yuborish": ["Тилак юбориш", "Send wish", "Отправить пожелание"],
    Tilaklar: ["Тилаклар", "Wishes", "Пожелания"],
    "To'y Dasturi": ["Тўй дастури", "Wedding program", "Программа свадьбы"],
    "To'y dasturi": ["Тўй дастури", "Wedding program", "Программа свадьбы"],
    "To'y egaslariga o'z ezgu tilaklaringizni qoldiring": [
      "Тўй эгаларига эзгу тилакларингизни қолдиринг",
      "Leave your kind wishes for the couple",
      "Оставьте добрые пожелания молодожёнам",
    ],
    "To'yona": ["Тўёна", "Gift", "Подарок"],
    "Xaritani ochish": ["Харитани очиш", "Open map", "Открыть карту"],
    "Xaritada ko'rish": ["Харитада кўриш", "View map", "Посмотреть на карте"],
    "Xaritada ochish": ["Харитада очиш", "Open in maps", "Открыть в картах"],
    Yuborish: ["Юбориш", "Submit", "Отправить"],
    "sizni to'ylariga taklif qiladi": [
      "сизни тўйларига таклиф қилади",
      "invite you to their wedding",
      "приглашают вас на свою свадьбу",
    ],
    Scroll: ["Пастга суринг", "Scroll", "Листайте вниз"],
  };
  const messages = {
    preview: [
      "Ko‘rish rejimida yuborish o‘chiq.",
      "Кўриш режимида юбориш ўчиқ.",
      "Submission is disabled in preview.",
      "Отправка в режиме просмотра отключена.",
    ],
    success: [
      "Javobingiz saqlandi. Rahmat!",
      "Жавобингиз сақланди. Раҳмат!",
      "Your response was saved. Thank you!",
      "Ваш ответ сохранён. Спасибо!",
    ],
    wishSent: [
      "Tilagingiz tekshirish uchun yuborildi.",
      "Тилагингиз текшириш учун юборилди.",
      "Your wish was sent for approval.",
      "Ваше пожелание отправлено на модерацию.",
    ],
    error: [
      "Yuborilmadi. Qayta urinib ko‘ring.",
      "Юборилмади. Қайта уриниб кўринг.",
      "Could not send. Please try again.",
      "Не удалось отправить. Попробуйте ещё раз.",
    ],
    choose: [
      "Javobingizni tanlang.",
      "Жавобингизни танланг.",
      "Choose your response.",
      "Выберите ответ.",
    ],
    name: ["Ismingiz", "Исмингиз", "Your name", "Ваше имя"],
    wish: ["Tilagingiz", "Тилагингиз", "Your wish", "Ваше пожелание"],
    copied: ["Nusxalandi", "Нусхаланди", "Copied", "Скопировано"],
    copyError: [
      "Nusxalab bo‘lmadi",
      "Нусхалаб бўлмади",
      "Could not copy",
      "Не удалось скопировать",
    ],
    play: ["Musiqani yoqish", "Мусиқани ёқиш", "Play music", "Включить музыку"],
    pause: [
      "Musiqani to‘xtatish",
      "Мусиқани тўхтатиш",
      "Pause music",
      "Остановить музыку",
    ],
  };
  const localeIndex = () =>
    ["uz-Latn", "uz-Cyrl", "en", "ru"].indexOf(payload?.locale) >= 0
      ? ["uz-Latn", "uz-Cyrl", "en", "ru"].indexOf(payload.locale)
      : 0;
  const msg = (key) => messages[key]?.[localeIndex()] || key;
  const copy = (key) =>
    localeIndex() === 0 ? key : copies[key]?.[localeIndex() - 1] || key;
  const programTemplates = all("[data-program-row]").map((n) =>
    n.cloneNode(true),
  );
  const programBackdrop =
    id === "shisha-naqshi"
      ? q("[data-program-list] > div:not([data-program-row])")?.cloneNode(true)
      : null;
  const galleryTemplates = all("[data-gallery-card]").map((n) =>
    (id === "shisha-naqshi" ? n : n.parentElement).cloneNode(true),
  );
  const wishTemplate = q("[data-wish-row]")?.cloneNode(true);
  const dressPaint = all('[style*="background"]', section("dress")).filter(
    (n) => !n.querySelector('[style*="background"]'),
  )[0];
  const dressTemplate = (id === "shisha-naqshi" ? dressPaint?.parentElement : dressPaint)?.cloneNode(true),
    dressList = id === "shisha-naqshi" ? dressPaint?.parentElement.parentElement : dressPaint?.parentElement;
  const contactTemplates = new Map(
    all("[data-contact]").map((n) => [
      n.dataset.contact,
      (id === "shisha-naqshi" ? n : n.closest("li")).cloneNode(true),
    ]),
  );
  const audio = document.createElement("audio");
  audio.loop = true;
  audio.preload = "none";
  root.append(audio);
  const musicButton = q('[aria-label="Toggle music"]');
  if (musicButton) musicButton.dataset.musicControl = "";
  let galleryIndex = 0,
    galleryTimer = 0,
    galleryItems = [],
    observer = null;
  let carousel = null;

  function status(form) {
    let n = q("[data-status]", form);
    if (!n) {
      n = document.createElement("p");
      n.dataset.status = "";
      n.setAttribute("role", "status");
      n.setAttribute("aria-live", "polite");
      form.append(n);
    }
    return n;
  }
  function music(d, p) {
    const src = d.music?.enabled ? d.music.url || "" : "";
    if (src !== musicSource) {
      audio.pause();
      musicSource = src;
      musicAttempted = false;
      if (src) audio.src = src;
      else audio.removeAttribute("src");
    }
    audio.muted = Boolean(p.preview && p.silentPlayback);
    if (musicButton) {
      musicButton.hidden = !src || Boolean(p.preview && p.silentPlayback);
      musicButton.setAttribute(
        "aria-label",
        msg(audio.paused ? "play" : "pause"),
      );
      musicButton.setAttribute("aria-pressed", String(!audio.paused));
      musicButton.onclick = () => {
        musicPaused = !audio.paused;
        if (musicPaused) audio.pause();
        else audio.play().catch(() => {});
      };
    }
    if (!p.preview && src && !musicPaused && !musicAttempted) {
      musicAttempted = true;
      audio.play().catch(() => {});
    }
  }
  for (const event of ["play", "pause"])
    audio.addEventListener(event, () => {
      if (musicButton) {
        musicButton.setAttribute(
          "aria-label",
          msg(audio.paused ? "play" : "pause"),
        );
        musicButton.setAttribute("aria-pressed", String(!audio.paused));
      }
    });
  root.addEventListener("click", () => {
    if (musicSource && !musicPaused && !payload?.silentPlayback)
      audio.play().catch(() => {});
  });
  function calendar(d) {
    const n = q("[data-calendar]");
    if (!n) return;
    n.hidden = !d.dateTime;
    if (!d.dateTime) return;
    const start = new Date(d.dateTime),
      end = new Date(start.getTime() + 7200000),
      ics = (x) =>
        x
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\.\d+Z$/, "Z");
    const escape = (x) =>
      String(x || "")
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Fotiha//Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${escape(payload.invitationId)}@fotiha`,
      `DTSTAMP:${ics(new Date())}`,
      `DTSTART:${ics(start)}`,
      `DTEND:${ics(end)}`,
      `SUMMARY:${escape([d.groom, d.bride].filter(Boolean).join(" & "))}`,
      `LOCATION:${escape([d.venue?.name, d.venue?.address].filter(Boolean).join(", "))}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    if (n.href.startsWith("blob:")) URL.revokeObjectURL(n.href);
    n.href = URL.createObjectURL(
      new Blob([body], { type: "text/calendar;charset=utf-8" }),
    );
    n.download = "invitation.ics";
    n.removeAttribute("target");
  }
  function program(d) {
    const list = q("[data-program-list]");
    if (!list) return;
    const heading =
      id === "shisha-naqshi"
        ? q('[data-copy="To\'y dasturi"]', section("program"))
        : q("h2", section("program"));
    if (d.programHeading) set(heading, d.programHeading);
    list.replaceChildren();
    let block = list;
    (d.program || []).forEach((item, index) => {
      if (id === "shisha-naqshi" && index % 3 === 0) {
        block = document.createElement("div");
        block.className = "relative";
        if (programBackdrop) block.append(programBackdrop.cloneNode(true));
        list.append(block);
      }
      const n =
        programTemplates[index % programTemplates.length]?.cloneNode(true);
      if (!n) return;
      n.dataset.itemId = item.id;
      field("programTime", item.time, n);
      field("programTitle", item.title, n);
      block.append(n);
    });
    section("program").hidden = !d.program?.length;
  }
  function gallery(d) {
    carousel?.destroy();
    carousel = null;
    galleryItems = d.gallery || [];
    clearInterval(galleryTimer);
    const list = q("[data-gallery-grid],[data-gallery-track]");
    if (!list) return;
    list.replaceChildren();
    galleryIndex = Math.min(galleryIndex, Math.max(0, galleryItems.length - 1));
    galleryItems.forEach((item, index) => {
      const n =
        galleryTemplates[index % galleryTemplates.length]?.cloneNode(true);
      if (!n) return;
      const button = n.matches("button") ? n : n.querySelector("button"),
        img = button.querySelector("img");
      img.src = item.src;
      img.alt = item.alt || item.caption || `${copy("Galereya")} ${index + 1}`;
      button.setAttribute("aria-label", img.alt);
      button.onclick = () =>
        window.ThreeGalleryLightbox?.open(galleryItems, index, button);
      list.append(n);
    });
    section("gallery").hidden = !galleryItems.length;
    const dots = q("[data-gallery-dots]");
    if (dots) {
      const sample =
        dots.firstElementChild?.cloneNode(true) ||
        document.createElement("button");
      dots.replaceChildren();
      galleryItems.forEach((_, index) => {
        const b = sample.cloneNode(true);
        b.type = "button";
        b.setAttribute("aria-label", `${copy("Galereya")} ${index + 1}`);
        b.onclick = () => moveGallery(index);
        dots.append(b);
      });
    }
    const prev = q("[data-gallery-prev]"),
      next = q("[data-gallery-next]");
    if (prev) {
      prev.onclick = () => moveGallery(galleryIndex - 1);
      prev.setAttribute(
        "aria-label",
        payload.locale === "ru"
          ? "Назад"
          : payload.locale === "uz-Cyrl"
            ? "Олдинги"
            : payload.locale === "uz-Latn"
              ? "Oldingi"
              : "Previous",
      );
      next.onclick = () => moveGallery(galleryIndex + 1);
      next.setAttribute(
        "aria-label",
        payload.locale === "ru"
          ? "Далее"
          : payload.locale === "uz-Cyrl"
            ? "Кейинги"
            : payload.locale === "uz-Latn"
              ? "Keyingi"
              : "Next",
      );
    }
    const viewport = q("[data-gallery-viewport]");
    if (viewport) {
      const reduced = root.classList.contains("three-reduced-motion");
      list.style.transition = "none";
      carousel = window.ChorloveCarousel.create(
        viewport,
        {
          loop: galleryItems.length > 1,
          align: "center",
          startIndex: galleryIndex,
        },
        [
          window.ChorloveCarousel.autoplay({
            delay: 3500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            playOnInit: !reduced,
          }),
        ],
      );
      const selected = () => {
        galleryIndex = carousel.selectedScrollSnap();
        drawGallery();
      };
      carousel.on("select", selected).on("reInit", selected);
    }
    drawGallery();
  }
  function moveGallery(index) {
    if (!galleryItems.length) return;
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    carousel?.scrollTo(
      galleryIndex,
      root.classList.contains("three-reduced-motion"),
    );
    drawGallery();
  }
  function drawGallery() {
    const track = q("[data-gallery-track]");
    if (!track) return;
    const children = [...track.children];
    children.forEach((n, i) => {
      const b = n.querySelector("button");
      if (b) {
        b.style.transform = i === galleryIndex ? "scale(1)" : "scale(.86)";
        b.style.opacity = i === galleryIndex ? "1" : ".6";
      }
    });
    all("button", q("[data-gallery-dots]")).forEach((b, i) => {
      b.setAttribute("aria-current", String(i === galleryIndex));
      b.style.width = i === galleryIndex ? "20px" : "6px";
      b.style.opacity = i === galleryIndex ? "1" : ".35";
    });
  }
  async function wishes(d, p, currentVersion) {
    const sec = section("wishes"),
      form = q("form", sec),
      list = q("[data-wish-list]", sec);
    sec.hidden = !d.wishesEnabled;
    if (!form || !list) return;
    const name = q("input", form),
      area = q("textarea", form),
      button = q("[type=submit]", form),
      state = status(form);
    name.placeholder = msg("name");
    name.setAttribute("aria-label", msg("name"));
    area.placeholder = msg("wish");
    area.setAttribute("aria-label", msg("wish"));
    name.required = true;
    area.required = true;
    if (!name.value || name.dataset.personalized === "true") {
      name.value = p.guestName || "";
      name.dataset.personalized = String(Boolean(p.guestName));
    }
    list.replaceChildren();
    let values = p.preview ? d.wishes || [] : [];
    if (!p.preview && d.wishesEnabled) {
      try {
        const response = await fetch(
          `/api/public/invitations/${encodeURIComponent(p.invitationId)}/wishes`,
          { cache: "no-store" },
        );
        if (response.ok) values = (await response.json()).wishes || [];
      } catch {}
      if (currentVersion !== version) return;
    }
    values.forEach((w) => {
      const n = wishTemplate.cloneNode(true);
      field("wishName", w.name, n);
      field("wishMessage", w.message || w.text, n);
      list.append(n);
    });
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (p.preview) {
        set(state, msg("preview"));
        return;
      }
      button.disabled = true;
      try {
        const response = await fetch(
          `/api/public/invitations/${encodeURIComponent(p.invitationId)}/wishes`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name.value.trim(),
              message: area.value.trim(),
              guestToken: p.guestToken || undefined,
            }),
          },
        );
        if (!response.ok) throw Error();
        set(state, msg("wishSent"));
        area.value = "";
      } catch {
        set(state, msg("error"));
      } finally {
        button.disabled = false;
      }
    };
  }
  function rsvp(d, p) {
    const sec = section("rsvp"),
      form = q("form", sec);
    sec.hidden = !d.rsvp?.enabled;
    if (!form) return;
    const input = q("input", form),
      choices = all("[role=radio]", form),
      button = q("[type=submit]", form),
      state = status(form);
    input.placeholder = msg("name");
    input.setAttribute("aria-label", msg("name"));
    input.required = true;
    if (!input.value || input.dataset.personalized === "true") {
      input.value = p.guestName || "";
      input.dataset.personalized = String(Boolean(p.guestName));
    }
    choices.forEach((b, index) => {
      b.onclick = () =>
        choices.forEach((other, i) =>
          other.setAttribute("aria-checked", String(i === index)),
        );
      b.onkeydown = (e) => {
        if (
          ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(e.key)
        ) {
          e.preventDefault();
          choices[1 - index].click();
          choices[1 - index].focus();
        }
      };
    });
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (p.preview) {
        set(state, msg("preview"));
        return;
      }
      const answer = choices.findIndex(
        (b) => b.getAttribute("aria-checked") === "true",
      );
      if (answer < 0) {
        set(state, msg("choose"));
        choices[0]?.focus();
        return;
      }
      button.disabled = true;
      try {
        const response = await fetch(
          `/api/public/invitations/${encodeURIComponent(p.invitationId)}/rsvp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: input.value.trim(),
              status: answer ? "no" : "yes",
              partySize: answer ? 0 : 1,
              guestToken: p.guestToken || undefined,
            }),
          },
        );
        if (!response.ok) throw Error();
        set(state, msg("success"));
      } catch {
        set(state, msg("error"));
      } finally {
        button.disabled = false;
      }
    };
  }
  function dress(d) {
    const sec = section("dress"),
      value = d.dressCode || {};
    sec.hidden = !value.enabled;
    const paragraphs = all("p", sec);
    set(
      paragraphs[0],
      [value.style, value.text, value.note].filter(Boolean).join("\n"),
    );
    if (!dressList || !dressTemplate) return;
    dressList.replaceChildren();
    (value.colors || []).forEach((color) => {
      const n = dressTemplate.cloneNode(true),
        paint = n.firstElementChild || n;
      paint.style.background = color.hex;
      n.setAttribute("title", color.name || color.hex);
      n.setAttribute("aria-label", color.name || color.hex);
      dressList.append(n);
    });
  }
  function contacts(d) {
    const sec = section("contacts");
    all('[data-dynamic-contact="true"]', sec).forEach((n) => n.remove());
    for (const [kind, template] of contactTemplates) {
      const old = q(`[data-contact="${kind}"]`, sec);
      const host = id === "shisha-naqshi" ? old : old?.closest("li");
      if (host) host.hidden = true;
      const values = (d.contacts || []).filter((c) => c.type === kind);
      values.forEach((value, index) => {
        const node = index === 0 ? host : template.cloneNode(true);
        if (!node) return;
        if (index > 0) host.parentElement.append(node);
        node.hidden = false;
        node.dataset.dynamicContact = String(index > 0);
        const a = node.matches("a") ? node : q("a", node);
        a.href = value.href;
        const span = q("[data-contact-value]", a);
        if (span) set(span, value.value);
        else set(a, value.value);
      });
    }
    sec.hidden = !d.contacts?.length;
  }
  function locales(p) {
    let nav = q("[data-languages]");
    if (!nav) {
      nav = document.createElement("nav");
      nav.dataset.languages = "";
      root.append(nav);
    }
    nav.setAttribute(
      "aria-label",
      p.locale === "ru"
        ? "Язык"
        : p.locale === "uz-Cyrl"
          ? "Тил"
          : p.locale === "uz-Latn"
            ? "Til"
            : "Language",
    );
    nav.hidden = (p.enabledLocales || []).length < 2;
    nav.replaceChildren();
    (p.enabledLocales || []).forEach((locale) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = { "uz-Latn": "Uz", "uz-Cyrl": "Ўз", en: "En", ru: "Ru" }[
        locale
      ];
      b.setAttribute("aria-pressed", String(locale === p.locale));
      b.onclick = () =>
        parent.postMessage({ type: `${id}:language`, locale }, location.origin);
      nav.append(b);
    });
  }
  function render(p) {
    if (!p?.data) return;
    payload = p;
    const d = p.data,
      currentVersion = ++version;
    document.documentElement.lang = p.locale === "uz-Latn" ? "uz" : p.locale;
    document.title = [d.groom, d.bride].filter(Boolean).join(" & ") || "Fotiha";
    root.classList.toggle(
      "three-reduced-motion",
      Boolean(p.reducedMotion) ||
        matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    all("[data-copy]").forEach((n) => set(n, copy(n.dataset.copy)));
    const numeric = d.date?.day
      ? `${String(d.date.day).padStart(2, "0")}.${String(d.date.monthNumber).padStart(2, "0")}.${d.date.year}`
      : "";
    const data = {
      groom: d.groom,
      bride: d.bride,
      couple: [d.groom, d.bride].filter(Boolean).join(" & "),
      hosts: d.hosts,
      message: d.message,
      greeting: d.greeting,
      cardNumber: d.toyona?.cardNumber,
      cardHolder: d.toyona?.cardHolder,
      venueName: d.venue?.name,
      address: d.venue?.address,
      date: d.date?.short,
      dateNumeric: numeric,
      day: d.date?.day,
      month: d.date?.month,
      year: d.date?.year,
      time: d.date?.time,
    };
    for (const [key, value] of Object.entries(data)) field(key, value);
    const scratch = q("[data-scratch-photo]");
    if (scratch) {
      const source =
        p.preview && p.sampleScratchPhoto
          ? p.sampleScratchPhoto
          : d.gallery?.[0]?.src;
      section("scratch").hidden = !source;
      if (source) {
        scratch.src = source;
        scratch.alt = d.gallery?.[0]?.alt || data.couple;
      } else scratch.removeAttribute("src");
    }
    all("[data-field=hosts]").forEach((n) => {
      n.parentElement.parentElement.hidden = !d.hosts;
    });
    all("[data-map]").forEach((a) => {
      a.href = d.venue?.mapUrl || "#";
      a.hidden = !d.venue?.mapUrl;
    });
    all("[data-venue-frame]").forEach((frame) => {
      const destination = d.venue?.mapUrl;
      frame.hidden = !destination || d.venue.lat == null || d.venue.lng == null;
      if (frame.hidden) {
        frame.removeAttribute("src");
        return;
      }
      const query = new URLSearchParams({ destination });
      if (d.venue.lat != null && d.venue.lng != null) {
        query.set("latitude", String(d.venue.lat));
        query.set("longitude", String(d.venue.lng));
      }
      frame.src = `/maps/venue?${query}`;
      frame.title = copy("Manzil");
    });
    section("venue").hidden =
      !d.venue?.name && !d.venue?.address && !d.venue?.mapUrl;
    if (id === "shisha-naqshi") {
      const label = q('[data-copy="sizni to\'ylariga taklif qiladi"]');
      if (label) set(label, d.eventType);
    }
    const gift = section("gift");
    gift.hidden = !d.toyona?.enabled;
    const copyButton = q("button", gift);
    if (copyButton)
      copyButton.onclick = async () => {
        try {
          await navigator.clipboard.writeText(d.toyona?.cardNumber || "");
          set(status(gift), msg("copied"));
        } catch {
          set(status(gift), msg("copyError"));
        }
      };
    const note = all("p", gift).find(
      (n) =>
        n.textContent ===
        copy("Sovg'a o'rniga karta orqali tabriklashingiz mumkin"),
    );
    if (note && d.toyona?.note) set(note, d.toyona.note);
    calendar(d);
    program(d);
    gallery(d);
    dress(d);
    contacts(d);
    void wishes(d, p, currentVersion);
    rsvp(d, p);
    locales(p);
    music(d, p);
    clearInterval(timer);
    const tick = () => {
      let remaining = Number.isFinite(Date.parse(d.dateTime))
        ? Math.max(0, Math.floor((Date.parse(d.dateTime) - Date.now()) / 1000))
        : 0;
      const values = [
        Math.floor(remaining / 86400),
        Math.floor(remaining / 3600) % 24,
        Math.floor(remaining / 60) % 60,
        remaining % 60,
      ];
      all('[data-copy="0"],[data-copy="00"]', section("countdown")).forEach(
        (n, i) =>
          set(
            n,
            String(values[i] || 0).padStart(
              id === "shisha-naqshi" ? 1 : 2,
              "0",
            ),
          ),
      );
    };
    tick();
    timer = setInterval(tick, 1000);
    window.ChorloveMotion.update({
      root,
      payload: p,
      onOpen: () => {
        if (musicSource && !musicPaused && !p.silentPlayback)
          audio.play().catch(() => {});
      },
    });
    const cue = q("[data-scroll-cue] span");
    if (cue) {
      set(
        cue,
        localeIndex() === 0
          ? "Pastga suring"
          : localeIndex() === 1
            ? "Пастга суринг"
            : localeIndex() === 2
              ? "Scroll down"
              : "Листайте вниз",
      );
      cue.parentElement.setAttribute("aria-label", cue.textContent);
    }
    const canvas = q("canvas");
    if (canvas)
      canvas.setAttribute(
        "aria-label",
        copy("Ko'rish uchun\nsuring").replace("\n", " "),
      );
    if (id !== "shisha-naqshi") {
      const intro = q("[data-opening] video")?.nextElementSibling;
      if (intro) {
        let guest = q("[data-personal-guest]", intro);
        if (!guest) {
          guest = document.createElement("p");
          guest.dataset.personalGuest = "";
          guest.className =
            "absolute inset-x-0 top-[66%] px-8 text-center font-great-vibes text-3xl";
          intro.prepend(guest);
        }
        set(guest, p.guestName ? d.greeting || p.guestName : "");
        guest.hidden = !p.guestName;
      }
    }
    observer?.disconnect();
    const scroll = q("[data-scroll]");
    observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.ChorloveMotion.reveal(
              entry.target,
              root.classList.contains("three-reduced-motion"),
            );
            observer.unobserve(entry.target);
          }
        }),
      { root: scroll || null, threshold: id === "shisha-naqshi" ? 0.25 : 0.3 },
    );
    all("[data-reveal]:not([data-hero-reveal])").forEach((n) =>
      observer.observe(n),
    );
    root.style.visibility = "visible";
    root.setAttribute("aria-busy", "false");
  }
  addEventListener("message", (e) => {
    if (
      e.source === parent &&
      e.origin === location.origin &&
      e.data?.type === `${id}:update`
    )
      render(e.data.payload);
  });
  try {
    const initial = JSON.parse(window.name);
    if (initial?.type === `${id}:update`) render(initial.payload);
  } catch {}
})();
