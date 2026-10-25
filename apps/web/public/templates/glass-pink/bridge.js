(() => {
  "use strict";

  const templateId = "glass-pink";
  const copy = {
    "uz-Latn": {
      openInvitation: "Taklifnomani ochish",
      languageLabel: "Tilni tanlang",
      musicToggleLabel: "Musiqani yoqish yoki o?chirish",
      openingGreeting: "Assalomu alaykum, aziz mehmon",
      invitationTitle: "Taklifnoma",
      storyTitle: "Bizning hikoyamiz",
      eventDetailsTitle: "To‘y tantanasi haqida",
      countdownTitle: "Sanoq boshlandi",
      venueTitle: "To‘y manzili",
      programTitle: "To‘y kuni dasturi",
      wishesTitle: "Tilaklar",
      rsvpTitle: "Kelasizmi?",
      rsvpPrompt: "Iltimos, javobingizni bildiring.",
      giftTitle: "Sovg‘a yuborish",
      contactsTitle: "Bog‘lanish uchun",
      footerNote: "Tashrifingiz biz uchun katta baxt.",
      hostsLabel: "Hurmat bilan:",
      giftOpenHint: "Ochish uchun bosing",
      rsvpYes: "Kelaman",
      rsvpNo: "Kela olmayman",
      submit: "Yuborish",
      sendWish: "Tilak yuborish",
      dayUnit: "Kun",
      hourUnit: "Soat",
      minuteUnit: "Daqiqa",
      secondUnit: "Soniya",
      coupleLabel: "Kuyov va kelin",
      responseLabel: "Javobingiz",
      calendarAction: "Kalendariga qo‘shish",
      invitationMessage: "Sizni tantanamizga taklif etamiz:",
      name: "Ismingiz",
      wish: "Kelin-kuyovga tilagingiz",
      galleryMore: "Yana {count} ta suratni ochish",
      party: "Mehmonlar soni",
      phone: "Telefon",
      telegram: "Telegram",
      map: "Xaritada ko‘rish",
      giftNumber: "Karta raqami",
      giftHolder: "Karta egasi",
      wishSent: "Tilagingiz taklifnoma egasiga yuborildi.",
      rsvpSent: "Javobingiz saqlandi. Rahmat!",
      previewOnly: "Ko‘rish rejimida yuborish o‘chiq.",
      failure: "Yubarrishda xatolik. Qayta urinib ko‘ring.",
      noProgram: "",
      weekdays: ["Du", "Se", "Cho", "Pay", "Ju", "Sha", "Ya"],
      months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    },
    "uz-Cyrl": {
      openInvitation: "???????????? ????",
      languageLabel: "????? ???????",
      musicToggleLabel: "???????? ???? ??? ??????",
      openingGreeting: "Ассалому алайкум, азиз меҳмон",
      invitationTitle: "Таклифнома",
      storyTitle: "Бизнинг ҳикоямиз",
      eventDetailsTitle: "Тўй тантанаси ҳақида",
      countdownTitle: "Тўйга қолган вақт",
      venueTitle: "Тўй манзили",
      programTitle: "Тўй куни дастури",
      wishesTitle: "Тилаклар",
      rsvpTitle: "Келасизми?",
      rsvpPrompt: "Илтимос, жавобингизни билдиринг.",
      giftTitle: "Совға юбориш",
      contactsTitle: "Боғланиш учун",
      footerNote: "Ташрифингиз биз учун катта бахт.",
      hostsLabel: "Ҳурмат билан:",
      giftOpenHint: "Очилиши учун босинг",
      rsvpYes: "Келаман",
      rsvpNo: "Кела олмайман",
      submit: "Юбориш",
      sendWish: "Тилак юбориш",
      dayUnit: "Кун",
      hourUnit: "Соат",
      minuteUnit: "Дақиқа",
      secondUnit: "Сония",
      coupleLabel: "Куёв ва келин",
      responseLabel: "Жавобингиз",
      calendarAction: "Тақвимга қўшиш",
      invitationMessage: "Сизни тантанамизга таклиф этамиз:",
      name: "Исмингиз",
      wish: "Келин-куёвга тилагингиз",
      galleryMore: "Яна {count} та суратни очиш",
      party: "Меҳмонлар сони",
      phone: "Телефон",
      telegram: "Телеграм",
      map: "Харитада кўриш",
      giftNumber: "Карта рақами",
      giftHolder: "Карта эгаси",
      wishSent: "Тилагингиз таклифнома эгасига юборилди.",
      rsvpSent: "Жавобингиз сақланди. Раҳмат!",
      previewOnly: "Кўриш режимида юбориш ўчиқ.",
      failure: "Юборишда хатолик. Қайта уриниб кўринг.",
      noProgram: "",
      weekdays: ["Ду", "Се", "Чо", "Пай", "Жу", "Ша", "Як"],
      months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    },
    en: {
      openInvitation: "Open invitation",
      languageLabel: "Choose language",
      musicToggleLabel: "Toggle music",
      openingGreeting: "Welcome, dear guest",
      invitationTitle: "Invitation",
      storyTitle: "Our story",
      eventDetailsTitle: "About the celebration",
      countdownTitle: "Counting down",
      venueTitle: "Venue",
      programTitle: "Event program",
      wishesTitle: "Wishes",
      rsvpTitle: "Will you attend?",
      rsvpPrompt: "Please let us know if you can join us.",
      giftTitle: "Send a gift",
      contactsTitle: "Contact us",
      footerNote: "Your presence would mean so much to us.",
      hostsLabel: "With love from:",
      giftOpenHint: "Tap to open",
      rsvpYes: "I’ll attend",
      rsvpNo: "I can’t attend",
      submit: "Submit",
      sendWish: "Send a wish",
      dayUnit: "Days",
      hourUnit: "Hours",
      minuteUnit: "Minutes",
      secondUnit: "Seconds",
      coupleLabel: "The couple",
      responseLabel: "Your response",
      calendarAction: "Add to calendar",
      invitationMessage: "You are warmly invited to celebrate with us:",
      name: "Your name",
      wish: "Your message to the couple",
      galleryMore: "Open {count} more photos",
      party: "Guest count",
      phone: "Phone",
      telegram: "Telegram",
      map: "Open map",
      giftNumber: "Card number",
      giftHolder: "Cardholder",
      wishSent: "Your wish was sent to the invitation owner.",
      rsvpSent: "Your response was saved. Thank you!",
      previewOnly: "Submissions are disabled in preview.",
      failure: "Could not submit. Please try again.",
      noProgram: "",
      weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
    ru: {
      openInvitation: "??????? ???????????",
      languageLabel: "??????? ????",
      musicToggleLabel: "???????? ??? ????????? ??????",
      openingGreeting: "Здравствуйте, дорогой гость",
      invitationTitle: "Приглашение",
      storyTitle: "Наша история",
      eventDetailsTitle: "О торжестве",
      countdownTitle: "До торжества осталось",
      venueTitle: "Место проведения",
      programTitle: "Программа дня",
      wishesTitle: "Пожелания",
      rsvpTitle: "Вы придёте?",
      rsvpPrompt: "Пожалуйста, сообщите, сможете ли вы прийти.",
      giftTitle: "Отправить подарок",
      contactsTitle: "Связаться с нами",
      footerNote: "Ваше присутствие будет для нас большой радостью.",
      hostsLabel: "С уважением:",
      giftOpenHint: "Нажмите, чтобы открыть",
      rsvpYes: "Я приду",
      rsvpNo: "Не смогу прийти",
      submit: "Отправить",
      sendWish: "Отправить пожелание",
      dayUnit: "Дней",
      hourUnit: "Часов",
      minuteUnit: "Минут",
      secondUnit: "Секунд",
      coupleLabel: "Жених и невеста",
      responseLabel: "Ваш ответ",
      calendarAction: "Добавить в календарь",
      invitationMessage: "Приглашаем вас разделить с нами этот счастливый день:",
      name: "Ваше имя",
      wish: "Ваше пожелание паре",
      galleryMore: "Открыть ещё фото: {count}",
      party: "Количество гостей",
      phone: "Телефон",
      telegram: "Телеграм",
      map: "Открыть карту",
      giftNumber: "Номер карты",
      giftHolder: "Владелец карты",
      wishSent: "Ваше пожелание отправлено владельцу приглашения.",
      rsvpSent: "Ваш ответ сохранён. Спасибо!",
      previewOnly: "Отправка в режиме просмотра отключена.",
      failure: "Не удалось отправить. Попробуйте ещё раз.",
      noProgram: "",
      weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    },
  };
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  const contactNotes = {
    "uz-Latn": { phone: "Savollaringiz bo‘lsa, qo‘ng‘iroq qiling", telegram: "Tezkor javob uchun yozing", instagram: "Suratlarimizni kuzatib boring" },
    "uz-Cyrl": { phone: "Саволларингиз бўлса, қўнғироқ қилинг", telegram: "Тезкор жавоб учун ёзинг", instagram: "Суратларимиздан хабардор бўлиб боринг" },
    en: { phone: "Call us for any questions", telegram: "Message us for a quick response", instagram: "Follow along for photos" },
    ru: { phone: "Позвоните нам, если у вас есть вопросы", telegram: "Напишите нам для быстрого ответа", instagram: "Следите за нашими фотографиями" },
  };
  const root = document.querySelector('[data-chorlove-template="glass-pink"]');
  if (!root) return;

  const sourceWishSuggestions = [
    "Baxtingiz abadiy, oilangiz doimo mehr va quvonchga to'la bo'lsin!",
    "Nikoh to'yingiz muborak! Bir umr ahil va baxtli yashanglar.",
    "Yangi hayotingiz sevgi, hurmat va unutilmas lahzalarga boy bo'lsin!",
    "Sizlarga uzoq umr, mustahkam oila va cheksiz baxt tilayman!",
    "Muhabbatingiz yillar o'tgan sayin yanada mustahkam bo'lsin!",
    "To'yingiz muborak! Xonadoningizdan fayz, baraka va quvonch arimasin.",
  ];

  let state = null;
  let countdownTimer = 0;
  let galleryIndex = 0;
  const giftAnimations = new WeakMap();
  const revealSpecs = new WeakMap();
  const revealObserved = new WeakSet();
  const revealVisibility = new WeakMap();
  const revealAnimations = new Map();
  const revealObservers = new Map();
  const text = (node, value) => { if (node) node.textContent = value == null ? "" : String(value); };
  const hide = (node, hidden) => { if (node) node.hidden = Boolean(hidden); };

  function restoreCapturedMotion() {
    const reduce = Boolean(state?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("qaReducedMotion") === "1";
    const setSpec = (element, spec) => {
      if (!element) return;
      const previous = revealSpecs.get(element);
      revealSpecs.set(element, {
        fromOpacity: spec.fromOpacity ?? previous?.fromOpacity ?? (element.style.opacity === "" ? 0 : Number.parseFloat(element.style.opacity) || 0),
        fromTransform: spec.fromTransform || previous?.fromTransform || element.style.transform || "translateY(20px)",
        ...spec,
      });
    };
    const sourceOpener = root.querySelector("section");
    if (sourceOpener) sourceOpener.dataset.gpSourceHero = "";

    // The archived page gives each invitation-introduction text block its own source delay.
    const introSection = root.querySelector('[data-chorlove-field="eventLabel"]')?.closest("section");
    const introContent = introSection?.querySelector(".relative.z-10.flex.flex-col.items-center.text-center");
    const introTimings = [
      [600, 0], [600, 100], [700, 180], [500, 260], [700, 320],
      [600, 420], [500, 500], [700, 580], [500, 660], [600, 740],
    ];
    const introReveals = [...(introContent?.children || [])].filter((element) => element.style.opacity === "0");
    introReveals.forEach((element, index) => {
      const [duration, delay] = introTimings[index] || [600, Math.min(index * 80, 740)];
      setSpec(element, { duration, delay, amount: 0.3, toOpacity: 1, toTransform: "translateY(0px)" });
    });

    setSpec(root.querySelector('[data-chorlove-i18n="storyTitle"]'), { duration: 600, delay: 0, amount: 0.3, toOpacity: 1, toTransform: "translateY(0px)" });
    const hiddenTargets = (section) => [...(section?.querySelectorAll("[style]") || [])].filter((element) => element.style.opacity === "0");
    const setOrdered = (elements, timings, amount = 0.25) => elements.forEach((element, index) => {
      const [duration, delay] = timings[index] || timings.at(-1) || [300, 0];
      setSpec(element, { duration, delay, amount, toOpacity: 1, toTransform: "translateY(0px)" });
    });

    const calendarSection = root.querySelector("[data-chorlove-calendar]");
    const countdownCards = [...root.querySelectorAll('[style*="translateY(16px)"]')]
      .filter((element) => String(element.className).includes("min-w-[64px]"));
    setOrdered(
      hiddenTargets(calendarSection).filter((element) => !countdownCards.includes(element)),
      [[600, 0], [600, 100], [700, 180], [700, 280], [600, 360], [700, 440]],
    );

    const venueSection = root.querySelector('[data-chorlove-i18n="venueTitle"]')?.closest("section");
    setOrdered(hiddenTargets(venueSection), [[600, 0], [600, 100], [600, 160], [700, 220], [700, 300]]);
    const programSection = root.querySelector("[data-chorlove-program]")?.closest("section");
    setSpec(programSection?.querySelector('[data-chorlove-i18n="programTitle"]'), { duration: 600, delay: 0, amount: 0.25, toOpacity: 1, toTransform: "translateY(0px)" });
    setSpec(programSection?.querySelector('[data-chorlove-field="programHeading"]'), { duration: 600, delay: 100, amount: 0.25, toOpacity: 1, toTransform: "translateY(0px)" });

    const wishesSection = root.querySelector("[data-chorlove-wishes]");
    setSpec(wishesSection?.querySelector('[data-chorlove-i18n="wishesTitle"]'), { duration: 600, delay: 0, amount: 0.25, toOpacity: 1, toTransform: "translateY(0px)" });
    setSpec(wishesSection?.querySelector("form"), { duration: 700, delay: 180, amount: 0.25, toOpacity: 1, toTransform: "translateY(0px)" });

    const giftSection = root.querySelector("[data-chorlove-gift]");
    setSpec(giftSection?.querySelector('[data-chorlove-i18n="giftTitle"]'), { duration: 600, delay: 0, amount: 0.25, toOpacity: 1, toTransform: "translateY(0px)" });
    setOrdered(hiddenTargets(giftSection).filter((element) => element !== giftSection.querySelector('[data-chorlove-i18n="giftTitle"]')), [[700, 120]]);

    const contactsSection = root.querySelector("[data-chorlove-contacts]");
    setSpec(contactsSection?.querySelector('[data-chorlove-i18n="contactsTitle"]'), { duration: 600, delay: 0, amount: 0.25, toOpacity: 1, toTransform: "translateY(0px)" });
    setSpec(contactsSection?.querySelector("p"), { duration: 600, delay: 100, amount: 0.25, toOpacity: 1, toTransform: "translateY(0px)" });

    // Countdown cards, calendar icons, and schedule rows have distinct source choreography.
    countdownCards.forEach((element, index) => setSpec(element, { duration: 500, delay: index * 100, amount: 0.3, toOpacity: 1, toTransform: "translateY(0px)" }));

    const scheduleIcons = [...root.querySelectorAll('img[src$="/coming.webp"], img[src$="/cake.webp"], img[src$="/water.webp"]')];
    scheduleIcons.forEach((element, index) => setSpec(element, { duration: 600, delay: [0, 150, 300][index] || 0, amount: 0.3, toOpacity: 0.9, toTransform: "scale(1)" }));

    root.querySelectorAll("[data-glass-program-row]").forEach((row, index) => {
      setSpec(row.querySelector("[data-glass-program-time]"), { duration: 500, delay: index * 80, amount: 0.5, toOpacity: 1, toTransform: "translateX(0px)" });
      setSpec(row.querySelector("[data-glass-program-title]"), { duration: 500, delay: index * 80, amount: 0.5, toOpacity: 1, toTransform: "translateX(0px)" });
      const marker = row.querySelector(".relative.block.h-3.w-3.rounded-full");
      if (marker?.style.transform.includes("scale(0)")) {
        marker.dataset.gpSourceProgramMarker = "";
        setSpec(marker, { duration: 400, delay: index * 80, amount: 0.5, fromOpacity: 1, fromTransform: "scale(0)", toOpacity: 1, toTransform: "scale(1)" });
      }
    });

    root.querySelectorAll("[data-gp-source-wish-card]").forEach((element, index) => setSpec(element, { duration: 400, delay: index * 50, amount: 0.2, toOpacity: 1, toTransform: "translateY(0px)" }));
    root.querySelectorAll("[data-gp-source-contact]").forEach((element, index) => setSpec(element, { duration: 500, delay: index * 100, amount: 0.2, toOpacity: 1, toTransform: "translateY(0px)" }));

    const candidates = [...new Set([
      ...[...root.querySelectorAll("[style]")].filter((element) => element.style.opacity === "0"),
      ...root.querySelectorAll("[data-gp-source-program-marker]"),
      ...revealAnimations.keys(),
    ])];
    const applyReducedMotion = (element, spec) => {
      revealAnimations.get(element)?.cancel();
      revealAnimations.delete(element);
      element.style.opacity = spec.toOpacity === 1 ? "" : String(spec.toOpacity);
      element.style.transform = spec.toTransform === "none" ? "" : spec.toTransform;
      revealVisibility.set(element, true);
      revealObserved.add(element);
    };
    if (reduce || typeof IntersectionObserver === "undefined") {
      for (const element of candidates) {
        if (element.closest("[data-gp-source-hero]") && !revealSpecs.has(element)) continue;
        const spec = revealSpecs.get(element) || { toOpacity: 1, toTransform: "none" };
        applyReducedMotion(element, spec);
      }
      for (const observer of revealObservers.values()) observer.disconnect();
      revealObservers.clear();
      return;
    }

    for (const element of candidates) {
      if (element.closest("[data-gp-source-hero]") && !revealSpecs.has(element)) continue;
      if (revealObserved.has(element)) continue;
      const spec = revealSpecs.get(element) || { duration: 300, delay: 0, amount: 0.25, fromOpacity: 0, fromTransform: element.style.transform || "translateY(20px)", toOpacity: 1, toTransform: "none" };
      if (!revealSpecs.has(element)) setSpec(element, spec);
      if (!revealObservers.has(spec.amount)) {
        const observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const target = entry.target;
            const visible = entry.isIntersecting;
            const wasVisible = revealVisibility.get(target) === true;
            if (visible === wasVisible) continue;
            revealVisibility.set(target, visible);
            const motion = revealSpecs.get(target) || { duration: 300, delay: 0, amount: 0.25, toOpacity: 1, toTransform: "none" };
            if (matchMedia("(prefers-reduced-motion: reduce)").matches || state?.reducedMotion) { applyReducedMotion(target, motion); continue; }
            const fromTransform = motion.fromTransform || target.style.transform || "translateY(20px)";
            const toTransform = motion.toTransform !== undefined ? motion.toTransform : fromTransform.replace(/translateY\([^)]*\)/, "translateY(0px)").replace(/translateX\([^)]*\)/, "translateX(0px)").replace(/scale\([^)]*\)/, "scale(1)");
            const fromOpacity = motion.fromOpacity ?? (target.style.opacity === "" ? 0 : Number.parseFloat(target.style.opacity) || 0);
            target.style.opacity = "";
            target.style.transform = "";
            revealAnimations.get(target)?.cancel();
            const animation = target.animate(
              visible
                ? [{ opacity: fromOpacity, transform: fromTransform }, { opacity: motion.toOpacity ?? 1, transform: toTransform }]
                : [{ opacity: motion.toOpacity ?? 1, transform: toTransform }, { opacity: fromOpacity, transform: fromTransform }],
              { duration: motion.duration ?? 300, delay: motion.delay ?? 0, easing: motion.easing || "ease-out", fill: "both" },
            );
            revealAnimations.set(target, animation);
          }
        }, { threshold: spec.amount });
        revealObservers.set(spec.amount, observer);
      }
      revealObserved.add(element);
      revealObservers.get(spec.amount).observe(element);
    }

  }

  let openingBound = false;
  let heroMotionStarted = false;
  let heroParallaxBound = false;
  const sourcePetals = [
    ["91.44%","#eab8c2","14.7px",8.2,.98],["39.10%","#eab8c2","15.1px",12.9,1.68],
    ["62.76%","#eab8c2","15.3px",11.4,1.18],["90.66%","#f5d6dc","22.4px",11.4,.42],
    ["75.20%","#eab8c2","21.5px",9.1,1.95],["89.88%","#ffffff","21.4px",9.8,2],
    ["15.71%","#eab8c2","17.8px",12.1,1.18],["80.13%","#ffffff","23px",9.2,2.28],
    ["29.75%","#eab8c2","15.2px",11.6,1.86],["65.05%","#f5d6dc","18.5px",10.1,.84],
    ["75.37%","#f5d6dc","21.5px",11.6,2],["25.90%","#f7e3e8","12.7px",10.4,2.33],
  ];
  function sourceOpening(payload) {
    const envelope = root.querySelector('[data-landing-screenshot-id="invite-envelope"]');
    if (!envelope) return;
    const card = envelope.querySelector('[style*="z-index:10"]');
    const content = card?.querySelector('.relative.rounded-lg .relative.z-10.text-center');
    const headings = content?.querySelectorAll("h1") || [];
    const greeting = content?.querySelector("p span[dir]");
    const nameNodes = headings[1]?.querySelectorAll("span") || [];
    const date = content?.querySelector(".flex.flex-col.items-center span[dir]");
    const button = envelope.querySelector("button");
    const heart = card?.querySelector('.rounded-full[style*="top:50px"]');
    if (payload?.data) {
      text(greeting, payload.data.greeting || localCopy().openingGreeting);
      text(headings[0], payload.data.title || localCopy().invitationTitle);
      text(nameNodes[0], payload.data.groom);
      text(nameNodes[2], payload.data.bride);
      const d = payload.data.date || {};
      text(date, d.long || [d.month,d.day,d.year].filter(Boolean).join(" "));
    }
    if (button) { text(button.querySelector("span"), localCopy().openInvitation); button.setAttribute("aria-label", localCopy().openInvitation); }
    if (!openingBound) {
      const reduced = Boolean(payload?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
      const petalLayer = envelope.children[1];
      for (const [left,color,size,duration,delay] of sourcePetals) {
        const petal = document.createElement("span"); petal.className = "cc-source-petal";
        petal.style.left=left; petal.style.color=color; petal.style.fontSize=size;
        petal.style.setProperty("--cc-petal-duration",`${duration}s`); petal.style.setProperty("--cc-petal-delay",`${delay}s`);
        petal.setAttribute("aria-hidden","true");
        petal.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><g><ellipse cx="12" cy="5" rx="2.2" ry="4.5"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(120 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(180 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(240 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(300 12 12)"/></g><circle cx="12" cy="12" r="1.8" fill-opacity=".45"/></svg>';
        if (!reduced) {
          petalLayer?.append(petal);
          petal.animate([{ translate: "0 -10vh" }, { translate: "0 110vh" }], { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: "linear" });
          petal.animate([{ opacity: 0 }, { opacity: .8, offset: .14, easing: "ease-in-out" }, { opacity: .8, offset: .78 }, { opacity: 0 }], { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: "ease-in-out" });
          petal.animate([{ rotate: "0deg" }, { rotate: "360deg" }], { duration: duration * 1200, delay: delay * 1000, iterations: Infinity, easing: "linear" });
        }
      }
      if (!reduced) {
        heart?.firstElementChild?.animate(
          [{ scale: 1 }, { scale: 1.12 }, { scale: 1 }],
          { duration: 2000, iterations: Infinity, easing: "ease-in-out" },
        );
        const sheen = button?.querySelector("div.absolute.top-0.h-full.w-8");
        sheen?.animate(
          [{ transform: "translateX(-100px)" }, { transform: "translateX(260px)" }],
          { duration: 3000, iterations: Infinity, easing: "ease-in-out" },
        );
      }
      if (heart) { heart.setAttribute("role","button"); heart.tabIndex=0; heart.setAttribute("aria-label",localCopy().openInvitation); }
      const close = () => {
        if (envelope.classList.contains("cc-source-closing")) return;
        const reduced = Boolean(state?.reducedMotion)
          || matchMedia("(prefers-reduced-motion: reduce)").matches
          || new URLSearchParams(location.search).get("qaReducedMotion") === "1";
        const audio = root.querySelector("audio[data-chorlove-audio]");
        if (audio && state?.data.music?.url && !state.silentPlayback) audio.play().catch(() => {});
        if (reduced) {
          envelope.hidden = true;
          window.scrollTo({ top: 0, behavior: "auto" });
          return;
        }
        envelope.classList.add("cc-source-closing");
        if (button) button.disabled = true;
        envelope.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 600,
          delay: 450,
          easing: "ease-in-out",
          fill: "forwards",
        });
        card?.animate(
          [
            { transform: "translateY(0px) scale(1)", opacity: 1 },
            { transform: "translateY(-35px) scale(1.08)", opacity: 0 },
          ],
          { duration: 800, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" },
        );
        envelope.querySelectorAll('img[src*="flower4-decoration"], img[src*="flower5-bottom"]').forEach((flower) => {
          flower.animate(
            [{ scale: 1, opacity: 0.9 }, { scale: 2.5, opacity: 0 }],
            { duration: 800, easing: "ease-out", fill: "forwards" },
          );
        });
        envelope.querySelectorAll(".cc-source-petal").forEach(petal => {
          const opacity = getComputedStyle(petal).opacity;
          petal.getAnimations().forEach(animation => animation.cancel());
          petal.animate([
            { translate: "0 0px", scale: "1" },
            { translate: "0 150px", scale: "2" },
            { translate: "0 300px", scale: "0" },
          ], { duration: 850, easing: "ease-out", fill: "forwards" });
          petal.animate([{ opacity }, { opacity: 0 }], { duration: 850, easing: "ease-out", fill: "forwards" });
        });
        window.setTimeout(() => { envelope.hidden=true; }, 1050);
      };
      button?.addEventListener("click", close);
      heart?.addEventListener("click", close);
      heart?.addEventListener("keydown", event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();close();}});
      openingBound=true;
    }
  }
  function animateSourceHero(reduced) {
    if (heroMotionStarted) return;
    const hero = root.querySelector("section");
    if (!hero) return;
    hero.dataset.gpSourceHero="";
    heroMotionStarted=true;
    const leaves=hero.querySelectorAll('img[style*="opacity:0"]');
    const card=hero.querySelector('div[style*="opacity:0"]');
    const run=(node,frames,duration,delay,easing="ease-out")=>{
      if(!node)return;
      if(reduced){const last=frames.at(-1);node.style.opacity=String(last.opacity);node.style.transform=last.transform||`translateY(${last.y||0}px) scale(${last.scale||1})`;return;}
      node.animate(frames,{duration:duration*1000,delay:delay*1000,easing,fill:"both"});
    };
    run(leaves[0],[{opacity:0,transform:"scale(.8)"},{opacity:.9,transform:"scale(1)"}],1,.2);
    run(leaves[1],[{opacity:0,transform:"scale(.8)"},{opacity:.9,transform:"scale(1)"}],1,.35);
    run(card,[{opacity:0,transform:"translateY(30px) scale(.85)"},{opacity:1,transform:"translateY(0) scale(1)"}],.9,.25,"cubic-bezier(.22,1,.36,1)");
    const names=card?.children||[];
    run(names[0],[{opacity:0,transform:"translateY(15px)"},{opacity:1,transform:"translateY(0)"}],.7,.8);
    run(names[1],[{opacity:0,transform:"scale(.5)"},{opacity:.9,transform:"scale(1)"}],.7,.65);
    run(names[2],[{opacity:0,transform:"translateY(15px)"},{opacity:1,transform:"translateY(0)"}],.7,.5);
    run(leaves[2],[{opacity:0,transform:"scale(.7)"},{opacity:1,transform:"scale(1)"}],.9,.55);
    if(!reduced&&!heroParallaxBound&&leaves.length>=3){
      let scroller=window;for(let node=hero;node;node=node.parentElement){if(/(auto|scroll)/.test(getComputedStyle(node).overflowY)){scroller=node;break;}}
      const sync=()=>{const amount=Math.max(0,Math.min(1,(scroller===window?window.scrollY:scroller.scrollTop)/600));[-180,-140,-40].forEach((distance,i)=>{leaves[i].style.translate=`0 ${distance*amount}px`;});};
      if(scroller!==window)scroller.addEventListener("scroll",sync,{passive:true});window.addEventListener("scroll",sync,{passive:true});window.addEventListener("resize",sync);sync();heroParallaxBound=true;
    }
  }
  function localCopy() { return copy[state?.locale] || copy["uz-Latn"]; }
  function bindField(data, key, value) {
    for (const node of root.querySelectorAll(`[data-chorlove-field="${key}"]`)) text(node, value);
  }
  function setVisibleFields(data) {
    bindField(data, "groom", data.groom);
    bindField(data, "bride", data.bride);
    bindField(data, "eventLabel", data.eventType);
    bindField(data, "coupleLabel", localCopy().coupleLabel);
    bindField(data, "weekday", data.date?.weekday || "");
    bindField(data, "day", data.date?.day || "");
    bindField(data, "month", data.date?.month || "");
    bindField(data, "year", data.date?.year || "");
    bindField(data, "eventTime", data.date?.time || "");
    bindField(data, "message", data.message);
    bindField(data, "title", data.title || localCopy().invitationTitle);
    bindField(data, "hosts", data.hosts);
    bindField(data, "personalGreeting", data.greeting || data.title);
    bindField(data, "venueName", data.venue?.name);
    bindField(data, "address", data.venue?.address);
    bindField(data, "calendarAction", localCopy().calendarAction);
    const responseLabel = root.querySelector('[data-chorlove-i18n="responseLabel"]');
    if (responseLabel) text(responseLabel, localCopy().responseLabel);
    const programHeading = root.querySelector('[data-chorlove-i18n="programTitle"]');
    if (data.programHeading) text(programHeading, data.programHeading);
    for (const node of root.querySelectorAll('[data-chorlove-i18n]')) {
      const key = node.dataset.chorloveI18n;
      text(node, localCopy()[key] ?? node.textContent);
    }
    const openInvitation = root.querySelector("[data-chorlove-open]");
    if (openInvitation) { openInvitation.setAttribute("aria-label", localCopy().openInvitation); text(openInvitation, localCopy().openInvitation); }
    for (const field of root.querySelectorAll('[data-chorlove-field="calendarMonth"]')) {
      const date = data.date;
      const monthIndex = Number(date?.monthNumber) - 1;
      const month = Number.isInteger(monthIndex) && monthIndex >= 0
        ? localCopy().months[monthIndex]
        : date?.month || "";
      text(field, [month, date?.year].filter(Boolean).join(" "));
    }
    const start = data.dateTime ? new Date(data.dateTime) : null;
    const hasDate = start && Number.isFinite(start.getTime());
    const dateBlock = root.querySelector('[data-chorlove-field="day"]')?.closest(".flex.flex-col.items-center.gap-4");
    hide(dateBlock, !hasDate);
    const dateSection = root.querySelector('[data-chorlove-field="eventTime"]')?.closest("section");
    if (dateSection) dateSection.hidden = !hasDate;
  }

  function renderCalendar(data) {
    const start = data.dateTime ? new Date(data.dateTime) : null;
    if (!start || !Number.isFinite(start.getTime())) return;
    const cells = root.querySelectorAll("[data-chorlove-calendar-cell]");
    if (!cells.length) return;
    const grid = cells[0].parentElement;
    const allCells = [...grid.children];
    const dayTemplate = allCells.find((cell) => cell.querySelector("[data-chorlove-calendar-number]"));
    const blankTemplate = allCells.find((cell) => !cell.querySelector("[data-chorlove-calendar-number]")) || dayTemplate;
    if (!dayTemplate) return;
    const year = Number(data.date.year);
    const monthIndex = Number(data.date.monthNumber) - 1;
    if (!Number.isInteger(year) || monthIndex < 0 || monthIndex > 11) return;
    const offset = (new Date(Date.UTC(year, monthIndex, 1)).getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const count = Math.ceil((offset + days) / 7) * 7;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < count; index += 1) {
      const day = index - offset + 1;
      const cell = (day < 1 || day > days ? blankTemplate : dayTemplate).cloneNode(true);
      cell.removeAttribute("data-chorlove-calendar-cell");
      cell.setAttribute("data-chorlove-calendar-cell", "");
      cell.removeAttribute("data-event-day");
      const number = cell.querySelector("[data-chorlove-calendar-number]");
      if (number) {
        number.textContent = day >= 1 && day <= days ? String(day) : "";
        number.removeAttribute("data-chorlove-calendar-number");
        number.setAttribute("data-chorlove-calendar-number", "");
        if (day === Number(data.date.day)) cell.dataset.eventDay = "true";
      }
      fragment.append(cell);
    }
    grid.replaceChildren(fragment);
    const weekdayGrid = root.querySelector(".grid.grid-cols-7.border-b-2");
    if (weekdayGrid) [...weekdayGrid.children].forEach((node, index) => text(node, localCopy().weekdays[index]));
  }

  function renderProgram(data) {
    const glassRows = root.querySelectorAll("[data-glass-program-row]");
    if (glassRows.length) {
      glassRows.forEach((row, index) => {
        const item = (data.program || [])[index];
        hide(row, !item);
        if (item) { text(row.querySelector("[data-glass-program-time]"), item.time); text(row.querySelector("[data-glass-program-title]"), item.title); }
      });
      hide(glassRows[0].closest("section"), !(data.program || []).length);
      return;
    }
    const first = root.querySelector('[data-chorlove-field="program1Time"]');
    const grid = root.querySelector("[data-chorlove-program-grid]") || first?.parentElement;
    if (!grid) return;
    grid.dataset.chorloveProgramGrid = "";
    const original = [...grid.children];
    const groups = [];
    for (let i = 0; i < original.length; i += 3) groups.push(original.slice(i, i + 3));
    if (!groups.length) return;
    const rows = data.program || [];
    const fragment = document.createDocumentFragment();
    rows.forEach((item, index) => {
      const group = groups[index % groups.length];
      for (const source of group) {
        const cell = source.cloneNode(true);
        const time = cell.querySelector('[data-chorlove-field$="Time"]');
        const title = cell.querySelector('[data-chorlove-field$="Title"]');
        if (time) text(time, item.time);
        if (title) text(title, item.title);
        fragment.append(cell);
      }
    });
    grid.replaceChildren(fragment);
    const section = grid.closest("section");
    hide(section, rows.length === 0);
  }

  function renderStoryAndGallery(data) {
    const storySection = root.querySelector("[data-chorlove-story]");
    if (!storySection) return;
    storySection.querySelectorAll(".cc-story-copy").forEach((node) => node.remove());
    const chapters = data.story || [];
    if (chapters.length) {
      const copyHost = document.createElement("div");
      copyHost.className = "cc-story-copy";
      for (const chapter of chapters) {
        const card = document.createElement("article");
        const title = document.createElement("h3");
        const body = document.createElement("p");
        title.textContent = chapter.title || "";
        body.textContent = chapter.text || "";
        card.append(title, body);
        copyHost.append(card);
      }
      storySection.append(copyHost);
    }
    const gallery = data.gallery || [];
    const usableGallery = gallery.filter((item) => item?.src);
    const initialSlots = [...storySection.querySelectorAll("[data-chorlove-gallery-item]")];
    const cardTemplate = initialSlots[0]?.parentElement;
    const track = cardTemplate?.parentElement;
    if (track && cardTemplate) {
      track.querySelectorAll("[data-cc-gallery-clone]").forEach((node) => node.remove());
      for (let index = initialSlots.length; index < usableGallery.length; index++) {
        const clone = cardTemplate.cloneNode(true);
        clone.dataset.ccGalleryClone = "";
        clone.querySelector("[data-chorlove-gallery-item]")?.removeAttribute("src");
        track.append(clone);
      }
    }
    const slots = [...storySection.querySelectorAll("[data-chorlove-gallery-item]")];
    slots.forEach((image, index) => {
      const item = usableGallery[index];
      if (item?.src) {
        image.src = item.src;
        image.alt = item.alt || item.caption || "";
        image.classList.remove("cc-gallery-empty");
        image.dataset.galleryLightbox = "";
      } else {
        image.removeAttribute("src");
        image.alt = "";
        image.classList.add("cc-gallery-empty");
        image.removeAttribute("data-gallery-lightbox");
      }
      const card = image.parentElement || image;
      hide(card, !item);
      if (item) {
        card.style.display = "block";
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `Gallery photo ${index + 1}`);
        card.onclick = () => {
          if (index === galleryIndex) openGalleryImage(index);
          else setGalleryIndex(index, true);
        };
      } else card.onclick = null;
    });
    galleryIndex = usableGallery.length ? Math.min(galleryIndex, usableGallery.length - 1) : 0;
    renderGalleryCarousel(usableGallery.length, slots);
    const more = storySection.querySelector("[data-chorlove-gallery-more]");
    if (more) {
      const remaining = Math.max(0, usableGallery.length - slots.length);
      text(more, remaining ? `+${remaining}` : "");
      hide(more, remaining === 0);
      more.tabIndex = remaining ? 0 : -1;
      more.setAttribute("role", remaining ? "button" : "presentation");
      more.setAttribute("aria-label", localCopy().galleryMore.replace("{count}", String(remaining)));
    }
    const showGallery = usableGallery.length > 0;
    hide(storySection, !chapters.length && !showGallery);
  }

  function galleryPosition(index, activeIndex, total) {
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    let x = 55 * offset;
    if (offset > 0) x = Math.min(x, 120);
    if (offset < 0) x = Math.max(x, -120);
    const distance = Math.abs(offset);
    return {
      offset,
      transform: `translateX(${x}%) translateZ(${-140 * distance}px) rotateY(${35 * offset}deg) scale(${Math.max(.65, 1 - .15 * distance)})`,
      opacity: offset === 0 ? 1 : distance === 1 ? .75 : distance === 2 ? .45 : 0,
      zIndex: 100 - distance,
    };
  }

  function renderGalleryCarousel(total, suppliedSlots) {
    const section = root.querySelector("[data-chorlove-story]");
    if (!section) return;
    const slots = suppliedSlots || [...section.querySelectorAll("[data-chorlove-gallery-item]")];
    const cards = slots.map((image) => image.parentElement || image);
    cards.forEach((card, index) => {
      const position = galleryPosition(index, galleryIndex, total || cards.length);
      card.style.transform = position.transform;
      card.style.opacity = String(position.opacity);
      card.style.zIndex = String(position.zIndex);
      card.style.display = index < total && position.opacity > 0 ? "block" : "none";
      card.setAttribute("aria-current", String(index === galleryIndex));
      card.tabIndex = index === galleryIndex ? 0 : -1;
    });
    const dots = [...section.querySelectorAll("[data-glass-gallery-dot]")];
    const dotHost = dots[0]?.parentElement;
    if (dotHost && dots.length && total > dots.length) {
      const template = dots[0];
      for (let index = dots.length; index < total; index++) {
        const dot = template.cloneNode(true);
        dot.dataset.glassGalleryDot = String(index + 1);
        dotHost.append(dot);
      }
    }
    [...section.querySelectorAll("[data-glass-gallery-dot]")].forEach((dot, index) => {
      const visible = index < total;
      hide(dot, !visible);
      if (!visible) return;
      dot.setAttribute("aria-label", `Go to photo ${index + 1}`);
      dot.setAttribute("aria-current", String(index === galleryIndex));
      dot.setAttribute("aria-pressed", String(index === galleryIndex));
      dot.onclick = () => setGalleryIndex(index, true);
      dot.classList.toggle("w-6", index === galleryIndex);
      dot.classList.toggle("h-2", index === galleryIndex);
      dot.classList.toggle("w-2", index !== galleryIndex);
      dot.classList.toggle("bg-[rgb(203,93,108)]", index === galleryIndex);
      dot.classList.toggle("bg-[rgb(203,93,108)]/30", index !== galleryIndex);
    });
    section.querySelectorAll("[data-glass-gallery-nav]").forEach((button) => {
      const visible = total > 1;
      hide(button, !visible);
      button.onclick = () => setGalleryIndex((galleryIndex + (button.dataset.glassGalleryNav === "Oldingi" ? -1 : 1) + total) % total, true);
    });
    section.dataset.ccGalleryCount = String(total);
  }

  function setGalleryIndex(index, focusActive) {
    const section = root.querySelector("[data-chorlove-story]");
    const total = Number(section?.dataset.ccGalleryCount || 0);
    if (!total) return;
    galleryIndex = (index + total) % total;
    renderGalleryCarousel(total);
    if (focusActive) section?.querySelectorAll("[data-chorlove-gallery-item]")[galleryIndex]?.parentElement?.focus({ preventScroll: true });
  }

  function openGalleryImage(index) {
    const dialog = root.querySelector(".cc-gallery-lightbox");
    const image = (state?.data?.gallery || []).filter((item) => item?.src)[index];
    if (!dialog || !image?.src) return;
    dialog.dataset.index = String(index);
    updateGalleryLightbox(dialog, true);
  }

  function updateGalleryLightbox(dialog, opening = false) {
    const images = (state?.data?.gallery || []).filter((item) => item?.src);
    if (!images.length) return;
    const index = Math.min(Number(dialog.dataset.index || 0), images.length - 1);
    const image = images[index];
    const img = dialog.querySelector("img");
    img.src = image.src;
    img.alt = image.alt || image.caption || `Gallery photo ${index + 1}`;
    text(dialog.querySelector("[data-cc-gallery-count]"), `${index + 1} / ${images.length}`);
    const hasMany = images.length > 1;
    hide(dialog.querySelector("[data-cc-gallery-prev]"), !hasMany);
    hide(dialog.querySelector("[data-cc-gallery-next]"), !hasMany);
    if (dialog.hidden) {
      dialog.hidden = false;
      const reduced = Boolean(state?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) {
        dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
        img.animate([{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "scale(1)" }], { duration: 200, easing: "ease-out" });
      }
    } else if (opening) {
      const reduced = Boolean(state?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) img.animate([{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "scale(1)" }], { duration: 200, easing: "ease-out" });
    }
  }

  function stepGalleryLightbox(dialog, direction) {
    const images = (state?.data?.gallery || []).filter((item) => item?.src);
    if (images.length < 2) return;
    const image = dialog.querySelector("img");
    const bounds = image.getBoundingClientRect();
    const exiting = image.cloneNode(true);
    exiting.className = "cc-gallery-exiting-image";
    exiting.style.left = `${bounds.left}px`;
    exiting.style.top = `${bounds.top}px`;
    exiting.style.width = `${bounds.width}px`;
    exiting.style.height = `${bounds.height}px`;
    dialog.append(exiting);
    const reduced = Boolean(state?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) exiting.remove();
    else {
      exiting.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.92)" }], { duration: 200, easing: "ease-out" }).finished.then(() => exiting.remove()).catch(() => exiting.remove());
    }
    dialog.dataset.index = String((Number(dialog.dataset.index || 0) + direction + images.length) % images.length);
    updateGalleryLightbox(dialog, true);
  }

  function closeGalleryLightbox(dialog) {
    if (!dialog || dialog.hidden) return;
    const reduced = Boolean(state?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { dialog.hidden = true; return; }
    const animation = dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out" });
    dialog.querySelector("img")?.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.92)" }], { duration: 200, easing: "ease-out" });
    animation.finished.then(() => { dialog.hidden = true; }).catch(() => {});
  }

  function renderContacts(data) {
    const section = root.querySelector("[data-chorlove-contacts]");
    if (!section) return;
    const contacts = data.contacts || [];
    hide(section, contacts.length === 0);
    const links = section.querySelector('[class*="max-w-[432px]"][class*="gap-3.5"]') || document.createElement("div");
    links.className = "mt-6 w-full max-w-[432px] md:max-w-[600px] flex flex-col gap-3.5";
    links.replaceChildren();
    const appendIcon = (host, type, arrow = false) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", arrow ? "18" : "20"); svg.setAttribute("height", arrow ? "18" : "20");
      svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "1.5"); svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("stroke-linejoin", "round");
      if (arrow) {
        const path = document.createElementNS(svg.namespaceURI, "path"); path.setAttribute("d", "M7 17 17 7M7 7h10v10"); svg.append(path);
      } else if (type === "phone") {
        const path = document.createElementNS(svg.namespaceURI, "path"); path.setAttribute("d", "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.63a2 2 0 0 1-.45 2.11L8 9.77a16 16 0 0 0 6 6l1.31-1.29a2 2 0 0 1 2.11-.45c.85.3 1.73.51 2.63.63A2 2 0 0 1 22 16.92Z"); svg.append(path);
      } else if (type === "instagram") {
        const body = document.createElementNS(svg.namespaceURI, "path"); body.setAttribute("d", "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"); svg.append(body);
        const lens = document.createElementNS(svg.namespaceURI, "circle"); lens.setAttribute("cx", "12"); lens.setAttribute("cy", "13"); lens.setAttribute("r", "3"); svg.append(lens);
      } else {
        const path = document.createElementNS(svg.namespaceURI, "path"); path.setAttribute("d", "m22 2-7 20-4-9-9-4Z"); svg.append(path);
        const line = document.createElementNS(svg.namespaceURI, "path"); line.setAttribute("d", "M22 2 11 13"); svg.append(line);
      }
      host.append(svg);
    };
    for (const [index, contact] of contacts.entries()) {
      const a = document.createElement("a");
      a.href = contact.href;
      if (/^https?:/i.test(contact.href || "")) { a.target = "_blank"; a.rel = "noreferrer"; }
      a.className = "group flex items-center gap-4 md:gap-5 rounded-3xl border border-white/40 bg-white/30 p-4 md:p-5 backdrop-blur-md shadow-sm transition-all hover:border-[rgb(203,93,108)]/50 text-left";
      a.style.opacity = "0"; a.style.transform = "translateY(20px)"; a.dataset.gpSourceContact = String(index);
      const icon = document.createElement("span");
      icon.className = "flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-[rgb(203,93,108)] transition-colors group-hover:bg-[rgb(203,93,108)] group-hover:text-white shadow-sm";
      appendIcon(icon, contact.type);
      const details = document.createElement("div"); details.className = "min-w-0 flex-1";
      const label = document.createElement("p"); label.className = "tracking-[0.2em] uppercase text-[10px] md:text-xs text-[rgb(203,93,108)] font-semibold"; label.style.fontFamily = '"Cormorant Garamond", serif'; text(label, contact.label);
      const value = document.createElement("p"); value.className = "mt-0.5 truncate text-sm md:text-base font-bold text-[rgb(147,56,69)]"; value.style.fontFamily = '"Cormorant Garamond", serif'; text(value, contact.value);
      const note = document.createElement("p"); note.className = "mt-0.5 truncate text-xs md:text-sm text-[rgb(147,56,69)]/75 italic"; note.style.fontFamily = '"Cormorant Garamond", serif'; text(note, contactNotes[state?.locale]?.[contact.type] || contactNotes.en[contact.type] || "");
      details.append(label, value, note);
      const arrow = document.createElement("span"); arrow.className = "shrink-0 text-[rgb(203,93,108)]/70 transition-transform group-hover:text-[rgb(203,93,108)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"; appendIcon(arrow, contact.type, true);
      a.append(icon, details, arrow);
      links.append(a);
    }
    if (!links.isConnected) section.querySelector(":scope > div")?.append(links);
  }

  async function renderWishes(data) {
    const section = root.querySelector("[data-chorlove-wishes]");
    if (!section) return;
    const list = section.querySelector("[data-chorlove-wish-list]") || document.createElement("div");
    list.dataset.chorloveWishList = "";
    list.className = "mt-8 w-full max-w-[432px] md:max-w-[600px] max-h-[460px] space-y-3 overflow-y-auto pr-1";
    if (!list.isConnected) section.append(list);
    const form = section.querySelector("form");
    const magicButton = form?.querySelector('button[type="button"]');
    if (magicButton) {
      magicButton.hidden = false;
      magicButton.tabIndex = 0;
      magicButton.type = "button";
      magicButton.onclick = () => {
        const textarea = form?.querySelector("textarea");
        if (!textarea) return;
        const suggestion = sourceWishSuggestions[Math.floor(Math.random() * sourceWishSuggestions.length)];
        textarea.value = suggestion;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      };
    }
    if (form) form.dataset.chorloveWishForm = "";
    const status = section.querySelector(".cc-status") || document.createElement("p");
    status.className = "cc-status";
    if (!status.isConnected) section.append(status);
    hide(section, !data.wishesEnabled);
    if (!data.wishesEnabled) return;
    const wishes = state.preview
      ? (data.wishes || []).map((wish) => ({ name: wish.name, message: wish.text, createdAt: wish.submittedAt || wish.createdAt }))
      : await fetch(`${state.apiBase}/wishes`, { cache: "no-store" })
          .then((response) => response.ok ? response.json() : { wishes: [] })
          .then((body) => (body.wishes || []).map((wish) => ({ ...wish, createdAt: wish.submittedAt || wish.createdAt })))
          .catch(() => []);
    list.replaceChildren();
    for (const [index, wish] of wishes.entries()) {
      const card = document.createElement("article");
      card.className = "rounded-2xl border border-white/40 bg-white/30 p-4 md:p-5 backdrop-blur-md text-left shadow-sm transition-all hover:scale-[1.01]";
      card.style.opacity = "0"; card.style.transform = "translateY(15px)"; card.dataset.gpSourceWishCard = String(index);
      const header = document.createElement("div");
      header.className = "flex items-start justify-between";
      const name = document.createElement("span");
      name.className = "font-semibold text-[15px] md:text-[17px]";
      name.style.color = "rgb(203, 93, 108)";
      name.style.fontFamily = '"Cormorant Garamond", serif';
      name.textContent = wish.name;
      const date = document.createElement("span");
      date.className = "text-xs text-[rgb(147,56,69)]/70";
      date.textContent = typeof wish.createdAt === "string" ? wish.createdAt.split("T")[0] : "";
      header.append(name, date);
      const message = document.createElement("p");
      message.className = "mt-2 text-sm md:text-base leading-relaxed text-[rgb(147,56,69)]";
      message.style.fontFamily = '"Cormorant Garamond", serif';
      message.textContent = wish.message;
      card.append(header, message);
      list.append(card);
    }
    restoreCapturedMotion();
    if (form) {
      const submit = form.querySelector('button[type="submit"]');
      if (submit) text(submit, localCopy().sendWish);
      const name = form.querySelector("input");
      const message = form.querySelector("textarea");
      if (name) { name.value = state.guestName || ""; name.placeholder = `${localCopy().name}*`; name.setAttribute("aria-label", localCopy().name); name.autocomplete = "name"; }
      if (message) message.placeholder = `${localCopy().wish}*`;
      form.onsubmit = async (event) => {
        event.preventDefault();
        if (state.preview) { text(status, localCopy().previewOnly); return; }
        const button = form.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        try {
          const response = await fetch(`${state.apiBase}/wishes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.value, message: message.value, guestToken: state.guestToken || undefined }),
          });
          if (!response.ok) throw new Error("wish submission failed");
          form.reset();
          text(status, localCopy().wishSent);
        } catch { text(status, localCopy().failure); }
        finally { if (button) button.disabled = false; }
      };
    }
  }

  function renderRsvp(data) {
    const section = root.querySelector("[data-chorlove-rsvp-section]");
    if (!section) return;
    hide(section, !data.rsvp?.enabled);
    if (!data.rsvp?.enabled) return;
    const form = section.querySelector("form");
    const name = form?.querySelector("input");
    const submit = section.querySelector("[data-chorlove-submit-rsvp]");
    const responseGroup = section.querySelector('[role="radiogroup"]');
    if (responseGroup) responseGroup.setAttribute("aria-label", localCopy().responseLabel);
    const status = section.querySelector(".cc-status") || document.createElement("p");
    status.className = "cc-status";
    if (!status.isConnected) section.append(status);
    if (name) { name.value = state.guestName || ""; name.placeholder = `${localCopy().name}*`; name.setAttribute("aria-label", localCopy().name); name.autocomplete = "name"; }
    for (const button of section.querySelectorAll("button[data-chorlove-rsvp]")) {
      text(button, button.dataset.chorloveRsvp === "yes" ? localCopy().rsvpYes : localCopy().rsvpNo);
      button.setAttribute("aria-pressed", button.dataset.selected === "true" ? "true" : "false");
      button.onclick = () => {
        section.querySelectorAll("button[data-chorlove-rsvp]").forEach((candidate) => {
          candidate.dataset.selected = String(candidate === button);
          candidate.setAttribute("aria-pressed", String(candidate === button));
        });
      };
    }
    form?.querySelectorAll(".cc-party-size, [name='partySize']").forEach((control) => control.remove());
    if (submit) text(submit, localCopy().submit);
    if (form) form.onsubmit = async (event) => {
      event.preventDefault();
      if (state.preview) { text(status, localCopy().previewOnly); return; }
      const selected = section.querySelector('[data-chorlove-rsvp][data-selected="true"]');
      if (!selected) { text(status, localCopy().failure); return; }
      if (submit) submit.disabled = true;
      try {
        const response = await fetch(`${state.apiBase}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name?.value || state.guestName || "Guest", status: selected.dataset.chorloveRsvp, partySize: selected.dataset.chorloveRsvp === "yes" ? 1 : 0, guestToken: state.guestToken || undefined }),
        });
        if (!response.ok) throw new Error("rsvp submission failed");
        text(status, localCopy().rsvpSent);
      } catch { text(status, localCopy().failure); }
      finally { if (submit) submit.disabled = false; }
    };
  }

  function renderGift(data) {
    const section = root.querySelector("[data-chorlove-gift]");
    if (!section) return;
    hide(section, !data.toyona?.enabled);
    const reduced = Boolean(state?.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const floaters = [
      ["saraya_gold.webp", -6, -22, -18, 3.2, 0],
      ["baroque_gold.webp", -7, 20, 24, 3.6, 300],
      ["elegant_leaf_green.webp", -5, -18, -14, 2.9, 600],
      ["dragon_phoenix_v3.webp", -6, 14, 18, 3.4, 200],
      ["silk_flora_brown.webp", -5, 8, 12, 3.1, 400],
      ["porcelain_blue.webp", -6, -10, -6, 3.5, 700],
      ["dragon_phoenix.webp", -5, -14, -10, 3.3, 100],
    ];
    for (const [file, lift, fromRotation, toRotation, seconds, delay] of floaters) {
      const image = section.querySelector(`img[src*="${file}"]`);
      if (!image) continue;
      const current = giftAnimations.get(image);
      if (!data.toyona?.enabled || reduced) {
        current?.cancel();
        giftAnimations.delete(image);
      } else if (!current) {
        const animation = image.animate(
          [
            { transform: `translateY(0px) rotate(${fromRotation}deg)` },
            { transform: `translateY(${lift}px) rotate(${toRotation}deg)` },
            { transform: `translateY(0px) rotate(${fromRotation}deg)` },
          ],
          { duration: seconds * 1000, delay, iterations: Infinity, easing: "ease-in-out" },
        );
        giftAnimations.set(image, animation);
      }
    }
    if (!data.toyona?.enabled) return;
    let details = section.querySelector(".cc-gift-details");
    if (!details) {
      details = document.createElement("div");
      details.className = "cc-gift-details";
      const label = document.createElement("p"); label.textContent = localCopy().giftNumber;
      const number = document.createElement("strong"); number.dataset.giftNumber = "";
      const holder = document.createElement("p"); holder.dataset.giftHolder = "";
      const note = document.createElement("p"); note.dataset.giftNote = "";
      details.append(label, number, holder, note);
      section.append(details);
    }
    text(details.querySelector("[data-gift-number]"), data.toyona.cardNumber);
    text(details.querySelector("[data-gift-holder]"), data.toyona.cardHolder ? `${localCopy().giftHolder}: ${data.toyona.cardHolder}` : "");
    text(details.querySelector("[data-gift-note]"), data.toyona.note);
    const hint = section.querySelector('[data-chorlove-i18n="giftOpenHint"]');
    const card = hint?.closest(".cursor-pointer") || hint?.parentElement;
    if (card) {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", localCopy().giftOpenHint);
      card.onclick = () => { details.dataset.open = details.dataset.open !== "true"; };
      card.onkeydown = (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); card.click(); } };
    }
  }

  function renderVenue(data) {
    const section = root.querySelector('[data-chorlove-field="venueName"]')?.closest("section");
    if (!section) return;
    const venue = data.venue || {};
    const present = Boolean(venue.name || venue.address);
    hide(section, !present);
    if (!present) return;
    let map = section.querySelector(".cc-map-link");
    const href = venue.mapUrl || (venue.lat != null && venue.lng != null ? `https://maps.google.com/?q=${venue.lat},${venue.lng}` : "");
    if (href) {
      if (!map) { map = document.createElement("a"); map.className = "cc-map-link inline-flex items-center justify-center mt-4 rounded-full border px-5 py-2 text-sm"; section.append(map); }
      map.href = href; map.target = "_blank"; map.rel = "noreferrer"; text(map, localCopy().map);
    } else if (map) map.remove();
  }

  function renderCalendarLink(data) {
    const link = root.querySelector("[data-chorlove-calendar]");
    const start = data.dateTime ? new Date(data.dateTime) : null;
    if (!link || !start || !Number.isFinite(start.getTime())) return;
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const location = [data.venue?.name, data.venue?.address].filter(Boolean).join(", ");
    const url = new URL("https://calendar.google.com/calendar/render");
    url.search = new URLSearchParams({ action: "TEMPLATE", text: [data.groom, data.bride].filter(Boolean).join(" & "), dates: `${stamp(start)}/${stamp(end)}`, location }).toString();
    link.href = url.toString();
    link.target = "_blank";
    link.rel = "noreferrer";
  }

  function renderCountdown(data) {
    window.clearInterval(countdownTimer);
    const heading = root.querySelector('[data-chorlove-i18n="countdownTitle"]');
    const holder = heading?.parentElement?.parentElement;
    const start = data.dateTime ? new Date(data.dateTime).getTime() : 0;
    const update = () => {
      const remaining = Math.max(0, start - Date.now());
      const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
      const nodes = holder?.querySelectorAll("[data-countdown-value]") || [];
      values.forEach((value, index) => { if (nodes[index]) text(nodes[index], value); });
    };
    const values = holder ? [...holder.querySelectorAll("span")].filter((node) => node.classList.contains("text-xl") && node.classList.contains("font-bold") && /^\d+$/.test(node.textContent.trim())) : [];
    values.slice(0, 4).forEach((node) => node.setAttribute("data-countdown-value", ""));
    if (start) { update(); countdownTimer = window.setInterval(update, 1000); }
  }

  function renderMusic(payload) {
    let audio = root.querySelector("audio[data-chorlove-audio]");
    if (!audio) { audio = document.createElement("audio"); audio.loop = true; audio.preload = "metadata"; audio.dataset.chorloveAudio = ""; root.append(audio); }
    const source = payload.data.music?.url || "";
    if (audio.getAttribute("src") !== source) audio.src = source;
    const toggle = root.querySelector('[aria-label="Toggle music"]') || document.createElement("button");
    toggle.className = "cc-music-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", payload.locale === "en" ? "Toggle music" : payload.locale === "ru" ? "Включить или выключить музыку" : "Musiqani yoqish yoki o‘chirish");
    toggle.textContent = audio.paused ? "♫" : "Ⅱ";
    hide(toggle, !audio.src);
    if (!toggle.isConnected) root.append(toggle);
    toggle.onclick = async () => {
      if (audio.paused) { try { await audio.play(); toggle.textContent = "Ⅱ"; } catch { toggle.setAttribute("aria-label", "Music unavailable"); } }
      else { audio.pause(); toggle.textContent = "♫"; }
    };
    if (payload.silentPlayback) { audio.pause(); audio.muted = true; }
    else audio.muted = false;
    if (!payload.preview) audio.volume = 0.35;
    if (payload.reducedMotion) document.documentElement.classList.add("cc-reduced-motion");
    else document.documentElement.classList.remove("cc-reduced-motion");
  }

  function renderLanguages(payload) {
    let picker = root.querySelector(".cc-language-picker");
    if (!picker) { picker = document.createElement("nav"); picker.className = "cc-language-picker"; root.append(picker); }
    picker.setAttribute("aria-label", localCopy().languageLabel);
    picker.replaceChildren();
    const available = payload.enabledLocales?.length ? payload.enabledLocales : locales;
    for (const locale of available) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = ({ "uz-Latn": "Uz", "uz-Cyrl": "Ўз", en: "En", ru: "Ru" })[locale] || locale;
      button.setAttribute("aria-pressed", String(payload.locale === locale));
      button.onclick = () => parent.postMessage({ type: `${templateId}:language`, locale }, location.origin);
      picker.append(button);
    }
  }

  function ensureGalleryLightbox() {
    let dialog = root.querySelector(".cc-gallery-lightbox");
    if (!dialog) {
      dialog = document.createElement("div"); dialog.className = "cc-gallery-lightbox"; dialog.hidden = true; dialog.setAttribute("role", "dialog"); dialog.setAttribute("aria-modal", "true"); dialog.setAttribute("aria-label", "Photo gallery");
      const close = document.createElement("button"); close.type = "button"; close.className = "cc-gallery-close"; close.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>'; close.setAttribute("aria-label", "Close gallery");
      const count = document.createElement("div"); count.className = "cc-gallery-count"; count.dataset.ccGalleryCount = "";
      const previous = document.createElement("button"); previous.type = "button"; previous.className = "cc-gallery-arrow cc-gallery-previous"; previous.dataset.ccGalleryPrev = ""; previous.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>'; previous.setAttribute("aria-label", "Previous image");
      const next = document.createElement("button"); next.type = "button"; next.className = "cc-gallery-arrow cc-gallery-next"; next.dataset.ccGalleryNext = ""; next.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>'; next.setAttribute("aria-label", "Next image");
      const image = document.createElement("img"); image.alt = "";
      close.onclick = () => closeGalleryLightbox(dialog);
      previous.onclick = (event) => { event.stopPropagation(); stepGalleryLightbox(dialog, -1); };
      next.onclick = (event) => { event.stopPropagation(); stepGalleryLightbox(dialog, 1); };
      dialog.onclick = (event) => { if (event.target === dialog) closeGalleryLightbox(dialog); };
      image.onclick = (event) => event.stopPropagation();
      dialog.append(close, count, previous, image, next); root.append(dialog);
      dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") { closeGalleryLightbox(dialog); }
        else if (event.key === "ArrowLeft") stepGalleryLightbox(dialog, -1);
        else if (event.key === "ArrowRight") stepGalleryLightbox(dialog, 1);
      });
    }
    // The source opens the active center card on click; off-center cards move
    // into the center first. The card handlers installed by the carousel keep
    // that distinction intact.
    root.querySelectorAll("[data-chorlove-gallery-more]").forEach((more) => {
      const openNext = () => {
        const images = (state?.data?.gallery || []).filter((item) => item?.src);
        const visibleSlotCount = root.querySelectorAll("[data-chorlove-gallery-item]").length;
        const nextImage = images[visibleSlotCount];
        if (!nextImage?.src) return;
        dialog.querySelector("img").src = nextImage.src;
        dialog.querySelector("img").alt = nextImage.alt || nextImage.caption || "";
        dialog.hidden = false;
      };
      more.onclick = openNext;
      more.onkeydown = (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openNext(); } };
    });
  }

  function render(payload) {
    if (!payload?.data || payload.templateId !== templateId) return;
    state = { ...payload, apiBase: `/api/public/invitations/${encodeURIComponent(payload.invitationId || "")}` };
    sourceOpening(payload);
    animateSourceHero(Boolean(payload.reducedMotion) || matchMedia("(prefers-reduced-motion: reduce)").matches);
    document.documentElement.lang = payload.locale || "uz-Latn";
    setVisibleFields(payload.data);
    renderCalendar(payload.data);
    renderProgram(payload.data);
    renderStoryAndGallery(payload.data);
    renderContacts(payload.data);
    renderRsvp(payload.data);
    renderGift(payload.data);
    renderVenue(payload.data);
    renderCalendarLink(payload.data);
    renderCountdown(payload.data);
    renderMusic(payload);
    renderLanguages(payload);
    ensureGalleryLightbox();
    renderWishes(payload.data);
    restoreCapturedMotion();
  }

  root.querySelectorAll("[data-chorlove-open]").forEach((button) => {
    // Glass Pink has its own source-timed opener. Hiding it here would skip
    // the 450 ms pause, envelope exit, flower burst, and overlay fade.
    if (templateId === "glass-pink") return;
    button.addEventListener("click", () => {
      const panel = button.closest(".fixed") || button.parentElement?.parentElement;
      if (panel) panel.hidden = true;
      window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      const audio = root.querySelector("audio[data-chorlove-audio]");
      if (audio && state?.data.music?.url && !state.silentPlayback) audio.play().catch(() => {});
    });
  });

  const initial = (() => { try { return JSON.parse(window.name); } catch { return null; } })();
  restoreCapturedMotion();
  if (initial?.type === `${templateId}:update`) render(initial.payload);
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.data?.type !== `${templateId}:update`) return;
    render(event.data.payload);
  });
})();
