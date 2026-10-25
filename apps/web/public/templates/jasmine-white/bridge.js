(() => {
  "use strict";
  const id = "jasmine-white";
  const root = document.querySelector('[data-chorlove-template="jasmine-white"]');
  if (!root) return;
  const sections = [...root.querySelectorAll("section")];
  const copy = {
    "uz-Latn": {
      title: "Taklifnoma", welcome: "Assalomu alaykum, aziz mehmon", couple: "Kuyov & Kelin",
      event: "Nikoh to'yi", date: "To'y sanasi", time: "Vaqt", invite: "Sizni hayotimizdagi eng baxtli kun — to'yimizga taklif qilamiz",
      hosts: "Hurmat bilan:", open: "Taklifnomani ochish", story: "Bizning hikoyamiz", calendar: "Sanamizni eslab qoling",
      calendarHint: "Bu kunni kalendaringizda belgilab qo'ying — sizni kutamiz.", addCalendar: "Kalendariga qo'shish",
      countdown: "Eng baxtli kungacha", venue: "To'y manzili", map: "Xaritada ko'rish", program: "To'y dasturi",
      programHint: "To'y kuni tartibi", wishes: "Mehmonlar tilaklari", wishHint: "Kelin-kuyovga tilagingizni qoldiring",
      wish: "Kelin-kuyovga tilagingiz...", guest: "Ismingiz", wishSend: "Tilak yuborish", rsvp: "Kelasizmi?",
      rsvpHint: "Iltimos, javobingizni bildiring.", yes: "Kelaman", no: "Kela olmayman", send: "Yuborish",
      gift: "Sovg'a yuborish", openGift: "Ochish uchun bosing", closeGift: "Yopish",
      bankCard: "Bank kartasi", cardHolder: "Karta egasi", giftMessage: "Tashrifingiz biz uchun eng katta sovg'a.", copyCard: "Nusxa olish", copied: "Karta raqami nusxalandi.", copyError: "Nusxa olib bo'lmadi.",
      contact: "Bog'lanish uchun", phone: "Telefon", telegram: "Telegram", photo: "Surat", close: "Yopish",
      previous: "Oldingi", next: "Keyingi", guestRequired: "Ismingizni kiriting.", wishRequired: "Tilagingizni yozing.",
      chooseResponse: "Javobingizni tanlang.", saved: "Javobingiz saqlandi. Rahmat!", submitted: "Tilagingiz yuborildi.",
      error: "Yuborilmadi. Qayta urinib ko'ring.", preview: "Ko'rish rejimida yuborish o'chiq.",
      musicOn: "Musiqani yoqish", musicOff: "Musiqani to'xtatish", musicError: "Musiqa mavjud emas", language: "Til",
    },
    "uz-Cyrl": {
      title: "Таклифнома", welcome: "Ассалому алайкум, азиз меҳмон", couple: "Куёв & Келин",
      event: "Никоҳ тўйи", date: "Тўй санаси", time: "Вақт", invite: "Сизни ҳаётимиздаги энг бахтли кун — тўйимизга таклиф қиламиз",
      hosts: "Ҳурмат билан:", open: "Таклифномани очиш", story: "Бизнинг ҳикоямиз", calendar: "Санамизни эслаб қолинг",
      calendarHint: "Бу кунни тақвимингизда белгилаб қўйинг — сизни кутамиз.", addCalendar: "Тақвимга қўшиш",
      countdown: "Энг бахтли кунгача", venue: "Тўй манзили", map: "Харитада кўриш", program: "Тўй дастури",
      programHint: "Тўй куни тартиби", wishes: "Меҳмонлар тилаклари", wishHint: "Келин-куёвга тилагингизни қолдиринг",
      wish: "Келин-куёвга тилагингиз...", guest: "Исмингиз", wishSend: "Тилак юбориш", rsvp: "Келасизми?",
      rsvpHint: "Илтимос, жавобингизни билдиринг.", yes: "Келаман", no: "Кела олмайман", send: "Юбориш",
      gift: "Совға юбориш", openGift: "Очиш учун босинг", closeGift: "Ёпиш",
      bankCard: "Банк картаси", cardHolder: "Карта эгаси", giftMessage: "Ташрифингиз биз учун энг катта совға.", copyCard: "Нусха олиш", copied: "Карта рақами нусхаланди.", copyError: "Нусха олиб бўлмади.",
      contact: "Боғланиш учун", phone: "Телефон", telegram: "Telegram", photo: "Сурат", close: "Ёпиш",
      previous: "Олдинги", next: "Кейинги", guestRequired: "Исмингизни киритинг.", wishRequired: "Тилагингизни ёзинг.",
      chooseResponse: "Жавобингизни танланг.", saved: "Жавобингиз сақланди. Раҳмат!", submitted: "Тилагингиз юборилди.",
      error: "Юборилмади. Қайта уриниб кўринг.", preview: "Кўриш режимида юбориш ўчиқ.",
      musicOn: "Мусиқани ёқиш", musicOff: "Мусиқани тўхтатиш", musicError: "Мусиқа мавжуд эмас", language: "Тил",
    },
    en: {
      title: "Invitation", welcome: "Hello, dear guest", couple: "Groom & Bride", event: "Wedding", date: "Wedding date",
      invite: "We invite you to the happiest day of our lives", hosts: "With love from:", open: "Open the invitation",
      story: "Our story", calendar: "Save our date", calendarHint: "Mark this day in your calendar — we look forward to seeing you.",
      addCalendar: "Add to calendar", countdown: "Until our happiest day", venue: "Venue", map: "View map", program: "Wedding program",
      programHint: "Schedule for the day", wishes: "Guest wishes", wishHint: "Leave a wish for the couple", wish: "Your wish for the couple...",
      guest: "Your name", wishSend: "Send wish", rsvp: "Will you attend?", rsvpHint: "Please let us know your response.", time: "Time",
      yes: "I'll attend", no: "Can't attend", send: "Submit", gift: "Send a gift",
      openGift: "Tap to open", closeGift: "Close", cardHolder: "Card holder", copyCard: "Copy number",
      copied: "Card number copied.", copyError: "Could not copy the card number.", contact: "Contact us", phone: "Phone",
      bankCard: "Bank Card", giftMessage: "Your presence is the greatest gift for us.",
      telegram: "Telegram", photo: "Photo", close: "Close", previous: "Previous", next: "Next", guestRequired: "Enter your name.",
      wishRequired: "Write your wish.", chooseResponse: "Choose your response.", saved: "Your response was saved. Thank you!",
      submitted: "Your wish was sent.", error: "Could not send. Please try again.", preview: "Submission is disabled in preview.",
      musicOn: "Play music", musicOff: "Pause music", musicError: "Music is unavailable", language: "Language",
    },
    ru: {
      title: "Приглашение", welcome: "Здравствуйте, дорогой гость", couple: "Жених и невеста", event: "Свадьба", date: "Дата свадьбы",
      invite: "Приглашаем вас на самый счастливый день нашей жизни", hosts: "С уважением:", open: "Открыть приглашение",
      story: "Наша история", calendar: "Сохраните дату", calendarHint: "Отметьте этот день в календаре — будем рады вас видеть.",
      addCalendar: "Добавить в календарь", countdown: "До нашего счастливого дня", venue: "Место проведения", map: "Посмотреть карту",
      program: "Программа свадьбы", programHint: "Расписание дня", wishes: "Пожелания гостей", wishHint: "Оставьте пожелание молодожёнам",
      wish: "Ваше пожелание молодожёнам...", guest: "Ваше имя", wishSend: "Отправить пожелание", rsvp: "Вы придёте?",
      rsvpHint: "Пожалуйста, сообщите, сможете ли вы прийти.", yes: "Приду", no: "Не смогу прийти", send: "Отправить", time: "Время",
      gift: "Подарок", openGift: "Нажмите, чтобы открыть", closeGift: "Закрыть",
      cardHolder: "Владелец карты", copyCard: "Скопировать номер", copied: "Номер карты скопирован.", copyError: "Не удалось скопировать номер карты.",
      contact: "Связаться с нами", phone: "Телефон", telegram: "Telegram", photo: "Фото", close: "Закрыть",
      bankCard: "Банковская карта", giftMessage: "Ваше присутствие — лучший подарок для нас.",
      previous: "Назад", next: "Далее", guestRequired: "Введите ваше имя.", wishRequired: "Напишите пожелание.",
      chooseResponse: "Выберите ваш ответ.", saved: "Ваш ответ сохранён. Спасибо!", submitted: "Ваше пожелание отправлено.",
      error: "Не удалось отправить. Попробуйте ещё раз.", preview: "Отправка в режиме просмотра отключена.",
      musicOn: "Включить музыку", musicOff: "Остановить музыку", musicError: "Музыка недоступна", language: "Язык",
    },
  };

  let payload;
  let timer;
  const sourcePetals = [
    { left: "54.71%", color: "#eef4d0", size: "13.2px", sway: 3, duration: 10.7, delay: 1.51 },
    { left: "47.86%", color: "#ffffff", size: "23.5px", sway: 24.1, duration: 10.1, delay: 0.07 },
    { left: "16.77%", color: "#d4e4a0", size: "20.2px", sway: 28, duration: 12.7, delay: 0.98 },
    { left: "56.77%", color: "#d4e4a0", size: "19.6px", sway: 11.2, duration: 10.3, delay: 2.3 },
    { left: "90.04%", color: "#eef4d0", size: "21.4px", sway: -15, duration: 10.2, delay: 1.76 },
    { left: "55.55%", color: "#ffffff", size: "16.4px", sway: -18.7, duration: 11.1, delay: 0.77 },
    { left: "36.06%", color: "#eef4d0", size: "18.3px", sway: -11.3, duration: 10.7, delay: 1.94 },
    { left: "84.13%", color: "#c8d88a", size: "10.3px", sway: -8.6, duration: 8.7, delay: 1.01 },
    { left: "31.61%", color: "#ffffff", size: "20.8px", sway: 22.2, duration: 8.5, delay: 0.75 },
    { left: "49.19%", color: "#d4e4a0", size: "11px", sway: -23.8, duration: 8.8, delay: 1.65 },
    { left: "28.57%", color: "#d4e4a0", size: "19.2px", sway: -12.4, duration: 9.4, delay: 0.71 },
    { left: "80.28%", color: "#d4e4a0", size: "16.3px", sway: 16.2, duration: 9.2, delay: 0.07 },
  ];
  const sourceGiftFlowers = [
    ["jasmine_white.webp", 6, -22, -18, 3200, 0],
    ["spring_garden_green.webp", 7, 20, 24, 3600, 300],
    ["boho_floral_pink.webp", 5, -18, -14, 2900, 600],
    ["brocade_flower_red.webp", 6, 14, 18, 3400, 200],
    ["baroque_gold.webp", 5, 8, 12, 3100, 400],
    ["minimalism_brown.webp", 6, -10, -6, 3500, 700],
    ["spring_garden_blue.webp", 5, -14, -10, 3300, 100],
  ];
  const sourceRevealProfiles = [
    [
      [600, 0, 0.3], [600, 100, 0.3], [700, 180, 0.3], [500, 260, 0.3],
      [700, 320, 0.3], [600, 420, 0.3], [500, 500, 0.3], [700, 580, 0.3],
      [500, 660, 0.3], [600, 740, 0.3],
    ],
    [[600, 0, 0.3], [700, 150, 0.2]],
    [
      [600, 0, 0.25], [600, 100, 0.25], [700, 180, 0.25], [700, 280, 0.25],
      [600, 360, 0.25], [700, 440, 0.25],
    ],
    [[600, 0, 0.25], [600, 100, 0.25], [700, 160, 0.25], [700, 220, 0.25], [700, 300, 0.25]],
    [[600, 0, 0.25], [700, 180, 0.25], [400, 50, 0.2]],
    [[600, 0, 0.25], [700, 180, 0.25]],
    [[600, 0, 0.25], [600, 150, 0.25]],
    [[600, 0, 0.25], [700, 120, 0.25]],
    [[600, 0, 0.25], [600, 100, 0.25]],
  ];
  const sourceGiftModal = `
    <div class="jw-gift-backdrop" data-jw-gift-backdrop hidden>
      <div class="jw-gift-modal" role="dialog" aria-modal="true" aria-labelledby="jw-gift-title">
        <button type="button" class="jw-gift-close" aria-label="Close modal">×</button>
        <div class="jw-gift-modal-heading"><img src="/templates/jasmine-white/assets/glass_garden_green.webp" alt=""><h3 id="jw-gift-title"></h3></div>
        <div class="jw-gift-modal-content"></div>
      </div>
    </div>`;
  const q = (selector, base = root) => base.querySelector(selector);
  const tx = (node, value) => { if (node) node.textContent = value == null ? "" : String(value); };
  const hide = (node, value) => { if (node) node.hidden = Boolean(value); };
  const setButtonText = (button, value) => {
    if (!button) return;
    const labeled = button.querySelector('[dir="auto"]');
    if (labeled) { tx(labeled, value); return; }
    const text = [...button.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (text) text.textContent = value;
    else button.append(document.createTextNode(value));
  };
  const validDate = (data) => Number.isFinite(Date.parse(data?.dateTime || ""));

  function profileFor(sectionIndex, node, nodeIndex, sectionNodes) {
    const initial = node.dataset.jwMotionFrom || "";
    const section = sections[sectionIndex];
    if (sectionIndex === 2 && nodeIndex >= 6) return [500, 100 * (nodeIndex - 6), 0.3];
    if (sectionIndex === 4) {
      if (node.tagName === "IMG") return [600, 150 * sectionNodes.filter((item, index) => index < nodeIndex && item.tagName === "IMG").length, 0.3];
      const row = node.closest("li");
      if (row) {
        const rows = [...section.querySelectorAll("li")];
        const rowIndex = Math.max(0, rows.indexOf(row));
        if (/scale\(0\)/.test(initial)) return [400, 80 * rowIndex, 0.5];
        if (/translateX\(-16px\)/.test(initial)) return [500, 80 * rowIndex, 0.5];
        if (/translateX\(16px\)/.test(initial)) return [500, 80 * rowIndex, 0.5];
      }
    }
    if (sectionIndex === 5 && nodeIndex >= 2) return [400, 50 * (nodeIndex - 2), 0.2];
    if (sectionIndex === 8 && node.tagName === "A") {
      return [500, 100 * sectionNodes.filter((item, index) => index < nodeIndex && item.tagName === "A").length, 0.2];
    }
    if (sectionIndex === 8 && node.tagName === "H2") return [600, 0, 0.25];
    if (sectionIndex === 8 && node.tagName === "P") return [600, 100, 0.25];
    if (sectionIndex === 5 && node.matches(".text-center")) return [600, 0, 0.25];
    if (sectionIndex === 5 && node.tagName === "FORM") return [700, 180, 0.25];
    if (sectionIndex === 1 && node.matches("h2")) return [600, 0, 0.3];
    if (sectionIndex === 1 && node.matches(".w-full.max-w-\\[432px\\]")) return [700, 150, 0.2];
    if (sectionIndex === 7 && node.matches("button")) return [700, 120, 0.25];
    return sourceRevealProfiles[sectionIndex]?.[nodeIndex] || [600, 0, 0.25];
  }

  function removeCapturedRevealStyles(reduced) {
    const heroEntrance = sections[0]?.querySelector("header .relative.flex.items-center.justify-center");
    sections.forEach((section, sectionIndex) => {
      const nodes = [...section.querySelectorAll("[style]")].filter((node) => {
        if (node.dataset.jwReveal !== undefined) return false;
        return node.style.opacity === "0" && Boolean(node.style.transform);
      });
      const revealNodes = nodes.filter((node) => node !== heroEntrance);
      revealNodes.forEach((node, nodeIndex) => {
        const from = node.style.transform;
        const [duration, delay, threshold] = profileFor(sectionIndex, node, nodeIndex, nodes);
        node.dataset.jwReveal = "";
        node.dataset.jwMotionFrom = from;
        node.dataset.jwThreshold = String(threshold);
        node.style.setProperty("--jw-motion-from", from);
        node.style.setProperty("--jw-motion-duration", `${duration}ms`);
        node.style.setProperty("--jw-motion-delay", `${delay}ms`);
        node.style.removeProperty("opacity");
        node.style.removeProperty("transform");
      });
    });
    if (heroEntrance) {
      heroEntrance.dataset.jwHeroEntrance = "";
      if (reduced) {
        heroEntrance.style.removeProperty("opacity");
        heroEntrance.style.removeProperty("transform");
      }
    }
  }

  function observeSections(reduced) {
    const nodes = [...root.querySelectorAll("[data-jw-reveal]")];
    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("jw-revealed"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const threshold = Number(entry.target.dataset.jwThreshold || 0.25);
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) entry.target.classList.add("jw-revealed");
        else entry.target.classList.remove("jw-revealed");
      }
    }, { root, threshold: [0, 0.2, 0.25, 0.3, 0.5] });
    nodes.forEach((node) => observer.observe(node));
  }

  function setupSourceOpeningMotion(reduced) {
    const intro = q(".fixed.inset-0.z-50");
    if (!intro || intro.dataset.jwSourceMotion === "true") return;
    intro.dataset.jwSourceMotion = "true";
    if (reduced) return;
    const particleHost = intro.querySelector(".absolute.inset-0.pointer-events-none.overflow-hidden");
    if (particleHost && !particleHost.dataset.jwPetals) {
      particleHost.dataset.jwPetals = "true";
      sourcePetals.forEach((petal) => {
        const outer = document.createElement("div");
        outer.className = "jw-source-petal absolute pointer-events-none select-none";
        outer.style.left = petal.left;
        outer.style.top = "-30px";
        outer.style.color = petal.color;
        outer.style.fontSize = petal.size;
        outer.setAttribute("aria-hidden", "true");
        const glyph = document.createElement("span");
        glyph.className = "jw-source-petal-glyph";
        glyph.textContent = "🌸";
        outer.append(glyph);
        particleHost.append(outer);
        outer.animate([{ translate: "0 -10vh" }, { translate: "0 110vh" }], {
          duration: petal.duration * 1000, delay: petal.delay * 1000, iterations: Infinity, easing: "linear",
        });
        glyph.animate([
          { translate: "0 0", easing: "ease-in-out" },
          { translate: `${petal.sway}px 0`, easing: "ease-in-out" },
          { translate: "0 0" },
        ], {
          duration: petal.duration * 500, iterations: Infinity, easing: "linear",
        });
        glyph.animate([{ rotate: "0deg" }, { rotate: "360deg" }], {
          duration: petal.duration * 1200, delay: petal.delay * 1000, iterations: Infinity, easing: "linear",
        });
        outer.animate([
          { opacity: 0, easing: "ease-in-out" },
          { opacity: 0.85, offset: 1 / 3, easing: "ease-in-out" },
          { opacity: 0.85, offset: 2 / 3, easing: "ease-in-out" },
          { opacity: 0 },
        ], {
          duration: petal.duration * 1000, delay: petal.delay * 1000, iterations: Infinity, easing: "linear",
        });
      });
    }
    const heart = intro.querySelector('[style*="top:50px"] > .flex.items-center.justify-center');
    heart?.animate([
      { scale: 1, easing: "ease-in-out" },
      { scale: 1.12, easing: "ease-in-out" },
      { scale: 1 },
    ], {
      duration: 2000, iterations: Infinity, easing: "linear",
    });
    const sheen = intro.querySelector("button > .absolute.top-0.h-full.w-8");
    sheen?.animate([{ translate: "-100px 0" }, { translate: "260px 0" }], {
      duration: 3000, iterations: Infinity, easing: "ease-in-out",
    });
  }

  function animateSourceHeroEntrance(reduced) {
    const hero = root.querySelector("header .relative.flex.items-center.justify-center");
    if (!hero) return;
    hero.getAnimations().forEach((animation) => animation.cancel());
    if (reduced) {
      hero.style.opacity = "1";
      hero.style.transform = "none";
      return;
    }
    hero.animate([
      { opacity: 0, transform: "translateY(25px) scale(.92)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ], { duration: 900, delay: 200, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
  }

  function animateGiftFlowers(reduced) {
    const giftSection = sections[7];
    if (!giftSection || giftSection.dataset.jwFlowerMotion === "true") return;
    giftSection.dataset.jwFlowerMotion = "true";
    if (reduced) return;
    for (const [file, lift, start, peak, duration, delay] of sourceGiftFlowers) {
      const flower = giftSection.querySelector(`img[src$="/${file}"]`);
      flower?.animate([
        { translate: `0 0`, rotate: `${start}deg`, easing: "ease-in-out" },
        { translate: `0 -${lift}px`, rotate: `${peak}deg`, easing: "ease-in-out" },
        { translate: `0 0`, rotate: `${start}deg` },
      ], { duration, delay, iterations: Infinity, easing: "linear" });
    }
  }

  function render(p) {
    payload = p;
    const d = p.data || {};
    const c = copy[p.locale] || copy["uz-Latn"];
    document.documentElement.lang = p.locale === "uz-Latn" ? "uz" : p.locale;
    const groom = d.groom || "", bride = d.bride || "";
    const couple = [groom, bride].filter(Boolean).join(" & ");

    renderOpening(d, c, couple);
    renderHero(d, c, groom, bride);
    renderGallery(d.gallery || [], p, c);
    renderDate(d, c, couple);
    renderVenue(d.venue || {}, c);
    renderProgram(d.program || [], c);
    renderWishes(d.wishes || [], p, c);
    wireRsvp(c);
    renderGift(d.toyona || {}, c);
    renderContacts(d.contacts || [], c);
    renderFooter(d, c, couple);
    installLocales(p, c);
    installMusic(d, p, c);
    root.style.visibility = "visible";
    root.removeAttribute("aria-busy");
    const reduced = Boolean(p.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.toggle("jw-reduced-motion", reduced);
    removeCapturedRevealStyles(reduced);
    observeSections(reduced);
    setupSourceOpeningMotion(reduced);
    animateGiftFlowers(reduced);
  }

  function renderOpening(d, c, couple) {
    const intro = q(".fixed.inset-0.z-50");
    if (!intro) return;
    tx(intro.querySelector("p"), d.greeting || c.welcome);
    const headings = [...intro.querySelectorAll("h1")];
    tx(headings[0], d.title || c.title); tx(headings[1], couple);
    const date = intro.querySelector(".mb-5.flex.flex-col.items-center span");
    tx(date, d.date?.long || "");
    const button = intro.querySelector("button");
    if (button) {
      setButtonText(button, c.open);
      const reduced = Boolean(payload?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
      const open = () => {
        if (intro.dataset.jwOpening) return;
        intro.dataset.jwOpening = "true";
        animateSourceHeroEntrance(reduced);
        root.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
        q("[data-jasmine-audio]")?.play().catch(() => {});
        if (reduced) {
          intro.remove();
          return;
        }
        intro.classList.add("jw-opening-exit");
        intro.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 600, delay: 450, easing: "ease-in-out", fill: "forwards",
        });
        const envelope = [...intro.children].find((child) => child.style.zIndex === "10");
        envelope?.animate([
          { transform: "translateY(0) scale(1)", opacity: 1 },
          { transform: "translateY(-35px) scale(1.08)", opacity: 0 },
        ], { duration: 800, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
        intro.querySelectorAll('img[src$="/hoa.webp"]').forEach((flower) => flower.animate([
          { scale: 1, opacity: 0.75 }, { scale: 1.5, opacity: 0 },
        ], { duration: 800, easing: "ease-out", fill: "forwards" }));
        for (const petal of intro.querySelectorAll(".jw-source-petal")) {
          const glyph = petal.querySelector(".jw-source-petal-glyph");
          const opacity = Number.parseFloat(getComputedStyle(petal).opacity);
          petal.getAnimations().forEach((animation) => animation.cancel());
          glyph?.getAnimations().forEach((animation) => animation.cancel());
          petal.animate([{ translate: "0 0" }, { translate: "0 300px" }], {
            duration: 850, easing: "ease-out", fill: "forwards",
          });
          glyph?.animate([
            { scale: 1, easing: "ease-out" },
            { scale: 2, offset: 0.5, easing: "ease-out" },
            { scale: 0 },
          ], {
            duration: 850, easing: "linear", fill: "forwards",
          });
          petal.animate([{ opacity: Number.isFinite(opacity) ? opacity : 0 }, { opacity: 0 }], {
            duration: 850, easing: "ease-out", fill: "forwards",
          });
        }
        setTimeout(() => intro.remove(), 1050);
      };
      button.onclick = open;
      const heart = intro.querySelector('[style*="top:50px"]');
      if (heart) heart.onclick = open;
    }
  }

  function renderHero(d, c, groom, bride) {
    const node = sections[0]; if (!node) return;
    const paragraphs = [...node.querySelectorAll("p")], names = [...node.querySelectorAll("h2")];
    tx(paragraphs[0], d.eventType || c.event); tx(paragraphs[1], c.couple);
    tx(names[0], groom); tx(names[1], bride);
    tx(paragraphs[3], c.time);
    const date = d.date || {};
    const dateLine = [date.weekday, [date.day, date.month, date.year].filter(Boolean).join(" "), date.time].filter(Boolean).join(" • ");
    tx(paragraphs[4], dateLine.toLocaleUpperCase(payload?.locale || "uz-Latn"));
    tx(paragraphs[5], d.message || c.invite);
    tx(paragraphs[6], c.hosts); tx(paragraphs[7], d.hosts || "");
  }

  function renderGallery(gallery, p, c) {
    const node = sections[1], grid = node?.querySelector(".grid.grid-cols-2");
    if (!grid) return;
    const original = grid.querySelector("div.group") || grid.firstElementChild;
    if (!original) return;
    const photos = p.preview ? gallery : gallery.filter((item) => item.src);
    grid.replaceChildren();
    for (const [index, item] of photos.entries()) {
      const card = original.cloneNode(true), oldImage = card.querySelector("img");
      card.replaceChildren(); card.setAttribute("role", "group"); card.setAttribute("aria-label", item.alt || item.caption || `${c.photo} ${index + 1}`);
      if (item.src) {
        const image = oldImage || document.createElement("img");
        image.src = item.src; image.alt = item.alt || item.caption || `${c.photo} ${index + 1}`;
        image.className = "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]";
        card.append(image); card.tabIndex = 0; card.setAttribute("role", "button");
        card.onclick = () => openLightbox(photos.filter((photo) => photo.src), index, c);
        card.onkeydown = (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); card.click(); } };
      } else if (p.preview) {
        card.className += " grid place-items-center text-[#404A1D88]";
        card.innerHTML = '<svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg>';
      }
      grid.append(card);
    }
    hide(node, !p.preview && photos.length === 0);
  }

  function openLightbox(items, start, c) {
    if (!items.length) return;
    const dialog = document.createElement("dialog"); dialog.className = "jw-lightbox"; dialog.setAttribute("aria-label", c.story);
    const image = document.createElement("img"), controls = document.createElement("div"); controls.className = "jw-lightbox-controls";
    const previous = document.createElement("button"), close = document.createElement("button"), next = document.createElement("button");
    previous.type = close.type = next.type = "button"; previous.textContent = c.previous; close.textContent = c.close; next.textContent = c.next;
    let index = start;
    const show = () => { image.src = items[index].src; image.alt = items[index].alt || items[index].caption || `${c.photo} ${index + 1}`; };
    previous.onclick = () => { index = (index - 1 + items.length) % items.length; show(); };
    next.onclick = () => { index = (index + 1) % items.length; show(); };
    close.onclick = () => dialog.close();
    dialog.addEventListener("keydown", (event) => { if (event.key === "ArrowLeft") previous.click(); if (event.key === "ArrowRight") next.click(); });
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    controls.append(previous, close, next); dialog.append(image, controls); root.append(dialog); show(); dialog.showModal();
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
  }

  function renderDate(d, c, couple) {
    const node = sections[2]; if (!node) return;
    const date = d.date || {}, valid = validDate(d);
    const paragraphs = [...node.querySelectorAll("p")];
    tx(node.querySelector("h2"), c.calendar);
    tx(paragraphs[0], c.calendarHint);
    tx(paragraphs[1], date.weekday || ""); tx(paragraphs[2], date.day || "");
    tx(paragraphs[3], [date.month, date.year].filter(Boolean).join(" "));
    const link = node.querySelector("a");
    if (link && valid) {
      const start = new Date(d.dateTime), end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      const format = (value) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
      const location = [d.venue?.name, d.venue?.address].filter(Boolean).join(", ");
      link.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${couple} ${d.eventType || c.event}`)}&dates=${format(start)}/${format(end)}&location=${encodeURIComponent(location)}`;
      tx(link, c.addCalendar);
    }
    hide(node, !valid);
  }

  function renderVenue(venue, c) {
    const node = sections[3]; if (!node) return;
    const heading = node.querySelector("h2"), name = node.querySelector("h3");
    const paragraphs = [...node.querySelectorAll("p")];
    const image = node.querySelector("[data-jasmine-venue-photo]");
    const imageFrame = image?.parentElement;
    if (imageFrame) hide(imageFrame, true);
    tx(heading, c.venue); tx(name, venue.name || "");
    tx(paragraphs[1], venue.address || "");
    const link = node.querySelector("a");
    const query = [venue.name, venue.address].filter(Boolean).join(" ");
    const url = venue.mapUrl || (venue.lat != null && venue.lng != null ? `https://maps.google.com/?q=${venue.lat},${venue.lng}` : query ? `https://maps.google.com/?q=${encodeURIComponent(query)}` : "");
    if (link) { link.href = url || "#"; tx(link, c.map); hide(link, !url); }
    const frame = node.querySelector("[data-jasmine-map]");
    if (frame && venue.lat != null && venue.lng != null) {
      frame.src = `https://maps.google.com/maps?q=${venue.lat},${venue.lng}&z=15&output=embed`; hide(frame, false);
    } else if (frame) { frame.removeAttribute("src"); hide(frame, true); }
    hide(node, !venue.name && !venue.address && !url);
  }

  function renderProgram(program, c) {
    const node = sections[4], list = node?.querySelector("ol"); if (!list) return;
    const first = list.querySelector("li");
    const template = first?.cloneNode(true);
    tx(node.querySelector("h2"), c.program); tx(node.querySelector("p"), c.programHint);
    list.replaceChildren();
    for (const item of program) {
      if (!template) break;
      const row = template.cloneNode(true), cells = [...row.querySelectorAll("span")];
      tx(cells.find((span) => span.classList.contains("tabular-nums")), item.time);
      const title = cells.find((span) => span.classList.contains("text-left"));
      tx(title, item.title);
      list.append(row);
    }
    hide(node, program.length === 0);
  }

  async function renderWishes(wishes, p, c) {
    const node = sections[5], list = node?.querySelector("ul"), form = node?.querySelector("form");
    if (!node || !list || !form) return;
    tx(node.querySelector("h2"), c.wishes);
    const input = form.querySelector("input"), area = form.querySelector("textarea"), button = form.querySelector('button[type="submit"]');
    if (input) { input.placeholder = `${c.guest}*`; input.setAttribute("aria-label", c.guest); input.required = !p.preview; input.disabled = false; input.maxLength = 300; input.value = p.guestName || ""; }
    if (area) { area.placeholder = `${c.wish}*`; area.setAttribute("aria-label", c.wish); area.required = !p.preview; area.disabled = false; }
    const ai = form.querySelector('button[type="button"]'); if (ai) hide(ai, true);
    if (button) { button.disabled = false; setButtonText(button, c.wishSend); }
    let status = form.querySelector("[data-jw-status]");
    if (!status) { status = document.createElement("p"); status.dataset.jwStatus = ""; status.className = "jw-status"; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite"); form.append(status); }
    list.replaceChildren();
    const values = p.preview ? wishes : await fetch(`/api/public/invitations/${encodeURIComponent(p.invitationId || "")}/wishes`, { cache: "no-store" }).then((r) => r.ok ? r.json() : { wishes: [] }).then((r) => r.wishes || []).catch(() => []);
    const sample = list.dataset.template;
    for (const [index, wish] of values.entries()) {
      const item = document.createElement("li"); item.className = "rounded-2xl border border-[#404A1D22] bg-white/90 p-4 shadow-sm";
      const name = document.createElement("p"), message = document.createElement("p");
      name.className = "font-semibold"; name.textContent = wish.name || ""; message.className = "mt-2 leading-relaxed"; message.textContent = wish.text || wish.message || "";
      item.append(name, message); list.append(item);
    }
    hide(node, !p.preview && !p.data?.wishesEnabled);
    form.onsubmit = async (event) => {
      event.preventDefault();
      if (p.preview) { tx(status, c.preview); return; }
      const name = String(input?.value || "").trim(), message = String(area?.value || "").trim();
      if (!name) { input?.setAttribute("aria-invalid", "true"); tx(status, c.guestRequired); input?.focus(); return; }
      if (!message) { area?.setAttribute("aria-invalid", "true"); tx(status, c.wishRequired); area?.focus(); return; }
      if (button) button.disabled = true;
      try {
        const response = await fetch(`/api/public/invitations/${encodeURIComponent(p.invitationId || "")}/wishes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message, guestToken: p.guestToken || undefined }) });
        if (!response.ok) throw new Error("wish request failed");
        tx(status, c.submitted); form.reset(); input?.setAttribute("aria-invalid", "false"); area?.setAttribute("aria-invalid", "false");
      } catch { tx(status, c.error); }
      finally { if (button) button.disabled = false; }
    };
  }

  function wireRsvp(c) {
    const node = sections[6], form = node?.querySelector("form"); if (!form) return;
    tx(node.querySelector("h2"), c.rsvp);
    const intro = [...node.querySelectorAll("p")].find((p) => !p.closest("form")); tx(intro, c.rsvpHint);
    const input = form.querySelector("input"), submit = form.querySelector('button[type="submit"]');
    if (input) { input.placeholder = `${c.guest}*`; input.setAttribute("aria-label", c.guest); input.required = !payload.preview; input.disabled = false; input.value = payload.guestName || ""; input.maxLength = 100; }
    const choices = [...form.querySelectorAll('button[role="radio"]')];
    choices.forEach((button, i) => { button.type = "button"; button.setAttribute("aria-checked", "false"); button.setAttribute("aria-label", i ? c.no : c.yes); tx(button.querySelector("span") || button, i ? c.no : c.yes); button.onclick = () => select(i); });
    const select = (index) => choices.forEach((button, i) => { button.setAttribute("aria-checked", String(i === index)); });
    form.querySelectorAll('[name="partySize"]').forEach((control) => {
      const label = control.closest("label");
      if (label) label.remove();
      else control.remove();
    });
    if (submit) { submit.disabled = false; setButtonText(submit, c.send); }
    let status = form.querySelector("[data-jw-status]");
    if (!status) { status = document.createElement("p"); status.dataset.jwStatus = ""; status.className = "jw-status"; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite"); form.append(status); }
    form.onsubmit = async (event) => {
      event.preventDefault(); if (payload.preview) { tx(status, c.preview); return; }
      const name = String(input?.value || "").trim(), answer = choices.findIndex((button) => button.getAttribute("aria-checked") === "true");
      if (!name) { input?.setAttribute("aria-invalid", "true"); tx(status, c.guestRequired); input?.focus(); return; }
      if (answer < 0) { tx(status, c.chooseResponse); choices[0]?.focus(); return; }
      if (submit) submit.disabled = true;
      try {
        const response = await fetch(`/api/public/invitations/${encodeURIComponent(payload.invitationId || "")}/rsvp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, status: answer ? "no" : "yes", partySize: answer ? 0 : 1, guestToken: payload.guestToken || undefined }) });
        if (!response.ok) throw new Error("RSVP request failed");
        tx(status, c.saved); form.reset(); input?.setAttribute("aria-invalid", "false"); select(-1);
      } catch { tx(status, c.error); }
      finally { if (submit) submit.disabled = false; }
    };
  }

  function renderGift(gift, c) {
    const node = sections[7], button = node?.querySelector('button[aria-label="Open gift box"]'); if (!node || !button) return;
    tx(node.querySelector("h2"), c.gift); hide(node, !gift.enabled);
    setButtonText(button, c.openGift); button.setAttribute("aria-expanded", "false");
    const hint = node.querySelector("p"); if (hint) tx(hint, c.openGift);
    let backdrop = node.querySelector("[data-jw-gift-backdrop]");
    if (!backdrop) {
      const template = document.createElement("template"); template.innerHTML = sourceGiftModal;
      backdrop = template.content.firstElementChild; node.append(backdrop);
    }
    const modal = backdrop.querySelector(".jw-gift-modal"), content = backdrop.querySelector(".jw-gift-modal-content");
    tx(backdrop.querySelector("#jw-gift-title"), c.gift);
    content.replaceChildren();
    if (gift.cardNumber) {
      const card = document.createElement("div"), label = document.createElement("p"), holder = document.createElement("p"), number = document.createElement("p"), copyButton = document.createElement("button"), status = document.createElement("p");
      card.className = "jw-gift-card"; label.textContent = c.bankCard; holder.textContent = gift.cardHolder || ""; number.className = "jw-gift-card-number"; number.textContent = gift.cardNumber;
      copyButton.type = "button"; copyButton.className = "jw-copy"; copyButton.textContent = c.copyCard; status.className = "jw-status"; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
      copyButton.onclick = async () => { try { await navigator.clipboard.writeText(String(gift.cardNumber)); tx(status, c.copied); } catch { tx(status, c.copyError); } };
      card.append(label, number); if (gift.cardHolder) card.append(holder); card.append(copyButton, status); content.append(card);
    } else {
      const message = document.createElement("p"); message.className = "jw-gift-empty"; message.textContent = c.giftMessage; content.append(message);
    }
    const close = () => {
      if (backdrop.hidden) return;
      backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: "ease-in", fill: "forwards" });
      modal.animate([{ opacity: 1, transform: "scale(1) translateY(0)" }, { opacity: 0, transform: "scale(.92) translateY(20px)" }], { duration: 250, easing: "ease-in", fill: "forwards" });
      window.setTimeout(() => { backdrop.hidden = true; button.focus(); }, 250);
    };
    backdrop.onclick = (event) => { if (event.target === backdrop) close(); };
    backdrop.querySelector(".jw-gift-close").onclick = close;
    modal.onclick = (event) => event.stopPropagation();
    button.setAttribute("aria-expanded", String(!backdrop.hidden));
    button.onclick = () => {
      if (!backdrop.hidden) return;
      backdrop.hidden = false; backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: "both" });
      modal.animate([{ opacity: 0, transform: "scale(.92) translateY(20px)" }, { opacity: 1, transform: "scale(1) translateY(0)" }], { duration: 250, fill: "both" });
      button.setAttribute("aria-expanded", "true"); backdrop.querySelector(".jw-gift-close").focus();
    };
  }

  function renderContacts(contacts, c) {
    const node = sections[8], links = [...(node?.querySelectorAll("a") || [])]; if (!node) return;
    tx(node.querySelector("h2"), c.contact);
    const values = [contacts.find((item) => item.type === "phone"), contacts.find((item) => item.type === "telegram")];
    links.forEach((link, index) => {
      const item = values[index]; hide(link, !item);
      if (!item) return;
      link.href = item.href || "#";
      const paragraphs = [...link.querySelectorAll("p")];
      tx(paragraphs[0], index ? c.telegram : c.phone); tx(paragraphs[1], item.value); tx(paragraphs[2], item.label || "");
    });
    links.slice(values.length).forEach((link) => hide(link, true));
    hide(node, !values.some(Boolean));
  }

  function renderFooter(d, c, couple) {
    const footer = root.querySelector("footer"); if (!footer) return;
    const headings = [...footer.querySelectorAll("h2")]; tx(headings[0], couple);
    const paragraphs = [...footer.querySelectorAll("p")];
    if (paragraphs[0]) tx(paragraphs[0], c.countdown);
    if (paragraphs[1]) tx(paragraphs[1], d.date?.short || d.date?.long || "");
    if (paragraphs[2]) tx(paragraphs[2], d.hosts || "");
    const link = footer.querySelector("a"); if (link) { link.href = "/"; tx(link, "Taklifnoma"); }
  }

  function installLocales(p, c) {
    let nav = q("[data-jw-languages]");
    if (!nav) { nav = document.createElement("nav"); nav.dataset.jwLanguages = ""; nav.className = "jw-languages"; root.append(nav); }
    nav.setAttribute("aria-label", c.language); nav.replaceChildren();
    for (const locale of p.enabledLocales || ["uz-Latn", "uz-Cyrl", "en", "ru"]) {
      const button = document.createElement("button"); button.type = "button"; button.textContent = ({ "uz-Latn": "Uz", "uz-Cyrl": "Уз", en: "En", ru: "Ru" })[locale] || locale;
      button.setAttribute("aria-pressed", String(locale === p.locale));
      button.onclick = () => parent.postMessage({ type: `${id}:language`, locale }, location.origin);
      nav.append(button);
    }
  }

  function installMusic(d, p, c) {
    const audio = q("[data-jasmine-audio]"); if (!audio) return;
    const button = q('[aria-label="Toggle music"]');
    const url = d.music?.url || ""; audio.src = url; audio.muted = Boolean(p.preview && p.silentPlayback); audio.loop = true;
    hide(button, !url || Boolean(p.preview && p.silentPlayback));
    if (button) {
      button.setAttribute("aria-label", audio.paused ? c.musicOn : c.musicOff);
      button.onclick = async () => {
        if (audio.paused) { try { await audio.play(); button.setAttribute("aria-label", c.musicOff); } catch { button.setAttribute("aria-label", c.musicError); } }
        else { audio.pause(); button.setAttribute("aria-label", c.musicOn); }
      };
    }
  }

  addEventListener("message", (event) => {
    if (event.source === parent && event.origin === location.origin && event.data?.type === `${id}:update`) render(event.data.payload);
  });
  try { const initial = JSON.parse(window.name); if (initial?.type === `${id}:update`) render(initial.payload); } catch {}
})();
